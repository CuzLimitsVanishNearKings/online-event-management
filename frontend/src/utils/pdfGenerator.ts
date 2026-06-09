import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Captures an HTML element and generates a PDF file.
 * 
 * @param elementId The ID of the HTML element to capture
 * @param filename The desired filename for the downloaded PDF
 */
export const generatePDFFromElement = async (elementId: string, filename: string): Promise<boolean> => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found`);
    return false;
  }

  try {
    // Temporarily ensure the element is visible for capture if it's hidden via styling
    const originalDisplay = element.style.display;
    const originalPosition = element.style.position;
    const originalTop = element.style.top;
    const originalLeft = element.style.left;
    const originalZIndex = element.style.zIndex;

    // Move it offscreen but keep it block to capture
    element.style.display = 'block';
    element.style.position = 'absolute';
    element.style.top = '-9999px';
    element.style.left = '-9999px';
    element.style.zIndex = '-1';

    // Await font loading if necessary (optional but good practice for rendering)
    await document.fonts.ready;

    const canvas = await html2canvas(element, {
      scale: 2, // High resolution
      useCORS: true, // Allow cross-origin images to be captured
      backgroundColor: '#ffffff',
      logging: false
    });

    // Restore original styles
    element.style.display = originalDisplay;
    element.style.position = originalPosition;
    element.style.top = originalTop;
    element.style.left = originalLeft;
    element.style.zIndex = originalZIndex;

    const imgData = canvas.toDataURL('image/png');
    
    // A4 dimensions in mm: 210 x 297
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(filename);
    
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return false;
  }
};
