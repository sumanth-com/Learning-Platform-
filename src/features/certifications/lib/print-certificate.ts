/** Open a landscape print dialog with only the certificate sheet (WYSIWYG PDF). */
export async function printCertificateLandscape(elementId = "certificate-print") {
  if (typeof window === "undefined") return;

  const sheet = document.getElementById(elementId);
  if (!sheet) {
    throw new Error("Certificate not ready to print");
  }

  const clone = sheet.cloneNode(true) as HTMLElement;
  clone.id = "certificate-print";
  clone.classList.add("cert-print-sheet");

  const headBits = Array.from(
    document.querySelectorAll('link[rel="stylesheet"], style')
  )
    .map((node) => node.outerHTML)
    .join("\n");

  const win = window.open("", "_blank", "noopener,noreferrer,width=1280,height=900");
  if (!win) {
    throw new Error("Allow pop-ups to download your certificate PDF");
  }

  win.document.open();
  win.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Certificate · SupraBase</title>
  ${headBits}
  <style>
    @page {
      size: A4 landscape;
      margin: 0;
    }

    html, body {
      margin: 0;
      padding: 0;
      width: 297mm;
      height: 210mm;
      overflow: hidden;
      background: #fdfbf7;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
    }

    body {
      display: flex;
      align-items: stretch;
      justify-content: stretch;
    }

    #certificate-print.cert-print-sheet {
      width: 297mm !important;
      height: 210mm !important;
      max-width: none !important;
      max-height: none !important;
      aspect-ratio: auto !important;
      margin: 0 !important;
      border: none !important;
      box-shadow: none !important;
      border-radius: 0 !important;
      overflow: hidden !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
    }

    #certificate-print.cert-print-sheet *,
    #certificate-print.cert-print-sheet svg,
    #certificate-print.cert-print-sheet img {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
    }

    @media print {
      html, body {
        width: 297mm;
        height: 210mm;
      }
      #certificate-print.cert-print-sheet {
        width: 297mm !important;
        height: 210mm !important;
      }
    }
  </style>
</head>
<body>
  ${clone.outerHTML}
</body>
</html>`);
  win.document.close();

  await waitForDocument(win);

  const images = Array.from(win.document.images);
  await Promise.all(
    images.map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete) {
            resolve();
            return;
          }
          img.onload = () => resolve();
          img.onerror = () => resolve();
        })
    )
  );

  // Give fonts a beat to settle
  await new Promise((r) => window.setTimeout(r, 180));

  win.focus();
  win.print();

  const closeLater = () => {
    try {
      win.close();
    } catch {
      /* ignore */
    }
  };
  win.addEventListener("afterprint", closeLater);
  // Fallback if afterprint never fires
  window.setTimeout(closeLater, 60_000);
}

function waitForDocument(win: Window) {
  return new Promise<void>((resolve) => {
    if (win.document.readyState === "complete") {
      resolve();
      return;
    }
    win.addEventListener("load", () => resolve(), { once: true });
    window.setTimeout(() => resolve(), 1200);
  });
}
