import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function printReport(title: string, content: string) {
  const originalContent = document.body.innerHTML;
  
  document.body.innerHTML = `
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
  `;
  
  // Use a timeout to ensure content is rendered before printing
  setTimeout(() => {
    window.print();
    // Restore the original content after printing
    document.body.innerHTML = originalContent;
    // Re-run scripts or re-initialize event listeners if necessary.
    // For this app, a simple reload is the most robust way to restore state.
    window.location.reload();
  }, 500);
}
