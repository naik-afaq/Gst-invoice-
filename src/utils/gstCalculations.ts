import {
  AdditionalCharge,
  CalculatedItem,
  CalculationSummary,
  HsnSummaryItem,
  InvoiceItem,
  StateInfo,
} from '../types/invoice';
import { getStateByCode } from '../data/indianStates';

/**
 * Decimal safe rounding to 2 decimal places
 */
export function roundTo2(num: number): number {
  if (isNaN(num) || !isFinite(num)) return 0;
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

/**
 * Format number to Indian Currency style (e.g. ₹ 1,23,456.78)
 */
export function formatIndianCurrency(amount: number, showSymbol = true): string {
  if (isNaN(amount) || !isFinite(amount)) return showSymbol ? '₹ 0.00' : '0.00';
  
  const isNegative = amount < 0;
  const absVal = Math.abs(amount);
  const parts = absVal.toFixed(2).split('.');
  let integerPart = parts[0];
  const decimalPart = parts[1];

  // Indian numbering grouping: last 3 digits, then groups of 2
  if (integerPart.length > 3) {
    const lastThree = integerPart.substring(integerPart.length - 3);
    const otherDigits = integerPart.substring(0, integerPart.length - 3);
    const formattedOther = otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
    integerPart = formattedOther + ',' + lastThree;
  }

  const sign = isNegative ? '-' : '';
  const prefix = showSymbol ? '₹ ' : '';
  return `${sign}${prefix}${integerPart}.${decimalPart}`;
}

/**
 * Validate Indian GSTIN format
 * Structure: 2 digits (State Code) + 10 chars (PAN) + 1 char (Entity number) + 'Z' + 1 char (Checksum)
 */
export function validateGSTIN(gstin: string): {
  isValid: boolean;
  message: string;
  state?: StateInfo;
  pan?: string;
} {
  if (!gstin || !gstin.trim()) {
    return {
      isValid: false,
      message: 'GSTIN is required for registered taxable persons.',
    };
  }

  const cleanGstin = gstin.trim().toUpperCase();
  if (cleanGstin.length !== 15) {
    return {
      isValid: false,
      message: `GSTIN must be exactly 15 characters (currently ${cleanGstin.length}).`,
    };
  }

  const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  if (!gstinRegex.test(cleanGstin)) {
    return {
      isValid: false,
      message: 'Invalid GSTIN structure. Expected format: 22AAAAA0000A1Z5.',
    };
  }

  const stateCode = cleanGstin.substring(0, 2);
  const state = getStateByCode(stateCode);
  if (!state) {
    return {
      isValid: false,
      message: `Invalid state code '${stateCode}' in GSTIN.`,
    };
  }

  const pan = cleanGstin.substring(2, 12);
  return {
    isValid: true,
    message: `Valid GSTIN (${state.name})`,
    state,
    pan,
  };
}

/**
 * Check if the transaction is Intra-State (CGST + SGST) or Inter-State (IGST)
 * Rule: If Supplier State Code == Place of Supply Code -> Intra-State
 * Special case: Code 96 (Export / Outside India) is always Inter-State (IGST / Zero-rated)
 */
export function isIntraStateTransaction(
  supplierStateCode: string,
  placeOfSupplyCode: string
): boolean {
  if (!supplierStateCode || !placeOfSupplyCode) return true; // default intra
  if (placeOfSupplyCode === '96') return false; // Export
  return supplierStateCode.trim().padStart(2, '0') === placeOfSupplyCode.trim().padStart(2, '0');
}

/**
 * Calculate line item tax and totals
 */
export function calculateItemTax(
  item: InvoiceItem,
  isIntraState: boolean
): CalculatedItem {
  const qty = Math.max(0, Number(item.quantity) || 0);
  const price = Math.max(0, Number(item.pricePerUnit) || 0);
  const grossAmount = roundTo2(qty * price);

  let discountAmount = 0;
  if (item.discountType === 'percent') {
    const pct = Math.min(100, Math.max(0, Number(item.discountValue) || 0));
    discountAmount = roundTo2((grossAmount * pct) / 100);
  } else {
    discountAmount = roundTo2(Math.min(grossAmount, Math.max(0, Number(item.discountValue) || 0)));
  }

  const taxableValue = roundTo2(Math.max(0, grossAmount - discountAmount));
  const rate = Math.max(0, Number(item.gstRate) || 0);

  let cgstRate = 0;
  let cgstAmount = 0;
  let sgstRate = 0;
  let sgstAmount = 0;
  let igstRate = 0;
  let igstAmount = 0;

  if (isIntraState) {
    cgstRate = rate / 2;
    sgstRate = rate / 2;
    cgstAmount = roundTo2((taxableValue * cgstRate) / 100);
    sgstAmount = roundTo2((taxableValue * sgstRate) / 100);
  } else {
    igstRate = rate;
    igstAmount = roundTo2((taxableValue * igstRate) / 100);
  }

  const totalTax = roundTo2(cgstAmount + sgstAmount + igstAmount);
  const totalAmount = roundTo2(taxableValue + totalTax);

  return {
    ...item,
    quantity: qty,
    pricePerUnit: price,
    grossAmount,
    discountAmount,
    taxableValue,
    cgstRate,
    cgstAmount,
    sgstRate,
    sgstAmount,
    igstRate,
    igstAmount,
    totalTax,
    totalAmount,
  };
}

/**
 * Compute full invoice summary including tax slabs, round off, and HSN summary
 */
export function calculateInvoiceSummary(
  items: InvoiceItem[],
  additionalCharges: AdditionalCharge[],
  supplierStateCode: string,
  placeOfSupplyCode: string,
  autoRoundOff = true
): { calculatedItems: CalculatedItem[]; summary: CalculationSummary } {
  const isIntraState = isIntraStateTransaction(supplierStateCode, placeOfSupplyCode);

  const calculatedItems = items.map((item) => calculateItemTax(item, isIntraState));

  let subtotal = 0;
  let totalDiscount = 0;
  let taxableAmount = 0;
  let totalCgst = 0;
  let totalSgst = 0;
  let totalIgst = 0;

  calculatedItems.forEach((ci) => {
    subtotal += ci.grossAmount;
    totalDiscount += ci.discountAmount;
    taxableAmount += ci.taxableValue;
    totalCgst += ci.cgstAmount;
    totalSgst += ci.sgstAmount;
    totalIgst += ci.igstAmount;
  });

  // Calculate additional charges tax
  let additionalChargesTotal = 0;
  let additionalChargesTax = 0;

  additionalCharges.forEach((charge) => {
    const amt = Math.max(0, Number(charge.amount) || 0);
    const rate = Math.max(0, Number(charge.gstRate) || 0);
    additionalChargesTotal += amt;

    const chargeTax = roundTo2((amt * rate) / 100);
    additionalChargesTax += chargeTax;

    if (isIntraState) {
      totalCgst += roundTo2(chargeTax / 2);
      totalSgst += roundTo2(chargeTax / 2);
    } else {
      totalIgst += chargeTax;
    }
  });

  subtotal = roundTo2(subtotal);
  totalDiscount = roundTo2(totalDiscount);
  taxableAmount = roundTo2(taxableAmount + additionalChargesTotal);
  totalCgst = roundTo2(totalCgst);
  totalSgst = roundTo2(totalSgst);
  totalIgst = roundTo2(totalIgst);

  const totalTax = roundTo2(totalCgst + totalSgst + totalIgst);
  const rawTotal = roundTo2(taxableAmount + totalTax);

  let roundOff = 0;
  let grandTotal = rawTotal;

  if (autoRoundOff) {
    grandTotal = Math.round(rawTotal);
    roundOff = roundTo2(grandTotal - rawTotal);
  }

  // Generate HSN / SAC Summary Table (Rule 46 compliance)
  const hsnMap = new Map<string, HsnSummaryItem>();

  calculatedItems.forEach((ci) => {
    const key = `${ci.hsnSac || 'OTHER'}_${ci.gstRate}`;
    if (!hsnMap.has(key)) {
      hsnMap.set(key, {
        hsnSac: ci.hsnSac || 'N/A',
        taxableValue: 0,
        gstRate: ci.gstRate,
        cgstAmount: 0,
        sgstAmount: 0,
        igstAmount: 0,
        totalTax: 0,
      });
    }
    const curr = hsnMap.get(key)!;
    curr.taxableValue = roundTo2(curr.taxableValue + ci.taxableValue);
    curr.cgstAmount = roundTo2(curr.cgstAmount + ci.cgstAmount);
    curr.sgstAmount = roundTo2(curr.sgstAmount + ci.sgstAmount);
    curr.igstAmount = roundTo2(curr.igstAmount + ci.igstAmount);
    curr.totalTax = roundTo2(curr.totalTax + ci.totalTax);
  });

  const hsnSummary = Array.from(hsnMap.values());
  const amountInWords = numberToIndianWords(grandTotal);

  return {
    calculatedItems,
    summary: {
      isIntraState,
      subtotal,
      totalDiscount,
      taxableAmount,
      totalCgst,
      totalSgst,
      totalIgst,
      totalTax,
      additionalChargesTotal,
      additionalChargesTax,
      rawTotal,
      roundOff,
      grandTotal,
      amountInWords,
      hsnSummary,
    },
  };
}

/**
 * Converts numbers into words following Indian numbering system (Lakhs & Crores)
 * e.g. 154250.50 => "INR One Lakh Fifty-Four Thousand Two Hundred Fifty and Fifty Paise Only"
 */
export function numberToIndianWords(num: number): string {
  if (isNaN(num) || num === 0) return 'INR Zero Only';

  const singleDigits = [
    '',
    'One',
    'Two',
    'Three',
    'Four',
    'Five',
    'Six',
    'Seven',
    'Eight',
    'Nine',
  ];
  const teens = [
    'Ten',
    'Eleven',
    'Twelve',
    'Thirteen',
    'Fourteen',
    'Fifteen',
    'Sixteen',
    'Seventeen',
    'Eighteen',
    'Nineteen',
  ];
  const tens = [
    '',
    '',
    'Twenty',
    'Thirty',
    'Forty',
    'Fifty',
    'Sixty',
    'Seventy',
    'Eighty',
    'Ninety',
  ];

  function convertTwoDigits(n: number): string {
    if (n < 10) return singleDigits[n];
    if (n >= 10 && n < 20) return teens[n - 10];
    const ten = Math.floor(n / 10);
    const unit = n % 10;
    return `${tens[ten]}${unit > 0 ? ' ' + singleDigits[unit] : ''}`.trim();
  }

  function convertThreeDigits(n: number): string {
    const hundred = Math.floor(n / 100);
    const rest = n % 100;
    let res = '';
    if (hundred > 0) {
      res += `${singleDigits[hundred]} Hundred`;
    }
    if (rest > 0) {
      res += `${res ? ' ' : ''}${convertTwoDigits(rest)}`;
    }
    return res.trim();
  }

  const rounded = roundTo2(Math.abs(num));
  const integerPart = Math.floor(rounded);
  const paisePart = Math.round((rounded - integerPart) * 100);

  let n = integerPart;
  let wordResult = '';

  const crore = Math.floor(n / 10000000);
  n %= 10000000;

  const lakh = Math.floor(n / 100000);
  n %= 100000;

  const thousand = Math.floor(n / 1000);
  n %= 1000;

  const remainder = n;

  if (crore > 0) {
    wordResult += `${convertThreeDigits(crore)} Crore `;
  }
  if (lakh > 0) {
    wordResult += `${convertTwoDigits(lakh)} Lakh `;
  }
  if (thousand > 0) {
    wordResult += `${convertTwoDigits(thousand)} Thousand `;
  }
  if (remainder > 0) {
    wordResult += `${convertThreeDigits(remainder)} `;
  }

  wordResult = wordResult.trim();
  if (!wordResult) {
    wordResult = 'Zero';
  }

  let finalWords = `INR ${wordResult} Rupees`;

  if (paisePart > 0) {
    finalWords += ` and ${convertTwoDigits(paisePart)} Paise`;
  }

  return `${finalWords} Only`;
}
