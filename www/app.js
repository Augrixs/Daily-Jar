'use strict';
/* Daily Jar: a deposit / withdraw notebook. Data stays on this device (localStorage). Years are always CE. */

const KEY = 'aug-jar-v1';
const ROWS = 31; // rows per table
const MAX_AMOUNT = 999999999.99; // largest single amount
const MON = { en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], th: ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'] };
const MONFULL = { en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'], th: ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'] };
const DAYFULL = { en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], th: ['วันอาทิตย์', 'วันจันทร์', 'วันอังคาร', 'วันพุธ', 'วันพฤหัสบดี', 'วันศุกร์', 'วันเสาร์'] };
const DAYSHORT = { en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], th: ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'] };
const TX = {
  title: ['Daily Jar', 'Daily Jar'],
  balance: ['Savings', 'เงินออมคงเหลือ'],
  deposited: ['Deposited', 'ฝากรวม'],
  book: ['Notebook', 'สมุด'],
  charts: ['Charts', 'กราฟ'],
  deposit: ['Deposit', 'ฝาก'],
  withdraw: ['Withdraw', 'ถอน'],
  saveDep: ['Save deposit', 'บันทึกการฝาก'],
  saveWd: ['Save withdrawal', 'บันทึกการถอน'],
  amount: ['Amount', 'จำนวนเงิน'],
  noteDep: ['Note: where did it come from?', 'โน้ต: ได้มาจากไหน'],
  noteWd: ['Note: what was it for?', 'โน้ต: เอาไปทำอะไร'],
  cancel: ['Cancel', 'ยกเลิก'],
  badAmount: ['Type an amount above 0 (up to 999,999,999)', 'ใส่จำนวนเงินมากกว่า 0 (ไม่เกิน 999,999,999)'],
  saved: ['Saved', 'บันทึกแล้ว'],
  del: ['Delete this entry', 'ลบรายการนี้'],
  delAsk: ['Delete this entry? The balance changes.', 'ลบรายการนี้ใช่ไหม ยอดคงเหลือจะเปลี่ยน'],
  deleted: ['Deleted', 'ลบแล้ว'],
  edit: ['Edit entry', 'แก้ไขรายการ'],
  date: ['Date', 'วันที่'],
  time: ['Time', 'เวลา'],
  type: ['Type', 'ประเภท'],
  note: ['Note', 'โน้ต'],
  bal: ['Balance', 'คงเหลือ'],
  amt: ['Amount', 'จำนวน'],
  menu: ['Menu', 'เมนู'],
  sound: ['Button sounds: on / off', 'เสียงปุ่ม: เปิด / ปิด'],
  language: ['Language', 'ภาษา'],
  currency: ['Change currency symbol', 'เปลี่ยนสัญลักษณ์เงิน'],
  currencyAsk: ['Currency symbol (for example ฿ or $)', 'สัญลักษณ์เงิน (เช่น ฿ หรือ $)'],
  csv: ['Export CSV', 'ส่งออก CSV'],
  backup: ['Back up (JSON file)', 'สำรองข้อมูล (ไฟล์ JSON)'],
  restore: ['Restore from backup', 'กู้คืนจากไฟล์สำรอง'],
  restored: ['Restored', 'กู้คืนแล้ว'],
  badFile: ['That file is not a backup', 'ไฟล์นี้ไม่ใช่ไฟล์สำรอง'],
  reset: ['Delete everything', 'ลบข้อมูลทั้งหมด'],
  resetAsk: ['Delete ALL entries on this device? This cannot be undone.', 'ลบรายการทั้งหมดในเครื่องนี้ใช่ไหม กู้คืนไม่ได้'],
  close: ['Close', 'ปิด'],
  table: ['Table', 'ตารางที่'],
  week: ['Week', 'สัปดาห์'],
  month: ['Month', 'เดือน'],
  year: ['Year', 'ปี'],
  deposits: ['Deposits', 'การฝาก'],
  withdrawals: ['Withdrawals', 'การถอน'],
  topDep: ['Most deposited', 'ฝากมากที่สุด'],
  topWd: ['Most withdrawn', 'ถอนมากที่สุด'],
  noData: ['No data for this period', 'ยังไม่มีข้อมูลในช่วงนี้'],
  other: ['Other', 'อื่นๆ'],
  total: ['Total', 'รวม'],
  prev: ['Previous', 'ก่อนหน้า'],
  next: ['Next', 'ถัดไป'],
  weekOf: ['Week', 'สัปดาห์'],
  graph: ['Graph', 'กราฟเส้น'],
  r24h: ['24H', '24 ชม.'], r7d: ['7D', '7 วัน'], r30d: ['30D', '30 วัน'], r90d: ['90D', '90 วัน'], r1y: ['1Y', '1 ปี'], rall: ['All', 'ทั้งหมด'],
  gHint: ['Drag to move · pinch or +/− to zoom · tap a point for details', 'ลากเพื่อเลื่อน · บีบนิ้วหรือกด +/− เพื่อซูม · แตะจุดเพื่อดูรายละเอียด'],
  gNone: ['No entries yet. Add a deposit to see the graph.', 'ยังไม่มีรายการ เพิ่มการฝากเพื่อดูกราฟ'],
  gDep: ['Deposits', 'ฝาก'], gWd: ['Withdrawals', 'ถอน'], gBal: ['Balance', 'ยอดคงเหลือ'], gChange: ['In this view', 'ในช่วงที่เห็น'],
  version: ['Version', 'เวอร์ชัน'],
  pinCreate: ['Create a 4-digit PIN', 'ตั้งรหัส PIN 4 หลัก'],
  pinCreateSub: ['Keeps others out of your savings. It cannot be recovered, so remember it.', 'กันคนอื่นแอบเปิดดู กู้คืนไม่ได้ จำให้ดีนะ'],
  pinConfirm: ['Confirm your PIN', 'ยืนยัน PIN อีกครั้ง'],
  pinMismatch: ['PINs did not match. Try again.', 'PIN ไม่ตรงกัน ลองใหม่'],
  pinEnter: ['Enter your PIN', 'ใส่ PIN'],
  pinWrong: ['Wrong PIN', 'PIN ไม่ถูกต้อง'],
  pinWait: ['Too many tries. Wait 30 seconds.', 'ผิดหลายครั้ง รอ 30 วินาที'],
  pinForgot: ['Forgot PIN?', 'ลืม PIN?'],
  pinForgotAsk: ['A PIN cannot be recovered. Erase ALL data on this device and set a new PIN?', 'กู้ PIN ไม่ได้ ลบข้อมูลทั้งหมดในเครื่องนี้แล้วตั้ง PIN ใหม่ไหม'],
  pinChange: ['Change PIN', 'เปลี่ยน PIN'],
  pinCurrent: ['Enter your current PIN', 'ใส่ PIN ปัจจุบัน'],
  pinNew: ['Enter a new PIN', 'ใส่ PIN ใหม่'],
  pinChanged: ['PIN changed', 'เปลี่ยน PIN แล้ว'],
  books: ['Saving Book', 'สมุดออมเงิน'],
  newBook: ['+ New book', '+ สร้างสมุดใหม่'],
  bookName: ['Book name', 'ชื่อสมุด'],
  create: ['Create', 'สร้าง'],
  delBook: ['Delete book', 'ลบสมุด'],
  renameBook: ['Rename book', 'เปลี่ยนชื่อสมุด'],
  delBookAsk: ['Delete this book and all its entries? This cannot be undone.', 'ลบสมุดนี้และรายการทั้งหมดในสมุดไหม กู้คืนไม่ได้'],
  noBooks: ['No books yet. Create your first one.', 'ยังไม่มีสมุด สร้างเล่มแรกได้เลย'],
  entriesWord: ['entries', 'รายการ'],
  badName: ['Type a name', 'ใส่ชื่อก่อน'],
  goals: ['Goals', 'เป้าหมาย'],
  addGoal: ['+ Goal', '+ เป้าหมาย'],
  reorder: ['Reorder', 'เรียงลำดับ'],
  goalNote: ['Goal (for example: buy snacks)', 'เป้าหมาย (เช่น ซื้อขนม)'],
  goalTarget: ['Target amount', 'จำนวนเงินเป้าหมาย'],
  goalOrder: ['Priority (1 = first)', 'ลำดับความสำคัญ (1 = ก่อน)'],
  newGoal: ['New goal', 'สร้างเป้าหมาย'],
  editGoal: ['Edit goal', 'แก้ไขเป้าหมาย'],
  delGoal: ['Delete goal', 'ลบเป้าหมาย'],
  delGoalAsk: ['Delete this goal?', 'ลบเป้าหมายนี้ไหม'],
  dragHint: ['Drag ≡ up or down to change the order', 'ลาก ≡ ขึ้นลงเพื่อเรียงลำดับ'],
  saveBtn: ['Save', 'บันทึก'],
  defaultBook: ['My Savings', 'เงินออมของฉัน'],
  resetBookAsk: ['Delete ALL entries in this book? This cannot be undone.', 'ลบรายการทั้งหมดในสมุดนี้ไหม กู้คืนไม่ได้'],
  resetAllAsk: ['Delete ALL books and entries on this device? This cannot be undone.', 'ลบสมุดและรายการทั้งหมดในเครื่องนี้ไหม กู้คืนไม่ได้'],
};

