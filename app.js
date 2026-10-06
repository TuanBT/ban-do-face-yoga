/* Bản đồ Face Yoga: dựng nội dung và tương tác từ window.DATA. */
(() => {
const D = window.DATA;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c]));
const cite = k => k && k.length ? `<sup class="c" data-s="${k.join(',')}"></sup>` : '';
const store = { get(k, d){ try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } }, set(k, v){ try { localStorage.setItem(k, JSON.stringify(v)); } catch {} } };
const EV = { strong:['ev-strong','Mạnh'], mid:['ev-mid','Vừa'], weak:['ev-weak','Yếu / sơ bộ'], trad:['ev-trad','Truyền thống'] };
const ev = k => `<span class="ev ${EV[k][0]}">${EV[k][1]}</span>`;
const IMG = n => `img/${n}.webp`;
const byId = (arr, id) => arr.find(x => x.id === id);

/* ---------- biểu tượng nét ---------- */
const IC = {
  leaf:'<path d="M5 19c8 0 14-6 14-14C11 5 5 10 5 18"/><path d="M5 19l9-9"/>',
  play:'<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M10 9.5v5l4.5-2.5z"/>',
  phone:'<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>',
  clock:'<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  flask:'<path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V3"/><path d="M7.5 15h9"/>',
  device:'<rect x="9" y="9" width="6" height="12" rx="3"/><circle cx="10" cy="5.5" r="2"/><circle cx="14" cy="5.5" r="2"/>',
  book:'<path d="M4 4.5h6a2 2 0 0 1 2 2V20a2 2 0 0 0-2-2H4zM20 4.5h-6a2 2 0 0 0-2 2V20a2 2 0 0 1 2-2h6z"/>',
  laptop:'<rect x="4" y="5" width="16" height="11" rx="1.5"/><path d="M2 19h20"/>',
  users:'<circle cx="9" cy="8" r="3"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0"/><circle cx="17" cy="9" r="2.5"/><path d="M15.5 14.2A4.5 4.5 0 0 1 21 18.5"/>',
  shield:'<path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6z"/><path d="m9 12 2 2 4-4"/>',
  drop:'<path d="M12 3c3.5 4.5 6 7.6 6 11a6 6 0 0 1-12 0c0-3.4 2.5-6.5 6-11z"/>',
  hand:'<path d="M8 13V6.5a1.5 1.5 0 0 1 3 0V12M11 11.5V5a1.5 1.5 0 0 1 3 0v6.5M14 11.5V6.5a1.5 1.5 0 0 1 3 0v7c0 4-2.5 7.5-6.5 7.5-2.5 0-4-1.2-5.5-3.5L3.8 14a1.4 1.4 0 0 1 2.3-1.6L8 15"/>',
  bottle:'<path d="M10 2.5h4M10.5 2.5v3L8 9v11a1.5 1.5 0 0 0 1.5 1.5h5A1.5 1.5 0 0 0 16 20V9l-2.5-3.5v-3"/><path d="M8 13h8"/>',
  jar:'<rect x="5" y="9" width="14" height="11" rx="2.5"/><path d="M6.5 9V6.5h11V9"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"/>',
  moon:'<path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z"/>',
  eye:'<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
  heart:'<path d="M12 20s-7.5-4.6-7.5-10A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 7.5 3c0 5.4-7.5 10-7.5 10z"/>',
  breath:'<path d="M3 9h11a3 3 0 1 0-3-3M3 13h15a3 3 0 1 1-3 3M3 17h7"/>',
  mat:'<rect x="3" y="9" width="18" height="6" rx="3"/><path d="M7 9v6"/>',
  cart:'<path d="M3 4h2l2.4 10.5a1.5 1.5 0 0 0 1.5 1.2h8.2a1.5 1.5 0 0 0 1.5-1.1L20.5 8H6.2"/><circle cx="9.5" cy="19.5" r="1.3"/><circle cx="17" cy="19.5" r="1.3"/>',
  cap:'<path d="M2.5 9 12 4.5 21.5 9 12 13.5z"/><path d="M6.5 11v4.5c1.5 1.5 3.5 2.2 5.5 2.2s4-.7 5.5-2.2V11"/>',
  feather:'<path d="M4 15c3-2 5-2 8 0s5 2 8 0"/><path d="M12 3v8M9 8l3 3 3-3"/>',
  route:'<circle cx="6" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><path d="M8 18h6a4 4 0 0 0 0-8h-4a4 4 0 0 1 0-8h6"/>',
  face:'<circle cx="12" cy="12" r="8.5"/><path d="M9 10h.01M15 10h.01M8.5 14.5q3.5 3 7 0"/>',
  brain:'<path d="M9 4.5a3 3 0 0 0-3 3 3 3 0 0 0-2 5.2A3 3 0 0 0 7 18h2V4.5zM15 4.5a3 3 0 0 1 3 3 3 3 0 0 1 2 5.2A3 3 0 0 1 17 18h-2V4.5z"/><path d="M12 18v3"/>',
  gut:'<path d="M8 4v4c0 2 2 2.5 4 2.5s5 .5 5 4-3 4.5-6 4.5-4-1-4-2.5 1.5-2 3-2"/>'
};
const icon = n => `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">${IC[n] || ''}</svg>`;

/* ---------- hình học: dải, tấm, vòng, quạt ---------- */
const P = (x, y) => ({ x, y });
const f1 = v => Math.round(v * 10) / 10;
const cub = (a, b, c, d, t) => { const u = 1 - t; return P(u*u*u*a.x + 3*u*u*t*b.x + 3*u*t*t*c.x + t*t*t*d.x, u*u*u*a.y + 3*u*u*t*b.y + 3*u*t*t*c.y + t*t*t*d.y); };
const cubD = (a, b, c, d, t) => { const u = 1 - t; return P(3*u*u*(b.x-a.x) + 6*u*t*(c.x-b.x) + 3*t*t*(d.x-c.x), 3*u*u*(b.y-a.y) + 6*u*t*(c.y-b.y) + 3*t*t*(d.y-c.y)); };
const poly = (pts, close) => 'M' + pts.map(p => f1(p.x) + ',' + f1(p.y)).join('L') + (close ? 'Z' : '');
const ellD = (cx, cy, rx, ry) => `M${f1(cx - rx)},${f1(cy)}a${f1(rx)},${f1(ry)} 0 1,0 ${f1(2 * rx)},0a${f1(rx)},${f1(ry)} 0 1,0 ${f1(-2 * rx)},0Z`;
const pts4 = a => a.map(q => P(q[0], q[1]));
function band(g){
  const [a, b, c, d] = pts4(g.p), n = 30, L = [], R = [], offs = [-.32, -.11, .11, .32], lines = offs.map(() => []);
  for (let i = 0; i <= n; i++){
    const t = i / n, p = cub(a, b, c, d, t), dv = cubD(a, b, c, d, t), len = Math.hypot(dv.x, dv.y) || 1, nx = -dv.y / len, ny = dv.x / len;
    const taper = t < .1 ? .5 + t / .1 * .5 : t > .9 ? .5 + (1 - t) / .1 * .5 : 1;
    const w = (g.w[0] + (g.w[1] - g.w[0]) * t) * taper;
    L.push(P(p.x + nx * w / 2, p.y + ny * w / 2)); R.push(P(p.x - nx * w / 2, p.y - ny * w / 2));
    offs.forEach((o, k) => lines[k].push(P(p.x + nx * w * o, p.y + ny * w * o)));
  }
  return { d: poly(L.concat(R.reverse()), true), f: lines.map(l => poly(l.slice(2, -2))).join(''), c: cub(a, b, c, d, .5) };
}
function sheet(g){
  const A = pts4(g.a), B = pts4(g.b), m = 24, ea = [], eb = [];
  for (let i = 0; i <= m; i++){ ea.push(cub(...A, i / m)); eb.push(cub(...B, i / m)); }
  let f = ''; const n = g.n || 7;
  for (let k = 1; k < n; k++){ const p = cub(...A, k / n), q = cub(...B, k / n); f += `M${f1(p.x)},${f1(p.y)}L${f1(q.x)},${f1(q.y)}`; }
  return { d: poly(ea.concat(eb.slice().reverse()), true), f, c: P((ea[m >> 1].x + eb[m >> 1].x) / 2, (ea[m >> 1].y + eb[m >> 1].y) / 2) };
}
function ring(g){
  const [cx, cy] = g.c, [ix, iy] = g.ic || g.c; let f = '';
  for (const k of [.24, .46, .68, .88]) f += ellD(ix + (cx - ix) * k, iy + (cy - iy) * k, g.i[0] + (g.o[0] - g.i[0]) * k, g.i[1] + (g.o[1] - g.i[1]) * k);
  return { d: ellD(cx, cy, g.o[0], g.o[1]) + ellD(ix, iy, g.i[0], g.i[1]), f, c: P(cx, cy - g.o[1] * .8) };
}
function fan(g){
  const ap = P(...g.apex), A = pts4(g.arc), m = 20, pts = [];
  for (let i = 0; i <= m; i++) pts.push(cub(...A, i / m));
  let f = ''; const n = g.n || 6;
  for (let k = 1; k < n; k++){ const p = cub(...A, k / n); f += `M${f1(p.x)},${f1(p.y)}L${f1(p.x + (ap.x - p.x) * .9)},${f1(p.y + (ap.y - p.y) * .9)}`; }
  const mid = pts[m >> 1];
  return { d: poly(pts.concat([ap]), true), f, c: P((mid.x * 2 + ap.x) / 3, (mid.y * 2 + ap.y) / 3) };
}
const geo = g => g.type === 'band' ? band(g) : g.type === 'sheet' ? sheet(g) : g.type === 'ring' ? ring(g) : g.type === 'fan' ? fan(g)
  : { d: ellD(g.c[0], g.c[1], g.r[0], g.r[1]), f: '', c: P(g.c[0], g.c[1]) };

