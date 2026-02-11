---
Fuel Type: Fusion Core
Max Fuel: 14
Current Fuel: 5
---

```js-engine
(() => {
  const file = app.workspace.getActiveFile();
  if (!file) { container.textContent = "No active file."; return; }

  const KEY_TYPE = "Fuel Type";
  const KEY_MAX = "Max Fuel";
  const KEY_CUR = "Current Fuel";

  function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }

  function readFM() {
    const fm = app.metadataCache.getFileCache(file)?.frontmatter ?? {};
    const fuelType = fm[KEY_TYPE] ?? "Unknown Fuel";
    const maxFuel = Math.max(1, Number(fm[KEY_MAX] ?? 1));
    const curFuel = clamp(Number(fm[KEY_CUR] ?? 0), 0, maxFuel);
    const pct = Math.round((curFuel / maxFuel) * 100);
    return { fuelType, maxFuel, curFuel, pct };
  }

  async function writeCurrentFuel(nextVal) {
    // Writes back into YAML frontmatter (Properties)
    await app.fileManager.processFrontMatter(file, (fm) => {
      const maxFuel = Math.max(1, Number(fm[KEY_MAX] ?? 1));
      fm[KEY_CUR] = clamp(Number(nextVal ?? 0), 0, maxFuel);
    });
  }

  async function deltaFuel(delta) {
    const { curFuel } = readFM();
    await writeCurrentFuel(curFuel + delta);
  }

  function render() {
    if (container.empty) container.empty();
    else container.innerHTML = "";

    const { fuelType, maxFuel, curFuel, pct } = readFM();

    const wrap = document.createElement("div");
    wrap.className = "fusion-gauge-container";
    wrap.style.border = "2px solid #325886";
    wrap.style.background = "#0f1720";
    wrap.style.padding = "12px";
    wrap.style.borderRadius = "10px";
    wrap.style.margin = "10px 0";

    // Header row
    const header = document.createElement("div");
    header.style.display = "flex";
    header.style.justifyContent = "space-between";
    header.style.alignItems = "center";
    header.style.marginBottom = "6px";

    const title = document.createElement("div");
    title.textContent = fuelType;
    title.style.color = "#efdd6f";
    title.style.fontWeight = "700";
    title.style.fontSize = "14px";

    // Controls
    const controls = document.createElement("div");
    controls.style.display = "flex";
    controls.style.gap = "6px";
    controls.style.alignItems = "center";

    function makeBtn(text, onClick) {
      const b = document.createElement("button");
      b.textContent = text;
      b.style.cursor = "pointer";
      b.style.border = "1px solid #325886";
      b.style.background = "#111";
      b.style.color = "#fde4c9";
      b.style.borderRadius = "8px";
      b.style.padding = "2px 8px";
      b.style.fontSize = "12px";
      b.onclick = onClick;
      return b;
    }

    const minus1 = makeBtn("−1", async () => { await deltaFuel(-1); });
    const plus1  = makeBtn("+1", async () => { await deltaFuel(1); });
    const minus5 = makeBtn("−5", async () => { await deltaFuel(-5); });
    const plus5  = makeBtn("+5", async () => { await deltaFuel(5); });

    // Quick edit (optional)
    const input = document.createElement("input");
    input.type = "number";
    input.value = String(curFuel);
    input.min = "0";
    input.max = String(maxFuel);
    input.style.width = "64px";
    input.style.color = "#fde4c9";
    input.style.border = "1px solid #325886";
    input.style.borderRadius = "8px";
    input.style.padding = "2px 6px";
    input.style.fontSize = "12px";
    input.style.marginLeft = "10px"

    const setBtn = makeBtn("Set", async () => {
      await writeCurrentFuel(Number(input.value));
    });
	setBtn.style.background = "#325886";
    controls.append(minus5, minus1, plus1, plus5, input, setBtn);

    header.append(title, controls);
    wrap.appendChild(header);

    // Label
    const label = document.createElement("div");
    label.textContent = `${curFuel} / ${maxFuel} Charges (${pct}%)`;
    label.style.textAlign = "center";
    label.style.fontSize = "12px";
    label.style.color = "#fde4c9";
    label.style.marginTop = "6px";
    wrap.appendChild(label);

    // Segments
    const segments = document.createElement("div");
    segments.style.display = "grid";
    segments.style.gridTemplateColumns = "repeat(auto-fit, minmax(12px, 1fr))";
    segments.style.gap = "4px";
    segments.style.marginTop = "8px";

    for (let i = 0; i < maxFuel; i++) {
      const seg = document.createElement("div");
      seg.style.height = "10px";
      seg.style.borderRadius = "2px";
      if (i < curFuel) {
        seg.style.background = "#efdd6f";
        seg.style.boxShadow = "0 0 4px rgba(239,221,111,0.6)";
      } else {
        seg.style.background = "#222";
        seg.style.border = "1px solid #333";
      }
      segments.appendChild(seg);
    }

    wrap.appendChild(segments);

    container.appendChild(wrap);
  }

  // Re-render when metadata changes (so button updates reflect immediately)
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