import React, { useState } from 'react';
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  FileCheck2,
  ShieldAlert,
  ArrowRight,
  Calculator,
  FileText,
  Layers,
  Sparkles,
  BookOpen,
  Scale,
  Check,
} from 'lucide-react';
import { AdSlot } from './AdSlot';
import { POPULAR_HSN_SAC } from '../data/indianStates';
import { PolicyTab } from './PolicyModal';

interface SeoAndComplianceSectionProps {
  onOpenPolicy?: (tab: PolicyTab) => void;
}

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: 'What is a GST Tax Invoice and when is it mandatory in India?',
    answer:
      'A GST Tax Invoice is a legal commercial document issued by a GST-registered business to a recipient of goods or services. Under Section 31 of the CGST Act 2017, issuing a tax invoice is mandatory whenever goods or taxable services are supplied. It contains crucial details including GSTIN of both parties, Place of Supply, consecutive invoice number, HSN/SAC codes, itemized values, and applicable tax rates (CGST, SGST, IGST).',
  },
  {
    question: 'How does this tool decide between CGST + SGST versus IGST?',
    answer:
      'GST calculation in India is based on the destination principle (Place of Supply). When the supplier’s registered state code matches the Place of Supply (Intra-State supply), the GST rate is split equally into 50% CGST (Central Goods and Services Tax) and 50% SGST (State Goods and Services Tax). When the supplier’s state differs from the Place of Supply (Inter-State supply or export), the full GST rate is levied as IGST (Integrated Goods and Services Tax). Our calculation engine handles this automatically.',
  },
  {
    question: 'What are the mandatory elements under Rule 46 of the CGST Rules 2017?',
    answer:
      'Rule 46 specifies that every tax invoice must contain: (a) Name, address, and GSTIN of the supplier; (b) Consecutive serial number containing only alphabets/numerals/hyphens; (c) Date of issuance; (d) Name, address, and GSTIN of the recipient (if registered); (e) HSN code of goods or SAC for services; (f) Description of goods/services; (g) Quantity and unit; (h) Total value and taxable value; (i) Rate of tax (CGST, SGST, IGST); (j) Amount of tax charged; (k) Place of supply along with state name and state code; (l) Address of delivery if different; (m) Reverse charge applicability declaration; and (n) Signature or digital signature of supplier or authorized representative.',
  },
  {
    question: 'How many digits of HSN/SAC code are mandatory on Indian invoices?',
    answer:
      'As per Notification No. 78/2020 – Central Tax: Taxpayers with Aggregate Annual Turnover (AATO) up to ₹5 Crore in the previous financial year must report at least 4 digits of HSN code on B2B invoices (optional for B2C). Taxpayers with AATO above ₹5 Crore must report at least 6 digits of HSN code for both B2B and B2C supplies.',
  },
  {
    question: 'Can I download the generated invoice as a PDF without any watermark?',
    answer:
      'Yes, 100%! EveryTool’s GST Invoice Generator by Afaq provides clean, high-resolution vector PDF downloads and direct A4 printer output with zero watermarks, zero limits, and no required account signups.',
  },
  {
    question: 'Are my business and client details kept secure and private?',
    answer:
      'Yes. All draft invoices, company profiles, and client addresses are stored strictly in your browser’s local client storage (localStorage). Nothing is uploaded to external tracking servers or third-party databases. You maintain total data privacy.',
  },
  {
    question: 'What is Reverse Charge Mechanism (RCM)?',
    answer:
      'Normally, the supplier collects tax from the buyer and deposits it with the Government. Under Reverse Charge (Section 9(3) / 9(4) of the CGST Act), the liability to pay GST directly to the Government shifts to the recipient/buyer (e.g. supplies by unregistered persons, GTA services, legal services by advocates). Our tool lets you toggle Reverse Charge (Yes/No) seamlessly.',
  },
];