/* ---------- chân dung + lớp phủ ---------- */
const MIR = 'matrix(-1 0 0 1 870 0)';
const BG = '<image href="img/face_base.webp" x="110" y="120" width="650" height="820" preserveAspectRatio="none"/>';
const portrait = (vb, inner, cls = '', label = 'Chân dung minh hoạ có lớp chú thích') => `<svg class="pf ${cls}" viewBox="${vb}" role="img" aria-label="${label}">${BG}${inner}</svg>`;
const ANCH = {};
const marker = id => `<defs><marker id="${id}" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="4.5" markerHeight="4.5" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#1F7A9E"/></marker></defs>`;
function layerMuscles(){
  return D.muscleOrder.map(id => {
    const m = byId(D.muscles, id), g = geo(m.geo); ANCH[id] = g.c;
    const one = `<g class="m ${m.group}" data-id="${id}"><path class="mf" d="${g.d}" fill-rule="evenodd"/><path class="fib" d="${g.f}"/><title>${esc(m.vn)}</title></g>`;
    return m.mid ? one : one + `<g transform="${MIR}">${one}</g>`;
  }).join('');
}
function dots(arr, cls, r){
  return arr.map(o => {
    ANCH[o.id] = P(o.x, o.y);
    const one = x => `<circle class="hit" data-id="${o.id}" cx="${x}" cy="${o.y}" r="${r + 9}"/><circle class="halo" data-id="${o.id}" cx="${x}" cy="${o.y}" r="${r + 6}"/><circle class="dot ${cls}" data-id="${o.id}" cx="${x}" cy="${o.y}" r="${r}"><title>${esc(o.vn)}</title></circle>`;
    return one(o.x) + (o.mid || o.single ? '' : one(870 - o.x));
  }).join('');
}
function layerLymph(mk){
  const f = D.flows.map(d => `<path class="flow" d="${d}" marker-end="url(#${mk})"/>`).join('');
  return `<g>${f}</g><g transform="${MIR}">${f}</g>` + D.flowsMid.map(d => `<path class="flow" d="${d}" marker-end="url(#${mk})"/>`).join('') + dots(D.nodes, 'node', 8);
}
function lineAnchor(d){ const n = d.match(/-?\d+(\.\d+)?/g).map(Number); return P((n[0] + n[n.length - 2]) / 2, (n[1] + n[n.length - 1]) / 2); }
function diamond(o){
  ANCH[o.id] = P(o.x, o.y);
  const one = x => `<circle class="hit" data-id="${o.id}" cx="${x}" cy="${o.y}" r="18"/><circle class="halo" data-id="${o.id}" cx="${x}" cy="${o.y}" r="15"/><rect class="dot dcp" data-id="${o.id}" x="-8" y="-8" width="16" height="16" transform="translate(${x},${o.y}) rotate(45)"><title>${esc(o.vn)}</title></rect>`;
  return one(o.x) + (o.mid ? '' : one(870 - o.x));
}
function layerDC(withPoints = true){
  const areas = D.dcAreas.map(a => {
    let s;
    if (a.kind === 'line'){ ANCH[a.id] = lineAnchor(a.d); s = `<path class="dcl" data-id="${a.id}" d="${a.d}"><title>${esc(a.org)}</title></path>`; }
    else { const g = geo(a.geo); ANCH[a.id] = g.c; s = `<path class="dca" data-id="${a.id}" d="${g.d}"><title>${esc(a.org)}</title></path>`; }
    return a.mid || a.single ? s : s + `<g transform="${MIR}">${s}</g>`;
  }).join('');
  return areas + (withPoints ? D.dcPoints.map(diamond).join('') : '');
}
function callout(svg, id, text){
  const g = svg.querySelector('.co'); g.innerHTML = '';
  const a = ANCH[id]; if (!a || !text) return;
  const vb = svg.viewBox.baseVal, right = a.x >= 425;
  g.innerHTML = `<line/><rect/><text>${esc(text)}</text>`;
  const t = g.querySelector('text'), w = (t.getComputedTextLength() || text.length * 11) + 24, h = 36;
  let bx = right ? a.x + 26 : a.x - 26 - w; bx = Math.max(vb.x + 6, Math.min(vb.x + vb.width - w - 6, bx));
  let by = Math.max(vb.y + 6, Math.min(vb.y + vb.height - h - 6, a.y - h / 2));
  const r = g.querySelector('rect'), l = g.querySelector('line');
  Object.entries({ x: bx, y: by, width: w, height: h }).forEach(([k, v]) => r.setAttribute(k, f1(v)));
  t.setAttribute('x', f1(bx + 12)); t.setAttribute('y', f1(by + 24));
  const ex = bx > a.x ? bx : bx + w;
  Object.entries({ x1: a.x, y1: a.y, x2: ex, y2: by + h / 2 }).forEach(([k, v]) => l.setAttribute(k, f1(v)));
}

/* ---------- Phần 5: bản đồ khuôn mặt ---------- */
const GROUP = { relax:['Cần thả lỏng','var(--ov-relax)'], tone:['Cần tăng cường','var(--ov-tone)'], balance:['Cân bằng','var(--ov-balance)'] };
const trim = (s, n) => s.length > n ? s.slice(0, n - 1) + '…' : s;
const LAYERS = {
  muscles:{ title:'Cơ mặt và cổ', intro:'Chọn một cơ. Màu cho biết nên thả lỏng hay tăng cường; thớ cơ vẽ theo hướng co.', items:() => D.muscles,
    groups:() => Object.entries(GROUP).map(([k, [t]]) => [t, D.muscles.filter(m => m.group === k)]), label:m => m.vn,
    detail:m => `<div style="display:flex; gap:8px; flex-wrap:wrap; align-items:center"><span class="tag" style="background:${GROUP[m.group][1]}; color:#fff">${GROUP[m.group][0]}</span><span class="tag">${esc(m.nerve)}</span></div>
      <h3>${esc(m.vn)}</h3><p class="muted" style="font-style:italic">${esc(m.en)}</p>
      <dl><div><dt>Chức năng</dt><dd>${esc(m.act)}</dd></div><div><dt>Liên quan</dt><dd>${esc(m.issue)}${cite(m.ev)}</dd></div>
      <div><dt>Bài tập gợi ý</dt><dd>${esc(m.yoga)}</dd></div>${m.warn ? `<div><dt>Lưu ý</dt><dd>${esc(m.warn)}</dd></div>` : ''}</dl>` },
  lymph:{ title:'Hạch bạch huyết', intro:'Chọn một nhóm hạch. Nét đứt chỉ hướng chảy từ mặt xuống cổ, về hõm thượng đòn.', items:() => D.nodes,
    groups:() => [['Vùng mặt', D.nodes.slice(0, 6)], ['Vùng cổ', D.nodes.slice(6)]], label:n => n.vn,
    detail:n => `<span class="tag">${esc(n.en)}</span><h3>${esc(n.vn)}</h3>
      <dl><div><dt>Nhận bạch huyết từ</dt><dd>${esc(n.from)}</dd></div><div><dt>Đổ về</dt><dd>${esc(n.to)}</dd></div><div><dt>Thao tác</dt><dd>${esc(n.how)}</dd></div></dl>
      <p class="small muted">Hạch chẩm (vùng gáy) không thấy ở hình nhìn thẳng.${cite(['statpearls','kenhub'])}</p>` },
  points:{ title:'Huyệt kinh điển', intro:'Chọn một huyệt. Đây là các huyệt hay dùng khi ấn day mặt.', items:() => D.points,
    groups:() => [['Trán và mắt', D.points.slice(0, 10)], ['Má, mũi, miệng', D.points.slice(10, 18)], ['Tai và cổ', D.points.slice(18)]], label:p => `${p.vn} · ${p.code}`,
    detail:p => `<span class="tag mono">${esc(p.code)}</span><h3>${esc(p.vn)}</h3>
      <dl><div><dt>Vị trí</dt><dd>${esc(p.loc)}</dd></div><div><dt>Dùng trong chăm sóc</dt><dd>${esc(p.use)}</dd></div>${p.warn ? `<div><dt>Lưu ý</dt><dd>${esc(p.warn)}</dd></div>` : ''}</dl>
      <p class="small muted">Vùng gáy (không thấy trên hình): Phong trì GB20, Phong phủ GV16, Thiên trụ BL10, Kiên tỉnh GB21. Trong lớp, ấn day nhẹ để thư giãn.</p>` },
  zones:{ title:'Bản đồ tạng phủ của Linh Khu', intro:'Chọn một vùng để xem tạng phủ hoặc chi thể tương ứng theo Linh Khu thiên 49.', items:() => D.zones,
    groups:() => [['Tạng phủ', D.zones.slice(0, 13)], ['Chi thể', D.zones.slice(13)]], label:z => z.org,
    detail:z => `<span class="tag">Linh Khu, thiên 49 “Ngũ sắc”</span><h3>${esc(z.vn)}</h3>
      <dl><div><dt>Tương ứng</dt><dd><strong style="font-size:1.15rem; color:var(--ink)">${esc(z.org)}</strong></dd></div>
      <div><dt>Nguyên văn</dt><dd><span style="font-size:1.1rem; font-family:'Noto Serif TC','Songti TC',serif">${esc(z.src)}</span>${cite(['lk49'])}</dd></div></dl>
      <p class="small muted">Bản đồ vọng chẩn: tạng phủ có bệnh thì vùng tương ứng đổi sắc. Vị trí trên hình là gần đúng.</p>` },
  dc:{ title:'Diện chẩn', intro:'Vùng tím: đồ hình phản chiếu nội tạng. Hình thoi: “tứ đại huyệt”. Vị trí là gần đúng để minh hoạ.', items:() => [...D.dcAreas, ...D.dcPoints],
    groups:() => [['Đồ hình nội tạng', D.dcAreas], ['Tứ đại huyệt', D.dcPoints]], label:o => o.org ? trim(o.org, 30) : o.vn,
    detail:o => o.org ? `<span class="tag">Đồ hình phản chiếu nội tạng</span><h3>${esc(o.vn)}</h3>
      <dl><div><dt>Tương ứng</dt><dd><strong style="font-size:1.1rem; color:var(--ink)">${esc(o.org)}</strong></dd></div>
      <div><dt>Nguyên văn tài liệu</dt><dd>${esc(o.quote)}${cite(o.s)}</dd></div>${o.note ? `<div><dt>Ghi chú</dt><dd>${esc(o.note)}</dd></div>` : ''}</dl>
      <p class="small muted">Theo Diện chẩn, chưa được kiểm chứng khoa học.${cite(['lc_dc'])}</p>`
      : `<span class="tag">Tứ đại huyệt</span><h3>${esc(o.vn)}</h3>
      <dl><div><dt>Vị trí</dt><dd>${esc(o.loc)}</dd></div><div><dt>Công dụng theo tài liệu Diện chẩn</dt><dd>${esc(o.use)}${cite(o.s)}</dd></div></dl>
      <p class="small muted">Học định huyệt chính xác bằng que dò theo giáo trình gốc.${cite(['dc_sinh'])}</p>` }
};
const LEGEND = {
  group:Object.values(GROUP).map(([t, c]) => `<span><i class="sw" style="background:${c}"></i>${t}</span>`).join(''),
  anat:`<span><i class="sw" style="background:var(--ov-anat)"></i>Cơ (màu giải phẫu)</span><span class="muted">Cách tập ghi trong bảng chi tiết</span>`,
  lymph:`<span><i class="sw" style="background:var(--ov-lymph); border-radius:50%"></i>Nhóm hạch</span><span><i class="sw" style="border:2px dashed var(--ov-lymph)"></i>Hướng chảy</span>`,
  points:`<span><i class="sw" style="background:var(--ov-point); border-radius:50%"></i>Huyệt (mã WHO)</span>${ev('trad')}`,
  zones:`<span><i class="sw" style="background:var(--ov-zone); border-radius:50%"></i>Vùng theo Linh Khu 49</span>${ev('trad')}`,
  dc:`<span><i class="sw" style="background:var(--ov-dc); opacity:.6"></i>Đồ hình nội tạng</span><span><i class="sw" style="background:var(--ov-dc); transform:rotate(45deg) scale(.8)"></i>Tứ đại huyệt</span>${ev('trad')}`
};
$('#face-main').innerHTML = portrait('110 120 650 820', marker('arrE') +
  `<g data-layer="muscles">${layerMuscles()}</g><g data-layer="lymph" hidden>${layerLymph('arrE')}</g><g data-layer="points" hidden>${dots(D.points, 'pt', 7)}</g><g data-layer="zones" hidden>${dots(D.zones, 'zn', 7.5)}</g><g data-layer="dc" hidden>${layerDC()}</g><g class="co" pointer-events="none"></g>`);
