```js-engine
/*****************************************************************************************
 * TRADE MENU (Single Note) — Phase 0–4 in one build
 * - Player inventory source of truth: localStorage "fallout_gear_table"
 * - Caps source of truth: localStorage "fallout_Caps"
 * - Vendor state + trade session persisted in localStorage (namespaced)
 *
 * Locked mechanics:
 * - Staging/pending model, destination-only marker ⬛, source hides at 0 projected qty
 * - Normal click: if available qty ≤ 5 move 1; if > 5 prompt qty
 * - Shift+Click: always prompt qty
 * - Undo by clicking ⬛ destination row (≤5 undo 1; >5 prompt; Shift+Click prompt)
 * - Confirm disabled if effective player caps < buy total
 * - Vendor shortfall allowed: vendor payout capped, vendor caps -> 0, remainder forfeited
 ******************************************************************************************/

/* ----------------------------- Constants / Keys ----------------------------- */

const CAPS_KEY = "fallout_Caps";
const GEAR_KEY = "fallout_gear_table"; // getStorageKey("fallout_gear_table") with no character suffix

const NS = "trade_menu";
const keyVendorState = (vendorId) => `${NS}:vendor_state:${vendorId}`;
const keySession = (vendorId) => `${NS}:session:${vendorId}:active`;

/* ----------------------------- Small Utilities ----------------------------- */

const clampInt = (n, min, max) => Math.max(min, Math.min(max, n));
const nowMs = () => Date.now();

const parseCapsInt = (v, fallback = 0) => {
  if (v === null || v === undefined) return fallback;
  const s = String(v).trim();
  if (!s) return fallback;
  const n = Number.parseInt(s, 10);
  return Number.isFinite(n) ? n : fallback;
};

const normalizeNameKey = (name) =>
  String(name ?? "")
    .trim()
    .replace(/\s+/g, " ")
    .replace(/^\[\[/, "")
    .replace(/\]\]$/, "")
    .toLowerCase();

const isWikiLink = (s) => /^\s*\[\[.+\]\]\s*$/.test(String(s ?? ""));

const makeItemId = (name) => {
  const raw = String(name ?? "").trim();
  const core = raw.replace(/^\[\[/, "").replace(/\]\]$/, "").trim();
  const prefix = isWikiLink(raw) ? "vault:" : "manual:";
  return prefix + core.toLowerCase();
};

const deepClone = (x) => JSON.parse(JSON.stringify(x));

const safeJsonParse = (s, fallback) => {
  try {
    return JSON.parse(s);
  } catch {
    return fallback;
  }
};

const setClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

/* ----------------------------- Modal Helpers ------------------------------ */

function makeOverlay() {
  const overlay = document.createElement("div");
  overlay.style.cssText = `
    position:fixed; inset:0; z-index:99999;
    background:rgba(20,28,38,0.82);
    display:flex; align-items:center; justify-content:center;
  `;
  return overlay;
}

function makeModalBox() {
  const box = document.createElement("div");
  box.style.cssText = `
    background:#325886;
    border:3px solid #ffc200;
    border-radius:14px;
    box-shadow:0 10px 46px rgba(0,0,0,0.45);
    padding:18px 18px;
    min-width:340px;
    max-width:95vw;
    color:#efdd6f;
    font-family:inherit;
  `;
  return box;
}

function makeBtn(label, styles = {}) {
  const b = document.createElement("button");
  b.textContent = label;
  b.style.cssText = `
    font-weight:bold;
    border-radius:6px;
    padding:6px 12px;
    cursor:pointer;
    border:1px solid rgba(0,0,0,0.25);
  `;
  Object.assign(b.style, styles);
  return b;
}

function showNotice(text) {
  // Minimal, non-blocking toast-ish
  const n = document.createElement("div");
  n.textContent = text;
  n.style.cssText = `
    position:fixed; right:14px; bottom:14px; z-index:999999;
    background:#2e4663; color:#ffc200; border:1px solid #ffc200;
    padding:10px 12px; border-radius:10px; box-shadow:0 8px 28px rgba(0,0,0,0.35);
    max-width:360px;
  `;
  document.body.appendChild(n);
  setTimeout(() => n.remove(), 2200);
}

async function promptQty({ title, min, max, initial = 1 }) {
  return await new Promise((resolve) => {
    const overlay = makeOverlay();
    const box = makeModalBox();

    const h = document.createElement("div");
    h.textContent = title;
    h.style.cssText = `font-weight:bold; color:#ffc200; margin-bottom:10px; text-align:center;`;

    const row = document.createElement("div");
    row.style.cssText = `display:flex; gap:10px; align-items:center; justify-content:center; margin:12px 0;`;

    const input = document.createElement("input");
    input.type = "number";
    input.min = String(min);
    input.max = String(max);
    input.value = String(clampInt(parseCapsInt(initial, 1), min, max));
    input.style.cssText = `
      width:120px; text-align:center;
      background:#fde4c9; color:black;
      border:1px solid rgba(0,0,0,0.25);
      border-radius:8px; padding:8px 10px;
    `;

    const hint = document.createElement("div");
    hint.textContent = `Min ${min} / Max ${max}`;
    hint.style.cssText = `opacity:0.85; font-size:12px; text-align:center; margin-top:6px;`;

    const btnRow = document.createElement("div");
    btnRow.style.cssText = `display:flex; gap:10px; justify-content:center; margin-top:14px;`;

    const ok = makeBtn("Confirm", { background: "#ffc200", color: "#2e4663" });
    const cancel = makeBtn("Cancel", { background: "#2e4663", color: "#ffc200" });

    const close = (val) => {
      overlay.remove();
      resolve(val);
    };

    ok.onclick = () => {
      const n = clampInt(parseCapsInt(input.value, min), min, max);
      close(n);
    };
    cancel.onclick = () => close(null);

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") ok.click();
      if (e.key === "Escape") cancel.click();
    });

    box.appendChild(h);
    row.appendChild(input);
    box.appendChild(row);
    box.appendChild(hint);
    btnRow.append(ok, cancel);
    box.appendChild(btnRow);

    overlay.appendChild(box);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) cancel.click();
    });

    document.body.appendChild(overlay);
    setTimeout(() => input.focus(), 0);
  });
}

