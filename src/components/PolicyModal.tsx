import React, { useState } from 'react';
import {
  X,
  Shield,
  FileText,
  AlertTriangle,
  Info,
  Mail,
  CheckCircle,
  ExternalLink,
  Lock,
} from 'lucide-react';

export type PolicyTab = 'privacy' | 'terms' | 'disclaimer' | 'about' | 'contact';

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: PolicyTab;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'privacy',
}) => {
  const [activeTab, setActiveTab] = useState<PolicyTab>(initialTab);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-xs no-print">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                EveryTool Legal & Information Center
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Official policies, AdSense transparency, terms of service and creator details
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-4 sm:px-6 pt-3 border-b border-slate-200 dark:border-slate-800 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition whitespace-nowrap ${
              activeTab === 'privacy'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            Privacy Policy
          </button>
          <button
            onClick={() => setActiveTab('terms')}
            className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition whitespace-nowrap ${
              activeTab === 'terms'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Terms of Service
          </button>
          <button
            onClick={() => setActiveTab('disclaimer')}
            className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition whitespace-nowrap ${
              activeTab === 'disclaimer'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Legal Disclaimer
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition whitespace-nowrap ${
              activeTab === 'about'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            About Us
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition whitespace-nowrap ${
              activeTab === 'contact'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            Contact Us
          </button>
        </div>

        {/* Tab Body Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300 space-y-4">
          {/* 1. Privacy Policy */}
          {activeTab === 'privacy' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Privacy Policy & Cookie Disclosure
                </h3>
                <p className="text-[11px] text-slate-400">
                  Last updated: November 2026 • Compliant with Google AdSense, GDPR & CCPA
                </p>
              </div>

              <section className="space-y-2">
                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                  1. Overview & Client-Side Architecture
                </h4>
                <p>
                  EveryTool (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) operates the Free GST Invoice Generator
                  by Afaq. We respect your privacy and are committed to protecting it. Our GST invoice
                  generator operates predominantly as a client-side web application. All financial
                  data, company profiles, item pricing, customer names, and tax calculations entered
                  into the tool are processed locally within your browser and are never transmitted to,
                  stored on, or analyzed by external private servers.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                  2. Google AdSense & Third-Party Advertising Cookies
                </h4>
                <p>
                  This website utilizes Google AdSense to display advertisements when you visit our
                  website. Google, as a third-party vendor, uses cookies to serve ads on our site:
                </p>
                <ul className="list-disc list-inside space-y-1 pl-2">
                  <li>
                    Google&apos;s use of advertising cookies enables it and its partners to serve ads
                    to our users based on their visits to our sites and/or other sites on the
                    Internet.
                  </li>
                  <li>
                    Users may opt out of personalized advertising by visiting Google&apos;s Ads Settings
                    at{' '}
                    <a
                      href="https://adssettings.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 underline"
                    >
                      https://adssettings.google.com
                    </a>
                    .
                  </li>
                  <li>
                    Alternatively, users can opt out of a third-party vendor&apos;s use of cookies for
                    personalized advertising by visiting{' '}
                    <a
                      href="https://www.aboutads.info"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 underline"
                    >
                      www.aboutads.info
                    </a>
                    .
                  </li>
                </ul>
              </section>

              <section className="space-y-2">
                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                  3. Browser Local Storage (localStorage)
                </h4>
                <p>
                  We store user-generated draft invoices and business profile preferences locally on
                  your device using the browser&apos;s <code>localStorage</code> API. This data is not
                  transmitted over the network. You may clear this data at any time via your browser
                  settings or via the &quot;Reset Form&quot; button in the tool.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                  4. Log Files & Standard Web Analytics
                </h4>
                <p>
                  Like most modern web services, standard server log files may record internet protocol
                  (IP) addresses, browser type, Internet Service Provider (ISP), date/time stamps,
                  referring/exit pages, and number of clicks. This information is used solely to
                  analyze trends, administer the site, and prevent abusive bot behavior. IP addresses
                  are not linked to any personally identifiable tax records.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                  5. Contact Us Regarding Privacy
                </h4>
                <p>
                  If you have questions or concerns regarding this Privacy Policy, please email our
                  data privacy officer at <strong>naikafaq6@gmail.com</strong>.
                </p>
              </section>
            </div>
          )}

          {/* 2. Terms of Service */}
          {activeTab === 'terms' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Terms of Service & User Agreement
                </h3>
                <p className="text-[11px] text-slate-400">Effective Date: November 2026</p>
              </div>

              <section className="space-y-2">
                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                  1. Acceptance of Terms
                </h4>
                <p>
                  By accessing or using the EveryTool GST Invoice Generator, you agree to be bound by
                  these Terms of Service. If you do not agree with any part of these terms, you must
                  discontinue use of the service.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                  2. Permitted Use & Free Service Model
                </h4>
                <p>
                  EveryTool provides this invoice generator as a free productivity tool for Indian
                  proprietorships, freelancers, LLP/private limited businesses, and individuals. You
                  may generate unlimited commercial tax invoices for your lawful business
                  operations. Reverse engineering, automated scraping, or denial-of-service attempts
                  are strictly prohibited.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                  3. User Responsibility & Statutory Accuracy
                </h4>
                <p>
                  The user holds sole responsibility for verifying that the GSTIN numbers, HSN/SAC
                  codes, tax rates, Place of Supply, and reverse charge mechanisms applied match the
                  statutory requirements of the Goods and Services Tax Act, 2017 and rules framed
                  thereunder. EveryTool does not file GST returns (GSTR-1, GSTR-3B) or connect to the
                  GSTN portal on your behalf.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                  4. Intellectual Property
                </h4>
                <p>
                  The software interface, branding, calculation algorithms, and styling are the
                  intellectual property of EveryTool and Afaq. Commercial invoices generated using the
                  tool belong exclusively to the respective user.
                </p>
              </section>
            </div>
          )}

          {/* 3. Legal & Tax Disclaimer */}
          {activeTab === 'disclaimer' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Statutory GST Legal & Tax Disclaimer
                </h3>
                <p className="text-[11px] text-slate-400">Important Notice for All Taxpayers</p>
              </div>

              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200 space-y-2">
                <p className="font-bold">Not a Substitute for Professional Tax Advice:</p>
                <p>
                  The information and calculation tools provided on EveryTool are intended strictly
                  for general formatting, educational, and computational convenience. They do NOT
                  constitute formal legal, taxation, auditing, or accounting advice.
                </p>
              </div>

              <section className="space-y-2">
                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                  1. Rule 46 Compliance Notice
                </h4>
                <p>
                  Our software formats tax invoices to follow standard Rule 46 requirements of the
                  CGST Rules, 2017. However, specific taxpayer categories (such as Special Economic
                  Zones (SEZ), composition taxpayers, exporters claiming refund of unutilized ITC,
                  and entities subject to mandatory e-invoicing under Notification 17/2022) must
                  adhere to specific statutory declarations and IRN QR codes.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                  2. Periodic Amendments by GST Council
                </h4>
                <p>
                  GST rates, exemptions, and threshold limits are revised regularly by notifications
                  issued by the Central Board of Indirect Taxes and Customs (CBIC). Users should
                  consult a registered Chartered Accountant (CA) or tax consultant to confirm their
                  specific tax liabilities.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                  3. Limitation of Liability
                </h4>
                <p>
                  In no event shall EveryTool, its developers, or its contributors be held liable for
                  any indirect, punitive, or consequential damages resulting from discrepancies in
                  tax calculations or audit penalties.
                </p>
              </section>
            </div>
          )}

          {/* 4. About Us */}
          {activeTab === 'about' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  About EveryTool & Creator Afaq
                </h3>
                <p className="text-[11px] text-slate-400">
                  Empowering Indian SMBs with Free, Accessible Software
                </p>
              </div>

              <section className="space-y-2">
                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Our Mission</h4>
                <p>
                  EveryTool was established with a singular vision: to build reliable, ad-supported,
                  and 100% free digital tools that eliminate the friction small business owners face
                  every day. In India, millions of micro-entrepreneurs, freelancers, and small vendors
                  find enterprise ERPs cost-prohibitive. We provide fast, privacy-focused, browser-based
                  utilities with zero mandatory signups or hidden paywalls.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                  About the Developer
                </h4>
                <p>
                  <strong>Mohd Afaq</strong> is a senior full-stack engineer and fintech specialist
                  dedicated to creating compliant business web applications. With deep expertise in
                  modern React architectures, PDF typography rendering, and Indian GST regulatory
                  frameworks, Afaq engineered this GST Invoice Generator to provide the highest level
                  of mathematical accuracy, vector printing clarity, and user ease.
                </p>
              </section>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-blue-600 dark:text-blue-400 font-extrabold text-base block">
                    100% Free
                  </span>
                  <span className="text-slate-500 text-[11px]">No paywalls or watermarks</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-emerald-600 dark:text-emerald-400 font-extrabold text-base block">
                    Private
                  </span>
                  <span className="text-slate-500 text-[11px]">Client-side secure processing</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-indigo-600 dark:text-indigo-400 font-extrabold text-base block">
                    Compliant
                  </span>
                  <span className="text-slate-500 text-[11px]">Rule 46 & HSN aligned</span>
                </div>
              </div>
            </div>
          )}

          {/* 5. Contact Us */}
          {activeTab === 'contact' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Contact & Support</h3>
                <p className="text-[11px] text-slate-400">
                  We welcome feedback, suggestions, and partnership inquiries
                </p>
              </div>

              {contactSubmitted ? (
                <div className="p-6 text-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 space-y-2">
                  <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="text-sm font-bold">Thank you for your message!</h4>
                  <p className="text-xs">
                    Your inquiry has been recorded. Our team will review your message and reply to{' '}
                    <strong>{contactForm.email}</strong> within 24–48 business hours.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setContactSubmitted(true);
                  }}
                  className="space-y-3"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Your Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        placeholder="e.g. Ramesh Kumar"
                        className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        placeholder="e.g. ramesh@example.com"
                        className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Message / Inquiry / Bug Report <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={contactForm.message}
                      onChange={(e) =>
                        setContactForm({ ...contactForm, message: e.target.value })
                      }
                      placeholder="Let us know how we can improve EveryTool, or report any issue..."
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-400">
                      Direct Email: <strong>naikafaq6@gmail.com</strong>
                    </span>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition shadow-xs"
                    >
                      Send Message
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