const fm = $('#face-main svg');
let layer = 'muscles', sel = null, cmode = 'group';
function renderSide(){
  const cfg = LAYERS[layer];
  $('#color-mode').hidden = layer !== 'muscles';
  $('#legend').innerHTML = layer === 'muscles' ? LEGEND[cmode] : LEGEND[layer];
  $('#itemlist').innerHTML = cfg.groups().map(([t, arr]) => `<div><h4>${t}</h4><div class="chips">${arr.map(o => `<button class="chip${o.id === sel ? ' sel' : ''}" data-id="${o.id}">${esc(cfg.label(o))}</button>`).join('')}</div></div>`).join('');
  const item = sel && byId(cfg.items(), sel);
  $('#detail').innerHTML = item ? cfg.detail(item) : `<h3>${cfg.title}</h3><p class="muted">${cfg.intro}</p>`;
  $$('[data-id]', fm).forEach(el => el.classList.toggle('on', el.dataset.id === sel));
  fm.classList.toggle('has-sel', !!item);
  callout(fm, sel, item ? cfg.label(item) : '');
  numberCites();
}
function setLayer(l){
  layer = l; sel = null;
  $$('#layer-tabs button').forEach(b => b.setAttribute('aria-selected', b.dataset.layer === l));
  $$('g[data-layer]', fm).forEach(g => g.toggleAttribute('hidden', g.dataset.layer !== l));
  renderSide();
}
$('#layer-tabs').addEventListener('click', e => { const b = e.target.closest('button'); if (b) setLayer(b.dataset.layer); });
$('#color-mode').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; cmode = b.dataset.mode;
  $$('#color-mode button').forEach(x => x.setAttribute('aria-selected', x === b)); fm.classList.toggle('anat', cmode === 'anat'); renderSide(); });
fm.addEventListener('click', e => { const t = e.target.closest('[data-id]'); if (t){ sel = t.dataset.id; renderSide(); } });
$('#itemlist').addEventListener('click', e => { const b = e.target.closest('button[data-id]'); if (b){ sel = b.dataset.id; renderSide(); } });

/* ---------- các sơ đồ khác trên chân dung ---------- */
$('#nerve-viz').innerHTML = portrait('200 190 470 560', `
  <line x1="435" y1="196" x2="435" y2="745" stroke="#14211E" stroke-width="1.5" stroke-dasharray="6 6" opacity=".45"/>
  <path d="M435,212 Q360,214 300,240 Q276,262 272,300 L274,370 L306,410 Q348,402 388,418 Q412,440 420,500 L435,508 Z" fill="#2a78d6" fill-opacity=".24" stroke="#2a78d6" stroke-width="1.6"/>
  <path d="M306,410 Q348,402 388,418 Q412,440 420,500 L435,508 L435,566 Q404,560 372,574 L330,566 Q296,540 284,500 L276,450 L274,370 Z" fill="#1baf7a" fill-opacity=".24" stroke="#1baf7a" stroke-width="1.6"/>
  <path d="M435,566 Q404,560 372,574 L330,566 Q296,540 284,500 L276,450 L262,430 L262,520 Q270,600 330,650 Q380,686 435,690 Z" fill="#eda100" fill-opacity=".26" stroke="#c98500" stroke-width="1.6"/>
  <text class="lab dark" x="300" y="300">V1 · mắt</text><text class="lab dark" x="292" y="488">V2 · hàm trên</text><text class="lab dark" x="318" y="640">V3 · hàm dưới</text>
  <g fill="none" stroke="#4a3aa7" stroke-width="4.5" stroke-linecap="round">
    <path d="M598,528 Q612,450 586,388 Q562,330 520,302"/><path d="M598,528 Q590,470 556,440"/><path d="M598,530 Q560,540 502,548"/><path d="M596,532 Q588,600 530,640 Q505,652 482,642"/><path d="M594,534 Q586,620 572,700 Q566,730 558,746"/>
  </g>
  <g fill="#4a3aa7"><circle cx="598" cy="530" r="8"/><circle cx="520" cy="302" r="5"/><circle cx="556" cy="440" r="5"/><circle cx="502" cy="548" r="5"/><circle cx="482" cy="642" r="5"/></g>
  <text class="lab" fill="#4a3aa7" x="528" y="292">Thái dương</text><text class="lab" fill="#4a3aa7" x="566" y="462">Gò má</text><text class="lab" fill="#4a3aa7" x="494" y="532" text-anchor="end">Má</text>
  <text class="lab" fill="#4a3aa7" x="488" y="684">Bờ hàm dưới</text><text class="lab" fill="#4a3aa7" x="580" y="740">Cổ</text>
  <text class="lab dark" x="212" y="214">Dây V · cảm giác</text><text class="lab" fill="#4a3aa7" x="658" y="214" text-anchor="end">Dây VII · vận động</text>`, '', 'Sơ đồ dây thần kinh V và VII trên mặt');

$('#meridian-viz').innerHTML = portrait('130 190 600 730',
  D.meridians.map(m => `<path d="${m.d}" fill="none" stroke="${m.c}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><g transform="${MIR}"><path d="${m.d}" fill="none" stroke="${m.c}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" opacity=".85"/></g>`).join('') +
  D.meridiansMid.map(m => `<path d="${m.d}" fill="none" stroke="${m.c}" stroke-width="4" stroke-linecap="round"/>`).join('') +
  [...D.meridians, ...D.meridiansMid].map(m => { const end = m.lab[0] > 435; return `<line x1="${m.lab[0] + (end ? -4 : 4)}" y1="${m.lab[1] - 6}" x2="${m.to[0]}" y2="${m.to[1]}" stroke="${m.c}" stroke-width="1.5"/><text class="lab" fill="${m.c}" x="${m.lab[0]}" y="${m.lab[1]}" text-anchor="${end ? 'start' : 'end'}" style="font-size:21px">${m.k}</text>`; }).join(''),
  '', 'Sơ đồ các đường kinh đi qua mặt');

