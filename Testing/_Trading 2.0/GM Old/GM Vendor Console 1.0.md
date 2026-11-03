```js-engine
const VENDOR_SERVER_URL_KEY = "vaultkit_vendor_server_url";
const DEFAULT_VENDOR_SERVER_URL = "http://localhost:3000";

function normalizeUrl(value) {
  return String(value || DEFAULT_VENDOR_SERVER_URL).trim().replace(/\/+$/, "");
}

function parseIntSafe(value, fallback = 0) {
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) ? n : fallback;
}

function stripWikiLink(value) {
  return String(value || "").trim().replace(/^\[\[/, "").replace(/\]\]$/, "").trim();
}

function categoryFromPath(path) {
  const p = String(path || "");
  if (p.startsWith("Fallout-RPG/Items/Weapons")) return "WEAPONS";
  if (p.startsWith("Fallout-RPG/Items/Apparel")) return "APPAREL";
  if (p.startsWith("Fallout-RPG/Items/Consumables/Food")) return "FOOD";
  if (p.startsWith("Fallout-RPG/Items/Consumables/Beverages")) return "FOOD";
  if (p.startsWith("Fallout-RPG/Items/Consumables/Chems")) return "CHEMS";
  if (p.startsWith("Fallout-RPG/Items/Ammo")) return "AMMO";
  return "MISC";
}

function makeCoreId() {
  return `core-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function getCoreType(payload) {
  const name = stripWikiLink(payload?.name || payload?.yamlName || "").toLowerCase();
  if (name === "fusion core") return "fusion";
  if (name === "plasma core") return "plasma";
  return null;
}

function getTradeBaseIdentity(item) {
  const source = String(item?.sourcePath || item?.path || item?.yamlName || "").trim().toLowerCase();
  const name = stripWikiLink(item?.name || item?.yamlName || "").toLowerCase();
  const category = String(item?.category || "").trim().toUpperCase();
  return `${source}::${name}::${category}`;
}

function getItemId(item, unit = null) {
  const coreId = String(unit?.instanceId || "").trim();
  if (coreId) return `core::${coreId}`;

  const instanceId = String(item?.instanceId || "").trim();
  if (instanceId) return `instance::${instanceId}`;

  return `stack::${getTradeBaseIdentity(item)}`;
}

function vendorRows(vendor) {
  const rows = [];

  for (const payload of (Array.isArray(vendor?.inventory) ? vendor.inventory : [])) {
    const coreType = getCoreType(payload);

    if (coreType && Array.isArray(payload.chargeUnits)) {
      for (const unit of payload.chargeUnits) {
        rows.push({
          id: getItemId(payload, unit),
          name: stripWikiLink(payload.name || payload.yamlName || "Core"),
          qty: 1,
          cost: Math.max(0, parseIntSafe(payload.baseCost ?? payload.cost, 0)),
          detail: coreType === "fusion"
            ? `${parseIntSafe(unit.charges, 0)}/${parseIntSafe(unit.maxCharges, 100)}`
            : `${parseIntSafe(unit.charges, 0)}/500`
        });
      }
      continue;
    }

    rows.push({
      id: getItemId(payload),
      name: stripWikiLink(payload.name || payload.yamlName || "Item"),
      qty: Math.max(1, parseIntSafe(payload.qty, 1)),
      cost: Math.max(0, parseIntSafe(payload.baseCost ?? payload.cost, 0)),
      detail: ""
    });
  }

  return rows.sort((a, b) => a.name.localeCompare(b.name));
}

const root = document.createElement("div");
root.style.cssText = `
  width:100%;
  max-width:1100px;
  margin:0 auto;
  background:#021509ad;
  color:#1AFF80;
  border:2px solid #1AFF80;
  padding:14px;
  box-sizing:border-box;
  font-family:inherit;
`;

const top = document.createElement("div");
top.style.cssText = `display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:14px;`;

const serverInput = document.createElement("input");
serverInput.value = normalizeUrl(localStorage.getItem(VENDOR_SERVER_URL_KEY) || DEFAULT_VENDOR_SERVER_URL);
serverInput.placeholder = "http://192.168.1.50:3000";
serverInput.style.cssText = `width:250px;background:#021509ad;color:#1AFF80;border:1px solid #1AFF80;padding:6px 8px;`;

const connectBtn = document.createElement("button");
connectBtn.textContent = "Connect / Refresh";

const status = document.createElement("span");
status.textContent = "Not connected";
status.style.cssText = `font-size:12px;opacity:.9;`;

top.append("Server:", serverInput, connectBtn, status);

const settings = document.createElement("div");
settings.style.cssText = `
  display:grid;
  grid-template-columns:repeat(4,minmax(140px,1fr)) auto;
  gap:10px;
  align-items:end;
  margin-bottom:14px;
`;

