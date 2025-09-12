import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function printReport(title: string, content: string) {
  const printWindow = window.open('', '_blank');
  
  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head>
          <title>${title}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @media print {
              body {
                -webkit-print-color-adjust: exact;
              }
            }
          </style>
        </head>
        <body class="p-10">
          <h1 class="text-2xl font-bold mb-4">${title}</h1>
          ${content}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    // Use a timeout to ensure content is rendered before printing
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 500);
  } else {
    alert('Could not open print window. Please check your browser settings.');
  }
}