$('#dc-viz').innerHTML = portrait('200 300 470 420', layerDC(false).replace(/class="dc([al])"/g, 'class="dc$1" style="pointer-events:none; opacity:.55"') +
  D.dcPoints.map(o => `<rect x="-9" y="-9" width="18" height="18" fill="var(--ov-dc)" stroke="#fff" stroke-width="3" transform="translate(${o.x},${o.y}) rotate(45)"/>${o.mid ? '' : `<rect x="-9" y="-9" width="18" height="18" fill="var(--ov-dc)" stroke="#fff" stroke-width="3" transform="translate(${870 - o.x},${o.y}) rotate(45)"/>`}`).join('') +
  `<text class="lab" fill="#5B2D7C" x="452" y="358" style="font-size:22px">26</text><text class="lab" fill="#5B2D7C" x="452" y="536" style="font-size:22px">19</text>
   <text class="lab" fill="#5B2D7C" x="452" y="640" style="font-size:22px">127</text><text class="lab" fill="#5B2D7C" x="262" y="526" text-anchor="middle" style="font-size:22px">0</text>`,
  '', 'Vị trí tứ đại huyệt Diện chẩn');
$('#open-dc').addEventListener('click', () => { setLayer('dc'); $('#khuon-mat').scrollIntoView(); });

/* ---------- bài tập + giọng đọc ---------- */
$('#exercises').innerHTML = D.exercises.map(x => `<article class="icard sq ex"><img src="${IMG(x.img)}" alt="Minh hoạ bài ${esc(x.t)}" loading="lazy"><div class="body"><span class="tag">${esc(x.m)}</span><h3>${esc(x.t)}</h3><button class="play" data-audio="${x.img}" aria-pressed="false"><span class="ic">▶</span><span class="lb">Nghe hướng dẫn</span></button><ol>${x.steps.map(s => `<li>${esc(s)}</li>`).join('')}</ol><p class="small muted">${esc(x.note)}${cite(x.s)}</p></div></article>`).join('');
const player = new Audio(); player.preload = 'none';
let playingBtn = null, playingKey = null, step = 0;
const setBtn = (b, on) => { if (!b) return; b.setAttribute('aria-pressed', on); b.querySelector('.ic').textContent = on ? '❚❚' : '▶'; };
function play(key, btn){
  if (playingKey === key && !player.paused){ player.pause(); return; }
  setBtn(playingBtn, false); playingKey = key; playingBtn = btn;
  player.src = `audio/${key}.mp3`;
  player.play().then(() => setBtn(btn, true), () => { setBtn(btn, false); btn.querySelector('.lb').textContent = 'Chưa phát được'; });
}
player.addEventListener('pause', () => setBtn(playingBtn, false));
player.addEventListener('play', () => setBtn(playingBtn, true));
player.addEventListener('ended', () => {
  setBtn(playingBtn, false);
  if (playingKey?.startsWith('mld') && $('#mld-auto').checked && step < D.mld.length - 1){ setStep(step + 1); play(`mld${step + 1}`, $('#mld-play')); }
});
$('#exercises').addEventListener('click', e => { const b = e.target.closest('.play'); if (b) play(b.dataset.audio, b); });

/* ---------- Phần 6: dẫn lưu ---------- */
$('#mld-rules').innerHTML = [
  ['feather', 'Lực rất nhẹ', 'Dưới khoảng 9 ounce/inch² (≈ 30 mmHg), chỉ đủ kéo căng da.' + cite(['abmp_mld','vodder'])],
  ['route', 'Mở cửa trước', 'Thượng đòn và cổ trước, rồi mới tới mặt; kết thúc lại ở thượng đòn.'],
  ['breath', 'Không có tim bơm', 'Bạch huyết chảy nhờ co cơ, nhịp thở, vận động; hiệu quả riêng trên mặt chưa được đo trực tiếp.']
].map(([i, t, d]) => `<div><span class="ib">${icon(i)}</span><div><h4>${t}</h4><p>${d}</p></div></div>`).join('');
$('#face-mld').innerHTML = portrait('210 400 450 500', marker('arrM') + layerLymph('arrM'), '', 'Các nhóm hạch được tác động ở bước hiện tại');
const fd = $('#face-mld svg');
$('#steps').innerHTML = D.mld.map((s, i) => `<li><button data-i="${i}"><span class="n">${i + 1}</span><span class="tt">${esc(s.t)}</span></button></li>`).join('');
function setStep(i){
  step = Math.max(0, Math.min(D.mld.length - 1, i));
  const s = D.mld[step];
  $$('#steps button').forEach((b, j) => j === step ? b.setAttribute('aria-current', 'step') : b.removeAttribute('aria-current'));
  $$('[data-id]', fd).forEach(el => el.classList.toggle('on', s.n.includes(el.dataset.id)));
  $('#mld-img').src = IMG(s.img); $('#mld-img').alt = `Minh hoạ bước ${step + 1}: ${s.t}`;
  $('#mld-title').textContent = `Bước ${step + 1}. ${s.t}`; $('#mld-desc').textContent = s.d;
  $('#prev').disabled = step === 0; $('#next').textContent = step === D.mld.length - 1 ? 'Làm lại từ đầu' : 'Bước tiếp';
  $('#mld-play .lb').textContent = `Nghe bước ${step + 1}`;
}
const goStep = i => { const was = playingKey?.startsWith('mld') && !player.paused; setStep(i); if (was) play(`mld${step + 1}`, $('#mld-play')); };
$('#steps').addEventListener('click', e => { const b = e.target.closest('button'); if (b) goStep(+b.dataset.i); });
$('#prev').onclick = () => goStep(step - 1);
$('#next').onclick = () => goStep(step === D.mld.length - 1 ? 0 : step + 1);
$('#mld-play').addEventListener('click', e => play(`mld${step + 1}`, e.currentTarget));
setStep(0);

/* ---------- mục lục bằng ảnh, nguồn gốc ---------- */
$('#vtoc').innerHTML = [['nguon-goc','Nguồn gốc','o_yoga'],['the-gioi','Thị trường thế giới','m_global'],['viet-nam','Thị trường Việt Nam','m_vn'],['ngach','Các ngách','n_office'],['khuon-mat','Bản đồ khuôn mặt','face_base'],['bach-huyet','Dẫn lưu bạch huyết','mld_2'],['ba-lang-kinh','Tây y · Đông y · Diện chẩn','o_tcm'],['cham-soc-da','Chăm sóc da','i_rauma'],['phuong-phap','Phương pháp khác','m_kansa'],['so-sanh','Các nước','c_jp'],['nguoi-day','Người dạy','t_kit'],['cong-cu','Bộ công cụ','tool_screen']]
  .map(([id, t, img], i) => `<a href="#${id}"><img src="${IMG(img)}" alt="" loading="lazy"${img === 'face_base' ? ' style="object-position:50% 30%"' : ''}><span><b>Phần ${i + 1}</b>${t}</span></a>`).join('');
$('#streams').innerHTML = D.streams.map(s => `<article class="icard"><img src="${IMG(s.img)}" alt="Minh hoạ: ${esc(s.t)}" loading="lazy"><div class="body"><span class="tag">${esc(s.tag)}</span><h3>${esc(s.t)}</h3><p>${esc(s.d)}${cite(s.s)}</p></div></article>`).join('');
const TAGS = { all:['Tất cả','var(--ink-2)'], yoga:['Yoga','var(--jade)'], dongy:['Đông y','var(--amber)'], 'chau-a':['Nhật · Hàn','var(--indigo)'], tay:['Phương Tây','var(--muted)'], vn:['Việt Nam','var(--rose)'], khoahoc:['Khoa học','var(--good)'] };
let tlf = 'all';
function renderTL(){
  $('#tl-filter').innerHTML = Object.entries(TAGS).map(([k, [t]]) => `<button class="chip" aria-pressed="${k === tlf}" data-k="${k}">${t}</button>`).join('');
  $('#timeline').innerHTML = D.timeline.filter(e => tlf === 'all' || e.tag === tlf).map(e => `<li style="--tc:${TAGS[e.tag][1]}"><span class="yr">${esc(e.y)} · ${TAGS[e.tag][0]}</span><h4>${esc(e.t)}</h4><p>${esc(e.d)}${cite(e.s)}</p></li>`).join('');
  numberCites();
}
$('#tl-filter').addEventListener('click', e => { const b = e.target.closest('button'); if (b){ tlf = b.dataset.k; renderTL(); } });

