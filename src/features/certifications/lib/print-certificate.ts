/** Download the digital certificate itself as an A4 landscape PDF. */
export async function printCertificateLandscape(
  elementId = "certificate-print",
  filename = "SupraBase-Certificate.pdf"
) {
  if (typeof window === "undefined") return;

  const sheet = document.getElementById(elementId);
  if (!sheet) {
    throw new Error("Certificate not ready to download");
  }

  const clone = sheet.cloneNode(true) as HTMLElement;
  const holder = document.createElement("div");
  holder.setAttribute("aria-hidden", "true");
  Object.assign(holder.style, {
    position: "fixed",
    left: "-12000px",
    top: "0",
    width: "1123px",
    height: "794px",
    overflow: "hidden",
    pointerEvents: "none",
    background: "#fdfbf7",
  });

  clone.removeAttribute("id");
  Object.assign(clone.style, {
    width: "1123px",
    height: "794px",
    maxWidth: "none",
    maxHeight: "none",
    aspectRatio: "1123 / 794",
    margin: "0",
    borderRadius: "0",
    boxShadow: "none",
  });
  holder.appendChild(clone);
  document.body.appendChild(holder);

  try {
    await document.fonts.ready;
    await waitForImages(clone);

    // html2canvas-pro is used because Tailwind v4 emits oklab()/oklch() colors
    // that the original html2canvas cannot parse.
    const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
      import("html2canvas-pro"),
      import("jspdf"),
    ]);

    const canvas = await html2canvas(clone, {
      backgroundColor: "#fdfbf7",
      scale: 2,
      useCORS: true,
      logging: false,
      width: 1123,
      height: 794,
      windowWidth: 1123,
      windowHeight: 794,
    });

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
      compress: true,
    });
    pdf.addImage(canvas.toDataURL("image/jpeg", 0.98), "JPEG", 0, 0, 297, 210);
    pdf.save(filename);
    void import("@/lib/analytics").then(({ trackEvent, ANALYTICS_EVENTS }) => {
      trackEvent(ANALYTICS_EVENTS.certificate_downloaded, {
        filename,
      });
    });
  } finally {
    holder.remove();
  }
}

async function waitForImages(root: HTMLElement) {
  await Promise.all(
    Array.from(root.querySelectorAll("img")).map(
      (image) =>
        new Promise<void>((resolve) => {
          if (image.complete) {
            resolve();
            return;
          }
          image.onload = () => resolve();
          image.onerror = () => resolve();
        })
    )
  );
}
