import React, { useState, useEffect } from 'react';
import { ShieldCheck, Cookie, X } from 'lucide-react';
import { PolicyTab } from './PolicyModal';

interface CookieConsentBannerProps {
  onOpenPolicy: (tab: PolicyTab) => void;
}

export const CookieConsentBanner: React.FC<CookieConsentBannerProps> = ({ onOpenPolicy }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('everytool_cookie_consent');
    if (!consent) {
      // Small timeout so user sees smooth slide-in
      const timer = setTimeout(() => setIsVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('everytool_cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('everytool_cookie_consent', 'essential_only');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-in slide-in-from-bottom-5 duration-300 no-print">
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl text-slate-700 dark:text-slate-300 text-xs">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 shrink-0">
            <Cookie className="w-5 h-5" />
          </div>

          <div className="space-y-1.5 flex-1">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">
              Cookie & Privacy Notice
            </h4>
            <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
              We use cookies and local storage to save your invoice drafts, enhance your experience,
              and display non-intrusive ads via Google AdSense. Invoices remain strictly private on
              your device.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleAccept}
                className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition"
              >
                Accept All
              </button>
              <button
                type="button"
                onClick={handleDecline}
                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium text-xs transition"
              >
                Essential Only
              </button>
              <button
                type="button"
                onClick={() => onOpenPolicy('privacy')}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                Privacy Details
              </button>
            </div>
          </div>

          <button
            onClick={() => setIsVisible(false)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