/* ---------- Phần 2: quy mô, động lực, bằng chứng ---------- */
(() => {
  const S = 270, x0 = 10, y0 = 10, sb = S * Math.sqrt(1.21 / 6.3), sf = Math.max(3.4, S * Math.sqrt(1.02 / 6300));
  const fx = x0 + 5, fy = y0 + S - 5 - sf;
  $('#scale-viz').innerHTML = `<svg viewBox="0 0 420 290" role="img" aria-label="Hình vuông lớn là kinh tế wellness 6,3 nghìn tỷ USD, hình vuông nhỏ hơn là ngành làm đẹp 1,21 nghìn tỷ USD, face yoga chỉ là một chấm nhỏ">
    <rect x="${x0}" y="${y0}" width="${S}" height="${S}" rx="6" fill="var(--surface-2)" stroke="var(--line)"/>
    <rect x="${x0}" y="${y0 + S - sb}" width="${sb}" height="${sb}" rx="4" fill="var(--jade-soft)" stroke="var(--jade)"/>
    <rect x="${f1(fx)}" y="${f1(fy)}" width="${f1(sf)}" height="${f1(sf)}" fill="var(--rose)"/>
    <circle cx="${f1(fx + sf / 2)}" cy="${f1(fy + sf / 2)}" r="13" fill="none" stroke="var(--rose)" stroke-width="2" stroke-dasharray="4 3"/>
    <path d="M${f1(fx + 13)},${f1(fy - 6)} Q120,200 296,214" fill="none" stroke="var(--rose)" stroke-width="1.5"/>
    <text class="vt" x="24" y="38" style="font-size:15px; font-weight:600">Kinh tế wellness</text><text class="vt2" x="24" y="58" style="font-size:14px">6,3 nghìn tỷ USD (2023)</text>
    <text class="vt" x="20" y="${f1(y0 + S - sb + 24)}" style="font-size:14px; font-weight:600">Làm đẹp</text><text class="vt2" x="20" y="${f1(y0 + S - sb + 42)}" style="font-size:13px">1,21 nghìn tỷ</text>
    <text class="vt" x="300" y="208" style="font-size:15px; font-weight:600">Face yoga</text><text class="vt2" x="300" y="227" style="font-size:13px">≈ 1 tỷ USD (2027)</text><text class="vt2" x="300" y="244" style="font-size:13px">chỉ là một chấm</text>
  </svg><p class="small muted">Nguồn: GWI 2024; Grand View Research qua Treendly.${cite(['gwi','gvr'])}</p>`;
})();
$('#drivers').innerHTML = [
  ['leaf','Ưa không xâm lấn','Hagen định vị face yoga thay cho Botox, filler từ 2007.' + cite(['hagen'])],
  ['play','Video ngắn','Bài tập mặt rất lên hình, dễ làm thử thách.' + cite(['cosbiz'])],
  ['phone','Kinh tế ứng dụng','App dùng thử rồi thu phí thuê bao.' + cite(['apps'])],
  ['clock','“Slow aging”','Làm đẹp gắn với ngủ, stress, vận động.' + cite(['oliveyoung'])],
  ['flask','Cú hích khoa học','Nghiên cứu Northwestern 2018 lên báo khắp nơi.' + cite(['sd2018'])],
  ['device','Thiết bị tại nhà','Vi dòng, LED, dụng cụ có nhiệt.' + cite(['accio'])]
].map(([i, t, d]) => `<div><span class="ib">${icon(i)}</span><div><h4>${t}</h4><p>${d}</p></div></div>`).join('');
$('#pyramid').innerHTML = `<style>
  .pyr{display:grid; gap:8px}
  .pyr .lv{display:grid; grid-template-columns:minmax(0, 1fr) minmax(0, 1.25fr); gap:14px; align-items:center}
  .pyr .bar{display:block; width:var(--w); margin-inline:auto; text-align:center; padding:9px 6px; border-radius:6px; font-size:.82rem; font-weight:600; color:var(--ink)}
  .pyr .lv p{font-size:.88rem; color:var(--ink-2)}
  @media (max-width:560px){ .pyr .lv{grid-template-columns:1fr; gap:4px} .pyr .bar{margin-inline:0} }
</style><div class="pyr">
  <div class="lv"><span class="bar" style="--w:30%; border:2px dashed var(--muted); color:var(--muted)">Thử nghiệm lớn</span><p><strong>Chưa có</strong> thử nghiệm ngẫu nhiên lớn, có nhóm chứng.</p></div>
  <div class="lv"><span class="bar" style="--w:48%; background:var(--indigo-soft)">Tổng quan</span><p>2014 (9 nghiên cứu) và 2024 (7 nghiên cứu): chưa đủ bằng chứng.${cite(['vanborsel','scielo'])}</p></div>
  <div class="lv"><span class="bar" style="--w:66%; background:var(--jade-soft)">Đo khách quan</span><p>Hwang 2018 (siêu âm, 50 người), Güzel 2025 (Myoton, 12 người).${cite(['hwang','guzel'])}</p></div>
  <div class="lv"><span class="bar" style="--w:83%; background:color-mix(in srgb, var(--jade-soft) 55%, var(--surface))">Đánh giá ảnh</span><p>Alam 2018 (16 người): trẻ hơn khoảng 3 tuổi theo bác sĩ.${cite(['alam'])}</p></div>
  <div class="lv"><span class="bar" style="--w:100%; background:var(--surface-2)">Kinh nghiệm</span><p>Sách, video, app, lời kể của học viên.</p></div>
</div>`;

