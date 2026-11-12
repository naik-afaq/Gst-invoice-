import React, { useRef, useState, useEffect } from 'react';
import {
  CreditCard,
  QrCode,
  FileCheck,
  Plus,
  Trash2,
  RotateCcw,
  Upload,
  PenTool,
} from 'lucide-react';
import { BusinessProfile, InvoiceDetails } from '../types/invoice';
import { DEFAULT_TERMS } from '../data/indianStates';
import { generateUpiQrDataUrl } from '../utils/qrCode';

interface BankAndPaymentFormProps {
  business: BusinessProfile;
  details: InvoiceDetails;
  onBusinessChange: (updated: BusinessProfile) => void;
  onDetailsChange: (updated: InvoiceDetails) => void;
  totalAmount: number;
}

export const BankAndPaymentForm: React.FC<BankAndPaymentFormProps> = ({
  business,
  details,
  onBusinessChange,
  onDetailsChange,
  totalAmount,
}) => {
  const sigInputRef = useRef<HTMLInputElement>(null);
  const [upiQrUrl, setUpiQrUrl] = useState<string>('');

  useEffect(() => {
    let isMounted = true;
    if (business.upiId) {
      generateUpiQrDataUrl(
        business.upiId,
        business.name,
        totalAmount,
        details.invoiceNumber
      ).then((dataUrl) => {
        if (isMounted) setUpiQrUrl(dataUrl);
      });
    } else {
      setUpiQrUrl('');
    }
    return () => {
      isMounted = false;
    };
  }, [business.upiId, business.name, totalAmount, details.invoiceNumber]);

  const handleAddTerm = () => {
    onDetailsChange({
      ...details,
      termsAndConditions: [...details.termsAndConditions, ''],
    });
  };

  const handleTermChange = (index: number, val: string) => {
    const updated = [...details.termsAndConditions];
    updated[index] = val;
    onDetailsChange({
      ...details,
      termsAndConditions: updated,
    });
  };

  const handleRemoveTerm = (index: number) => {
    const updated = details.termsAndConditions.filter((_, i) => i !== index);
    onDetailsChange({
      ...details,
      termsAndConditions: updated,
    });
  };

  const handleResetTerms = () => {
    onDetailsChange({
      ...details,
      termsAndConditions: [...DEFAULT_TERMS],
    });
  };

  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      alert('Signature file must be under 1MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onDetailsChange({
          ...details,
          signatureUrl: reader.result,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      {/* Bank & Payment Information */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs transition-colors">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Bank & Payment Details
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Direct wire transfer info & UPI QR code for fast client settlements
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Bank Name
              </label>
              <input
                type="text"
                placeholder="e.g. HDFC Bank Ltd"
                value={business.bankName || ''}
                onChange={(e) => onBusinessChange({ ...business, bankName: e.target.value })}
                className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Account Holder Name
              </label>
              <input
                type="text"
                placeholder="e.g. Acme Technologies Pvt Ltd"
                value={business.accountHolder || ''}
                onChange={(e) => onBusinessChange({ ...business, accountHolder: e.target.value })}
                className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Account Number
              </label>
              <input
                type="text"
                placeholder="e.g. 50200012345678"
                value={business.accountNumber || ''}
                onChange={(e) => onBusinessChange({ ...business, accountNumber: e.target.value })}
                className="w-full font-mono text-sm px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                IFSC Code
              </label>
              <input
                type="text"
                maxLength={11}
                placeholder="e.g. HDFC0001234"
                value={business.ifscCode || ''}
                onChange={(e) =>
                  onBusinessChange({ ...business, ifscCode: e.target.value.toUpperCase() })
                }
                className="w-full font-mono text-sm uppercase px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Branch & Location
              </label>
              <input
                type="text"
                placeholder="e.g. Andheri East, Mumbai"
                value={business.branch || ''}
                onChange={(e) => onBusinessChange({ ...business, branch: e.target.value })}
                className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* UPI ID & QR Preview */}
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col justify-between">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                UPI ID (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. business@okhdfcbank"
                value={business.upiId || ''}
                onChange={(e) => onBusinessChange({ ...business, upiId: e.target.value.trim() })}
                className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mt-2 text-center flex flex-col items-center justify-center p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 min-h-[110px]">
              {business.upiId && upiQrUrl ? (
                <>
                  <img
                    src={upiQrUrl}
                    alt="UPI Payment QR"
                    className="w-20 h-20 object-contain rounded"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 font-medium">
                    Scan & Pay with any UPI app
                  </span>
                </>
              ) : (
                <div className="text-slate-400 flex flex-col items-center">
                  <QrCode className="w-8 h-8 mb-1 opacity-40" />
                  <span className="text-[11px]">
                    {business.upiId ? 'Generating payment QR...' : 'Enter UPI ID to generate payment QR'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Terms, Notes & Signatory Box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Terms and Conditions */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs transition-colors">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-slate-500" />
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Terms & Conditions
              </h3>
            </div>
            <button
              type="button"
              onClick={handleResetTerms}
              title="Reset to default legal terms"
              className="text-[11px] text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>

          <div className="space-y-2 mb-3">
            {details.termsAndConditions.map((term, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-mono w-4">{idx + 1}.</span>
                <input
                  type="text"
                  value={term}
                  onChange={(e) => handleTermChange(idx, e.target.value)}
                  className="flex-1 text-xs px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveTerm(idx)}
                  className="p-1 text-slate-400 hover:text-red-500 rounded"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleAddTerm}
            className="flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Another Clause
          </button>

          {/* Customer Notes */}
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Customer Notes / Remittance Instructions
            </label>
            <textarea
              rows={2}
              value={details.notes}
              onChange={(e) => onDetailsChange({ ...details, notes: e.target.value })}
              placeholder="e.g. Thank you for your business! Please quote invoice number during wire transfer."
              className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Authorized Signatory */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs transition-colors flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
              <PenTool className="w-4 h-4 text-slate-500" />
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Authorized Signatory
              </h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Signatory Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mohd Afaq or Authorized Signatory"
                  value={details.signatoryName}
                  onChange={(e) => onDetailsChange({ ...details, signatoryName: e.target.value })}
                  className="w-full text-sm px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Designation / Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Managing Director / Partner"
                  value={details.signatoryDesignation}
                  onChange={(e) =>
                    onDetailsChange({ ...details, signatoryDesignation: e.target.value })
                  }
                  className="w-full text-sm px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Digital Signature / Seal</span>
              <button
                type="button"
                onClick={() => sigInputRef.current?.click()}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <Upload className="w-3 h-3" />
                {details.signatureUrl ? 'Change' : 'Upload Image'}
              </button>
              <input
                ref={sigInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleSignatureUpload}
              />
            </div>

            {Boolean(details.signatureUrl && details.signatureUrl.trim()) && (
              <div className="mt-2 flex items-center justify-between p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <img
                  src={details.signatureUrl}
                  alt="Signature"
                  className="max-h-12 object-contain"
                />
                <button
                  type="button"
                  onClick={() => onDetailsChange({ ...details, signatureUrl: '' })}
                  className="text-red-500 hover:text-red-700 text-xs"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
