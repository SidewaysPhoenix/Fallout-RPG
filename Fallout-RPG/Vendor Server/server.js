const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: "2mb" }));

const legacyVendorPath = path.join(__dirname, "data", "vendor.json");
const vendorsDir = path.join(__dirname, "vendors");
const runtimeDir = path.join(__dirname, "runtime");
const activeVendorPath = path.join(runtimeDir, "active-vendor.json");
const transactionsPath = path.join(runtimeDir, "transactions.json");
const reservationsPath = path.join(runtimeDir, "reservations.json");

fs.mkdirSync(vendorsDir, { recursive: true });
fs.mkdirSync(runtimeDir, { recursive: true });

function parseIntSafe(value, fallback = 0) {
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) ? n : fallback;
}

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function normalizeNameKey(value) {
  return String(value ?? "")
    .trim()
    .replace(/\s+/g, " ")
    .replace(/^\[\[/, "")
    .replace(/\]\]$/, "")
    .toLowerCase();
}

function stripWikiLink(value) {
  return String(value ?? "")
    .trim()
    .replace(/^\[\[/, "")
    .replace(/\]\]$/, "")
    .trim();
}

function getCoreType(item) {
  const name = stripWikiLink(item?.name || item?.yamlName || "").toLowerCase();
  const sourcePath = String(item?.sourcePath || item?.path || "").toLowerCase();

  if (name === "fusion core" || /\/fusion core\.md$/.test(sourcePath)) return "fusion";
  if (name === "plasma core" || /\/plasma core\.md$/.test(sourcePath)) return "plasma";

  return null;
}

function isCore(item) {
  return !!getCoreType(item);
}

function hasAddons(item) {
  return Array.isArray(item?.addons) && item.addons.length > 0;
}

function isUniqueRecord(item) {
  return !!String(item?.instanceId || "").trim()
    || hasAddons(item)
    || !!item?.powerArmorState;
}

function getBaseIdentity(item) {
  const source = String(item?.sourcePath || item?.path || item?.yamlName || "")
    .trim()
    .toLowerCase();
  const name = normalizeNameKey(item?.name || item?.link || item?.yamlName || "");
  const category = String(item?.category || "").trim().toUpperCase();

  return `${source}::${name}::${category}`;
}

function getItemId(item, coreUnit = null) {
  const unitId = String(coreUnit?.instanceId || "").trim();
  if (unitId) return `core::${unitId}`;

  const instanceId = String(item?.instanceId || "").trim();
  if (instanceId) return `instance::${instanceId}`;

  return `stack::${getBaseIdentity(item)}`;
}

function getBaseCost(item) {
  return Math.max(0, parseIntSafe(item?.cost ?? item?.baseCost ?? item?.baseCostOverride, 0));
}

function normalizePayload(item) {
  const copy = deepClone(item || {});

  copy.name = String(
    copy.name ||
    copy.link ||
    (copy.yamlName ? `[[${copy.yamlName}]]` : "")
  ).trim();

  if (!copy.sourcePath && copy.path) copy.sourcePath = copy.path;
  if (copy.baseCost === undefined) copy.baseCost = getBaseCost(copy);

  if (copy.instanceName !== undefined) {
    copy.instanceName = String(copy.instanceName || "").trim();
    if (!copy.instanceName) delete copy.instanceName;
  }

  if (copy.baseCostOverride !== undefined && copy.baseCostOverride !== null && copy.baseCostOverride !== "") {
    copy.baseCostOverride = Math.max(0, parseIntSafe(copy.baseCostOverride, 0));
  } else {
    delete copy.baseCostOverride;
  }

  return copy;
}

function recordToTradeItems(record) {
  const payload = normalizePayload(record);
  const coreType = getCoreType(payload);

  if (coreType) {
    const units = Array.isArray(payload.chargeUnits) ? payload.chargeUnits : [];
    const out = [];

    for (const unit of units) {
      const unitId = String(unit?.instanceId || "").trim();
      if (!unitId) continue;

      const unitPayload = deepClone(payload);
      delete unitPayload.instanceId;
      unitPayload.chargeUnits = [deepClone(unit)];
      unitPayload.qty = "1";

      out.push({
        id: getItemId(unitPayload, unit),
        qty: 1,
        baseCost: getBaseCost(unitPayload),
        payload: unitPayload,
        unique: true
      });
    }

    return out;
  }

  const qty = Math.max(0, parseIntSafe(payload.qty, 0));
  if (qty <= 0) return [];

  const unique = isUniqueRecord(payload);

  return [{
    id: getItemId(payload),
    qty: unique ? 1 : qty,
    baseCost: getBaseCost(payload),
    payload,
    unique
  }];
}

function vendorToTradeItems(vendor) {
  const out = [];
  const inventory = Array.isArray(vendor?.inventory) ? vendor.inventory : [];

  for (const row of inventory) {
    out.push(...recordToTradeItems(row));
  }

  return out;
}

function removePayloadFromInventory(rows, payload, qty = 1) {
  const copy = normalizePayload(payload);

  if (isCore(copy)) {
    const ids = new Set(
      (Array.isArray(copy.chargeUnits) ? copy.chargeUnits : [])
        .map(unit => String(unit?.instanceId || "").trim())
        .filter(Boolean)
    );

    for (let i = rows.length - 1; i >= 0; i--) {
      const row = rows[i];
      if (!isCore(row)) continue;
      if (!Array.isArray(row.chargeUnits)) row.chargeUnits = [];

      row.chargeUnits = row.chargeUnits.filter(
        unit => !ids.has(String(unit?.instanceId || "").trim())
      );

      row.qty = String(row.chargeUnits.length);

      if (row.chargeUnits.length === 0) {
        rows.splice(i, 1);
      }
    }

    return;
  }

  if (isUniqueRecord(copy)) {
    const instanceId = String(copy.instanceId || "").trim();

    let index = -1;

    if (instanceId) {
      index = rows.findIndex(
        row => String(row?.instanceId || "").trim() === instanceId
      );
    }

    if (index < 0) {
      const identity = getBaseIdentity(copy);
      index = rows.findIndex(
        row => isUniqueRecord(row) && getBaseIdentity(row) === identity
      );
    }

    if (index >= 0) rows.splice(index, 1);
    return;
  }

  const identity = getBaseIdentity(copy);
  let remaining = Math.max(0, parseIntSafe(qty, 0));

  for (let i = rows.length - 1; i >= 0 && remaining > 0; i--) {
    const row = rows[i];

    if (isCore(row) || isUniqueRecord(row)) continue;
    if (getBaseIdentity(row) !== identity) continue;

    const current = Math.max(0, parseIntSafe(row.qty, 0));
    const take = Math.min(current, remaining);
    const next = current - take;

    remaining -= take;

    if (next <= 0) rows.splice(i, 1);
    else row.qty = String(next);
  }
}


