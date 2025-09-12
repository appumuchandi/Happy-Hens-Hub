import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function downloadPdfReport(title: string, content: string) {
  const reportElement = document.createElement('div');
  reportElement.style.position = 'absolute';
  reportElement.style.left = '-9999px';
  // A4 paper size in pixels at 96 DPI is roughly 794x1123
  // Giving it a fixed width helps in rendering for html2canvas
  reportElement.innerHTML = `
    <div id="report-content" class="p-10 bg-white" style="width: 210mm;">
      <h1 class="text-2xl font-bold mb-4">${title}</h1>
      ${content}
    </div>
  `;
  document.body.appendChild(reportElement);

  const contentToCapture = document.getElementById('report-content');

  if (contentToCapture) {
    const tailwindScript = document.createElement('script');
    tailwindScript.src = "https://cdn.tailwindcss.com";
    document.head.appendChild(tailwindScript);

    tailwindScript.onload = () => {
        html2canvas(contentToCapture, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          logging: false,
          onclone: (clonedDoc) => {
            // This ensures Tailwind styles are applied in the cloned document
            clonedDoc.getElementById('report-content')?.classList.remove('hidden');
          }
        }).then(canvas => {
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
          const canvasAspectRatio = canvasWidth / canvasHeight;
          const pdfAspectRatio = pdfWidth / pdfHeight;

          let imgWidth = pdfWidth - 20; // 10mm margin on each side
          let imgHeight = imgWidth / canvasAspectRatio;

          let position = 0;
          
          // Check if content fits, if not, split it
          if (imgHeight > pdfHeight - 20) {
              const pageCanvas = document.createElement('canvas');
              const pageContext = pageCanvas.getContext('2d');
              const pageHeightInCanvas = (pdfHeight - 20) / (imgWidth / canvasWidth);

              pageCanvas.width = canvasWidth;
              pageCanvas.height = pageHeightInCanvas;
              
              let y = 0;
              while(y < canvasHeight) {
                  pageContext?.clearRect(0,0, pageCanvas.width, pageCanvas.height);
                  pageContext?.drawImage(canvas, 0, y, canvasWidth, pageHeightInCanvas, 0, 0, canvasWidth, pageHeightInCanvas);
                  const pageImgData = pageCanvas.toDataURL('image/png');
                  if (y > 0) {
                      pdf.addPage();
                  }
                  pdf.addImage(pageImgData, 'PNG', 10, 10, imgWidth, pdfHeight - 20);
                  y += pageHeightInCanvas;
              }

          } else {
            pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
          }

          pdf.save("report.pdf");

        }).catch(err => {
            console.error("Error generating PDF:", err);
        }).finally(() => {
            document.body.removeChild(reportElement);
            document.head.removeChild(tailwindScript);
        });
    };

  } else {
    if (reportElement.parentNode) {
      document.body.removeChild(reportElement);
    }
  }
}

export function directPrint(title: string, content: string) {
    const printWindow = window.open('', '_blank', 'height=800,width=800');

    if (printWindow) {
        printWindow.document.write('<html><head><title>' + title + '</title>');
        printWindow.document.write('<script src="https://cdn.tailwindcss.com"><\/script>');
        printWindow.document.write('</head><body>');
        printWindow.document.write(content);
        printWindow.document.write('</body></html>');

        printWindow.document.close();
        printWindow.focus(); 
        
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 250);
    } else {
        alert('Please allow popups to print the report.');
    }
}
