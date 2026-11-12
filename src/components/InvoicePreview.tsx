import React, { useEffect, useState } from 'react';
import {
  BusinessProfile,
  CalculationSummary,
  CustomerDetails,
  InvoiceDetails,
  InvoiceItem,
} from '../types/invoice';
import { formatIndianCurrency } from '../utils/gstCalculations';
import { generateUpiQrDataUrl } from '../utils/qrCode';

interface InvoicePreviewProps {
  business: BusinessProfile;
  customer: CustomerDetails;
  details: InvoiceDetails;
  items: InvoiceItem[];
  summary: CalculationSummary;
}

export const InvoicePreview: React.FC<InvoicePreviewProps> = ({
  business,
  customer,
  details,
  items,
  summary,
}) => {
  const [upiQrUrl, setUpiQrUrl] = useState<string>('');

  useEffect(() => {
    let isMounted = true;
    if (business.upiId) {
      generateUpiQrDataUrl(
        business.upiId,
        business.name,
        summary.grandTotal,
        details.invoiceNumber
      ).then((dataUrl) => {
        if (isMounted) setUpiQrUrl(dataUrl);
      });
    } else {
      setUpiQrUrl('');
    }
    return () => {
      isMounted = false;
    };
  }, [business.upiId, business.name, summary.grandTotal, details.invoiceNumber]);

  return (
    <div
      id="invoice-print-area"
      className="bg-white text-slate-900 mx-auto w-full max-w-[210mm] min-h-[297mm] p-6 sm:p-8 font-sans shadow-lg border border-slate-200 transition-all text-xs print:p-0 print:border-none print:shadow-none print:max-w-none"
      style={{
        fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Top Bar with Tax Invoice & Copy Badge */}
      <div className="flex items-center justify-between pb-4 border-b-2 border-slate-900 mb-4">
        <div>
          <span className="text-[10px] tracking-wider uppercase font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            Original For Recipient
          </span>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 mt-1 uppercase">
            Tax Invoice
          </h1>
          <p className="text-[10px] text-slate-500 font-medium">
            Issued under Section 31 of CGST Act, 2017 & Rule 46 of CGST Rules
          </p>
        </div>

        {/* Business Logo if provided */}
        {business.logoUrl && business.logoUrl.trim() ? (
          <img
            src={business.logoUrl}
            alt="Company Logo"
            className="max-h-14 max-w-[160px] object-contain"
          />
        ) : (
          <div className="text-right">
            <span className="text-base font-extrabold text-blue-700 tracking-tight">
              {business.name || 'COMPANY NAME'}
            </span>
          </div>
        )}
      </div>

      {/* Supplier & Invoice Metadata Header Grid */}
      <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-200 mb-4">
        {/* Supplier / Issuer Details */}
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block mb-1">
            Sold By / Supplier Details
          </span>
          <div className="text-sm font-bold text-slate-950">
            {business.name || 'Your Business Name'}
          </div>
          <div className="text-slate-600 leading-relaxed text-[11px] whitespace-pre-line mt-0.5">
            {business.address || 'Business registered address'}
          </div>
          <div className="mt-2 space-y-0.5 text-[11px] font-medium">
            <div>
              <span className="font-bold text-slate-800">GSTIN: </span>
              <span className="font-mono font-semibold text-blue-900">
                {business.gstin || 'Not Provided'}
              </span>
            </div>
            {business.pan && (
              <div>
                <span className="font-bold text-slate-800">PAN: </span>
                <span className="font-mono text-slate-700">{business.pan}</span>
              </div>
            )}
            <div>
              <span className="font-bold text-slate-800">State: </span>
              <span>
                {business.state} (Code: {business.stateCode || '--'})
              </span>
            </div>
            {(business.phone || business.email) && (
              <div className="text-slate-500 text-[10px]">
                {business.phone && <span>Tel: {business.phone} </span>}
                {business.email && <span>• Email: {business.email}</span>}
              </div>
            )}
          </div>
        </div>

        {/* Invoice Metadata */}
        <div className="bg-slate-50 p-3 rounded border border-slate-200">
          <table className="w-full text-[11px]">
            <tbody>
              <tr>
                <td className="font-bold text-slate-700 py-0.5">Invoice No:</td>
                <td className="font-mono font-bold text-slate-950 text-right py-0.5">
                  {details.invoiceNumber || 'INV-001'}
                </td>
              </tr>
              <tr>
                <td className="font-medium text-slate-600 py-0.5">Invoice Date:</td>
                <td className="font-medium text-slate-900 text-right py-0.5">
                  {details.invoiceDate || '--'}
                </td>
              </tr>
              {details.dueDate && (
                <tr>
                  <td className="font-medium text-slate-600 py-0.5">Due Date:</td>
                  <td className="font-medium text-slate-900 text-right py-0.5">
                    {details.dueDate}
                  </td>
                </tr>
              )}
              <tr>
                <td className="font-bold text-slate-700 py-0.5">Place of Supply:</td>
                <td className="font-semibold text-slate-900 text-right py-0.5">
                  {details.placeOfSupply} (Code: {details.placeOfSupplyCode || '--'})
                </td>
              </tr>
              <tr>
                <td className="font-medium text-slate-600 py-0.5">Reverse Charge:</td>
                <td className="font-medium text-slate-900 text-right py-0.5">
                  {details.reverseCharge ? 'Yes' : 'No'}
                </td>
              </tr>
              {details.poNumber && (
                <tr>
                  <td className="font-medium text-slate-600 py-0.5">PO / Ref No:</td>
                  <td className="font-mono text-slate-900 text-right py-0.5">
                    {details.poNumber}
                  </td>
                </tr>
              )}
              {details.paymentTerms && (
                <tr>
                  <td className="font-medium text-slate-600 py-0.5">Payment Terms:</td>
                  <td className="font-medium text-slate-900 text-right py-0.5">
                    {details.paymentTerms}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bill To & Ship To Grid */}
      <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-200 mb-4">
        {/* Bill To */}
        <div className="p-3 rounded border border-slate-200">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block mb-1">
            Billed To (Customer / Buyer)
          </span>
          <div className="text-sm font-bold text-slate-950">
            {customer.name || 'Client Name'}
          </div>
          <div className="text-slate-600 text-[11px] leading-relaxed whitespace-pre-line mt-0.5">
            {customer.billingAddress || 'Billing address'}
          </div>
          <div className="mt-2 space-y-0.5 text-[11px]">
            <div>
              <span className="font-bold text-slate-800">GSTIN: </span>
              <span className="font-mono font-semibold text-slate-900">
                {customer.gstin || 'Unregistered / Consumer'}
              </span>
            </div>
            <div>
              <span className="font-bold text-slate-800">State: </span>
              <span>
                {customer.state} (Code: {customer.stateCode || '--'})
              </span>
            </div>
            {(customer.phone || customer.email) && (
              <div className="text-slate-500 text-[10px]">
                {customer.phone && <span>Tel: {customer.phone} </span>}
                {customer.email && <span>• Email: {customer.email}</span>}
              </div>
            )}
          </div>
        </div>

        {/* Ship To */}
        <div className="p-3 rounded border border-slate-200">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block mb-1">
            Shipped To (Consignee)
          </span>
          <div className="text-sm font-bold text-slate-950">
            {customer.name || 'Client Name'}
          </div>
          <div className="text-slate-600 text-[11px] leading-relaxed whitespace-pre-line mt-0.5">
            {customer.sameAsBilling
              ? customer.billingAddress || 'Same as billing address'
              : customer.shippingAddress || 'Shipping address'}
          </div>
          <div className="mt-2 text-[11px]">
            <span className="font-bold text-slate-800">Destination State: </span>
            <span>{details.placeOfSupply}</span>
          </div>
        </div>
      </div>

      {/* Main Items Table */}
      <div className="mb-4 overflow-x-auto">
        <table className="w-full border-collapse border border-slate-300 text-[11px]">
          <thead>
            <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
              <th className="p-1.5 border-r border-slate-300 text-center w-8">#</th>
              <th className="p-1.5 border-r border-slate-300 text-left">Description</th>
              <th className="p-1.5 border-r border-slate-300 text-center w-16">HSN/SAC</th>
              <th className="p-1.5 border-r border-slate-300 text-center w-12">Qty</th>
              <th className="p-1.5 border-r border-slate-300 text-right w-16">Rate (₹)</th>
              <th className="p-1.5 border-r border-slate-300 text-right w-14">Disc</th>
              <th className="p-1.5 border-r border-slate-300 text-right w-20">Taxable (₹)</th>
              {summary.isIntraState ? (
                <>
                  <th className="p-1.5 border-r border-slate-300 text-right w-16">CGST</th>
                  <th className="p-1.5 border-r border-slate-300 text-right w-16">SGST</th>
                </>
              ) : (
                <th className="p-1.5 border-r border-slate-300 text-right w-20">IGST</th>
              )}
              <th className="p-1.5 text-right w-20">Total (₹)</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => {
              const qty = Math.max(0, Number(item.quantity) || 0);
              const price = Math.max(0, Number(item.pricePerUnit) || 0);
              const gross = qty * price;
              let discAmt = 0;
              if (item.discountType === 'percent') {
                discAmt = (gross * (Number(item.discountValue) || 0)) / 100;
              } else {
                discAmt = Number(item.discountValue) || 0;
              }
              const taxable = Math.max(0, gross - discAmt);
              const rate = Number(item.gstRate) || 0;
              const taxAmt = (taxable * rate) / 100;
              const lineTotal = taxable + taxAmt;

              return (
                <tr
                  key={item.id}
                  className="border-b border-slate-200 hover:bg-slate-50/50"
                >
                  <td className="p-1.5 border-r border-slate-200 text-center font-mono text-slate-500">
                    {idx + 1}
                  </td>
                  <td className="p-1.5 border-r border-slate-200 font-medium text-slate-900">
                    {item.name || 'Untitled Item'}
                  </td>
                  <td className="p-1.5 border-r border-slate-200 text-center font-mono text-slate-600">
                    {item.hsnSac || '--'}
                  </td>
                  <td className="p-1.5 border-r border-slate-200 text-center font-medium">
                    {item.quantity} {item.unit}
                  </td>
                  <td className="p-1.5 border-r border-slate-200 text-right font-mono">
                    {formatIndianCurrency(item.pricePerUnit, false)}
                  </td>
                  <td className="p-1.5 border-r border-slate-200 text-right font-mono text-slate-500">
                    {discAmt > 0 ? formatIndianCurrency(discAmt, false) : '-'}
                  </td>
                  <td className="p-1.5 border-r border-slate-200 text-right font-mono font-medium">
                    {formatIndianCurrency(taxable, false)}
                  </td>
                  {summary.isIntraState ? (
                    <>
                      <td className="p-1.5 border-r border-slate-200 text-right font-mono text-[10px]">
                        <div>{formatIndianCurrency(taxAmt / 2, false)}</div>
                        <div className="text-slate-400">@{rate / 2}%</div>
                      </td>
                      <td className="p-1.5 border-r border-slate-200 text-right font-mono text-[10px]">
                        <div>{formatIndianCurrency(taxAmt / 2, false)}</div>
                        <div className="text-slate-400">@{rate / 2}%</div>
                      </td>
                    </>
                  ) : (
                    <td className="p-1.5 border-r border-slate-200 text-right font-mono text-[10px]">
                      <div>{formatIndianCurrency(taxAmt, false)}</div>
                      <div className="text-slate-400">@{rate}%</div>
                    </td>
                  )}
                  <td className="p-1.5 text-right font-mono font-bold text-slate-900">
                    {formatIndianCurrency(lineTotal, false)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Financials & HSN Summary Row */}
      <div className="grid grid-cols-12 gap-4 pb-4 border-b border-slate-200 mb-4">
        {/* Left Side: HSN / SAC Summary Table (Rule 46 compliance) */}
        <div className="col-span-12 lg:col-span-7">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-600 block mb-1">
            HSN / SAC Wise Tax Breakdown
          </span>
          <table className="w-full border-collapse border border-slate-300 text-[10px]">
            <thead>
              <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-300">
                <th className="p-1 border-r border-slate-300 text-center">HSN/SAC</th>
                <th className="p-1 border-r border-slate-300 text-right">Taxable Val</th>
                {summary.isIntraState ? (
                  <>
                    <th className="p-1 border-r border-slate-300 text-right">CGST</th>
                    <th className="p-1 border-r border-slate-300 text-right">SGST</th>
                  </>
                ) : (
                  <th className="p-1 border-r border-slate-300 text-right">IGST</th>
                )}
                <th className="p-1 text-right">Total Tax</th>
              </tr>
            </thead>
            <tbody>
              {summary.hsnSummary.map((hsn, i) => (
                <tr key={i} className="border-b border-slate-200 font-mono">
                  <td className="p-1 border-r border-slate-200 text-center font-bold">
                    {hsn.hsnSac}
                  </td>
                  <td className="p-1 border-r border-slate-200 text-right">
                    {formatIndianCurrency(hsn.taxableValue, false)}
                  </td>
                  {summary.isIntraState ? (
                    <>
                      <td className="p-1 border-r border-slate-200 text-right">
                        {formatIndianCurrency(hsn.cgstAmount, false)} ({hsn.gstRate / 2}%)
                      </td>
                      <td className="p-1 border-r border-slate-200 text-right">
                        {formatIndianCurrency(hsn.sgstAmount, false)} ({hsn.gstRate / 2}%)
                      </td>
                    </>
                  ) : (
                    <td className="p-1 border-r border-slate-200 text-right">
                      {formatIndianCurrency(hsn.igstAmount, false)} ({hsn.gstRate}%)
                    </td>
                  )}
                  <td className="p-1 text-right font-bold">
                    {formatIndianCurrency(hsn.totalTax, false)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Amount In Words */}
          <div className="mt-3 p-2.5 rounded bg-slate-50 border border-slate-200 text-[11px] leading-relaxed">
            <span className="font-bold text-slate-800 uppercase text-[10px] block mb-0.5">
              Invoice Amount in Words:
            </span>
            <span className="font-medium text-slate-900">{summary.amountInWords}</span>
          </div>
        </div>

        {/* Right Side: Totals Card */}
        <div className="col-span-12 lg:col-span-5 bg-slate-50/70 p-3 rounded border border-slate-200">
          <table className="w-full text-[11px]">
            <tbody>
              <tr>
                <td className="text-slate-600 py-0.5">Total Taxable Value:</td>
                <td className="text-right font-mono font-medium py-0.5">
                  {formatIndianCurrency(summary.taxableAmount)}
                </td>
              </tr>
              {summary.isIntraState ? (
                <>
                  <tr>
                    <td className="text-slate-600 py-0.5">Central Tax (CGST):</td>
                    <td className="text-right font-mono font-medium py-0.5">
                      {formatIndianCurrency(summary.totalCgst)}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-slate-600 py-0.5">State Tax (SGST):</td>
                    <td className="text-right font-mono font-medium py-0.5">
                      {formatIndianCurrency(summary.totalSgst)}
                    </td>
                  </tr>
                </>
              ) : (
                <tr>
                  <td className="text-slate-600 py-0.5">Integrated Tax (IGST):</td>
                  <td className="text-right font-mono font-medium py-0.5">
                    {formatIndianCurrency(summary.totalIgst)}
                  </td>
                </tr>
              )}
              {summary.additionalChargesTotal > 0 && (
                <tr>
                  <td className="text-slate-600 py-0.5">Additional Charges:</td>
                  <td className="text-right font-mono font-medium py-0.5">
                    {formatIndianCurrency(summary.additionalChargesTotal)}
                  </td>
                </tr>
              )}
              {summary.roundOff !== 0 && (
                <tr>
                  <td className="text-slate-600 py-0.5">Round Off:</td>
                  <td className="text-right font-mono text-slate-600 py-0.5">
                    {summary.roundOff >= 0 ? '+' : ''}
                    {formatIndianCurrency(summary.roundOff)}
                  </td>
                </tr>
              )}
              <tr className="border-t-2 border-slate-900">
                <td className="pt-2 text-sm font-black text-slate-950 uppercase">
                  Grand Total:
                </td>
                <td className="pt-2 text-right font-mono text-base font-black text-blue-700">
                  {formatIndianCurrency(summary.grandTotal)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Bank Details, UPI Scan & Pay, Terms, and Signatory Footer */}
      <div className="grid grid-cols-12 gap-4 pt-1">
        {/* Bank & UPI Section */}
        <div className="col-span-12 sm:col-span-7 space-y-3">
          {/* Bank details block */}
          {business.bankName && (
            <div className="p-2.5 rounded border border-slate-200 bg-slate-50/50">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-600 block mb-1">
                Bank Transfer Information
              </span>
              <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[11px]">
                <div>
                  <span className="text-slate-500">Bank:</span>{' '}
                  <span className="font-semibold text-slate-900">{business.bankName}</span>
                </div>
                <div>
                  <span className="text-slate-500">A/C No:</span>{' '}
                  <span className="font-mono font-bold text-slate-900">
                    {business.accountNumber}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">A/C Holder:</span>{' '}
                  <span className="font-medium text-slate-900">
                    {business.accountHolder || business.name}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">IFSC Code:</span>{' '}
                  <span className="font-mono font-bold text-blue-900">{business.ifscCode}</span>
                </div>
                {business.branch && (
                  <div className="col-span-2 text-[10px] text-slate-500">
                    Branch: {business.branch}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* UPI QR Code Block if UPI provided */}
          {business.upiId && upiQrUrl && (
            <div className="flex items-center gap-3 p-2 rounded border border-slate-200 bg-slate-50/50">
              <img
                src={upiQrUrl}
                alt="UPI QR Code"
                className="w-16 h-16 object-contain border border-slate-200 rounded p-0.5 bg-white"
              />
              <div className="text-[11px]">
                <span className="font-bold text-slate-900 block">Instant UPI Payment</span>
                <span className="text-[10px] text-slate-600 block">
                  Scan with GPay, PhonePe, Paytm, or BHIM
                </span>
                <span className="font-mono text-[10px] text-blue-800 font-semibold block mt-0.5">
                  UPI ID: {business.upiId}
                </span>
              </div>
            </div>
          )}

          {/* Terms & Conditions */}
          {details.termsAndConditions.length > 0 && (
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-600 block mb-1">
                Terms & Conditions
              </span>
              <ol className="list-decimal list-inside text-[10px] text-slate-600 space-y-0.5">
                {details.termsAndConditions.map((term, i) => (
                  <li key={i}>{term}</li>
                ))}
              </ol>
            </div>
          )}
        </div>

        {/* Authorized Signatory Section */}
        <div className="col-span-12 sm:col-span-5 flex flex-col justify-between items-end text-right">
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
              For {business.name || 'Supplier'}
            </span>
          </div>

          <div className="w-full flex flex-col items-end pt-8">
            {details.signatureUrl && details.signatureUrl.trim() ? (
              <img
                src={details.signatureUrl}
                alt="Signature"
                className="max-h-16 object-contain mb-1"
              />
            ) : (
              <div className="h-12 flex items-end">
                <span className="text-[10px] font-mono text-slate-400 italic">
                  [Authorized Signature]
                </span>
              </div>
            )}
            <div className="w-48 border-t border-slate-900 mt-1 pt-1 text-center">
              <span className="font-bold text-slate-950 block text-[11px]">
                {details.signatoryName || 'Authorized Signatory'}
              </span>
              <span className="text-[10px] text-slate-500 block">
                {details.signatoryDesignation || 'Designated Partner / Director'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Compliance Footer */}
      <div className="mt-6 pt-3 border-t border-slate-200 text-center text-[10px] text-slate-400">
        Generated with EveryTool GST Invoice Maker • Valid computer generated tax invoice requiring authorized digital signature under GST laws.
      </div>
    </div>
  );
};