/* ---------- Phần 3: các bước + biểu đồ ---------- */
$('#stages').innerHTML = [
  ['book','Nội dung miễn phí','Nhà thuốc, bệnh viện viết bài; video ngắn. Có nhắc đây là biện pháp hỗ trợ.' + cite(['lc_fy','vinmec']), ''],
  ['laptop','Khoá online giá rẻ','Unica 299.000–700.000đ, hơn 18.000 học viên; Udemy “28 ngày”.' + cite(['unica','udemy']), ''],
  ['users','Workshop ở studio','500.000đ cho 1,5 giờ ở Sài Gòn, giáo viên có chứng chỉ quốc tế.' + cite(['athas']), ''],
  ['shield','Chương trình chuyên sâu','Giải phẫu, sàng lọc, kết nối y tế: khoảng trống chưa ai làm bài bản.', 'gap']
].map(([i, t, d, c]) => `<div class="stage ${c}"><span class="ib">${icon(i)}</span><h4>${t}</h4><p>${d}</p></div>`).join('');
(function chart(){
  const W = 420, H = 230, l = 50, r = 16, t = 28, b = 30;
  const x = yr => l + (yr - 2000) / 25 * (W - l - r), y = v => H - b - v / 10000 * (H - t - b);
  const pts = [[2000, 100, '≈ 100'], [2020, 5000, '5.000'], [2025, 10000, '≈ 10.000']];
  const grid = [0, 5000, 10000].map(v => `<line class="gridl" x1="${l}" x2="${W - r}" y1="${y(v)}" y2="${y(v)}"/><text class="ax" x="${l - 8}" y="${y(v) + 4}" text-anchor="end">${v.toLocaleString('vi-VN')}</text>`).join('');
  const xt = [2000, 2010, 2020, 2025].map(v => `<text class="ax" x="${x(v)}" y="${H - b + 18}" text-anchor="middle">${v}</text>`).join('');
  const [p0, p1, p2] = pts.map(([a, v]) => [x(a), y(v)]);
  $('#vn-chart-svg').innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Số thẩm mỹ viện tăng từ khoảng 100 năm 2000 lên 5.000 năm 2020, dự kiến khoảng 10.000 năm 2025">${grid}${xt}
    <path d="M${p0} L${p1}" fill="none" stroke="var(--jade)" stroke-width="2" stroke-linecap="round"/><path d="M${p1} L${p2}" fill="none" stroke="var(--jade)" stroke-width="2" stroke-dasharray="5 5" stroke-linecap="round"/>
    ${pts.map(([a, v, lab], i) => `<circle cx="${x(a)}" cy="${y(v)}" r="5" fill="${i === 2 ? 'var(--surface)' : 'var(--jade)'}" stroke="var(--jade)" stroke-width="2"/>
      <text class="vt" style="font-size:12px; font-weight:600" x="${x(a) + (i === 2 ? -8 : 8)}" y="${y(v) - 10}" text-anchor="${i === 2 ? 'end' : 'start'}">${lab}</text>
      <circle class="hov" cx="${x(a)}" cy="${y(v)}" r="16" fill="transparent" data-tip="${a}${i === 2 ? ' (dự kiến)' : ''}: ${lab} cơ sở"/>`).join('')}</svg>`;
  const box = $('#vn-chart'), tip = document.createElement('div'); tip.className = 'tip'; tip.hidden = true; box.appendChild(tip);
  box.addEventListener('pointerover', e => { const c = e.target.closest('.hov'); if (!c) return; const br = box.getBoundingClientRect(), cr = c.getBoundingClientRect(); tip.textContent = c.dataset.tip; tip.style.left = (cr.left + cr.width / 2 - br.left) + 'px'; tip.style.top = (cr.top - br.top) + 'px'; tip.hidden = false; });
  box.addEventListener('pointerout', e => { if (e.target.closest('.hov')) tip.hidden = true; });
})();

/* ---------- Phần 4: ngách ---------- */
const evCls = { 'Vừa':'ev-mid', 'Yếu':'ev-weak' };
const fitDots = n => `<span class="fit" title="Độ hợp ${n}/5">${[1, 2, 3, 4, 5].map(i => `<i class="${i <= n ? 'f' : ''}"></i>`).join('')}</span>`;
$('#niche-top').innerHTML = D.niches.filter(n => n.img).map(n => `<article class="icard"><img src="${IMG(n.img)}" alt="Minh hoạ: ${esc(n.t)}" loading="lazy"><div class="body"><h3>${esc(n.t)}</h3><div class="meta">${fitDots(n.fit)}<span>Nhu cầu: <b style="color:var(--ink)">${n.demand}</b></span>${evCls[n.ev] ? `<span class="ev ${evCls[n.ev]}">${n.ev}</span>` : ''}</div><p>${esc(n.d)}</p></div></article>`).join('');
$('#niche-rest').innerHTML = D.niches.filter(n => !n.img).map(n => `<div><b>${esc(n.t)}</b><span>${fitDots(n.fit)} · Nhu cầu ${n.demand}</span><span>${esc(n.d)}</span></div>`).join('');

/* ---------- Phần 5: tầng lão hoá ---------- */
$('#layers-viz').innerHTML = `<style>
  .lyr{display:grid; gap:0; border-radius:12px; overflow:hidden; border:1px solid var(--line)}
  .lyr > div{display:grid; grid-template-columns:minmax(0, 1fr) auto; gap:12px; align-items:center; padding:12px 14px; min-height:54px}
  .lyr b{font-size:.95rem; color:var(--ink)} .lyr span{font-size:.84rem; color:var(--ink-2); display:block}
  .lyr .fx{font-size:.76rem; font-weight:700; padding:4px 10px; border-radius:999px; white-space:nowrap; background:var(--surface)}
  .fx.yes{color:var(--good); box-shadow:inset 0 0 0 1.5px var(--good)} .fx.ind{color:var(--warn); box-shadow:inset 0 0 0 1.5px var(--warn)} .fx.no{color:var(--muted); box-shadow:inset 0 0 0 1.5px var(--line)}
  .l-skin{background:linear-gradient(180deg, var(--rose-soft), color-mix(in srgb, var(--rose-soft) 70%, var(--surface)))}
  .l-fat{background:radial-gradient(circle at 10px 10px, color-mix(in srgb, var(--amber) 22%, transparent) 5px, transparent 6px) 0 0/22px 22px, var(--amber-soft)}
  .l-mus{background:repeating-linear-gradient(-28deg, color-mix(in srgb, var(--rose) 22%, transparent) 0 2px, transparent 2px 9px), color-mix(in srgb, var(--rose-soft) 80%, var(--surface))}
  .l-lig{background:repeating-linear-gradient(90deg, color-mix(in srgb, var(--muted) 30%, transparent) 0 2px, transparent 2px 26px), var(--surface-2)}
  .l-bone{background:repeating-linear-gradient(45deg, color-mix(in srgb, var(--muted) 22%, transparent) 0 1.5px, transparent 1.5px 8px), repeating-linear-gradient(-45deg, color-mix(in srgb, var(--muted) 22%, transparent) 0 1.5px, transparent 1.5px 8px), var(--surface-2)}
  .l-lym{background:repeating-radial-gradient(circle at 0 120%, transparent 0 14px, color-mix(in srgb, var(--indigo) 16%, transparent) 14px 16px), var(--indigo-soft)}
</style><div class="lyr">
  <div class="l-skin"><div><b>Da</b><span>Collagen giảm, UV phá sợi đàn hồi; 5 năm đầu mãn kinh mất khoảng 30% collagen.${cite(['aad'])}</span></div><span class="fx ind">Gián tiếp</span></div>
  <div class="l-fat"><div><b>Mỡ dưới da</b><span>Các khoang mỡ teo và trượt xuống, má giữa xẹp.</span></div><span class="fx ind">Gián tiếp</span></div>
  <div class="l-mus"><div><b>Cơ biểu cảm</b><span>Cơ gây nếp co quá, cơ nâng đỡ yếu. Tầng có bằng chứng tốt nhất.${cite(['guzel','hwang'])}</span></div><span class="fx yes">✓ Trực tiếp</span></div>
  <div class="l-lig"><div><b>Dây chằng giữ, SMAS</b><span>Lỏng dần, mô mềm chảy xệ.</span></div><span class="fx no">✕ Không</span></div>
  <div class="l-bone"><div><b>Xương</b><span>Tiêu xương quanh ổ mắt và hàm.</span></div><span class="fx no">✕ Không</span></div>
  <div class="l-lym"><div><b>Dịch, bạch huyết</b><span>Phù buổi sáng, bọng mắt (xem Phần 6).</span></div><span class="fx ind">Có thể</span></div>
</div><p class="small muted" style="margin-top:8px">Chống nắng và retinoid mới là chính cho tầng da.${cite(['hughes','retinoid'])}</p>`;

/* ---------- Phần 7: đường phản xạ ---------- */
$('#reflex-viz').innerHTML = `<style>
  .rf{display:grid; grid-template-columns:minmax(0,1fr) 110px minmax(0,1fr) 110px minmax(0,1fr); gap:6px; align-items:center}
  .rf .nd{background:var(--surface-2); border-radius:12px; padding:12px; display:grid; gap:4px; justify-items:center; text-align:center}
  .rf .nd .ib{width:44px; height:44px; border-radius:50%; background:var(--surface); color:var(--jade); display:grid; place-items:center}
  .rf .nd b{font-size:.92rem; color:var(--ink)} .rf .nd span{font-size:.8rem; color:var(--ink-2)}
  .rf .two{display:grid; gap:8px; background:none; padding:0}
  .rf .two > div{background:var(--surface-2); border-radius:12px; padding:10px; display:grid; gap:3px; justify-items:center; text-align:center}
  .rf .ar{display:grid; gap:4px; justify-items:center; text-align:center; font-size:.76rem; font-weight:600; color:var(--jade)}
  .rf .ar i{display:block; width:100%; height:2px; background:currentColor; position:relative}
  .rf .ar i::after{content:""; position:absolute; right:-1px; top:-5px; border:6px solid transparent; border-left:9px solid currentColor; border-right:0}
  .rf .ar.v{color:var(--indigo)}
  .rf-loop{margin-top:12px; display:flex; gap:10px; align-items:center; font-size:.86rem; color:var(--ink-2); background:var(--indigo-soft); border-radius:10px; padding:9px 12px}
  .rf-loop > span{min-width:0; flex:1}
  @media (max-width:760px){ .rf{grid-template-columns:1fr} .rf .ar{padding:2px 0} .rf .ar i{width:2px; height:26px} .rf .ar i::after{right:-5px; top:auto; bottom:-2px; border:6px solid transparent; border-top:9px solid currentColor; border-bottom:0} }
</style><div class="rf" role="img" aria-label="Chạm hoặc làm lạnh da mặt kích thích dây V, tín hiệu về thân não, rồi qua dây X làm tim chậm lại và tác động tiêu hoá">
  <div class="nd"><span class="ib">${icon('face')}</span><b>Da và cơ mặt</b><span>chạm, nước lạnh, biểu cảm</span></div>
  <div class="ar"><span>dây V · cảm giác</span><i></i></div>
  <div class="nd"><span class="ib">${icon('brain')}</span><b>Thân não</b><span>nhân dây V nối với nhân dây X</span></div>
  <div class="ar v"><span>dây X · phó giao cảm</span><i></i></div>
  <div class="nd two"><div><span class="ib">${icon('heart')}</span><b>Tim chậm lại</b></div><div><span class="ib">${icon('gut')}</span><b>Tiêu hoá, nhu động</b></div></div>
</div><div class="rf-loop">${icon('route')}<span>Chiều ngược lại: dây VII đưa lệnh tới cơ mặt; nét mặt và cảm xúc ảnh hưởng qua lại (phản hồi nét mặt).${cite(['coles'])}</span></div>`;

/* ---------- Phần 8: chăm sóc da ---------- */
$('#pairs').innerHTML = D.pairs.map(p => `<div class="pair"><div class="d"><span class="k">Đông y</span><b>${esc(p.dong)}</b><span>${esc(p.dongD)}</span></div><div class="arrow">⇄</div><div class="t"><span class="k">Da liễu</span><b>${esc(p.tay)}</b><span>${esc(p.tayD)}</span></div><div class="act"><b>Nên làm:</b> ${esc(p.act)}${cite(p.s)}</div></div>`).join('');
const R = (i, t) => `<span class="rstep">${icon(i)}${t}</span>`;
$('#routine').innerHTML = `<div class="rrow"><div class="when"><span class="ib">${icon('sun')}</span>Sáng</div><div class="rsteps">${[R('drop','Rửa mặt nhẹ'), R('hand','Dẫn lưu 3 phút'), R('bottle','Serum chống oxy hoá'), R('jar','Kem dưỡng'), R('sun','Chống nắng SPF 30+')].join('<span class="sep">→</span>')}</div></div>
  <div class="rrow night"><div class="when"><span class="ib">${icon('moon')}</span>Tối</div><div class="rsteps">${[R('drop','Tẩy trang, rửa mặt'), R('hand','Face yoga hoặc gua sha'), R('bottle','Retinoid 2–3 tối/tuần'), R('jar','Kem phục hồi')].join('<span class="sep">→</span>')}</div></div>`;
$('#ingredients').innerHTML = D.ingredients.map(i => `<article class="icard sq"><img src="${IMG(i.img)}" alt="Minh hoạ ${esc(i.t)}" loading="lazy"><div class="body"><div style="display:flex; justify-content:space-between; gap:8px; align-items:baseline; flex-wrap:wrap"><h3>${esc(i.t)}</h3>${ev(i.e)}</div><p><strong>Đông y, dân gian:</strong> ${esc(i.dy)}</p><p><strong>Khoa học:</strong> ${esc(i.kh)}${cite(i.s)}</p><p class="small muted"><strong>Lưu ý:</strong> ${esc(i.w)}</p></div></article>`).join('');

/* ---------- Phần 9, 10, 11 ---------- */
$('#methods').innerHTML = D.methods.map(m => `<article class="icard"><img src="${IMG(m.img)}" alt="Minh hoạ ${esc(m.t)}" loading="lazy"><div class="body"><div style="display:flex; justify-content:space-between; gap:8px; align-items:baseline; flex-wrap:wrap"><h3>${esc(m.t)}</h3>${ev(m.e)}</div><span class="small muted">${esc(m.o)}</span><p>${esc(m.d)}${cite(m.s)}</p><p class="small"><strong>Cần học:</strong> ${esc(m.learn)}</p></div></article>`).join('');
$('#methods-more').innerHTML = D.methodsMore.map(m => `<div><b>${esc(m.t)}</b><span>${esc(m.d)}${cite(m.s)}</span></div>`).join('');
$('#countries').innerHTML = D.countries.map(c => `<article class="icard sq"><img src="${IMG(c.img)}" alt="Minh hoạ nghi thức chăm sóc da ${esc(c.c)}" loading="lazy"><div class="body"><h3>${esc(c.c)}</h3><p>${esc(c.short)}</p><p style="background:var(--jade-soft); color:var(--ink); padding:8px 10px; border-radius:8px; font-size:.88rem"><strong>Bài học:</strong> ${esc(c.lesson)}${cite(c.s)}</p></div></article>`).join('');
const ROWS = [['phil','Triết lý'],['ritual','Nghi thức'],['ingr','Nguyên liệu'],['hand','Kỹ thuật tay, dụng cụ'],['trend','Xu hướng'],['lesson','Bài học cho bạn']];
let picked = new Set(store.get('fy-cmp', ['Nhật Bản','Hàn Quốc','Trung Quốc','Việt Nam']));
function renderCmp(){
  $('#cmp-pick').innerHTML = D.countries.map(c => `<button class="chip" aria-pressed="${picked.has(c.c)}" data-c="${esc(c.c)}">${esc(c.c)}</button>`).join('');
  const cols = D.countries.filter(c => picked.has(c.c));
  $('#cmp').innerHTML = cols.length ? `<thead><tr><th></th>${cols.map(c => `<th scope="col" style="color:var(--ink); font-size:.86rem">${esc(c.c)}${cite(c.s)}</th>`).join('')}</tr></thead><tbody>${ROWS.map(([k, t]) => `<tr><th scope="row">${t}</th>${cols.map(c => `<td${k === 'lesson' ? ' style="color:var(--ink); background:var(--jade-soft)"' : ''}>${esc(c[k])}</td>`).join('')}</tr>`).join('')}</tbody>` : `<tbody><tr><td>Chọn ít nhất một quốc gia ở trên.</td></tr></tbody>`;
  numberCites();
}
$('#cmp-pick').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; const c = b.dataset.c; picked.has(c) ? picked.delete(c) : picked.add(c); store.set('fy-cmp', [...picked]); renderCmp(); });
$('#teachers').innerHTML = [
  ['DC','var(--jade)','Danielle Collins','Anh','Văn bằng massage mặt, trị liệu thư giãn, dinh dưỡng, Hatha yoga, yoga tiền và hậu sản.','Face yoga · thư giãn · dinh dưỡng · yoga bầu · sách', ['collins']],
  ['FT','var(--indigo)','Fumiko Takatsu','Nhật / Mỹ','Bắt đầu từ tình trạng lệch cơ thể sau tai nạn; xây dựng Face Yoga Method.','Face yoga · khoá online · sách, video · đào tạo giáo viên', ['takatsu','gvr']],
  ['AH','var(--rose)','Annelise Hagen','Mỹ','Giáo viên yoga ở New York, tác giả The Yoga Face.','Yoga thân · face yoga · sách', ['hagen','nbc']],
  ['NH','var(--amber)','Nguyễn Hiếu','Việt Nam','CEO Zenlife Yoga, 21 khoá online; khoá face yoga có cả dầu dưỡng, chăm sóc mắt.','Yoga · thiền · face yoga · chăm sóc da tự nhiên', ['unica']],
  ['VL','var(--plum)','Ally Vân Anh và Lenka Seminova','Việt Nam','Chứng chỉ Face Yoga Method 2021; workshop gồm cổ, mắt, thở, tuần hoàn.','Workshop ở studio yoga · face yoga kèm thở', ['athas']],
  ['BR','var(--good)','Chuyên viên âm ngữ trị liệu','Brazil','Fonoaudiologia estética: bài tập cơ mặt và cổ trong chăm sóc ban đầu.','Phục hồi miệng–mặt · thẩm mỹ · nuốt, phát âm', ['brazil']]
].map(([ini, col, n, c, d, g, s]) => `<div class="card"><div class="who"><span class="avatar" style="background:${col}">${ini}</span><div><h3>${esc(n)}</h3><span class="tag">${c}</span></div></div><p>${esc(d)}${cite(s)}</p><p class="small"><strong>Dạy kèm:</strong> ${esc(g)}</p></div>`).join('');
$('#bundles').innerHTML = [['mat','Yoga thân','Hatha, Yin, phục hồi, bầu, cổ vai gáy'],['breath','Hơi thở, thiền','Pranayama, yoga nidra'],['eye','Mắt','Yoga mắt, thư giãn mắt màn hình'],['hand','Kỹ thuật tay','Massage mặt, gua sha, Kobido, dẫn lưu'],['drop','Chăm sóc da','Quy trình cơ bản, dầu dưỡng'],['heart','Lối sống','Dinh dưỡng, giấc ngủ, stress'],['cart','Sản phẩm','Dầu, đá gua sha, sách, app'],['cap','Đào tạo','Chứng chỉ, khoá online, thử thách 21–28 ngày']]
  .map(([i, t, d]) => `<div><span class="ib">${icon(i)}</span><div><h4>${t}</h4><p>${d}</p></div></div>`).join('');

/* ---------- Phần 12: công cụ ---------- */
const SCR = [
  ['stop','Méo miệng, yếu nửa mặt, nói khó xuất hiện đột ngột','Nghi đột quỵ: gọi 115 ngay, không tập.'],
  ['stop','Đau hàm, cổ, ngực, cánh tay kèm khó thở, vã mồ hôi','Nghi tim mạch: gọi 115 ngay.'],
  ['stop','Hạch cổ hoặc dưới hàm sưng cứng, không đau, trên 2 tuần','Cần đi khám trước khi dẫn lưu.'],
  ['stop','Đang điều trị ung thư vùng đầu cổ hoặc vừa nạo hạch','Cần bác sĩ và chuyên viên phù bạch huyết cho phép.'],
  ['stop','Nhiễm trùng da, herpes môi đang bùng phát, sốt','Hoãn buổi tập mặt; chỉ tập thở.'],
  ['stop','Huyết khối tĩnh mạch hoặc suy tim chưa kiểm soát','Không dẫn lưu bạch huyết.'],
  ['adj','Tiêm botox, filler, căng chỉ trong 2 tuần gần đây','Tránh day ấn vùng đã tiêm; hỏi bác sĩ thẩm mỹ khi nào tập lại.'],
  ['adj','Mụn viêm, rosacea, giãn mao mạch','Bỏ gua sha, giác hơi, chà xát; chỉ tập cơ không chạm.'],
  ['adj','Đau khớp thái dương hàm, kẹt hàm','Không há hết cỡ, không kháng lực hàm; nên gặp nha sĩ.'],
  ['adj','Thoái hoá cột sống cổ, chóng mặt khi ngửa cổ','Giới hạn biên độ ngửa, tập ngồi có tựa.'],
  ['adj','Đang mang thai','Tư thế ngồi; theo truyền thống tránh ấn mạnh Kiên tỉnh (GB21), Hợp cốc (LI4).'],
  ['adj','Đang dùng thuốc chống đông','Gua sha rất nhẹ hoặc bỏ.'],
  ['adj','Vừa dùng retinoid, peel, laser','Da nhạy cảm: không chà xát, không dầu nóng.'],
  ['adj','Liệt mặt (Bell) đang hồi phục','Phối hợp bác sĩ hoặc vật lý trị liệu; tránh co cơ mạnh giai đoạn sớm.']
];
$('#screen-list').innerHTML = `<div class="grp">Dừng lại, chuyển chuyên gia</div>` + SCR.map(([, t], i) => (i === 6 ? `<div class="grp">Điều chỉnh buổi tập</div>` : '') + `<label for="sc${i}"><input type="checkbox" id="sc${i}" data-i="${i}"><span>${esc(t)}</span></label>`).join('');
function renderScreen(){
  const on = $$('#screen-list input:checked').map(x => SCR[+x.dataset.i]), stop = on.filter(x => x[0] === 'stop'), adj = on.filter(x => x[0] === 'adj'), r = $('#screen-result');
  if (stop.length){ r.className = 'result stop'; r.innerHTML = `<span class="st">■ Chưa tập, chuyển chuyên gia</span><ul>${[...stop, ...adj].map(x => `<li>${esc(x[2])}</li>`).join('')}</ul>`; }
  else if (adj.length){ r.className = 'result adj'; r.innerHTML = `<span class="st">▲ Tập được, cần điều chỉnh</span><ul>${adj.map(x => `<li>${esc(x[2])}</li>`).join('')}</ul>`; }
  else { r.className = 'result ok'; r.innerHTML = `<span class="st">● Không thấy dấu hiệu cần lưu ý</span><p class="small">Vẫn hỏi lại cảm giác của học viên trong và sau buổi tập.</p>`; }
}
$('#screen-list').addEventListener('change', renderScreen); renderScreen();
const PLAN = { 15:{breath:2,neck:2,drain:2,warm:1,main:5,massage:0,rest:3}, 30:{breath:3,neck:5,drain:4,warm:2,main:10,massage:3,rest:3}, 45:{breath:5,neck:7,drain:6,warm:3,main:15,massage:5,rest:4}, 60:{breath:5,neck:10,drain:8,warm:4,main:20,massage:8,rest:5} };
const GOALS = {
  lift:{ n:'Nâng cơ má và đường hàm', main:['Nâng má (chữ O, cười): 5 giây × 10','Cười ngậm môi nâng khoé: 10 giây × 6','Chữ V cho mí dưới: 5 giây × 6','Mặt cá: 5 giây × 8','Gập cằm kháng lực: 5 giây × 10','Sư tử để xả căng: 3 lần'] },
  depuff:{ n:'Giảm bọng, dẫn lưu', main:['Dẫn lưu đủ 8 bước, làm chậm','Sư tử: 3 hơi thở','Ép lưỡi lên vòm rồi nuốt chậm: 5 lần','Ngón áp út vòng quanh ổ mắt rất nhẹ: 5 vòng','Kết thúc ở hõm thượng đòn: 10 lần'] },
  jaw:{ n:'Thả lỏng hàm, ngủ ngon', main:['Tư thế nghỉ hàm (lưỡi, môi, răng): 1 phút','Day cơ cắn và cơ thái dương: 2 phút','Há miệng có kiểm soát, lưỡi chạm vòm: 6 lần','Sư tử: 3 lần','Thở 4 nhịp vào, 8 nhịp ra: 6 vòng'] },
  neck:{ n:'Cổ vai gáy văn phòng', main:['Gập cằm nằm ngửa: 5 giây × 10','Kéo giãn cơ ức đòn chũm: 5 nhịp thở mỗi bên','Lăn vai 8 lần, khép bả vai 8 lần','Nhìn chéo lên, đẩy môi dưới (cơ bám da cổ): 8 lần','Tư thế cá có gối đỡ: 2–3 phút'] }
};
const AUD = { general:'', office:'Thêm yoga mắt 20-20-20 vào khởi động; nhắc chỉnh màn hình ngang tầm mắt.', meno:'Da mỏng và khô hơn: lực nhẹ hơn, thêm dầu dưỡng; thêm thở chậm giúp dịu bốc hoả.', post:'Tập ngồi có tựa, không nằm sấp; tăng thời lượng phần cổ vai. Có tiền sử huyết áp cao thai kỳ: cần bác sĩ cho phép.', senior:'Ngồi ghế, biên độ cổ nhỏ, không ngửa tối đa. Có răng giả: bỏ bài kháng lực hàm mạnh.' };
function renderPlan(){
  const dur = $('#b-dur').value, g = GOALS[$('#b-goal').value], a = $('#b-aud').value, p = PLAN[dur];
  const blocks = [
    ['breath','Đến với hơi thở','Thở bụng, thở ra dài gấp đôi hít vào. Quét căng thẳng: trán, mày, hàm, lưỡi.' + (a === 'office' ? ' Thêm 20-20-20 cho mắt.' : '')],
    ['neck','Cổ vai gáy','Lăn vai, nghiêng tai về vai, xoay cổ biên độ nhỏ, gập cằm.'],
    ['drain','Dẫn lưu bạch huyết','Thượng đòn, cổ, quanh tai, dưới hàm, má, mắt, trán (Phần 6).'],
    ['warm','Làm ấm mặt','Xoa ấm lòng bàn tay, áp lên mặt 3 nhịp thở, vỗ nhẹ đầu ngón tay.'],
    ['main', g.n, ''],
    ['massage','Massage hoặc gua sha nhẹ có dầu','Từ trong ra ngoài, từ dưới lên trên, kết thúc vuốt về cổ.' + (a === 'meno' ? ' Lực nhẹ hơn bình thường.' : '')],
    ['rest','Thư giãn','Nằm phục hồi, thả lỏng mặt theo từng vùng (yoga nidra ngắn). Hỏi cảm nhận của học viên.']
  ].filter(b => p[b[0]] > 0);
  $('#plan').innerHTML = blocks.map(([k, t, d]) => `<li><span class="min">${p[k]} phút</span><div><b>${esc(t)}</b>${k === 'main' ? `<ul>${g.main.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : `<p>${esc(d)}</p>`}</div></li>`).join('') + (AUD[a] ? `<li><span class="min">Lưu ý</span><div><p>${esc(AUD[a])}</p></div></li>` : '');
  renderPlan.text = `Giáo án ${dur} phút: ${g.n}\n` + blocks.map(([k, t, d]) => `- ${p[k]}': ${t}${k === 'main' ? '\n' + g.main.map(x => '    • ' + x).join('\n') : ': ' + d}`).join('\n') + (AUD[a] ? `\nLưu ý: ${AUD[a]}` : '');
}
['#b-dur','#b-goal','#b-aud'].forEach(s => $(s).addEventListener('change', renderPlan)); renderPlan();
$('#copy-plan').addEventListener('click', () => { const msg = $('#copy-msg');
  navigator.clipboard.writeText(renderPlan.text).then(() => { msg.textContent = 'Đã sao chép.'; }, () => { const r = document.createRange(); r.selectNodeContents($('#plan')); const s = getSelection(); s.removeAllRanges(); s.addRange(r); msg.textContent = 'Đã bôi đen giáo án, nhấn Ctrl/⌘ + C để sao chép.'; }); });
const RM = [
  ['Tháng 1 · Nền tảng', ['Học 22 cơ và 9 nhóm hạch trên Bản đồ khuôn mặt','Tự tập 20 phút mỗi ngày; chụp ảnh chuẩn hoá (cùng ánh sáng, góc) ở tuần 0, 4, 8, 12','Đọc 4 nghiên cứu: Alam 2018, Hwang 2018, Güzel 2025 và tổng quan 2024','Soạn phiếu sàng lọc an toàn và mẫu đồng thuận']],
  ['Tháng 2 · Kỹ năng', ['Chọn một chương trình có chứng chỉ (Face Yoga Method, Danielle Collins hoặc khoá trong nước)','Học một kỹ thuật tay có thực hành: dẫn lưu bạch huyết mặt hoặc gua sha','Soạn 3 giáo án 15, 30, 45 phút bằng công cụ trên','Dạy thử miễn phí cho 5–10 học viên cũ, thu phản hồi']],
  ['Tháng 3 · Ra mắt', ['Chọn một ngách chính (ví dụ face yoga kết hợp cổ vai gáy văn phòng)','Mở workshop 90 phút (tham chiếu: 500.000đ cho 1,5 giờ ở Sài Gòn năm 2022)','Viết nội dung quảng bá theo bảng câu chữ, có trích nguồn','Kết nối một nha sĩ hoặc bác sĩ da liễu để giới thiệu hai chiều']]
];
let done = new Set(store.get('fy-roadmap', []));
function renderRM(){
  const total = RM.reduce((s, [, a]) => s + a.length, 0);
  $('#roadmap').innerHTML = RM.map(([t, arr], mi) => `<div class="checks"><div class="grp" style="margin-top:0">${t}</div>${arr.map((x, i) => { const id = `rm${mi}-${i}`; return `<label for="${id}"><input type="checkbox" id="${id}" data-k="${id}" ${done.has(id) ? 'checked' : ''}><span>${esc(x)}</span></label>`; }).join('')}</div>`).join('');
  $('#rm-count').textContent = `${done.size}/${total} việc`; $('#rm-bar').style.width = (done.size / total * 100) + '%';
}
$('#roadmap').addEventListener('change', e => { const k = e.target.dataset.k; if (!k) return; e.target.checked ? done.add(k) : done.delete(k); store.set('fy-roadmap', [...done]); renderRM(); });
renderRM();
$('#say').innerHTML = `<div class="h no">Tránh nói</div><div class="h yes">Nên nói</div>` + [
  ['“Trẻ hoá 10 tuổi sau 7 ngày”','“Một nghiên cứu nhỏ: sau 20 tuần tập đều, bác sĩ đánh giá trẻ hơn khoảng 3 tuổi.”'],
  ['“Thay thế hoàn toàn Botox, filler”','“Lựa chọn không xâm lấn; có thể dùng song song theo tư vấn của bác sĩ.”'],
  ['“Ấn huyệt này chữa đau dạ dày, mất ngủ”','“Theo Đông y, vùng này liên hệ với...; trong lớp, mình dùng để thư giãn.”'],
  ['“Thải độc qua hạch bạch huyết”','“Hỗ trợ dòng chảy bạch huyết, giảm cảm giác phù buổi sáng.”'],
  ['“Nhìn mặt biết bệnh”','“Nếu thấy dấu hiệu bất thường, bạn nên đi khám.”'],
  ['“Đốt mỡ mặt, gọt hàm”','“Thả lỏng cơ hàm, cải thiện tư thế cổ; đường viền có thể rõ hơn.”']
].map(([a, b]) => `<div class="no">${esc(a)}</div><div class="yes">${esc(b)}</div>`).join('');

/* ---------- tabs lăng kính ---------- */
$('#lens-tabs').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return;
  $$('#lens-tabs button').forEach(x => x.setAttribute('aria-selected', x === b));
  $$('[data-panel]').forEach(p => p.hidden = p.dataset.panel !== b.dataset.tab); });