/* ---------- button sounds and a little bounce (Web Audio, no sound files) ---------- */
let actx = null;
function tone(type, f0, f1, at, len, vol) {
  const o = actx.createOscillator(), g = actx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(f0, at);
  o.frequency.exponentialRampToValueAtTime(Math.max(30, f1), at + len);
  g.gain.setValueAtTime(0.0001, at);
  g.gain.exponentialRampToValueAtTime(vol, at + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, at + len);
  o.connect(g); g.connect(actx.destination);
  o.start(at); o.stop(at + len + 0.02);
}
function playSfx(kind) {
  if (db.sound === false) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    if (actx.state === 'suspended') actx.resume();
    const at = actx.currentTime + 0.005;
    if (kind === 'up') { tone('sine', 520, 780, at, 0.1, 0.22); tone('sine', 780, 1170, at + 0.07, 0.14, 0.2); }
    else if (kind === 'down') tone('triangle', 330, 150, at, 0.16, 0.25);
    else tone('sine', 640, 960, at, 0.07, 0.2);
  } catch { /* sound is optional */ }
}
document.addEventListener('pointerdown', (e) => {
  const el = e.target && e.target.closest ? e.target.closest('button') : null;
  if (!el || el.disabled) return;
  const c = el.classList;
  playSfx(c.contains('dep') && !c.contains('on') ? 'up' : c.contains('wd') && !c.contains('on') ? 'down' : c.contains('save') ? (c.contains('wd') ? 'down' : 'up') : c.contains('danger') ? 'down' : 'tap');
  c.remove('pop'); void el.offsetWidth; c.add('pop');
}, true);
document.addEventListener('animationend', (e) => { if (e.animationName === 'pop-bounce') e.target.classList.remove('pop'); });

let unlocked = false;
let db = load();
let tab = 'book';
let tablePage = null; // null = last table
let mode = 'week';
let anchor = new Date();
const $app = document.getElementById('app');

function newId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
function curBook() { return (db && db.books.find((b) => b.id === db.current)) || null; }
// db.entries always means "the entries of the book that is open"
function attach(st) {
  Object.defineProperty(st, 'entries', { configurable: true, enumerable: false, get() { const b = curBook(); return b ? b.entries : []; }, set(v) { const b = curBook(); if (b) b.entries = v; } });
  return st;
}
function okGoal(g) { return g && typeof g.note === 'string' && g.note.trim() && Number.isFinite(g.target) && g.target > 0; }
function normalize(d) {
  const st = { lang: d.lang === 'th' ? 'th' : 'en', cur: typeof d.cur === 'string' ? d.cur : '฿', sound: d.sound !== false, pin: null, current: null, books: [] };
  if (d.pin && typeof d.pin.hash === 'string' && typeof d.pin.salt === 'string') st.pin = { salt: d.pin.salt, hash: d.pin.hash };
  if (Array.isArray(d.books)) {
    st.books = d.books.filter((b) => b && typeof b.name === 'string').map((b) => ({
      id: String(b.id || newId()), name: b.name.slice(0, 40),
      entries: Array.isArray(b.entries) ? b.entries.filter(okEntry) : [],
      goals: Array.isArray(b.goals) ? b.goals.filter(okGoal).slice(0, 30).map((g) => ({ id: String(g.id || newId()), note: g.note.slice(0, 60), target: Math.min(g.target, MAX_AMOUNT) })) : [],
    }));
  } else if (Array.isArray(d.entries)) {
    st.books = [{ id: newId(), name: TX.defaultBook[st.lang === 'th' ? 1 : 0], entries: d.entries.filter(okEntry), goals: [] }];
  }
  if (st.books.some((b) => b.id === d.current)) st.current = d.current;
  return attach(st);
}
function load() {
  try {
    const d = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (d && (Array.isArray(d.books) || Array.isArray(d.entries))) return normalize(d);
  } catch { /* fresh start */ }
  return normalize({});
}
function okEntry(e) { return e && (e.type === 'dep' || e.type === 'wd') && Number.isFinite(e.amount) && e.amount > 0 && Number.isFinite(e.ts); }
function persist() { try { localStorage.setItem(KEY, JSON.stringify(db)); } catch { toast('Storage is full or blocked'); } }
const t = (k) => TX[k][db.lang === 'th' ? 1 : 0];
const L = () => (db.lang === 'th' ? 'th' : 'en');

const pad = (n) => String(n).padStart(2, '0');
const dayKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const fmtLong = (d) => `${DAYFULL[L()][d.getDay()]} ${d.getDate()} ${MONFULL[L()][d.getMonth()]} ${d.getFullYear()}`;
const fmtShort = (d) => `${DAYSHORT[L()][d.getDay()]} ${d.getDate()} ${MON[L()][d.getMonth()]} ${d.getFullYear()}`;
const fmtTime = (d) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;
const num = (n) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(n);
const money = (n) => (n < 0 ? '−' : '') + db.cur + num(Math.abs(n));
const round2 = (n) => Math.round(n * 100) / 100;
const sorted = () => [...db.entries].sort((a, b) => a.ts - b.ts);

function totals() {
  let dep = 0, wd = 0;
  for (const e of db.entries) (e.type === 'dep' ? (dep += e.amount) : (wd += e.amount));
  return { dep: round2(dep), wd: round2(wd), bal: round2(dep - wd) };
}

function h(tag, attrs, ...kids) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (k === 'class') el.className = v;
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else if (v !== false && v != null) el.setAttribute(k, v);
  }
  for (const c of kids.flat()) if (c != null && c !== false) el.append(c.nodeType ? c : document.createTextNode(String(c)));
  return el;
}
function svgEl(tag, attrs, ...kids) {
  const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const [k, v] of Object.entries(attrs || {})) el.setAttribute(k, v);
  for (const c of kids.flat()) if (c != null) el.append(c.nodeType ? c : document.createTextNode(String(c)));
  return el;
}
function toast(msg) {
  const el = h('div', { class: 'toast' }, msg);
  document.body.append(el);
  setTimeout(() => el.remove(), 1800);
}

/* ---------- frame ---------- */
const menuChip = () => h('button', { class: 'chip', type: 'button', onclick: openMenu }, '☰ ' + t('menu'));
function render() {
  if (!unlocked || !db.pin) return;
  const b = curBook();
  if (!b) { db.current = null; renderBooks(); return; }
  const T = totals();
  $app.replaceChildren(
    h('div', { class: 'top' },
      h('div', { class: 'toplft' }, h('button', { class: 'chip backbtn', type: 'button', 'aria-label': 'Back', onclick: closeBook }, '←'), h('h1', { onclick: () => openNewBook(b) }, b.name)),
      menuChip()),
    h('div', { class: 'balance' }, h('small', {}, t('balance')), bigBalance(T.bal),
      h('div', { class: 'row' }, h('span', { class: 'up' }, `${t('deposited')} ${money(T.dep)}`))),
    goalsView(b),
    tab === 'book' ? bookView() : tab === 'graph' ? graphView() : chartsView(),
    h('nav', { class: 'tabbar' },
      h('button', { type: 'button', class: tab === 'book' ? 'on' : '', onclick: () => { tab = 'book'; render(); } }, '📒 ' + t('book')),
      h('button', { type: 'button', class: tab === 'graph' ? 'on' : '', onclick: () => { tab = 'graph'; G.v1 = 0; render(); } }, '📈 ' + t('graph')),
      h('button', { type: 'button', class: tab === 'charts' ? 'on' : '', onclick: () => { tab = 'charts'; render(); } }, '📊 ' + t('charts'))),
  );
}
function closeBook() { db.current = null; persist(); tablePage = null; render(); }
function openBook(id) { db.current = id; tab = 'book'; tablePage = null; persist(); render(); }