function makeServerInstanceId(prefix = "item") {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function mergePayloadIntoInventory(rows, payload, qty = 1) {
  const copy = normalizePayload(payload);

  if (isCore(copy)) {
    const incomingUnits = Array.isArray(copy.chargeUnits)
      ? deepClone(copy.chargeUnits)
      : [];

    if (!incomingUnits.length) return;

    let target = rows.find(
      row => isCore(row) && getBaseIdentity(row) === getBaseIdentity(copy)
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
      target.chargeUnits
        .map(unit => String(unit?.instanceId || "").trim())
        .filter(Boolean)
    );

    for (const unit of incomingUnits) {
      let id = String(unit?.instanceId || "").trim();

      if (!id || knownIds.has(id)) {
        id = makeServerInstanceId("core");
        unit.instanceId = id;
      }

      knownIds.add(id);
      target.chargeUnits.push(deepClone(unit));
    }

    target.qty = String(target.chargeUnits.length);
    return;
  }

  if (isUniqueRecord(copy)) {
    const count = Math.max(1, parseIntSafe(qty, 1));

    for (let i = 0; i < count; i++) {
      const incoming = deepClone(copy);
      incoming.qty = "1";
      incoming.selected = false;

      let id = String(incoming.instanceId || "").trim();

      if (
        i > 0 ||
        !id ||
        rows.some(row => String(row?.instanceId || "").trim() === id)
      ) {
        incoming.instanceId = makeServerInstanceId("inv");
      }

      rows.push(incoming);
    }

    return;
  }

  const identity = getBaseIdentity(copy);

  let existing = rows.find(
    row =>
      !isCore(row) &&
      !isUniqueRecord(row) &&
      getBaseIdentity(row) === identity
  );

  if (!existing) {
    existing = deepClone(copy);
    existing.qty = "0";
    existing.selected = false;
    rows.push(existing);
  }

  existing.qty = String(
    Math.max(0, parseIntSafe(existing.qty, 0)) +
    Math.max(0, parseIntSafe(qty, 0))
  );
}

function priceSell(baseCost, multiplier) {
  const mult = Number.isFinite(Number(multiplier)) ? Number(multiplier) : 1;
  return Math.max(0, Math.floor(baseCost * mult));
}

function priceBuy(baseCost, multiplier) {
  const mult = Number.isFinite(Number(multiplier)) ? Number(multiplier) : 1;
  return Math.max(0, Math.ceil(baseCost * mult));
}

function readJson(filePath, fallback) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return deepClone(fallback);
  }
}

function writeJsonAtomic(filePath, value) {
  const tempPath = `${filePath}.tmp`;
  fs.writeFileSync(tempPath, JSON.stringify(value, null, 2), "utf8");
  fs.renameSync(tempPath, filePath);
}

function normalizeVendorId(value) {
  const cleaned = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  return cleaned || "vendor";
}

function vendorFilePath(vendorId) {
  return path.join(vendorsDir, `${normalizeVendorId(vendorId)}.json`);
}

function listVendorFiles() {
  return fs.readdirSync(vendorsDir)
    .filter(name => name.toLowerCase().endsWith(".json"))
    .sort((a, b) => a.localeCompare(b));
}

function getActiveVendorId() {
  const active = readJson(activeVendorPath, null);
  const requested = normalizeVendorId(active?.vendorId || "");

  if (requested && fs.existsSync(vendorFilePath(requested))) {
    return requested;
  }

  const files = listVendorFiles();
  if (!files.length) return "";

  const fallback = files[0].replace(/\.json$/i, "");
  writeJsonAtomic(activeVendorPath, { vendorId: fallback });
  return fallback;
}

function setActiveVendorId(vendorId) {
  const normalized = normalizeVendorId(vendorId);

  if (!fs.existsSync(vendorFilePath(normalized))) {
    throw new Error("Vendor does not exist.");
  }

  writeJsonAtomic(activeVendorPath, { vendorId: normalized });
  return normalized;
}

function ensureVendorStorage() {
  const existing = listVendorFiles();

  if (!existing.length && fs.existsSync(legacyVendorPath)) {
    const legacy = readJson(legacyVendorPath, null);

    if (legacy && typeof legacy === "object") {
      const vendorId = normalizeVendorId(legacy.vendorId || legacy.name || "vendor");
      legacy.vendorId = vendorId;
      if (!Array.isArray(legacy.inventory)) legacy.inventory = [];
      legacy.caps = Math.max(0, parseIntSafe(legacy.caps, 0));
      writeJsonAtomic(vendorFilePath(vendorId), legacy);
      writeJsonAtomic(activeVendorPath, { vendorId });
      return;
    }
  }

  if (!listVendorFiles().length) {
    const vendorId = "default-vendor";
    const vendor = {
      vendorId,
      name: "Vendor",
      caps: 0,
      buyMultiplier: 1,
      sellMultiplier: 0.5,
      inventory: [],
      lastBuiltAt: Date.now()
    };
    writeJsonAtomic(vendorFilePath(vendorId), vendor);
    writeJsonAtomic(activeVendorPath, { vendorId });
    return;
  }

  getActiveVendorId();
}


