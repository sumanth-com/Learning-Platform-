import fs from "fs";
import path from "path";

const links = JSON.parse(
  fs.readFileSync(
    path.join(import.meta.dirname, "../src/curriculum/project-content/external-links.json"),
    "utf8"
  )
);

const urls = [];
for (const [id, entry] of Object.entries(links)) {
  urls.push({ id, type: "github", url: entry.github.url });
  urls.push({ id, type: "youtube", url: entry.youtube.url });
}

let failed = 0;
for (const item of urls) {
  try {
    const res = await fetch(item.url, { method: "HEAD", redirect: "follow" });
    const ok = res.status >= 200 && res.status < 400;
    if (!ok) {
      console.log(`FAIL ${item.id} ${item.type} ${res.status} ${item.url}`);
      failed++;
    } else {
      console.log(`OK   ${item.id} ${item.type} ${item.url}`);
    }
  } catch (e) {
    console.log(`FAIL ${item.id} ${item.type} ${item.url} — ${e.message}`);
    failed++;
  }
}

if (failed > 0) {
  console.error(`\n${failed} link(s) failed verification.`);
  process.exit(1);
}
console.log(`\nAll ${urls.length} links verified.`);
