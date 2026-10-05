```js-engine
/*****************************************************************************************
 * TRADE MENU (Single Note) — Modern Inventory Transfer Build
 * - Player inventory source of truth: localStorage "fallout_gear_table"
 * - Caps source of truth: localStorage "fallout_Caps"
 * - Vendor state + trade session persisted in localStorage (namespaced)
 * - Full inventory payloads preserved across trades (sourcePath, weight, addons,
 *   instanceId, Power Armor state, charged-core units, custom identity)
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

const TRADE_CATEGORIES = [
  { key: "ALL",        titlePlayer: "Player",  titleVendor: "Vendor" },
  { key: "WEAPONS",    title: "Weapons" },
  { key: "APPAREL",    title: "Apparel" },
  { key: "FOOD",       title: "Food" },
  { key: "CHEMS",      title: "Chems" },
  { key: "MISC",       title: "Misc." },
  { key: "AMMO",       title: "Ammo" },
];

// Prevent Obsidian from treating clicks as "editor clicks" (stops Source-mode flips)
// Prevent Obsidian from treating interactions as "editor clicks" (stops Source-mode flips)
// IMPORTANT: do NOT preventDefault for form controls, or typing/focus can break.
function swallowEditorPointer(e) {
  // Don't break right-click context menu
  if (e.button === 2) return;

  const t = e.target;

  const isFormControl =
    t instanceof HTMLInputElement ||
    t instanceof HTMLTextAreaElement ||
    t instanceof HTMLSelectElement ||
    (t && t.isContentEditable);

  // For inputs/textareas/etc: allow default (focus/typing), but stop Obsidian's delegated handlers.
  if (isFormControl) {
    e.stopPropagation();
    return;
  }

  // For everything else: stop + prevent default to avoid editor mode toggles.
  e.preventDefault();
  e.stopPropagation();
}

// Convenience: apply to an element
function guardObsidianClick(el) {
  if (!el || !el.addEventListener) return;
  el.addEventListener("pointerdown", swallowEditorPointer, true);
}



function categoryKeyFromPath(path) {
  const p = String(path || "");
  if (p.startsWith("Fallout-RPG/Items/Weapons")) return "WEAPONS";
  if (p.startsWith("Fallout-RPG/Items/Apparel")) return "APPAREL";
  if (p.startsWith("Fallout-RPG/Items/Consumables/Food")) return "FOOD";
  if (p.startsWith("Fallout-RPG/Items/Consumables/Beverages")) return "FOOD";
  if (p.startsWith("Fallout-RPG/Items/Consumables/Chems")) return "CHEMS";
  if (p.startsWith("Fallout-RPG/Items/Ammo")) return "AMMO";
  if (p.startsWith("Fallout-RPG/Perks/Book Perks")) return "MISC";
  if (p.startsWith("Fallout-RPG/Items/Tools and Utilities")) return "MISC";
  return "MISC";
}

(function blockTradeMenuHoverPreviewUnlessCtrl() {
  if (window.__tradeMenuHoverBlockInstalled) return;
  window.__tradeMenuHoverBlockInstalled = true;

  const isCtrlActive = (e) => !!(e && e.ctrlKey) || document.body.classList.contains("trade-menu-ctrl-held");

  const shouldBlock = (e) => {
    if (isCtrlActive(e)) return false;
    const t = e.target;
    if (!t || !(t instanceof Element)) return false;
    // Only within Trade Menu, only for internal links
    return !!t.closest(".trade-menu-root a.internal-link");
  };

  const block = (e) => {
    if (!shouldBlock(e)) return;
    // Stop Obsidian's delegated hover-preview handler
    e.preventDefault();
    e.stopPropagation();
    if (typeof e.stopImmediatePropagation === "function") e.stopImmediatePropagation();
  };

  // Obsidian hover preview is typically driven by mouseover/mousemove
  document.addEventListener("mouseover", block, true);
  document.addEventListener("mousemove", block, true);
})();


(function enableTradeMenuCtrlHeldClass() {
  if (window.__tradeMenuCtrlHookInstalled) return;
  window.__tradeMenuCtrlHookInstalled = true;

  const set = (on) => {
    document.body.classList.toggle("trade-menu-ctrl-held", !!on);
  };

  window.addEventListener("keydown", (e) => {
    if (e.key === "Control") set(true);
  }, true);

  window.addEventListener("keyup", (e) => {
    if (e.key === "Control") set(false);
  }, true);

  window.addEventListener("blur", () => set(false), true);
})();

(function enableInstantHoverPreviewOnCtrl() {
  if (window.__tradeMenuInstantPreviewInstalled) return;
  window.__tradeMenuInstantPreviewInstalled = true;

  let lastMouse = { x: null, y: null };

  document.addEventListener("pointermove", (e) => {
    lastMouse.x = e.clientX;
    lastMouse.y = e.clientY;
  }, true);

  document.addEventListener("mousemove", (e) => {
    lastMouse.x = e.clientX;
    lastMouse.y = e.clientY;
  }, true);

  function fireHoverNudge(el) {
    const x = lastMouse.x, y = lastMouse.y;

    // Try the common event set Obsidian might use
    const events = [
      new PointerEvent("pointerover", { bubbles: true, cancelable: true, clientX: x, clientY: y, pointerType: "mouse" }),
      new PointerEvent("pointermove", { bubbles: true, cancelable: true, clientX: x, clientY: y, pointerType: "mouse" }),
      new MouseEvent("mouseover", { bubbles: true, cancelable: true, clientX: x, clientY: y }),
      new MouseEvent("mousemove", { bubbles: true, cancelable: true, clientX: x, clientY: y }),
    ];

    for (const ev of events) el.dispatchEvent(ev);
  }

  window.addEventListener("keydown", (e) => {
    if (e.key !== "Control") return;

    if (lastMouse.x == null || lastMouse.y == null) return;

    const el = document.elementFromPoint(lastMouse.x, lastMouse.y);
    if (!el) return;

    const link = el.closest?.(".trade-menu-root a.internal-link");
    if (!link) return;

    // Nudge hover evaluation on the *link itself*
    fireHoverNudge(link);
  }, true);
})();

function renderCapsFlow({ net }) {
  const wrap = document.createElement("div");
  wrap.style.display = "flex";
  wrap.style.alignItems = "center";
  wrap.style.justifyContent = "center";
  wrap.style.gap = "10px";
  wrap.style.fontWeight = "800";
  wrap.style.fontSize = "1.1em";
  wrap.style.color = "#1aff80";

  if (net === 0) {
    wrap.textContent = "";
    return wrap;
  }

  const arrow = document.createElement("span");
  arrow.textContent = net > 0 ? "◀" : "▶";
  arrow.style.fontSize = "2.0em";

  const value = document.createElement("span");
  value.textContent = `${Math.abs(net)} Caps`;
  value.style.fontSize = "2.0em"

  wrap.append(arrow, value);
  return wrap;
}



// --- Trade item search (same folders as Gear table) ---
function createSearchBar({ fetchItems, onSelect }) {
    const wrapper = document.createElement('div');
    wrapper.style.marginBottom = "10px";
    wrapper.style.position = "relative"; // For dropdown positioning

    const input = document.createElement('input');
    input.type = "text";
    input.placeholder = "Search...";
    input.style.width = "100%";
    input.style.padding = "5px";
    input.style.backgroundColor = "#021509ad";
    input.style.borderTop = "1px solid #1AFF80"
    input.style.borderRight = "1px solid #1AFF80"
    input.style.borderLeft = "0px solid #1AFF80"
    input.style.borderBottom = "0px solid #1AFF80"
    input.style.color = "#1AFF80";
    input.style.borderRadius = "1px";
    input.style.caretColor = '#1AFF80';
    guardObsidianClick(input);
    wrapper.appendChild(input);

    const results = document.createElement('div');
    results.style.backgroundColor = "#021509";
    results.style.color = "#1AFF80";
    results.style.position = "absolute";
    results.style.left = 0;
    results.style.top = "110%";
    results.style.width = "100%";
    results.style.border = "1px solid #1AFF80";
    results.style.borderRadius = "0 0 6px 6px";
    results.style.boxShadow = "0 2px 6px #1AFF80";
    results.style.display = "none";
    results.style.maxHeight = "200px";
    results.style.overflowY = "auto";
    results.style.zIndex = 999;
    wrapper.appendChild(results);

    input.addEventListener('input', debounce(async () => {
        const query = input.value.toLowerCase();
        if (!query) {
            results.style.display = "none";
            results.innerHTML = "";
            return;
        }
        const items = await fetchItems();
        const matches = items.filter(item =>
            (item.name || item.link || "").toLowerCase().includes(query)
        );
        results.innerHTML = "";
        matches.forEach((item, i) => {
            const div = document.createElement('div');
            // Display: remove [[...]]
            let label = (item.name || item.link || "").replace(/\[\[(.*?)\]\]/g, "$1");
            div.textContent = label;
            div.style.cursor = "pointer";
            div.style.padding = "7px 12px";
            div.style.borderBottom = (i < matches.length - 1) ? "1px solid #1AFF80" : "";
            div.onmouseover = () => div.style.background = "#112618";
            div.onmouseout = () => div.style.background = "inherit";
            div.addEventListener("pointerdown", (e) => {
			  e.preventDefault();
			  e.stopPropagation();
			  // no stopImmediatePropagation
			  if (item && typeof item === "object" && (item.name || item.link)) {
			    onSelect({ ...item });
			  }
			  input.value = "";
			  results.style.display = "none";
			}, true);
            results.appendChild(div);
        });
        results.style.display = matches.length ? "block" : "none";
    }, 150));

    input.addEventListener('keydown', (e) => {
        if (e.key === "Escape") {
            results.style.display = "none";
            input.value = "";
        }
        if (e.key === "Enter") {
            let first = results.querySelector('div');
            if (first) first.click();
        }
    });

    input.addEventListener('focusout', (e) => {
	  const next = e.relatedTarget;
	  if (next && results.contains(next)) return; // keep open if focus moves to dropdown
	  setTimeout(() => { results.style.display = "none"; }, 150);
	});

    return wrapper;
}
const TRADE_SEARCH_FOLDERS = [
  "Fallout-RPG/Items/Apparel",
  "Fallout-RPG/Items/Consumables",
  "Fallout-RPG/Items/Tools and Utilities",
  "Fallout-RPG/Items/Weapons",
  "Fallout-RPG/Items/Ammo",
  "Fallout-RPG/Perks/Book Perks"
];

let cachedTradeSearchItems = null;

async function fetchTradeSearchItems() {
  if (cachedTradeSearchItems) return cachedTradeSearchItems;

  const allFiles = await app.vault.getFiles();
  const files = allFiles.filter(f => TRADE_SEARCH_FOLDERS.some(folder => f.path.startsWith(folder)));

  const items = await Promise.all(files.map(async (file) => {
    const content = await app.vault.read(file);

    let cost = "0";
    let weight = "0";
    const statblockMatch = content.match(/```statblock([\s\S]*?)```/);
    if (statblockMatch) {
      const block = statblockMatch[1].trim();
      const costMatch = block.match(/^\s*cost:\s*(.+)$/im);
      if (costMatch) cost = costMatch[1].trim().replace(/"/g, "");
      const weightMatch = block.match(/^\s*weight:\s*(.+)$/im);
      if (weightMatch) weight = weightMatch[1].trim().replace(/"/g, "");
    }

    return {
      name: `[[${file.basename}]]`,
      yamlName: file.basename,
      qty: "1",
      cost,
      weight,
      category: categoryKeyFromPath(file.path),
      sourcePath: file.path
    };
  }));

  cachedTradeSearchItems = items.filter(Boolean);
  return cachedTradeSearchItems;
}


/* ----------------------------- Small Utilities ----------------------------- */
function debounce(fn, wait = 150) {
  let t = null;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

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

const deepClone = (x) => JSON.parse(JSON.stringify(x));

function stripTradeWikiLink(value) {
  return String(value ?? "")
    .trim()
    .replace(/^\[\[/, "")
    .replace(/\]\]$/, "")
    .trim();
}

function makeTradeInstanceId(prefix = "trade") {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

function getTradeCoreType(item) {
  const name = stripTradeWikiLink(item?.name || item?.yamlName || "").toLowerCase();
  const path = String(item?.sourcePath || item?.path || "").toLowerCase();

  if (name === "fusion core" || /\/fusion core\.md$/.test(path)) return "fusion";
  if (name === "plasma core" || /\/plasma core\.md$/.test(path)) return "plasma";
  return null;
}

function isTradeCore(item) {
  return !!getTradeCoreType(item);
}

function hasTradeAddons(item) {
  return Array.isArray(item?.addons) && item.addons.length > 0;
}

function isTradeUniqueRecord(item) {
  return !!String(item?.instanceId || "").trim()
    || hasTradeAddons(item)
    || !!item?.powerArmorState;
}

function getTradeBaseIdentity(item) {
  const source = String(item?.sourcePath || item?.path || item?.yamlName || "")
    .trim()
    .toLowerCase();
  const name = normalizeNameKey(item?.name || item?.link || item?.yamlName || "");
  const category = String(item?.category || "").trim().toUpperCase();
  return `${source}::${name}::${category}`;
}

function getTradeItemId(item, coreUnit = null) {
  const unitId = String(coreUnit?.instanceId || "").trim();
  if (unitId) return `core::${unitId}`;

  const instanceId = String(item?.instanceId || "").trim();
  if (instanceId) return `instance::${instanceId}`;

  return `stack::${getTradeBaseIdentity(item)}`;
}

function getTradeBaseCost(item) {
  return Math.max(0, parseCapsInt(item?.baseCost ?? item?.cost, 0));
}

function makeCoreUnit(coreType, charges, maxCharges = null) {
  const instanceId = makeTradeInstanceId("core");

  if (coreType === "fusion") {
    const max = Math.max(1, parseCapsInt(maxCharges, 100));
    const cur = clampInt(parseCapsInt(charges, max), 0, max);
    return {
      instanceId,
      charges: cur,
      maxCharges: max,
      weaponShotsRemaining: cur * 50
    };
  }

  const cur = clampInt(parseCapsInt(charges, 500), 0, 500);
  return { instanceId, charges: cur };
}

function ensureTradeRecordIds(rows) {
  let changed = false;
  const coreIds = new Set();

  for (const row of (Array.isArray(rows) ? rows : [])) {
    if (isTradeCore(row)) {
      if (!Array.isArray(row.chargeUnits)) row.chargeUnits = [];

      for (const unit of row.chargeUnits) {
        if (!unit || typeof unit !== "object") continue;

        let id = String(unit.instanceId || "").trim();
        if (!id || coreIds.has(id)) {
          id = makeTradeInstanceId("core");
          unit.instanceId = id;
          changed = true;
        }
        coreIds.add(id);
      }

      const qty = String(row.chargeUnits.length);
      if (String(row.qty ?? "") !== qty) {
        row.qty = qty;
        changed = true;
      }
      continue;
    }

    if ((hasTradeAddons(row) || row?.powerArmorState) && !String(row.instanceId || "").trim()) {
      row.instanceId = makeTradeInstanceId("inv");
      row.qty = "1";
      changed = true;
    }
  }

  return changed;
}

function getLoadedCoreIds() {
  const ids = new Set();

  try {
    const weapons = safeJsonParse(localStorage.getItem("fallout_weapon_table") || "[]", []);
    for (const weapon of (Array.isArray(weapons) ? weapons : [])) {
      const id = String(weapon?.loadedCore?.instanceId || "").trim();
      if (id) ids.add(id);
    }
  } catch {}

  return ids;
}

function getTradeDisplayName(payload, coreUnit = null) {
  const baseName = String(
    payload?.name ||
    payload?.link ||
    (payload?.yamlName ? `[[${payload.yamlName}]]` : "Item")
  );

  if (coreUnit) {
    const coreType = getTradeCoreType(payload);
    const current = Math.max(0, Number(coreUnit?.charges ?? 0) || 0);
    const max = coreType === "plasma"
      ? 500
      : Math.max(0, Number(coreUnit?.maxCharges ?? 0) || 0);
    return `${baseName} — ${current}/${max}`;
  }

  const addons = Array.isArray(payload?.addons) ? payload.addons : [];
  if (addons.length) {
    return `${baseName} — ${addons.length} mod${addons.length === 1 ? "" : "s"}`;
  }

  const state = payload?.powerArmorState;
  if (state && typeof state === "object") {
    const cur = state.currentHP ?? state.hp ?? null;
    const max = state.maxHP ?? state.maxHp ?? null;
    if (cur !== null && max !== null) return `${baseName} — HP ${cur}/${max}`;
    if (cur !== null) return `${baseName} — HP ${cur}`;
  }

  return baseName;
}

function normalizePayloadForTrade(item) {
  const copy = deepClone(item || {});

  copy.name = String(
    copy.name ||
    copy.link ||
    (copy.yamlName ? `[[${copy.yamlName}]]` : "")
  ).trim();

  if (!copy.sourcePath && copy.path) copy.sourcePath = copy.path;
  if (!copy.category) copy.category = categoryKeyFromPath(copy.sourcePath || "");
  if (copy.baseCost === undefined) copy.baseCost = getTradeBaseCost(copy);

  return copy;
}

function collapseTradeItems(items) {
  const out = new Map();

  for (const item of items) {
    const existing = out.get(item.id);

    if (!existing) {
      out.set(item.id, item);
      continue;
    }

    existing.qty += item.qty;
    if (!existing.category && item.category) existing.category = item.category;
    if (!existing.baseCost && item.baseCost) existing.baseCost = item.baseCost;
  }

  return Array.from(out.values());
}

function inventoryRecordToTradeItems(record, { excludeLoadedCores = false } = {}) {
  const payload = normalizePayloadForTrade(record);
  const coreType = getTradeCoreType(payload);

  if (coreType) {
    const loadedIds = excludeLoadedCores ? getLoadedCoreIds() : new Set();
    const units = Array.isArray(payload.chargeUnits) ? payload.chargeUnits : [];
    const out = [];

    for (const unit of units) {
      const unitId = String(unit?.instanceId || "").trim();
      if (!unitId || loadedIds.has(unitId)) continue;

      const unitPayload = deepClone(payload);
      delete unitPayload.instanceId;
      unitPayload.chargeUnits = [deepClone(unit)];
      unitPayload.qty = "1";

      out.push({
        id: getTradeItemId(unitPayload, unit),
        name: unitPayload.name,
        displayName: getTradeDisplayName(unitPayload, unit),
        qty: 1,
        baseCost: getTradeBaseCost(unitPayload),
        category: String(unitPayload.category || ""),
        payload: unitPayload,
        unique: true,
        coreUnitId: unitId
      });
    }

    return out;
  }

  const qty = Math.max(0, parseCapsInt(payload.qty, 0));
  if (qty <= 0) return [];

  const unique = isTradeUniqueRecord(payload);

  return [{
    id: getTradeItemId(payload),
    name: payload.name,
    displayName: getTradeDisplayName(payload),
    qty: unique ? 1 : qty,
    baseCost: getTradeBaseCost(payload),
    category: String(payload.category || ""),
    payload,
    unique
  }];
}

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
    border-radius:2px;
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
    setTimeout(() => {
      input.focus();
      input.select();
    }, 0);
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

async function promptTradeCoreState(coreType) {
  const isFusion = coreType === "fusion";

  if (isFusion) {
    const maxCharges = await promptQty({
      title: "Fusion Core maximum charge",
      min: 1,
      max: 9999,
      initial: 100
    });
    if (maxCharges === null) return null;

    const charges = await promptQty({
      title: "Fusion Core current charge",
      min: 0,
      max: maxCharges,
      initial: maxCharges
    });
    if (charges === null) return null;

    return { charges, maxCharges };
  }

  const charges = await promptQty({
    title: "Plasma Core current charge",
    min: 0,
    max: 500,
    initial: 500
  });
  if (charges === null) return null;

  return { charges, maxCharges: 500 };
}

function makeSearchPayloadWithQuantity(item, qty, coreState = null) {
  const payload = normalizePayloadForTrade(item);
  const count = Math.max(0, parseCapsInt(qty, 0));
  payload.qty = String(count);

  const coreType = getTradeCoreType(payload);
  if (coreType) {
    payload.chargeUnits = [];

    for (let i = 0; i < count; i++) {
      payload.chargeUnits.push(
        makeCoreUnit(coreType, coreState?.charges, coreState?.maxCharges)
      );
    }

    payload.qty = String(payload.chargeUnits.length);
  }

  return payload;
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
  const arr = Array.isArray(rows) ? rows : [];

  if (ensureTradeRecordIds(arr)) {
    localStorage.setItem(GEAR_KEY, JSON.stringify(arr));
  }

  return arr;
}

function saveGearRows(rows) {
  ensureTradeRecordIds(rows);
  localStorage.setItem(GEAR_KEY, JSON.stringify(rows));
  window.dispatchEvent(new CustomEvent("fallout:gear-updated"));
}

function loadVendorState(vendorId) {
  const raw = localStorage.getItem(keyVendorState(vendorId));
  const st = safeJsonParse(raw || "null", null);

  if (st && typeof st === "object" && Array.isArray(st.inventory)) {
    if (ensureTradeRecordIds(st.inventory)) {
      localStorage.setItem(keyVendorState(vendorId), JSON.stringify(st));
    }
    return st;
  }

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

  if (s && typeof s === "object" && s.vendorId === vendorId) {
    // --- FIX: refresh tradeCaps from the character sheet on page load ---
    if (!s.player || typeof s.player !== "object") s.player = {};
    s.player.tradeCaps = loadPlayerCaps();   // always sync to sheet caps on load
    saveSession(vendorId, s);                // persist the refreshed value
    return s;
  }

  return {
    version: 1,
    vendorId,
    startedAt: new Date().toISOString(),
    player: {
	  tradeCaps: loadPlayerCaps(),
	  pooledItems: [] // manual items pooled from other players for this trade session
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
	  playerCatIndex: 0,
	  vendorCatIndex: 0,
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
  const out = [];

  for (const row of (Array.isArray(gearRows) ? gearRows : [])) {
    out.push(...inventoryRecordToTradeItems(row, { excludeLoadedCores: true }));
  }

  return collapseTradeItems(out);
}

function vendorStateToItems(vendorState) {
  const inv = Array.isArray(vendorState?.inventory) ? vendorState.inventory : [];
  const out = [];

  for (const raw of inv) {
    const record = normalizePayloadForTrade(raw);

    if (record.cost === undefined || String(record.cost).trim() === "") {
      record.cost = String(getTradeBaseCost(record));
    }

    out.push(...inventoryRecordToTradeItems(record));
  }

  return collapseTradeItems(out);
}

function pooledItemsToItems(pooled) {
  const arr = Array.isArray(pooled) ? pooled : [];
  const out = [];

  for (const raw of arr) {
    const record = normalizePayloadForTrade(raw);

    if (record.cost === undefined || String(record.cost).trim() === "") {
      record.cost = String(getTradeBaseCost(record));
    }

    out.push(...inventoryRecordToTradeItems(record));
  }

  return collapseTradeItems(out);
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

function mergeTradePayloadIntoInventory(rows, payload, qty = 1) {
  const copy = normalizePayloadForTrade(payload);
  const coreType = getTradeCoreType(copy);

  if (coreType) {
    const incomingUnits = Array.isArray(copy.chargeUnits) ? deepClone(copy.chargeUnits) : [];
    if (!incomingUnits.length) return;

    let target = rows.find(r =>
      isTradeCore(r) &&
      getTradeBaseIdentity(r) === getTradeBaseIdentity(copy)
    );

    if (!target) {
      target = deepClone(copy);
      delete target.instanceId;
      target.chargeUnits = [];
      target.qty = "0";
      target.selected = false;
      rows.push(target);
    }

    if (!Array.isArray(target.chargeUnits)) target.chargeUnits = [];

    const knownIds = new Set(
      target.chargeUnits.map(unit => String(unit?.instanceId || "").trim()).filter(Boolean)
    );

    for (const unit of incomingUnits) {
      let id = String(unit?.instanceId || "").trim();

      if (!id || knownIds.has(id)) {
        id = makeTradeInstanceId("core");
        unit.instanceId = id;
      }

      knownIds.add(id);
      target.chargeUnits.push(unit);
    }

    target.qty = String(target.chargeUnits.length);
    return;
  }

  if (isTradeUniqueRecord(copy)) {
    const incoming = deepClone(copy);
    incoming.qty = "1";
    incoming.selected = false;

    let id = String(incoming.instanceId || "").trim();
    if (!id || rows.some(r => String(r?.instanceId || "").trim() === id)) {
      incoming.instanceId = makeTradeInstanceId("inv");
    }

    rows.push(incoming);
    return;
  }

  const identity = getTradeBaseIdentity(copy);
  let existing = rows.find(r =>
    !isTradeCore(r) &&
    !isTradeUniqueRecord(r) &&
    getTradeBaseIdentity(r) === identity
  );

  if (!existing) {
    existing = deepClone(copy);
    existing.qty = "0";
    existing.selected = false;
    rows.push(existing);
  }

  existing.qty = String(
    Math.max(0, parseCapsInt(existing.qty, 0)) +
    Math.max(0, parseCapsInt(qty, 0))
  );
}

function removeTradePayloadFromInventory(rows, payload, qty = 1) {
  const copy = normalizePayloadForTrade(payload);
  const coreType = getTradeCoreType(copy);

  if (coreType) {
    const ids = new Set(
      (Array.isArray(copy.chargeUnits) ? copy.chargeUnits : [])
        .map(unit => String(unit?.instanceId || "").trim())
        .filter(Boolean)
    );

    for (let i = rows.length - 1; i >= 0; i--) {
      const row = rows[i];
      if (!isTradeCore(row)) continue;
      if (!Array.isArray(row.chargeUnits)) row.chargeUnits = [];

      row.chargeUnits = row.chargeUnits.filter(
        unit => !ids.has(String(unit?.instanceId || "").trim())
      );

      row.qty = String(row.chargeUnits.length);
      if (row.chargeUnits.length === 0) rows.splice(i, 1);
    }

    return;
  }

  if (isTradeUniqueRecord(copy)) {
    const instanceId = String(copy.instanceId || "").trim();
    let idx = -1;

    if (instanceId) {
      idx = rows.findIndex(r => String(r?.instanceId || "").trim() === instanceId);
    }

    if (idx < 0) {
      const identity = getTradeBaseIdentity(copy);
      idx = rows.findIndex(r =>
        isTradeUniqueRecord(r) &&
        getTradeBaseIdentity(r) === identity
      );
    }

    if (idx >= 0) rows.splice(idx, 1);
    return;
  }

  const identity = getTradeBaseIdentity(copy);
  let remaining = Math.max(0, parseCapsInt(qty, 0));

  for (let i = rows.length - 1; i >= 0 && remaining > 0; i--) {
    const row = rows[i];

    if (isTradeCore(row) || isTradeUniqueRecord(row)) continue;
    if (getTradeBaseIdentity(row) !== identity) continue;

    const current = Math.max(0, parseCapsInt(row.qty, 0));
    const take = Math.min(current, remaining);
    const next = current - take;
    remaining -= take;

    if (next <= 0) rows.splice(i, 1);
    else row.qty = String(next);
  }
}

function mergeTradePayloadIntoVendor(vendorInv, payload, qty = 1) {
  const copy = normalizePayloadForTrade(payload);
  copy.baseCost = getTradeBaseCost(copy);

  mergeTradePayloadIntoInventory(vendorInv, copy, qty);

  for (const row of vendorInv) {
    if (
      getTradeBaseIdentity(row) === getTradeBaseIdentity(copy) ||
      (
        String(copy.instanceId || "").trim() &&
        String(row?.instanceId || "").trim() === String(copy.instanceId || "").trim()
      )
    ) {
      row.baseCost = getTradeBaseCost(row) || getTradeBaseCost(copy);
    }
  }
}

function removeTradePayloadFromVendor(vendorInv, payload, qty = 1) {
  removeTradePayloadFromInventory(vendorInv, payload, qty);
}

function makeLegacyPayload(name, baseCostInt, categoryKey, extra = null) {
  const payload = normalizePayloadForTrade(extra || {});
  payload.name = String(payload.name || name || "").trim();
  payload.category = String(payload.category || categoryKey || "MISC");
  payload.cost = String(Math.max(0, parseCapsInt(payload.cost ?? baseCostInt, 0)));
  payload.baseCost = Math.max(0, parseCapsInt(baseCostInt ?? payload.cost, 0));
  if (!payload.qty) payload.qty = "1";
  return payload;
}

function upsertGearRow(gearRows, name, qtyDelta, costInt, categoryKey, payload = null) {
  const record = makeLegacyPayload(name, costInt, categoryKey, payload);

  if (qtyDelta >= 0) mergeTradePayloadIntoInventory(gearRows, record, qtyDelta);
  else removeTradePayloadFromInventory(gearRows, record, Math.abs(qtyDelta));
}

function upsertVendorInv(vendorInv, name, qtyDelta, baseCostInt, categoryKey, payload = null) {
  const record = makeLegacyPayload(name, baseCostInt, categoryKey, payload);

  if (qtyDelta >= 0) mergeTradePayloadIntoVendor(vendorInv, record, qtyDelta);
  else removeTradePayloadFromVendor(vendorInv, record, Math.abs(qtyDelta));
}

function consumeFromPooled(pooledItems, itemName, qtyToConsume) {
  if (!Array.isArray(pooledItems) || qtyToConsume <= 0) return 0;

  const key = normalizeNameKey(itemName);
  const idx = pooledItems.findIndex(x => normalizeNameKey(x?.name) === key);
  if (idx < 0) return 0;

  const cur = Math.max(0, parseCapsInt(pooledItems[idx].qty, 0));
  const take = Math.min(cur, qtyToConsume);
  const next = cur - take;

  if (next <= 0) pooledItems.splice(idx, 1);
  else pooledItems[idx].qty = next;

  return take; // amount actually consumed
}


function upsertPooledInv(pooledInv, name, qtyDelta, baseCostInt, categoryKey, payload = null) {
  const record = makeLegacyPayload(name, baseCostInt, categoryKey, payload);

  if (qtyDelta >= 0) mergeTradePayloadIntoInventory(pooledInv, record, qtyDelta);
  else removeTradePayloadFromInventory(pooledInv, record, Math.abs(qtyDelta));
}

function applyConfirm({ vendorId, session, vendorState }) {
  const gearRows = loadGearRows();
  const playerBaseItems = gearToTradeItems(gearRows);
  const vendorBaseItems = vendorStateToItems(vendorState);
  const pooledItems = pooledItemsToItems(session.player.pooledItems);

  const itemsById = new Map();

  for (const it of [...playerBaseItems, ...vendorBaseItems, ...pooledItems]) {
    const cur = itemsById.get(it.id);

    if (!cur) {
      itemsById.set(it.id, it);
      continue;
    }

    if (!cur.category && it.category) cur.category = it.category;
    if (!cur.baseCost && it.baseCost) cur.baseCost = it.baseCost;
    if (!cur.payload && it.payload) cur.payload = it.payload;
  }

  const pending = getPendingQty(session);
  const totals = computeTotals({ itemsById, pending, pricing: session.pricing });

  const storedCaps = loadPlayerCaps();
  const effectiveCaps = Math.max(0, parseCapsInt(session.player.tradeCaps, storedCaps));

  if (effectiveCaps < totals.buyTotal) {
    return { ok: false, reason: "Player does not have enough caps." };
  }

  const playerQty = new Map();
  for (const it of playerBaseItems) {
    playerQty.set(it.id, (playerQty.get(it.id) || 0) + it.qty);
  }

  const vendorQty = new Map();
  for (const it of vendorBaseItems) {
    vendorQty.set(it.id, (vendorQty.get(it.id) || 0) + it.qty);
  }

  const pooledQty = new Map();
  for (const it of pooledItems) {
    pooledQty.set(it.id, (pooledQty.get(it.id) || 0) + it.qty);
  }

  for (const [itemId, qtyRaw] of Object.entries(pending.buy)) {
    const qty = Math.max(0, parseCapsInt(qtyRaw, 0));
    if (qty > Math.max(0, parseCapsInt(vendorQty.get(itemId), 0))) {
      return { ok: false, reason: "Vendor inventory changed. Please restage the trade." };
    }
  }

  for (const [itemId, qtyRaw] of Object.entries(pending.sell)) {
    const qty = Math.max(0, parseCapsInt(qtyRaw, 0));
    const available =
      Math.max(0, parseCapsInt(playerQty.get(itemId), 0)) +
      Math.max(0, parseCapsInt(pooledQty.get(itemId), 0));

    if (qty > available) {
      return { ok: false, reason: "Player inventory changed. Please restage the trade." };
    }
  }

  const vendorCapsStart = Math.max(0, parseCapsInt(vendorState.caps, 0));
  const vendorPayout = Math.min(vendorCapsStart, totals.sellTotal);

  const playerCapsEnd = Math.max(0, effectiveCaps - totals.buyTotal + vendorPayout);
  const vendorCapsEnd = Math.max(0, vendorCapsStart + totals.buyTotal - vendorPayout);

  for (const [itemId, qtyRaw] of Object.entries(pending.buy)) {
    const qty = Math.max(0, parseCapsInt(qtyRaw, 0));
    if (!qty) continue;

    const it = itemsById.get(itemId);
    if (!it?.payload) continue;

    mergeTradePayloadIntoInventory(gearRows, it.payload, qty);
    removeTradePayloadFromVendor(vendorState.inventory, it.payload, qty);
  }

  for (const [itemId, qtyRaw] of Object.entries(pending.sell)) {
    const qty = Math.max(0, parseCapsInt(qtyRaw, 0));
    if (!qty) continue;

    const it = itemsById.get(itemId);
    if (!it?.payload) continue;

    if (!Array.isArray(session.player.pooledItems)) session.player.pooledItems = [];

    let remaining = qty;
    const fromPool = Math.min(
      remaining,
      Math.max(0, parseCapsInt(pooledQty.get(itemId), 0))
    );

    if (fromPool > 0) {
      removeTradePayloadFromInventory(session.player.pooledItems, it.payload, fromPool);
      remaining -= fromPool;
    }

    if (remaining > 0) {
      removeTradePayloadFromInventory(gearRows, it.payload, remaining);
    }

    mergeTradePayloadIntoVendor(vendorState.inventory, it.payload, qty);
  }

  savePlayerCaps(playerCapsEnd);
  session.player.tradeCaps = playerCapsEnd;
  saveGearRows(gearRows);

  vendorState.caps = vendorCapsEnd;
  vendorState.lastBuiltAt = nowMs();
  saveVendorState(vendorId, vendorState);

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

function upsertPooledItem(items, name, qty, baseCost, payload = null) {
  upsertPooledInv(
    items,
    name,
    Math.max(0, parseCapsInt(qty, 0)),
    baseCost,
    payload?.category,
    payload
  );
}

function getKnownItemCandidates({ vendorState, session }) {
  const out = new Map();

  const add = (record) => {
    if (!record) return;

    const payload = normalizePayloadForTrade(record);
    const key = getTradeBaseIdentity(payload);
    if (!key) return;

    if (!out.has(key)) {
      out.set(key, {
        name: payload.name,
        baseCost: getTradeBaseCost(payload),
        category: payload.category || "",
        payload
      });
    }
  };

  const gear = safeJsonParse(localStorage.getItem(GEAR_KEY) || "[]", []);
  if (Array.isArray(gear)) for (const row of gear) add(row);

  const pooled = Array.isArray(session?.player?.pooledItems) ? session.player.pooledItems : [];
  for (const row of pooled) add(row);

  const inv = Array.isArray(vendorState?.inventory) ? vendorState.inventory : [];
  for (const row of inv) add(row);

  return Array.from(out.values());
}

function wireAddOnlySearch({
  input,
  which, // "player" | "vendor"
  getSession,
  getVendorState,
  onAdded // callback to save + render
}) {
  input.placeholder = "Add item…";
  input.value = "";
  input.autocomplete = "off";

  const wrap = input.parentElement || input;

  const dd = document.createElement("div");
  dd.style.cssText = `
    position:absolute;
    left:0; right:0;
    bottom:44px;
    z-index:9999;
    max-height:220px;
    overflow:auto;
    border-radius:10px;
    border:1px solid rgba(255,194,0,0.20);
    background:rgba(20,28,38,0.98);
    display:none;
  `;
  // ensure positioning context
  if (wrap instanceof HTMLElement) {
    const st = getComputedStyle(wrap);
    if (st.position === "static") wrap.style.position = "relative";
    wrap.appendChild(dd);
  }

  const close = () => { dd.style.display = "none"; dd.innerHTML = ""; };

  const addByCandidate = (cand) => {
    const session = getSession();
    const vendorState = getVendorState();

    if (which === "vendor") {
      const inv = Array.isArray(vendorState.inventory) ? vendorState.inventory : [];
      upsertVendorInv(inv, cand.name, 1, cand.baseCost, cand.category, cand.payload);
      vendorState.inventory = inv;
    } else {
      const pooled = Array.isArray(session.player.pooledItems) ? session.player.pooledItems : [];
      upsertPooledItem(pooled, cand.name, 1, cand.baseCost, cand.payload);
      session.player.pooledItems = pooled;
    }

    input.value = "";
    close();
    onAdded();
  };

  const renderDD = () => {
    const q = normalizeNameKey(input.value);
    dd.innerHTML = "";

    if (!q) { close(); return; }

    const session = getSession();
    const vendorState = getVendorState();
    const candidates = getKnownItemCandidates({ vendorState, session })
      .filter(c => normalizeNameKey(c.name).includes(q))
      .slice(0, 12);

    if (!candidates.length) { close(); return; }

    for (const c of candidates) {
      const row = document.createElement("div");
      row.style.cssText = `
        padding:8px 10px;
        cursor:pointer;
        border-bottom:1px solid rgba(255,194,0,0.10);
        color:#efdd6f;
        font-weight:bold;
        display:flex;
        justify-content:space-between;
        gap:10px;
      `;
      const left = document.createElement("div");
      left.textContent = c.name;

      const right = document.createElement("div");
      right.textContent = c.baseCost;
      right.style.cssText = `color:#ffc200; font-weight:bold;`;

      row.append(left, right);

      row.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        addByCandidate(c);
      });

      dd.appendChild(row);
    }

    dd.style.display = "block";
  };

  input.addEventListener("input", renderDD);

  input.addEventListener("keydown", async (e) => {
    if (e.key === "Escape") {
      close();
      return;
    }

    if (e.key !== "Enter") return;

    e.preventDefault();

    const session = getSession();
    const vendorState = getVendorState();
    const candidates = getKnownItemCandidates({ vendorState, session });

    const typed = String(input.value || "").trim();
    if (!typed) return;

    const k = normalizeNameKey(typed);
    const match = candidates.find(c => normalizeNameKey(c.name) === k);

    if (match) {
      addByCandidate(match);
      return;
    }

    // Not found → manual add prompt (qty + baseCost)
    const it = await promptVendorItem({
      title: which === "vendor" ? "Add Vendor Item" : "Add Player Pooled Item",
      defaultName: typed,
      defaultQty: 1,
      defaultCost: ""
    });
    if (!it) return;

    if (which === "vendor") {
      const inv = Array.isArray(vendorState.inventory) ? vendorState.inventory : [];
      upsertVendorInv(inv, it.name, +it.qty, it.baseCost, it.category, it.payload);
      vendorState.inventory = inv;
    } else {
      const pooled = Array.isArray(session.player.pooledItems) ? session.player.pooledItems : [];
      upsertPooledItem(pooled, it.name, +it.qty, it.baseCost, it.payload);
      session.player.pooledItems = pooled;
    }

    input.value = "";
    close();
    onAdded();
  });

  document.addEventListener("click", (e) => {
    if (e.target === input) return;
    if (dd.contains(e.target)) return;
    close();
  });
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
  `;

  // --- Top Toolbar ---
  const toolbar = document.createElement("div");
  toolbar.style.cssText = `
    display:flex;
    justify-content:space-between;
    align-items:center;
    gap:10px;
    background:#021509ad;
    border-top: 2px solid #1AFF80;
    border-left: 2px solid #1AFF80;
    border-right: 2px solid #1AFF80;
    border-radius:2px;
    padding:10px 10px;
    flex-wrap:wrap;
  `;

  const leftTools = document.createElement("div");
  leftTools.style.cssText = `display:flex; gap:8px; align-items:center; flex-wrap:wrap;`;

  const rightTools = document.createElement("div");
  rightTools.style.cssText = `display:flex; gap:8px; align-items:center; flex-wrap:wrap;`;

  const vendorIdLabel = document.createElement("span");
  vendorIdLabel.textContent = "Vendor:";
  vendorIdLabel.style.cssText = `color:#1AFF80;font-weight:bold;`;

  const vendorIdInput = document.createElement("input");
  vendorIdInput.value = "default_vendor";
  vendorIdInput.style.cssText = `
    width:220px;
    background:#021509ad; color:#1AFF80;
    border-top:1px solid #1AFF80;
    border-right:1px solid #1AFF80;
    border-bottom:0px solid #1AFF80;
    border-left:0px solid #1AFF80;
    border-radius:2px;
    padding:6px 8px;
  `;

  const exportBtn = makeBtn("Export", { background: "#021509ad", color: "#1AFF80", border: "1px solid #1AFF80" });
  const importBtn = makeBtn("Import", { background: "#021509ad", color: "#1AFF80", border: "1px solid #1AFF80" });
  const clearBtn  = makeBtn("Clear",  { background: "#021509ad", color: "#1AFF80", border: "1px solid #1AFF80" });

  leftTools.append(vendorIdLabel, vendorIdInput);
  rightTools.append(exportBtn, importBtn, clearBtn);
  toolbar.append(leftTools, rightTools);

  // --- Main Columns Frame ---
  const cols = document.createElement("div");
  cols.style.cssText = `
    width:100%;
    display:grid;
    grid-template-columns: 1fr 1fr;

  `;

  // Column card styles
  const makeCard = () => {
    const c = document.createElement("div");
    c.style.cssText = `
      background:#021509ad;
      border-radius:2px;
      padding:10px;
      display:flex;
      flex-direction:column;
      gap:8px;
      min-height:520px;
      height:650px
    `;
    return c;
  };

  const playerCard = makeCard();
  const vendorCard = makeCard();
  
  let vendorId = String(vendorIdInput.value || "default_vendor").trim() || "default_vendor";
  let vendorState = loadVendorState(vendorId);
  let session = loadSession(vendorId);
  
  function removeVendorStackByItemId(itemId) {
    const tradeItems = vendorStateToItems(vendorState);
    const item = tradeItems.find(it => it.id === itemId);
    if (!item?.payload) return 0;

    const amount = Math.max(1, parseCapsInt(item.qty, 1));

    removeTradePayloadFromVendor(
      vendorState.inventory,
      item.payload,
      item.unique ? 1 : amount
    );

    if (session?.pending?.buy?.[itemId]) {
      delete session.pending.buy[itemId];
    }

    saveVendorState(vendorId, vendorState);
    saveSession(vendorId, session);

    return 1;
  }

  function makeCategoryHeader({ side }) {
    const wrap = document.createElement("div");
    wrap.style.cssText = `
      display:flex;
      align-items:center;
      gap:5px;
      font-weight:normal;
      color:#1AFF80;
      user-select:none;
      margin-left: 15px
    `;

    const left = document.createElement("div");
    left.textContent = "◀";
    left.style.cssText = `cursor:pointer;`;

    const title = document.createElement("div");
    title.style.cssText = `
      min-width:60px;
      text-align:center;
      font-size:large;
    `;

    const right = document.createElement("div");
    right.textContent = "▶";
    right.style.cssText = `cursor:pointer;`;

	guardObsidianClick(wrap);
	guardObsidianClick(left);
	guardObsidianClick(title);
	guardObsidianClick(right);

    const getIdx = () =>
      side === "player"
        ? (session.ui?.playerCatIndex ?? 0)
        : (session.ui?.vendorCatIndex ?? 0);

    const setIdx = (v) => {
      if (!session.ui) session.ui = {};
      if (side === "player") session.ui.playerCatIndex = v;
      else session.ui.vendorCatIndex = v;
      saveSession(vendorId, session);
    };

    const refresh = () => {
      const idx = getIdx();
      const cat = TRADE_CATEGORIES[idx] || TRADE_CATEGORIES[0];

      if (cat.key === "ALL") {
        title.textContent = side === "player" ? "Player" : "Vendor";
      } else {
        title.textContent = cat.title;
      }
    };

    const cycle = (dir) => {
      const n = TRADE_CATEGORIES.length;
      let idx = getIdx();
      idx = (idx + dir + n) % n;
      setIdx(idx);
      refresh();
      render();
    };

    left.onclick = () => cycle(-1);
    right.onclick = () => cycle(1);

    wrap._refresh = refresh;
    wrap.append(left, title, right);
    refresh();
    return wrap;
  }


  // Header rows (caps in outer corners) + category arrows in title
  const makeHeaderRow = (align = "left") => {
    const row = document.createElement("div");
    row.style.cssText = `
      display:flex;
      justify-content:space-between;
      align-items:flex-start;
      gap:8px;
    `;

    const side = align === "left" ? "player" : "vendor";
    const title = makeCategoryHeader({ side });

    const capsWrap = document.createElement("div");
    capsWrap.style.cssText = `
      display:flex;
      flex-direction:column;
      align-items:${align === "left" ? "flex-end" : "flex-end"};
      gap:6px;
      min-width:220px;
    `;

    row.append(title, capsWrap);

    return { row, capsWrap, title };
  };



  const playerHeader = makeHeaderRow("left");
  const vendorHeader = makeHeaderRow("right");


  // Caps displays (click-to-edit + pooled toggle for player)
  const makeCapsWidget = ({ label, getValue, setValue, allowPool = false, getPool, setPool }) => {
    const wrap = document.createElement("div");
    wrap.style.cssText = `
      display:flex;
      flex-direction:column;
      gap:4px;
      border-radius:10px;
      padding:8px 10px;
    `;

    const top = document.createElement("div");
    top.style.cssText = `display:flex; align-items:center; justify-content:space-between; gap:10px;`;

    const lab = document.createElement("div");
    lab.textContent = label;
    lab.style.cssText = `color:#1AFF80; font-weight:normal; font-size:16px;`;

    const valSpan = document.createElement("span");
    valSpan.style.cssText = `color:#1AFF80; font-weight:normal; font-size:16px; cursor:pointer; text-align:right; min-width:70px;`;
    valSpan.title = "Click to edit";

    const valInput = document.createElement("input");
    valInput.type = "number";
    valInput.style.cssText = `display:none; width:80px; text-align:center; background:#021509ad; color:#1AFF80; font-size:16px; border-radius:8px; border:1px solid rgba(0,0,0,0.25); padding:4px 6px;`;
	
    const setDisplay = (v) => {
      valSpan.textContent = String(Math.max(0, parseCapsInt(v, 0)));
    };

	guardObsidianClick(valSpan);
	guardObsidianClick(valInput);
	
    const enterEdit = () => {
      valInput.value = String(getValue());
      valSpan.style.display = "none";
      valInput.style.display = "inline-block";
      valInput.focus();
      valInput.select();
    };

    const exitEdit = (apply) => {
	  if (apply) {
	    const raw = String(valInput.value ?? "").trim();
	
	    // Vendor caps: blank resets to 0
	    const next = (raw === "" ? 0 : parseCapsInt(raw, getValue()));
	
	    setValue(next);
	  }
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
	  
	  guardObsidianClick(cb);
	  guardObsidianClick(pooledVal);
	  guardObsidianClick(pooledInput);
	  
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
	wrap._refresh = () => setDisplay(getValue());
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
      background:#021509ad;
      border-radius:2px;
      padding:8px 10px;
    `;

    const lab = document.createElement("div");
    lab.textContent = label;
    lab.style.cssText = `color:#1AFF80; font-weight:bold; font-size:12px;`;

    const input = document.createElement("input");
    input.type = "number";
    input.step = "0.01";
    input.min = "0";
    input.value = String(getValue());
    input.style.cssText = `width:90px; text-align:center; background:#021509ad; color:c0ffff; border-radius:2px; border-top:1px solid #1AFF80; border-right:1px solid #1AFF80; border-bottome:0px solid #1AFF80; border-left:0px solid #1AFF80; padding:4px 6px;`;
	
	guardObsidianClick(input);
	
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
      height:100%;
    `;

    const list = document.createElement("div");
	list.className = "trade-menu-scroll"
	list.style.cssText = `
	  display:flex;
	  flex-direction:column;
	  gap:4px;
	  overflow-y:auto;
	  flex:1 1 auto;
	  min-height:140px;
	  padding-right:6px;
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
    return { listWrap, list, searchInput: input, searchWrap };
  };

  const playerInvUI = makeInventoryList();
  const vendorInvUI = makeInventoryList();

  // Footer summary + actions
  const footer = document.createElement("div");
  footer.style.cssText = `
    width:100%;
    background:#021509ad;
    border-bottom:2px solid #1AFF80;
    border-left:2px solid #1AFF80;
    border-right:2px solid #1AFF80;
    border-radius:2px;
    padding:10px;
    display:flex;
    justify-content:space-between;
    align-items:center;
    gap:10px;
    flex-wrap:wrap;
    min-height: 70px
  `;

  const totalsLeft = document.createElement("div");
  totalsLeft.style.cssText = `display:flex; gap:14px; align-items:center; flex-wrap:wrap;`;

  const mkStat = (label) => {
    const w = document.createElement("div");
    w.style.cssText = `display:flex; gap:6px; align-items:center;`;
    const l = document.createElement("div");
    l.textContent = label;
    l.style.cssText = `color:#1AFF80; font-weight:bold; font-size:12px;`;
    const v = document.createElement("div");
    v.textContent = "0";
    v.style.cssText = `color:#1AFF80; font-weight:normal;`;
    w.append(l, v);
    return { w, v };
  };

  // Fallout-style: single net flow indicator (arrow + caps)
  const statFlow = document.createElement("div");
  statFlow.style.cssText = `
    display:flex;
    align-items:center;
    justify-content:right;
    min-width:180px;
    padding:4px 8px;
  `;

  const statWarn = document.createElement("div");
  statWarn.style.cssText = `color:#1AFF80; font-size:12px; opacity:0.9;`;

  totalsLeft.append(statFlow, statWarn);


  const actionsRight = document.createElement("div");
  actionsRight.style.cssText = `display:flex; gap:8px; align-items:center;`;

  const confirmBtn = makeBtn("Confirm", { background: "#021509ad", color: "#1AFF80", border: "1px solid #1AFF80"  });
  const cancelBtn = makeBtn("Cancel", { background: "#021509ad", color: "#1AFF80", border: "1px solid #1AFF80" });

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
	  font-size: 16px;
	  font-weight: normal;
      border-radius:10px;
      padding:8px 10px;
    `;

    const top = document.createElement("div");
    top.style.cssText = `display:flex; align-items:center; justify-content:space-between; gap:10px;`;

    const lab = document.createElement("div");
    lab.textContent = "Caps";
    lab.style.cssText = `color:#1AFF80; font-weight:normal; font-size:12px; font-size: 16px;`;

    const valSpan = document.createElement("span");
    valSpan.style.cssText = `color:#1AFF80; font-weight:normal; cursor:pointer; text-align:right; min-width:70px;`;
    valSpan.title = "Click to edit";

    const valInput = document.createElement("input");
    valInput.type = "number";
    valInput.style.cssText = `
      display:none;
      width:90px;
      text-align:center;
      background:#021509ad;
      color:#1AFF80;
      border-radius:8px;
      border:1px solid rgba(0,0,0,0.25);
      font-size: 16px;
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
	    const raw = String(valInput.value ?? "").trim();

	    // Player caps: blank resets to sheet caps
	    const fallback = loadPlayerCaps();
	    const next = (raw === "" ? fallback : parseCapsInt(raw, fallback));

	    session.player.tradeCaps = Math.max(0, next);
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
    min-height: 55px
  `;

  multipliersRow.appendChild(sellMultUI.wrap); // left = player sell
  multipliersRow.appendChild(buyMultUI.wrap);  // right = vendor buy
  appWrap.insertBefore(multipliersRow, footer);
  
  // --- Replace plain inputs with Gear-style add search (add-only) ---

  // PLAYER: selecting a result adds 1 to pooled items (manual pool bucket)
  let lastAddQtyPlayer = 1;
  let lastAddQtyVendor = 1;

  const playerSearchBar = createSearchBar({
    fetchItems: fetchTradeSearchItems,
    onSelect: async (item) => {
      const name = item.name || item.link;
      const baseCost = Math.max(0, parseCapsInt(item.cost, 0));

      const q = await promptQty({ title: "Add to Player", min: 1, max: 9999, initial: 1 });
      if (!q) return;

      let coreState = null;
      const coreType = getTradeCoreType(item);

      if (coreType) {
        coreState = await promptTradeCoreState(coreType);
        if (!coreState) return;
      }

      const payload = makeSearchPayloadWithQuantity(item, q, coreState);

      if (!Array.isArray(session.player.pooledItems)) session.player.pooledItems = [];
      mergeTradePayloadIntoInventory(session.player.pooledItems, payload, q);

      saveSession(vendorId, session);
      render();
    }
  });


  const vendorSearchBar = createSearchBar({
    fetchItems: fetchTradeSearchItems,
    onSelect: async (item) => {
      const name = item.name || item.link;
      const baseCost = Math.max(0, parseCapsInt(item.cost, 0));

      const q = await promptQty({ title: "Add to Vendor", min: 1, max: 9999, initial: 1 });
      if (!q) return;

      let coreState = null;
      const coreType = getTradeCoreType(item);

      if (coreType) {
        coreState = await promptTradeCoreState(coreType);
        if (!coreState) return;
      }

      const payload = makeSearchPayloadWithQuantity(item, q, coreState);
      mergeTradePayloadIntoVendor(vendorState.inventory, payload, q);

      saveVendorState(vendorId, vendorState);
      render();
    }
  });



  // Replace the old searchWrap UI with the new dropdown search bars
  playerInvUI.searchWrap.replaceWith(playerSearchBar);
  vendorInvUI.searchWrap.replaceWith(vendorSearchBar);

  
  // Vendor id change handling
  const switchVendor = () => {
    vendorId = String(vendorIdInput.value || "default_vendor").trim() || "default_vendor";
    vendorState = loadVendorState(vendorId);
    session = loadSession(vendorId);
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
  
  function appendObsidianLink(el, text) {
    const raw = String(text || "");
    el.textContent = ""; // we'll rebuild with nodes

    // Find all occurrences of [[Page]] or [[Page|Alias]]
    const re = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;

    let last = 0;
    let m;

    while ((m = re.exec(raw)) !== null) {
      const start = m.index;
      const end = re.lastIndex;

      // Leading plain text
      if (start > last) {
        el.appendChild(document.createTextNode(raw.slice(last, start)));
      }

      const target = (m[1] || "").trim();
      const alias = ((m[2] || m[1]) || "").trim();

      // Build an Obsidian internal-link anchor
      const a = document.createElement("a");
      a.className = "internal-link";
      a.textContent = alias;
      a.setAttribute("data-href", target);
      a.href = target;
      a.addEventListener("click", (e) => {
	    // Always prevent anchor default navigation
	    e.preventDefault();
	
	    // Only open the note when Ctrl is held
	    if (e.ctrlKey) {
	      e.stopPropagation(); // prevent the row click (trade action)
	      app.workspace.openLinkText(target, "", false);
	      return;
	   }
	
	  // If Ctrl is NOT held:
	  // do NOT stopPropagation so the row click continues to work (trade add/remove)
	});


      el.appendChild(a);

      last = end;
    }

    // Trailing plain text
    if (last < raw.length) {
      el.appendChild(document.createTextNode(raw.slice(last)));
    }
  }


  
  /* ----------------------------- Rendering --------------------------------- */

  function renderList({ which, listEl, items, basePlayerMap, baseVendorMap, itemsById }) {
    listEl.innerHTML = "";

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
      row.classList.add("trade-item-row");
      row.style.cssText = `
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:10px;
        padding:3px 10px;
        //margin-bottom:6px;
        cursor:pointer;
        user-select:none;
        font-size:larger;
      `;

      const left = document.createElement("div");
      left.style.cssText = `display:flex; gap:8px; align-items:center; min-width:0;`;

      const m = document.createElement("span");
      m.textContent = marker ? "⬛" : "";
      m.style.cssText = `width:16px; color:#1AFF80; font-weight:normal; font-size:16px;`;

      const nm = document.createElement("div");
	  nm.style.cssText = `color:#1AFF80; font-weight:normal; font-size:16px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:360px;`;
	
	  // Fallout-style: append (qty) only when qty > 1
	  const nameWithQty = (parseCapsInt(qty, 1) > 1) ? `${name} (${parseCapsInt(qty, 1)})` : name;
	
	  // Render [[Wiki Links]] as actual internal links (works with trailing text like " (7)")
	  appendObsidianLink(nm, nameWithQty);

      
      left.append(m, nm);

      const right = document.createElement("div");
      right.style.cssText = `display:flex; gap:10px; align-items:center;`;

      const costEl = document.createElement("div");
      costEl.textContent = rightText || String(baseCost);
      costEl.style.cssText = `color:#1AFF80; font-weight:normal; min-width:60px; text-align:right;`;
      right.append(costEl);

      row.append(left, right);

      return row;
    };

    const ids = Array.from(allIds);

    // Build derived rows
    const rows = [];
    for (const id of ids) {
      const it = itemsById.get(id);
      if (!it) continue;
	  
	  const idx = (which === "player") ? (session.ui?.playerCatIndex ?? 0) : (session.ui?.vendorCatIndex ?? 0);
	  const selectedKey = (TRADE_CATEGORIES[idx] || TRADE_CATEGORIES[0]).key;
	
	  // Strategy B means: uncategorized rows only show in ALL
	  const itemCat = String(it.category || "").trim();
	
	  if (selectedKey !== "ALL") {
	    if (itemCat !== selectedKey) continue; // hides BOTH base and ⬛ rows when filtering
	  }

	  
      const { pb, ps } = getProjectedQtyForItem({
	    itemId: id,
	    basePlayerMap,
	    baseVendorMap,
	    pending
	  });
	
	  // Base quantities (no pending merged in)
	  const baseQtyPlayer = Math.max(0, parseCapsInt(basePlayerMap.get(id) ?? 0, 0));
	  const baseQtyVendor = Math.max(0, parseCapsInt(baseVendorMap.get(id) ?? 0, 0));
	
	  const isPlayerList = (which === "player");
	
	  // Pending IN to this list (destination marker rows)
	  const pendingIn = isPlayerList ? Math.max(0, parseCapsInt(pending.buy[id] ?? 0, 0))
	                               : Math.max(0, parseCapsInt(pending.sell[id] ?? 0, 0));
	
	  // Pending OUT from this list (so source side decreases)
	  const pendingOut = isPlayerList ? Math.max(0, parseCapsInt(pending.sell[id] ?? 0, 0))
	                                : Math.max(0, parseCapsInt(pending.buy[id] ?? 0, 0));
	
	  // Base displayed qty should reflect pending OUT only (Fallout behavior: item leaves source list as you stage trade)
	  const baseDisplayQty = Math.max(0, (isPlayerList ? baseQtyPlayer : baseQtyVendor) - pendingOut);
	  
	  // Unit price display rules: pending-in uses negotiated price; base uses base cost
	  const unitBase = it.baseCost;
	  const unitPending = isPlayerList
	    ? priceBuy(it.baseCost, session.pricing.buyMultiplier)
	    : priceSell(it.baseCost, session.pricing.sellMultiplier);
	
	  // 1) Destination (pending-in) row: always separate, always marked
	  if (pendingIn > 0) {
	    rows.push({
	      id: `${id}__dest`,        // unique id so it never stacks/merges
	      realId: id,              // keep original for undo logic
	      name: it.displayName || it.name,
	      qty: pendingIn,
	      baseCost: it.baseCost,
	      marker: true,
	      unitDisplay: unitPending,
	      rowKind: "dest"
	    });
	  }
	
	  // 2) Base row: what is still left to trade from this list
	  if (baseDisplayQty > 0) {
	    rows.push({
	      id,
	      realId: id,
	      name: it.displayName || it.name,
	      qty: baseDisplayQty,
	      baseCost: it.baseCost,
	      marker: false,
	      unitDisplay: unitBase,
	      rowKind: "base"
	    });
	  }
    }

    // Sort: name asc
    rows.sort((a, b) => {
	  // dest rows always first
	  if (a.rowKind !== b.rowKind) return (a.rowKind === "dest" ? -1 : 1);
	  return normalizeNameKey(a.name).localeCompare(normalizeNameKey(b.name));
	});


    if (!rows.length) {
      const empty = document.createElement("div");
      empty.textContent = "No items.";
      empty.style.cssText = `opacity:0.75; color:#1AFF80; padding:8px 10px;`;
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
        rightText: r.unitDisplay
      });

      rowEl.title = "Click to move (Shift+Click for quantity)\nAtl+Click: Remove stack\nHold Ctrl: Move mouse to preview\nHold Ctrl+Click: Open Note";
	  guardObsidianClick(rowEl);
      rowEl.addEventListener("click", async (e) => {
        const pending = getPendingQty(session);
        const pb = pending.buy[r.realId] ?? 0;
        const ps = pending.sell[r.realId] ?? 0;
		const itemId = r.realId ?? r.id;
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
	    
	    // Hidden remove-stack mechanic: Alt+Click on vendor BASE row removes entire stack
		if (
		  which === "vendor" &&
		  r.marker !== true &&          // base row only (not ⬛ destination row)
		  e.altKey &&
		  !e.ctrlKey                   // do not interfere with Ctrl-link behavior
		) {
		  e.preventDefault();
		  e.stopPropagation();
		
		  const removed = removeVendorStackByItemId(itemId);
		  if (removed > 0) {
		    showNotice(`Removed vendor stack: ${r.name}`);
		    render();
		  } else {
		    showNotice("Nothing removed.");
		  }
		  return;
		}

	    
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
		  
          if (listIsPlayer) removePending("BUY", itemId, qtyToUndo);
          else removePending("SELL", itemId, qtyToUndo);

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
          addPending("SELL", r.realId, qtyToMove);
        } else {
          // buying from vendor
          addPending("BUY", r.realId, qtyToMove);
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

    // Master item map for consistent cost references (merge category/baseCost if later sources have them)
	const itemsById = new Map();
	for (const it of [...playerItems, ...vendorItems, ...pooled]) {
	  const cur = itemsById.get(it.id);
	
	  if (!cur) {
	    itemsById.set(it.id, it);
	    continue;
	  }
	
	  // Fill missing category if a later source provides it
	  const curCat = String(cur.category || "").trim();
	  const newCat = String(it.category || "").trim();
	  if (!curCat && newCat) cur.category = newCat;
	
	  // Optional: fill missing/invalid baseCost too (helps if one source lacks cost)
	  if (!Number.isFinite(parseCapsInt(cur.baseCost, NaN)) && Number.isFinite(parseCapsInt(it.baseCost, NaN))) {
	    cur.baseCost = it.baseCost;
	  }
	}


    // Build base qty maps
    const basePlayerMap = new Map();
    for (const it of playerItems) {
      basePlayerMap.set(it.id, (basePlayerMap.get(it.id) || 0) + it.qty);
    }
    
    // Include pooled items in the player-side available inventory
	for (const it of pooled) {
	  const cur = basePlayerMap.get(it.id) ?? 0;
	  basePlayerMap.set(it.id, cur + it.qty);
	  if (!itemsById.has(it.id)) itemsById.set(it.id, it);
	}


    const baseVendorMap = new Map();
    for (const it of vendorItems) {
      baseVendorMap.set(it.id, (baseVendorMap.get(it.id) || 0) + it.qty);
    }

    // NOTE: pooled items do not exist in either base map; they are currently only a future hook.
    // If you want pooled items to be sellable, you can add them to basePlayerMap here later.

    // Render lists
    renderList({
	  which: "player",
	  listEl: playerInvUI.list,
	  // Render from union so pooled-only items appear
	  items: [...playerItems, ...pooled],
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

    // Net > 0  => vendor pays player (←)
	// Net < 0  => player pays vendor (→)
	const net = sellTotal - buyTotal;
	
	statFlow.innerHTML = "";
	statFlow.appendChild(renderCapsFlow({ net }));


    const vendorCaps = Math.max(0, parseCapsInt(vendorState.caps, 0));
    const vendorPayout = Math.min(vendorCaps, sellTotal);
    const forfeited = Math.max(0, sellTotal - vendorPayout);

    if (forfeited > 0) {
      statWarn.textContent = `Vendor can only pay ${vendorPayout}. ${forfeited} forfeited.`;
    } else {
      statWarn.textContent = "";
    }
	
	// Keep caps widgets synced with latest state
	if (playerCapsWidget?.wrap?._refresh) playerCapsWidget.wrap._refresh();
	if (vendorCapsWidget?.wrap?._refresh) vendorCapsWidget.wrap._refresh();

	
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
    // Clear BOTH session and vendor state
    session.player.tradeCaps = loadPlayerCaps();
    session.player.pooledItems = [];
    session.pricing.buyMultiplier = 1.0;
    session.pricing.sellMultiplier = 1.0;
    session.pending.buy = {};
    session.pending.sell = {};

    vendorState.caps = 0;
    vendorState.inventory = [];
    vendorState.mode = "manual";
    vendorState.randomConfig = null;
    vendorState.lastBuiltAt = nowMs();

    saveSession(vendorId, session);
    saveVendorState(vendorId, vendorState);

    showNotice("Trade cleared (session + vendor).");
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
    playerHeader.title?._refresh?.();
	vendorHeader.title?._refresh?.();
  };

  // Initial render
  render();
}

/* ----------------------------- Mount in Note ------------------------------- */

// --- JS Engine render (REQUIRED) ---
const root = document.createElement("div");
root.classList.add("trade-menu-root");
root.style.width = "100%";
buildTradeUI(root);
return root;

```