function makeVendorTemplate(vendor) {
  return {
    caps: Math.max(0, parseIntSafe(vendor?.caps, 0)),
    buyMultiplier: Number.isFinite(Number(vendor?.buyMultiplier)) ? Math.max(0, Number(vendor.buyMultiplier)) : 1,
    sellMultiplier: Number.isFinite(Number(vendor?.sellMultiplier)) ? Math.max(0, Number(vendor.sellMultiplier)) : 0.5,
    inventory: deepClone(Array.isArray(vendor?.inventory) ? vendor.inventory : []),
    mode: String(vendor?.mode || "manual"),
    randomConfig: vendor?.randomConfig && typeof vendor.randomConfig === "object" ? deepClone(vendor.randomConfig) : null,
    savedAt: Date.now()
  };
}
function ensureVendorTemplate(vendor) {
  if (!vendor.template || typeof vendor.template !== "object") vendor.template = makeVendorTemplate(vendor);
  if (!Array.isArray(vendor.template.inventory)) vendor.template.inventory = [];
  return vendor.template;
}
function regenerateInventoryIdentities(inventory) {
  const out = deepClone(Array.isArray(inventory) ? inventory : []);
  for (const item of out) {
    if (isUniqueRecord(item)) { item.instanceId = makeServerInstanceId("inv"); item.qty = "1"; }
    if (Array.isArray(item?.chargeUnits)) for (const unit of item.chargeUnits) unit.instanceId = makeServerInstanceId("core");
  }
  return out;
}
function stockSignature(item) {
  const copy = deepClone(item || {});
  delete copy.instanceId; delete copy.qty; delete copy.selected; delete copy.chargeUnits;
  return JSON.stringify(copy);
}
function restockMissingFromTemplate(vendor) {
  const template = ensureVendorTemplate(vendor);
  const templateInventory = Array.isArray(template.inventory) ? template.inventory : [];
  const live = vendor.inventory;
  const processedUnique = new Set();
  for (const templateItem of templateInventory) {
    if (Array.isArray(templateItem?.chargeUnits)) {
      const identity = getBaseIdentity(templateItem);
      const desired = templateInventory.filter(x => Array.isArray(x?.chargeUnits) && getBaseIdentity(x) === identity).reduce((s,x)=>s+x.chargeUnits.length,0);
      const current = live.filter(x => Array.isArray(x?.chargeUnits) && getBaseIdentity(x)===identity).reduce((s,x)=>s+x.chargeUnits.length,0);
      const missing = Math.max(0, desired-current);
      if (missing>0) {
        const clone = deepClone(templateItem);
        clone.chargeUnits = deepClone(templateItem.chargeUnits.slice(0, missing));
        for (const unit of clone.chargeUnits) unit.instanceId = makeServerInstanceId("core");
        live.push(clone);
      }
      continue;
    }
    if (isUniqueRecord(templateItem)) {
      const sig = stockSignature(templateItem);
      if (processedUnique.has(sig)) continue;
      processedUnique.add(sig);
      const desired = templateInventory.filter(x=>isUniqueRecord(x)&&!Array.isArray(x?.chargeUnits)&&stockSignature(x)===sig).length;
      const current = live.filter(x=>isUniqueRecord(x)&&!Array.isArray(x?.chargeUnits)&&stockSignature(x)===sig).length;
      for (let i=0;i<Math.max(0,desired-current);i++) {
        const clone=deepClone(templateItem); clone.instanceId=makeServerInstanceId("inv"); clone.qty="1"; live.push(clone);
      }
      continue;
    }
    const identity=getBaseIdentity(templateItem);
    const desiredQty=Math.max(0,parseIntSafe(templateItem?.qty,0));
    const liveRow=live.find(x=>!isUniqueRecord(x)&&!Array.isArray(x?.chargeUnits)&&getBaseIdentity(x)===identity);
    const currentQty=liveRow?Math.max(0,parseIntSafe(liveRow.qty,0)):0;
    if (currentQty<desiredQty) {
      if (liveRow) liveRow.qty=String(desiredQty);
      else { const clone=deepClone(templateItem); clone.qty=String(desiredQty); live.push(clone); }
    }
  }
  vendor.caps=Math.max(Math.max(0,parseIntSafe(vendor.caps,0)),Math.max(0,parseIntSafe(template.caps,0)));
}
function readVendor(vendorId = "") {
  ensureVendorStorage();

  const resolvedId = normalizeVendorId(vendorId || getActiveVendorId());
  const vendor = readJson(vendorFilePath(resolvedId), null);

  if (!vendor || typeof vendor !== "object") {
    throw new Error("Vendor file could not be loaded.");
  }

  vendor.vendorId = resolvedId;
  if (!Array.isArray(vendor.inventory)) vendor.inventory = [];
  vendor.caps = Math.max(0, parseIntSafe(vendor.caps, 0));
  ensureVendorTemplate(vendor);

  return vendor;
}

function saveVendor(vendor) {
  if (!vendor || typeof vendor !== "object") {
    throw new Error("Invalid vendor.");
  }

  const vendorId = normalizeVendorId(vendor.vendorId || getActiveVendorId());
  vendor.vendorId = vendorId;
  writeJsonAtomic(vendorFilePath(vendorId), vendor);
}

function vendorSummary(vendorId) {
  const vendor = readVendor(vendorId);
  return {
    vendorId: vendor.vendorId,
    name: String(vendor.name || vendor.vendorName || "Vendor").trim() || "Vendor",
    caps: Math.max(0, parseIntSafe(vendor.caps, 0)),
    inventoryCount: Array.isArray(vendor.inventory) ? vendor.inventory.length : 0,
    active: vendor.vendorId === getActiveVendorId()
  };
}