async function promptJsonPaste({ title, placeholder }) {
  return await new Promise((resolve) => {
    const overlay = makeOverlay();
    const box = makeModalBox();

    const h = document.createElement("div");
    h.textContent = title;
    h.style.cssText = `font-weight:bold; color:#ffc200; margin-bottom:10px; text-align:center;`;

    const area = document.createElement("textarea");
    area.placeholder = placeholder;
    area.style.cssText = `
      width: min(780px, 90vw);
      height: 260px;
      background:#fde4c9; color:black;
      border:1px solid rgba(0,0,0,0.25);
      border-radius:10px; padding:10px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace;
      font-size: 12px;
      resize: vertical;
    `;

    const btnRow = document.createElement("div");
    btnRow.style.cssText = `display:flex; gap:10px; justify-content:center; margin-top:14px;`;

    const ok = makeBtn("Import", { background: "#ffc200", color: "#2e4663" });
    const cancel = makeBtn("Cancel", { background: "#2e4663", color: "#ffc200" });

    const close = (val) => {
      overlay.remove();
      resolve(val);
    };

    ok.onclick = () => close(area.value);
    cancel.onclick = () => close(null);

    area.addEventListener("keydown", (e) => {
      if (e.key === "Escape") cancel.click();
    });

    box.append(h, area, btnRow);
    btnRow.append(ok, cancel);

    overlay.appendChild(box);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) cancel.click();
    });

    document.body.appendChild(overlay);
    setTimeout(() => area.focus(), 0);
  });
}

async function promptVendorItem() {
  return await new Promise((resolve) => {
    const overlay = makeOverlay();
    const box = makeModalBox();

    const h = document.createElement("div");
    h.textContent = "Add Vendor Item";
    h.style.cssText = `font-weight:bold; color:#ffc200; margin-bottom:12px; text-align:center;`;

    const grid = document.createElement("div");
    grid.style.cssText = `display:grid; grid-template-columns: 1fr 120px 120px; gap:10px; align-items:center;`;

    const name = document.createElement("input");
    name.placeholder = 'Name (e.g. [[Stimpak]] or "Gold Ring")';
    name.style.cssText = `background:#fde4c9;color:black;border-radius:8px;border:1px solid rgba(0,0,0,0.25);padding:8px 10px;`;

    const qty = document.createElement("input");
    qty.type = "number";
    qty.min = "1";
    qty.value = "1";
    qty.style.cssText = `background:#fde4c9;color:black;border-radius:8px;border:1px solid rgba(0,0,0,0.25);padding:8px 10px;text-align:center;`;

    const cost = document.createElement("input");
    cost.type = "number";
    cost.min = "0";
    cost.value = "0";
    cost.style.cssText = `background:#fde4c9;color:black;border-radius:8px;border:1px solid rgba(0,0,0,0.25);padding:8px 10px;text-align:center;`;

    const labels = document.createElement("div");
    labels.style.cssText = `display:grid; grid-template-columns: 1fr 120px 120px; gap:10px; margin-bottom:6px;`;
    const l1 = document.createElement("div"); l1.textContent = "Name"; l1.style.cssText = `color:#ffc200;font-weight:bold;`;
    const l2 = document.createElement("div"); l2.textContent = "Qty";  l2.style.cssText = `color:#ffc200;font-weight:bold;text-align:center;`;
    const l3 = document.createElement("div"); l3.textContent = "Cost"; l3.style.cssText = `color:#ffc200;font-weight:bold;text-align:center;`;
    labels.append(l1, l2, l3);

    grid.append(name, qty, cost);

    const btnRow = document.createElement("div");
    btnRow.style.cssText = `display:flex; gap:10px; justify-content:center; margin-top:14px;`;

    const ok = makeBtn("Add", { background: "#ffc200", color: "#2e4663" });
    const cancel = makeBtn("Cancel", { background: "#2e4663", color: "#ffc200" });

    const close = (val) => {
      overlay.remove();
      resolve(val);
    };

    ok.onclick = () => {
      const nm = String(name.value ?? "").trim();
      if (!nm) return;
      const q = Math.max(1, parseCapsInt(qty.value, 1));
      const c = Math.max(0, parseCapsInt(cost.value, 0));
      close({ name: nm, qty: q, baseCost: c });
    };
    cancel.onclick = () => close(null);

    name.addEventListener("keydown", (e) => {
      if (e.key === "Enter") ok.click();
      if (e.key === "Escape") cancel.click();
    });

    box.append(h, labels, grid, btnRow);
    btnRow.append(ok, cancel);

    overlay.appendChild(box);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) cancel.click();
    });

    document.body.appendChild(overlay);
    setTimeout(() => name.focus(), 0);
  });
}

/* ----------------------------- State Load/Save ----------------------------- */

function loadPlayerCaps() {
  return parseCapsInt(localStorage.getItem(CAPS_KEY), 0);
}

function savePlayerCaps(n) {
  const v = Math.max(0, parseCapsInt(n, 0));
  localStorage.setItem(CAPS_KEY, String(v));
  return v;
}

function loadGearRows() {
  const raw = localStorage.getItem(GEAR_KEY);
  const rows = safeJsonParse(raw || "[]", []);
  return Array.isArray(rows) ? rows : [];
}

function saveGearRows(rows) {
  localStorage.setItem(GEAR_KEY, JSON.stringify(rows));
}

function loadVendorState(vendorId) {
  const raw = localStorage.getItem(keyVendorState(vendorId));
  const st = safeJsonParse(raw || "null", null);
  if (st && typeof st === "object" && Array.isArray(st.inventory)) return st;

  // default vendor state
  return {
    vendorId,
    caps: 0,
    inventory: [],
    mode: "manual",
    randomConfig: null,
    lastBuiltAt: nowMs()
  };
}

function saveVendorState(vendorId, st) {
  localStorage.setItem(keyVendorState(vendorId), JSON.stringify(st));
}

function loadSession(vendorId) {
  const raw = localStorage.getItem(keySession(vendorId));
  const s = safeJsonParse(raw || "null", null);
  if (s && typeof s === "object" && s.vendorId === vendorId) return s;

  return {
    version: 1,
    vendorId,
    startedAt: new Date().toISOString(),
    player: {
	  tradeCaps: loadPlayerCaps()
    },
    pricing: {
      buyMultiplier: 1.0,
      sellMultiplier: 1.0
    },
    pending: {
      buy: {},  // itemId -> qty (vendor -> player)
      sell: {}  // itemId -> qty (player -> vendor)
    },
    ui: {
      playerSearch: "",
      vendorSearch: ""
    },
    updatedAt: nowMs()
  };
}

function saveSession(vendorId, session) {
  session.updatedAt = nowMs();
  localStorage.setItem(keySession(vendorId), JSON.stringify(session));
}

/* ----------------------------- Projection / Math --------------------------- */

function gearToTradeItems(gearRows) {
  // Convert gear rows to normalized TradeItem list
  // Gear rows: { selected, name, qty, cost }
  const out = [];
  for (const r of gearRows) {
    const name = String(r?.name ?? "").trim();
    if (!name) continue;
    const qty = Math.max(0, parseCapsInt(r?.qty, 0));
    const cost = Math.max(0, parseCapsInt(r?.cost, 0));
    if (qty <= 0) continue;

    out.push({
      id: makeItemId(name),
      name,
      qty,
      baseCost: cost
    });
  }
  return out;
}

function vendorStateToItems(vendorState) {
  const inv = Array.isArray(vendorState?.inventory) ? vendorState.inventory : [];
  const out = [];
  for (const it of inv) {
    const name = String(it?.name ?? "").trim();
    if (!name) continue;
    const qty = Math.max(0, parseCapsInt(it?.qty, 0));
    const baseCost = Math.max(0, parseCapsInt(it?.baseCost, 0));
    if (qty <= 0) continue;
    out.push({ id: makeItemId(name), name, qty, baseCost });
  }
  return out;
}