/* ---------- books ---------- */
function bookBal(b) { let v = 0; for (const e of b.entries) v += e.type === 'dep' ? e.amount : -e.amount; return round2(v); }
function renderBooks() {
  $app.replaceChildren(
    h('div', { class: 'top' }, h('h1', {}, '📚 ' + t('books')), menuChip()),
    db.books.length
      ? h('div', { class: 'blist' }, db.books.map((b) => h('div', { class: 'bcard' },
        h('button', { class: 'bmain', type: 'button', onclick: () => openBook(b.id) }, h('b', {}, b.name), h('span', { class: 'bsub' }, `${money(bookBal(b))} · ${b.entries.length} ${t('entriesWord')}`)),
        h('button', { class: 'bdel', type: 'button', 'aria-label': t('renameBook'), onclick: () => openNewBook(b) }, '✎'),
        h('button', { class: 'bdel', type: 'button', 'aria-label': t('delBook'), onclick: () => { if (!confirm(t('delBookAsk'))) return; db.books = db.books.filter((x) => x.id !== b.id); persist(); render(); } }, '🗑'))))
      : h('div', { class: 'empty' }, t('noBooks')),
    h('button', { class: 'addbtn dep newbook', type: 'button', onclick: () => openNewBook() }, t('newBook')));
}
function openNewBook(existing) {
  const name = h('input', { class: 'input', type: 'text', maxlength: '40', value: existing ? existing.name : '', placeholder: t('bookName'), 'aria-label': t('bookName') });
  const err = h('div', { class: 'err' });
  const go = () => {
    const v = name.value.trim();
    if (!v) { err.textContent = t('badName'); return; }
    if (existing) { existing.name = v; persist(); sh.remove(); render(); toast(t('saved')); return; }
    const b = { id: newId(), name: v, entries: [], goals: [] };
    db.books.push(b); sh.remove(); openBook(b.id);
  };
  name.addEventListener('keydown', (e) => { if (e.key === 'Enter') go(); });
  const sh = sheet([h('h3', {}, existing ? t('renameBook') : t('newBook').replace('+ ', '')), name, err,
    h('button', { class: 'save dep', type: 'button', onclick: go }, existing ? t('saveBtn') : t('create')),
    h('button', { class: 'ghost', type: 'button', onclick: () => sh.remove() }, t('cancel'))]);
  setTimeout(() => name.focus(), 50);
}

/* ---------- goals ---------- */
// The balance fills the goals from the top down: the first goal first, then the next one.
function goalAlloc(b) {
  let rest = Math.max(0, bookBal(b));
  return b.goals.map((g) => { const a = Math.min(g.target, rest); rest = round2(rest - a); return { g, pct: Math.floor((a / g.target) * 100) }; });
}
function goalsView(b) {
  const al = goalAlloc(b);
  return h('div', { class: 'goals' },
    h('div', { class: 'ghead' }, h('b', {}, '🎯 ' + t('goals')),
      h('div', { class: 'gbtns' },
        al.length > 1 ? h('button', { class: 'chip', type: 'button', onclick: openReorder }, '⇅ ' + t('reorder')) : null,
        al.length < 30 ? h('button', { class: 'chip', type: 'button', onclick: () => openGoal(null) }, t('addGoal')) : null)),
    al.map(({ g, pct }) => h('button', { class: 'goal' + (pct >= 100 ? ' done' : ''), type: 'button', onclick: () => openGoal(g) },
      h('div', { class: 'gnote' }, (pct >= 100 ? '✓ ' : '') + g.note),
      h('div', { class: 'gbar' }, h('span', { class: 'g0' }, '0'),
        h('div', { class: 'gtrack' }, h('div', { class: 'gfill', style: `width:${pct}%` }), h('span', { class: 'gpct' }, pct + '%')),
        h('span', { class: 'gt' }, money(g.target))))));
}
function openGoal(g) {
  const b = curBook();
  const note = h('input', { class: 'input', type: 'text', maxlength: '60', value: g ? g.note : '', placeholder: t('goalNote'), 'aria-label': t('goalNote') });
  const target = h('input', { class: 'input num', type: 'text', inputmode: 'decimal', value: g ? String(g.target) : '', placeholder: t('goalTarget'), 'aria-label': t('goalTarget') });
  const count = b.goals.length + (g ? 0 : 1);
  const order = h('select', { class: 'input', 'aria-label': t('goalOrder') });
  for (let i = 1; i <= count; i++) order.append(h('option', { value: String(i) }, String(i)));
  order.value = String(g ? b.goals.indexOf(g) + 1 : count);
  const err = h('div', { class: 'err' });
  const sh = sheet([
    h('h3', {}, t(g ? 'editGoal' : 'newGoal')),
    note, target,
    h('label', { class: 'lbl' }, t('goalOrder')), order, err,
    h('button', { class: 'save dep', type: 'button', onclick: save }, t('saveBtn')),
    g ? h('button', { class: 'ghost danger', type: 'button', onclick: () => { if (!confirm(t('delGoalAsk'))) return; b.goals = b.goals.filter((x) => x !== g); persist(); sh.remove(); render(); } }, t('delGoal')) : null,
    h('button', { class: 'ghost', type: 'button', onclick: () => sh.remove() }, t('cancel')),
  ]);
  function save() {
    const n = round2(parseFloat(String(target.value).replace(/,/g, '')));
    const text = note.value.trim();
    if (!text) { err.textContent = t('badName'); return; }
    if (!Number.isFinite(n) || n <= 0 || n > MAX_AMOUNT) { err.textContent = t('badAmount'); return; }
    const goal = g || { id: newId() };
    goal.note = text; goal.target = n;
    b.goals = b.goals.filter((x) => x !== goal);
    b.goals.splice(Math.max(0, Math.min(b.goals.length, parseInt(order.value, 10) - 1)), 0, goal);
    persist(); sh.remove(); render(); toast(t('saved'));
  }
  setTimeout(() => note.focus(), 50);
}
function openReorder() {
  const b = curBook();
  const list = h('div', { class: 'rlist' });
  b.goals.forEach((g) => list.append(h('div', { class: 'rrow', 'data-id': g.id }, h('span', { class: 'handle' }, '≡'), h('span', { class: 'rnote' }, g.note), h('span', { class: 'rt' }, money(g.target)))));
  list.addEventListener('pointerdown', (e) => {
    const hd = e.target.closest && e.target.closest('.handle');
    if (!hd) return;
    e.preventDefault();
    const row = hd.closest('.rrow');
    const y0 = e.clientY;
    row.classList.add('drag');
    try { hd.setPointerCapture(e.pointerId); } catch { /* ok */ }
    const move = (ev) => { row.style.transform = `translateY(${ev.clientY - y0}px)`; };
    const up = (ev) => {
      hd.removeEventListener('pointermove', move); hd.removeEventListener('pointerup', up); hd.removeEventListener('pointercancel', up);
      row.classList.remove('drag'); row.style.transform = '';
      const y = ev.clientY;
      const others = [...list.children].filter((r) => r !== row);
      const before = others.find((r) => { const q = r.getBoundingClientRect(); return y < q.top + q.height / 2; });
      if (before) list.insertBefore(row, before); else list.append(row);
      b.goals = [...list.children].map((r) => b.goals.find((g) => g.id === r.dataset.id));
      persist(); render();
    };
    hd.addEventListener('pointermove', move); hd.addEventListener('pointerup', up); hd.addEventListener('pointercancel', up);
  });
  const sh = sheet([h('h3', {}, t('reorder')), h('div', { class: 'stamp' }, t('dragHint')), list, h('button', { class: 'save dep', type: 'button', onclick: () => sh.remove() }, t('close'))]);
}

function bigBalance(bal) {
  const txt = money(bal);
  const size = txt.length > 20 ? 18 : txt.length > 16 ? 22 : txt.length > 13 ? 26 : txt.length > 10 ? 32 : 38;
  return h('div', { class: 'big' + (bal < 0 ? ' down' : ''), style: `font-size:${size}px` }, txt);
}