ensureVendorStorage();

function readTransactions() {
  return readJson(transactionsPath, {});
}

function saveTransaction(transactionId, result) {
  const transactions = readTransactions();
  transactions[transactionId] = result;

  // This is only a small local recovery ledger. Keep the newest 250 entries.
  const ids = Object.keys(transactions);
  if (ids.length > 250) {
    for (const id of ids.slice(0, ids.length - 250)) {
      delete transactions[id];
    }
  }

  writeJsonAtomic(transactionsPath, transactions);
}


const RESERVATION_TTL_MS = 3 * 60 * 1000;

function readReservations() {
  const data = readJson(reservationsPath, {});
  return data && typeof data === "object" ? data : {};
}

function cleanupReservations(data) {
  const now = Date.now();

  for (const [vendorId, clients] of Object.entries(data)) {
    if (!clients || typeof clients !== "object") {
      delete data[vendorId];
      continue;
    }

    for (const [clientId, reservation] of Object.entries(clients)) {
      if (!reservation || Number(reservation.expiresAt || 0) <= now) {
        delete clients[clientId];
      }
    }

    if (!Object.keys(clients).length) delete data[vendorId];
  }

  return data;
}

function writeReservations(data) {
  writeJsonAtomic(reservationsPath, cleanupReservations(data));
}

function reservationTotalsForVendor(vendorId, excludeClientId = "") {
  const data = cleanupReservations(readReservations());
  const clients = data[normalizeVendorId(vendorId)] || {};
  const totals = {};

  for (const [clientId, reservation] of Object.entries(clients)) {
    if (excludeClientId && clientId === excludeClientId) continue;

    const items = reservation?.items && typeof reservation.items === "object"
      ? reservation.items
      : {};

    for (const [itemId, qtyRaw] of Object.entries(items)) {
      const qty = Math.max(0, parseIntSafe(qtyRaw, 0));
      if (qty > 0) totals[itemId] = (totals[itemId] || 0) + qty;
    }
  }

  return totals;
}

function setClientReservation(vendorId, clientId, items) {
  const normalizedVendorId = normalizeVendorId(vendorId);
  const normalizedClientId = String(clientId || "").trim();

  if (!normalizedClientId) throw new Error("Missing client ID.");

  const vendor = readVendor(normalizedVendorId);
  const tradeItems = vendorToTradeItems(vendor);
  const byId = new Map(tradeItems.map(item => [item.id, item]));
  const reservedByOthers = reservationTotalsForVendor(normalizedVendorId, normalizedClientId);

  const normalizedItems = {};

  for (const requested of (Array.isArray(items) ? items : [])) {
    const itemId = String(requested?.itemId || "").trim();
    const qty = Math.max(0, parseIntSafe(requested?.qty, 0));
    if (!itemId || qty <= 0) continue;

    const item = byId.get(itemId);
    const reservedElsewhere = Math.max(0, parseIntSafe(reservedByOthers[itemId], 0));
    const available = Math.max(0, Math.max(0, parseIntSafe(item?.qty, 0)) - reservedElsewhere);

    if (!item || qty > available) {
      const err = new Error("That quantity is already reserved or no longer available.");
      err.code = "RESERVATION_CONFLICT";
      throw err;
    }

    if (item.unique && qty !== 1) {
      const err = new Error("Unique items can only be reserved one at a time.");
      err.code = "RESERVATION_CONFLICT";
      throw err;
    }

    normalizedItems[itemId] = qty;
  }

  const data = cleanupReservations(readReservations());
  if (!data[normalizedVendorId]) data[normalizedVendorId] = {};

  if (Object.keys(normalizedItems).length) {
    data[normalizedVendorId][normalizedClientId] = {
      expiresAt: Date.now() + RESERVATION_TTL_MS,
      items: normalizedItems
    };
  } else {
    delete data[normalizedVendorId][normalizedClientId];
    if (!Object.keys(data[normalizedVendorId]).length) delete data[normalizedVendorId];
  }

  writeReservations(data);

  return {
    reservedByOthers: reservationTotalsForVendor(normalizedVendorId, normalizedClientId),
    expiresAt: Object.keys(normalizedItems).length ? Date.now() + RESERVATION_TTL_MS : null
  };
}

function clearClientReservation(vendorId, clientId) {
  const normalizedVendorId = normalizeVendorId(vendorId);
  const normalizedClientId = String(clientId || "").trim();
  if (!normalizedClientId) return;

  const data = cleanupReservations(readReservations());
  if (data[normalizedVendorId]) {
    delete data[normalizedVendorId][normalizedClientId];
    if (!Object.keys(data[normalizedVendorId]).length) delete data[normalizedVendorId];
  }
  writeReservations(data);
}

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    service: "Vault-Kit Vendor Server"
  });
});


app.get("/api/vendors", (req, res) => {
  try {
    ensureVendorStorage();
    const activeVendorId = getActiveVendorId();
    const vendors = listVendorFiles()
      .map(file => file.replace(/\.json$/i, ""))
      .map(vendorSummary);

    res.json({
      ok: true,
      activeVendorId,
      vendors
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, reason: "Could not list vendors." });
  }
});

