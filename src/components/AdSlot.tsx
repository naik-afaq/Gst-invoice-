import React from 'react';

interface AdSlotProps {
  slotId?: string;
  format?: 'auto' | 'horizontal' | 'rectangle';
  className?: string;
}

export const AdSlot: React.FC<AdSlotProps> = ({
  slotId = '1234567890',
  format = 'auto',
  className = '',
}) => {
  return (
    <div
      className={`my-6 mx-auto w-full max-w-5xl rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 p-3 text-center no-print ${className}`}
    >
      <div className="flex items-center justify-between pb-1 mb-1 border-b border-slate-200/50 dark:border-slate-800/50 text-[10px] uppercase font-bold tracking-widest text-slate-400">
        <span>Advertisement</span>
        <span className="text-[9px] font-normal normal-case">Google AdSense Partner</span>
      </div>

      {/* Ad container */}
      <div className="min-h-[90px] sm:min-h-[100px] flex items-center justify-center bg-white/70 dark:bg-slate-800/40 rounded-lg p-2 overflow-hidden">
        {/* Placeholder rendered when live ads are pending publisher configuration */}
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', minHeight: '90px' }}
          data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
          data-ad-slot={slotId}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
        <div className="text-center text-slate-400 select-none py-2">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Google AdSense Ad Space
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Compliant responsive banner placement (Auto-adapts to mobile & desktop screens)
          </p>
        </div>
      </div>
    </div>
  );
};