/* ---------- notebook ---------- */
function bookView() {
  const all = sorted();
  let bal = 0;
  const rows = all.map((e, i) => { bal = round2(bal + (e.type === 'dep' ? e.amount : -e.amount)); return { e, n: i + 1, bal }; });
  const pages = Math.max(1, Math.ceil(rows.length / ROWS));
  let page = tablePage == null ? pages - 1 : Math.min(tablePage, pages - 1);
  tablePage = page;
  const slice = rows.slice(page * ROWS, page * ROWS + ROWS);
  const hasPrev = page > 0;
  const hasNext = rows.length > (page + 1) * ROWS;

  const trs = [];
  for (let i = 0; i < ROWS; i++) {
    const r = slice[i];
    const no = page * ROWS + i + 1;
    if (!r) { trs.push(h('tr', { class: 'blank' }, h('td', { class: 'no' }, no), h('td'), h('td'), h('td'), h('td'), h('td'), h('td'))); continue; }
    const d = new Date(r.e.ts);
    const dep = r.e.type === 'dep';
    const pencil = h('button', { class: 'pencil', type: 'button', 'aria-label': t('edit'), onclick: () => openEdit(r.e) }, '✎');
    trs.push(h('tr', { class: dep ? 'dep' : 'wd' },
      h('td', { class: 'no' }, no),
      h('td', { class: 'dt' }, h('div', {}, fmtShort(d)), h('div', { class: 'tm' }, fmtTime(d))),
      h('td', { class: 'ty' }, dep ? t('deposit') : t('withdraw')),
      h('td', { class: 'am' }, (dep ? '+' : '−') + num(r.e.amount)),
      h('td', { class: 'ba' + (r.bal < 0 ? ' neg' : '') }, money(r.bal)),
      h('td', { class: 'nt' }, r.e.note || ''),
      h('td', { class: 'ed' }, pencil)));
  }

  return h('div', {},
    h('div', { class: 'addrow' },
      h('button', { class: 'addbtn dep', type: 'button', onclick: () => openAdd('dep') }, '+ ' + t('deposit')),
      h('button', { class: 'addbtn wd', type: 'button', onclick: () => openAdd('wd') }, '− ' + t('withdraw'))),
    h('div', { class: 'pager' },
      hasPrev ? h('button', { class: 'nav', type: 'button', 'aria-label': t('prev'), onclick: () => { tablePage = page - 1; render(); } }, '‹') : h('span', { class: 'nav ph' }),
      h('b', {}, `${t('table')} ${page + 1}`),
      hasNext ? h('button', { class: 'nav', type: 'button', 'aria-label': t('next'), onclick: () => { tablePage = page + 1; render(); } }, '›') : h('span', { class: 'nav ph' })),
    h('div', { class: 'tablewrap' },
      h('table', { class: 'book' },
        h('thead', {}, h('tr', {}, h('th', {}, '#'), h('th', {}, t('date') + ' / ' + t('time')), h('th', {}, t('type')), h('th', {}, t('amt')), h('th', {}, t('bal')), h('th', {}, t('note')), h('th', {}))),
        h('tbody', {}, trs))));
}

/* ---------- add / edit ---------- */
function sheet(content) {
  const back = h('div', { class: 'back', onclick: (e) => { if (e.target === back) back.remove(); } }, h('div', { class: 'sheet' }, content));
  document.body.append(back);
  return back;
}

function openAdd(type) {
  const now = new Date();
  const amt = h('input', { class: 'input num', type: 'text', inputmode: 'decimal', placeholder: '0', autocomplete: 'off', 'aria-label': t('amount') });
  const note = h('input', { class: 'input', type: 'text', maxlength: '120', placeholder: t(type === 'dep' ? 'noteDep' : 'noteWd') });
  const err = h('div', { class: 'err' });
  const sh = sheet([
    h('h3', { class: type === 'dep' ? 'up' : 'down' }, (type === 'dep' ? '+ ' : '− ') + t(type === 'dep' ? 'deposit' : 'withdraw')),
    h('div', { class: 'stamp' }, `${fmtLong(now)} ${fmtTime(now)}`),
    amt, note, err,
    h('button', { class: 'save ' + type, type: 'button', onclick: save }, t(type === 'dep' ? 'saveDep' : 'saveWd')),
    h('button', { class: 'ghost', type: 'button', onclick: () => sh.remove() }, t('cancel')),
  ]);
  function save() {
    const n = round2(parseFloat(String(amt.value).replace(/,/g, '')));
    if (!Number.isFinite(n) || n <= 0 || n > MAX_AMOUNT) { err.textContent = t('badAmount'); return; }
    const at = new Date();
    const entry = { id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), ts: at.getTime(), type, amount: n, note: note.value.trim() };
    db.entries.push(entry);
    persist();
    const idx = sorted().findIndex((x) => x.id === entry.id);
    tablePage = Math.floor(idx / ROWS);
    sh.remove();
    render();
    toast(t('saved'));
  }
  setTimeout(() => amt.focus(), 50);
}

function openEdit(e) {
  let type = e.type;
  const d = new Date(e.ts);
  const amt = h('input', { class: 'input num', type: 'text', inputmode: 'decimal', value: String(e.amount), 'aria-label': t('amount') });
  const note = h('input', { class: 'input', type: 'text', maxlength: '120', value: e.note || '', placeholder: t('note') });
  const err = h('div', { class: 'err' });
  const dep = h('button', { type: 'button', class: 'dep' + (type === 'dep' ? ' on' : '') }, '+ ' + t('deposit'));
  const wd = h('button', { type: 'button', class: 'wd' + (type === 'wd' ? ' on' : '') }, '− ' + t('withdraw'));
  const setType = (v) => { type = v; dep.classList.toggle('on', v === 'dep'); wd.classList.toggle('on', v === 'wd'); };
  dep.addEventListener('click', () => setType('dep'));
  wd.addEventListener('click', () => setType('wd'));
  const sh = sheet([
    h('h3', {}, t('edit')),
    h('div', { class: 'seg' }, dep, wd),
    amt, note,
    h('div', { class: 'stamp' }, `${fmtLong(d)} ${fmtTime(d)}`),
    err,
    h('button', { class: 'save dep', type: 'button', onclick: save }, t('saved').replace('Saved', 'Save').replace('บันทึกแล้ว', 'บันทึก')),
    h('button', { class: 'ghost danger', type: 'button', onclick: () => { if (!confirm(t('delAsk'))) return; db.entries = db.entries.filter((x) => x.id !== e.id); persist(); sh.remove(); render(); toast(t('deleted')); } }, t('del')),
    h('button', { class: 'ghost', type: 'button', onclick: () => sh.remove() }, t('cancel')),
  ]);
  function save() {
    const n = round2(parseFloat(String(amt.value).replace(/,/g, '')));
    if (!Number.isFinite(n) || n <= 0 || n > MAX_AMOUNT) { err.textContent = t('badAmount'); return; }
    Object.assign(e, { type, amount: n, note: note.value.trim() }); // the date and time stay as first saved
    persist(); sh.remove(); render(); toast(t('saved'));
  }
}

/* ---------- charts ---------- */
const COLORS = ['#2dd4bf', '#60a5fa', '#fbbf24', '#a78bfa', '#f472b6', '#34d399', '#94a3b8'];
const REDS = ['#fb7185', '#f97316', '#facc15', '#c084fc', '#f472b6', '#fb923c', '#94a3b8'];

function weekStart(d) { const x = new Date(d.getFullYear(), d.getMonth(), d.getDate()); const wd = (x.getDay() + 6) % 7; x.setDate(x.getDate() - wd); return x; }
function startOfDay(d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }

// Buckets for the chosen period. Days / months before the first ever entry and in the future are left out.
function buckets() {
  const first = db.entries.length ? new Date(Math.min(...db.entries.map((e) => e.ts))) : null;
  const today = new Date();
  const out = [];
  let title = '';
  const add = (label, from, to) => {
    let dep = 0, wd = 0;
    for (const e of db.entries) if (e.ts >= from.getTime() && e.ts < to.getTime()) (e.type === 'dep' ? (dep += e.amount) : (wd += e.amount));
    out.push({ label, dep: round2(dep), wd: round2(wd), from });
  };
  if (mode === 'week') {
    const s = weekStart(anchor);
    const e = new Date(s); e.setDate(e.getDate() + 6);
    title = `${s.getDate()} ${MON[L()][s.getMonth()]} – ${e.getDate()} ${MON[L()][e.getMonth()]} ${e.getFullYear()}`;
    for (let i = 0; i < 7; i++) {
      const a = new Date(s); a.setDate(s.getDate() + i);
      const b = new Date(a); b.setDate(a.getDate() + 1);
      if (first && b <= startOfDay(first)) continue;
      add(DAYFULL[L()][a.getDay()].replace('วัน', ''), a, b);
      if (a > today && !out[out.length - 1].dep && !out[out.length - 1].wd) out.pop();
    }
  } else if (mode === 'month') {
    const y = anchor.getFullYear(), m = anchor.getMonth();
    title = `${MONFULL[L()][m]} ${y}`;
    const n = new Date(y, m + 1, 0).getDate();
    for (let i = 1; i <= n; i++) {
      const a = new Date(y, m, i), b = new Date(y, m, i + 1);
      if (first && b <= startOfDay(first)) continue;
      add(`${i} ${MON[L()][m]}`, a, b);
      if (a > today && !out[out.length - 1].dep && !out[out.length - 1].wd) out.pop();
    }
  } else {
    const y = anchor.getFullYear();
    title = String(y);
    for (let m = 0; m < 12; m++) {
      const a = new Date(y, m, 1), b = new Date(y, m + 1, 1);
      if (first && b <= startOfDay(first)) continue;
      add(MON[L()][m], a, b);
      if (a > today && !out[out.length - 1].dep && !out[out.length - 1].wd) out.pop();
    }
  }
  return { list: out, title };
}

