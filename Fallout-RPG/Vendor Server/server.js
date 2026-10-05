const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: "2mb" }));

const vendorPath = path.join(__dirname, "data", "vendor.json");
const runtimeDir = path.join(__dirname, "runtime");
const transactionsPath = path.join(runtimeDir, "transactions.json");

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
  return Math.max(0, parseIntSafe(item?.baseCost ?? item?.cost, 0));
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

function readVendor() {
  const vendor = readJson(vendorPath, null);

  if (!vendor || typeof vendor !== "object") {
    throw new Error("Vendor file could not be loaded.");
  }

  if (!Array.isArray(vendor.inventory)) vendor.inventory = [];
  vendor.caps = Math.max(0, parseIntSafe(vendor.caps, 0));

  return vendor;
}

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

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    service: "Vault-Kit Vendor Server"
  });
});

app.get("/api/vendor", (req, res) => {
  try {
    res.json(readVendor());
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

    writeJsonAtomic(vendorPath, vendor);

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

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Vault-Kit Vendor Server running on port ${PORT}`);
});