function pooledItemsToItems(pooled) {
  const arr = Array.isArray(pooled) ? pooled : [];
  const out = [];
  for (const it of arr) {
    const name = String(it?.name ?? "").trim();
    if (!name) continue;
    const qty = Math.max(0, parseCapsInt(it?.qty, 0));
    const baseCost = Math.max(0, parseCapsInt(it?.baseCost, 0));
    if (qty <= 0) continue;
    out.push({ id: makeItemId(name), name, qty, baseCost });
  }
  return out;
}

// Returns maps: itemId -> qty
function getPendingQty(session) {
  const buy = session?.pending?.buy ?? {};
  const sell = session?.pending?.sell ?? {};
  return {
    buy: { ...buy },
    sell: { ...sell }
  };
}

function getProjectedQtyForItem({ itemId, basePlayerMap, baseVendorMap, pending }) {
  const basePlayer = basePlayerMap.get(itemId) ?? 0;
  const baseVendor = baseVendorMap.get(itemId) ?? 0;
  const pb = pending.buy[itemId] ?? 0;
  const ps = pending.sell[itemId] ?? 0;

  // Player display: base - sells + buys
  const playerDisplay = basePlayer - ps + pb;
  // Vendor display: base - buys + sells
  const vendorDisplay = baseVendor - pb + ps;

  return { playerDisplay, vendorDisplay, pb, ps };
}

// Integer price rounding rules (configurable):
// - Buy: ceil (player pays)
// - Sell: floor (player receives)
function priceBuy(baseCost, buyMult) {
  return Math.max(0, Math.ceil(baseCost * buyMult));
}
function priceSell(baseCost, sellMult) {
  return Math.max(0, Math.floor(baseCost * sellMult));
}

function computeTotals({ itemsById, pending, pricing }) {
  let buyTotal = 0;
  let sellTotal = 0;

  for (const [itemId, qty] of Object.entries(pending.buy)) {
    const q = Math.max(0, parseCapsInt(qty, 0));
    if (!q) continue;
    const it = itemsById.get(itemId);
    if (!it) continue;
    buyTotal += q * priceBuy(it.baseCost, pricing.buyMultiplier);
  }

  for (const [itemId, qty] of Object.entries(pending.sell)) {
    const q = Math.max(0, parseCapsInt(qty, 0));
    if (!q) continue;
    const it = itemsById.get(itemId);
    if (!it) continue;
    sellTotal += q * priceSell(it.baseCost, pricing.sellMultiplier);
  }

  return { buyTotal, sellTotal };
}

/* ----------------------------- Commit Logic -------------------------------- */

function upsertGearRow(gearRows, name, qtyDelta, costInt) {
  const key = normalizeNameKey(name);
  let row = gearRows.find(r => normalizeNameKey(r?.name) === key);

  if (!row) {
    if (qtyDelta <= 0) return; // nothing to remove
    gearRows.push({
      selected: false,
      name,
      qty: String(qtyDelta),
      cost: String(Math.max(0, parseCapsInt(costInt, 0)))
    });
    return;
  }

  const cur = Math.max(0, parseCapsInt(row.qty, 0));
  const next = cur + qtyDelta;

  if (next <= 0) {
    const idx = gearRows.indexOf(row);
    if (idx >= 0) gearRows.splice(idx, 1);
    return;
  }

  row.qty = String(next);

  // keep cost stable, but if blank, fill it
  if (String(row.cost ?? "").trim() === "") row.cost = String(Math.max(0, parseCapsInt(costInt, 0)));
}

function upsertVendorInv(vendorInv, name, qtyDelta, baseCostInt) {
  const key = normalizeNameKey(name);
  let row = vendorInv.find(r => normalizeNameKey(r?.name) === key);

  if (!row) {
    if (qtyDelta <= 0) return;
    vendorInv.push({
      name,
      qty: qtyDelta,
      baseCost: Math.max(0, parseCapsInt(baseCostInt, 0))
    });
    return;
  }

  const cur = Math.max(0, parseCapsInt(row.qty, 0));
  const next = cur + qtyDelta;

  if (next <= 0) {
    const idx = vendorInv.indexOf(row);
    if (idx >= 0) vendorInv.splice(idx, 1);
    return;
  }

  row.qty = next;
  if (!Number.isFinite(parseCapsInt(row.baseCost, NaN))) row.baseCost = Math.max(0, parseCapsInt(baseCostInt, 0));
}

function upsertPooledInv(pooledInv, name, qtyDelta, baseCostInt) {
  const arr = Array.isArray(pooledInv) ? pooledInv : [];
  const key = normalizeNameKey(name);
  let row = arr.find(r => normalizeNameKey(r?.name) === key);

  if (!row) {
    if (qtyDelta <= 0) return;
    arr.push({
      name,
      qty: Math.max(0, parseCapsInt(qtyDelta, 0)),
      baseCost: Math.max(0, parseCapsInt(baseCostInt, 0))
    });
    return;
  }

  const cur = Math.max(0, parseCapsInt(row.qty, 0));
  const next = cur + qtyDelta;

  if (next <= 0) {
    const idx = arr.indexOf(row);
    if (idx >= 0) arr.splice(idx, 1);
    return;
  }

  row.qty = next;
  if (!Number.isFinite(parseCapsInt(row.baseCost, NaN))) row.baseCost = Math.max(0, parseCapsInt(baseCostInt, 0));
}


