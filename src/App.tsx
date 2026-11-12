import React, { useEffect, useState, useMemo } from 'react';
import {
  FileText,
  Save,
  RotateCcw,
  Sparkles,
  Download,
  Printer,
  Eye,
  Edit3,
  CheckCircle2,
  AlertTriangle,
  FolderOpen,
  Building2,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { Header } from './components/Header';
import { BusinessDetailsForm } from './components/BusinessDetailsForm';
import { CustomerDetailsForm } from './components/CustomerDetailsForm';
import { InvoiceDetailsForm } from './components/InvoiceDetailsForm';
import { ItemsTableForm } from './components/ItemsTableForm';
import { BankAndPaymentForm } from './components/BankAndPaymentForm';
import { SummaryCard } from './components/SummaryCard';
import { InvoicePreview } from './components/InvoicePreview';
import { InvoiceHistoryModal } from './components/InvoiceHistoryModal';
import { BusinessProfileModal } from './components/BusinessProfileModal';
import { SeoAndComplianceSection } from './components/SeoAndComplianceSection';
import { PolicyModal, PolicyTab } from './components/PolicyModal';
import { Footer } from './components/Footer';
import { CookieConsentBanner } from './components/CookieConsentBanner';
import { BusinessProfile, Invoice } from './types/invoice';
import {
  createBlankInvoice,
  createSampleInvoice,
  deleteInvoiceFromStorage,
  getBusinessProfile,
  getNextInvoiceNumber,
  getSavedInvoices,
  saveBusinessProfile,
  saveInvoiceToStorage,
} from './utils/storage';
import { calculateInvoiceSummary, validateGSTIN } from './utils/gstCalculations';
import { downloadInvoiceAsPDF, printInvoiceDirectly } from './utils/pdfExport';

export default function App() {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return (
      localStorage.getItem('everytool_theme') === 'dark' ||
      (!('everytool_theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    );
  });

  // Invoice state
  const [invoice, setInvoice] = useState<Invoice>(() => {
    // If saved invoices exist, load the latest or start with sample/blank
    const saved = getSavedInvoices();
    if (saved.length > 0) {
      return saved[0];
    }
    // Start with realistic sample so user immediately sees a populated, working invoice
    return createSampleInvoice();
  });

  // UI States
  const [viewMode, setViewMode] = useState<'split' | 'edit' | 'preview'>('split');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isPolicyOpen, setIsPolicyOpen] = useState(false);
  const [policyTab, setPolicyTab] = useState<PolicyTab>('privacy');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: 'success' | 'warning' | 'info';
  } | null>(null);

  const handleOpenPolicy = (tab: PolicyTab) => {
    setPolicyTab(tab);
    setIsPolicyOpen(true);
  };

  // Sync dark mode class on document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('everytool_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('everytool_theme', 'light');
    }
  }, [isDarkMode]);

  // Compute live calculations
  const { calculatedItems, summary } = useMemo(() => {
    return calculateInvoiceSummary(
      invoice.items,
      invoice.additionalCharges || [],
      invoice.business.stateCode,
      invoice.details.placeOfSupplyCode,
      invoice.autoRoundOff
    );
  }, [
    invoice.items,
    invoice.additionalCharges,
    invoice.business.stateCode,
    invoice.details.placeOfSupplyCode,
    invoice.autoRoundOff,
  ]);

  const showToast = (text: string, type: 'success' | 'warning' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Actions
  const handleNewInvoice = () => {
    const blank = createBlankInvoice();
    setInvoice(blank);
    showToast('New blank invoice created with next sequence number', 'info');
  };

  const handleLoadDemo = () => {
    const sample = createSampleInvoice();
    setInvoice(sample);
    showToast('Demo data loaded successfully!', 'success');
  };

  const handleSaveInvoice = () => {
    saveInvoiceToStorage(invoice);
    showToast('Invoice saved locally to browser storage', 'success');
  };

  const handleSaveAsDefaultProfile = () => {
    saveBusinessProfile(invoice.business);
    showToast('Business profile saved as default for future invoices', 'success');
  };

  const handleDownloadPdf = async () => {
    if (!invoice.business.name.trim()) {
      showToast('Please enter your Business Name before downloading', 'warning');
      return;
    }
    if (!invoice.customer.name.trim()) {
      showToast('Please enter Customer Name before downloading', 'warning');
      return;
    }

    try {
      setIsGeneratingPdf(true);
      showToast('Generating high-resolution PDF...', 'info');
      // Save current state as well
      saveInvoiceToStorage(invoice);
      const filename = `GST_Invoice_${invoice.details.invoiceNumber || 'INV'}.pdf`;
      await downloadInvoiceAsPDF('invoice-print-area', filename);
      showToast('PDF downloaded successfully!', 'success');
    } catch (err) {
      console.error('PDF export failed', err);
      showToast('Direct PDF export encountered an error. Opening print preview...', 'warning');
      printInvoiceDirectly();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrint = () => {
    saveInvoiceToStorage(invoice);
    printInvoiceDirectly();
  };

  const handleResetForm = () => {
    if (window.confirm('Reset this invoice form? Unsaved changes will be discarded.')) {
      handleNewInvoice();
    }
  };

  const handleDuplicateInvoice = (targetInvoice: Invoice) => {
    const nextNumber = getNextInvoiceNumber();
    const duplicated: Invoice = {
      ...targetInvoice,
      id: 'inv_' + Date.now(),
      details: {
        ...targetInvoice.details,
        invoiceNumber: nextNumber,
        invoiceDate: new Date().toISOString().split('T')[0],
      },
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveInvoiceToStorage(duplicated);
    setInvoice(duplicated);
    setIsHistoryOpen(false);
    showToast(`Invoice duplicated as ${nextNumber}`, 'success');
  };

  const handleDeleteInvoice = (id: string) => {
    deleteInvoiceFromStorage(id);
    showToast('Invoice deleted from local records', 'info');
  };

  const savedInvoicesCount = getSavedInvoices().length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 animate-in fade-in slide-in-from-top-4 duration-200 no-print">
          <div
            className={`flex items-center gap-2 px-4 py-3 rounded-xl shadow-xl text-xs font-semibold border ${
              toastMessage.type === 'success'
                ? 'bg-emerald-900 text-emerald-100 border-emerald-700'
                : toastMessage.type === 'warning'
                ? 'bg-amber-900 text-amber-100 border-amber-700'
                : 'bg-blue-900 text-blue-100 border-blue-700'
            }`}
          >
            {toastMessage.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            {toastMessage.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
            {toastMessage.type === 'info' && <Sparkles className="w-4 h-4 text-blue-400" />}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Header Bar */}
      <Header
        onNewInvoice={handleNewInvoice}
        onLoadDemo={handleLoadDemo}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenPolicy={handleOpenPolicy}
        onDownloadPdf={handleDownloadPdf}
        onPrint={handlePrint}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        viewMode={viewMode}
        onChangeViewMode={setViewMode}
        savedCount={savedInvoicesCount}
        isGeneratingPdf={isGeneratingPdf}
      />

      {/* Main App Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Action Toolbar on Top of Workspace */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs no-print">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleNewInvoice}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition"
            >
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              New Invoice
            </button>

            <button
              type="button"
              onClick={handleSaveInvoice}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 text-white dark:text-slate-900 shadow-xs transition"
            >
              <Save className="w-3.5 h-3.5" />
              Save Draft
            </button>

            <button
              type="button"
              onClick={handleResetForm}
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-red-600 dark:hover:text-red-400 px-2 py-1.5 rounded transition"
              title="Reset current invoice form"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Form
            </button>
          </div>

          {/* Status badge & Quick Switch */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-400 font-medium">Status:</span>
              <select
                value={invoice.status}
                onChange={(e) =>
                  setInvoice({ ...invoice, status: e.target.value as any })
                }
                className="text-xs font-semibold rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 py-1 text-slate-800 dark:text-slate-200"
              >
                <option value="draft">Draft</option>
                <option value="issued">Issued</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>

            {/* Mobile View Toggle */}
            <div className="md:hidden flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-xs">
              <button
                type="button"
                onClick={() => setViewMode(viewMode === 'edit' ? 'preview' : 'edit')}
                className="px-2.5 py-1 rounded bg-white dark:bg-slate-700 font-semibold text-blue-600 dark:text-blue-400 shadow-xs flex items-center gap-1"
              >
                {viewMode === 'edit' ? (
                  <>
                    <Eye className="w-3.5 h-3.5" /> Preview
                  </>
                ) : (
                  <>
                    <Edit3 className="w-3.5 h-3.5" /> Edit
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Layout: Split View / Editor Only / Preview Only */}
        <div
          className={`grid gap-6 ${
            viewMode === 'split'
              ? 'grid-cols-1 lg:grid-cols-12'
              : 'grid-cols-1 max-w-5xl mx-auto'
          }`}
        >
          {/* Left Column: Invoice Form Controls */}
          {(viewMode === 'split' || viewMode === 'edit') && (
            <div
              className={`space-y-6 ${
                viewMode === 'split' ? 'lg:col-span-7' : 'w-full'
              } no-print`}
            >
              {/* 1. Business Profile */}
              <BusinessDetailsForm
                business={invoice.business}
                onChange={(business) => setInvoice({ ...invoice, business })}
                onSaveAsProfile={handleSaveAsDefaultProfile}
              />

              {/* 2. Customer Profile */}
              <CustomerDetailsForm
                customer={invoice.customer}
                onChange={(customer) => setInvoice({ ...invoice, customer })}
                onSetPlaceOfSupply={(stateName, stateCode) => {
                  setInvoice((prev) => ({
                    ...prev,
                    details: {
                      ...prev.details,
                      placeOfSupply: stateName,
                      placeOfSupplyCode: stateCode,
                    },
                  }));
                }}
              />

              {/* 3. Invoice Metadata */}
              <InvoiceDetailsForm
                details={invoice.details}
                supplierState={invoice.business.state}
                onChange={(details) => setInvoice({ ...invoice, details })}
              />

              {/* 4. Products & Services Table */}
              <ItemsTableForm
                items={invoice.items}
                additionalCharges={invoice.additionalCharges || []}
                isIntraState={summary.isIntraState}
                onItemsChange={(items) => setInvoice({ ...invoice, items })}
                onAdditionalChargesChange={(additionalCharges) =>
                  setInvoice({ ...invoice, additionalCharges })
                }
              />

              {/* 5. Bank, UPI, Terms & Signatory */}
              <BankAndPaymentForm
                business={invoice.business}
                details={invoice.details}
                onBusinessChange={(business) => setInvoice({ ...invoice, business })}
                onDetailsChange={(details) => setInvoice({ ...invoice, details })}
                totalAmount={summary.grandTotal}
              />

              {/* 6. Tax Summary */}
              <SummaryCard
                summary={summary}
                autoRoundOff={invoice.autoRoundOff}
                onToggleRoundOff={(enabled) =>
                  setInvoice({ ...invoice, autoRoundOff: enabled })
                }
                supplierState={invoice.business.state}
                placeOfSupply={invoice.details.placeOfSupply}
              />
            </div>
          )}

          {/* Right Column: Live A4 GST Tax Invoice Preview */}
          {(viewMode === 'split' || viewMode === 'preview') && (
            <div
              className={`${
                viewMode === 'split'
                  ? 'lg:col-span-5 lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto'
                  : 'w-full'
              }`}
            >
              {/* Preview header bar */}
              <div className="flex items-center justify-between mb-3 px-2 no-print">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Live Tax Invoice Preview
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 transition"
                  >
                    <Printer className="w-3 h-3" />
                    Print
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadPdf}
                    disabled={isGeneratingPdf}
                    className="flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition disabled:opacity-50"
                  >
                    <Download className="w-3 h-3" />
                    {isGeneratingPdf ? 'Exporting...' : 'PDF'}
                  </button>
                </div>
              </div>

              {/* Authentic Print-Ready A4 Document */}
              <div className="rounded-xl overflow-hidden shadow-xl border border-slate-300 dark:border-slate-700 bg-white">
                <InvoicePreview
                  business={invoice.business}
                  customer={invoice.customer}
                  details={invoice.details}
                  items={invoice.items}
                  summary={summary}
                />
              </div>
            </div>
          )}
        </div>

        {/* SEO, Rule 46 Compliance, and FAQ Section */}
        <SeoAndComplianceSection onOpenPolicy={handleOpenPolicy} />
      </main>

      {/* Comprehensive AdSense Compliant Footer */}
      <Footer onOpenPolicy={handleOpenPolicy} />

      {/* Cookie & Privacy Consent Banner */}
      <CookieConsentBanner onOpenPolicy={handleOpenPolicy} />

      {/* History & Saved Invoices Modal */}
      <InvoiceHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        invoices={getSavedInvoices()}
        onSelectInvoice={(inv) => {
          setInvoice(inv);
          showToast(`Loaded invoice ${inv.details.invoiceNumber}`, 'success');
        }}
        onDeleteInvoice={handleDeleteInvoice}
        onDuplicateInvoice={handleDuplicateInvoice}
      />

      {/* Business Profile Modal */}
      <BusinessProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={invoice.business}
        onSaveProfile={(profile: BusinessProfile) => {
          saveBusinessProfile(profile);
          setInvoice((prev) => ({ ...prev, business: profile }));
          showToast('Default business profile saved!', 'success');
        }}
      />

      {/* Legal & Policy Center Modal (Privacy, Terms, Disclaimer, About, Contact) */}
      <PolicyModal
        isOpen={isPolicyOpen}
        onClose={() => setIsPolicyOpen(false)}
        initialTab={policyTab}
      />
    </div>
  );
}
