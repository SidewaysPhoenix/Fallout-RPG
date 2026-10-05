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

  if (copy.instanceName !== undefined) {
    copy.instanceName = String(copy.instanceName || "").trim();
    if (!copy.instanceName) delete copy.instanceName;
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


app.post("/api/trade", (req, res) => {
  try {
    const transactionId = String(req.body?.transactionId || "").trim();
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

    writeJsonAtomic(vendorPath, vendor);

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
    writeJsonAtomic(vendorPath, vendor);

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

    writeJsonAtomic(vendorPath, vendor);

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

    writeJsonAtomic(vendorPath, vendor);

    res.json({ ok: true, vendor });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, reason: "Could not remove item from vendor." });
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
    writeJsonAtomic(vendorPath, vendor);

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