app.post("/api/vendors", (req, res) => {
  try {
    const name = String(req.body?.name || "New Vendor").trim() || "New Vendor";
    const requestedId = normalizeVendorId(req.body?.vendorId || name);

    let vendorId = requestedId;
    let suffix = 2;

    while (fs.existsSync(vendorFilePath(vendorId))) {
      vendorId = `${requestedId}-${suffix++}`;
    }

    const inventory = Array.isArray(req.body?.inventory)
      ? req.body.inventory.map(item => normalizePayload(item))
      : [];

    const vendor = {
      vendorId,
      name,
      caps: Math.max(0, parseIntSafe(req.body?.caps, 0)),
      buyMultiplier: Number.isFinite(Number(req.body?.buyMultiplier))
        ? Math.max(0, Number(req.body.buyMultiplier))
        : 1,
      sellMultiplier: Number.isFinite(Number(req.body?.sellMultiplier))
        ? Math.max(0, Number(req.body.sellMultiplier))
        : 0.5,
      inventory,
      mode: String(req.body?.mode || (inventory.length ? "generated" : "manual")),
      randomConfig: req.body?.randomConfig && typeof req.body.randomConfig === "object"
        ? deepClone(req.body.randomConfig)
        : null,
      lastBuiltAt: Date.now()
    };

    vendor.template = makeVendorTemplate(vendor);
    saveVendor(vendor);

    const makeActive = req.body?.makeActive !== false;
    if (makeActive) setActiveVendorId(vendorId);

    res.json({
      ok: true,
      vendor,
      activeVendorId: getActiveVendorId()
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, reason: "Could not create vendor." });
  }
});



app.post("/api/vendors/:vendorId/duplicate", (req, res) => {
  try {
    const source = readVendor(req.params.vendorId);
    const name = String(req.body?.name || `${source.name || "Vendor"} Copy`).trim()
      || `${source.name || "Vendor"} Copy`;

    const requestedId = normalizeVendorId(req.body?.vendorId || name);
    let vendorId = requestedId;
    let suffix = 2;

    while (fs.existsSync(vendorFilePath(vendorId))) {
      vendorId = `${requestedId}-${suffix++}`;
    }

    const duplicate = deepClone(source);
    duplicate.vendorId = vendorId;
    duplicate.name = name;
    duplicate.inventory = regenerateInventoryIdentities(source.inventory);
    duplicate.lastBuiltAt = Date.now();

    const sourceTemplate = ensureVendorTemplate(source);
    duplicate.template = deepClone(sourceTemplate);
    duplicate.template.inventory = regenerateInventoryIdentities(sourceTemplate.inventory);
    duplicate.template.savedAt = Date.now();

    saveVendor(duplicate);

    const makeActive = req.body?.makeActive !== false;
    if (makeActive) setActiveVendorId(vendorId);

    res.json({
      ok: true,
      vendor: duplicate,
      activeVendorId: getActiveVendorId()
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, reason: "Could not duplicate vendor." });
  }
});

app.post("/api/vendors/:vendorId/template/save", (req, res) => {
  try {
    const vendor = readVendor(req.params.vendorId);
    vendor.template = makeVendorTemplate(vendor);
    vendor.lastBuiltAt = Date.now();
    saveVendor(vendor);
    res.json({ ok: true, vendor });
  } catch (err) { console.error(err); res.status(500).json({ ok:false, reason:"Could not save vendor template." }); }
});
app.post("/api/vendors/:vendorId/restock", (req, res) => {
  try {
    const vendor = readVendor(req.params.vendorId);
    const mode = String(req.body?.mode || "missing").trim().toLowerCase();
    const template = ensureVendorTemplate(vendor);
    if (mode === "reset") {
      vendor.caps = Math.max(0, parseIntSafe(template.caps, 0));
      vendor.buyMultiplier = Number(template.buyMultiplier ?? 1);
      vendor.sellMultiplier = Number(template.sellMultiplier ?? 0.5);
      vendor.inventory = regenerateInventoryIdentities(template.inventory);
      vendor.mode = String(template.mode || vendor.mode || "manual");
      vendor.randomConfig = template.randomConfig ? deepClone(template.randomConfig) : null;
    } else if (mode === "missing") {
      restockMissingFromTemplate(vendor);
    } else return res.status(400).json({ok:false,reason:"Unknown restock mode."});
    vendor.lastBuiltAt = Date.now(); saveVendor(vendor); res.json({ok:true,vendor});
  } catch (err) { console.error(err); res.status(500).json({ok:false,reason:"Could not restock vendor."}); }
});
app.post("/api/vendors/:vendorId/regenerate", (req, res) => {
  try {
    const vendor = readVendor(req.params.vendorId);
    if (!Array.isArray(req.body?.inventory)) return res.status(400).json({ok:false,reason:"Generated inventory is required."});
    vendor.caps = Math.max(0, parseIntSafe(req.body?.caps, vendor.caps));
    vendor.inventory = regenerateInventoryIdentities(req.body.inventory.map(item=>normalizePayload(item)));
    vendor.mode = "generated";
    vendor.randomConfig = req.body?.randomConfig && typeof req.body.randomConfig === "object" ? deepClone(req.body.randomConfig) : vendor.randomConfig;
    vendor.lastBuiltAt = Date.now();
    vendor.template = makeVendorTemplate(vendor);
    saveVendor(vendor);
    res.json({ok:true,vendor});
  } catch (err) { console.error(err); res.status(500).json({ok:false,reason:"Could not regenerate vendor."}); }
});

app.post("/api/vendors/:vendorId/activate", (req, res) => {
  try {
    const vendorId = setActiveVendorId(req.params.vendorId);
    const vendor = readVendor(vendorId);

    res.json({
      ok: true,
      activeVendorId: vendorId,
      vendor
    });
  } catch (err) {
    console.error(err);
    res.status(404).json({ ok: false, reason: "Vendor does not exist." });
  }
});

app.delete("/api/vendors/:vendorId", (req, res) => {
  try {
    ensureVendorStorage();

    const vendorId = normalizeVendorId(req.params.vendorId);
    const targetPath = vendorFilePath(vendorId);

    if (!fs.existsSync(targetPath)) {
      return res.status(404).json({ ok: false, reason: "Vendor does not exist." });
    }

    const filesBefore = listVendorFiles();
    if (filesBefore.length <= 1) {
      return res.status(400).json({
        ok: false,
        reason: "At least one vendor must remain."
      });
    }

    fs.unlinkSync(targetPath);

    let activeVendorId = getActiveVendorId();
    if (!activeVendorId || activeVendorId === vendorId || !fs.existsSync(vendorFilePath(activeVendorId))) {
      const next = listVendorFiles()[0].replace(/\.json$/i, "");
      activeVendorId = setActiveVendorId(next);
    }

    res.json({
      ok: true,
      activeVendorId,
      vendor: readVendor(activeVendorId)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, reason: "Could not delete vendor." });
  }
});

