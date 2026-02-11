---
Fuel Type: Fusion Core
Max Fuel: 14
Current Fuel: 14
Vehicle_HP_Max: 40
Vehicle_HP_Current: 21
Weapon1: 105mm Cannon
Weapon1_Ammo: 105mm Round
Weapon1_Ammo_Qty: 120
Weapon2: 2x Minigun
Weapon2_Ammo: 5mm
Weapon2_Ammo_Qty: 600
Chasis Injury: false
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