function applyConfirm({ vendorId, session, vendorState }) {
  const gearRows = loadGearRows();
  const playerBaseItems = gearToTradeItems(gearRows);
  const vendorBaseItems = vendorStateToItems(vendorState);
  const pooledItems = pooledItemsToItems(session.player.pooledItems);

  // Build a master item map for pricing (prefer player item cost, else vendor, else pooled)
  const itemsById = new Map();
  for (const it of [...playerBaseItems, ...vendorBaseItems, ...pooledItems]) {
    if (!itemsById.has(it.id)) itemsById.set(it.id, it);
  }

  const pending = getPendingQty(session);
  const totals = computeTotals({ itemsById, pending, pricing: session.pricing });

  const storedCaps = loadPlayerCaps();
  const effectiveCaps = session.player.usePooledCaps
    ? Math.max(0, parseCapsInt(session.player.pooledCaps, storedCaps))
    : storedCaps;

  // Validate (player cannot afford)
  if (effectiveCaps < totals.buyTotal) {
    return { ok: false, reason: "Player does not have enough caps." };
  }

  // Vendor shortfall (cap sell payout)
  const vendorCapsStart = Math.max(0, parseCapsInt(vendorState.caps, 0));
  const vendorPayout = Math.min(vendorCapsStart, totals.sellTotal);

  // Final caps
  const playerCapsEnd = Math.max(0, effectiveCaps - totals.buyTotal + vendorPayout);
  const vendorCapsEnd = Math.max(0, vendorCapsStart + totals.buyTotal - vendorPayout); // vendor hits 0 if short and sellTotal > caps

  // Apply inventory deltas:
  // - Buys: add to gear, remove from vendor
  // - Sells: remove from gear, add to vendor
  for (const [itemId, qtyRaw] of Object.entries(pending.buy)) {
    const qty = Math.max(0, parseCapsInt(qtyRaw, 0));
    if (!qty) continue;
    const it = itemsById.get(itemId);
    if (!it) continue;

    upsertGearRow(gearRows, it.name, +qty, it.baseCost);
    upsertVendorInv(vendorState.inventory, it.name, -qty, it.baseCost);
  }

  for (const [itemId, qtyRaw] of Object.entries(pending.sell)) {
    const qty = Math.max(0, parseCapsInt(qtyRaw, 0));
    if (!qty) continue;
    const it = itemsById.get(itemId);
    if (!it) continue;

    upsertGearRow(gearRows, it.name, -qty, it.baseCost);
    upsertVendorInv(vendorState.inventory, it.name, +qty, it.baseCost);
  }

  // Save caps back to sheet (pooled is session override, but writes final caps)
  savePlayerCaps(playerCapsEnd);
  session.player.tradeCaps = playerCapsEnd;
  saveGearRows(gearRows);

  // Save vendor
  vendorState.caps = vendorCapsEnd;
  vendorState.lastBuiltAt = nowMs();
  saveVendorState(vendorId, vendorState);

  // Clear pending (keep session open)
  session.pending.buy = {};
  session.pending.sell = {};
  saveSession(vendorId, session);

  return {
    ok: true,
    totals,
    vendorPayout,
    forfeited: Math.max(0, totals.sellTotal - vendorPayout),
    playerCapsEnd,
    vendorCapsEnd
  };
}

/* ----------------------------- UI Build ------------------------------------ */