function shift(dir) {
  const a = new Date(anchor);
  if (mode === 'week') a.setDate(a.getDate() + 7 * dir);
  else if (mode === 'month') a.setMonth(a.getMonth() + dir, 1);
  else a.setFullYear(a.getFullYear() + dir, 0, 1);
  anchor = a;
  render();
}
function canShift(dir) {
  const a = new Date(anchor);
  if (mode === 'week') a.setDate(a.getDate() + 7 * dir);
  else if (mode === 'month') a.setMonth(a.getMonth() + dir, 1);
  else a.setFullYear(a.getFullYear() + dir, 0, 1);
  const now = new Date();
  if (dir > 0) {
    if (mode === 'week') return weekStart(a) <= now;
    if (mode === 'month') return a.getFullYear() < now.getFullYear() || (a.getFullYear() === now.getFullYear() && a.getMonth() <= now.getMonth());
    return a.getFullYear() <= now.getFullYear();
  }
  if (!db.entries.length) return false;
  const first = new Date(Math.min(...db.entries.map((e) => e.ts)));
  if (mode === 'week') return new Date(weekStart(a).getTime() + 7 * 864e5) > first;
  if (mode === 'month') return a.getFullYear() > first.getFullYear() || (a.getFullYear() === first.getFullYear() && a.getMonth() >= first.getMonth());
  return a.getFullYear() >= first.getFullYear();
}

/* ---------- line graph (stock style) ---------- */
const G = { range: '7d', v0: 0, v1: 0, sel: null, ptr: new Map(), drag: null };
const RANGE_MS = { '24h': 864e5, '7d': 7 * 864e5, '30d': 30 * 864e5, '90d': 90 * 864e5, '1y': 365 * 864e5 };
const MIN_SPAN = 30 * 60e3;
let gDomain = [0, 0];
function gSetRange(r) {
  G.range = r; G.sel = null;
  const now = Date.now();
  if (r === 'all') {
    const es = db.entries;
    const first = es.length ? Math.min(...es.map((e) => e.ts)) : now - 864e5;
    gDomain = [Math.min(first - 6 * 36e5, now - 864e5), now];
  } else gDomain = [now - RANGE_MS[r], now];
  G.v0 = gDomain[0]; G.v1 = gDomain[1];
}
function gClamp() {
  const [d0, d1] = gDomain; const full = d1 - d0;
  let span = Math.max(Math.min(G.v1 - G.v0, full), Math.min(MIN_SPAN, full));
  let a = G.v0;
  if (a < d0) a = d0;
  if (a + span > d1) a = d1 - span;
  G.v0 = a; G.v1 = a + span;
}
function gZoom(factor, centerT) {
  const span = G.v1 - G.v0;
  const c = centerT == null ? (G.v0 + G.v1) / 2 : centerT;
  const ratio = (c - G.v0) / span;
  const ns = Math.max(Math.min(span * factor, gDomain[1] - gDomain[0]), Math.min(MIN_SPAN, gDomain[1] - gDomain[0]));
  G.v0 = c - ns * ratio; G.v1 = G.v0 + ns; gClamp();
}
function balanceSeries() {
  const es = sorted(); // oldest first
  let b = 0; const pts = [];
  for (const e of es) { const before = b; b = round2(b + (e.type === 'dep' ? e.amount : -e.amount)); pts.push({ e, ts: e.ts, before, after: b }); }
  return pts;
}
const pad2 = (n) => String(n).padStart(2, '0');
const hhmm = (ts) => { const d = new Date(ts); return pad2(d.getHours()) + ':' + pad2(d.getMinutes()); };
const dayLab = (ts) => { const d = new Date(ts); return d.getDate() + ' ' + MON[L()][d.getMonth()]; };
const midnight = (ts) => { const d = new Date(ts); d.setHours(0, 0, 0, 0); return d.getTime(); };

// Ruler like a clock: tall tick at the main unit (label), medium at the middle unit, short at the smallest.
function buildTicks(t0, t1, w) {
  const span = t1 - t0, ticks = [];
  const pxPerMin = w / (span / 6e4);
  const dayPx = pxPerMin * 1440;
  if (pxPerMin * 60 >= 14) { // intraday: minutes / hours
    const ladder = [1, 2, 5, 10, 15, 30, 60, 120, 180, 360, 720, 1440];
    const minor = ladder.find((m) => m * pxPerMin >= 6) || 1440;
    const label = ladder.find((m) => m >= minor && m * pxPerMin >= 52) || 1440;
    const mids = ladder.filter((m) => m > minor && m < label && label % m === 0);
    const mid = mids.length ? Math.max(...mids) : 0;
    let t = midnight(t0);
    const step = minor * 6e4;
    t += Math.floor((t0 - t) / step) * step;
    for (; t <= t1 + step; t += step) {
      if (t < t0 - step) continue;
      const mins = Math.round((t - midnight(t)) / 6e4);
      let level = 1, text = null;
      if (mins === 0) { level = 3; text = dayLab(t); }
      else if (mins % label === 0) { level = 3; text = hhmm(t); }
      else if (mid && mins % mid === 0) level = 2;
      ticks.push({ t, level, text, day: mins === 0 });
    }
  } else if (14 * dayPx >= 34) { // daily
    const days = [1, 2, 3, 7, 14].find((n) => n * dayPx >= 34) || 14;
    const minorDay = dayPx >= 6;
    let d = new Date(t0); d.setHours(0, 0, 0, 0);
    for (; d.getTime() <= t1 + 864e5; d.setDate(d.getDate() + 1)) {
      const t = d.getTime(); if (t < t0 - 864e5) continue;
      const dom = d.getDate();
      const first = dom === 1;
      const lab = first || (days === 7 ? d.getDay() === 1 : (dom - 1) % days === 0);
      if (!lab && !minorDay) continue;
      ticks.push({ t, level: lab ? 3 : 1, text: lab ? (first ? MON[L()][d.getMonth()] : String(dom)) : null, day: first });
    }
  } else { // monthly
    const every = [1, 2, 3, 6, 12].find((n) => n * 30 * dayPx >= 40) || 12;
    const d = new Date(t0); d.setDate(1); d.setHours(0, 0, 0, 0);
    for (; d.getTime() <= t1 + 32 * 864e5; d.setMonth(d.getMonth() + 1)) {
      const t = d.getTime(); if (t < t0 - 32 * 864e5) continue;
      const m = d.getMonth(), lab = m % every === 0;
      ticks.push({ t, level: lab ? 3 : 1, text: lab ? (m === 0 ? String(d.getFullYear()) : MON[L()][m]) : null, day: m === 0 });
    }
  }
  return ticks;
}
const niceStep = (range, n) => { const raw = range / n, p = Math.pow(10, Math.floor(Math.log10(raw))), f = raw / p; return (f < 1.5 ? 1 : f < 3 ? 2 : f < 7 ? 5 : 10) * p; };
const compact = (n) => { const a = Math.abs(n); return (n < 0 ? '−' : '') + (a >= 1e9 ? round2(a / 1e9) + 'B' : a >= 1e6 ? round2(a / 1e6) + 'M' : a >= 1e4 ? round2(a / 1e3) + 'k' : String(round2(a))); };