export const SeoAndComplianceSection: React.FC<SeoAndComplianceSectionProps> = ({
  onOpenPolicy,
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <section className="mt-12 pt-10 border-t border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 no-print">
      {/* Primary Header */}
      <div className="max-w-4xl mx-auto text-center mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-900">
          EveryTool Suite • India Business Utilities
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-3 tracking-tight">
          Free GST Invoice Generator & Tax Bill Maker India
        </h2>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-2 max-w-2xl mx-auto leading-relaxed">
          Create, customize, print, and download professional Rule 46 compliant Indian GST tax invoices in seconds. Built by Afaq for freelancers, consultants, traders, and Indian small businesses.
        </p>
      </div>

      {/* AdSense Top Compliant Ad Banner */}
      <AdSlot slotId="8492019381" format="horizontal" />

      {/* Feature Value Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
            <Calculator className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
            Automatic GST Split Engine
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Automatically calculates CGST (50%) + SGST (50%) for intra-state sales or full IGST for inter-state deliveries based on Place of Supply. Supports 0%, 0.25%, 3%, 5%, 12%, 18%, 28% and custom rates.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
            Rule 46 & HSN Compliance
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Generates standardized tax invoices with HSN/SAC breakdown tables, 15-character GSTIN validations, Indian numbering currency formatting, amount in words, and authorized signatory credentials.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
            Instant UPI QR & Vector PDF
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Embeds your UPI payment QR code directly onto the invoice so clients can scan and settle payments instantly using GPay, PhonePe, or Paytm. High-dpi A4 PDF download with one click.
          </p>
        </div>
      </div>

      {/* Comprehensive GST Editorial Guide (Crucial for AdSense "High Value Content" approval) */}
      <div className="max-w-5xl mx-auto bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs mb-12 space-y-6">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4" />
            Comprehensive Educational Guide
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Indian GST Invoicing Rules, Formats & Statutory Requirements
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            An in-depth guide on generating compliant commercial documents under the Central Goods and Services Tax Act, 2017
          </p>
        </div>

        {/* Section 1: Types of Invoices */}
        <div className="space-y-3 text-xs leading-relaxed">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Scale className="w-4 h-4 text-indigo-600" />
            1. Tax Invoice vs. Bill of Supply vs. Delivery Challan
          </h4>
          <p>
            Under the Indian GST framework, distinct document types are mandated depending on the nature of supply and taxpayer registration status:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-slate-200 dark:border-slate-800 text-[11px]">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold border-b border-slate-200 dark:border-slate-700">
                  <th className="p-2 border-r border-slate-200 dark:border-slate-700 text-left">Document Type</th>
                  <th className="p-2 border-r border-slate-200 dark:border-slate-700 text-left">When Required</th>
                  <th className="p-2 border-r border-slate-200 dark:border-slate-700 text-left">Tax Applicable?</th>
                  <th className="p-2 text-left">Input Tax Credit (ITC)?</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <td className="p-2 border-r border-slate-200 dark:border-slate-800 font-bold text-blue-700 dark:text-blue-400">Tax Invoice</td>
                  <td className="p-2 border-r border-slate-200 dark:border-slate-800">Supplying taxable goods or services to registered/unregistered buyers</td>
                  <td className="p-2 border-r border-slate-200 dark:border-slate-800">Yes (CGST, SGST, IGST)</td>
                  <td className="p-2 font-semibold text-emerald-600 dark:text-emerald-400">Eligible for recipient</td>
                </tr>
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <td className="p-2 border-r border-slate-200 dark:border-slate-800 font-bold">Bill of Supply</td>
                  <td className="p-2 border-r border-slate-200 dark:border-slate-800">Composition dealers or exempt/nil-rated supplies</td>
                  <td className="p-2 border-r border-slate-200 dark:border-slate-800">No tax charged</td>
                  <td className="p-2 text-slate-400">Not eligible</td>
                </tr>
                <tr>
                  <td className="p-2 border-r border-slate-200 dark:border-slate-800 font-bold">Delivery Challan</td>
                  <td className="p-2 border-r border-slate-200 dark:border-slate-800">Transportation of goods for job work, exhibition, or liquid gas</td>
                  <td className="p-2 border-r border-slate-200 dark:border-slate-800">No</td>
                  <td className="p-2 text-slate-400">N/A (Non-sale transfer)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 2: HSN Directory Reference */}
        <div className="space-y-3 text-xs leading-relaxed pt-2 border-t border-slate-200 dark:border-slate-800">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            2. Common HSN & SAC Codes for Indian Businesses
          </h4>
          <p>
            Harmonized System of Nomenclature (HSN) applies to goods, while Services Accounting Code (SAC) applies to services. Here are the most frequently used codes:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-[11px]">
            {POPULAR_HSN_SAC.map((item) => (
              <div
                key={item.code}
                className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700"
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                    {item.code}
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    {item.type}
                  </span>
                </div>
                <div className="text-slate-700 dark:text-slate-300 font-medium truncate">
                  {item.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step by Step Instructions */}
      <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs mb-12">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          How to Generate a GST Invoice in 4 Easy Steps
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <span className="font-bold text-blue-600 dark:text-blue-400 text-sm block mb-1">
              Step 1: Enter Business Details
            </span>
            <p className="text-slate-600 dark:text-slate-400">
              Input your company name, GSTIN, registered state and bank details. Click &quot;Save as Default&quot; to remember your information for future invoices.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <span className="font-bold text-blue-600 dark:text-blue-400 text-sm block mb-1">
              Step 2: Add Customer & Place of Supply
            </span>
            <p className="text-slate-600 dark:text-slate-400">
              Enter the client name, billing address, and Place of Supply. If the client is registered for GST, provide their 15-digit GSTIN.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <span className="font-bold text-blue-600 dark:text-blue-400 text-sm block mb-1">
              Step 3: Add Items & Select GST Slabs
            </span>
            <p className="text-slate-600 dark:text-slate-400">
              Add products or services with HSN/SAC codes, quantities, rates, and GST percentage (e.g. 5%, 12%, 18%, 28%). Taxes calculate automatically.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <span className="font-bold text-blue-600 dark:text-blue-400 text-sm block mb-1">
              Step 4: Download PDF or Print
            </span>
            <p className="text-slate-600 dark:text-slate-400">
              Review your live A4 tax invoice preview, verify the HSN summary and totals, then click &quot;Download PDF&quot; or &quot;Print&quot;.
            </p>
          </div>
        </div>
      </div>

      {/* AdSense Middle Ad Banner */}
      <AdSlot slotId="9381726451" format="horizontal" />

      {/* Frequently Asked Questions Accordion */}
      <div id="faq" className="max-w-4xl mx-auto mb-12">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Frequently Asked Questions (FAQ)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Common questions regarding Indian GST invoices, tax rates, and legal compliance
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-all shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-blue-500 shrink-0" />
                    {faq.question}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Internal links to EveryTool suite utilities */}
      <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-blue-950/40 p-6 rounded-2xl border border-blue-100 dark:border-blue-900/40 mb-12">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          Explore Other Tools in the EveryTool Business Suite
        </h4>
        <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
          Discover our growing suite of free, client-side productivity utilities for Indian businesses:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-blue-100 dark:border-slate-700 shadow-xs hover:border-blue-300 transition">
            <span className="font-bold text-slate-900 dark:text-white block">GST Calculator</span>
            <span className="text-[11px] text-slate-500">Reverse & Forward GST</span>
          </div>
          <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-blue-100 dark:border-slate-700 shadow-xs hover:border-blue-300 transition">
            <span className="font-bold text-slate-900 dark:text-white block">HSN / SAC Finder</span>
            <span className="text-[11px] text-slate-500">Official GST Code Directory</span>
          </div>
          <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-blue-100 dark:border-slate-700 shadow-xs hover:border-blue-300 transition">
            <span className="font-bold text-slate-900 dark:text-white block">E-Way Bill Helper</span>
            <span className="text-[11px] text-slate-500">Consignment threshold rules</span>
          </div>
          <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-blue-100 dark:border-slate-700 shadow-xs hover:border-blue-300 transition">
            <span className="font-bold text-slate-900 dark:text-white block">PDF Converter</span>
            <span className="text-[11px] text-slate-500">Compress & Format Documents</span>
          </div>
        </div>
      </div>

      {/* Compliance Advisory Disclaimer */}
      <div className="max-w-4xl mx-auto p-4 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-8">
        <div className="flex items-center justify-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300 mb-1">
          <ShieldAlert className="w-4 h-4 text-amber-500" />
          <span>Statutory Compliance & Legal Disclaimer</span>
        </div>
        <p>
          This GST Invoice Generator is designed to format tax invoices conforming to Rule 46 of the Central Goods and Services Tax Rules, 2017. Tax laws, e-invoicing turnover thresholds (applicable for businesses with aggregate turnover exceeding ₹5 Crore), and specific HSN/SAC rate notifications are subject to periodic amendments by the CBIC and GST Council. Users must verify their applicable tax rates, exemptions, and compliance requirements with a certified Chartered Accountant or qualified tax practitioner.
        </p>
      </div>
    </section>
  );
};
