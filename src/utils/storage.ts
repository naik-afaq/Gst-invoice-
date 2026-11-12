import { BusinessProfile, Invoice, InvoiceItem } from '../types/invoice';
import { DEFAULT_TERMS } from '../data/indianStates';
import { calculateInvoiceSummary } from './gstCalculations';

const INVOICE_STORAGE_KEY = 'everytool_gst_invoices_v1';
const PROFILE_STORAGE_KEY = 'everytool_gst_business_profile_v1';
const SETTINGS_STORAGE_KEY = 'everytool_gst_settings_v1';

export function getTodayDateString(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

export function getDueDateString(daysFromToday = 15): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromToday);
  return d.toISOString().split('T')[0];
}

/**
 * Default sample profile to demonstrate realistic Indian GST invoice
 */
export const SAMPLE_BUSINESS_PROFILE: BusinessProfile = {
  name: 'Afaq Tech Solutions Private Limited',
  address: 'Suite 402, Pinnacle Business Park, Andheri East, Mumbai, Maharashtra - 400069',
  gstin: '27AABCA1234D1Z5',
  state: 'Maharashtra',
  stateCode: '27',
  email: 'billing@afaqtech.in',
  phone: '+91 98765 43210',
  pan: 'AABCA1234D',
  logoUrl: '',
  bankName: 'HDFC Bank Ltd',
  accountHolder: 'Afaq Tech Solutions Pvt Ltd',
  accountNumber: '50200012345678',
  ifscCode: 'HDFC0001234',
  branch: 'Andheri East, Mumbai',
  upiId: 'afaqtech@okhdfcbank',
};

export const SAMPLE_ITEMS: InvoiceItem[] = [
  {
    id: 'item-1',
    name: 'Enterprise Cloud Architecture & Software Consulting',
    hsnSac: '998314',
    quantity: 1,
    unit: 'SET',
    pricePerUnit: 65000,
    discountType: 'percent',
    discountValue: 5,
    gstRate: 18,
  },
  {
    id: 'item-2',
    name: 'Secure API Integration & GST Compliance Module',
    hsnSac: '998313',
    quantity: 2,
    unit: 'NOS',
    pricePerUnit: 22000,
    discountType: 'flat',
    discountValue: 2000,
    gstRate: 18,
  },
  {
    id: 'item-3',
    name: 'High-Performance Workstation SSD & Hardware Maintenance',
    hsnSac: '847130',
    quantity: 3,
    unit: 'PCS',
    pricePerUnit: 8500,
    discountType: 'percent',
    discountValue: 0,
    gstRate: 18,
  },
];