/* ---------- trích dẫn: đánh số theo thứ tự xuất hiện ---------- */
const keys = Object.keys(D.sources); let order = [];
function numberCites(){
  const seen = [];
  $$('sup.c[data-s]').forEach(el => el.dataset.s.split(',').forEach(k => { if (D.sources[k] && !seen.includes(k)) seen.push(k); }));
  keys.forEach(k => { if (!seen.includes(k)) seen.push(k); });
  if (seen.join() !== order.join()){ order = seen;
    $('#sources').innerHTML = order.map(k => { const s = D.sources[k]; return `<li id="src-${k}">${esc(s.t)}${s.u ? ` <a href="${s.u}" target="_blank" rel="noopener">${esc(s.u.replace(/^https?:\/\//, '').slice(0, 70))}${s.u.length > 78 ? '…' : ''}</a>` : ''}</li>`; }).join(''); }
  $$('sup.c[data-s]').forEach(el => { el.innerHTML = el.dataset.s.split(',').filter(k => D.sources[k]).map(k => `<a href="#src-${k}" aria-label="Nguồn ${order.indexOf(k) + 1}">${order.indexOf(k) + 1}</a>`).join(','); });
}
renderTL(); renderCmp(); setLayer('muscles'); numberCites();

/* ---------- mục lục theo vị trí cuộn ---------- */
const links = $$('#toc a'), secs = links.map(a => $(a.getAttribute('href')));
const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting){ const i = secs.indexOf(en.target); links.forEach((a, j) => a.classList.toggle('on', j === i)); const nav = $('#toc'), a = links[i]; nav.scrollTo({ left: a.offsetLeft - nav.clientWidth / 2 + a.offsetWidth / 2, behavior: 'smooth' }); } }), { rootMargin:'-45% 0px -50% 0px' });
secs.forEach(s => s && io.observe(s));
})();
