import { StateInfo } from '../types/invoice';

export const INDIAN_STATES: StateInfo[] = [
  { code: '01', name: 'Jammu and Kashmir', tin: '01' },
  { code: '02', name: 'Himachal Pradesh', tin: '02' },
  { code: '03', name: 'Punjab', tin: '03' },
  { code: '04', name: 'Chandigarh', tin: '04' },
  { code: '05', name: 'Uttarakhand', tin: '05' },
  { code: '06', name: 'Haryana', tin: '06' },
  { code: '07', name: 'Delhi', tin: '07' },
  { code: '08', name: 'Rajasthan', tin: '08' },
  { code: '09', name: 'Uttar Pradesh', tin: '09' },
  { code: '10', name: 'Bihar', tin: '10' },
  { code: '11', name: 'Sikkim', tin: '11' },
  { code: '12', name: 'Arunachal Pradesh', tin: '12' },
  { code: '13', name: 'Nagaland', tin: '13' },
  { code: '14', name: 'Manipur', tin: '14' },
  { code: '15', name: 'Mizoram', tin: '15' },
  { code: '16', name: 'Tripura', tin: '16' },
  { code: '17', name: 'Meghalaya', tin: '17' },
  { code: '18', name: 'Assam', tin: '18' },
  { code: '19', name: 'West Bengal', tin: '19' },
  { code: '20', name: 'Jharkhand', tin: '20' },
  { code: '21', name: 'Odisha', tin: '21' },
  { code: '22', name: 'Chhattisgarh', tin: '22' },
  { code: '23', name: 'Madhya Pradesh', tin: '23' },
  { code: '24', name: 'Gujarat', tin: '24' },
  { code: '26', name: 'Dadra and Nagar Haveli and Daman and Diu', tin: '26' },
  { code: '27', name: 'Maharashtra', tin: '27' },
  { code: '28', name: 'Andhra Pradesh (Old)', tin: '28' },
  { code: '29', name: 'Karnataka', tin: '29' },
  { code: '30', name: 'Goa', tin: '30' },
  { code: '31', name: 'Lakshadweep', tin: '31' },
  { code: '32', name: 'Kerala', tin: '32' },
  { code: '33', name: 'Tamil Nadu', tin: '33' },
  { code: '34', name: 'Puducherry', tin: '34' },
  { code: '35', name: 'Andaman and Nicobar Islands', tin: '35' },
  { code: '36', name: 'Telangana', tin: '36' },
  { code: '37', name: 'Andhra Pradesh', tin: '37' },
  { code: '38', name: 'Ladakh', tin: '38' },
  { code: '97', name: 'Other Territory', tin: '97' },
  { code: '96', name: 'Other Country / Export', tin: '96' },
];

export const GST_RATES: number[] = [0, 0.25, 3, 5, 12, 18, 28];

export const COMMON_UNITS = [
  { code: 'PCS', label: 'Pieces (PCS)' },
  { code: 'NOS', label: 'Numbers (NOS)' },
  { code: 'BOX', label: 'Box (BOX)' },
  { code: 'KGS', label: 'Kilograms (KGS)' },
  { code: 'MTR', label: 'Meters (MTR)' },
  { code: 'SET', label: 'Set (SET)' },
  { code: 'HRS', label: 'Hours (HRS)' },
  { code: 'DAYS', label: 'Days (DAYS)' },
  { code: 'PAC', label: 'Packs (PAC)' },
  { code: 'BAG', label: 'Bags (BAG)' },
  { code: 'LTR', label: 'Litres (LTR)' },
  { code: 'QTL', label: 'Quintal (QTL)' },
  { code: 'OTH', label: 'Others (OTH)' },
];

export const POPULAR_HSN_SAC = [
  { code: '998314', desc: 'IT Design & Development Services', type: 'SAC' },
  { code: '998313', desc: 'IT Infrastructure & Network Management', type: 'SAC' },
  { code: '998311', desc: 'Management & Business Consulting', type: 'SAC' },
  { code: '998211', desc: 'Legal Advisory & Representation', type: 'SAC' },
  { code: '998719', desc: 'Maintenance & Repair Services', type: 'SAC' },
  { code: '995411', desc: 'General Construction Services', type: 'SAC' },
  { code: '847130', desc: 'Laptops, Tablets & Portable Computers', type: 'HSN' },
  { code: '851713', desc: 'Smartphones & Mobile Handsets', type: 'HSN' },
  { code: '482010', desc: 'Registers, Notebooks & Stationery', type: 'HSN' },
  { code: '610910', desc: 'Cotton T-Shirts & Apparel', type: 'HSN' },
  { code: '850440', desc: 'Power Adapters & Inverters', type: 'HSN' },
  { code: '900410', desc: 'Eyewear & Optical Products', type: 'HSN' },
];

export const DEFAULT_TERMS = [
  'Payment is due within the stipulated credit period from the invoice date.',
  'Interest @ 18% per annum will be charged on all delayed payments.',
  'Goods once sold will not be taken back or exchanged unless found defective on delivery.',
  'Subject to local jurisdiction for any legal disputes.',
  'This is a computer-generated tax invoice and is valid with authorized digital signature.',
];

export function getStateByCode(code: string): StateInfo | undefined {
  if (!code) return undefined;
  const normalized = code.trim().padStart(2, '0');
  return INDIAN_STATES.find((s) => s.code === normalized);
}

export function getStateByName(name: string): StateInfo | undefined {
  if (!name) return undefined;
  const lower = name.trim().toLowerCase();
  return INDIAN_STATES.find((s) => s.name.toLowerCase() === lower);
}

/**
 * Extracts 2-digit state code from GSTIN (first 2 digits)
 */
export function extractStateFromGstin(gstin: string): StateInfo | undefined {
  if (!gstin || gstin.trim().length < 2) return undefined;
  const code = gstin.trim().substring(0, 2);
  return getStateByCode(code);
}
