import type { HubResource, HubSection } from "@/features/developer-hub/types";
import { categoryMeta } from "@/features/developer-hub/data/categories";

/** Opens a print-ready window — user can Save as PDF with formatting preserved. */
export function exportHubGuidePdf(
  resource: HubResource,
  sections: HubSection[]
) {
  const cat = categoryMeta(resource.category);
  const escape = (s: string) =>
    s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const sectionHtml = sections
    .map((section) => {
      const bullets =
        section.bullets
          ?.map((b) => `<li>${escape(b)}</li>`)
          .join("") ?? "";
      const checklist =
        section.checklist
          ?.map((b) => `<li>☐ ${escape(b)}</li>`)
          .join("") ?? "";
      const code =
        section.code
          ?.map(
            (c) =>
              `<div class="code"><div class="code-title">${escape(c.title ?? c.language)}</div><pre>${escape(c.code)}</pre></div>`
          )
          .join("") ?? "";
      const diagram =
        section.kind === "architecture"
          ? `<div class="diagram"><strong>Architecture:</strong> Client → Edge/CDN → API gateway → Core service → Cache · Database · Queue</div>`
          : section.kind === "diagram"
            ? `<div class="diagram"><strong>Delivery flow:</strong> Clarify → Boundaries → Data → Scale → Operate</div>`
            : section.diagram
              ? `<pre class="diagram">${escape(section.diagram)}</pre>`
              : "";
      return `
        <section class="sec">
          <h2>${escape(section.title)}</h2>
          <p>${escape(section.body).replace(/\n/g, "<br/>")}</p>
          ${bullets ? `<ul>${bullets}</ul>` : ""}
          ${checklist ? `<ul class="check">${checklist}</ul>` : ""}
          ${diagram}
          ${code}
        </section>`;
    })
    .join("");

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${escape(resource.title)} · SupraBase</title>
  <style>
    @page { size: A4; margin: 16mm 14mm; }
    * { box-sizing: border-box; }
    body {
      font-family: "Segoe UI", system-ui, -apple-system, sans-serif;
      color: #111;
      line-height: 1.55;
      font-size: 11.5pt;
      margin: 0;
    }
    .brand {
      display: flex; justify-content: space-between; align-items: baseline;
      border-bottom: 2px solid #111; padding-bottom: 8px; margin-bottom: 18px;
      font-size: 10pt; letter-spacing: 0.04em; text-transform: uppercase;
    }
    .cover-block {
      background: linear-gradient(145deg, #f4f5f3, #e8ebe6);
      border: 1px solid #e5e7eb;
      border-radius: 14px;
      padding: 22px 20px;
      margin-bottom: 16px;
    }
    .cover-kicker {
      font-size: 9pt; letter-spacing: 0.06em; text-transform: uppercase; color: #64748b;
      margin-bottom: 6px;
    }
    h1 { font-size: 22pt; margin: 0 0 8px; letter-spacing: -0.02em; }
    .desc { color: #444; margin: 0 0 12px; }
    .meta { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 22px; }
    .pill {
      border: 1px solid #ddd; border-radius: 999px; padding: 3px 10px;
      font-size: 9pt; color: #333;
    }
    .sec { break-inside: avoid; margin: 0 0 18px; padding-bottom: 12px; border-bottom: 1px solid #eee; }
    h2 { font-size: 13.5pt; margin: 0 0 8px; }
    ul { margin: 8px 0 0; padding-left: 1.2em; }
    li { margin: 3px 0; }
    .diagram, .code pre {
      background: #0f172a; color: #e2e8f0; border-radius: 10px;
      padding: 12px 14px; font-size: 9pt; overflow: auto;
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    }
    .code { margin-top: 10px; }
    .code-title { font-size: 9pt; color: #64748b; margin-bottom: 4px; }
    .footer {
      margin-top: 28px; padding-top: 10px; border-top: 1px solid #ddd;
      font-size: 9pt; color: #666; display: flex; justify-content: space-between;
    }
    @media print {
      a { color: inherit; text-decoration: none; }
    }
  </style>
</head>
<body>
  <div class="brand"><span>SupraBase · Developer Hub</span><span>Pro Guide</span></div>
  <div class="cover-block">
    <div class="cover-kicker">${escape(cat.label)} · ${escape(resource.difficulty)}</div>
    <h1 style="margin:0">${escape(resource.title)}</h1>
  </div>
  <p class="desc">${escape(resource.description)}</p>
  <div class="meta">
    <span class="pill">${escape(resource.difficulty)}</span>
    <span class="pill">${resource.readingMinutes} min</span>
    <span class="pill">${escape(cat.label)}</span>
    <span class="pill">By ${escape(resource.author)}</span>
    <span class="pill">Updated ${escape(resource.updatedAt)}</span>
    <span class="pill">★ ${resource.rating.toFixed(1)}</span>
  </div>
  ${sectionHtml}
  <div class="footer">
    <span>SupraBase · ${escape(resource.slug)}</span>
    <span>Use Print → Save as PDF for page numbers</span>
  </div>
  <script>window.onload = () => { window.focus(); window.print(); };</script>
</body>
</html>`;

  const win = window.open("", "_blank", "noopener,noreferrer,width=920,height=720");
  if (!win) {
    throw new Error("Popup blocked — allow popups to export PDF");
  }
  win.document.open();
  win.document.write(html);
  win.document.close();
}