function field(label, type = "text", step = null) {
  const wrap = document.createElement("label");
  wrap.style.cssText = `display:flex;flex-direction:column;gap:4px;`;
  const span = document.createElement("span");
  span.textContent = label;
  span.style.cssText = `font-size:12px;font-weight:bold;`;
  const input = document.createElement("input");
  input.type = type;
  if (step) input.step = step;
  input.style.cssText = `background:#021509ad;color:#1AFF80;border:1px solid #1AFF80;padding:6px 8px;`;
  wrap.append(span, input);
  return { wrap, input };
}

const nameField = field("Vendor Name");
const capsField = field("Caps", "number");
const buyField = field("Buy Multiplier", "number", "0.01");
const sellField = field("Sell Multiplier", "number", "0.01");

const saveBtn = document.createElement("button");
saveBtn.textContent = "Save Settings";

settings.append(nameField.wrap, capsField.wrap, buyField.wrap, sellField.wrap, saveBtn);

const addBar = document.createElement("div");
addBar.style.cssText = `display:flex;gap:8px;align-items:center;margin:12px 0;flex-wrap:wrap;`;

const searchInput = document.createElement("input");
searchInput.placeholder = "Search vault items...";
searchInput.style.cssText = `flex:1;min-width:240px;background:#021509ad;color:#1AFF80;border:1px solid #1AFF80;padding:6px 8px;`;

const results = document.createElement("select");
results.style.cssText = `min-width:320px;background:#021509ad;color:#1AFF80;border:1px solid #1AFF80;padding:6px 8px;`;

const qtyInput = document.createElement("input");
qtyInput.type = "number";
qtyInput.min = "1";
qtyInput.value = "1";
qtyInput.style.cssText = `width:70px;background:#021509ad;color:#1AFF80;border:1px solid #1AFF80;padding:6px 8px;`;

const addBtn = document.createElement("button");
addBtn.textContent = "Add";

addBar.append(searchInput, results, "Qty:", qtyInput, addBtn);

const table = document.createElement("div");
table.style.cssText = `display:flex;flex-direction:column;gap:3px;`;

root.append(top, settings, addBar, table);

let vendor = null;
let searchItems = [];

function buttonStyle(btn) {
  btn.style.cssText = `background:#021509ad;color:#1AFF80;border:1px solid #1AFF80;padding:6px 10px;cursor:pointer;`;
}
[connectBtn, saveBtn, addBtn].forEach(buttonStyle);

async function request(path, options = {}) {
  const base = normalizeUrl(serverInput.value);
  serverInput.value = base;
  localStorage.setItem(VENDOR_SERVER_URL_KEY, base);

  const response = await fetch(`${base}${path}`, options);
  const data = await response.json().catch(() => null);

  if (!response.ok || data?.ok === false) {
    throw new Error(data?.reason || `HTTP ${response.status}`);
  }

  return data;
}

function renderVendor() {
  if (!vendor) return;

  nameField.input.value = String(vendor.name || "");
  capsField.input.value = String(Math.max(0, parseIntSafe(vendor.caps, 0)));
  buyField.input.value = String(Number(vendor.buyMultiplier ?? 1));
  sellField.input.value = String(Number(vendor.sellMultiplier ?? 1));

  table.innerHTML = "";

  const header = document.createElement("div");
  header.style.cssText = `
    display:grid;
    grid-template-columns:minmax(0,1fr) 90px 90px 140px;
    gap:8px;
    padding:6px 8px;
    border-bottom:1px solid #1AFF80;
    font-weight:bold;
  `;
  header.innerHTML = `<div>Name</div><div style="text-align:right">Qty</div><div style="text-align:right">Base</div><div></div>`;
  table.append(header);

  for (const row of vendorRows(vendor)) {
    const el = document.createElement("div");
    el.style.cssText = `
      display:grid;
      grid-template-columns:minmax(0,1fr) 90px 90px 140px;
      gap:8px;
      align-items:center;
      padding:5px 8px;
      border-bottom:1px solid rgba(26,255,128,.15);
    `;

    const name = document.createElement("div");
    name.textContent = row.detail ? `${row.name} — ${row.detail}` : row.name;

    const qty = document.createElement("div");
    qty.textContent = String(row.qty);
    qty.style.textAlign = "right";

    const cost = document.createElement("div");
    cost.textContent = String(row.cost);
    cost.style.textAlign = "right";

    const actions = document.createElement("div");
    actions.style.cssText = `display:flex;gap:5px;justify-content:flex-end;`;

    const minus = document.createElement("button");
    minus.textContent = "-1";
    buttonStyle(minus);

    const removeAll = document.createElement("button");
    removeAll.textContent = row.qty > 1 ? "Remove All" : "Remove";
    buttonStyle(removeAll);

    minus.onclick = async () => {
      await removeItem(row.id, 1);
    };

    removeAll.onclick = async () => {
      await removeItem(row.id, row.qty);
    };

    actions.append(minus, removeAll);
    el.append(name, qty, cost, actions);
    table.append(el);
  }

  if (!vendorRows(vendor).length) {
    const empty = document.createElement("div");
    empty.textContent = "Vendor inventory is empty.";
    empty.style.cssText = `padding:10px;opacity:.75;`;
    table.append(empty);
  }
}