function graphView() {
  if (!G.v1) gSetRange(G.range);
  const wrap = h('div', { class: 'graph' });
  const draw = () => {
    const pts = balanceSeries();
    wrap.replaceChildren();
    const rangeBar = h('div', { class: 'ranges' }, ['24h', '7d', '30d', '90d', '1y', 'all'].map((r) => h('button', { type: 'button', class: G.range === r ? 'on' : '', onclick: () => { gSetRange(r); draw(); } }, t('r' + r))));
    wrap.append(rangeBar);
    if (!pts.length) { wrap.append(h('div', { class: 'empty' }, t('gNone'))); return; }
    // visible numbers
    const t0 = G.v0, t1 = G.v1;
    const balAt = (ts) => { let b = 0; for (const p of pts) { if (p.ts <= ts) b = p.after; else break; } return b; };
    const bStart = balAt(t0), bEnd = balAt(t1);
    const vis = pts.filter((p) => p.ts >= t0 && p.ts <= t1);
    let dep = 0, wd = 0; for (const p of vis) { if (p.e.type === 'dep') dep += p.e.amount; else wd += p.e.amount; }
    dep = round2(dep); wd = round2(wd);
    const selP = G.sel != null ? pts.find((p) => p.e.id === G.sel) : null;
    const shown = selP ? selP.after : bEnd;
    const chg = round2(bEnd - bStart);
    const pct = bStart > 0 ? ` (${chg >= 0 ? '+' : '−'}${Math.abs(round2((chg / bStart) * 100))}%)` : '';
    wrap.append(h('div', { class: 'ghead2' },
      h('div', {}, h('small', {}, selP ? `${fmtShort(new Date(selP.ts))} ${hhmm(selP.ts)}` : t('gBal')), h('b', { class: 'gbal' }, money(shown))),
      h('div', { class: 'gchg ' + (chg >= 0 ? 'up' : 'down') }, h('small', {}, t('gChange')), h('b', {}, (chg >= 0 ? '▲ +' : '▼ ') + money(Math.abs(chg)) + pct))));
    if (selP) wrap.append(h('div', { class: 'gsel ' + (selP.e.type === 'dep' ? 'up' : 'down') }, `${selP.e.type === 'dep' ? '+' : '−'}${money(selP.e.amount)}  ${selP.e.note || ''}`));

    // geometry
    const W = 360, H = 270, ml = 6, mr = 46, mt = 10, plotH = 190, axisY = mt + plotH;
    const pw = W - ml - mr;
    const X = (ts) => ml + ((ts - t0) / (t1 - t0)) * pw;
    const vals = [bStart, bEnd, ...vis.map((p) => p.after), ...vis.map((p) => p.before)];
    let lo = Math.min(...vals), hi = Math.max(...vals);
    if (hi === lo) { const m = Math.max(Math.abs(hi) * 0.1, 1); hi += m; lo -= m; }
    const step = niceStep(hi - lo, 4);
    const yMin = Math.floor((lo - (hi - lo) * 0.08) / step) * step, yMax = Math.ceil((hi + (hi - lo) * 0.08) / step) * step;
    const Y = (v) => mt + plotH - ((v - yMin) / (yMax - yMin)) * plotH;
    const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, class: 'gsvg', role: 'img', 'aria-label': t('graph') });
    const defs = svgEl('defs', {}); const grad = svgEl('linearGradient', { id: 'gfillg', x1: 0, y1: 0, x2: 0, y2: 1 });
    grad.append(svgEl('stop', { offset: '0%', 'stop-color': '#2dd4bf', 'stop-opacity': 0.35 }), svgEl('stop', { offset: '100%', 'stop-color': '#2dd4bf', 'stop-opacity': 0 }));
    defs.append(grad, svgEl('clipPath', { id: 'gclip' }, svgEl('rect', { x: ml, y: 0, width: pw, height: H })));
    svg.append(defs);
    for (let v = yMin; v <= yMax + step / 2; v += step) {
      svg.append(svgEl('line', { x1: ml, x2: W - mr, y1: Y(v), y2: Y(v), stroke: '#ffffff14' }));
      svg.append(svgEl('text', { x: W - mr + 4, y: Y(v) + 3, fill: '#8ea3b5', 'font-size': 9 }, compact(round2(v))));
    }
    // step line
    let d = `M ${X(t0)} ${Y(bStart)}`; let last = bStart;
    for (const p of vis) { d += ` L ${X(p.ts)} ${Y(p.before)} L ${X(p.ts)} ${Y(p.after)}`; last = p.after; }
    d += ` L ${X(t1)} ${Y(last)}`;
    const g = svgEl('g', { 'clip-path': 'url(#gclip)' });
    g.append(svgEl('path', { d: d + ` L ${X(t1)} ${Y(Math.max(yMin, Math.min(0, yMax)))} L ${X(t0)} ${Y(Math.max(yMin, Math.min(0, yMax)))} Z`, fill: 'url(#gfillg)' }));
    g.append(svgEl('path', { d, fill: 'none', stroke: '#2dd4bf', 'stroke-width': 2, 'stroke-linejoin': 'round' }));
    const rr = vis.length > 80 ? 2 : 4;
    for (const p of vis) g.append(svgEl('circle', { cx: X(p.ts), cy: Y(p.after), r: p.e.id === G.sel ? rr + 2 : rr, fill: p.e.type === 'dep' ? '#2dd4bf' : '#fb7185', stroke: '#0f1720', 'stroke-width': 1.5 }));
    if (selP && selP.ts >= t0 && selP.ts <= t1) g.append(svgEl('line', { x1: X(selP.ts), x2: X(selP.ts), y1: mt, y2: axisY, stroke: '#eaf2f8', 'stroke-dasharray': '3 3', opacity: 0.6 }));
    svg.append(g);
    // ruler
    svg.append(svgEl('line', { x1: ml, x2: W - mr, y1: axisY + 0.5, y2: axisY + 0.5, stroke: '#ffffff30' }));
    const TH = { 1: 5, 2: 9, 3: 14 };
    for (const k of buildTicks(t0, t1, pw)) {
      const x = X(k.t); if (x < ml - 0.5 || x > W - mr + 0.5) continue;
      svg.append(svgEl('line', { x1: x, x2: x, y1: axisY, y2: axisY + TH[k.level], stroke: k.day ? '#2dd4bf' : k.level === 3 ? '#cfe0ee' : '#8ea3b5', 'stroke-width': k.level === 3 ? 1.4 : 1 }));
      if (k.text) svg.append(svgEl('text', { x, y: axisY + 27, 'text-anchor': 'middle', fill: k.day ? '#2dd4bf' : '#c9d8e4', 'font-size': 10, 'font-weight': k.day ? 700 : 400 }, k.text));
    }
    // span caption
    const spanMin = (t1 - t0) / 6e4;
    const cap = spanMin < 120 ? `${Math.round(spanMin)} min` : spanMin < 2880 ? `${round2(spanMin / 60)} h` : `${round2(spanMin / 1440)} d`;
    svg.append(svgEl('text', { x: ml + 2, y: H - 4, fill: '#8ea3b5', 'font-size': 9 }, `${dayLab(t0)} ${hhmm(t0)} – ${dayLab(t1)} ${hhmm(t1)} · ${cap}`));
    // touch layer
    const box = h('div', { class: 'gbox' }); box.append(svg);
    const rect = () => svg.getBoundingClientRect();
    const toT = (clientX) => { const r = rect(); const x = ((clientX - r.left) / r.width) * W; return t0 + ((x - ml) / pw) * (t1 - t0); };
    const dist = () => { const a = [...G.ptr.values()]; return Math.hypot(a[0].x - a[1].x, a[0].y - a[1].y); };
    box.addEventListener('pointerdown', (e) => {
      box.setPointerCapture(e.pointerId); G.ptr.set(e.pointerId, { x: e.clientX, y: e.clientY });
      G.drag = { moved: false, sx: e.clientX, v0: G.v0, v1: G.v1, pd: G.ptr.size === 2 ? dist() : 0 };
    });
    box.addEventListener('pointermove', (e) => {
      if (!G.ptr.has(e.pointerId) || !G.drag) return;
      G.ptr.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (G.ptr.size === 2) {
        const a = [...G.ptr.values()]; const nd = dist();
        if (G.drag.pd) { const c = toT((a[0].x + a[1].x) / 2); G.v0 = G.drag.v0; G.v1 = G.drag.v1; gZoom(G.drag.pd / Math.max(nd, 1), c); G.drag.moved = true; draw(); }
        return;
      }
      const r = rect(); const dx = e.clientX - G.drag.sx;
      if (Math.abs(dx) > 5) G.drag.moved = true;
      if (G.drag.moved) { const dt = -(dx / r.width) * (W / pw) * (G.drag.v1 - G.drag.v0); G.v0 = G.drag.v0 + dt; G.v1 = G.drag.v1 + dt; gClamp(); draw(); }
    });
    const end = (e) => {
      const was = G.drag; G.ptr.delete(e.pointerId);
      if (G.ptr.size === 1 && was) { const p = [...G.ptr.values()][0]; G.drag = { moved: true, sx: p.x, v0: G.v0, v1: G.v1, pd: 0 }; return; }
      if (G.ptr.size) return;
      G.drag = null;
      if (was && !was.moved && e.type === 'pointerup') { // tap: pick the nearest entry
        const r = rect(); const px = ((e.clientX - r.left) / r.width) * W;
        let best = null, bd = 28;
        for (const p of vis) { const dd = Math.abs(X(p.ts) - px); if (dd < bd) { bd = dd; best = p; } }
        G.sel = best ? best.e.id : null; draw();
      }
    };
    box.addEventListener('pointerup', end); box.addEventListener('pointercancel', end);
    box.addEventListener('wheel', (e) => { e.preventDefault(); gZoom(e.deltaY > 0 ? 1.25 : 0.8, toT(e.clientX)); draw(); }, { passive: false });
    wrap.append(box);
    wrap.append(h('div', { class: 'gzoom' },
      h('button', { type: 'button', class: 'chip', 'aria-label': 'Zoom out', onclick: () => { gZoom(1.6); draw(); } }, '−'),
      h('button', { type: 'button', class: 'chip', 'aria-label': 'Zoom in', onclick: () => { gZoom(1 / 1.6); draw(); } }, '+'),
      h('button', { type: 'button', class: 'chip', onclick: () => { gSetRange(G.range); draw(); } }, '⟲')));
    wrap.append(h('div', { class: 'gstats' },
      h('div', { class: 'gs up' }, h('small', {}, t('gDep')), h('b', {}, '+' + money(dep))),
      h('div', { class: 'gs down' }, h('small', {}, t('gWd')), h('b', {}, '−' + money(wd)))));
    wrap.append(h('div', { class: 'stamp' }, t('gHint')));
  };
  draw();
  return wrap;
}