app.get("/api/vendor", (req, res) => {
  try {
    const vendor = readVendor();
    const clientId = String(req.query?.clientId || "").trim();

    res.json({
      ...vendor,
      reservedByOthers: clientId
        ? reservationTotalsForVendor(vendor.vendorId, clientId)
        : reservationTotalsForVendor(vendor.vendorId, "")
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      ok: false,
      error: "Could not load vendor."
    });
  }
});

app.get("/api/transactions/:transactionId", (req, res) => {
  const transactionId = String(req.params.transactionId || "").trim();
  const transactions = readTransactions();
  const result = transactions[transactionId];

  if (!result) {
    return res.status(404).json({
      ok: false,
      reason: "Transaction not found."
    });
  }

  res.json(result);
});


app.post("/api/reservations/set", (req, res) => {
  try {
    const vendor = readVendor();
    const vendorId = String(req.body?.vendorId || vendor.vendorId).trim();

    if (normalizeVendorId(vendorId) !== vendor.vendorId) {
      return res.status(409).json({
        ok: false,
        reason: "The active vendor changed. Please refresh."
      });
    }

    const result = setClientReservation(
      vendor.vendorId,
      req.body?.clientId,
      req.body?.items
    );

    res.json({
      ok: true,
      vendorId: vendor.vendorId,
      ...result
    });
  } catch (err) {
    console.error(err);
    res.status(err?.code === "RESERVATION_CONFLICT" ? 409 : 400).json({
      ok: false,
      reason: err?.message || "Could not reserve items."
    });
  }
});

app.post("/api/reservations/clear", (req, res) => {
  try {
    const vendorId = String(req.body?.vendorId || getActiveVendorId()).trim();
    clearClientReservation(vendorId, req.body?.clientId);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(400).json({ ok: false, reason: "Could not clear reservation." });
  }
});

app.post("/api/trade/buy", (req, res) => {
  try {
    const transactionId = String(req.body?.transactionId || "").trim();
    const requestedItems = Array.isArray(req.body?.items) ? req.body.items : [];
    const expectedTotal = Math.max(0, parseIntSafe(req.body?.expectedTotal, 0));

    if (!transactionId) {
      return res.status(400).json({
        ok: false,
        reason: "Missing transaction ID."
      });
    }

    // Idempotency: retrying the same Confirm returns the same result and does
    // not remove the vendor inventory twice.
    const previous = readTransactions()[transactionId];
    if (previous) {
      return res.json(previous);
    }

    if (!requestedItems.length) {
      return res.status(400).json({
        ok: false,
        reason: "No items were requested."
      });
    }

    const vendor = readVendor();
    const tradeItems = vendorToTradeItems(vendor);
    const byId = new Map(tradeItems.map(item => [item.id, item]));

    let total = 0;
    const purchases = [];

    for (const requested of requestedItems) {
      const itemId = String(requested?.itemId || "").trim();
      const qty = Math.max(0, parseIntSafe(requested?.qty, 0));

      if (!itemId || qty <= 0) {
        return res.status(400).json({
          ok: false,
          reason: "Invalid purchase request."
        });
      }

      const item = byId.get(itemId);

      if (!item || qty > item.qty) {
        return res.status(409).json({
          ok: false,
          reason: "Vendor inventory changed. Please refresh and restage the trade."
        });
      }

      if (item.unique && qty !== 1) {
        return res.status(400).json({
          ok: false,
          reason: "Unique items can only be purchased one at a time."
        });
      }

      const unitPrice = priceBuy(item.baseCost, vendor.buyMultiplier);
      total += unitPrice * qty;

      purchases.push({
        itemId,
        qty,
        unitPrice,
        payload: deepClone(item.payload)
      });
    }

    // If the GM changed the buy multiplier after the player staged the trade,
    // reject rather than silently charging a different amount.
    if (total !== expectedTotal) {
      return res.status(409).json({
        ok: false,
        reason: "Vendor pricing changed. Please refresh and restage the trade.",
        currentTotal: total
      });
    }

    // Apply only after every requested item has validated.
    for (const purchase of purchases) {
      removePayloadFromInventory(
        vendor.inventory,
        purchase.payload,
        purchase.qty
      );
    }

    vendor.caps = Math.max(0, parseIntSafe(vendor.caps, 0) + total);
    vendor.lastBuiltAt = Date.now();

    saveVendor(vendor);

    const result = {
      ok: true,
      transactionId,
      total,
      purchases,
      vendorCaps: vendor.caps
    };

    saveTransaction(transactionId, result);

    res.json(result);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      ok: false,
      reason: "The vendor server could not complete the purchase."
    });
  }
});