async function refreshVendor() {
  status.textContent = "Connecting...";

  try {
    vendor = await request("/api/vendor");
    status.textContent = "Connected";
    renderVendor();
  } catch (err) {
    status.textContent = `Offline: ${String(err?.message || err)}`;
  }
}

async function saveSettings() {
  try {
    const result = await request("/api/vendor/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: nameField.input.value.trim(),
        caps: Math.max(0, parseIntSafe(capsField.input.value, 0)),
        buyMultiplier: Math.max(0, Number(buyField.input.value || 0)),
        sellMultiplier: Math.max(0, Number(sellField.input.value || 0))
      })
    });

    vendor = result.vendor;
    status.textContent = "Settings saved";
    renderVendor();
  } catch (err) {
    status.textContent = `Save failed: ${String(err?.message || err)}`;
  }
}

async function removeItem(itemId, qty) {
  try {
    const result = await request("/api/vendor/inventory/remove", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId, qty })
    });

    vendor = result.vendor;
    renderVendor();
  } catch (err) {
    status.textContent = `Remove failed: ${String(err?.message || err)}`;
  }
}

async function buildSearchItems() {
  const files = app.vault.getMarkdownFiles();
  const out = [];

  for (const file of files) {
    if (!String(file.path).startsWith("Fallout-RPG/Items/")) continue;

    const cache = app.metadataCache.getFileCache(file);
    const fm = cache?.frontmatter || {};

    const cost = Math.max(0, parseIntSafe(fm.cost, 0));
    const weight = fm.weight ?? "";
    const name = String(fm.name || file.basename);

    out.push({
      name,
      yamlName: file.basename,
      sourcePath: file.path,
      category: categoryFromPath(file.path),
      cost,
      baseCost: cost,
      weight
    });
  }

  searchItems = out.sort((a, b) => a.name.localeCompare(b.name));
  updateSearchResults();
}

function updateSearchResults() {
  const q = searchInput.value.trim().toLowerCase();
  results.innerHTML = "";

  const filtered = searchItems
    .filter(item => !q || item.name.toLowerCase().includes(q))
    .slice(0, 100);

  for (const item of filtered) {
    const opt = document.createElement("option");
    opt.value = item.sourcePath;
    opt.textContent = `${item.name} — ${item.cost}`;
    results.append(opt);
  }
}

async function addSelectedItem() {
  const selected = searchItems.find(item => item.sourcePath === results.value);
  if (!selected) return;

  const qty = Math.max(1, parseIntSafe(qtyInput.value, 1));
  const payload = {
    name: `[[${selected.yamlName}]]`,
    yamlName: selected.yamlName,
    sourcePath: selected.sourcePath,
    category: selected.category,
    cost: selected.cost,
    baseCost: selected.baseCost,
    weight: selected.weight,
    qty: String(qty)
  };

  const coreType = getCoreType(payload);

  if (coreType) {
    const defaultMax = coreType === "fusion" ? 100 : 500;
    const raw = window.prompt(
      `${selected.name} charge (0-${defaultMax})`,
      String(defaultMax)
    );

    if (raw === null) return;

    const charge = Math.max(0, Math.min(defaultMax, parseIntSafe(raw, defaultMax)));
    payload.chargeUnits = [];

    for (let i = 0; i < qty; i++) {
      if (coreType === "fusion") {
        payload.chargeUnits.push({
          instanceId: makeCoreId(),
          charges: charge,
          maxCharges: 100,
          weaponShotsRemaining: charge * 50
        });
      } else {
        payload.chargeUnits.push({
          instanceId: makeCoreId(),
          charges: charge
        });
      }
    }

    payload.qty = String(payload.chargeUnits.length);
  }

  try {
    const result = await request("/api/vendor/inventory/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        payload,
        qty
      })
    });

    vendor = result.vendor;
    renderVendor();
  } catch (err) {
    status.textContent = `Add failed: ${String(err?.message || err)}`;
  }
}

connectBtn.onclick = refreshVendor;
saveBtn.onclick = saveSettings;
searchInput.oninput = updateSearchResults;
addBtn.onclick = addSelectedItem;

await buildSearchItems();
await refreshVendor();

return root;
```