---
Sheet_Type: Vehicle
Vehicle_Cargo:
  - name: "[[Deathclaw Claw]]"
    yamlName: Deathclaw Gauntlet
    sourcePath: Fallout-RPG/Items/Weapons/Melee/Deathclaw Gauntlet.md
    qty: "1"
    cost: "75"
    selected: false
    category: WEAPONS
    weight: "10"
Fuel Type: Fusion Core
Max Fuel: 14
Current Fuel: 10
Vehicle_HP_Max: 40
Vehicle_HP_Current: 40
Weapon1: 105mm Cannon
Weapon1_Ammo: 105mm Round
Weapon1_Ammo_Qty: 0
Weapon2: 2x Minigun
Weapon2_Ammo: 5mm
Weapon2_Ammo_Qty: 0
Chassis Injury: false
Engine Injury: false
Weapon Injury: false
Wheel,Wing,Rudder Injury: false
---


```js-engine
(() => {
  const file = app.workspace.getActiveFile();
  if (!file) { container.textContent = "No active file."; return; }

  // ========= Keys =========
  const KEY_FUEL_TYPE = "Fuel Type";
  const KEY_FUEL_MAX  = "Max Fuel";
  const KEY_FUEL_CUR  = "Current Fuel";

  const KEY_HP_MAX = "Vehicle_HP_Max";
  const KEY_HP_CUR = "Vehicle_HP_Current";
  
    // ========= Injury Keys (match YAML exactly) =========
  const KEY_INJ_CHASSIS = "Chassis Injury";
  const KEY_INJ_ENGINE = "Engine Injury";
  const KEY_INJ_WEAPON = "Weapon Injury";
  const KEY_INJ_WWR    = "Wheel,Wing,Rudder Injury";


  function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }

  function getFM() {
    return app.metadataCache.getFileCache(file)?.frontmatter ?? {};
  }

  function readFuel() {
    const fm = getFM();
    const fuelType = fm[KEY_FUEL_TYPE] ?? "Unknown Fuel";
    const maxFuel = Math.max(1, Number(fm[KEY_FUEL_MAX] ?? 1));
    const curFuel = clamp(Number(fm[KEY_FUEL_CUR] ?? 0), 0, maxFuel);
    const pct = Math.round((curFuel / maxFuel) * 100);
    return { fuelType, maxFuel, curFuel, pct };
  }

  function readHP() {
    const fm = getFM();
    const maxHP = Math.max(1, Number(fm[KEY_HP_MAX] ?? 1));
    const curHP = clamp(Number(fm[KEY_HP_CUR] ?? maxHP), 0, maxHP);
    const pct = Math.round((curHP / maxHP) * 100);
    return { maxHP, curHP, pct };
  }

  function readWeapons() {
    const fm = getFM();
    const weapons = [];
    for (let i = 1; i <= 50; i++) {
      const wName = fm[`Weapon${i}`];
      const aName = fm[`Weapon${i}_Ammo`];
      const aQty  = fm[`Weapon${i}_Ammo_Qty`];

      // Stop scanning once we hit the first missing WeaponN
      if (wName === undefined || wName === null || String(wName).trim() === "") break;

      weapons.push({
        idx: i,
        weapon: String(wName),
        ammo: (aName === undefined || aName === null) ? "" : String(aName),
        qty: Number(aQty ?? 0) || 0
      });
    }
    return weapons;
  }

  async function writeFM(mutator) {
    await app.fileManager.processFrontMatter(file, (fm) => {
      mutator(fm);
    });
  }

  async function setFuel(val) {
    await writeFM((fm) => {
      const maxFuel = Math.max(1, Number(fm[KEY_FUEL_MAX] ?? 1));
      fm[KEY_FUEL_CUR] = clamp(Number(val ?? 0), 0, maxFuel);
    });
  }
  async function deltaFuel(delta) {
    const { curFuel } = readFuel();
    await setFuel(curFuel + delta);
  }

  async function setHP(val) {
    await writeFM((fm) => {
      const maxHP = Math.max(1, Number(fm[KEY_HP_MAX] ?? 1));
      fm[KEY_HP_CUR] = clamp(Number(val ?? 0), 0, maxHP);
    });
  }
  async function deltaHP(delta) {
    const { curHP } = readHP();
    await setHP(curHP + delta);
  }

  async function setAmmo(idx, val) {
    await writeFM((fm) => {
      const key = `Weapon${idx}_Ammo_Qty`;
      fm[key] = Math.max(0, Number(val ?? 0) || 0);
    });
  }
  async function deltaAmmo(idx, delta) {
    const weapons = readWeapons();
    const w = weapons.find(x => x.idx === idx);
    const cur = w ? (Number(w.qty) || 0) : 0;
    await setAmmo(idx, cur + delta);
  }

  function makeBtn(text, onClick, opts = {}) {
    const b = document.createElement("button");
    b.textContent = text;
    b.style.cursor = "pointer";
    b.style.border = "1px solid #000";
    b.style.background = opts.bg ?? "#333";
    b.style.color = "#fde4c9";
    b.style.borderRadius = "8px";
    b.style.padding = "2px 8px";
    b.style.fontSize = "12px";
    b.onclick = onClick;
    return b;
  }

  function makeNumberInput(value, min, max, width = 64) {
    const input = document.createElement("input");
    input.type = "number";
    input.value = String(value ?? 0);
    if (min !== undefined) input.min = String(min);
    if (max !== undefined) input.max = String(max);
    input.style.width = `${width}px`;
    input.style.color = "#fde4c9";
    input.style.border = "2px solid rgb(34, 54, 87)";
    input.style.borderRadius = "8px";
    input.style.padding = "2px 6px";
    input.style.fontSize = "12px";
    input.style.background = "#2c3e50";
    return input;
  }

  function makePanelBase() {
    const wrap = document.createElement("div");
    wrap.style.border = "2px solid rgb(34, 54, 87)";
    wrap.style.background = "#325886";
    wrap.style.padding = "12px";
    wrap.style.borderRadius = "10px";
    wrap.style.margin = "10px 0";
    return wrap;
  }

  function makeHeader(titleText, rightControlsEl) {
    const header = document.createElement("div");
    header.style.display = "flex";
    header.style.justifyContent = "space-between";
    header.style.alignItems = "center";
    header.style.marginBottom = "6px";

    const title = document.createElement("div");
    title.textContent = titleText;
    title.style.color = "#ffc200";
    title.style.fontWeight = "700";
    title.style.fontSize = "14px";

    header.append(title, rightControlsEl);
    return header;
  }

  function makeControlRow(buttons = [], inputEl = null, setHandler = null) {
    const controls = document.createElement("div");
    controls.style.display = "flex";
    controls.style.gap = "6px";
    controls.style.alignItems = "center";

    for (const b of buttons) controls.appendChild(b);

    if (inputEl) {
      inputEl.style.marginLeft = "10px";
      controls.appendChild(inputEl);
    }

    if (setHandler) {
      const setBtn = makeBtn("Set", setHandler, { bg: "#325886" });
      controls.appendChild(setBtn);
    }

    return controls;
  }

  function makeLabel(text) {
    const label = document.createElement("div");
    label.textContent = text;
    label.style.textAlign = "center";
    label.style.fontSize = "12px";
    label.style.color = "#fde4c9";
    label.style.marginTop = "6px";
    return label;
  }

  function showVehicleNotice(message, duration = 2000) {
    const note = document.createElement("div");
    note.textContent = message;
    note.style = `
      position:fixed;bottom:30px;left:50%;transform:translateX(-50%);
      background:#ffc200;color:#2e4663;font-weight:bold;
      padding:13px 38px;border-radius:9px;z-index:99999;
      font-size:1.1em;box-shadow:0 2px 18px #0003;
      border:2px solid #2e4663;text-align:center;
      transition:opacity 0.3s;opacity:1;`;
    document.body.appendChild(note);
    setTimeout(() => {
      note.style.opacity = "0";
      setTimeout(() => note.remove(), 350);
    }, duration);
  }

  function makeSegments(filledCount, totalCount) {
    const segments = document.createElement("div");
    segments.style.display = "grid";
    segments.style.gridTemplateColumns = "repeat(auto-fit, minmax(12px, 1fr))";
    segments.style.gap = "4px";
    segments.style.marginTop = "8px";

    for (let i = 0; i < totalCount; i++) {
      const seg = document.createElement("div");
      seg.style.height = "10px";
      seg.style.borderRadius = "2px";
      if (i < filledCount) {
        seg.style.background = "#efdd6f";
        seg.style.boxShadow = "0 0 4px rgba(239,221,111,0.6)";
      } else {
        seg.style.background = "#222";
        seg.style.border = "1px solid #333";
      }
      segments.appendChild(seg);
    }

    return segments;
  }

  function makeBar(pct, variant = "fuel") {
    // Optional bar if you want it for HP too. Kept minimal.
    const barOuter = document.createElement("div");
    barOuter.style.width = "100%";
    barOuter.style.height = "18px";
    barOuter.style.background = "#222222";
    barOuter.style.border = "2px solid black";
    barOuter.style.borderRadius = "0px";
    barOuter.style.overflow = "hidden";
    barOuter.style.boxSizing = "border-box";
    barOuter.style.boxShadow = "rgb(0, 0, 0) 0px 2px 12px"

    const barInner = document.createElement("div");
    barInner.style.height = "100%";
    barInner.style.width = `${pct}%`;
    barInner.style.transition = "width 0.2s ease";

	
	if (pct >= 50) {
	barInner.style.background = "rgb(27, 255, 128)";
	}
	else if (pct >= 25) {
    barInner.style.background = "rgb(255, 196, 0)";    // Yellow (Damaged)
	} 
	else {
    barInner.style.background = "rgb(255, 64, 64)";    // Red (Critical)
	}
    //barInner.style.background = "rgb(27, 255, 128)";

    barOuter.appendChild(barInner);
    return barOuter;
  }
  
    function toBool(v) {
    if (typeof v === "boolean") return v;
    if (typeof v === "number") return v !== 0;
    const s = String(v ?? "").trim().toLowerCase();
    return s === "true" || s === "yes" || s === "1" || s === "on";
  }

  function readInjuries() {
    const fm = getFM();
    return {
      chassis: toBool(fm[KEY_INJ_CHASSIS]),
      engine: toBool(fm[KEY_INJ_ENGINE]),
      weapon: toBool(fm[KEY_INJ_WEAPON]),
      wwr: toBool(fm[KEY_INJ_WWR]),
    };
  }

  async function setInjury(key, val) {
    await writeFM((fm) => {
      fm[key] = !!val;
    });
  }




  // ========= Cargo / Character Transfer =========
  const KEY_CARGO = "Vehicle_Cargo";
  const CHARACTER_GEAR_KEY = "fallout_gear_table";
  const CHARACTER_SHEET_KEY = "falloutRPGCharacterSheet";

  function stripWikiLink(value) {
    return String(value ?? "").replace(/^\[\[(.*?)\]\]$/, "$1").trim();
  }

  function cargoItemIdentity(item) {
    const source = String(item?.sourcePath || item?.yamlName || "").trim().toLowerCase();
    const displayName = stripWikiLink(item?.name || item?.link || item?.yamlName || "").trim().toLowerCase();
    return `${source}::${displayName}`;
  }

  function coreType(item) {
    const candidates = [
      item?.yamlName,
      String(item?.sourcePath || "").split("/").pop()?.replace(/\.md$/i, ""),
      item?.name,
      item?.link,
    ];
    for (const raw of candidates) {
      const clean = stripWikiLink(raw).toLowerCase();
      if (clean === "fusion core") return "fusion";
      if (clean === "plasma core") return "plasma";
    }
    return null;
  }

  function isCore(item) { return !!coreType(item); }

  function readCargo() {
    const cargo = getFM()[KEY_CARGO];
    return Array.isArray(cargo) ? JSON.parse(JSON.stringify(cargo)) : [];
  }

  async function writeCargo(cargo) {
    await writeFM(fm => { fm[KEY_CARGO] = cargo; });
  }

  function parseItemWeight(value) {
    const text = String(value ?? "").trim();
    if (!text) return 0;
    if (text === "<1") return 0.5;
    const m = text.match(/-?\d+(?:\.\d+)?/);
    const n = m ? Number(m[0]) : 0;
    return Number.isFinite(n) ? n : 0;
  }

  function formatWeightNumber(value) {
    const n = Number(value);
    if (!Number.isFinite(n)) return "0";
    return Number.isInteger(n) ? String(n) : String(Math.round(n * 100) / 100);
  }

  function cargoQty(item) {
    return isCore(item)
      ? (Array.isArray(item.chargeUnits) ? item.chargeUnits.length : 0)
      : Math.max(0, parseInt(item.qty ?? 0, 10) || 0);
  }

  function getCurrentCharacterName() {
    try {
      const data = JSON.parse(localStorage.getItem(CHARACTER_SHEET_KEY) || "{}");
      return String(data.Name || "Current Character");
    } catch {
      return "Current Character";
    }
  }

  function readCharacterGear() {
    try {
      const rows = JSON.parse(localStorage.getItem(CHARACTER_GEAR_KEY) || "[]");
      return Array.isArray(rows) ? rows : [];
    } catch { return []; }
  }

  function writeCharacterGear(rows) {
    localStorage.setItem(CHARACTER_GEAR_KEY, JSON.stringify(rows));
    window.dispatchEvent(new Event("fallout:gear-updated"));
  }

  function mergeIntoCharacterGear(rows, sourceItem, qtyOrUnits) {
    const id = cargoItemIdentity(sourceItem);
    let existing = rows.find(item => cargoItemIdentity(item) === id);
    const charged = isCore(sourceItem);
    if (!existing) {
      existing = JSON.parse(JSON.stringify(sourceItem));
      existing.selected = false;
      if (charged) {
        existing.chargeUnits = [];
        existing.qty = "0";
      } else {
        existing.qty = "0";
      }
      rows.push(existing);
    }
    if (charged) {
      if (!Array.isArray(existing.chargeUnits)) existing.chargeUnits = [];
      existing.chargeUnits.push(...JSON.parse(JSON.stringify(qtyOrUnits)));
      existing.qty = String(existing.chargeUnits.length);
    } else {
      existing.qty = String((parseInt(existing.qty ?? 0, 10) || 0) + Number(qtyOrUnits || 0));
    }
  }

  function showCargoTransferDialog(item, onTransfer) {
    const overlay = document.createElement("div");
    overlay.style = "position:fixed;inset:0;background:rgba(30,40,50,0.86);z-index:9999;display:flex;align-items:center;justify-content:center;";
    const modal = document.createElement("div");
    modal.style = "background:#325886;padding:22px;border-radius:14px;box-shadow:0 8px 44px #111b2d88;border:3px solid #ffc200;min-width:340px;max-width:95vw;color:#fff;";
    const title = document.createElement("div");
    title.textContent = `Transfer ${stripWikiLink(item.name || item.link || "Item")} to ${getCurrentCharacterName()}`;
    title.style = "color:#ffc200;font-weight:bold;font-size:1.15em;text-align:center;margin-bottom:14px;";
    modal.appendChild(title);

    let qtyInput = null;
    const selectedIndexes = new Set();
    if (isCore(item)) {
      const help = document.createElement("div");
      help.textContent = "Select the cores to transfer:";
      help.style = "color:#efdd6f;margin-bottom:8px;";
      modal.appendChild(help);
      const units = Array.isArray(item.chargeUnits) ? item.chargeUnits : [];
      const type = coreType(item);
      const list = document.createElement("div");
      list.style = "display:flex;flex-direction:column;gap:6px;max-height:250px;overflow:auto;margin-bottom:12px;";
      units.forEach((unit, index) => {
        const row = document.createElement("label");
        row.style = "display:flex;align-items:center;gap:8px;background:#2e4663;padding:6px 8px;border-radius:6px;cursor:pointer;";
        const cb = document.createElement("input");
        cb.type = "checkbox";
        cb.onchange = () => cb.checked ? selectedIndexes.add(index) : selectedIndexes.delete(index);
        const max = type === "plasma" ? 500 : Number(unit.maxCharges ?? 0);
        const txt = document.createElement("span");
        txt.textContent = `${Number(unit.charges ?? 0)} / ${max}`;
        row.append(cb, txt);
        list.appendChild(row);
      });
      modal.appendChild(list);
    } else {
      const row = document.createElement("label");
      row.style = "display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:12px;";
      const label = document.createElement("span");
      label.textContent = "Quantity:";
      qtyInput = document.createElement("input");
      qtyInput.type = "number";
      qtyInput.min = "1";
      qtyInput.max = String(Math.max(1, cargoQty(item)));
      qtyInput.value = "1";
      qtyInput.style = "width:90px;background:#fde4c9;color:#222;border:1.5px solid #ffc200;border-radius:5px;padding:5px;text-align:center;";
      row.append(label, qtyInput);
      modal.appendChild(row);
    }

    const error = document.createElement("div");
    error.style = "color:#ffb3b3;font-weight:bold;text-align:center;min-height:1.2em;margin-bottom:8px;";
    modal.appendChild(error);
    const buttons = document.createElement("div");
    buttons.style = "display:flex;gap:12px;justify-content:center;";
    const transfer = makeBtn("Transfer", async () => {
      if (isCore(item)) {
        if (!selectedIndexes.size) { error.textContent = "Select at least one core."; return; }
        await onTransfer({ coreIndexes: [...selectedIndexes].sort((a,b) => a-b) });
      } else {
        const qty = Math.floor(Number(qtyInput.value));
        const max = cargoQty(item);
        if (!Number.isFinite(qty) || qty < 1 || qty > max) { error.textContent = `Enter a quantity from 1 to ${max}.`; return; }
        await onTransfer({ qty });
      }
      document.body.removeChild(overlay);
    }, { bg: "#ffc200" });
    transfer.style.color = "#214a72";
    transfer.style.fontWeight = "bold";
    const cancel = makeBtn("Cancel", () => document.body.removeChild(overlay), { bg: "#325886" });
    cancel.style.border = "2px solid #ffc200";
    cancel.style.color = "#ffc200";
    buttons.append(transfer, cancel);
    modal.appendChild(buttons);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
  }

  function renderCargoPanel() {
    const cargo = readCargo();
    const panel = makePanelBase();
    const titleRow = document.createElement("div");
    titleRow.style = "display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;";
    const title = document.createElement("div");
    title.textContent = "Vehicle Cargo";
    title.style = "color:#ffc200;font-weight:700;font-size:14px;";
    const totalWeight = cargo.reduce((sum, item) => sum + parseItemWeight(item.weight) * cargoQty(item), 0);
    const total = document.createElement("div");
    total.textContent = `${formatWeightNumber(totalWeight)} lbs`;
    total.style = "color:#efdd6f;font-size:12px;font-weight:700;";
    titleRow.append(title, total);
    panel.appendChild(titleRow);

    if (!cargo.length) {
      const empty = document.createElement("div");
      empty.textContent = "No cargo stored in this vehicle.";
      empty.style = "color:#fde4c9;font-size:12px;opacity:0.9;";
      panel.appendChild(empty);
      return panel;
    }

    const table = document.createElement("table");
    table.style = "width:100%;border-collapse:collapse;font-size:12px;";
    const thead = document.createElement("thead");
    const hr = document.createElement("tr");
    ["Name", "Qty", "Cost", "Weight", "Actions"].forEach(h => {
      const th = document.createElement("th");
      th.textContent = h;
      th.style = "text-align:center;color:#efdd6f;padding:5px;";
      hr.appendChild(th);
    });
    thead.appendChild(hr); table.appendChild(thead);
    const tbody = document.createElement("tbody");

    cargo.forEach((item, index) => {
      const tr = document.createElement("tr");
      const nameTd = document.createElement("td");
      nameTd.style = "text-align:left;padding:6px;color:#fde4c9;border-top:1px solid #294c75;";
      const rawName = String(item.name || item.link || "");
      if (/\[\[.*?\]\]/.test(rawName)) {
        const renderedName = document.createElement("span");
        nameTd.appendChild(renderedName);
        MarkdownRenderer.renderMarkdown(rawName, renderedName, file.path, null);
      } else {
        nameTd.textContent = rawName;
      }
      tr.appendChild(nameTd);

      [
        String(cargoQty(item)),
        String(item.cost ?? ""),
        `${String(item.weight ?? "")} (${formatWeightNumber(parseItemWeight(item.weight) * cargoQty(item))})`,
      ].forEach((value) => {
        const td = document.createElement("td");
        td.textContent = value;
        td.style = "text-align:center;padding:6px;color:#fde4c9;border-top:1px solid #294c75;";
        tr.appendChild(td);
      });
      const actions = document.createElement("td");
      actions.style = "text-align:center;padding:6px;border-top:1px solid #294c75;white-space:nowrap;";
      const move = document.createElement("span");
      move.textContent = "⇄";
      move.title = `Transfer to ${getCurrentCharacterName()}`;
      move.style = "cursor:pointer;color:#ffc200;font-size:1.25em;font-weight:bold;margin-right:10px;text-shadow:2px 2px 5px black;";
      move.onclick = () => showCargoTransferDialog(item, async selection => {
        const rows = readCharacterGear();
        if (isCore(item)) {
          const indexes = selection.coreIndexes || [];
          const units = Array.isArray(item.chargeUnits) ? item.chargeUnits : [];
          const moved = indexes.map(i => units[i]).filter(Boolean);
          mergeIntoCharacterGear(rows, item, moved);
          const removeSet = new Set(indexes);
          item.chargeUnits = units.filter((_, i) => !removeSet.has(i));
          item.qty = String(item.chargeUnits.length);
          if (!item.chargeUnits.length) cargo.splice(index, 1);
        } else {
          const qty = Number(selection.qty || 0);
          mergeIntoCharacterGear(rows, item, qty);
          const remaining = cargoQty(item) - qty;
          if (remaining <= 0) cargo.splice(index, 1);
          else item.qty = String(remaining);
        }
        writeCharacterGear(rows);
        await writeCargo(cargo);
        showVehicleNotice(`Transferred ${stripWikiLink(item.name || item.link || "Item")} to ${getCurrentCharacterName()}.`);
      });
      const del = document.createElement("span");
      del.textContent = "🗑️";
      del.title = "Remove cargo item";
      del.style = "cursor:pointer;text-shadow:2px 2px 5px black;";
      del.onclick = async () => { cargo.splice(index, 1); await writeCargo(cargo); };
      actions.append(move, del);
      tr.appendChild(actions);
      tbody.appendChild(tr);

      if (isCore(item)) {
        const cr = document.createElement("tr");
        const cd = document.createElement("td");
        cd.colSpan = 5;
        cd.style = "padding:4px 8px 8px 8px;background:#06080c40;color:#c5c5c5;";
        const label = document.createElement("span");
        label.textContent = "Charges: "; label.style.color = "#efdd6f";
        cd.appendChild(label);
        const type = coreType(item);
        (item.chargeUnits || []).forEach((unit, ui) => {
          const chip = document.createElement("span");
          const max = type === "plasma" ? 500 : Number(unit.maxCharges ?? 0);
          chip.textContent = `${Number(unit.charges ?? 0)} / ${max}`;
          chip.style = "display:inline-block;padding:2px 8px;margin:2px 4px;border-radius:999px;background:#383838ab;";
          cd.appendChild(chip);
        });
        cr.appendChild(cd); tbody.appendChild(cr);
      }
    });

    table.appendChild(tbody); panel.appendChild(table);
    return panel;
  }

  function render() {
    if (container.empty) container.empty();
    else container.innerHTML = "";

	    // ========= Vehicle HP Panel =========
    const { maxHP, curHP, pct: hpPct } = readHP();
    const hpPanel = makePanelBase();

    const hpInput = makeNumberInput(curHP, 0, maxHP, 64);
    const hpControls = makeControlRow(
      [
        makeBtn("−10", async () => { await deltaHP(-10); }),
        makeBtn("−1", async () => { await deltaHP(-1); }),
        makeBtn("+1", async () => { await deltaHP(1); }),
        makeBtn("+10", async () => { await deltaHP(10); }),
      ],
      hpInput,
      async () => { await setHP(Number(hpInput.value)); }
    );

    hpPanel.appendChild(makeHeader("Vehicle HP", hpControls));
    hpPanel.appendChild(makeBar(hpPct, "hp"));
    hpPanel.appendChild(makeLabel(`${curHP} / ${maxHP} HP (${hpPct}%)`));

    container.appendChild(hpPanel);
    
        // ========= Injuries Panel =========
    const injuriesPanel = makePanelBase();
    const { chassis, engine, weapon, wwr } = readInjuries();

    // Header (no right controls)
    const injuriesHeaderRight = document.createElement("div"); // empty placeholder
    injuriesPanel.appendChild(makeHeader("Vehicle Injuries", injuriesHeaderRight));

    const grid = document.createElement("div");
    grid.style.display = "grid";
    grid.style.gridTemplateColumns = "repeat(2, minmax(0, 1fr))";
    grid.style.gap = "8px";
    grid.style.marginTop = "8px";

    function makeCheckboxRow(labelText, key, checked) {
      const row = document.createElement("label");
      row.style.display = "flex";
      row.style.alignItems = "center";
      row.style.gap = "8px";
      row.style.padding = "6px 8px";
      row.style.border = "2px solid rgb(34, 54, 87)";
      row.style.borderRadius = "8px";
      row.style.background = "#2e4663";
      row.style.cursor = "pointer";
      row.style.userSelect = "none";

      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.checked = !!checked;
      cb.style.transform = "scale(1.1)";
      cb.style.cursor = "pointer";

      const text = document.createElement("div");
      text.textContent = labelText;
      text.style.color = "#fde4c9";
      text.style.fontWeight = "700";
      text.style.fontSize = "12px";

      cb.addEventListener("change", async () => {
        await setInjury(key, cb.checked);
      });

      row.append(cb, text);
      return row;
    }

    // Checkboxes (match your YAML keys)
    grid.appendChild(makeCheckboxRow("Chassis", KEY_INJ_CHASSIS, chassis));
    grid.appendChild(makeCheckboxRow("Engine", KEY_INJ_ENGINE, engine));
    grid.appendChild(makeCheckboxRow("Weapon", KEY_INJ_WEAPON, weapon));
    grid.appendChild(makeCheckboxRow("Wheel / Wing / Rudder", KEY_INJ_WWR, wwr));

    injuriesPanel.appendChild(grid);

    // Effects text (only show flagged injuries)
    const effectsWrap = document.createElement("div");
    effectsWrap.style.marginTop = "10px";
    effectsWrap.style.padding = "10px";
    effectsWrap.style.border = "2px solid rgb(34, 54, 87)";
    effectsWrap.style.borderRadius = "8px";
    effectsWrap.style.background = "#2c3e50";

    const any = chassis || engine || weapon || wwr;

    if (!any) {
      const none = document.createElement("div");
      none.textContent = "No injuries currently active.";
      none.style.color = "#fde4c9";
      none.style.fontSize = "12px";
      none.style.opacity = "0.9";
      effectsWrap.appendChild(none);
    } else {
      function addEffect(title, desc) {
        const t = document.createElement("div");
        t.textContent = title;
        t.style.color = "#ffc200";
        t.style.fontWeight = "800";
        t.style.fontSize = "12px";
        t.style.marginTop = "6px";

        const d = document.createElement("div");
        d.textContent = desc;
        d.style.color = "#fde4c9";
        d.style.fontSize = "12px";
        d.style.marginTop = "2px";
        d.style.lineHeight = "1.3";

        effectsWrap.appendChild(t);
        effectsWrap.appendChild(d);
      }

      if (chassis) {
        addEffect(
          "Chassis",
          "Chassis Injuries weaken the structure of the vehicle. Attacks against a vehicle with a Chassis Injury deal +2 d6 additional damage."
        );
      }
      if (engine) {
        addEffect(
          "Engine",
          "Engine Injuries result in leaking fuel and potentially catastrophic fires. At the beginning of each of its Turns, a vehicle with an Engine Injury degrades its Fuel Track by 1. In addition, if a vehicle is reduced to 0HP and has suffered an Engine Injury, roll d6. If an effect is rolled, the vehicle explodes, inflicting 6 d6 Energy damage to everyone within Close range."
        );
      }
      if (weapon) {
        addEffect(
          "Weapon",
          "Weapon Injuries disable associated weapon systems mounted on the vehicle until repaired."
        );
      }
      if (wwr) {
        addEffect(
          "Wheel, Wing, Rudder",
          "Wheel, Wing, and Rudder Injuries make the vehicle harder to control. Pilot tests to operate the vehicle increase in difficulty by +1, and the vehicle’s Speed is reduced by 1."
        );
      }
    }

    injuriesPanel.appendChild(effectsWrap);
    container.appendChild(injuriesPanel);


    // ========= Fuel Panel =========
    const { fuelType, maxFuel, curFuel, pct: fuelPct } = readFuel();

    const fuelPanel = makePanelBase();

    const fuelInput = makeNumberInput(curFuel, 0, maxFuel, 64);
    const fuelControls = makeControlRow(
      [
        makeBtn("−5", async () => { await deltaFuel(-5); }),
        makeBtn("−1", async () => { await deltaFuel(-1); }),
        makeBtn("+1", async () => { await deltaFuel(1); }),
        makeBtn("+5", async () => { await deltaFuel(5); }),
      ],
      fuelInput,
      async () => { await setFuel(Number(fuelInput.value)); }
    );

    fuelPanel.appendChild(makeHeader(fuelType, fuelControls))
    fuelPanel.appendChild(makeLabel(`${curFuel} / ${maxFuel} Charges (${fuelPct}%)`));
    fuelPanel.appendChild(makeSegments(curFuel, maxFuel));

    container.appendChild(fuelPanel);

    // ========= Weapons / Ammo Panels =========
    const weapons = readWeapons();

    const weaponsPanel = makePanelBase();
    const wTitleRow = document.createElement("div");
    wTitleRow.style.display = "flex";
    wTitleRow.style.justifyContent = "space-between";
    wTitleRow.style.alignItems = "center";
    wTitleRow.style.marginBottom = "8px";

    const wTitle = document.createElement("div");
    wTitle.textContent = "Weapons & Ammo";
    wTitle.style.color = "#ffc200";
    wTitle.style.fontWeight = "700";
    wTitle.style.fontSize = "14px";

    weaponsPanel.appendChild(wTitle);

    if (!weapons.length) {
      const empty = document.createElement("div");
      empty.textContent = "No weapons found. Add Weapon1 / Weapon1_Ammo / Weapon1_Ammo_Qty to Properties.";
      empty.style.color = "#fde4c9";
      empty.style.fontSize = "12px";
      empty.style.opacity = "0.9";
      weaponsPanel.appendChild(empty);
    } else {
      for (const w of weapons) {
        const row = document.createElement("div");
        row.style.display = "grid";
        row.style.gridTemplateColumns = "1fr auto";
        row.style.alignItems = "center";
        row.style.gap = "10px";
        row.style.padding = "8px";
        row.style.border = "2px solid rgb(34, 54, 87)";
        row.style.borderRadius = "8px";
        row.style.background = "#2e4663";
        row.style.marginTop = "8px";

        const left = document.createElement("div");

        const weaponLine = document.createElement("div");
        weaponLine.style.color = "#fde4c9";
        weaponLine.style.fontWeight = "700";
        weaponLine.style.fontSize = "13px";
        weaponLine.textContent = w.weapon;

        const ammoLine = document.createElement("div");
        ammoLine.style.color = "#efdd6f";
        ammoLine.style.fontSize = "12px";
        ammoLine.style.opacity = "0.95";
        ammoLine.textContent = w.ammo ? `${w.ammo}: ${w.qty}` : `Ammo: ${w.qty}`;

        left.appendChild(weaponLine);
        left.appendChild(ammoLine);

        const right = document.createElement("div");
        right.style.display = "flex";
        right.style.alignItems = "center";
        right.style.gap = "6px";

        const qtyInput = makeNumberInput(w.qty, 0, undefined, 72);
        qtyInput.style.background = "#2c3e50";
        qtyInput.style.color = "#fde4c9";
        qtyInput.style.border = "2px solid rgb(34, 54, 87)"

        const bMinus10 = makeBtn("−10", async () => { await deltaAmmo(w.idx, -10); });
        const bMinus1  = makeBtn("−1",  async () => { await deltaAmmo(w.idx, -1); });
        const bPlus1   = makeBtn("+1",  async () => { await deltaAmmo(w.idx, 1); });
        const bPlus10  = makeBtn("+10", async () => { await deltaAmmo(w.idx, 10); });
        const bSet     = makeBtn("Set", async () => { await setAmmo(w.idx, Number(qtyInput.value)); }, { bg: "#325886" });

        right.append(bMinus10, bMinus1, bPlus1, bPlus10, qtyInput, bSet);

        row.append(left, right);
        weaponsPanel.appendChild(row);
      }
    }

    container.appendChild(weaponsPanel);

    // ========= Vehicle Cargo =========
    container.appendChild(renderCargoPanel());
  }

  // Re-render when metadata changes
  const onMeta = (changedFile) => {
    if (changedFile?.path === file.path) render();
  };
  app.metadataCache.on("changed", onMeta);

  // Cleanup best-effort
  const detach = () => app.metadataCache.off("changed", onMeta);
  if (typeof ctx !== "undefined" && ctx?.onunload) ctx.onunload(detach);

  render();
  return;
})();

```


![[Jimmy's APC]]