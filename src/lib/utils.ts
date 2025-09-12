import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function printReport(title: string, content: string) {
  const reportElement = document.createElement('div');
  reportElement.style.position = 'absolute';
  reportElement.style.left = '-9999px';
  reportElement.innerHTML = `
    <div id="report-content" class="p-10" style="width: 210mm;">
      <h1 class="text-2xl font-bold mb-4">${title}</h1>
      ${content}
    </div>
  `;
  document.body.appendChild(reportElement);

  const contentToCapture = document.getElementById('report-content');

  if (contentToCapture) {
    // Add Tailwind CDN to the head of the document to style the captured content
    const tailwindScript = document.createElement('script');
    tailwindScript.src = "https://cdn.tailwindcss.com";
    tailwindScript.onload = () => {
        html2canvas(contentToCapture, {
          scale: 2, // Higher scale for better quality
          useCORS: true, 
          allowTaint: true
        }).then(canvas => {
          document.body.removeChild(reportElement); // Clean up the temporary element
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF({
            orientation: 'p',
            unit: 'mm',
            format: 'a4'
          });
          
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();
          const canvasWidth = canvas.width;
          const canvasHeight = canvas.height;
          const ratio = canvasWidth / canvasHeight;
          const widthInPdf = pdfWidth - 20; // with some margin
          const heightInPdf = widthInPdf / ratio;
          
          let position = 0;
          let pageHeight = pdf.internal.pageSize.height;
          let remainingHeight = canvasHeight * (widthInPdf / canvasWidth);


          pdf.addImage(imgData, 'PNG', 10, position + 10, widthInPdf, heightInPdf);
          remainingHeight -= pageHeight;

          let page = 1;
          while (remainingHeight > 0) {
            page++;
            position = -(pageHeight * (page - 1)) + 10;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 10, position, widthInPdf, heightInPdf);
            remainingHeight -= pageHeight;
          }

          pdf.save("report.pdf");

        }).catch(err => {
            console.error("Error generating PDF:", err);
            document.body.removeChild(reportElement);
        });
    };

    document.head.appendChild(tailwindScript);
    
    // Clean up the script tag after it has done its job
    tailwindScript.addEventListener('load', () => {
        document.head.removeChild(tailwindScript);
    });

  } else {
    document.body.removeChild(reportElement);
  }
}
