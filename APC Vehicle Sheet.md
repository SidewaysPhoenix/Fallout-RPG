---
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


![[APC]]