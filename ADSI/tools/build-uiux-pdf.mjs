import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { marked } from 'marked';
import { chromium } from 'playwright';

const root = fileURLToPath(new URL('../../', import.meta.url));
const src = path.join(root, 'ui_ux', 'modul_1_intro_ui_ux_teori_lengkap.md');
const out = path.join(root, 'ui_ux', 'modul_1_intro_ui_ux_teori_lengkap.pdf');

const browser = await chromium.launch({ channel: 'msedge', headless: true });
try {
  const source = await readFile(src, 'utf8');
  const html = await marked.parse(source);
  const page = await browser.newPage();
  await page.route('https://**/*', route => route.abort());
  await page.route('http://**/*', route => route.abort());
  await page.setContent(`<!doctype html><html lang="id"><meta charset="utf-8"><style>
    @page { size:A4; margin:17mm 15mm; }
    body { font:11px/1.5 Arial,sans-serif; color:#172536; }
    h1 { font-size:25px; } h2 { font-size:19px; border-bottom:1px solid #bac8d5; }
    h3 { font-size:15px; } h1,h2,h3,h4 { break-after:avoid; }
    table { width:100%; border-collapse:collapse; margin:12px 0; font-size:10px; }
    th,td { border:1px solid #bbc6d1; padding:6px; vertical-align:middle; overflow-wrap:anywhere; }
    th { background:#eaf0f6; } tr { break-inside:avoid; } thead { display:table-header-group; }
    pre { white-space:pre-wrap; overflow-wrap:anywhere; background:#f1f4f7; padding:9px; }
    code { font-family:Consolas,monospace; font-size:10px; }
    .mermaid { text-align:center; break-inside:avoid; margin:12px 0; }
    .mermaid svg { max-width:100%; max-height:220mm; height:auto; }
    blockquote { border-left:3px solid #91a6ba; margin-left:0; padding-left:12px; }
  </style><body>${html}</body></html>`, { waitUntil: 'load' });
  await page.addScriptTag({ path: path.join(root, 'ADSI', 'tools', 'node_modules', 'mermaid', 'dist', 'mermaid.min.js') });
  const counts = await page.evaluate(async () => {
    const blocks = [...document.querySelectorAll('code.language-mermaid')];
    for (const code of blocks) {
      const div = document.createElement('div'); div.className = 'mermaid'; div.textContent = code.textContent;
      code.parentElement.replaceWith(div);
    }
    mermaid.initialize({ startOnLoad: false, securityLevel: 'strict', theme: 'default', flowchart: { htmlLabels: false } });
    await mermaid.run({ querySelector: '.mermaid' });
    await document.fonts.ready;
    const rendered = document.querySelectorAll('.mermaid svg').length;
    if (rendered !== blocks.length) throw new Error('Missing Mermaid diagrams');
    return { diagrams: rendered };
  });
  await page.pdf({ path: out, printBackground: true, preferCSSPageSize: true, displayHeaderFooter: true, headerTemplate: '<span></span>', footerTemplate: '<div style="font-size:8px;width:100%;text-align:center;color:#666"><span class="pageNumber"></span> / <span class="totalPages"></span></div>' });
  console.log('OK', out, counts);
  await page.close();
} finally { await browser.close(); }
