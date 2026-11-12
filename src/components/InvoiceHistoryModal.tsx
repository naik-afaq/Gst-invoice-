import React, { useState } from 'react';
import {
  X,
  Search,
  Download,
  Trash2,
  Copy,
  ExternalLink,
  FolderOpen,
  Calendar,
  AlertCircle,
  FileSpreadsheet,
} from 'lucide-react';
import { Invoice } from '../types/invoice';
import { formatIndianCurrency, calculateInvoiceSummary } from '../utils/gstCalculations';
import { exportInvoicesToCSV, getNextInvoiceNumber } from '../utils/storage';

interface InvoiceHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoices: Invoice[];
  onSelectInvoice: (invoice: Invoice) => void;
  onDeleteInvoice: (id: string) => void;
  onDuplicateInvoice: (invoice: Invoice) => void;
}

export const InvoiceHistoryModal: React.FC<InvoiceHistoryModalProps> = ({
  isOpen,
  onClose,
  invoices,
  onSelectInvoice,
  onDeleteInvoice,
  onDuplicateInvoice,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'issued' | 'paid'>('all');

  if (!isOpen) return null;

  const filteredInvoices = invoices.filter((inv) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      inv.details.invoiceNumber.toLowerCase().includes(query) ||
      inv.customer.name.toLowerCase().includes(query) ||
      (inv.customer.gstin && inv.customer.gstin.toLowerCase().includes(query));

    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs no-print">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Saved Invoices & Drafts
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Browse, load, duplicate or export your previously created invoices
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {invoices.length > 0 && (
              <button
                type="button"
                onClick={() => exportInvoicesToCSV(invoices)}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition"
                title="Export all saved invoices to CSV"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                Export CSV
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Disclaimer banner */}
        <div className="px-5 py-2.5 bg-amber-50/70 dark:bg-amber-950/30 border-b border-amber-200/50 dark:border-amber-900/50 flex items-center gap-2 text-xs text-amber-800 dark:text-amber-300">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <span>
            Invoices are stored privately inside your browser's local storage. This is not a cloud server backup. Download PDF or Export CSV to preserve permanent financial records.
          </span>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by invoice no, client or GSTIN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-auto text-xs">
            {(['all', 'draft', 'issued', 'paid'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-md capitalize transition ${
                  statusFilter === st
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Invoice List */}
        <div className="p-5 overflow-y-auto flex-1 space-y-3">
          {filteredInvoices.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <FolderOpen className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                {invoices.length === 0
                  ? 'No saved invoices yet'
                  : 'No invoices matching your search filter'}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                When you create or save an invoice, it will appear here for easy retrieval.
              </p>
            </div>
          ) : (
            filteredInvoices.map((inv) => {
              const { summary } = calculateInvoiceSummary(
                inv.items,
                inv.additionalCharges || [],
                inv.business.stateCode,
                inv.details.placeOfSupplyCode,
                inv.autoRoundOff
              );

              return (
                <div
                  key={inv.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 bg-white dark:bg-slate-800/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                        {inv.details.invoiceNumber}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider ${
                          inv.status === 'paid'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : inv.status === 'issued'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                            : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        {inv.status}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {inv.details.invoiceDate}
                      </span>
                    </div>

                    <div className="mt-1 text-xs text-slate-600 dark:text-slate-300 font-medium">
                      Client: <span className="text-slate-900 dark:text-white font-semibold">{inv.customer.name || 'Untitled Client'}</span>
                      {inv.customer.gstin && (
                        <span className="ml-2 font-mono text-[11px] text-slate-400">
                          (GSTIN: {inv.customer.gstin})
                        </span>
                      )}
                    </div>

                    <div className="mt-0.5 text-[11px] text-slate-400">
                      {inv.items.length} item{inv.items.length === 1 ? '' : 's'} • Place of Supply: {inv.details.placeOfSupply}
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                        Total Amount
                      </span>
                      <span className="font-mono text-base font-extrabold text-blue-600 dark:text-blue-400">
                        {formatIndianCurrency(summary.grandTotal)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          onSelectInvoice(inv);
                          onClose();
                        }}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition flex items-center gap-1"
                        title="Load this invoice into editor"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => onDuplicateInvoice(inv)}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                        title="Duplicate as new invoice"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDeleteInvoice(inv.id)}
                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition"
                        title="Delete invoice draft"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