function chartsView() {
  const { list, title } = buckets();
  const seg = h('div', { class: 'seg3' }, ['week', 'month', 'year'].map((m) => h('button', { type: 'button', class: mode === m ? 'on' : '', onclick: () => { mode = m; anchor = new Date(); render(); } }, t(m))));
  const nav = h('div', { class: 'pager' },
    canShift(-1) ? h('button', { class: 'nav', type: 'button', 'aria-label': t('prev'), onclick: () => shift(-1) }, '‹') : h('span', { class: 'nav ph' }),
    h('b', {}, title),
    canShift(1) ? h('button', { class: 'nav', type: 'button', 'aria-label': t('next'), onclick: () => shift(1) }, '›') : h('span', { class: 'nav ph' }));
  return h('div', {}, seg, nav, section('dep', list), section('wd', list));
}

function section(kind, list) {
  const key = kind === 'dep' ? 'dep' : 'wd';
  const cols = kind === 'dep' ? COLORS : REDS;
  const data = list.map((b) => ({ label: b.label, v: b[key] }));
  const sum = round2(data.reduce((a, b) => a + b.v, 0));
  const box = h('div', { class: 'card ' + kind }, h('h2', { class: kind === 'dep' ? 'up' : 'down' }, t(kind === 'dep' ? 'deposits' : 'withdrawals')));
  if (!sum) { box.append(h('div', { class: 'empty-msg' }, t('noData'))); return box; }
  const top = data.reduce((a, b) => (b.v > a.v ? b : a), data[0]);
  box.append(h('div', { class: 'topline' }, `${t(kind === 'dep' ? 'topDep' : 'topWd')}: `, h('b', { class: kind === 'dep' ? 'up' : 'down' }, `${top.label} · ${money(top.v)}`)));
  box.append(h('div', { class: 'scrollx' }, barChart(data, kind === 'dep' ? '#2dd4bf' : '#fb7185', top)));
  box.append(pieChart(data, cols, sum));
  return box;
}

function barChart(data, color, top) {
  const W = Math.max(320, data.length * 34 + 20), H = 190, pb = 34, pt = 22, pl = 8;
  const max = Math.max(...data.map((d) => d.v), 1);
  const bw = Math.min(40, (W - pl * 2) / data.length - 6);
  const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, width: W, height: H, role: 'img' });
  data.forEach((d, i) => {
    const x = pl + i * ((W - pl * 2) / data.length) + ((W - pl * 2) / data.length - bw) / 2;
    const bh = d.v ? Math.max(3, ((H - pb - pt) * d.v) / max) : 0;
    const y = H - pb - bh;
    svg.append(svgEl('rect', { x, y, width: bw, height: bh, rx: 4, fill: color, opacity: d === top ? 1 : 0.55 }));
    if (d.v) svg.append(svgEl('text', { x: x + bw / 2, y: y - 5, 'text-anchor': 'middle', fill: '#eaf2f8', 'font-size': 10 }, shortNum(d.v)));
    let lab = d.label.length > 9 && data.length > 7 ? d.label.split(' ')[0] : d.label;
    if (mode === 'week' && L() === 'en' && data.length > 4) lab = lab.slice(0, 3);
    svg.append(svgEl('text', { x: x + bw / 2, y: H - pb + 15, 'text-anchor': 'middle', fill: '#8ea3b5', 'font-size': 10 }, lab.length > 10 ? lab.slice(0, 9) + '…' : lab));
  });
  return svg;
}
const shortNum = (n) => (n >= 1e6 ? round2(n / 1e6) + 'M' : n >= 1e4 ? round2(n / 1e3) + 'k' : String(round2(n)));

function pieChart(data, cols, sum) {
  let items = data.filter((d) => d.v > 0).sort((a, b) => b.v - a.v);
  if (items.length > 7) {
    const rest = round2(items.slice(6).reduce((a, b) => a + b.v, 0));
    items = [...items.slice(0, 6), { label: t('other'), v: rest }];
  }
  const R = 70, C = 80;
  const svg = svgEl('svg', { viewBox: '0 0 160 160', width: 160, height: 160, role: 'img' });
  let a0 = -Math.PI / 2;
  if (items.length === 1) svg.append(svgEl('circle', { cx: C, cy: C, r: R, fill: cols[0] }));
  else items.forEach((it, i) => {
    const a1 = a0 + (it.v / sum) * Math.PI * 2;
    const large = a1 - a0 > Math.PI ? 1 : 0;
    const p = `M ${C} ${C} L ${C + R * Math.cos(a0)} ${C + R * Math.sin(a0)} A ${R} ${R} 0 ${large} 1 ${C + R * Math.cos(a1)} ${C + R * Math.sin(a1)} Z`;
    svg.append(svgEl('path', { d: p, fill: cols[i % cols.length], stroke: '#17212c', 'stroke-width': 1 }));
    a0 = a1;
  });
  const legend = h('div', { class: 'legend' }, items.map((it, i) => h('div', { class: 'lg' }, h('span', { class: 'dot', style: `background:${cols[i % cols.length]}` }), h('span', { class: 'lgl' }, it.label), h('span', { class: 'lgv' }, `${money(it.v)} · ${Math.round((it.v / sum) * 100)}%`))));
  return h('div', { class: 'pie' }, svg, legend);
}

