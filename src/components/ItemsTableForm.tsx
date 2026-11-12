import React from 'react';
import {
  Package,
  Plus,
  Trash2,
  Copy,
  Percent,
  IndianRupee,
  Sparkles,
  Info,
} from 'lucide-react';
import { AdditionalCharge, InvoiceItem } from '../types/invoice';
import { COMMON_UNITS, GST_RATES, POPULAR_HSN_SAC } from '../data/indianStates';
import { formatIndianCurrency, roundTo2 } from '../utils/gstCalculations';

interface ItemsTableFormProps {
  items: InvoiceItem[];
  additionalCharges: AdditionalCharge[];
  isIntraState: boolean;
  onItemsChange: (items: InvoiceItem[]) => void;
  onAdditionalChargesChange: (charges: AdditionalCharge[]) => void;
}

export const ItemsTableForm: React.FC<ItemsTableFormProps> = ({
  items,
  additionalCharges,
  isIntraState,
  onItemsChange,
  onAdditionalChargesChange,
}) => {
  const handleAddItem = () => {
    const newItem: InvoiceItem = {
      id: 'item-' + Date.now(),
      name: '',
      hsnSac: '998314',
      quantity: 1,
      unit: 'PCS',
      pricePerUnit: 0,
      discountType: 'percent',
      discountValue: 0,
      gstRate: 18,
    };
    onItemsChange([...items, newItem]);
  };

  const handleDuplicateItem = (item: InvoiceItem) => {
    const duplicated: InvoiceItem = {
      ...item,
      id: 'item-' + Date.now(),
      name: item.name ? `${item.name} (Copy)` : '',
    };
    onItemsChange([...items, duplicated]);
  };

  const handleDeleteItem = (id: string) => {
    if (items.length <= 1) {
      // Keep at least one empty row
      onItemsChange([
        {
          id: 'item-' + Date.now(),
          name: '',
          hsnSac: '',
          quantity: 1,
          unit: 'PCS',
          pricePerUnit: 0,
          discountType: 'percent',
          discountValue: 0,
          gstRate: 18,
        },
      ]);
      return;
    }
    onItemsChange(items.filter((i) => i.id !== id));
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: any) => {
    const updated = [...items];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    onItemsChange(updated);
  };

  // Additional charges handlers
  const handleAddCharge = () => {
    const newCharge: AdditionalCharge = {
      id: 'chg-' + Date.now(),
      name: 'Shipping / Freight Charges',
      amount: 0,
      gstRate: 18,
    };
    onAdditionalChargesChange([...additionalCharges, newCharge]);
  };

  const handleDeleteCharge = (id: string) => {
    onAdditionalChargesChange(additionalCharges.filter((c) => c.id !== id));
  };

  const handleChargeChange = (index: number, field: keyof AdditionalCharge, value: any) => {
    const updated = [...additionalCharges];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    onAdditionalChargesChange(updated);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800 gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Products & Services
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Add line items, HSN/SAC codes, quantities, rates and applicable GST slabs
            </p>
          </div>
        </div>

        {/* Quick HSN suggestions shortcut */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-slate-400 font-medium">Quick HSN:</span>
          {POPULAR_HSN_SAC.slice(0, 3).map((h) => (
            <button
              key={h.code}
              type="button"
              onClick={() => {
                const updated = [...items];
                const lastIdx = updated.length - 1;
                if (lastIdx >= 0) {
                  updated[lastIdx].hsnSac = h.code;
                  if (!updated[lastIdx].name) updated[lastIdx].name = h.desc;
                  onItemsChange(updated);
                }
              }}
              className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/40 text-slate-600 dark:text-slate-300 transition"
              title={`${h.code} - ${h.desc}`}
            >
              {h.code} ({h.type})
            </button>
          ))}
        </div>
      </div>

      {/* Responsive Items Container */}
      <div className="space-y-4">
        {items.map((item, index) => {
          const qty = Math.max(0, Number(item.quantity) || 0);
          const price = Math.max(0, Number(item.pricePerUnit) || 0);
          const gross = roundTo2(qty * price);
          let discount = 0;
          if (item.discountType === 'percent') {
            discount = roundTo2((gross * Math.min(100, Math.max(0, Number(item.discountValue) || 0))) / 100);
          } else {
            discount = roundTo2(Math.min(gross, Math.max(0, Number(item.discountValue) || 0)));
          }
          const taxable = roundTo2(Math.max(0, gross - discount));
          const rate = Math.max(0, Number(item.gstRate) || 0);
          const taxAmt = roundTo2((taxable * rate) / 100);
          const rowTotal = roundTo2(taxable + taxAmt);

          return (
            <div
              key={item.id}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 transition-all hover:border-slate-300 dark:hover:border-slate-700"
            >
              {/* Row Header with Sl No. & Actions */}
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200/60 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[11px] flex items-center justify-center font-bold">
                    {index + 1}
                  </span>
                  Item #{index + 1}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleDuplicateItem(item)}
                    title="Duplicate item row"
                    className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 rounded hover:bg-slate-200 dark:hover:bg-slate-800 transition"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteItem(item.id)}
                    title="Delete item"
                    className="p-1.5 text-red-500 hover:text-red-700 dark:hover:text-red-400 rounded hover:bg-red-50 dark:hover:bg-red-950/40 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Input grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
                {/* Description */}
                <div className="lg:col-span-5">
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Description of Goods / Services <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Enterprise Cloud Consulting or Laptop Model X"
                    value={item.name}
                    onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                    className="w-full text-sm px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* HSN / SAC */}
                <div className="lg:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    HSN / SAC Code
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 998314"
                    value={item.hsnSac}
                    onChange={(e) => handleItemChange(index, 'hsnSac', e.target.value)}
                    className="w-full font-mono text-sm px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Quantity */}
                <div className="lg:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="0.01"
                    step="any"
                    placeholder="1"
                    value={item.quantity === 0 ? '' : item.quantity}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      handleItemChange(index, 'quantity', isNaN(val) ? 0 : Math.max(0, val));
                    }}
                    className="w-full text-sm px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Unit */}
                <div className="lg:col-span-3">
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Unit of Measurement
                  </label>
                  <select
                    value={item.unit}
                    onChange={(e) => handleItemChange(index, 'unit', e.target.value)}
                    className="w-full text-sm px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {COMMON_UNITS.map((u) => (
                      <option key={u.code} value={u.code}>
                        {u.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Rate / Price per unit */}
                <div className="lg:col-span-3">
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Rate / Unit (₹) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                      ₹
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      placeholder="0.00"
                      value={item.pricePerUnit === 0 ? '' : item.pricePerUnit}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        handleItemChange(index, 'pricePerUnit', isNaN(val) ? 0 : Math.max(0, val));
                      }}
                      className="w-full pl-7 pr-3 py-1.5 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Discount */}
                <div className="lg:col-span-3">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                      Discount
                    </label>
                    <div className="flex items-center rounded border border-slate-200 dark:border-slate-700 overflow-hidden text-[10px]">
                      <button
                        type="button"
                        onClick={() => handleItemChange(index, 'discountType', 'percent')}
                        className={`px-1.5 py-0.5 ${
                          item.discountType === 'percent'
                            ? 'bg-blue-600 text-white font-bold'
                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        %
                      </button>
                      <button
                        type="button"
                        onClick={() => handleItemChange(index, 'discountType', 'flat')}
                        className={`px-1.5 py-0.5 ${
                          item.discountType === 'flat'
                            ? 'bg-blue-600 text-white font-bold'
                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        ₹
                      </button>
                    </div>
                  </div>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    placeholder={item.discountType === 'percent' ? 'e.g. 10%' : 'e.g. 500'}
                    value={item.discountValue === 0 ? '' : item.discountValue}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      handleItemChange(index, 'discountValue', isNaN(val) ? 0 : Math.max(0, val));
                    }}
                    className="w-full text-sm px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* GST Rate */}
                <div className="lg:col-span-3">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                      GST Rate
                    </label>
                    <button
                      type="button"
                      onClick={() => handleItemChange(index, 'isCustomRate', !item.isCustomRate)}
                      className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {item.isCustomRate ? 'Preset Slabs' : 'Custom %'}
                    </button>
                  </div>
                  {item.isCustomRate ? (
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        placeholder="e.g. 7.5"
                        value={item.gstRate}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          handleItemChange(index, 'gstRate', isNaN(val) ? 0 : Math.max(0, val));
                        }}
                        className="w-full text-sm px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                        %
                      </span>
                    </div>
                  ) : (
                    <select
                      value={item.gstRate}
                      onChange={(e) => handleItemChange(index, 'gstRate', parseFloat(e.target.value))}
                      className="w-full text-sm px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                    >
                      {GST_RATES.map((r) => (
                        <option key={r} value={r}>
                          {r}% GST {r === 0 ? '(Nil/Exempt)' : ''}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Computed Values (Taxable & Row Total) */}
                <div className="lg:col-span-3 flex items-center justify-between bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700">
                  <div>
                    <span className="block text-[10px] text-slate-400 font-medium uppercase">
                      Taxable Val
                    </span>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {formatIndianCurrency(taxable)}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="block text-[10px] text-slate-400 font-medium uppercase">
                      {isIntraState
                        ? `Tax (${item.gstRate / 2}%+${item.gstRate / 2}%)`
                        : `Tax (${item.gstRate}%)`}
                    </span>
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                      {formatIndianCurrency(rowTotal)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Add Item Button */}
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            type="button"
            onClick={handleAddItem}
            className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-900 transition"
          >
            <Plus className="w-4 h-4" />
            Add Another Item
          </button>

          <button
            type="button"
            onClick={handleAddCharge}
            className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            <Plus className="w-4 h-4" />
            Add Freight / Additional Charges
          </button>
        </div>

        {/* Additional Charges Table if any */}
        {additionalCharges.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Additional Charges (Shipping, Packaging, Insurance)
            </h3>
            <div className="space-y-2">
              {additionalCharges.map((chg, idx) => (
                <div
                  key={chg.id}
                  className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700"
                >
                  <input
                    type="text"
                    placeholder="e.g. Shipping / Transport"
                    value={chg.name}
                    onChange={(e) => handleChargeChange(idx, 'name', e.target.value)}
                    className="flex-1 text-xs px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                  <div className="w-32 relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[11px] text-slate-400">
                      ₹
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      placeholder="0.00"
                      value={chg.amount === 0 ? '' : chg.amount}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        handleChargeChange(idx, 'amount', isNaN(val) ? 0 : Math.max(0, val));
                      }}
                      className="w-full pl-6 pr-2 py-1.5 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div className="w-24">
                    <select
                      value={chg.gstRate}
                      onChange={(e) => handleChargeChange(idx, 'gstRate', parseFloat(e.target.value))}
                      className="w-full text-xs px-2 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                    >
                      {GST_RATES.map((r) => (
                        <option key={r} value={r}>
                          {r}% GST
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteCharge(chg.id)}
                    className="p-1 text-red-500 hover:text-red-700 rounded"
                    title="Remove charge"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
