import { marked } from 'marked';
import fs from 'fs';
import path from 'path';

const dir = path.resolve('..', '..', 'uas');
const NAVY = '#1F4E79', BLUE = '#2E75B6', LIGHT = '#DEEAF6';

const css = `
body{font-family:Calibri,Arial,sans-serif;font-size:11pt;color:#222;line-height:1.3}
p{margin:0 0 6pt 0}
h1,h2,h3,h4{font-family:Calibri,Arial,sans-serif}
h2{font-size:14pt;color:#fff;background:${NAVY};padding:5pt 8pt;margin:16pt 0 8pt 0}
h4{font-size:12pt;color:${NAVY};border-bottom:1.5pt solid ${BLUE};padding-bottom:2pt;margin:14pt 0 6pt 0}
table{border-collapse:collapse;width:100%;margin:4pt 0 10pt 0}
th{background:${NAVY};color:#fff;font-weight:bold;border:0.75pt solid ${NAVY};padding:4pt 5pt;text-align:left;font-size:10.5pt}
td{border:0.75pt solid #9DC3E6;padding:3pt 5pt;vertical-align:top;font-size:10.5pt}
tr.alt td{background:${LIGHT}}
td.key{background:${LIGHT};font-weight:bold;color:${NAVY};width:32%}
table.box td{border:none;border-left:3pt solid #70AD47;background:#EAF4E4;padding:5pt 8pt}
table.note td{border:none;border-left:3pt solid #ED7D31;background:#FDF0E6;padding:5pt 8pt}
table.code td{border:0.75pt solid #BFBFBF;background:#F2F2F2;padding:5pt 8pt;font-family:Consolas;font-size:9.5pt}
table.code p, table.code pre{font-family:Consolas;font-size:9.5pt;margin:0}
code{font-family:Consolas;font-size:10pt;color:#C00000}
table.code code{color:#222}
span.no{color:#fff;background:${BLUE};font-weight:bold}
table.banner td{border:none;background:${NAVY};color:#fff;text-align:center;padding:10pt}
p.bt1{font-size:18pt;font-weight:bold;color:#fff;margin:0;text-align:center}
p.bt2{font-size:12pt;color:#DEEAF6;margin:0;text-align:center}
`;

const banner = (t1, t2) =>
  `<table class="banner"><tr><td><p class="bt1">${t1}</p><p class="bt2">${t2}</p></td></tr></table>`;

function codeBlocks(html) {
  return html.replace(/<pre><code[^>]*>([\s\S]*?)<\/code><\/pre>/g, (_, c) => {
    const lines = c.replace(/\n$/, '').split('\n')
      .map(l => `<p>${l.replace(/ /g, '&nbsp;') || '&nbsp;'}</p>`).join('');
    return `<table class="code"><tr><td>${lines}</td></tr></table>`;
  });
}

function zebra(html) {
  return html.replace(/<tbody>([\s\S]*?)<\/tbody>/g, (_, b) => {
    let i = 0;
    return '<tbody>' + b.replace(/<tr>/g, () => (i++ % 2 ? '<tr class="alt">' : '<tr>')) + '</tbody>';
  });
}

function build(name, transform) {
  let md = fs.readFileSync(path.join(dir, name + '.md'), 'utf8');
  md = md.replace(/\s*·\s*★+\s*(Mudah|Sedang|Sulit)/g, '').replace(/★/g, '');
  let html = marked.parse(md);
  html = codeBlocks(html);
  html = transform(html);
  fs.writeFileSync(path.join(dir, name + '.tmp.html'),
    `<html><head><meta charset="utf-8"><style>${css}</style></head><body>${html}</body></html>`, 'utf8');
}

build('soal_pas_x_rpl', html => {
  html = html.replace(/<h3><strong>SOAL[^<]*<\/strong><\/h3>\s*<h3><strong>([^<]*)<\/strong><\/h3>/,
    (_, t) => banner('SOAL PENILAIAN AKHIR SEMESTER (PAS)', t));
  // info table: key/value style, drop header row
  html = html.replace(/<table>\s*<thead>[\s\S]*?Keterangan[\s\S]*?<\/thead>\s*<tbody>([\s\S]*?)<\/tbody>\s*<\/table>/,
    (_, b) => '<table><tbody>' + b.replace(/<tr>\s*<td>/g, '<tr><td class="key">') + '</tbody></table>');
  html = html.replace(/<blockquote>([\s\S]*?)<\/blockquote>/g, (_, c) =>
    `<table class="${/Catatan untuk guru/.test(c) ? 'note' : 'box'}"><tr><td>${c}</td></tr></table>`);
  html = html.replace(/<p><strong>(\d+)\.<\/strong>/g, '<p style="margin-top:8pt"><span class="no">&nbsp;$1&nbsp;</span>&nbsp;');
  html = html.replace(/<hr>/g, '');
  return zebra(html);
});

build('kisi_kisi_pas_x_rpl', html => {
  html = html.replace(/<h1><strong>PAS ([^<]*)<\/strong><\/h1>/,
    (_, t) => banner('KISI-KISI PENILAIAN AKHIR SEMESTER (PAS)', t));
  html = html.replace(/<hr>/g, '');
  return zebra(html);
});
console.log('ok');