function buildTradeUI(root) {
  root.innerHTML = "";
  root.style.cssText = `width:100%;`;

  // --- Container ---
  const appWrap = document.createElement("div");
  appWrap.style.cssText = `
    width:100%;
    display:flex;
    flex-direction:column;
    gap:10px;
  `;

  // --- Top Toolbar ---
  const toolbar = document.createElement("div");
  toolbar.style.cssText = `
    display:flex;
    justify-content:space-between;
    align-items:center;
    gap:10px;
    background:#325886;
    border:1px solid #ffc200;
    border-radius:10px;
    padding:8px 10px;
    flex-wrap:wrap;
  `;

  const leftTools = document.createElement("div");
  leftTools.style.cssText = `display:flex; gap:8px; align-items:center; flex-wrap:wrap;`;

  const rightTools = document.createElement("div");
  rightTools.style.cssText = `display:flex; gap:8px; align-items:center; flex-wrap:wrap;`;

  const vendorIdLabel = document.createElement("span");
  vendorIdLabel.textContent = "Vendor:";
  vendorIdLabel.style.cssText = `color:#ffc200;font-weight:bold;`;

  const vendorIdInput = document.createElement("input");
  vendorIdInput.value = "default_vendor";
  vendorIdInput.style.cssText = `
    width:220px;
    background:#fde4c9; color:black;
    border:1px solid rgba(0,0,0,0.25);
    border-radius:8px;
    padding:6px 8px;
  `;

  const exportBtn = makeBtn("Export", { background: "#ffc200", color: "#2e4663" });
  const importBtn = makeBtn("Import", { background: "#2e4663", color: "#ffc200", border: "1px solid #ffc200" });
  const clearBtn  = makeBtn("Clear",  { background: "#2e4663", color: "#ffc200", border: "1px solid #ffc200" });

  leftTools.append(vendorIdLabel, vendorIdInput);
  rightTools.append(exportBtn, importBtn, clearBtn);
  toolbar.append(leftTools, rightTools);

  // --- Main Columns Frame ---
  const cols = document.createElement("div");
  cols.style.cssText = `
    width:100%;
    display:grid;
    grid-template-columns: 1fr 1fr;
    gap:10px;
  `;

  // Column card styles
  const makeCard = () => {
    const c = document.createElement("div");
    c.style.cssText = `
      background:#325886;
      border:3px solid #2e4663;
      border-radius:12px;
      padding:10px;
      display:flex;
      flex-direction:column;
      gap:8px;
      min-height:520px;
    `;
    return c;
  };

  const playerCard = makeCard();
  const vendorCard = makeCard();

  // Header rows (caps in outer corners)
  const makeHeaderRow = (titleText, align = "left") => {
    const row = document.createElement("div");
    row.style.cssText = `
      display:flex;
      align-items:flex-start;
      justify-content:space-between;
      gap:8px;
    `;

    const title = document.createElement("div");
    title.textContent = titleText;
    title.style.cssText = `color:#ffc200; font-weight:bold; font-size:16px;`;

    const capsWrap = document.createElement("div");
    capsWrap.style.cssText = `
      display:flex;
      flex-direction:column;
      align-items:${align === "left" ? "flex-start" : "flex-end"};
      gap:6px;
      min-width:220px;
    `;

    row.append(title, capsWrap);
    return { row, capsWrap };
  };

  const playerHeader = makeHeaderRow("PLAYER", "left");
  const vendorHeader = makeHeaderRow("VENDOR", "right");

  // Caps displays (click-to-edit + pooled toggle for player)
  const makeCapsWidget = ({ label, getValue, setValue, allowPool = false, getPool, setPool }) => {
    const wrap = document.createElement("div");
    wrap.style.cssText = `
      display:flex;
      flex-direction:column;
      gap:4px;
      background:rgba(46,70,99,0.35);
      border:1px solid rgba(255,194,0,0.55);
      border-radius:10px;
      padding:8px 10px;
    `;

    const top = document.createElement("div");
    top.style.cssText = `display:flex; align-items:center; justify-content:space-between; gap:10px;`;

    const lab = document.createElement("div");
    lab.textContent = label;
    lab.style.cssText = `color:#ffc200; font-weight:bold; font-size:12px;`;

    const valSpan = document.createElement("span");
    valSpan.style.cssText = `color:#efdd6f; font-weight:bold; cursor:pointer; text-align:right; min-width:70px;`;
    valSpan.title = "Click to edit";

    const valInput = document.createElement("input");
    valInput.type = "number";
    valInput.style.cssText = `display:none; width:80px; text-align:center; background:#fde4c9; color:black; border-radius:8px; border:1px solid rgba(0,0,0,0.25); padding:4px 6px;`;

    const setDisplay = (v) => {
      valSpan.textContent = String(Math.max(0, parseCapsInt(v, 0)));
    };

    const enterEdit = () => {
      valInput.value = String(getValue());
      valSpan.style.display = "none";
      valInput.style.display = "inline-block";
      valInput.focus();
      valInput.select();
    };

    const exitEdit = (apply) => {
      if (apply) setValue(parseCapsInt(valInput.value, getValue()));
      valInput.style.display = "none";
      valSpan.style.display = "inline-block";
      setDisplay(getValue());
    };

    valSpan.onclick = (e) => {
      e.stopPropagation();
      enterEdit();
    };
    valInput.addEventListener("blur", () => exitEdit(true));
    valInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") exitEdit(true);
      if (e.key === "Escape") exitEdit(false);
    });

    top.append(lab, valSpan, valInput);

    // Optional pooled toggle
    let poolRow = null;
    if (allowPool) {
      poolRow = document.createElement("div");
      poolRow.style.cssText = `display:flex; gap:8px; align-items:center; justify-content:space-between;`;

      const poolLab = document.createElement("label");
      poolLab.style.cssText = `display:flex; gap:6px; align-items:center; color:#efdd6f; font-size:12px; cursor:pointer; user-select:none;`;

      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.checked = !!getPool().enabled;
      cb.addEventListener("change", () => setPool({ enabled: cb.checked, value: getPool().value }));

      const t = document.createElement("span");
      t.textContent = "Use pooled caps";

      const pooledVal = document.createElement("span");
      pooledVal.style.cssText = `color:#efdd6f; font-weight:bold; cursor:pointer;`;
      pooledVal.title = "Click to edit pooled caps";
      const pooledInput = document.createElement("input");
      pooledInput.type = "number";
      pooledInput.style.cssText = `display:none; width:90px; text-align:center; background:#fde4c9; color:black; border-radius:8px; border:1px solid rgba(0,0,0,0.25); padding:4px 6px;`;

      const syncPool = () => {
        pooledVal.textContent = String(Math.max(0, parseCapsInt(getPool().value, 0)));
        pooledVal.style.opacity = getPool().enabled ? "1" : "0.45";
      };

      pooledVal.onclick = (e) => {
        e.stopPropagation();
        pooledInput.value = String(getPool().value ?? 0);
        pooledVal.style.display = "none";
        pooledInput.style.display = "inline-block";
        pooledInput.focus();
        pooledInput.select();
      };

      const exitPool = (apply) => {
        if (apply) setPool({ enabled: getPool().enabled, value: parseCapsInt(pooledInput.value, getPool().value) });
        pooledInput.style.display = "none";
        pooledVal.style.display = "inline-block";
        syncPool();
      };

      pooledInput.addEventListener("blur", () => exitPool(true));
      pooledInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") exitPool(true);
        if (e.key === "Escape") exitPool(false);
      });

      poolLab.append(cb, t);
      poolRow.append(poolLab, pooledVal, pooledInput);

      // init
      syncPool();
    }

    wrap.append(top);
    if (poolRow) wrap.append(poolRow);

    // initial
    setDisplay(getValue());

    return { wrap, setDisplay };
  };

  // Multipliers widgets (below caps)
  const makeMultiplierWidget = ({ label, getValue, setValue }) => {
    const wrap = document.createElement("div");
    wrap.style.cssText = `
      display:flex;
      gap:8px;
      align-items:center;
      justify-content:space-between;
      background:rgba(46,70,99,0.25);
      border:1px solid rgba(255,194,0,0.25);
      border-radius:10px;
      padding:8px 10px;
    `;

    const lab = document.createElement("div");
    lab.textContent = label;
    lab.style.cssText = `color:#ffc200; font-weight:bold; font-size:12px;`;

    const input = document.createElement("input");
    input.type = "number";
    input.step = "0.01";
    input.min = "0";
    input.value = String(getValue());
    input.style.cssText = `width:90px; text-align:center; background:#fde4c9; color:black; border-radius:8px; border:1px solid rgba(0,0,0,0.25); padding:4px 6px;`;

    input.addEventListener("input", () => {
      const v = Number(input.value);
      if (!Number.isFinite(v) || v < 0) return;
      setValue(v);
    });

    wrap.append(lab, input);
    return { wrap, input };
  };

  // Inventory list area + search at bottom
  const makeInventoryList = () => {
    const listWrap = document.createElement("div");
    listWrap.style.cssText = `
      flex:1;
      display:flex;
      flex-direction:column;
      gap:8px;
      min-height:360px;
    `;

    const list = document.createElement("div");
    list.style.cssText = `
      flex:1;
      background:rgba(46,70,99,0.25);
      border:1px solid rgba(255,194,0,0.18);
      border-radius:12px;
      padding:8px;
      overflow:auto;
    `;

    const searchWrap = document.createElement("div");
    searchWrap.style.cssText = `
      display:flex;
      gap:8px;
      align-items:center;
      justify-content:space-between;
      background:rgba(46,70,99,0.25);
      border:1px solid rgba(255,194,0,0.18);
      border-radius:12px;
      padding:8px 10px;
    `;

    const lab = document.createElement("div");
    lab.textContent = "Search";
    lab.style.cssText = `color:#ffc200; font-weight:bold; font-size:12px;`;

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Manual Item Addition";
    input.style.cssText = `flex:1; background:#fde4c9; color:black; border-radius:8px; border:1px solid rgba(0,0,0,0.25); padding:6px 8px;`;

    searchWrap.append(lab, input);

    listWrap.append(list, searchWrap);
    return { listWrap, list, searchInput: input };
  };

  const playerInvUI = makeInventoryList();
  const vendorInvUI = makeInventoryList();

  // Footer summary + actions
  const footer = document.createElement("div");
  footer.style.cssText = `
    width:100%;
    background:#325886;
    border:1px solid #ffc200;
    border-radius:12px;
    padding:10px;
    display:flex;
    justify-content:space-between;
    align-items:center;
    gap:10px;
    flex-wrap:wrap;
  `;

  const totalsLeft = document.createElement("div");
  totalsLeft.style.cssText = `display:flex; gap:14px; align-items:center; flex-wrap:wrap;`;

  const mkStat = (label) => {
    const w = document.createElement("div");
    w.style.cssText = `display:flex; gap:6px; align-items:center;`;
    const l = document.createElement("div");
    l.textContent = label;
    l.style.cssText = `color:#ffc200; font-weight:bold; font-size:12px;`;
    const v = document.createElement("div");
    v.textContent = "0";
    v.style.cssText = `color:#efdd6f; font-weight:bold;`;
    w.append(l, v);
    return { w, v };
  };

  const statBuy = mkStat("Player Pays:");
  const statSell = mkStat("Vendor Pays:");
  const statNet = mkStat("Net:");
  const statWarn = document.createElement("div");
  statWarn.style.cssText = `color:#efdd6f; font-size:12px; opacity:0.9;`;

  totalsLeft.append(statBuy.w, statSell.w, statNet.w, statWarn);

  const actionsRight = document.createElement("div");
  actionsRight.style.cssText = `display:flex; gap:8px; align-items:center;`;

  const confirmBtn = makeBtn("Confirm", { background: "#ffc200", color: "#2e4663" });
  const cancelBtn = makeBtn("Cancel", { background: "#2e4663", color: "#ffc200", border: "1px solid #ffc200" });

  actionsRight.append(confirmBtn, cancelBtn);
  footer.append(totalsLeft, actionsRight);

  // Assemble cards
  playerCard.append(playerHeader.row);
  vendorCard.append(vendorHeader.row);

  // We'll insert caps widgets and multipliers into capsWraps, then inventory list
  playerCard.append(playerInvUI.listWrap);
  vendorCard.append(vendorInvUI.listWrap);

  cols.append(playerCard, vendorCard);

  appWrap.append(toolbar, cols, footer);
  root.appendChild(appWrap);

  /* --------------------------- Live State + Render -------------------------- */

  let vendorId = String(vendorIdInput.value || "default_vendor").trim() || "default_vendor";
  let vendorState = loadVendorState(vendorId);
  let session = loadSession(vendorId);

  // Ensure search inputs reflect session
  playerInvUI.searchInput.value = session.ui.playerSearch || "";
  vendorInvUI.searchInput.value = session.ui.vendorSearch || "";

  const getEffectiveCaps = () => {
    // Trade caps are the session’s working total (player may manually increase for pooling)
    return Math.max(0, parseCapsInt(session.player.tradeCaps, loadPlayerCaps()));
  };


  // Caps widgets
  // Player Trade Caps (editable total, used for pooling; no checkbox)
  const playerCapsWidget = (() => {
    const wrap = document.createElement("div");
    wrap.style.cssText = `
      display:flex;
      flex-direction:column;
      gap:4px;
      background:rgba(46,70,99,0.35);
      border:1px solid rgba(255,194,0,0.55);
      border-radius:10px;
      padding:8px 10px;
    `;

    const top = document.createElement("div");
    top.style.cssText = `display:flex; align-items:center; justify-content:space-between; gap:10px;`;

    const lab = document.createElement("div");
    lab.textContent = "Caps";
    lab.style.cssText = `color:#ffc200; font-weight:bold; font-size:12px;`;

    const valSpan = document.createElement("span");
    valSpan.style.cssText = `color:#efdd6f; font-weight:bold; cursor:pointer; text-align:right; min-width:70px;`;
    valSpan.title = "Click to edit";

    const valInput = document.createElement("input");
    valInput.type = "number";
    valInput.style.cssText = `
      display:none;
      width:90px;
      text-align:center;
      background:#fde4c9;
      color:black;
      border-radius:8px;
      border:1px solid rgba(0,0,0,0.25);
      padding:4px 6px;
    `;
    
    const refresh = () => {
      valSpan.textContent = String(getEffectiveCaps());
    };

    const enterEdit = () => {
      valInput.value = String(getEffectiveCaps());
      valSpan.style.display = "none";
      valInput.style.display = "inline-block";
      valInput.focus();
      valInput.select();
    };

    const exitEdit = (apply) => {
      if (apply) {
        session.player.tradeCaps = Math.max(0, parseCapsInt(valInput.value, getEffectiveCaps()));
        saveSession(vendorId, session);
      }
      valInput.style.display = "none";
      valSpan.style.display = "inline-block";
      refresh();
      render();
    };

    valSpan.onclick = (e) => {
      e.stopPropagation();
      enterEdit();
    };

    valInput.addEventListener("blur", () => exitEdit(true));
    valInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") exitEdit(true);
      if (e.key === "Escape") exitEdit(false);
    });

    top.append(lab, valSpan, valInput);
    wrap.append(top);

    // expose a refresh hook
    wrap._refresh = refresh;

    refresh();
    return { wrap };
  })();


  const vendorCapsWidget = makeCapsWidget({
    label: "Caps",
    getValue: () => Math.max(0, parseCapsInt(vendorState.caps, 0)),
    setValue: (v) => {
      vendorState.caps = Math.max(0, parseCapsInt(v, 0));
      saveVendorState(vendorId, vendorState);
      render();
    }
  });

  playerHeader.capsWrap.appendChild(playerCapsWidget.wrap);
  vendorHeader.capsWrap.appendChild(vendorCapsWidget.wrap);

  // Multipliers below caps
  const sellMultUI = makeMultiplierWidget({
    label: "Sell multiplier",
    getValue: () => session.pricing.sellMultiplier,
    setValue: (v) => {
      session.pricing.sellMultiplier = v;
      saveSession(vendorId, session);
      render();
    }
  });

  const buyMultUI = makeMultiplierWidget({
    label: "Buy multiplier",
    getValue: () => session.pricing.buyMultiplier,
    setValue: (v) => {
      session.pricing.buyMultiplier = v;
      saveSession(vendorId, session);
      render();
    }
  });
  
  // --- Bottom multipliers row (outside panels) ---
  const multipliersRow = document.createElement("div");
  multipliersRow.style.cssText = `
    display:grid;
    grid-template-columns: 1fr 1fr;
    gap:10px;
    margin-top:4px;
  `;

  multipliersRow.appendChild(sellMultUI.wrap); // left = player sell
  multipliersRow.appendChild(buyMultUI.wrap);  // right = vendor buy
  appWrap.insertBefore(multipliersRow, footer);

  
  // Search persistence
  playerInvUI.searchInput.addEventListener("input", () => {
    session.ui.playerSearch = playerInvUI.searchInput.value || "";
    saveSession(vendorId, session);
    render();
  });
  vendorInvUI.searchInput.addEventListener("input", () => {
    session.ui.vendorSearch = vendorInvUI.searchInput.value || "";
    saveSession(vendorId, session);
    render();
  });

  playerInvUI.searchInput.addEventListener("keydown", async (e) => {
    if (e.key !== "Enter") return;
    const typed = String(playerInvUI.searchInput.value || "").trim();
    if (!typed) return;

    // Add as pooled item (other players / pooled items)
    const res = await promptVendorItem({
      title: "Add Pooled Item",
      initialName: typed
    });
    if (!res) return;

    upsertPooledInv(session.player.pooledItems, res.name, +res.qty, res.baseCost);
    saveSession(vendorId, session);

    // Clear search so list returns to normal
    session.ui.playerSearch = "";
    playerInvUI.searchInput.value = "";
    saveSession(vendorId, session);

    render();
  });

  vendorInvUI.searchInput.addEventListener("keydown", async (e) => {
    if (e.key !== "Enter") return;
    const typed = String(vendorInvUI.searchInput.value || "").trim();
    if (!typed) return;

    const res = await promptVendorItem({
      title: "Add Vendor Item",
      initialName: typed
    });
    if (!res) return;

    upsertVendorInv(vendorState.inventory, res.name, +res.qty, res.baseCost);
    saveVendorState(vendorId, vendorState);

    // Clear search so list returns to normal
    session.ui.vendorSearch = "";
    vendorInvUI.searchInput.value = "";
    saveSession(vendorId, session);

    render();
  });


  // Vendor id change handling
  const switchVendor = () => {
    vendorId = String(vendorIdInput.value || "default_vendor").trim() || "default_vendor";
    vendorState = loadVendorState(vendorId);
    session = loadSession(vendorId);

    playerInvUI.searchInput.value = session.ui.playerSearch || "";
    vendorInvUI.searchInput.value = session.ui.vendorSearch || "";

    // refresh caps widgets & multipliers
    render();
  };

  vendorIdInput.addEventListener("change", switchVendor);
  vendorIdInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") switchVendor();
  });

  /* ------------------------ Pending Mutation Helpers ------------------------ */

  const addPending = (direction, itemId, qty) => {
    qty = Math.max(0, parseCapsInt(qty, 0));
    if (!qty) return;

    if (direction === "BUY") {
      session.pending.buy[itemId] = (parseCapsInt(session.pending.buy[itemId], 0) + qty);
      saveSession(vendorId, session);
      return;
    }
    if (direction === "SELL") {
      session.pending.sell[itemId] = (parseCapsInt(session.pending.sell[itemId], 0) + qty);
      saveSession(vendorId, session);
      return;
    }
  };

  const removePending = (direction, itemId, qty) => {
    qty = Math.max(0, parseCapsInt(qty, 0));
    if (!qty) return;

    if (direction === "BUY") {
      const cur = Math.max(0, parseCapsInt(session.pending.buy[itemId], 0));
      const next = cur - qty;
      if (next <= 0) delete session.pending.buy[itemId];
      else session.pending.buy[itemId] = next;
      saveSession(vendorId, session);
      return;
    }
    if (direction === "SELL") {
      const cur = Math.max(0, parseCapsInt(session.pending.sell[itemId], 0));
      const next = cur - qty;
      if (next <= 0) delete session.pending.sell[itemId];
      else session.pending.sell[itemId] = next;
      saveSession(vendorId, session);
      return;
    }
  };

  /* ----------------------------- Rendering --------------------------------- */

  function renderList({ which, listEl, items, basePlayerMap, baseVendorMap, itemsById }) {
    listEl.innerHTML = "";

    const searchText = (which === "player" ? session.ui.playerSearch : session.ui.vendorSearch) || "";
    const q = searchText.trim().toLowerCase();

    const pending = getPendingQty(session);

    // Build projected list:
    // We render from union of known items so destination rows can appear even if base was 0.
    const allIds = new Set();
    items.forEach(it => allIds.add(it.id));
    Object.keys(pending.buy).forEach(id => allIds.add(id));
    Object.keys(pending.sell).forEach(id => allIds.add(id));

    // Render helper row
    const makeRow = ({ name, qty, baseCost, marker, rightText }) => {
      const row = document.createElement("div");
      row.style.cssText = `
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:10px;
        padding:8px 10px;
        border-radius:10px;
        border:1px solid rgba(255,194,0,0.18);
        background:rgba(46,70,99,0.20);
        margin-bottom:6px;
        cursor:pointer;
        user-select:none;
      `;

      const left = document.createElement("div");
      left.style.cssText = `display:flex; gap:8px; align-items:center; min-width:0;`;

      const m = document.createElement("span");
      m.textContent = marker ? "⬛" : "";
      m.style.cssText = `width:16px; color:#ffc200; font-weight:bold;`;

      const nm = document.createElement("div");
      nm.textContent = name;
      nm.style.cssText = `color:#efdd6f; font-weight:bold; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:360px;`;

      left.append(m, nm);

      const right = document.createElement("div");
      right.style.cssText = `display:flex; gap:10px; align-items:center;`;

      const qtyEl = document.createElement("div");
      qtyEl.textContent = `x${qty}`;
      qtyEl.style.cssText = `color:#efdd6f; font-weight:bold;`;

      const costEl = document.createElement("div");
      costEl.textContent = rightText || String(baseCost);
      costEl.style.cssText = `color:#ffc200; font-weight:bold;`;

      right.append(qtyEl, costEl);

      row.append(left, right);

      return row;
    };

    const ids = Array.from(allIds);

    // Build derived rows
    const rows = [];
    for (const id of ids) {
      const it = itemsById.get(id);
      if (!it) continue;

      const { playerDisplay, vendorDisplay, pb, ps } = getProjectedQtyForItem({
        itemId: id,
        basePlayerMap,
        baseVendorMap,
        pending
      });

      const displayQty = which === "player" ? playerDisplay : vendorDisplay;
      if (displayQty <= 0) continue; // hide when moved out entirely (your requirement)

      // Search filter
      if (q) {
        const nCore = normalizeNameKey(it.name);
        if (!nCore.includes(q)) continue;
      }

      // Destination-only marker rules:
      // - Player list marker when pending BUY (incoming to player)
      // - Vendor list marker when pending SELL (incoming to vendor)
      const marker = which === "player" ? (pb > 0) : (ps > 0);

      // Show unit price in list right side (so players see negotiated pricing)
      const unit = which === "player"
        ? (marker ? priceBuy(it.baseCost, session.pricing.buyMultiplier) : it.baseCost)
        : (marker ? priceSell(it.baseCost, session.pricing.sellMultiplier) : it.baseCost);

      // Note: we show baseCost unless marker indicates it is incoming via trade.
      rows.push({
        id,
        name: it.name,
        qty: displayQty,
        baseCost: it.baseCost,
        marker,
        unitDisplay: unit
      });
    }

    // Sort: name asc
    rows.sort((a, b) => normalizeNameKey(a.name).localeCompare(normalizeNameKey(b.name)));

    if (!rows.length) {
      const empty = document.createElement("div");
      empty.textContent = "No items.";
      empty.style.cssText = `opacity:0.75; color:#efdd6f; padding:8px 10px;`;
      listEl.appendChild(empty);
      return;
    }

    // Click handlers using locked rules
    for (const r of rows) {
      const rowEl = makeRow({
        name: r.name,
        qty: r.qty,
        baseCost: r.baseCost,
        marker: r.marker,
        rightText: `${r.unitDisplay}c`
      });

      rowEl.title = "Click to move (Shift+Click for quantity)";

      rowEl.addEventListener("click", async (e) => {
        const pending = getPendingQty(session);
        const pb = pending.buy[r.id] ?? 0;
        const ps = pending.sell[r.id] ?? 0;

        const isDestWithMarker = r.marker === true;

        // Determine which action this click represents:
        // - Clicking in VENDOR list normally means BUY (vendor -> player)
        // - Clicking in PLAYER list normally means SELL (player -> vendor)
        // - If the row is a destination-marked row, clicking undoes that incoming move.
        //
        // Destination marker conditions:
        // - In player list, marker means pb>0 -> undo BUY
        // - In vendor list, marker means ps>0 -> undo SELL
        const listIsPlayer = (which === "player");

        const doPrompt = e.shiftKey;

        if (isDestWithMarker) {
          // Undo
          const pendingQty = listIsPlayer ? pb : ps;
          if (pendingQty <= 0) return;

          let qtyToUndo = 1;

          if (doPrompt || pendingQty > 5) {
            const val = await promptQty({
              title: `Undo how many? (max ${pendingQty})`,
              min: 1,
              max: pendingQty,
              initial: 1
            });
            if (val === null) return;
            qtyToUndo = val;
          } else {
            // ≤5: undo 1 (locked)
            qtyToUndo = 1;
          }

          if (listIsPlayer) removePending("BUY", r.id, qtyToUndo);
          else removePending("SELL", r.id, qtyToUndo);

          render();
          return;
        }

        // Normal move
        const sourceQty = r.qty; // projected available in this list
        if (sourceQty <= 0) return;

        let qtyToMove = 1;

        if (doPrompt || sourceQty > 5) {
          const val = await promptQty({
            title: `Move how many? (max ${sourceQty})`,
            min: 1,
            max: sourceQty,
            initial: 1
          });
          if (val === null) return;
          qtyToMove = val;
        } else {
          // ≤5: move 1 (locked)
          qtyToMove = 1;
        }

        if (listIsPlayer) {
          // selling to vendor
          addPending("SELL", r.id, qtyToMove);
        } else {
          // buying from vendor
          addPending("BUY", r.id, qtyToMove);
        }

        render();
      });

      listEl.appendChild(rowEl);
    }
  }

  function render() {
    // Reload base data each render (keeps it consistent if sheet changes)
    const gearRows = loadGearRows();
    const playerItems = gearToTradeItems(gearRows);
    const vendorItems = vendorStateToItems(vendorState);
    const pooled = pooledItemsToItems(session.player.pooledItems);

    // Master item map for consistent cost references
    const itemsById = new Map();
    for (const it of [...playerItems, ...vendorItems, ...pooled]) {
      if (!itemsById.has(it.id)) itemsById.set(it.id, it);
    }

    // Build base qty maps
    const basePlayerMap = new Map();
    for (const it of playerItems) basePlayerMap.set(it.id, it.qty);
    
    // Include pooled items in the player-side available inventory
	for (const it of pooled) {
	  const cur = basePlayerMap.get(it.id) ?? 0;
	  basePlayerMap.set(it.id, cur + it.qty);
	}


    const baseVendorMap = new Map();
    for (const it of vendorItems) baseVendorMap.set(it.id, it.qty);

    // NOTE: pooled items do not exist in either base map; they are currently only a future hook.
    // If you want pooled items to be sellable, you can add them to basePlayerMap here later.

    // Render lists
    renderList({
      which: "player",
      listEl: playerInvUI.list,
      items: playerItems,
      basePlayerMap,
      baseVendorMap,
      itemsById
    });

    renderList({
      which: "vendor",
      listEl: vendorInvUI.list,
      items: vendorItems,
      basePlayerMap,
      baseVendorMap,
      itemsById
    });

    // Totals + confirm enablement
    const pending = getPendingQty(session);
    const { buyTotal, sellTotal } = computeTotals({ itemsById, pending, pricing: session.pricing });

    statBuy.v.textContent = String(buyTotal);
    statSell.v.textContent = String(sellTotal);
    statNet.v.textContent = String(sellTotal - buyTotal);

    const vendorCaps = Math.max(0, parseCapsInt(vendorState.caps, 0));
    const vendorPayout = Math.min(vendorCaps, sellTotal);
    const forfeited = Math.max(0, sellTotal - vendorPayout);

    if (forfeited > 0) {
      statWarn.textContent = `Vendor can only pay ${vendorPayout}. ${forfeited} forfeited.`;
    } else {
      statWarn.textContent = "";
    }

    // Confirm disabled if player can't afford buys (effective caps)
    const effectiveCaps = getEffectiveCaps();
    confirmBtn.disabled = effectiveCaps < buyTotal;
    confirmBtn.style.opacity = confirmBtn.disabled ? "0.55" : "1";
    confirmBtn.style.cursor = confirmBtn.disabled ? "not-allowed" : "pointer";
  }

  /* ------------------------- Toolbar Actions -------------------------- */

  exportBtn.onclick = async () => {
    const payload = {
      version: 1,
      vendorId,
      vendorState,
      session
    };
    const ok = await setClipboard(JSON.stringify(payload, null, 2));
    showNotice(ok ? "Export copied to clipboard." : "Clipboard failed. Try again.");
  };

  importBtn.onclick = async () => {
    const txt = await promptJsonPaste({
      title: "Import Trade Data",
      placeholder: "Paste exported JSON here…"
    });
    if (!txt) return;

    const data = safeJsonParse(txt, null);
    if (!data || typeof data !== "object") {
      showNotice("Invalid JSON.");
      return;
    }

    const importedVendorId = String(data.vendorId || vendorId).trim() || vendorId;
    vendorIdInput.value = importedVendorId;

    // Load + apply
    vendorId = importedVendorId;

    if (data.vendorState && typeof data.vendorState === "object") {
      vendorState = data.vendorState;
      vendorState.vendorId = vendorId;
      saveVendorState(vendorId, vendorState);
    } else {
      vendorState = loadVendorState(vendorId);
    }

    if (data.session && typeof data.session === "object") {
      session = data.session;
      session.vendorId = vendorId;
      saveSession(vendorId, session);
    } else {
      session = loadSession(vendorId);
    }

    showNotice("Import complete.");
    render();
  };

  clearBtn.onclick = () => {
    // Clear session only (keep vendor state)
    session.player.tradeCaps = loadPlayerCaps();
    session.pricing.buyMultiplier = 1.0;
    session.pricing.sellMultiplier = 1.0;
    session.pending.buy = {};
    session.pending.sell = {};
    session.ui.playerSearch = "";
    session.ui.vendorSearch = "";
    saveSession(vendorId, session);

    playerInvUI.searchInput.value = "";
    vendorInvUI.searchInput.value = "";

    showNotice("Trade session cleared.");
    render();
  };

  cancelBtn.onclick = () => {
    // Cancel = clear pending only (leave everything else, so accidental close still resumes)
    session.pending.buy = {};
    session.pending.sell = {};
    saveSession(vendorId, session);
    showNotice("Pending trade cleared.");
    render();
  };

  confirmBtn.onclick = () => {
    const result = applyConfirm({ vendorId, session, vendorState });
    if (!result.ok) {
      showNotice(result.reason || "Cannot confirm.");
      render();
      return;
    }

    if (result.forfeited > 0) {
      showNotice(`Confirmed. Vendor short ${result.forfeited} (forfeited).`);
    } else {
      showNotice("Trade confirmed.");
    }

    // Reload fresh (in case sheet changed)
    vendorState = loadVendorState(vendorId);
    session = loadSession(vendorId);
    render();
  };
  if (playerCapsWidget?.wrap?._refresh) playerCapsWidget.wrap._refresh();
  // Initial render
  render();
}

/* ----------------------------- Mount in Note ------------------------------- */

// --- JS Engine render (REQUIRED) ---
const root = document.createElement("div");
root.style.width = "100%";
buildTradeUI(root);
return root;

```