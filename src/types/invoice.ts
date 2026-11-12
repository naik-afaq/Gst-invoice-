export interface StateInfo {
  code: string;
  name: string;
  tin: string;
}

export type DiscountType = 'percent' | 'flat';

export interface InvoiceItem {
  id: string;
  name: string;
  hsnSac: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  discountType: DiscountType;
  discountValue: number;
  gstRate: number;
  isCustomRate?: boolean;
}

export interface CalculatedItem extends InvoiceItem {
  grossAmount: number;
  discountAmount: number;
  taxableValue: number;
  cgstRate: number;
  cgstAmount: number;
  sgstRate: number;
  sgstAmount: number;
  igstRate: number;
  igstAmount: number;
  totalTax: number;
  totalAmount: number;
}

export interface AdditionalCharge {
  id: string;
  name: string;
  amount: number;
  gstRate: number;
}

export interface BusinessProfile {
  name: string;
  address: string;
  gstin: string;
  state: string;
  stateCode: string;
  email: string;
  phone: string;
  pan?: string;
  logoUrl?: string;
  bankName?: string;
  accountHolder?: string;
  accountNumber?: string;
  ifscCode?: string;
  branch?: string;
  upiId?: string;
}

export interface CustomerDetails {
  name: string;
  billingAddress: string;
  shippingAddress: string;
  sameAsBilling: boolean;
  gstin: string;
  state: string;
  stateCode: string;
  email: string;
  phone: string;
}

export interface InvoiceDetails {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  placeOfSupply: string;
  placeOfSupplyCode: string;
  reverseCharge: boolean;
  poNumber: string;
  paymentTerms: string;
  notes: string;
  termsAndConditions: string[];
  signatoryName: string;
  signatoryDesignation: string;
  signatureUrl?: string;
}

export interface HsnSummaryItem {
  hsnSac: string;
  taxableValue: number;
  gstRate: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  totalTax: number;
}

export interface CalculationSummary {
  isIntraState: boolean;
  subtotal: number;
  totalDiscount: number;
  taxableAmount: number;
  totalCgst: number;
  totalSgst: number;
  totalIgst: number;
  totalTax: number;
  additionalChargesTotal: number;
  additionalChargesTax: number;
  rawTotal: number;
  roundOff: number;
  grandTotal: number;
  amountInWords: string;
  hsnSummary: HsnSummaryItem[];
}

export type InvoiceStatus = 'draft' | 'issued' | 'paid' | 'overdue';

export interface Invoice {
  id: string;
  business: BusinessProfile;
  customer: CustomerDetails;
  details: InvoiceDetails;
  items: InvoiceItem[];
  additionalCharges: AdditionalCharge[];
  autoRoundOff: boolean;
  status: InvoiceStatus;
  createdAt: string;
  updatedAt: string;
}
