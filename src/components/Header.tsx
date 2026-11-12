import React from 'react';
import {
  FileText,
  PlusCircle,
  FolderOpen,
  Building2,
  Sparkles,
  Sun,
  Moon,
  Download,
  Printer,
  Eye,
  Edit3,
  Shield,
} from 'lucide-react';
import { PolicyTab } from './PolicyModal';

interface HeaderProps {
  onNewInvoice: () => void;
  onLoadDemo: () => void;
  onOpenHistory: () => void;
  onOpenProfile: () => void;
  onOpenPolicy: (tab: PolicyTab) => void;
  onDownloadPdf: () => void;
  onPrint: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  viewMode: 'split' | 'edit' | 'preview';
  onChangeViewMode: (mode: 'split' | 'edit' | 'preview') => void;
  savedCount: number;
  isGeneratingPdf: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onNewInvoice,
  onLoadDemo,
  onOpenHistory,
  onOpenProfile,
  onOpenPolicy,
  onDownloadPdf,
  onPrint,
  isDarkMode,
  onToggleDarkMode,
  viewMode,
  onChangeViewMode,
  savedCount,
  isGeneratingPdf,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors shadow-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand Identity */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20 font-bold text-xl">
              ET
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
                  GST Invoice Generator
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  by Afaq • EveryTool
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                Free GST Invoice Generator • 100% CBIC Rule 46 Compliant
              </p>
            </div>
          </div>

          {/* Center view mode selector (Desktop) */}
          <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => onChangeViewMode('edit')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                viewMode === 'edit'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              Editor Only
            </button>
            <button
              onClick={() => onChangeViewMode('split')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                viewMode === 'split'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Split Screen
            </button>
            <button
              onClick={() => onChangeViewMode('preview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                viewMode === 'preview'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              Preview Only
            </button>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Quick Demo */}
            <button
              onClick={onLoadDemo}
              title="Load realistic sample data"
              className="hidden lg:flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Demo Data
            </button>

            {/* Profile */}
            <button
              onClick={onOpenProfile}
              title="Save & Manage Company Profile"
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            >
              <Building2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span className="hidden sm:inline">My Business</span>
            </button>

            {/* Saved Invoices / History */}
            <button
              onClick={onOpenHistory}
              title="View saved invoices & drafts"
              className="relative flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            >
              <FolderOpen className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span className="hidden sm:inline">Invoices</span>
              {savedCount > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-blue-600 text-white">
                  {savedCount}
                </span>
              )}
            </button>

            {/* Legal & Policies */}
            <button
              onClick={() => onOpenPolicy('privacy')}
              title="Privacy Policy, Terms of Service & About"
              className="hidden md:flex items-center gap-1.5 text-xs font-medium px-2.5 py-2 rounded-lg text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            >
              <Shield className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Policies</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Print & PDF Actions */}
            <button
              onClick={onPrint}
              title="Print A4 Tax Invoice"
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              Print
            </button>

            <button
              onClick={onDownloadPdf}
              disabled={isGeneratingPdf}
              className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-sm shadow-blue-500/20 transition disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              {isGeneratingPdf ? 'Exporting...' : 'Download PDF'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