app.post("/api/trade", (req, res) => {
  try {
    const transactionId = String(req.body?.transactionId || "").trim();
    const clientId = String(req.body?.clientId || "").trim();
    const requestedBuys = Array.isArray(req.body?.buys) ? req.body.buys : [];
    const requestedSells = Array.isArray(req.body?.sells) ? req.body.sells : [];
    const expectedBuyTotal = Math.max(0, parseIntSafe(req.body?.expectedBuyTotal, 0));
    const expectedSellTotal = Math.max(0, parseIntSafe(req.body?.expectedSellTotal, 0));

    if (!transactionId) {
      return res.status(400).json({
        ok: false,
        reason: "Missing transaction ID."
      });
    }

    const previous = readTransactions()[transactionId];
    if (previous) {
      return res.json(previous);
    }

    if (!requestedBuys.length && !requestedSells.length) {
      return res.status(400).json({
        ok: false,
        reason: "Nothing was submitted for trade."
      });
    }

    const vendor = readVendor();
    const vendorItems = vendorToTradeItems(vendor);
    const vendorById = new Map(vendorItems.map(item => [item.id, item]));
    const reservedByOthers = reservationTotalsForVendor(vendor.vendorId, clientId);

    let buyTotal = 0;
    let sellTotal = 0;
    const purchases = [];
    const sales = [];

    // Validate every purchase against the authoritative vendor inventory.
    for (const requested of requestedBuys) {
      const itemId = String(requested?.itemId || "").trim();
      const qty = Math.max(0, parseIntSafe(requested?.qty, 0));

      if (!itemId || qty <= 0) {
        return res.status(400).json({
          ok: false,
          reason: "Invalid purchase request."
        });
      }

      const item = vendorById.get(itemId);
      const reservedElsewhere = Math.max(0, parseIntSafe(reservedByOthers[itemId], 0));
      const available = Math.max(0, Math.max(0, parseIntSafe(item?.qty, 0)) - reservedElsewhere);

      if (!item || qty > available) {
        return res.status(409).json({
          ok: false,
          reason: "That item is reserved by another player or the vendor inventory changed."
        });
      }

      if (item.unique && qty !== 1) {
        return res.status(400).json({
          ok: false,
          reason: "Unique items can only be purchased one at a time."
        });
      }

      const unitPrice = priceBuy(item.baseCost, vendor.buyMultiplier);
      buyTotal += unitPrice * qty;

      purchases.push({
        itemId,
        qty,
        unitPrice,
        payload: deepClone(item.payload)
      });
    }

    // The server never requests the rest of the player's inventory. Each sale
    // contains only the exact item payload the player staged.
    for (const requested of requestedSells) {
      const itemId = String(requested?.itemId || "").trim();
      const qty = Math.max(0, parseIntSafe(requested?.qty, 0));
      const payload = normalizePayload(requested?.payload || {});

      if (!itemId || qty <= 0 || !payload.name) {
        return res.status(400).json({
          ok: false,
          reason: "Invalid sale request."
        });
      }

      if ((isCore(payload) || isUniqueRecord(payload)) && qty !== 1) {
        return res.status(400).json({
          ok: false,
          reason: "Unique items and charged cores can only be sold one at a time."
        });
      }

      const unitPrice = priceSell(getBaseCost(payload), vendor.sellMultiplier);
      sellTotal += unitPrice * qty;

      sales.push({
        itemId,
        qty,
        unitPrice,
        payload: deepClone(payload)
      });
    }

    if (buyTotal !== expectedBuyTotal) {
      return res.status(409).json({
        ok: false,
        reason: "Vendor buy pricing changed. Please refresh and restage the trade.",
        currentBuyTotal: buyTotal
      });
    }

    if (sellTotal !== expectedSellTotal) {
      return res.status(409).json({
        ok: false,
        reason: "Vendor sell pricing changed. Please refresh and restage the trade.",
        currentSellTotal: sellTotal
      });
    }

    const vendorCapsStart = Math.max(0, parseIntSafe(vendor.caps, 0));

    // Preserve the original Trade Menu rule: purchases in the same Confirm do
    // not increase the amount available to pay for sold goods.
    const vendorPayout = Math.min(vendorCapsStart, sellTotal);
    const forfeited = Math.max(0, sellTotal - vendorPayout);

    // Every validation has passed. Apply the vendor-side transaction atomically
    // in memory, then write vendor.json once.
    for (const purchase of purchases) {
      removePayloadFromInventory(
        vendor.inventory,
        purchase.payload,
        purchase.qty
      );
    }

    for (const sale of sales) {
      mergePayloadIntoInventory(
        vendor.inventory,
        sale.payload,
        sale.qty
      );
    }

    vendor.caps = Math.max(
      0,
      vendorCapsStart + buyTotal - vendorPayout
    );
    vendor.lastBuiltAt = Date.now();

    saveVendor(vendor);
    clearClientReservation(vendor.vendorId, clientId);

    const result = {
      ok: true,
      transactionId,
      buyTotal,
      sellTotal,
      vendorPayout,
      forfeited,
      purchases,
      sales,
      vendorCaps: vendor.caps
    };

    saveTransaction(transactionId, result);
    res.json(result);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      ok: false,
      reason: "The vendor server could not complete the trade."
    });
  }
});


app.patch("/api/vendor/settings", (req, res) => {
  try {
    const vendor = readVendor();

    if (req.body?.name !== undefined) {
      vendor.name = String(req.body.name || "").trim();
    }

    if (req.body?.caps !== undefined) {
      vendor.caps = Math.max(0, parseIntSafe(req.body.caps, vendor.caps));
    }

    if (req.body?.buyMultiplier !== undefined) {
      const value = Number(req.body.buyMultiplier);
      if (!Number.isFinite(value) || value < 0) {
        return res.status(400).json({ ok: false, reason: "Invalid buy multiplier." });
      }
      vendor.buyMultiplier = value;
    }

    if (req.body?.sellMultiplier !== undefined) {
      const value = Number(req.body.sellMultiplier);
      if (!Number.isFinite(value) || value < 0) {
        return res.status(400).json({ ok: false, reason: "Invalid sell multiplier." });
      }
      vendor.sellMultiplier = value;
    }

    vendor.lastBuiltAt = Date.now();
    saveVendor(vendor);

    res.json({ ok: true, vendor });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, reason: "Could not update vendor settings." });
  }
});

app.post("/api/vendor/inventory/add", (req, res) => {
  try {
    const vendor = readVendor();
    const payload = normalizePayload(req.body?.payload || {});
    const qty = Math.max(1, parseIntSafe(req.body?.qty, 1));

    if (!payload.name) {
      return res.status(400).json({ ok: false, reason: "Item payload is missing a name." });
    }

    mergePayloadIntoInventory(vendor.inventory, payload, qty);
    vendor.lastBuiltAt = Date.now();

    saveVendor(vendor);

    res.json({ ok: true, vendor });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, reason: "Could not add item to vendor." });
  }
});

