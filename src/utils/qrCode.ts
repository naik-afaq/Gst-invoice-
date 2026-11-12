import QRCode from 'qrcode';

/**
 * Generate a local base64 Data URL for a UPI payment QR code
 * Avoids any external API calls or CORS restrictions when rendering/exporting PDF.
 */
export async function generateUpiQrDataUrl(
  upiId: string,
  payeeName: string,
  amount: number,
  invoiceNumber: string
): Promise<string> {
  if (!upiId || !upiId.trim()) return '';

  const cleanUpi = upiId.trim();
  const cleanName = encodeURIComponent(payeeName || 'Business');
  const cleanInvoice = encodeURIComponent(invoiceNumber || 'Invoice');
  const cleanAmount = amount > 0 ? amount.toFixed(2) : '';

  const upiUrl = `upi://pay?pa=${cleanUpi}&pn=${cleanName}${
    cleanAmount ? `&am=${cleanAmount}` : ''
  }&cu=INR&tn=Invoice%20${cleanInvoice}`;

  try {
    return await QRCode.toDataURL(upiUrl, {
      width: 180,
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'M',
    });
  } catch (err) {
    console.error('Failed to generate UPI QR code', err);
    return '';
  }
}