/* ---------- menu / backup ---------- */
function openMenu() {
  const sh = sheet(h('div', { class: 'menu' }, [
    h('div', { class: 'langrow' }, h('b', {}, t('language')),
      h('div', { class: 'seg' }, ['en', 'th'].map((c) => h('button', { type: 'button', class: 'lang' + (db.lang === c ? ' on' : ''), onclick: () => { db.lang = c; persist(); sh.remove(); render(); openMenu(); } }, c === 'en' ? 'English' : 'ไทย')))),
    h('button', { type: 'button', onclick: () => { db.sound = db.sound === false; persist(); sh.remove(); toast(db.sound ? 'Sound on' : 'Sound off'); } }, t('sound') + (db.sound === false ? ' (off)' : ' (on)')),
    h('button', { type: 'button', onclick: () => { const v = prompt(t('currencyAsk'), db.cur); if (v != null && v.trim()) { db.cur = v.trim().slice(0, 4); persist(); sh.remove(); render(); } } }, t('currency')),
    h('button', { type: 'button', onclick: () => { sh.remove(); changePin(); } }, '🔒 ' + t('pinChange')),
    curBook() ? h('button', { type: 'button', onclick: () => download('daily-jar.csv', 'text/csv', csv()) }, t('csv')) : null,
    h('button', { type: 'button', onclick: () => download('daily-jar-backup.json', 'application/json', JSON.stringify({ ...db, pin: null })) }, t('backup')),
    h('button', { type: 'button', onclick: () => restore(sh) }, t('restore')),
    h('button', { type: 'button', class: 'danger', onclick: () => { if (!confirm(t(curBook() ? 'resetBookAsk' : 'resetAllAsk'))) return; if (curBook()) { db.entries = []; curBook().goals = []; } else { db.books = []; } tablePage = null; persist(); sh.remove(); render(); } }, t('reset')),
    h('button', { type: 'button', onclick: () => sh.remove() }, t('close')),
    h('div', { class: 'stamp' }, t('version') + ' 1.1'),
  ]));
}
function csv() {
  const q = (s) => '"' + String(s).replace(/"/g, '""') + '"';
  const rows = [['date', 'time', 'type', 'amount', 'note']];
  sorted().forEach((e) => { const d = new Date(e.ts); rows.push([dayKey(d), fmtTime(d), e.type === 'dep' ? 'deposit' : 'withdraw', e.amount, e.note || '']); });
  return '﻿' + rows.map((r) => r.map(q).join(',')).join('\n');
}
function download(name, type, text) {
  const a = h('a', { href: URL.createObjectURL(new Blob([text], { type })), download: name });
  document.body.append(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
}
function restore(sh) {
  const inp = h('input', { type: 'file', accept: 'application/json,.json', style: 'position:fixed;left:-9999px' });
  inp.addEventListener('change', async () => {
    try {
      const d = JSON.parse(await inp.files[0].text());
      if (!d || !(Array.isArray(d.books) || Array.isArray(d.entries))) throw new Error('bad');
      const keepPin = db.pin;
      db = normalize(d); db.pin = keepPin;
      tablePage = null; persist(); sh.remove(); render(); toast(t('restored'));
    } catch { toast(t('badFile')); }
    inp.remove();
  });
  document.body.append(inp); inp.click();
}


/* ---------- PIN lock ---------- */
async function hashPin(pin, salt) {
  const data = salt + ':' + pin;
  try {
    if (window.crypto && crypto.subtle) {
      const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(data));
      return [...new Uint8Array(buf)].map((x) => x.toString(16).padStart(2, '0')).join('');
    }
  } catch { /* fall back below */ }
  let a = 5381, b = 52711;
  for (let r = 0; r < 5000; r++) for (let i = 0; i < data.length; i++) { a = ((a * 33) ^ data.charCodeAt(i)) >>> 0; b = ((b * 31) + a) >>> 0; }
  return 'f' + a.toString(16) + b.toString(16);
}
async function makePin(pin) { const salt = newId() + newId(); return { salt, hash: await hashPin(pin, salt) }; }
let fails = 0, blockedUntil = 0;
async function verifyPin(p) {
  if (Date.now() < blockedUntil) return t('pinWait');
  if ((await hashPin(p, db.pin.salt)) === db.pin.hash) { fails = 0; return null; }
  if (++fails >= 5) { fails = 0; blockedUntil = Date.now() + 30000; return t('pinWait'); }
  return t('pinWrong');
}
// Full-screen keypad. Resolves with the 4 digits, or null if cancelled. `check(pin)` returns an error text, or null if fine.
function askPin({ title, sub, cancelable, check, forgot }) {
  return new Promise((resolve) => {
    let val = '', busy = false;
    const dots = h('div', { class: 'dots' }, [0, 1, 2, 3].map(() => h('i')));
    const msg = h('div', { class: 'pinmsg' }, sub || '');
    const paint = () => [...dots.children].forEach((d, i) => d.classList.toggle('on', i < val.length));
    const done = (v) => { ov.remove(); resolve(v); };
    async function submit() {
      busy = true;
      const bad = check ? await check(val) : null;
      busy = false;
      if (bad) { msg.textContent = bad; msg.classList.add('bad'); dots.classList.remove('shake'); void dots.offsetWidth; dots.classList.add('shake'); val = ''; paint(); return; }
      done(val);
    }
    const key = (k) => h('button', { class: 'k', type: 'button', onclick: () => { if (busy || val.length >= 4) return; val += k; msg.classList.remove('bad'); paint(); if (val.length === 4) setTimeout(submit, 120); } }, k);
    const ov = h('div', { class: 'lock' }, h('div', { class: 'lockin' },
      h('div', { class: 'lockicon' }, '🔒'), h('h2', {}, title), msg, dots,
      h('div', { class: 'pad' }, ...'123456789'.split('').map(key),
        cancelable ? h('button', { class: 'k sm', type: 'button', onclick: () => done(null) }, '←') : h('span'),
        key('0'),
        h('button', { class: 'k sm', type: 'button', 'aria-label': 'Delete', onclick: () => { if (busy) return; val = val.slice(0, -1); paint(); } }, '⌫')),
      forgot ? h('button', { class: 'forgot', type: 'button', onclick: () => { if (!confirm(t('pinForgotAsk'))) return; try { localStorage.removeItem(KEY); } catch { /* ok */ } db = load(); done('__reset__'); } }, t('pinForgot')) : null));
    document.body.append(ov);
  });
}
async function setupPin() {
  for (;;) {
    const a = await askPin({ title: t('pinCreate'), sub: t('pinCreateSub') });
    const b = await askPin({ title: t('pinConfirm'), cancelable: true, check: async (p) => (p === a ? null : t('pinMismatch')) });
    if (b !== null) { db.pin = await makePin(a); persist(); return; }
  }
}
async function unlockFlow() {
  const r = await askPin({ title: t('pinEnter'), check: verifyPin, forgot: true });
  if (r === '__reset__') await setupPin();
}
async function changePin() {
  const cur = await askPin({ title: t('pinCurrent'), cancelable: true, check: verifyPin });
  if (cur === null) return;
  for (;;) {
    const a = await askPin({ title: t('pinNew'), cancelable: true });
    if (a === null) return;
    const b = await askPin({ title: t('pinConfirm'), cancelable: true, check: async (p) => (p === a ? null : t('pinMismatch')) });
    if (b !== null) { db.pin = await makePin(a); persist(); toast(t('pinChanged')); return; }
  }
}
let hiddenAt = 0, relocking = false;
document.addEventListener('visibilitychange', async () => {
  if (document.hidden) { if (unlocked && db.pin) { hiddenAt = Date.now(); document.body.classList.add('veil'); } return; }
  if (!hiddenAt || relocking) return;
  const away = Date.now() - hiddenAt; hiddenAt = 0;
  if (away < 5000) { document.body.classList.remove('veil'); return; }
  relocking = true; unlocked = false;
  await unlockFlow();
  unlocked = true; document.body.classList.remove('veil'); relocking = false; render();
});
document.body.classList.add('veil');
(async function boot() {
  if (!db.pin) await setupPin(); else await unlockFlow();
  unlocked = true;
  document.body.classList.remove('veil');
  render();
})();

// Ads: native Android app only (AdMob banner at the bottom). Settings live in ads-config.json.
(async function initAds() {
  try {
    const cap = window.Capacitor;
    if (!cap || !cap.isNativePlatform || !cap.isNativePlatform()) return;
    const cfg = await (await fetch('ads-config.json')).json();
    const A = cap.Plugins && cap.Plugins.AdMob;
    if (!cfg.enabled || !A) return;
    try {
      const info = await A.requestConsentInfo();
      if (info && info.isConsentFormAvailable && info.status === 'REQUIRED') await A.showConsentForm();
    } catch {}
    await A.initialize({ initializeForTesting: !!cfg.testing });
    const setH = (px) => document.documentElement.style.setProperty('--adh', Math.ceil(px) + 'px');
    A.addListener('bannerAdSizeChanged', (info) => { if (info && info.height) setH(info.height + 4); });
    A.addListener('bannerAdLoaded', () => document.documentElement.classList.add('ads'));
    A.addListener('bannerAdFailedToLoad', () => document.documentElement.classList.remove('ads'));
    await A.showBanner({ adId: cfg.banner, adSize: 'BANNER', position: 'BOTTOM_CENTER', margin: 0, isTesting: !!cfg.testing });
  } catch {}
})();
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(() => {});
