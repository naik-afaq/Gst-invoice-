import React, { useEffect } from 'react';

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

interface AdSlotProps {
  slotId?: string;
  format?: 'auto' | 'horizontal' | 'rectangle';
  className?: string;
}

export const AdSlot: React.FC<AdSlotProps> = ({
  slotId = '5838781576751966',
  format = 'auto',
  className = '',
}) => {
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      // Ignore adsbygoogle errors when blocked by ad blockers or pending live approval
    }
  }, []);

  return (
    <div
      className={`my-6 mx-auto w-full max-w-5xl rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 p-3 text-center no-print ${className}`}
    >
      <div className="flex items-center justify-between pb-1 mb-1 border-b border-slate-200/50 dark:border-slate-800/50 text-[10px] uppercase font-bold tracking-widest text-slate-400">
        <span>Advertisement</span>
        <span className="text-[9px] font-normal normal-case">Google AdSense (ID: ca-pub-5838781576751966)</span>
      </div>

      {/* Ad container */}
      <div className="min-h-[90px] sm:min-h-[100px] flex items-center justify-center bg-white/70 dark:bg-slate-800/40 rounded-lg p-2 overflow-hidden relative">
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', minHeight: '90px' }}
          data-ad-client="ca-pub-5838781576751966"
          data-ad-slot={slotId}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
        <div className="text-center text-slate-400 select-none py-2 pointer-events-none">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Google AdSense Ad Space
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Auto-responsive AdSense banner connected to Publisher ID ca-pub-5838781576751966
          </p>
        </div>
      </div>
    </div>
  );
};
