import React from 'react';
import { FileText, RefreshCw, Calendar, HelpCircle } from 'lucide-react';
import { InvoiceDetails } from '../types/invoice';
import { INDIAN_STATES, getStateByName } from '../data/indianStates';
import { getNextInvoiceNumber, getDueDateString, getTodayDateString } from '../utils/storage';

interface InvoiceDetailsFormProps {
  details: InvoiceDetails;
  supplierState: string;
  onChange: (updated: InvoiceDetails) => void;
}

export const InvoiceDetailsForm: React.FC<InvoiceDetailsFormProps> = ({
  details,
  supplierState,
  onChange,
}) => {
  const handlePlaceOfSupplyChange = (stateName: string) => {
    const found = getStateByName(stateName) || INDIAN_STATES.find((s) => s.name === stateName);
    onChange({
      ...details,
      placeOfSupply: stateName,
      placeOfSupplyCode: found ? found.code : details.placeOfSupplyCode,
    });
  };

  const handleGenerateNextNumber = () => {
    const nextNum = getNextInvoiceNumber();
    onChange({
      ...details,
      invoiceNumber: nextNum,
    });
  };

  const handleSetQuickDueDate = (days: number) => {
    onChange({
      ...details,
      dueDate: getDueDateString(days),
    });
  };

  const isIntraState = supplierState.toLowerCase() === details.placeOfSupply.toLowerCase();

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs transition-colors">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Invoice Details</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Tax invoice metadata, dates, place of supply and credit terms
            </p>
          </div>
        </div>

        {/* Intra vs Inter-State Badge */}
        <div
          className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
            isIntraState
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800'
              : 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800'
          }`}
        >
          {isIntraState ? 'Intra-State (CGST + SGST)' : 'Inter-State (IGST)'}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Invoice Number */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Invoice Number <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={handleGenerateNextNumber}
              title="Generate next sequential invoice number"
              className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
            >
              <RefreshCw className="w-3 h-3" />
              Auto
            </button>
          </div>
          <input
            type="text"
            required
            placeholder="INV-2026-001"
            value={details.invoiceNumber}
            onChange={(e) => onChange({ ...details, invoiceNumber: e.target.value })}
            className="w-full font-mono text-sm px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Invoice Date */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Invoice Date <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={() => onChange({ ...details, invoiceDate: getTodayDateString() })}
              className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline"
            >
              Today
            </button>
          </div>
          <div className="relative">
            <input
              type="date"
              required
              value={details.invoiceDate}
              onChange={(e) => onChange({ ...details, invoiceDate: e.target.value })}
              className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Due Date */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Due Date
            </label>
            <div className="flex items-center gap-1.5 text-[11px] text-blue-600 dark:text-blue-400">
              <button
                type="button"
                onClick={() => handleSetQuickDueDate(7)}
                className="hover:underline"
              >
                +7d
              </button>
              <button
                type="button"
                onClick={() => handleSetQuickDueDate(15)}
                className="hover:underline"
              >
                +15d
              </button>
              <button
                type="button"
                onClick={() => handleSetQuickDueDate(30)}
                className="hover:underline"
              >
                +30d
              </button>
            </div>
          </div>
          <input
            type="date"
            value={details.dueDate}
            onChange={(e) => onChange({ ...details, dueDate: e.target.value })}
            className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Place of Supply */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              Place of Supply <span className="text-red-500">*</span>
            </label>
            <span className="text-[11px] font-mono text-slate-500">
              Code: {details.placeOfSupplyCode || '--'}
            </span>
          </div>
          <select
            value={details.placeOfSupply}
            onChange={(e) => handlePlaceOfSupplyChange(e.target.value)}
            className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {INDIAN_STATES.map((s) => (
              <option key={s.code} value={s.name}>
                {s.code} - {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Reverse Charge */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
            Reverse Charge (RCM)
            <span
              title="Reverse charge mechanism applies if tax is payable by recipient under Section 9(3) or 9(4)"
              className="cursor-help text-slate-400 hover:text-slate-600"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </span>
          </label>
          <div className="flex items-center h-10 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={details.reverseCharge}
                onChange={(e) => onChange({ ...details, reverseCharge: e.target.checked })}
                className="sr-only peer"
              />
              <div className="relative w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
              <span className="ms-2 text-xs font-medium text-slate-800 dark:text-slate-200">
                {details.reverseCharge ? 'Yes (RCM Applicable)' : 'No (Normal Charge)'}
              </span>
            </label>
          </div>
        </div>

        {/* PO Number */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            PO / Reference Number
          </label>
          <input
            type="text"
            placeholder="e.g. PO-2026-9921"
            value={details.poNumber}
            onChange={(e) => onChange({ ...details, poNumber: e.target.value })}
            className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Payment Terms */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Payment Terms
          </label>
          <div className="flex gap-2">
            <select
              value={
                ['Immediate / Due on Receipt', 'Net 15 Days', 'Net 30 Days', 'Net 45 Days', 'Net 60 Days', '100% Advance'].includes(
                  details.paymentTerms
                )
                  ? details.paymentTerms
                  : 'Custom'
              }
              onChange={(e) => {
                if (e.target.value !== 'Custom') {
                  onChange({ ...details, paymentTerms: e.target.value });
                }
              }}
              className="text-sm px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Immediate / Due on Receipt">Immediate / Due on Receipt</option>
              <option value="Net 15 Days">Net 15 Days</option>
              <option value="Net 30 Days">Net 30 Days</option>
              <option value="Net 45 Days">Net 45 Days</option>
              <option value="Net 60 Days">Net 60 Days</option>
              <option value="100% Advance">100% Advance</option>
              <option value="Custom">Custom</option>
            </select>
            <input
              type="text"
              placeholder="e.g. 50% Advance, 50% on Delivery"
              value={details.paymentTerms}
              onChange={(e) => onChange({ ...details, paymentTerms: e.target.value })}
              className="flex-1 text-sm px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
