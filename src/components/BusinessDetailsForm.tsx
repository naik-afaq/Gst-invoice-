import React, { useRef, useState } from 'react';
import { Building2, Upload, Trash2, CheckCircle2, AlertCircle, Save } from 'lucide-react';
import { BusinessProfile } from '../types/invoice';
import { INDIAN_STATES, extractStateFromGstin, getStateByCode } from '../data/indianStates';
import { validateGSTIN } from '../utils/gstCalculations';

interface BusinessDetailsFormProps {
  business: BusinessProfile;
  onChange: (updated: BusinessProfile) => void;
  onSaveAsProfile: () => void;
}

export const BusinessDetailsForm: React.FC<BusinessDetailsFormProps> = ({
  business,
  onChange,
  onSaveAsProfile,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const gstinStatus = business.gstin ? validateGSTIN(business.gstin) : null;

  const handleGstinChange = (value: string) => {
    const uppercaseVal = value.toUpperCase();
    const updated: BusinessProfile = {
      ...business,
      gstin: uppercaseVal,
    };

    // Auto extract state if first 2 digits match
    const detectedState = extractStateFromGstin(uppercaseVal);
    if (detectedState) {
      updated.state = detectedState.name;
      updated.stateCode = detectedState.code;
    }

    // Auto extract PAN (chars 3 to 12)
    if (uppercaseVal.length >= 12) {
      const potentialPan = uppercaseVal.substring(2, 12);
      if (/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(potentialPan)) {
        updated.pan = potentialPan;
      }
    }

    onChange(updated);
  };

  const handleStateChange = (stateName: string) => {
    const found = INDIAN_STATES.find((s) => s.name === stateName);
    onChange({
      ...business,
      state: stateName,
      stateCode: found ? found.code : business.stateCode,
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Logo file size must be less than 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onChange({
          ...business,
          logoUrl: reader.result,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    onChange({
      ...business,
      logoUrl: '',
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSaveProfileClick = () => {
    onSaveAsProfile();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs transition-colors">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Business Details</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Your company / seller info (Supplier)</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSaveProfileClick}
          className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition"
          title="Save this business information for future invoices"
        >
          {saveSuccess ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-emerald-600 dark:text-emerald-400">Saved!</span>
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5 text-slate-500" />
              <span>Save as Default</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Logo upload block */}
        <div className="md:col-span-1 flex flex-col justify-between">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Business Logo
          </label>
          <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-3 flex flex-col items-center justify-center min-h-[120px] bg-slate-50/50 dark:bg-slate-900/50 relative group">
            {business.logoUrl && business.logoUrl.trim() ? (
              <div className="flex flex-col items-center">
                <img
                  src={business.logoUrl}
                  alt="Business Logo"
                  className="max-h-16 max-w-full object-contain mb-2 rounded"
                />
                <button
                  type="button"
                  onClick={handleRemoveLogo}
                  className="flex items-center gap-1 text-[11px] text-red-600 dark:text-red-400 hover:underline"
                >
                  <Trash2 className="w-3 h-3" />
                  Remove
                </button>
              </div>
            ) : (
              <div className="text-center">
                <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Upload Logo</p>
                <p className="text-[10px] text-slate-400">PNG, JPG, SVG up to 2MB</p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Browse file
                </button>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleLogoUpload}
            />
          </div>
        </div>

        {/* Business Name, GSTIN, PAN */}
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Business / Trade Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Acme Technologies Pvt Ltd"
              value={business.name}
              onChange={(e) => onChange({ ...business, name: e.target.value })}
              className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                GSTIN <span className="text-red-500">*</span>
              </label>
              {gstinStatus && (
                <span
                  className={`text-[11px] font-medium flex items-center gap-1 ${
                    gstinStatus.isValid ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
                  }`}
                >
                  {gstinStatus.isValid ? (
                    <CheckCircle2 className="w-3 h-3" />
                  ) : (
                    <AlertCircle className="w-3 h-3" />
                  )}
                  {gstinStatus.isValid ? 'Valid' : 'Check format'}
                </span>
              )}
            </div>
            <input
              type="text"
              required
              maxLength={15}
              placeholder="e.g. 27AABCA1234D1Z5"
              value={business.gstin}
              onChange={(e) => handleGstinChange(e.target.value)}
              className="w-full font-mono text-sm uppercase px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              PAN Number
            </label>
            <input
              type="text"
              maxLength={10}
              placeholder="e.g. AABCA1234D"
              value={business.pan || ''}
              onChange={(e) => onChange({ ...business, pan: e.target.value.toUpperCase() })}
              className="w-full font-mono text-sm uppercase px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* State and State Code */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            State <span className="text-red-500">*</span>
          </label>
          <select
            value={business.state}
            onChange={(e) => handleStateChange(e.target.value)}
            className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {INDIAN_STATES.map((s) => (
              <option key={s.code} value={s.name}>
                {s.code} - {s.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            State Code
          </label>
          <input
            type="text"
            readOnly
            value={business.stateCode}
            className="w-full text-sm px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 font-mono cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Email Address
          </label>
          <input
            type="email"
            placeholder="billing@company.com"
            value={business.email}
            onChange={(e) => onChange({ ...business, email: e.target.value })}
            className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            placeholder="+91 98765 43210"
            value={business.phone}
            onChange={(e) => onChange({ ...business, phone: e.target.value })}
            className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Full Address */}
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Business Registered Address <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={2}
            placeholder="Door No, Street Name, Landmark, City, PIN Code"
            value={business.address}
            onChange={(e) => onChange({ ...business, address: e.target.value })}
            className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
};