export function createBlankInvoice(): Invoice {
  const today = getTodayDateString();
  const nextNum = getNextInvoiceNumber();
  const savedProfile = getBusinessProfile();

  const business = savedProfile || {
    name: '',
    address: '',
    gstin: '',
    state: 'Maharashtra',
    stateCode: '27',
    email: '',
    phone: '',
    pan: '',
    logoUrl: '',
    bankName: '',
    accountHolder: '',
    accountNumber: '',
    ifscCode: '',
    branch: '',
    upiId: '',
  };

  return {
    id: 'inv_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    business,
    customer: {
      name: '',
      billingAddress: '',
      shippingAddress: '',
      sameAsBilling: true,
      gstin: '',
      state: 'Maharashtra',
      stateCode: '27',
      email: '',
      phone: '',
    },
    details: {
      invoiceNumber: nextNum,
      invoiceDate: today,
      dueDate: getDueDateString(15),
      placeOfSupply: business.state || 'Maharashtra',
      placeOfSupplyCode: business.stateCode || '27',
      reverseCharge: false,
      poNumber: '',
      paymentTerms: 'Net 15 Days',
      notes: 'Thank you for your business! Please quote invoice number during wire transfer or UPI payments.',
      termsAndConditions: [...DEFAULT_TERMS],
      signatoryName: 'Authorized Signatory',
      signatoryDesignation: 'Director / Manager',
    },
    items: [
      {
        id: 'item-' + Date.now(),
        name: '',
        hsnSac: '998314',
        quantity: 1,
        unit: 'PCS',
        pricePerUnit: 0,
        discountType: 'percent',
        discountValue: 0,
        gstRate: 18,
      },
    ],
    additionalCharges: [],
    autoRoundOff: true,
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function createSampleInvoice(): Invoice {
  const today = getTodayDateString();
  return {
    id: 'inv_' + Date.now(),
    business: { ...SAMPLE_BUSINESS_PROFILE },
    customer: {
      name: 'Apex Global Logistics Pvt Ltd',
      billingAddress: 'Tower B, Cyber City, DLF Phase 2, Gurugram, Haryana - 122002',
      shippingAddress: 'Tower B, Cyber City, DLF Phase 2, Gurugram, Haryana - 122002',
      sameAsBilling: true,
      gstin: '06AAACA9876C1Z3',
      state: 'Haryana',
      stateCode: '06',
      email: 'accounts@apexlogistics.in',
      phone: '+91 91234 56789',
    },
    details: {
      invoiceNumber: 'INV-2026-089',
      invoiceDate: today,
      dueDate: getDueDateString(15),
      placeOfSupply: 'Haryana',
      placeOfSupplyCode: '06',
      reverseCharge: false,
      poNumber: 'PO-APX-4421',
      paymentTerms: 'Net 15 Days',
      notes: 'Thank you for your continued partnership. Please quote invoice number INV-2026-089 in your payment remittance.',
      termsAndConditions: [...DEFAULT_TERMS],
      signatoryName: 'Mohd Afaq',
      signatoryDesignation: 'Managing Director',
    },
    items: [...SAMPLE_ITEMS],
    additionalCharges: [
      {
        id: 'chg-1',
        name: 'Express Secure Delivery & Handling',
        amount: 850,
        gstRate: 18,
      },
    ],
    autoRoundOff: true,
    status: 'issued',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

/* LocalStorage Handlers */

export function getSavedInvoices(): Invoice[] {
  try {
    const raw = localStorage.getItem(INVOICE_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load saved invoices', err);
    return [];
  }
}

export function saveInvoiceToStorage(invoice: Invoice): void {
  try {
    const invoices = getSavedInvoices();
    const index = invoices.findIndex((i) => i.id === invoice.id);
    const updated = { ...invoice, updatedAt: new Date().toISOString() };

    if (index >= 0) {
      invoices[index] = updated;
    } else {
      invoices.unshift(updated);
    }

    localStorage.setItem(INVOICE_STORAGE_KEY, JSON.stringify(invoices));
  } catch (err) {
    console.error('Failed to save invoice', err);
  }
}

export function deleteInvoiceFromStorage(id: string): void {
  try {
    const invoices = getSavedInvoices();
    const filtered = invoices.filter((i) => i.id !== id);
    localStorage.setItem(INVOICE_STORAGE_KEY, JSON.stringify(filtered));
  } catch (err) {
    console.error('Failed to delete invoice', err);
  }
}

export function getBusinessProfile(): BusinessProfile | null {
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load business profile', err);
    return null;
  }
}

export function saveBusinessProfile(profile: BusinessProfile): void {
  try {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  } catch (err) {
    console.error('Failed to save business profile', err);
  }
}

export function getNextInvoiceNumber(): string {
  try {
    const invoices = getSavedInvoices();
    const year = new Date().getFullYear();
    if (invoices.length === 0) {
      return `INV-${year}-001`;
    }

    // Try finding numerical suffix
    let maxNum = 0;
    const regex = /(\d+)$/;
    invoices.forEach((inv) => {
      const match = inv.details.invoiceNumber.match(regex);
      if (match) {
        const val = parseInt(match[1], 10);
        if (!isNaN(val) && val > maxNum) {
          maxNum = val;
        }
      }
    });

    const nextVal = (maxNum + 1).toString().padStart(3, '0');
    return `INV-${year}-${nextVal}`;
  } catch {
    return `INV-${new Date().getFullYear()}-001`;
  }
}

/**
 * Export invoice history as CSV for Excel / Tally / Zoho
 */
export function exportInvoicesToCSV(invoices: Invoice[]): void {
  if (invoices.length === 0) return;

  const headers = [
    'Invoice Number',
    'Invoice Date',
    'Customer Name',
    'Customer GSTIN',
    'Place of Supply',
    'Tax Type',
    'Taxable Value (INR)',
    'CGST (INR)',
    'SGST (INR)',
    'IGST (INR)',
    'Total Tax (INR)',
    'Round Off (INR)',
    'Grand Total (INR)',
    'Status',
  ];

  const rows = invoices.map((inv) => {
    const { summary } = calculateInvoiceSummary(
      inv.items,
      inv.additionalCharges || [],
      inv.business.stateCode,
      inv.details.placeOfSupplyCode,
      inv.autoRoundOff
    );

    return [
      `"${inv.details.invoiceNumber}"`,
      `"${inv.details.invoiceDate}"`,
      `"${(inv.customer.name || '').replace(/"/g, '""')}"`,
      `"${inv.customer.gstin || 'Unregistered'}"`,
      `"${inv.details.placeOfSupply}"`,
      `"${summary.isIntraState ? 'Intra-State (CGST+SGST)' : 'Inter-State (IGST)'}"`,
      summary.taxableAmount.toFixed(2),
      summary.totalCgst.toFixed(2),
      summary.totalSgst.toFixed(2),
      summary.totalIgst.toFixed(2),
      summary.totalTax.toFixed(2),
      summary.roundOff.toFixed(2),
      summary.grandTotal.toFixed(2),
      `"${inv.status.toUpperCase()}"`,
    ].join(',');
  });

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `EveryTool_GST_Invoices_${getTodayDateString()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
