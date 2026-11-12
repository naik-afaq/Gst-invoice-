import React from 'react';
import { Calculator, ShieldCheck, ArrowRight, Check } from 'lucide-react';
import { CalculationSummary } from '../types/invoice';
import { formatIndianCurrency } from '../utils/gstCalculations';

interface SummaryCardProps {
  summary: CalculationSummary;
  autoRoundOff: boolean;
  onToggleRoundOff: (enabled: boolean) => void;
  supplierState: string;
  placeOfSupply: string;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  summary,
  autoRoundOff,
  onToggleRoundOff,
  supplierState,
  placeOfSupply,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs transition-colors">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
            <Calculator className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            GST Tax Breakdown & Total
          </h2>
        </div>

        <div className="text-[11px] font-semibold flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>
            {summary.isIntraState
              ? 'Intra-State: CGST + SGST'
              : 'Inter-State: IGST'}
          </span>
        </div>
      </div>

      {/* Tax Determination Reason */}
      <div className="mb-4 text-xs p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-between">
        <div>
          <span className="font-medium text-slate-500 dark:text-slate-400">Place of Supply: </span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">{placeOfSupply}</span>
        </div>
        <div className="text-slate-400 text-[11px]">
          {summary.isIntraState
            ? '(Matches supplier state → 50% CGST + 50% SGST)'
            : '(Differs from supplier state → 100% IGST)'}
        </div>
      </div>

      {/* Line item amounts */}
      <div className="space-y-2 text-xs">
        <div className="flex justify-between text-slate-600 dark:text-slate-400">
          <span>Gross Subtotal</span>
          <span className="font-medium text-slate-800 dark:text-slate-200">
            {formatIndianCurrency(summary.subtotal)}
          </span>
        </div>

        {summary.totalDiscount > 0 && (
          <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
            <span>Total Discount (-)</span>
            <span className="font-medium">
              - {formatIndianCurrency(summary.totalDiscount)}
            </span>
          </div>
        )}

        <div className="flex justify-between text-slate-800 dark:text-slate-200 font-semibold pt-1 border-t border-slate-100 dark:border-slate-800">
          <span>Net Taxable Value</span>
          <span>{formatIndianCurrency(summary.taxableAmount)}</span>
        </div>

        {/* GST Breakdowns */}
        {summary.isIntraState ? (
          <>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1">
                Central GST (CGST)
              </span>
              <span className="font-medium text-slate-800 dark:text-slate-200">
                + {formatIndianCurrency(summary.totalCgst)}
              </span>
            </div>

            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1">
                State GST (SGST)
              </span>
              <span className="font-medium text-slate-800 dark:text-slate-200">
                + {formatIndianCurrency(summary.totalSgst)}
              </span>
            </div>
          </>
        ) : (
          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span className="flex items-center gap-1">
              Integrated GST (IGST)
            </span>
            <span className="font-medium text-slate-800 dark:text-slate-200">
              + {formatIndianCurrency(summary.totalIgst)}
            </span>
          </div>
        )}

        {summary.additionalChargesTotal > 0 && (
          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span>Freight & Additional Charges</span>
            <span className="font-medium text-slate-800 dark:text-slate-200">
              + {formatIndianCurrency(summary.additionalChargesTotal)}
            </span>
          </div>
        )}

        {/* Round off toggle */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={autoRoundOff}
              onChange={(e) => onToggleRoundOff(e.target.checked)}
              className="w-3.5 h-3.5 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
            />
            <span className="text-[11px] font-medium">Auto Round-off (Paise)</span>
          </label>
          <span className="font-mono text-xs">
            {summary.roundOff >= 0 ? '+' : ''}
            {formatIndianCurrency(summary.roundOff)}
          </span>
        </div>

        {/* Grand Total */}
        <div className="pt-3 border-t-2 border-slate-200 dark:border-slate-700 flex items-baseline justify-between">
          <span className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
            Grand Total
          </span>
          <span className="text-xl font-extrabold text-blue-600 dark:text-blue-400 tracking-tight">
            {formatIndianCurrency(summary.grandTotal)}
          </span>
        </div>

        {/* Amount in words */}
        <div className="mt-3 p-2.5 rounded-lg bg-blue-50/60 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 text-blue-900 dark:text-blue-200 text-[11px] leading-relaxed">
          <span className="font-bold block text-[10px] text-blue-700 dark:text-blue-300 uppercase tracking-wider mb-0.5">
            Amount In Words:
          </span>
          {summary.amountInWords}
        </div>
      </div>
    </div>
  );
};
