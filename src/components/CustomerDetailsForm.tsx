import React from 'react';
import { UserCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { CustomerDetails } from '../types/invoice';
import { INDIAN_STATES, extractStateFromGstin } from '../data/indianStates';
import { validateGSTIN } from '../utils/gstCalculations';

interface CustomerDetailsFormProps {
  customer: CustomerDetails;
  onChange: (updated: CustomerDetails) => void;
  onSetPlaceOfSupply?: (stateName: string, stateCode: string) => void;
}

export const CustomerDetailsForm: React.FC<CustomerDetailsFormProps> = ({
  customer,
  onChange,
  onSetPlaceOfSupply,
}) => {
  const gstinStatus = customer.gstin ? validateGSTIN(customer.gstin) : null;

  const handleGstinChange = (value: string) => {
    const uppercaseVal = value.toUpperCase();
    const updated: CustomerDetails = {
      ...customer,
      gstin: uppercaseVal,
    };

    const detectedState = extractStateFromGstin(uppercaseVal);
    if (detectedState) {
      updated.state = detectedState.name;
      updated.stateCode = detectedState.code;
      if (onSetPlaceOfSupply) {
        onSetPlaceOfSupply(detectedState.name, detectedState.code);
      }
    }

    onChange(updated);
  };

  const handleStateChange = (stateName: string) => {
    const found = INDIAN_STATES.find((s) => s.name === stateName);
    const code = found ? found.code : customer.stateCode;
    onChange({
      ...customer,
      state: stateName,
      stateCode: code,
    });
    if (onSetPlaceOfSupply && found) {
      onSetPlaceOfSupply(found.name, found.code);
    }
  };

  const handleSameAsBillingToggle = (checked: boolean) => {
    onChange({
      ...customer,
      sameAsBilling: checked,
      shippingAddress: checked ? customer.billingAddress : customer.shippingAddress,
    });
  };

  const handleBillingAddressChange = (address: string) => {
    onChange({
      ...customer,
      billingAddress: address,
      shippingAddress: customer.sameAsBilling ? address : customer.shippingAddress,
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs transition-colors">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Customer Details</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Buyer / Client information (B2B Registered or B2C Unregistered)
            </p>
          </div>
        </div>

        <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
          {customer.gstin ? 'B2B Registered' : 'B2C / Unregistered'}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {/* Customer Name */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Customer / Client Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Apex Global Logistics Pvt Ltd or Rajesh Sharma"
            value={customer.name}
            onChange={(e) => onChange({ ...customer, name: e.target.value })}
            className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Customer GSTIN */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Customer GSTIN <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            {customer.gstin && gstinStatus && (
              <span
                className={`text-[11px] font-medium flex items-center gap-1 ${
                  gstinStatus.isValid ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
                }`}
              >
                {gstinStatus.isValid ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                {gstinStatus.isValid ? 'Valid' : 'Check format'}
              </span>
            )}
          </div>
          <input
            type="text"
            maxLength={15}
            placeholder="e.g. 06AAACA9876C1Z3"
            value={customer.gstin}
            onChange={(e) => handleGstinChange(e.target.value)}
            className="w-full font-mono text-sm uppercase px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* State */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Customer State <span className="text-red-500">*</span>
          </label>
          <select
            value={customer.state}
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

        {/* State Code */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            State Code
          </label>
          <input
            type="text"
            readOnly
            value={customer.stateCode}
            className="w-full text-sm px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 font-mono cursor-not-allowed"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Email Address
          </label>
          <input
            type="email"
            placeholder="client@apexlogistics.in"
            value={customer.email}
            onChange={(e) => onChange({ ...customer, email: e.target.value })}
            className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            placeholder="+91 91234 56789"
            value={customer.phone}
            onChange={(e) => onChange({ ...customer, phone: e.target.value })}
            className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Billing Address */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Billing Address <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={2}
            placeholder="Customer office/residential address, City, PIN Code"
            value={customer.billingAddress}
            onChange={(e) => handleBillingAddressChange(e.target.value)}
            className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Same as Billing Checkbox */}
        <div className="sm:col-span-3 flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={customer.sameAsBilling}
              onChange={(e) => handleSameAsBillingToggle(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-700"
            />
            <span>Shipping address is the same as billing address</span>
          </label>
        </div>

        {/* Shipping Address (if different) */}
        {!customer.sameAsBilling && (
          <div className="sm:col-span-3 pt-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Shipping / Delivery Address
            </label>
            <textarea
              rows={2}
              placeholder="Warehouse / delivery site address if different from billing"
              value={customer.shippingAddress}
              onChange={(e) => onChange({ ...customer, shippingAddress: e.target.value })}
              className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}
      </div>
    </div>
  );
};
