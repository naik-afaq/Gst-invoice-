import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

/**
 * Downloads the specified invoice element as a high-resolution A4 PDF
 * Uses html-to-image to natively support modern CSS (oklch colors from Tailwind v4,
 * flexbox, grids, and typography) via browser-native SVG foreignObject rendering.
 */
export async function downloadInvoiceAsPDF(
  elementId = 'invoice-print-area',
  filename = 'GST_Invoice.pdf'
): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Invoice container not found');
  }

  let imgData: string;

  try {
    imgData = await toPng(element, {
      quality: 0.98,
      pixelRatio: 2, // 2x high-resolution rendering
      backgroundColor: '#ffffff',
      cacheBust: true,
      filter: (node: HTMLElement) => {
        if (node.classList && node.classList.contains('no-print')) {
          return false;
        }
        return true;
      },
    });
  } catch (err) {
    console.warn('Standard toPng failed, retrying with fallback settings:', err);
    // Fallback without font embedding in case of restricted iframe font CORS
    imgData = await toPng(element, {
      quality: 0.98,
      pixelRatio: 2,
      backgroundColor: '#ffffff',
      fontEmbedCSS: '',
      filter: (node: HTMLElement) => {
        if (node.classList && node.classList.contains('no-print')) {
          return false;
        }
        return true;
      },
    });
  }

  // Load image to determine exact dimensions
  const img = new Image();
  img.src = imgData;
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error('Failed to load rendered image'));
  });

  // A4 dimensions in mm: 210 x 297
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pdfWidth = 210;
  const pdfHeight = (img.height * pdfWidth) / img.width;

  // Single page if fits within standard A4 height
  if (pdfHeight <= 297) {
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
  } else {
    // Multi-page slicing for large invoices
    let heightLeft = pdfHeight;
    let position = 0;
    const pageHeight = 297;

    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight, undefined, 'FAST');
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position -= pageHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight, undefined, 'FAST');
      heightLeft -= pageHeight;
    }
  }

  pdf.save(filename);
}

/**
 * Triggers native browser print dialog (which outputs 100% vector PDF natively)
 */
export function printInvoiceDirectly(): void {
  window.print();
}
