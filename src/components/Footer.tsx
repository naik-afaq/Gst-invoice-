import React from 'react';
import {
  Shield,
  FileText,
  AlertTriangle,
  Info,
  Mail,
  Heart,
  ExternalLink,
  Layers,
} from 'lucide-react';
import { PolicyTab } from './PolicyModal';

interface FooterProps {
  onOpenPolicy: (tab: PolicyTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPolicy }) => {
  return (
    <footer className="mt-16 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 text-xs no-print transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Brand & Mission */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center space-x-2.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600 text-white font-extrabold text-sm shadow-sm">
                ET
              </div>
              <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                EveryTool
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              EveryTool is India&apos;s free productivity platform. Built by Afaq to empower
              freelancers, small businesses, and accountants with zero-cost, compliant web utilities.
            </p>
            <div className="text-[11px] text-slate-400">
              <span>Tool: </span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                GST Invoice Generator
              </span>
            </div>
          </div>

          {/* Col 2: GST Utilities & Tools */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
              Business Utilities
            </h4>
            <ul className="space-y-1.5">
              <li>
                <a href="#editor" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
                  Free GST Invoice Maker
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
                  Indian GST Tax Slabs & Rules
                </a>
              </li>
              <li>
                <a href="#hsn" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
                  HSN / SAC Code Directory
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
                  CGST, SGST & IGST Calculator
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
                  Reverse Charge (RCM) Guide
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Compliance & Legal Policies (AdSense Mandatory) */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
              Legal & Compliance
            </h4>
            <ul className="space-y-1.5">
              <li>
                <button
                  type="button"
                  onClick={() => onOpenPolicy('privacy')}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition text-left flex items-center gap-1.5"
                >
                  <Shield className="w-3.5 h-3.5 text-blue-500" />
                  Privacy Policy & Cookies
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenPolicy('terms')}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition text-left flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenPolicy('disclaimer')}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition text-left flex items-center gap-1.5"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  Statutory Tax Disclaimer
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenPolicy('about')}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition text-left flex items-center gap-1.5"
                >
                  <Info className="w-3.5 h-3.5 text-indigo-500" />
                  About EveryTool & Creator
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenPolicy('contact')}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition text-left flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5 text-emerald-500" />
                  Contact Support
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Trust & Verification */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
              Transparency & Security
            </h4>
            <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
              All financial values, GSTINs, and customer lists are kept strictly client-side. We do
              not store your invoices on third-party tracking databases.
            </p>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-[11px] space-y-1">
              <span className="font-bold text-slate-800 dark:text-slate-200 block">
                Rule 46 Compliant Formats
              </span>
              <span className="text-slate-500 block">
                Aligned with Central Goods and Services Tax Rules, 2017.
              </span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400 text-[11px]">
          <div>
            &copy; {new Date().getFullYear()} EveryTool. All rights reserved. GST Invoice Generator
            by Afaq.
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <button
              onClick={() => onOpenPolicy('privacy')}
              className="hover:text-slate-600 dark:hover:text-slate-200 transition"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              onClick={() => onOpenPolicy('terms')}
              className="hover:text-slate-600 dark:hover:text-slate-200 transition"
            >
              Terms of Service
            </button>
            <span>•</span>
            <button
              onClick={() => onOpenPolicy('disclaimer')}
              className="hover:text-slate-600 dark:hover:text-slate-200 transition"
            >
              Legal Disclaimer
            </button>
            <span>•</span>
            <button
              onClick={() => onOpenPolicy('contact')}
              className="hover:text-slate-600 dark:hover:text-slate-200 transition"
            >
              naikafaq6@gmail.com
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