app.post("/api/vendor/inventory/remove", (req, res) => {
  try {
    const vendor = readVendor();
    const itemId = String(req.body?.itemId || "").trim();
    const qty = Math.max(1, parseIntSafe(req.body?.qty, 1));

    if (!itemId) {
      return res.status(400).json({ ok: false, reason: "Missing item ID." });
    }

    const item = vendorToTradeItems(vendor).find(entry => entry.id === itemId);

    if (!item) {
      return res.status(404).json({ ok: false, reason: "Item no longer exists in vendor inventory." });
    }

    const amount = item.unique ? 1 : Math.min(qty, item.qty);

    removePayloadFromInventory(vendor.inventory, item.payload, amount);
    vendor.lastBuiltAt = Date.now();

    saveVendor(vendor);

    res.json({ ok: true, vendor });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, reason: "Could not remove item from vendor." });
  }
});



app.post("/api/vendor/inventory/customize", (req, res) => {
  try {
    const vendor = readVendor();
    const itemId = String(req.body?.itemId || "").trim();

    if (!itemId) {
      return res.status(400).json({ ok: false, reason: "Missing item ID." });
    }

    const tradeItem = vendorToTradeItems(vendor).find(entry => entry.id === itemId);
    if (!tradeItem) {
      return res.status(404).json({ ok: false, reason: "Item no longer exists in vendor inventory." });
    }

    if (isCore(tradeItem.payload)) {
      return res.status(400).json({ ok: false, reason: "Core customization is not supported here." });
    }

    let target = null;

    if (tradeItem.unique) {
      const instanceId = String(tradeItem.payload?.instanceId || "").trim();
      if (instanceId) {
        target = vendor.inventory.find(row => String(row?.instanceId || "").trim() === instanceId) || null;
      }
    }

    // Customizing one member of a normal stack splits exactly one unit into
    // its own persistent instance and leaves the remaining stack untouched.
    if (!target) {
      const sourceIdentity = getBaseIdentity(tradeItem.payload);
      const sourceRow = vendor.inventory.find(row =>
        !isCore(row) &&
        !isUniqueRecord(row) &&
        getBaseIdentity(row) === sourceIdentity
      );

      if (!sourceRow) {
        return res.status(404).json({ ok: false, reason: "Could not locate the vendor inventory record." });
      }

      const sourceQty = Math.max(0, parseIntSafe(sourceRow.qty, 0));
      if (sourceQty <= 0) {
        return res.status(400).json({ ok: false, reason: "That stack is empty." });
      }

      sourceRow.qty = String(sourceQty - 1);
      if (sourceQty - 1 <= 0) {
        const sourceIndex = vendor.inventory.indexOf(sourceRow);
        if (sourceIndex >= 0) vendor.inventory.splice(sourceIndex, 1);
      }

      target = deepClone(tradeItem.payload);
      target.qty = "1";
      target.instanceId = makeServerInstanceId("inv");
      target.selected = false;
      vendor.inventory.push(target);
    }

    const requestedName = String(req.body?.instanceName || "").trim();
    if (requestedName) target.instanceName = requestedName;
    else delete target.instanceName;

    const requestedOverride = req.body?.baseCostOverride;
    if (requestedOverride === null || requestedOverride === undefined || requestedOverride === "") {
      delete target.baseCostOverride;
    } else {
      target.baseCostOverride = Math.max(0, parseIntSafe(requestedOverride, 0));
    }

    target.addons = Array.isArray(req.body?.addons)
      ? deepClone(req.body.addons).filter(a => a && a.id)
      : [];

    const effectiveCost = Math.max(
      0,
      parseIntSafe(req.body?.cost ?? req.body?.baseCost, getBaseCost(target))
    );
    target.cost = String(effectiveCost);
    target.baseCost = effectiveCost;
    target.qty = "1";

    vendor.lastBuiltAt = Date.now();
    saveVendor(vendor);

    res.json({
      ok: true,
      vendor,
      itemId: getItemId(target)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, reason: "Could not customize vendor item." });
  }
});

app.post("/api/vendor/inventory/set-quantity", (req, res) => {
  try {
    const vendor = readVendor();
    const itemId = String(req.body?.itemId || "").trim();
    const newQty = Math.max(0, parseIntSafe(req.body?.quantity, 0));

    if (!itemId) {
      return res.status(400).json({ ok: false, reason: "Missing item ID." });
    }

    const item = vendorToTradeItems(vendor).find(entry => entry.id === itemId);

    if (!item) {
      return res.status(404).json({
        ok: false,
        reason: "Item no longer exists in vendor inventory."
      });
    }

    if (item.unique) {
      if (newQty === 0) {
        removePayloadFromInventory(vendor.inventory, item.payload, 1);
      } else if (newQty !== 1) {
        return res.status(400).json({
          ok: false,
          reason: "Unique items and charged cores have a quantity of 1."
        });
      }
    } else {
      const identity = getBaseIdentity(item.payload);
      const row = vendor.inventory.find(entry =>
        !isCore(entry) &&
        !isUniqueRecord(entry) &&
        getBaseIdentity(entry) === identity
      );

      if (!row) {
        return res.status(404).json({
          ok: false,
          reason: "Vendor stack no longer exists."
        });
      }

      if (newQty === 0) {
        const index = vendor.inventory.indexOf(row);
        if (index >= 0) vendor.inventory.splice(index, 1);
      } else {
        row.qty = String(newQty);
      }
    }

    vendor.lastBuiltAt = Date.now();
    saveVendor(vendor);

    res.json({ ok: true, vendor });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      ok: false,
      reason: "Could not update vendor quantity."
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Vault-Kit Vendor Server running on port ${PORT}`);
});
