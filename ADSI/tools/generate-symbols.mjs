import { mkdir, writeFile } from 'node:fs/promises';
const dir = new URL('../assets/simbol/', import.meta.url);
await mkdir(dir,{recursive:true});
const text = (s,x=100,y=49) => `<text x="${x}" y="${y}" text-anchor="middle" fill="#172536" stroke="none" font-family="Arial,sans-serif" font-size="12">${s}</text>`;
const box = '<rect x="25" y="20" width="150" height="50"/>';
const arrow = '<path d="M20 45H175m-12-8 12 8-12 8" fill="none"/>';
const shapes = {
  terminal:'<rect x="25" y="20" width="150" height="50" rx="25"/>'+text('START / END'),
  process:box+text('Proses'),
  decision:'<path d="M100 8 188 45 100 82 12 45Z"/>'+text('Kondisi?'),
  io:'<path d="M40 20H185L160 70H15Z"/>'+text('Input / Output'),
  arrow,
  connector:'<circle cx="100" cy="45" r="25"/>'+text('A'),
  offpage:'<path d="M65 15H135V55L100 80 65 55Z"/>'+text('A'),
  document:'<path d="M30 15H170V65C130 45 70 85 30 65Z"/>'+text('Dokumen'),
  copies:'<path d="M50 8H185V55H50Z M40 15H177V63H40Z M30 22H167V70C125 50 70 87 30 70Z"/>'+text('Rangkap'),
  manualinput:'<path d="M25 35 175 15V75H25Z"/>'+text('Input manual',100,56),
  display:'<path d="M40 18H155Q185 45 155 72H40L15 45Z"/>'+text('Layar'),
  manual:'<path d="M20 20H180L155 70H45Z"/>'+text('Manual'),
  disk:'<path d="M35 25V65C35 85 165 85 165 65V25"/><ellipse cx="100" cy="25" rx="65" ry="14"/>'+text('Data',100,59),
  stored:'<path d="M40 18H170C145 30 145 60 170 72H40C15 60 15 30 40 18Z"/>'+text('Data'),
  internal:box+'<path d="M40 20V70M25 33H175"/>'+text('Memori',108,55),
  file:'<path d="M50 15H150L100 78Z"/>'+text('Arsip',100,37),
  predefined:box+'<path d="M40 20V70M160 20V70"/>'+text('Subprogram'),
  preparation:'<path d="M40 20H160L180 45 160 70H40L20 45Z"/>'+text('i = 0'),
  merge:'<path d="M50 15H150L100 78Z"/>',
  sort:'<path d="M100 8 170 45 100 82 30 45Z M30 45H170"/>',
  operation:'<circle cx="100" cy="45" r="30"/>',
  transport:'<path d="M20 32H125V15L180 45 125 75V58H20Z"/>',
  inspection:'<rect x="70" y="15" width="60" height="60"/>',
  delay:'<path d="M65 15H105A30 30 0 0 1 105 75H65Z"/>',
  storage:'<path d="M60 15H140L100 78Z"/>',
  entity:box+text('Pelanggan'),
  entitygs:'<path d="M32 70V77H182V27H175"/>'+box+text('Pelanggan'),
  dfdprocess:'<circle cx="100" cy="45" r="38"/>'+text('1',100,33)+text('Kelola data',100,54),
  dfdprocessgs:'<rect x="25" y="8" width="150" height="74" rx="12"/><path d="M25 32H175"/>'+text('1',100,25)+text('Kelola data',100,57),
  datastore:'<path d="M25 23H175M25 67H175"/>'+text('D1 | Siswa'),
  datastoregs:'<path d="M175 20H25V70H175M55 20V70"/>'+text('D1',40,49)+text('Siswa',114,49),
  primitive:'<circle cx="100" cy="45" r="38"/>'+text('1.1 P',100,33)+text('Validasi',100,54),
  unit:box+text('Bagian TU'),
  swimlane:'<rect x="15" y="10" width="170" height="70"/><path d="M100 10V80M15 33H185"/>'+text('TU',57,26)+text('Siswa',142,26),
  peripheral:'<rect x="55" y="10" width="90" height="55"/><path d="M100 65V78M75 78H125"/>'+text('Monitor'),
  architecture:'<rect x="5" y="25" width="60" height="40"/><rect x="135" y="25" width="60" height="40"/><path d="M65 45H135m-10-7 10 7-10 7"/>'+text('PC',35)+text('Server',165),
  value:box+text('Bahan jadi produk'),
  bottleneck:'<path d="M10 20H65L85 37H115L135 20H190M10 70H65L85 53H115L135 70H190"/>'+text('Antrean',100,17),
  variable:box+text('nilai = 80'),
  counter:box+text('i = i + 1'),
  accumulator:box+text('total = total + nilai'),
  trace:'<rect x="35" y="8" width="130" height="74"/><path d="M95 8V82M35 32H165M35 57H165"/>'+text('i',65,25)+text('total',130,25)+text('1',65,50)+text('10',130,50)+text('2',65,75)+text('30',130,75),
  decomposition:'<circle cx="45" cy="45" r="28"/><circle cx="155" cy="24" r="20"/><circle cx="155" cy="68" r="20"/><path d="M73 45 135 24M73 45 135 68"/>'+text('1',45)+text('1.1',155,28)+text('1.2',155,72),
  balancing:'<rect x="64" y="5" width="72" height="30"/><rect x="64" y="55" width="72" height="30"/><path d="M10 20H64M136 20H190m-9-6 9 6-9 6M10 70H64M136 70H190m-9-6 9 6-9 6"/>'+text('Induk',100,25)+text('Anak',100,75)+text('A',30,13)+text('B',166,13)+text('A',30,63)+text('B',166,63),
};
shapes.asme = '<circle cx="22" cy="45" r="14"/><path d="M45 39H62V30L78 45 62 60V51H45Z"/><rect x="85" y="31" width="28" height="28"/><path d="M124 31H135A14 14 0 0 1 135 59H124Z M160 31H192L176 61Z"/>';
for (const [name, body] of Object.entries(shapes)) {
  await writeFile(new URL(`${name}.svg`,dir), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 90" role="img"><title>${name}</title><g fill="white" stroke="#172536" stroke-width="2" stroke-linejoin="round">${body}</g></svg>\n`);
}
console.log(`Generated ${Object.keys(shapes).length} SVG symbols`);
