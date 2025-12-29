```js-engine
return await (async function () {
// PHASE 3.1 — Fallout 2d20 Manual Leveling Tool with Live Stat Updates
const BASE_PATH = "Fallout-RPG/Creatures and NPCs/Statblocks";
let creatureDamageUpgrades = {};  // attackIndex → number of D6 upgrades
let characterWeaponUpgrades = 0;
let characterArmorUpgrades = 0;
const SPECIAL_KEYS = ["strength","per","end","cha","int","agi","lck"];

// === Legendary Abilities (Phase 2) ===
const LEGENDARY_ABILITIES_PATH = "Testing/Forms/Legendary Abilities"; // change if your folder differs

let legendaryEnabled = false;                 // checkbox state
let selectedLegendaryAbilityId = "";          // no auto-select
let legendaryAbilities = [];                  // loaded from .md files
let legendaryAbilityById = {};                // id -> ability object

// === Phase 3: Legendary Creature Promotion (tie-case points) ===
let legendaryPromoAttrPoints = 0;   // only used for Mighty creature tie (Body == Mind)
let legendaryPromoBodySpent = 0;
let legendaryPromoMindSpent = 0;

// === Phase 3B: Major Character promotion state ===
let majorPromoAttrPoints = 0;               // points remaining to spend
let majorPromoSpent = {                     // spent per SPECIAL
  strength: 0, per: 0, end: 0, cha: 0, int: 0, agi: 0, lck: 0
};

let majorTagPicksNeeded = 0;                // 2 for Normal->Major, 1 for Notable->Major
let majorTagSelections = [];                // array of skill names (Title Case)

// === Phase 4: Creature Forms ===
let availableForms = [];
let formsById = {};
let selectedFormId = null;

// === Phase 4.1: Form choice state (per loaded NPC session) ===
let formChoiceState = {
  // alpha: { attr: "body_attr" | "mind", skill: "melee"|"guns"|"other", mode: "dr"|"attack", drType: "phys"|"energy"|"rad", attackIndex: 0 }
  alpha: {
    attr: "",
    skill: "",
    mode: "dr",
    drType: "phys",
    attackIndex: 0
  }
};


// == UI Setup ==
const container = document.createElement("div");
container.style.padding = "10px";
container.style.backgroundColor = "#325886";
container.style.borderRadius = "8px";
container.style.display = "flex";
container.style.flexDirection = "column";
container.style.gap = "12px";
container.style.color = "#EFDD6F";
container.style.maxWidth = "800px";

const levelInput = createLabeledNumber("Player Level", 1);
	levelInput.input.style.borderRadius = "5px";
	levelInput.input.style.caretColor = "black";
const folderSelect = createLabeledDropdown("NPC Category");
const fileSelect = createLabeledDropdown("Choose NPC File");

const upgradeArea = document.createElement("div");
upgradeArea.style.display = "none";
const resultBlock = document.createElement("pre");
resultBlock.style.whiteSpace = "pre-wrap";
resultBlock.style.background = "#012300";
resultBlock.style.color = "#4ee44a";
resultBlock.style.padding = "10px";
resultBlock.style.borderRadius = "6px";

let npc = null;
let upgradedNPC = null;
let original = null;
let upgrades = {};
let skillUpgrades = {};
let availableAttributePoints = 0;
let availableSkillPoints = 0;
let creatureDRUpgrades = {
    phys: 0,
    energy: 0,
    rad: 0
};


function titleCase(str) {
    return str.split(" ").map(w => w[0].toUpperCase() + w.slice(1)).join(" ");
}

function extractWealthFromScavenge(npc) {
    if (!npc.scavenge_rules || !Array.isArray(npc.scavenge_rules)) return 0;

    for (let rule of npc.scavenge_rules) {
        const match = rule.desc?.match(/Wealth\s*(\d+)/i);
        if (match) {
            return parseInt(match[1]);
        }
    }
    return 0; // Default if not found
}

const validSkillNames = [
    "athletics", "barter", "big guns", "energy weapons", "explosives",
    "lockpick", "medicine", "melee weapons", "pilot", "repair", "science",
    "small guns", "sneak", "speech", "survival", "throwing", "unarmed"
];

// === INIT ===
const allFiles = app.vault.getFiles();
const folders = new Set();
	for (let f of allFiles) {
	    if (f.path.startsWith(BASE_PATH) && f.path.endsWith(".md")) {
	        folders.add(f.path.split("/").slice(0, -1).join("/"));
	    }
	}
	for (let f of Array.from(folders).sort()) {
	    folderSelect.input.append(new Option(f.replace(BASE_PATH + "/", ""), f));
	}
	folderSelect.input.onchange = updateFileDropdown;
	folderSelect.input.style.backgroundColor = "#fde4c9";
	folderSelect.input.style.color = "black";
	folderSelect.input.style.borderRadius = "5px";
	
	await loadLegendaryAbilities();
	await loadCreatureForms();
	await updateFileDropdown();
	

const compareButton = createButton("Load NPC", async () => {
    const path = fileSelect.input.value;
    const file = app.vault.getAbstractFileByPath(path);
    const content = await app.vault.read(file);
    const statMatch = content.match(/```statblock([\s\S]*?)```/);
    if (!statMatch) return resultBlock.textContent = "No statblock found.";

    const yaml = statMatch[1].trim();
    npc = parseYAML(yaml);
    original = structuredClone(npc);
    viewOriginal = false;
    legendaryEnabled = isAlreadyLegendaryOrMajor(npc);
	selectedLegendaryAbilityId = ""; // per your rule: checkbox ON does not auto-select
    upgrades = {};
	skillUpgrades = {};
	selectedFormId = null;
	formChoiceState = {
	  alpha: { attr: "", skill: "", mode: "dr", drType: "phys", attackIndex: 0 }
	};
    creatureDamageUpgrades = {};
    creatureDRUpgrades = { phys: 0, energy: 0, rad: 0 };
    characterWeaponUpgrades = 0;
	characterArmorUpgrades = 0;
    applyUpgradePlan();
    resetButton.style.display = "";
	upgradeArea.style.display = "";
	yamlDiv.style.display = "";

});
compareButton.style.backgroundColor = "#ffc200";
compareButton.style.color = "black";
compareButton.style.alignSelf = "center";
compareButton.style.width = "60%";

const exportButton = createButton("📋 Export Upgraded YAML", async () => {
    if (!upgradedNPC) {
        exportButton.textContent = "❌ No NPC Loaded";
        return;
    }
    const upgradedYAML = "```statblock\n" + yamlify(upgradedNPC) + "\n```";
    try {
        await navigator.clipboard.writeText(upgradedYAML);
        exportButton.textContent = "✅ Copied!";
        setTimeout(() => {
            exportButton.textContent = "📋 Export Upgraded YAML";
        }, 1500);
    } catch (err) {
        exportButton.textContent = "❌ Failed to Copy";
    }
});
exportButton.style.maxWidth = "40%";
exportButton.style.marginBottom = "1"
exportButton.style.backgroundColor = "#ffc200"
exportButton.style.color = "black";

const toggleView = createButton("Toggle View", () => {
    viewOriginal = !viewOriginal;
    renderUpgrades();
});
toggleView.style.backgroundColor = "#ffc200";
toggleView.style.color = "black";
toggleView.style.maxWidth = "20%";
toggleView.style.marginLeft = "0";

const resetButton = createButton("Reset Upgrades", () => {
    upgrades = {};
    skillUpgrades = {};
    creatureDamageUpgrades = {};
    creatureDRUpgrades = {
        phys: 0,
        energy: 0,
        rad: 0
    };
    characterWeaponUpgrades = 0;
    characterArmorUpgrades = 0;
    renderUpgrades();
});
resetButton.style.marginTop = "10px"
resetButton.style.color = "black";
resetButton.style.maxWidth = "40%";
resetButton.style.display = "none";
resetButton.style.justifySelf = "right";
resetButton.style.marginLeft = "0";
resetButton.style.backgroundColor = "#b6b6b6";
resetButton.style.border = "1px transparent #ccc";
resetButton.style.marginBottom = "10px";

const yamlDiv = document.createElement("div");
yamlDiv.appendChild(toggleView)
yamlDiv.appendChild(exportButton);
yamlDiv.appendChild(resultBlock);
yamlDiv.style.display = "none";

let viewOriginal = false;
container.append(levelInput.label, levelInput.input, folderSelect.label, folderSelect.input, fileSelect.label, fileSelect.input, compareButton, upgradeArea, yamlDiv);
return container;

// === Functions ===

function parseYAML(text) {
    const lines = text.split("\n");
    const obj = {};
    let currentKey = null;
    let currentListItem = null;

    for (let i = 0; i < lines.length; i++) {
        const rawLine = lines[i];
        const line = rawLine.trim();

        // Start of a list item
        if (line.startsWith("- ")) {
            if (!Array.isArray(obj[currentKey])) obj[currentKey] = [];
            const entry = {};
            const [k, ...v] = line.slice(2).split(":");
            if (k && v.length) {
                entry[k.trim()] = v.join(":").trim().replace(/"/g, "");
                obj[currentKey].push(entry);
                currentListItem = entry;
            }
        }

        // Continuation line for a list item
        else if (line.includes(":") && currentListItem && rawLine.startsWith("  ")) {
            const [k, ...v] = line.split(":");
            if (k && v.length) {
                currentListItem[k.trim()] = v.join(":").trim().replace(/"/g, "");
            }
        }

        // New top-level key (not part of list)
        else if (line.includes(":")) {
            const [k, ...v] = line.split(":");
            const key = k.trim().toLowerCase();
            const value = v.join(":").trim().replace(/"/g, "");

            const nextLine = lines[i + 1]?.trim();
            if (nextLine?.startsWith("- ")) {
                obj[key] = [];
                currentKey = key;
                currentListItem = null;
            } else {
                obj[key] = value;
                currentKey = key;
                currentListItem = null;
            }
        }
    }

    return obj;
}





function applyUpgradePlan() {
    const playerLevel = parseInt(levelInput.input.value);
    const npcLevel = parseInt(npc.level || 0);
    const rawDiff = playerLevel - npcLevel;
	const diff = Math.max(0, rawDiff); // never allow negative "upgrade" points
	
	availableAttributePoints = Math.floor((diff + 1) / 2);
	availableSkillPoints = npc.type?.toLowerCase().includes("character") ? diff : 0;
    renderUpgrades();
}


// Parse a DR field
function parseDR(raw) {
    if (raw == null) return { value: 0, isImmune: false };
    const str = raw.toString().trim().toLowerCase();

    if (str === "immune") return { value: 0, isImmune: true };
    if (str === "-" || str === "") return { value: 0, isImmune: false };

    return { value: 1, isImmune: false };
}


// Upgrade a DR field
function upgradeDRString(drStr, amount) {
    if (!drStr || drStr.trim() === "-" || drStr.trim() === "") {
        return `${amount} (All)`; // ✅ Upgrade from "-" or blank to "1 (All)"
    }
    if (drStr.toLowerCase().includes("immune")) {
        return drStr; // No change for immune
    }

    return drStr.replace(/(\d+)/g, (_, num) => `${parseInt(num) + amount}`);
}

function applyLegendaryCreaturePromotion(temp, originalNpc) {
  // Applies ONLY if:
  // - legendaryEnabled is ON
  // - NPC is a creature
  // - original type is NOT already legendary (so we don't re-promote baked statblocks)

  const originalType = (originalNpc.type || "").toLowerCase();
  const isCreature = originalType.includes("creature");
  const alreadyLegendary = originalType.includes("legendary");
  const isMighty = originalType.includes("mighty");

  // Default: no multipliers
  let hpMult = 1;
  let xpMult = 1;

  // If promotion not active/applicable, clear tie promo pool & spent so it can't linger
  if (!legendaryEnabled || !isCreature || alreadyLegendary) {
    legendaryPromoAttrPoints = 0;
    legendaryPromoBodySpent = 0;
    legendaryPromoMindSpent = 0;
    return { hpMult, xpMult };
  }

  // Apply the promotion "type" label
  temp.type = "Legendary Creature";

  // Multipliers by Normal vs Mighty
  hpMult = isMighty ? 1.5 : 3;
  xpMult = isMighty ? 1.5 : 3;

  // Base attributes come from ORIGINAL (not temp) so upgrades remain upgrades
  const body0 = parseInt(originalNpc.body_attr || "0");
  const mind0 = parseInt(originalNpc.mind || "0");

  let autoBody = 0;
  let autoMind = 0;

  if (!isMighty) {
    // Normal Creature: +2 Body, +2 Mind
    autoBody = 2;
    autoMind = 2;

    // No tie-pool in this branch
    legendaryPromoAttrPoints = 0;
    legendaryPromoBodySpent = 0;
    legendaryPromoMindSpent = 0;
  } else {
    // Mighty Creature: +2 to the lower of Body/Mind; if tie, allocate via promo points
    if (body0 < mind0) {
      autoBody = 2;
      legendaryPromoAttrPoints = 0;
      legendaryPromoBodySpent = 0;
      legendaryPromoMindSpent = 0;
    } else if (mind0 < body0) {
      autoMind = 2;
      legendaryPromoAttrPoints = 0;
      legendaryPromoBodySpent = 0;
      legendaryPromoMindSpent = 0;
    } else {
      // Tie case: grant 2 promo points to spend ONLY on Body/Mind via your steppers
      const spent = legendaryPromoBodySpent + legendaryPromoMindSpent;
      legendaryPromoAttrPoints = Math.max(0, 2 - spent);

      // No auto adds in tie case
      autoBody = 0;
      autoMind = 0;
    }
  }

  // Apply auto promo + tie promo spent + your normal upgrades already applied elsewhere
  // Important: we are setting these to base+auto+promoSpent; your loop later adds "upgrades[stat]"
  temp.body_attr = body0 + autoBody + legendaryPromoBodySpent;
  temp.mind = mind0 + autoMind + legendaryPromoMindSpent;

  // XP multiplier
  const baseXp = parseInt(originalNpc.xp || "0");
  if (!Number.isNaN(baseXp) && baseXp > 0) {
    temp.xp = Math.round(baseXp * xpMult).toString();
  }

  return { hpMult, xpMult };
}

function applyMajorCharacterPromotion(temp, originalNpc) {
  const originalType = (originalNpc.type || "").toLowerCase();
  const isCreature = originalType.includes("creature");
  const alreadyMajor = originalType.includes("major");
  const isNormalChar = originalType.includes("normal") && originalType.includes("character");
  const isNotableChar = originalType.includes("notable") && originalType.includes("character");

  // Defaults (no-op)
  let xpMult = 1;
  let initBonus = 0;
  let hpBonusMode = "none"; // "lck" or "2lck"
  majorTagPicksNeeded = 0;

  // If not applicable, clear promo pools so nothing lingers
  if (!legendaryEnabled || isCreature || alreadyMajor || (!isNormalChar && !isNotableChar)) {
    majorPromoAttrPoints = 0;
    majorPromoSpent = Object.fromEntries(SPECIAL_KEYS.map(k => [k, 0]));
    majorTagPicksNeeded = 0;
    majorTagSelections = [];
    return { xpMult, initBonus, hpBonusMode };
  }

  // Set type label
  temp.type = "Major Character";

  if (isNormalChar) {
    xpMult = 3;
    initBonus = 4;
    hpBonusMode = "2lck";
    majorTagPicksNeeded = 2;

    const spent = Object.values(majorPromoSpent).reduce((a,b)=>a+b,0);
    majorPromoAttrPoints = Math.max(0, 14 - spent);
  } else {
    xpMult = 1.5;
    initBonus = 2;
    hpBonusMode = "lck";
    majorTagPicksNeeded = 1;

    const spent = Object.values(majorPromoSpent).reduce((a,b)=>a+b,0);
    majorPromoAttrPoints = Math.max(0, 7 - spent);
  }

  // XP multiplier
  const baseXp = parseInt(originalNpc.xp || "0");
  if (!Number.isNaN(baseXp) && baseXp > 0) {
    temp.xp = Math.round(baseXp * xpMult).toString();
  }

  // Luck Points = LCK (you may need to adjust this key if your YAML uses a different field)
  temp.luck_points = parseInt(temp.lck || "0");

  return { xpMult, initBonus, hpBonusMode };
}

function isMajorPromoActive(originalNpc) {
  const t = (originalNpc?.type || "").toLowerCase();
  const isCreature = t.includes("creature");
  const alreadyMajor = t.includes("major");
  const eligibleChar = (t.includes("normal") && t.includes("character")) || (t.includes("notable") && t.includes("character"));
  return legendaryEnabled && !isCreature && !alreadyMajor && eligibleChar;
}

function ensureTagSkill(tempNpc, skillKeyLower) {
  if (!tempNpc.skills || !Array.isArray(tempNpc.skills)) tempNpc.skills = [];

  const key = (skillKeyLower || "").trim().toLowerCase();
  const displayName = titleCase(key);

  let existing = tempNpc.skills.find(s => (s.name || "").trim().toLowerCase() === key);

  if (!existing) {
    tempNpc.skills.push({ name: displayName, desc: "2 ⬛" });
    return;
  }

  const baseNum = parseInt((existing.desc || "0").match(/\d+/)?.[0] || "0");
  const newNum = Math.max(baseNum, 2);

  // Always ensure tag marker is present
  existing.desc = `${newNum} ⬛`;
}

function isFormEligible(form, originalNpc) {
  const { typeStr, keywords } = getNpcMeta(originalNpc);

  // Applies-to gates still based on type
  if (form.applies_to === "creature" && !typeStr.includes("creature")) return false;
  if (form.applies_to === "creature_or_character") {
    if (!(typeStr.includes("creature") || typeStr.includes("character"))) return false;
  }

  // Requirements: exclude should match EITHER type OR keywords
  if (form.requirements?.exclude) {
    for (const exRaw of form.requirements.exclude) {
      const ex = (exRaw || "").toString().trim().toLowerCase();
      if (!ex) continue;

      if (typeStr.includes(ex)) return false;
      if (keywords.has(ex)) return false;
    }
  }

  return true;
}


function removeInjectedForm(tempNpc) {
  if (!tempNpc.special_abilities || !Array.isArray(tempNpc.special_abilities)) return;

  tempNpc.special_abilities = tempNpc.special_abilities.filter(sa => {
    const desc = (sa?.desc || "");
    return !desc.includes("<!-- form_id:");
  });
}


function injectForm(tempNpc, form) {
  if (!tempNpc.special_abilities || !Array.isArray(tempNpc.special_abilities)) {
    tempNpc.special_abilities = [];
  }

  // Replacement policy
  removeInjectedForm(tempNpc);

  const injectName =
    form?.spec?.injection?.title ||
    form?.injection?.title ||
    form?.name ||
    form?.id?.toUpperCase() ||
    "FORM";


  const injectTitle =
    form?.spec?.injection?.title ||
    form?.injection?.title ||
    form?.name ||
    "FORM";

  // Normalize effect text to explicit \n
  const effect = (form.effectText || "")
    .trim()
    .replace(/\r\n/g, "\n")
    .replace(/\n/g, "\\n");

  // Normalize effect text to explicit \n, then convert to a blockquote block
  const effectLines = (form.effectText || "")
    .trim()
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map(l => l.trimEnd());

  const blockquoted = effectLines
    .map(l => `> ${l}`.trimEnd())
    .join("\\n");

  const desc =
    `<!-- form_id: ${form.id} -->\\n` +
    blockquoted;


  tempNpc.special_abilities.unshift({
    name: injectName,
    desc
  });
}



function applyAlphaMechanicalEffects(tempNpc, originalNpc) {
  const st = formChoiceState?.alpha;
  if (!st) return;

  // Level: +1
  const baseLevel = parseInt(tempNpc.level || originalNpc.level || "0");
  tempNpc.level = String(baseLevel + 1);

  // +1 to Body or Mind
  if (st.attr === "body_attr" || st.attr === "mind") {
    const v = parseInt(tempNpc[st.attr] || "0");
    tempNpc[st.attr] = String(v + 1);
  }

  // +1 to one creature skill (melee/guns/other)
  if (st.skill && ["melee", "guns", "other"].includes(st.skill)) {
    const v = parseInt(tempNpc[st.skill] || "0");
    tempNpc[st.skill] = String(v + 1);
  }

  // HP: +1, or +2 if Body increased
  // IMPORTANT: your tool later overwrites hp using calculateDerived(), so we store a temp bonus.
  tempNpc.__formHpBonus = (st.attr === "body_attr") ? 2 : 1;

  // DR +1 (one type all locations) OR +1D6 to one attack
  tempNpc.__formDrBonus = null;
  tempNpc.__formAttackBonus = null;

  if (st.mode === "dr") {
    if (["phys", "energy", "rad"].includes(st.drType)) {
      tempNpc.__formDrBonus = { type: st.drType, amount: 1 };
    }
  } else if (st.mode === "attack") {
    const idx = Number.isFinite(st.attackIndex) ? st.attackIndex : 0;
    tempNpc.__formAttackBonus = { attackIndex: idx, d6: 1 };
  }
}

function applyBonusD6ToAttack(attackObj, bonusD6) {
  const atk = { ...attackObj };

  // Prefer desc if present (most of your statblocks store the readable string there)
  if (typeof atk.desc === "string" && atk.desc.trim()) {
    // Try to find "Xd6" and increase X
    const m = atk.desc.match(/(\d+)\s*d6\b/i);
    if (m) {
      const before = parseInt(m[1], 10);
      if (!Number.isNaN(before)) {
        atk.desc = atk.desc.replace(/(\d+)\s*d6\b/i, `${before + bonusD6}d6`);
        return atk;
      }
    }

    // Otherwise append a clear modifier
    atk.desc = atk.desc.trim() + ` (+${bonusD6}d6)`;
    return atk;
  }

  // Fallback to dice/text fields if you have them (safe no-op if not)
  if (typeof atk.dice === "string" && atk.dice.trim()) {
    atk.dice = atk.dice.trim() + ` (+${bonusD6}d6)`;
  }

  return atk;
}

function getFormStatDelta(statKey) {
  if (selectedFormId !== "alpha") return 0;
  const chosen = formChoiceState?.alpha?.attr;
  return (chosen === statKey) ? 1 : 0;
}

function applyFormOperations(tempNpc, operations) {
  for (const op of operations) {
    if (!op || !op.op) continue;

    if (op.op === "set_dr") {
      const t = (op.dr_type || "").toLowerCase();
      const value = op.value ?? "";
      const field =
        t === "phys" ? "phys_dr" :
        t === "energy" ? "energy_dr" :
        t === "rad" ? "rad_dr" :
        null;

      if (field) {
        tempNpc[field] = String(value);
      }
    }
  }
}

function normalizeKeywords(raw) {
  const set = new Set();

  if (!raw) return set;

  // If YAML ever becomes a list, support it
  const parts = Array.isArray(raw) ? raw : [raw];

  for (const p of parts) {
    const s = (p || "").toString().trim().toLowerCase();
    if (!s) continue;

    // Store the full phrase
    set.add(s);

    // Also store tokens (so "Super Mutant Robot" matches "robot")
    const words = s.split(/[^a-z0-9]+/g).filter(Boolean);
    for (const w of words) set.add(w);

    // Also store adjacent pairs (so "super mutant" can be matched if you ever need it)
    for (let i = 0; i < words.length - 1; i++) {
      set.add(`${words[i]} ${words[i + 1]}`);
    }
  }

  return set;
}

function getNpcMeta(npcObj) {
  const typeStr = (npcObj?.type || "").toString().toLowerCase();
  return {
    typeStr,
    keywords: normalizeKeywords(npcObj?.keywords),
  };
}




function renderUpgrades() {
	const isCreature = npc.type?.toLowerCase().includes("creature");


	const statLabels = {
    strength: "STR",
    per: "PER",
    end: "END",
    cha: "CHA",
    int: "INT",
    agi: "AGI",
    lck: "LCK",
    body_attr: "BODY",
    mind: "MIND"
	};
	
	const attrNameMap = {
    STR: "strength",
    PER: "per",
    END: "end",
    CHA: "cha",
    INT: "int",
    AGI: "agi",
    LCK: "lck",
    BODY: "body_attr",
    MIND: "mind"
	};


    if (!npc) return;

    const temp = structuredClone(npc);
    upgradedNPC = temp;
    
    const promo = applyLegendaryCreaturePromotion(temp, original);
    const majorPromo = applyMajorCharacterPromotion(temp, original);
    // === Phase 4.1: Mechanical effects for selected form (Alpha first) ===
	if (selectedFormId === "alpha") {
	  applyAlphaMechanicalEffects(temp, original);
	} else {
	  // Clear any transient bonuses if not alpha
	  delete temp.__formHpBonus;
	  delete temp.__formDrBonus;
	  delete temp.__formAttackBonus;
	}

    
    const stats = ["strength", "per", "end", "cha", "int", "agi", "lck", "body_attr", "mind"];
    const attrContainer = document.createElement("div");
		attrContainer.style.marginTop = "20px";
		
	const attrLabel = document.createElement("div");
	attrLabel.innerHTML = `<strong style = "font-size:14px; color:#FFC200;">Attributes</strong>`;
	attrContainer.appendChild(attrLabel);
	
	const used = getUsedAttributePoints();
	
	// Promo totals are CONSTANT pools (remaining + spent), so Total - Used works cleanly.
	const legendaryPromoTotal =
	  legendaryPromoAttrPoints + legendaryPromoBodySpent + legendaryPromoMindSpent;
	
	const majorPromoTotal =
	  majorPromoAttrPoints + Object.values(majorPromoSpent).reduce((a, b) => a + b, 0);
	
	// Total spendable attribute points right now:
	const totalAvailableAttributePoints =
	  availableAttributePoints + legendaryPromoTotal + majorPromoTotal;
	
	// Remaining points (never negative)
	const attrPointsLeft = Math.max(0, totalAvailableAttributePoints - used);
	
	const attrPointsNote = document.createElement("div");
	attrPointsNote.innerHTML = `<em style="color:#FFC200">Points Left: ${attrPointsLeft}</em>`;
	attrContainer.appendChild(attrPointsNote);


	
	// 💠 Grid wrapper
	const attrGrid = document.createElement("div");
	attrGrid.style.display = "grid";
	attrGrid.style.gridTemplateColumns = "repeat(7, 1fr)";
	attrGrid.style.gap = "8px";
	attrGrid.style.marginTop = "8px";
	attrGrid.style.alignItems = "center";
	attrGrid.style.justifyItems = "center";



    for (let stat of stats) {
    if (temp[stat] !== undefined) {
        const base = parseInt(temp[stat] ?? original[stat] ?? "0", 10);
		const added = upgrades[stat] || 0;
		const current = base + added;
        const label = statLabels[stat] || stat.toUpperCase();

        // Create grid cell
        const cell = document.createElement("div");
        cell.style.display = "flex";
        cell.style.flexDirection = "column";
        cell.style.alignItems = "center";
        cell.style.justifyContent = "center";
        cell.style.gap = "4px";
        cell.style.justifySelf = "center";
        
        // Label text
        const labelDiv = document.createElement("div");
        labelDiv.innerHTML = (added > 0)
            ? `<strong style="color:#FFC200">${label}: ${base} → ${current}</strong>`
            : `${label}: ${current}`;

        // Buttons in row
        const buttonRow = document.createElement("div");
        buttonRow.style.display = "flex";
        buttonRow.style.gap = "8px";
        buttonRow.style.marginBottom = "20px";
        buttonRow.style.justifyContent = "center"; 
        buttonRow.style.width = "100%";
        

        const plus = createButton("+", () => {
			const used = getUsedAttributePoints();
			
			// No points left at all (normal + promo)
			if (used >= totalAvailableAttributePoints) return;
			
			// Spend NORMAL points first (computed excluding promo spending)
			const normalUsed = getUsedNormalAttributePoints();
			const normalRemaining = Math.max(0, availableAttributePoints - normalUsed);
			
			if (normalRemaining > 0) {
			  upgrades[stat] = (upgrades[stat] || 0) + 1;
			  renderUpgrades();
			  return;
			}

		
		  // Otherwise we're in promo territory.
		  // Promo points may ONLY be spent on BODY/MIND.
		  if (legendaryPromoAttrPoints > 0 && (stat === "body_attr" || stat === "mind")) {
		    legendaryPromoAttrPoints--;
		    upgrades[stat] = (upgrades[stat] || 0) + 1;
		
		    if (stat === "body_attr") legendaryPromoBodySpent++;
		    else legendaryPromoMindSpent++;
		
		    renderUpgrades();
		  }
		  
		  // === Major Character promo (SPECIAL only) ===
		  const oType = (original?.type || "").toLowerCase();
		  const isCreature = oType.includes("creature");
		  const alreadyMajor = oType.includes("major");
		
		  const isSpecial = SPECIAL_KEYS.includes(stat);
		
		  // Major promo can only be spent when:
		  // - checkbox enabled
		  // - character (not creature)
		  // - source statblock is not already Major (avoid re-promoting baked statblocks)
		  // - stat is a SPECIAL stat
		  // - promo points remain
		  if (legendaryEnabled && !isCreature && !alreadyMajor && isSpecial && majorPromoAttrPoints > 0) {
		    majorPromoAttrPoints--;
		    majorPromoSpent[stat] = (majorPromoSpent[stat] || 0) + 1;
		
		    upgrades[stat] = (upgrades[stat] || 0) + 1;
		    renderUpgrades();
		    return;
		  }
		  
		});
		plus.style.marginLeft = "0";
		plus.style.width = "24px"
		
        const minus = createButton("-", () => {
		  if ((upgrades[stat] || 0) <= 0) return;
		
		  upgrades[stat]--;
		
		  // Refund Legendary creature tie promo if applicable
		  if (stat === "body_attr" && legendaryPromoBodySpent > 0) {
		    legendaryPromoBodySpent--;
		    legendaryPromoAttrPoints++;
		    renderUpgrades();
		    return;
		  } else if (stat === "mind" && legendaryPromoMindSpent > 0) {
		    legendaryPromoMindSpent--;
		    legendaryPromoAttrPoints++;
		    renderUpgrades();
		    return;
		  }
		
		  // Refund Major Character promo if applicable (SPECIAL only)
		  const isSpecial = ["strength", "per", "end", "cha", "int", "agi", "lck"].includes(stat);
		  if (isSpecial && (majorPromoSpent[stat] || 0) > 0) {
		    majorPromoSpent[stat]--;
		    majorPromoAttrPoints++;
		    renderUpgrades();
		    return;
		  }
		
		  renderUpgrades();
		});

		
		minus.style.marginLeft = "0";
		minus.style.width = "24px"
	
        buttonRow.append(plus, minus);
        cell.append(labelDiv, buttonRow);
        attrGrid.appendChild(cell);
        temp[stat] = current;
    }

        attrContainer.appendChild(attrGrid);
    }

    const skillContainer = document.createElement("div");
    skillContainer.style.marginTop = "20px";
    skillContainer.innerHTML = `<strong style = "font-size:14px; color:#FFC200;">Skills</strong>`;

	const skillPointsLeft = availableSkillPoints - getUsedSkillPoints();
		if (skillPointsLeft > 0) {
		    const skillPointsNote = document.createElement("div");
		    skillPointsNote.innerHTML = `<em style="color:#FFC200">Points Left: ${skillPointsLeft}</em>`;
		    skillContainer.appendChild(skillPointsNote);
		}
    
    if (original.skills && Array.isArray(original.skills)) {
	    const skillGrid = document.createElement("div");
		skillGrid.style.display = "grid";
		skillGrid.style.gridTemplateColumns = "repeat(3, 1fr)";
		skillGrid.style.gap = "8px";
		skillGrid.style.marginTop = "8px";
		skillGrid.style.alignItems = "center";
		
		// Mapping existing skills
		const skillMap = Object.fromEntries(
		    (original.skills || []).map(s => [s.name?.toLowerCase(), s])
		);
		
		for (let skillKey of validSkillNames) {
		    const s = skillMap[skillKey] || { name: titleCase(skillKey), desc: "0" };
		    const base = parseInt((s.desc || "").match(/\d+/)?.[0] || "0");
		    const added = skillUpgrades[skillKey] || 0;
		    const total = base + added;
		
		    // Skill row container
		    const row = document.createElement("div");
		    row.style.display = "flex";
		    row.style.justifyContent = "space-between";
		    row.style.alignItems = "center";
		    row.style.borderBottom = "2px solid rgba(255,255,255,0.2)";
		    row.style.padding = "5px 15px"; 
		
		    const labelText = (added > 0)
		        ? `<strong style="color:#FFC200">${s.name}: ${base} → ${total}</strong>`
		        : `${s.name}: ${total}`;
		
		    const labelDiv = document.createElement("div");
		    labelDiv.innerHTML = labelText;
		
		    const buttonRow = document.createElement("div");
		    buttonRow.style.display = "flex";
		    buttonRow.style.gap = "1px";
		
		    const plus = createButton("+", () => {
		        if (getUsedSkillPoints() < availableSkillPoints && total < 6) {
		            skillUpgrades[skillKey] = (skillUpgrades[skillKey] || 0) + 1;
		            renderUpgrades();
		        }
		    });
			plus.style.width = "24px"
		
		    const minus = createButton("-", () => {
		        if ((skillUpgrades[skillKey] || 0) > 0) {
		            skillUpgrades[skillKey]--;
		            renderUpgrades();
		        }
		    });
		    minus.style.width = "24px"
		
		    buttonRow.append(plus, minus);
		    row.append(labelDiv, buttonRow);
		    skillGrid.appendChild(row);
		}
		skillContainer.appendChild(skillGrid);
	}
	
	// Baseline derived (used for "from" values in the UI)
	const baselineNpc = structuredClone(original);
	const baselineDerived = calculateDerived(baselineNpc);


    const derived = calculateDerived(temp);  // includes isCreature
		const levelGain = derived.levelGain;
		temp.hp = derived.hp.total;
		// Phase 3: Legendary Creature HP multiplier (applies after derived HP calculation)
		if (promo?.hpMult && promo.hpMult !== 1) {
		  const hpNum = parseInt(temp.hp || "0");
		  if (!Number.isNaN(hpNum)) {
		    temp.hp = Math.round(hpNum * promo.hpMult).toString();
		  }
		}
		temp.initiative = derived.initiative;
		
		// === Step 6: Major Character derived bonuses ===
		if (isMajorPromoActive(original) && majorPromo) {
		  // Initiative bonus (+4 Normal->Major, +2 Notable->Major)
		  const ini = parseInt(temp.initiative || "0");
		  if (!Number.isNaN(ini)) temp.initiative = (ini + (majorPromo.initBonus || 0)).toString();
		
		  // Luck Points = LCK (kept in YAML live)
		  const lckNum = parseInt(temp.lck || "0");
		  if (!Number.isNaN(lckNum)) temp.luck_points = lckNum;
		
		  // HP bonus after derived (+2×LCK Normal->Major, +LCK Notable->Major)
		  const hpNum = parseInt(temp.hp || "0");
		  if (!Number.isNaN(hpNum) && !Number.isNaN(lckNum)) {
		    const add = (majorPromo.hpBonusMode === "2lck") ? (2 * lckNum)
		              : (majorPromo.hpBonusMode === "lck")  ? lckNum
		              : 0;
		    temp.hp = (hpNum + add).toString();
		  }
		}
		
		temp.defense = derived.defense;
		if (!derived.isCreature) {
		    temp.melee_damage = derived.melee;
		}
	const baseWealth = extractWealthFromScavenge(original); // ✅ Add this
	const derivedBlock = document.createElement("div");
		const hpFrom = baselineDerived.hp.base;
		const hpTo = parseInt(temp.hp || "0");
		
		const iniFrom = baselineDerived.initiative;
		const iniTo = parseInt(temp.initiative || "0");

		
		derivedBlock.innerHTML = `
		  <strong style="font-size:14px; color:#FFC200;">Derived Stats</strong><br>
		  <div style="margin-left:8px;">
		    HP: ${hpFrom} → ${hpTo}<br>
		    Initiative: ${iniFrom}${(iniTo !== iniFrom) ? ` → ${iniTo}` : ""}<br>
		    Defense: ${derived.defense}
		    ${!derived.isCreature ? `<br>Melee Damage: ${derived.melee}` : ""}
		    ${!derived.isCreature && derived.wealth !== undefined ? `<br>Wealth: ${baseWealth} → ${derived.wealth}` : ""}
		  </div>
		`;


		derivedBlock.style.marginTop = "20px"
		derivedBlock.style.border = "1px solid grey";
		derivedBlock.style.width = "150px";
		derivedBlock.style.borderRadius = "5px";
		derivedBlock.style.padding = "5px"
		derivedBlock.style.backgroundColor = "#2e4663"
		
		upgradeArea.innerHTML = "";
		// === Legendary UI (Phase 2) ===
		const legendarySection = document.createElement("div");
		legendarySection.style.border = "1px solid rgba(255,255,255,0.25)";
		legendarySection.style.borderRadius = "6px";
		legendarySection.style.padding = "10px";
		legendarySection.style.background = "#2e4663";
		
		const legendaryTitle = document.createElement("div");
		legendaryTitle.textContent = "Legendary / Major";
		legendaryTitle.style.fontWeight = "bold";
		legendaryTitle.style.marginBottom = "8px";
		
		const legendaryToggleRow = document.createElement("div");
		legendaryToggleRow.style.display = "flex";
		legendaryToggleRow.style.alignItems = "center";
		legendaryToggleRow.style.gap = "10px";
		
		const legendaryCheckbox = document.createElement("input");
		legendaryCheckbox.type = "checkbox";
		legendaryCheckbox.checked = !!legendaryEnabled;
		
		const legendaryCheckboxLabel = document.createElement("label");
		legendaryCheckboxLabel.textContent = "Make Legendary / Major";
		
		legendaryToggleRow.append(legendaryCheckbox, legendaryCheckboxLabel);
		
		// Dropdown
		const abilitySelect = document.createElement("select");
		abilitySelect.style.padding = "5px";
		abilitySelect.style.backgroundColor = "#fde4c9";
		abilitySelect.style.color = "black";
		abilitySelect.style.borderRadius = "5px";
		abilitySelect.style.marginTop = "8px";
		abilitySelect.style.width = "100%";
		
		// Default option
		abilitySelect.append(new Option("-- Select Legendary Ability --", ""));
		abilitySelect.value = selectedLegendaryAbilityId || "";
		
		// Fill options (filtered)
		const eligible = legendaryAbilities.filter(a => abilityEligibleForNpc(a, npc));
		for (const a of eligible) {
		  abilitySelect.append(new Option(a.name, a.id));
		}
		
		// Disable unless checkbox ON
		abilitySelect.disabled = !legendaryEnabled;
		abilitySelect.style.opacity = legendaryEnabled ? "1" : "0.5";
		
		// Random button
		const randomBtn = createButton("Random Eligible", () => {
		  if (!legendaryEnabled) return;
		
		  const eligibleAll = legendaryAbilities.filter(a => abilityEligibleForNpc(a, npc));
		  if (!eligibleAll.length) return;
		
		  // Prefer not to re-pick the current selection (so the UI visibly changes)
		  let pool = eligibleAll;
		  if (selectedLegendaryAbilityId && eligibleAll.length > 1) {
		    pool = eligibleAll.filter(a => a.id !== selectedLegendaryAbilityId);
		  }
		
		  const pick = pool[Math.floor(Math.random() * pool.length)];
		  selectedLegendaryAbilityId = pick.id;
		  renderUpgrades();
		});

		randomBtn.style.marginLeft = "0";
		randomBtn.style.marginTop = "8px";
		randomBtn.disabled = !legendaryEnabled;
		randomBtn.style.opacity = legendaryEnabled ? "1" : "0.5";
		
		const selectedAbility = selectedLegendaryAbilityId ? legendaryAbilityById[selectedLegendaryAbilityId] : null;
		
		const selectedNameLine = document.createElement("div");
		selectedNameLine.style.marginTop = "8px";
		selectedNameLine.style.fontWeight = "bold";
		
		selectedNameLine.textContent = selectedAbility
		  ? `Selected: ${selectedAbility.name}`
		  : "Selected: (none)";
		  
		// Effect/Mutation preview
		const effectBox = document.createElement("div");
		effectBox.style.marginTop = "8px";
		effectBox.style.padding = "8px";
		effectBox.style.borderRadius = "6px";
		effectBox.style.background = "#012300";
		effectBox.style.color = "#4ee44a";
		effectBox.style.whiteSpace = "pre-wrap";
		
		const mutationBox = document.createElement("div");
		mutationBox.style.marginTop = "8px";
		mutationBox.style.padding = "8px";
		mutationBox.style.borderRadius = "6px";
		mutationBox.style.background = "#012300";
		mutationBox.style.color = "#4ee44a";
		mutationBox.style.whiteSpace = "pre-wrap";
		
		effectBox.textContent = selectedAbility ? `Effect:\n${selectedAbility.effect}` : "Effect:\n";
		mutationBox.textContent = selectedAbility ? `Mutation:\n${selectedAbility.mutation}` : "Mutation:\n";
		
		// Wire events
		legendaryCheckbox.onchange = () => {
		  legendaryEnabled = legendaryCheckbox.checked;
		
		  // If disabling: remove any injected legendary ability and clear selection
		  if (!legendaryEnabled) {
		    selectedLegendaryAbilityId = "";
		  }
		
		  renderUpgrades();
		};
		
		abilitySelect.onchange = () => {
		  selectedLegendaryAbilityId = abilitySelect.value;
		  renderUpgrades();
		};
		
		legendarySection.append(
		  legendaryTitle,
		  legendaryToggleRow,
		  abilitySelect,
		  randomBtn,
		  selectedNameLine,
		  effectBox,
		  mutationBox
		);
		
		upgradeArea.appendChild(legendarySection);
		
		// === Step 7 UI: Major Tag skill selection ===
		const majorTagSection = document.createElement("div");
		majorTagSection.style.border = "1px solid rgba(255,255,255,0.25)";
		majorTagSection.style.borderRadius = "6px";
		majorTagSection.style.padding = "10px";
		majorTagSection.style.background = "#2e4663";
		majorTagSection.style.marginTop = "10px";
		
		const showMajorTagSection = legendaryEnabled && !isCreature;
		majorTagSection.style.display = showMajorTagSection ? "" : "none";
		
		const majorTagTitle = document.createElement("div");
		majorTagTitle.textContent = "Major Tag Skills";
		majorTagTitle.style.fontWeight = "bold";
		majorTagTitle.style.marginBottom = "8px";
		
		const majorActive = isMajorPromoActive(original);
		const picksRemaining = Math.max(0, majorTagPicksNeeded - (majorTagSelections?.length || 0));
		
		const majorTagInfo = document.createElement("div");
		majorTagInfo.innerHTML = `<em style="color:#FFC200">Picks Remaining: ${majorActive ? picksRemaining : 0}</em>`;
		
		const tagSelect = document.createElement("select");
		tagSelect.style.padding = "5px";
		tagSelect.style.backgroundColor = "#fde4c9";
		tagSelect.style.color = "black";
		tagSelect.style.borderRadius = "5px";
		tagSelect.style.width = "100%";
		tagSelect.style.marginTop = "8px";
		
		tagSelect.append(new Option("-- Select a skill to Tag --", ""));
		
		// options: valid skills, excluding already selected
		const selectedSet = new Set((majorTagSelections || []).map(s => s.toLowerCase()));
		for (const sk of validSkillNames) {
		  if (!selectedSet.has(sk)) tagSelect.append(new Option(titleCase(sk), sk));
		}
		
		tagSelect.disabled = !majorActive || picksRemaining <= 0;
		tagSelect.style.opacity = (!tagSelect.disabled) ? "1" : "0.5";
		
		const addBtn = createButton("Add Tag", () => {
		  if (!majorActive) return;
		  if (picksRemaining <= 0) return;
		  const val = tagSelect.value;
		  if (!val) return;
		
		  majorTagSelections = majorTagSelections || [];
		  if (!majorTagSelections.includes(val)) majorTagSelections.push(val);
		
		  renderUpgrades();
		});
		addBtn.style.marginLeft = "0";
		addBtn.style.marginTop = "8px";
		addBtn.disabled = !majorActive || picksRemaining <= 0;
		addBtn.style.opacity = (!addBtn.disabled) ? "1" : "0.5";
		
		const randomBtn2 = createButton("Random", () => {
		  if (!majorActive) return;
		  if (picksRemaining <= 0) return;
		
		  const pool = validSkillNames.filter(sk => !selectedSet.has(sk));
		  if (!pool.length) return;
		
		  const pick = pool[Math.floor(Math.random() * pool.length)];
		  majorTagSelections = majorTagSelections || [];
		  majorTagSelections.push(pick);
		
		  renderUpgrades();
		});
		randomBtn2.style.marginLeft = "8px";
		randomBtn2.style.marginTop = "8px";
		randomBtn2.disabled = !majorActive || picksRemaining <= 0;
		randomBtn2.style.opacity = (!randomBtn2.disabled) ? "1" : "0.5";
		
		// Selected list
		const selectedList = document.createElement("div");
		selectedList.style.marginTop = "8px";
		
		for (const sk of (majorTagSelections || [])) {
		  const row = document.createElement("div");
		  row.style.display = "flex";
		  row.style.justifyContent = "space-between";
		  row.style.alignItems = "center";
		  row.style.padding = "4px 0";
		  row.style.borderBottom = "1px solid rgba(255,255,255,0.15)";
		
		  const label = document.createElement("div");
		  label.textContent = titleCase(sk);
		
		  const removeBtn = createButton("🗑️", () => {
		    majorTagSelections = (majorTagSelections || []).filter(x => x !== sk);
		    renderUpgrades();
		  });
		  removeBtn.style.marginLeft = "0";
		  removeBtn.style.backgroundColor = "#2e4663";
		
		  row.append(label, removeBtn);
		  selectedList.appendChild(row);
		}
		
		majorTagSection.append(
		  majorTagTitle,
		  majorTagInfo,
		  tagSelect,
		  addBtn,
		  randomBtn2,
		  selectedList
		);
		
		upgradeArea.appendChild(majorTagSection);
		
		// === Phase 4 UI: Creature Form Selection ===
		const formSection = document.createElement("div");
		formSection.style.border = "1px solid rgba(255,255,255,0.25)";
		formSection.style.borderRadius = "6px";
		formSection.style.padding = "10px";
		formSection.style.background = "#2e4663";
		formSection.style.marginTop = "10px";
		
		const formTitle = document.createElement("div");
		formTitle.textContent = "Creature Form";
		formTitle.style.fontWeight = "bold";
		formTitle.style.marginBottom = "8px";
		
		const eligibleForms = availableForms.filter(f => isFormEligible(f, original));
		
		const formSelect = document.createElement("select");
		formSelect.style.width = "100%";
		formSelect.style.padding = "5px";
		formSelect.style.backgroundColor = "#fde4c9";
		formSelect.style.color = "black";
		formSelect.style.borderRadius = "5px";
		
		formSelect.append(new Option("-- None --", ""));
		for (const f of eligibleForms) {
		  const opt = new Option(f.name, f.id);
		  if (f.id === selectedFormId) opt.selected = true;
		  formSelect.append(opt);
		}
		
		formSelect.onchange = () => {
		  const prev = selectedFormId;
		  selectedFormId = formSelect.value || null;
		
		  // Reset Alpha-only choices when leaving Alpha, or when selecting Alpha fresh
		  if (prev !== selectedFormId) {
		    formChoiceState.alpha = {
		      attr: "",
		      skill: "",
		      mode: "dr",
		      drType: "phys",
		      attackIndex: 0
		    };
		  }
		
		  renderUpgrades();
		};
		
		const formPreview = document.createElement("div");
		formPreview.style.marginTop = "8px";
		formPreview.style.fontSize = "12px";
		formPreview.style.whiteSpace = "pre-wrap";
		
		if (selectedFormId && formsById[selectedFormId]) {
		  formPreview.textContent = formsById[selectedFormId].effectText;
		}
		
		// === Phase 4.1 UI: Alpha form options ===
		const alphaOptionsWrap = document.createElement("div");
		alphaOptionsWrap.style.marginTop = "10px";
		alphaOptionsWrap.style.padding = "10px";
		alphaOptionsWrap.style.border = "1px solid rgba(255,255,255,0.15)";
		alphaOptionsWrap.style.borderRadius = "6px";
		alphaOptionsWrap.style.background = "rgba(0,0,0,0.12)";
		
		const showAlpha = (selectedFormId === "alpha");
		alphaOptionsWrap.style.display = showAlpha ? "" : "none";
		
		if (showAlpha) {
		  const title = document.createElement("div");
		  title.textContent = "Alpha Options";
		  title.style.fontWeight = "bold";
		  title.style.marginBottom = "8px";
		
		  // Helper to make small labels
		  const mkLabel = (txt) => {
		    const d = document.createElement("div");
		    d.textContent = txt;
		    d.style.color = "#FFC200";
		    d.style.fontSize = "12px";
		    d.style.marginTop = "8px";
		    return d;
		  };
		
		  // 1) Body/Mind choice
		  alphaOptionsWrap.appendChild(mkLabel("Increase Attribute (+1):"));
		
		  const attrRow = document.createElement("div");
		  attrRow.style.display = "flex";
		  attrRow.style.gap = "10px";
		  attrRow.style.flexWrap = "wrap";
		
		  const mkRadio = (value, labelText) => {
		    const wrap = document.createElement("label");
		    wrap.style.display = "flex";
		    wrap.style.alignItems = "center";
		    wrap.style.gap = "6px";
		    wrap.style.cursor = "pointer";
		
		    const r = document.createElement("input");
		    r.type = "radio";
		    r.name = "alpha_attr_pick";
		    r.value = value;
		    r.checked = (formChoiceState.alpha.attr === value);
		    r.onchange = () => {
		      formChoiceState.alpha.attr = value;
		      renderUpgrades();
		    };
		
		    const t = document.createElement("span");
		    t.textContent = labelText;
		
		    wrap.append(r, t);
		    return wrap;
		  };
		
		  attrRow.append(
		    mkRadio("body_attr", "BODY"),
		    mkRadio("mind", "MIND")
		  );
		
		  alphaOptionsWrap.appendChild(attrRow);
		
		  // 2) Skill choice (+1)
		  alphaOptionsWrap.appendChild(mkLabel("Increase Skill (+1):"));
		
		  const skillSelect = document.createElement("select");
		  skillSelect.style.width = "100%";
		  skillSelect.style.padding = "5px";
		  skillSelect.style.backgroundColor = "#fde4c9";
		  skillSelect.style.color = "black";
		  skillSelect.style.borderRadius = "5px";
		
		  // For creatures, skills are typically melee/guns/other in your attack parsing logic:contentReference[oaicite:6]{index=6}
		  const creatureSkillKeys = ["melee", "guns", "other"];
		  skillSelect.append(new Option("-- Choose --", ""));
		  for (const sk of creatureSkillKeys) {
		    const opt = new Option(titleCase(sk), sk);
		    if (formChoiceState.alpha.skill === sk) opt.selected = true;
		    skillSelect.append(opt);
		  }
		  skillSelect.onchange = () => {
		    formChoiceState.alpha.skill = skillSelect.value;
		    renderUpgrades();
		  };
		
		  alphaOptionsWrap.appendChild(skillSelect);
		
		  // 3) DR or Attack upgrade
		  alphaOptionsWrap.appendChild(mkLabel("Bonus:"));
		
		  const modeRow = document.createElement("div");
		  modeRow.style.display = "flex";
		  modeRow.style.gap = "10px";
		  modeRow.style.flexWrap = "wrap";
		
		  const mkModeRadio = (value, labelText) => {
		    const wrap = document.createElement("label");
		    wrap.style.display = "flex";
		    wrap.style.alignItems = "center";
		    wrap.style.gap = "6px";
		    wrap.style.cursor = "pointer";
		
		    const r = document.createElement("input");
		    r.type = "radio";
		    r.name = "alpha_mode_pick";
		    r.value = value;
		    r.checked = (formChoiceState.alpha.mode === value);
		    r.onchange = () => {
		      formChoiceState.alpha.mode = value;
		      renderUpgrades();
		    };
		
		    const t = document.createElement("span");
		    t.textContent = labelText;
		
		    wrap.append(r, t);
		    return wrap;
		  };
		
		  modeRow.append(
		    mkModeRadio("dr", "DR +1 (one type, all locations)"),
		    mkModeRadio("attack", "Attack +1D6 (one attack)")
		  );
		
		  alphaOptionsWrap.appendChild(modeRow);
		
		  // DR type select
		  const drSelect = document.createElement("select");
		  drSelect.style.width = "100%";
		  drSelect.style.marginTop = "6px";
		  drSelect.style.padding = "5px";
		  drSelect.style.backgroundColor = "#fde4c9";
		  drSelect.style.color = "black";
		  drSelect.style.borderRadius = "5px";
		  drSelect.style.display = (formChoiceState.alpha.mode === "dr") ? "" : "none";
		
		  const drOpts = [
		    { v: "phys",   t: "Physical DR" },
		    { v: "energy", t: "Energy DR" },
		    { v: "rad",    t: "Radiation DR" }
		  ];
		  for (const o of drOpts) {
		    const opt = new Option(o.t, o.v);
		    if (formChoiceState.alpha.drType === o.v) opt.selected = true;
		    drSelect.append(opt);
		  }
		  drSelect.onchange = () => {
		    formChoiceState.alpha.drType = drSelect.value;
		    renderUpgrades();
		  };
		
		  // Attack select (by index)
		  const atkSelect = document.createElement("select");
		  atkSelect.style.width = "100%";
		  atkSelect.style.marginTop = "6px";
		  atkSelect.style.padding = "5px";
		  atkSelect.style.backgroundColor = "#fde4c9";
		  atkSelect.style.color = "black";
		  atkSelect.style.borderRadius = "5px";
		  atkSelect.style.display = (formChoiceState.alpha.mode === "attack") ? "" : "none";
		
		  atkSelect.append(new Option("-- Choose Attack --", ""));
		  const attacks = Array.isArray(original.attacks) ? original.attacks : [];
		  attacks.forEach((a, idx) => {
		    const name = (a?.name || `Attack ${idx + 1}`).toString();
		    const opt = new Option(name, String(idx));
		    if (String(formChoiceState.alpha.attackIndex) === String(idx)) opt.selected = true;
		    atkSelect.append(opt);
		  });
		  atkSelect.onchange = () => {
		    formChoiceState.alpha.attackIndex = parseInt(atkSelect.value || "0");
		    renderUpgrades();
		  };
		
		  alphaOptionsWrap.append(drSelect, atkSelect);
		
		  // Keep the selects in sync on rerender
		  if (formChoiceState.alpha.mode === "dr") {
		    drSelect.style.display = "";
		    atkSelect.style.display = "none";
		  } else {
		    drSelect.style.display = "none";
		    atkSelect.style.display = "";
		  }
		
		  alphaOptionsWrap.prepend(title);
		}
		
		formSection.appendChild(alphaOptionsWrap);
		
		formSection.append(formTitle, formSelect, formPreview);
		upgradeArea.appendChild(formSection);

		
		upgradeArea.appendChild(attrContainer);
		
		if (!isCreature) {
		    upgradeArea.appendChild(skillContainer);
		}
		
		upgradeArea.appendChild(resetButton);
		upgradeArea.appendChild(derivedBlock);

	if (!temp.skills) temp.skills = [];

	const skillMap = Object.fromEntries(
	    (temp.skills || []).map(s => [s.name?.toLowerCase(), s])
	);

	for (let skillKey of Object.keys(skillUpgrades)) {
	    const added = skillUpgrades[skillKey] || 0;
	    if (added === 0) continue;
	
	    const existing = skillMap[skillKey];
	    const base = existing ? parseInt((existing.desc || "0").match(/\d+/)?.[0] || "0") : 0;
	    const updatedDesc = `${base + added}` + (existing?.desc?.includes("⬛") ? " ⬛" : "");
	
	    if (existing) {
	        existing.desc = updatedDesc;
	    } else {
	        temp.skills.push({ name: titleCase(skillKey), desc: updatedDesc });
	    }
	}
	
	// === Step 7 injection: Major Tag skills as rank 2 ⬛ ===
	if (isMajorPromoActive(original) && (majorTagSelections || []).length) {
	  for (const sk of majorTagSelections) {
	    ensureTagSkill(temp, sk);
	  }
	}
	
		if (temp.attacks && Array.isArray(temp.attacks)) {
	    for (let attack of temp.attacks) {
	        let match = attack.name?.match(/text\((.*?):\s*(\w+)\s*\+\s*([\w\s]+)\s*\(TN\s*(\d+)\)\)/i);
	        if (match) {
	            const [, attackName, attrKey, skillKey] = match;
	
	            const attr = parseInt(temp[attrNameMap[attrKey.toUpperCase()] || ""] || "0");
	            const skillKeyNorm = skillKey.trim().toLowerCase();
	            let skill = 0;

	// Character: get from skills[]
				const skillObj = (temp.skills || []).find(s => s.name?.toLowerCase() === skillKeyNorm);
				if (skillObj) {
				    skill = parseInt((skillObj.desc || "0").match(/\d+/)?.[0] || "0");
				} else if (["melee", "guns", "other"].includes(skillKeyNorm)) {
				    // Creature: use direct stat fields
				    skill = parseInt(temp[skillKeyNorm] || "0");
				}

	
	            const newTN = attr + skill;
	
	            // Rebuild the attack name with updated TN
	            attack.name = attack.name.replace(/\(TN\s*\d+\)/, `(TN ${newTN})`);
	        }
	    }
	}
	
		if (isCreature && levelGain >= 2 && Array.isArray(temp.attacks)) {
	    const bonusDice = Math.floor(levelGain / 2);
	    const upgradeTitle = document.createElement("div");
upgradeTitle.innerHTML = `<strong style="font-size:14px; color:#FFC200;">Damage Upgrades</strong>`;
upgradeTitle.style.marginTop = "20px";
upgradeArea.appendChild(upgradeTitle);

// Remaining count
const usedDice = Object.values(creatureDamageUpgrades).reduce((a, b) => a + b, 0);
const remainingDice = bonusDice - usedDice;

if (remainingDice > 0) {
    const note = document.createElement("div");
    note.innerHTML = `<em style="color:#FFC200">D6s Left: ${remainingDice}</em>`;
    upgradeArea.appendChild(note);
}

	
	    temp.attacks.forEach((atk, i) => {
	        const row = document.createElement("div");
	        row.style.display = "flex";
	        row.style.justifyContent = "space-between";
	        row.style.alignItems = "center";
	        row.style.marginBottom = "4px";
	
	        const label = document.createElement("div");
			const atkName = atk.name?.match(/text\(([^:]+):/i)?.[1] ?? "Attack";
			const bonus = creatureDamageUpgrades[i] || 0;
			
			label.innerHTML = bonus > 0
			    ? `<strong style="color:#FFC200">Upgrade "${atkName}" → +${bonus}D6</strong>`
			    : `Upgrade "${atkName}"`;

	
	        const buttonRow = document.createElement("div");
	        buttonRow.style.display = "flex";
	        buttonRow.style.gap = "4px";
	
	        const plus = createButton("+", () => {
	            const used = Object.values(creatureDamageUpgrades).reduce((a, b) => a + b, 0);
	            if (used < bonusDice) {
	                creatureDamageUpgrades[i] = (creatureDamageUpgrades[i] || 0) + 1;
	                renderUpgrades();
	            }
	        });
	
	        const minus = createButton("-", () => {
	            if ((creatureDamageUpgrades[i] || 0) > 0) {
	                creatureDamageUpgrades[i]--;
	                renderUpgrades();
	            }
	        });
	
	        buttonRow.append(plus, minus);
	        row.append(label, buttonRow);
	        upgradeArea.appendChild(row);
	    });
	}
		if (isCreature && Array.isArray(temp.attacks)) {
	    for (let [i, amount] of Object.entries(creatureDamageUpgrades)) {
	        const atk = temp.attacks[i];
	        atk.desc = atk.desc.replace(
	            /(\d+)\s*D6/i,
	            (match, num) => `${parseInt(num) + amount} D6`
	        );
	    }
	}

	if (isCreature && levelGain >= 2) {
    const bonusDR = Math.floor(levelGain / 2);
    
    const upgradeTitle = document.createElement("div");
    upgradeTitle.innerHTML = `<strong style="font-size:14px; color:#FFC200;">DR Upgrades</strong>`;
    upgradeTitle.style.marginTop = "20px";
    upgradeArea.appendChild(upgradeTitle);

    const used = Object.values(creatureDRUpgrades).reduce((a, b) => a + b, 0);
    const remaining = bonusDR - used;

    if (remaining > 0) {
        const note = document.createElement("div");
        note.innerHTML = `<em style="color:#FFC200">Upgrades Left: ${remaining}</em>`;
        upgradeArea.appendChild(note);
    }

	    // DR types to upgrade
	    const drTypes = ["Physical", "Energy", "Radiation"];
		const keyMap = {
		    "Physical": "phys",
		    "Energy": "energy",
		    "Radiation": "rad"
		};
		
		drTypes.forEach(type => {
		    const typeKey = keyMap[type];
		
		    // ✅ Skip showing if Immune
		    const fieldName = typeKey === "phys" ? "phys_dr" :
		                      typeKey === "energy" ? "energy_dr" :
		                      "rad_dr";
		
		    const fieldValue = original[fieldName] ?? "-";
		    if (fieldValue.toString().toLowerCase().includes("immune")) {
		        return; // ⬅️ Skip creating buttons for Immune types
		    }
		
		    // 🔽 [Create the normal label/button UI as you already do]
		    const row = document.createElement("div");
		    row.style.display = "flex";
		    row.style.justifyContent = "space-between";
		    row.style.alignItems = "center";
		    row.style.marginBottom = "4px";
		
		    const label = document.createElement("div");
		    const bonus = creatureDRUpgrades[typeKey] || 0;
		    label.innerHTML = bonus > 0
		        ? `<strong style="color:#FFC200">${type} DR → +${bonus}</strong>`
		        : `${type} DR`;
		
		    const buttonRow = document.createElement("div");
		    buttonRow.style.display = "flex";
		    buttonRow.style.gap = "4px";
		
		    const plus = createButton("+", () => {
		        const used = Object.values(creatureDRUpgrades).reduce((a, b) => a + b, 0);
		        if (used < bonusDR) {
		            creatureDRUpgrades[typeKey] = (creatureDRUpgrades[typeKey] || 0) + 1;
		            renderUpgrades();
		        }
		    });
		
		    const minus = createButton("-", () => {
		        if ((creatureDRUpgrades[typeKey] || 0) > 0) {
		            creatureDRUpgrades[typeKey]--;
		            renderUpgrades();
		        }
		    });
		
		    buttonRow.append(plus, minus);
		    row.append(label, buttonRow);
		    upgradeArea.appendChild(row);
		});
}

		if (isCreature) {
		    if (original.phys_dr !== undefined) {
		        temp.phys_dr = upgradeDRString(original.phys_dr, creatureDRUpgrades.phys || 0);
		    }
		    if (original.energy_dr !== undefined) {
		        temp.energy_dr = upgradeDRString(original.energy_dr, creatureDRUpgrades.energy || 0);
		    }
		    if (original.rad_dr !== undefined) {
		        temp.rad_dr = upgradeDRString(original.rad_dr, creatureDRUpgrades.rad || 0);
		    }
		}
		
		// === Phase 4.1: Alpha DR bonus (one type, all locations) ===
		if (selectedFormId === "alpha") {
		  const st = formChoiceState?.alpha;
		
		  if (st?.mode === "dr" && ["phys", "energy", "rad"].includes(st.drType)) {
		    const fieldName =
		      st.drType === "phys" ? "phys_dr" :
		      st.drType === "energy" ? "energy_dr" :
		      "rad_dr";
		
		    // If the creature doesn't have the field, treat it as "-" so upgradeDRString can create "1 (All)"
		    const current = (temp[fieldName] !== undefined) ? temp[fieldName] : "-";
		    temp[fieldName] = upgradeDRString(current, 1);
		  }
		}

	
		if (!isCreature && levelGain >= 2) {
	    const bonusGear = Math.floor(levelGain / 2);
	
	    const upgradeTitle = document.createElement("div");
	    upgradeTitle.innerHTML = `<strong style="font-size:14px; color:#FFC200;">Gear Upgrades</strong>`;
	    upgradeTitle.style.marginTop = "20px";
	    upgradeArea.appendChild(upgradeTitle);
	
	    const gearTypes = ["Weapon", "Armor"];
	    gearTypes.forEach(type => {
	        const used = (type === "Weapon") ? characterWeaponUpgrades : characterArmorUpgrades;
	        const remaining = bonusGear - used;
	
	        const row = document.createElement("div");
	        row.style.display = "flex";
	        row.style.flexDirection = "column"; // ✅ Stack label and note vertically
		    row.style.alignItems = "flex-start";
		    row.style.marginBottom = "8px";
		    row.style.marginLeft = "8px";
	
	        const label = document.createElement("div");
	        label.innerHTML = remaining >= 0
	            ? `${type} Upgrade${bonusGear > 1 ? "s" : ""}: <strong style="color:#FFC200">${remaining} left</strong>`
	            : `${type} Upgrades: 0 left`;
			
			 const note = document.createElement("div");
			    note.style.fontSize = "12px";
			    note.style.color = "#FFC200";
			    note.style.marginBottom = "5px";
			    note.textContent = (type === "Weapon")
			        ? "Replace or mod a weapon."
			        : "Replace or mod a piece of armor or clothing.";
			
	        const buttonRow = document.createElement("div");
		        buttonRow.style.display = "flex";
		        buttonRow.style.gap = "4px";
		        buttonRow.style.marginBottom = "10px";
	        const plus = createButton("+", () => {
	            if (used < bonusGear) {
	                if (type === "Weapon") characterWeaponUpgrades++;
	                else characterArmorUpgrades++;
	                renderUpgrades();
	            }
	        });
	        plus.style.marginLeft ="0px"
	
	        const minus = createButton("-", () => {
	            if (type === "Weapon" && characterWeaponUpgrades > 0) {
	                characterWeaponUpgrades--;
	                renderUpgrades();
	            } else if (type === "Armor" && characterArmorUpgrades > 0) {
	                characterArmorUpgrades--;
	                renderUpgrades();
	            }
	        });
			minus.style.marginLeft ="0px"
	
	        buttonRow.append(plus, minus);
	        row.append(label,note, buttonRow);
	        
	        // ✅ New: Add Reminder Note
   
    
   
	        
	        
	        upgradeArea.appendChild(row);
	    });
	}

	if (!isCreature && temp.scavenge_rules && derived.wealth !== undefined) {
    let wealthUpdated = false;

    for (let rule of temp.scavenge_rules) {
        if (rule.desc?.match(/Wealth\s*\d+/i)) {
            rule.desc = rule.desc.replace(/Wealth\s*\d+/i, `Wealth ${derived.wealth}`);
            wealthUpdated = true;
            break;
        }
    }

    // ✅ If no Wealth field was found, add it to the first scavenge_rules item
	    if (!wealthUpdated && temp.scavenge_rules.length > 0) {
		    if (!temp.scavenge_rules[0].desc) {
		        temp.scavenge_rules[0].desc = `Wealth ${derived.wealth}`;
		    } else {
		       temp.scavenge_rules[0].desc += `\\nWealth ${derived.wealth}`;
		    }
		}
	}
	// === Legendary Injection (Phase 2) ===
	removeInjectedLegendaryAbility(temp);
	
	if (legendaryEnabled && selectedLegendaryAbilityId) {
	  const a = legendaryAbilityById[selectedLegendaryAbilityId];
	  if (a && abilityEligibleForNpc(a, temp)) {
	    injectLegendaryAbility(temp, a);
	  }
	}
	// === Phase 4.2: Apply form mechanics (Glowing, etc.) ===
	if (selectedFormId && formsById[selectedFormId]?.spec?.mechanics?.operations?.length) {
	  applyFormOperations(temp, formsById[selectedFormId].spec.mechanics.operations);
	}
		// === Phase 4 injection ===
	if (selectedFormId && formsById[selectedFormId]) {
	  injectForm(temp, formsById[selectedFormId]);
	} else {
	  removeInjectedForm(temp);
	}
	
	// === Phase 4.1: Apply Alpha transient bonuses into final fields ===
	if (temp.__formHpBonus) {
	  const curHp = parseInt(temp.hp || "0");
	  temp.hp = String(curHp + parseInt(temp.__formHpBonus || "0"));
	}
	
	// DR bonus: stack onto your existing creature DR upgrade mechanism by directly bumping locations.
	// This assumes your creature statblocks use fields like phys_dr / energy_dr / rad_dr OR a per-location structure.
	// If you already have a DR-upgrade applicator elsewhere, route this into that instead.
	if (temp.__formDrBonus) {
	  const { type, amount } = temp.__formDrBonus;
	  // If your YAML uses top-level fields:
	  const keyMap = { phys: "phys_dr", energy: "energy_dr", rad: "rad_dr" };
	  const k = keyMap[type];
	  if (k && temp[k] !== undefined) {
	    temp[k] = String(parseInt(temp[k] || "0") + amount);
	  }
	  // If you have location-based DR, we’ll wire that in next once you confirm the exact field shape used in your creature statblocks.
	}
	
	// === Form attack bonus (ALPHA etc) - apply directly to temp.attacks WITHOUT touching creatureDamageUpgrades ===
	if (temp.__formAttackBonus && Array.isArray(temp.attacks)) {
	  const idx = temp.__formAttackBonus.attackIndex;
	  const d6 = temp.__formAttackBonus.d6 || 0;
	
	  if (temp.attacks[idx] && d6 > 0) {
	    temp.attacks[idx] = applyBonusD6ToAttack(temp.attacks[idx], d6);
	  }
	}

	
	// Cleanup transient keys so they don't leak into YAML
	delete temp.__formHpBonus;
	delete temp.__formDrBonus;
	delete temp.__formAttackBonus;
	
	if (!viewOriginal) {
		resultBlock.textContent = "```statblock\n" + yamlify(temp) + "\n```";
	} else {
		resultBlock.textContent = "```statblock\n" + yamlify(original) + "\n```";
	}
}

	function calculateDerived(npc) {
	    const playerLevel = parseInt(levelInput.input.value);
		const npcLevel = parseInt(original.level || "0");
		const levelGain = Math.max(playerLevel - npcLevel, 0);
	
		const isCreature = npc.type?.toLowerCase().includes("creature");
		const hp = { base: parseInt(original.hp || "0"), total: 0 };
	
		if (isCreature) {
	    const body = parseInt(npc.body_attr || "0");
	    const baseHP = parseInt(original.hp || "0");
	    hp.base = baseHP;
	
	    // ✅ Re-check BIG/LITTLE on the original statblock
	    const specials = original.special_abilities || [];
	    const big = specials.some(e =>
	        e.name?.toLowerCase().trim().replace(":", "") === "big"
	    );
	    const little = specials.some(e =>
	        e.name?.toLowerCase().trim().replace(":", "") === "little"
	    );
	
	    const bonus = (big ? levelGain : 0) - (little ? levelGain : 0);
	    hp.total = baseHP + levelGain + bonus;
		
		} else {
		    const end = parseInt(npc.end || "0");
		    const baseHP = end + npcLevel;
		    hp.base = baseHP;
		    hp.total = baseHP + levelGain;
		}

	    const initiative = isCreature
	        ? parseInt(npc.body_attr || "0") + parseInt(npc.mind || "0")
	        : parseInt(npc.per || "0") + parseInt(npc.agi || "0");
	
	    let def;

		if (npc.defense !== undefined && npc.defense !== "") {
		  def = parseInt(npc.defense, 10);
		} else if (!isCreature) {
		  def = parseInt(npc.agi || "0", 10) >= 9 ? 2 : 1; // character-only fallback
		} else {
		  def = 1; // creature fallback when missing from statblock
		}
		
	    const str = parseInt(npc.strength || npc.body || "0");
	    let melee = "";
	    if (str >= 11) melee = "+3D6";
	    else if (str >= 9) melee = "+2D6";
	    else if (str >= 7) melee = "+1D6";
	    else melee = "+0";
	    
	    
	    let wealth = undefined;

		if (!isCreature) {
		    const baseWealth = extractWealthFromScavenge(original);
		    const wealthGain = Math.floor(levelGain / 3);
		    wealth = baseWealth + wealthGain;
		}

	
	return { hp, initiative, defense: def, melee, isCreature, levelGain, wealth };
}




function getUsedAttributePoints() {
    return Object.values(upgrades).reduce((a, b) => a + b, 0);
}
function getPromoUsedAttributePoints() {
  const legendaryPromoUsed = (legendaryPromoBodySpent || 0) + (legendaryPromoMindSpent || 0);
  const majorPromoUsed = Object.values(majorPromoSpent || {}).reduce((a, b) => a + (b || 0), 0);
  return legendaryPromoUsed + majorPromoUsed;
}

function getUsedNormalAttributePoints() {
  const totalUsed = getUsedAttributePoints();
  const promoUsed = getPromoUsedAttributePoints();
  return Math.max(0, totalUsed - promoUsed);
}

function getUsedSkillPoints() {
    return Object.values(skillUpgrades).reduce((a, b) => a + b, 0);
}

function yamlify(obj, indent = "") {
    if (Array.isArray(obj)) {
        return obj.map(e => `${indent}- ${yamlify(e, indent + "  ").trimStart()}`).join("\n");
    } else if (typeof obj === "object" && obj !== null) {
        return Object.entries(obj).map(([k, v]) => {
            return typeof v === "object"
                ? `${indent}${k}:\n${yamlify(v, indent + "  ")}`
                : `${indent}${k}: ${quoteIfNeeded(v)}`;
        }).join("\n");
    }
    return `${indent}${quoteIfNeeded(obj)}`;
}

function quoteIfNeeded(value) {
    if (typeof value === "string") {
        // Always quote strings that aren't pure numbers or booleans
        const needsQuotes = /[^a-zA-Z0-9_]/.test(value) || value === "" || !isNaN(value);
        if (needsQuotes) {
            return `"${value.replace(/"/g, '\\"')}"`; // escape inner quotes
        }
    }
    return value;
}


function createLabeledNumber(label, def = "") {
    const input = document.createElement("input");
    input.type = "number";
    input.value = def;
    input.style.padding = "5px";
    input.style.width = "60px";
    input.style.background = "#fde4c9";
    input.style.color = "black";
    const lbl = document.createElement("label");
    lbl.textContent = label;
    lbl.style.color = "#FFC200";
    return { label: lbl, input };
}

function createLabeledDropdown(label) {
    const select = document.createElement("select");
    select.style.padding = "5px";
    const lbl = document.createElement("label");
    lbl.textContent = label;
    lbl.style.color = "#FFC200";
    return { label: lbl, input: select };
}

async function updateFileDropdown() {
    const val = folderSelect.input.value;
    fileSelect.input.innerHTML = "";
    fileSelect.input.style.backgroundColor = "#fde4c9";
	fileSelect.input.style.color = "black";
	fileSelect.input.style.borderRadius = "5px"
    const options = allFiles
        .filter(f => f.path.startsWith(val) && f.path.endsWith(".md"))
        .sort((a, b) => a.basename.localeCompare(b.basename)); // ✅ alphabetical sort

    for (const f of options) {
        fileSelect.input.append(new Option(f.basename, f.path));
    }
}


function createButton(text, handler) {
    const btn = document.createElement("button");
    btn.textContent = text;
    btn.style.marginLeft = "8px";
    btn.style.backgroundColor = "#2e4663";
    btn.style.color = "#ffc200";
    btn.style.border = "none";
    btn.style.borderRadius = "5px";
    btn.style.cursor = "pointer";
    btn.style.border = "1px solid grey";
    btn.onclick = handler;
    return btn;
}

// == Functions for Legendary Abilities ==
async function loadLegendaryAbilities() {
  const files = app.vault.getFiles().filter(f =>
    f.path.startsWith(LEGENDARY_ABILITIES_PATH) && f.path.endsWith(".md")
  );

  const abilities = [];
  for (const f of files) {
    const content = await app.vault.read(f);
    const parsed = parseLegendaryAbilityMarkdown(content, f.path);
    if (parsed) abilities.push(parsed);
  }

  // Sort A–Z
  abilities.sort((a, b) => (a.name || "").localeCompare(b.name || ""));

  legendaryAbilities = abilities;
  legendaryAbilityById = Object.fromEntries(abilities.map(a => [a.id, a]));
}

async function loadCreatureForms() {
  const folder = "Testing/Forms/Creature Forms";
  const files = app.vault.getFiles().filter(f =>
f.path.startsWith(folder) && f.extension === "md"
  );
  
  availableForms = [];
  formsById = {};

  for (const file of files) {

    const raw = await app.vault.read(file);

    const idMatch = raw.match(/<!--\s*id:\s*([a-z0-9_-]+)\s*-->/i);
    if (!idMatch) continue;

    const id = idMatch[1];

    const specMatch = raw.match(/```yaml[\s\r\n]*spec:\s*([\s\S]*?)```/i);
	if (!specMatch) console.log("[Forms] No spec block match:", file.path);

    if (!specMatch) continue;
	// DEBUG: confirm we matched the YAML block
	// console.log("Form file:", file.path, "id:", id, "specMatch len:", specMatch[1]?.length);

    let spec;
	try {
	  spec = parseFormSpec(specMatch[1] || "");
	} catch (e) {
	  console.error(`Failed to parse spec for form ${id} (${file.path})`, e);
	  continue;
	}


    const effectStart = raw.indexOf("### Effect");
    const effectText =
      effectStart !== -1
        ? raw.slice(effectStart + 10).split("```")[0].trim()
        : "";

    const form = {
      id,
      name: spec.name,
      applies_to: spec.applies_to,
      requirements: spec.requirements || {},
      injection: spec.injection,
      effectText,
      spec,
      filePath: file.path,
    };

    availableForms.push(form);
    formsById[id] = form;
  }

}

function parseFormSpec(specBlockText) {
  const lines = specBlockText
    .replace(/\r\n/g, "\n")
    .replace(/\t/g, "  ")
    .split("\n");

  const spec = {
    requirements: {},
    injection: {},
    mechanics: { operations: [] }
  };

  let section = ""; // "", "requirements", "injection", "mechanics"
  let inOps = false;
  let currentOp = null;

  const stripQuotes = (s) => (s || "").trim().replace(/^"|"$/g, "");

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const trimmed = raw.trim();
    if (!trimmed) continue;

    // Section headers
    if (trimmed === "requirements:") { section = "requirements"; inOps = false; currentOp = null; continue; }
    if (trimmed === "injection:")    { section = "injection";    inOps = false; currentOp = null; continue; }
    if (trimmed === "mechanics:")    { section = "mechanics";    inOps = false; currentOp = null; continue; }

    if (section === "mechanics" && trimmed === "operations:") {
      inOps = true;
      currentOp = null;
      continue;
    }

    // Operations list items: "- op: set_dr"
    if (section === "mechanics" && inOps && trimmed.startsWith("- ")) {
      const kv = trimmed.slice(2).trim(); // "op: set_dr"
      const m = kv.match(/^([a-zA-Z0-9_]+)\s*:\s*(.*)$/);
      currentOp = {};
      if (m) currentOp[m[1]] = stripQuotes(m[2]);
      spec.mechanics.operations.push(currentOp);
      continue;
    }

    // Indented op fields under the current op
    if (section === "mechanics" && inOps && currentOp && raw.startsWith("  ")) {
      const m = trimmed.match(/^([a-zA-Z0-9_]+)\s*:\s*(.*)$/);
      if (m) currentOp[m[1]] = stripQuotes(m[2]);
      continue;
    }

    // Array item: "- something" for requirements.exclude
    if (trimmed.startsWith("- ")) {
      const item = stripQuotes(trimmed.slice(2));
      if (section === "requirements") {
        if (!Array.isArray(spec.requirements.exclude)) spec.requirements.exclude = [];
        spec.requirements.exclude.push(item.toLowerCase());
      }
      continue;
    }

    // Key: value
    const m = trimmed.match(/^([a-zA-Z0-9_]+)\s*:\s*(.*)$/);
    if (!m) continue;

    const key = m[1];
    const val = stripQuotes(m[2]);

    if (!section) {
      if (key === "name") spec.name = val;
      else if (key === "applies_to") spec.applies_to = val;
      else if (key === "id") spec.id = val;
      else if (key === "version") spec.version = val;
      continue;
    }

    if (section === "requirements") {
      // Ignore include for now; exclude is handled via "- " items
      continue;
    }

    if (section === "injection") {
      if (key === "name") spec.injection.name = val;
      else if (key === "title") spec.injection.title = val;
      // Other injection keys are fine to ignore for now
      continue;
    }
  }

  // Minimal validation
  if (!spec.name) throw new Error("spec.name missing");
  if (!spec.applies_to) throw new Error("spec.applies_to missing");
  if (!spec.injection?.name) throw new Error("spec.injection.name missing");
  if (!spec.injection?.title) throw new Error("spec.injection.title missing");

  // Normalize
  if (spec.requirements.exclude && Array.isArray(spec.requirements.exclude)) {
    spec.requirements.exclude = spec.requirements.exclude.map(x => (x || "").toLowerCase());
  }

  return spec;
}



// Parses your markdown template:
// <!-- id: xyz -->
// ###### NAME
// **Requirements:** ...
// **Description:** ...
// **Effect:** ...
// **Mutation:** ...
function parseLegendaryAbilityMarkdown(md, path) {
  const idMatch = md.match(/<!--\s*id:\s*([a-z0-9_ -]+)\s*-->/i);
  if (!idMatch) return null;
  const id = idMatch[1].trim().toLowerCase().replace(/\s+/g, "_");

  const nameMatch = md.match(/^\s*######\s+(.+?)\s*$/m);
  const name = (nameMatch?.[1] || "").trim();

  const requirements = extractSection(md, "**Requirements:**");
  const description  = extractSection(md, "**Description:**");
  const effect       = extractSection(md, "**Effect:**");
  const mutation     = extractSection(md, "**Mutation:**");

  // Effect/Mutation are required for your use-case
  if (!name || !effect || !mutation) return null;

  return { id, name, requirements, description, effect, mutation, path };
}

// Pulls text after a label until the next **Label:** or end of file.
// Returns "" if not found.
function extractSection(md, label) {
  const idx = md.indexOf(label);
  if (idx === -1) return "";
  const after = md.slice(idx + label.length);

  // Stop at next **Something:** (bold label) on its own line
  const stop = after.search(/\n\s*\*\*[^*]+:\*\*/);
  const chunk = (stop === -1 ? after : after.slice(0, stop));

  return chunk.trim();
}

function isCreatureNPC(npcObj) {
  return (npcObj.type || "").toLowerCase().includes("creature");
}

function isCharacterNPC(npcObj) {
  return (npcObj.type || "").toLowerCase().includes("character");
}

function isAlreadyLegendaryOrMajor(npcObj) {
  const t = (npcObj.type || "").toLowerCase();
  return t.includes("legendary") || t.includes("major");
}

// Requirements filtering: only enforce Characters vs Creatures for Phase 2.
function abilityEligibleForNpc(ability, npcObj) {
  const req = (ability.requirements || "").toLowerCase().trim();
  if (!req) return true;

  const { typeStr, keywords } = getNpcMeta(npcObj);

  if (req.includes("characters only")) return typeStr.includes("character");
  if (req.includes("creatures only"))  return typeStr.includes("creature");

  // Simple keyword patterns (covers your “Not Robot” style)
  // Examples matched:
  // "not robot", "not a robot", "not a mutant", "robots only"
  const notMatch = req.match(/\bnot\s+(?:a\s+|an\s+)?([a-z0-9_-]+)\b/);
  if (notMatch) {
    return !keywords.has(notMatch[1]);
  }

  const onlyMatch = req.match(/\b([a-z0-9_-]+)s?\s+only\b/);
  if (onlyMatch) {
    const kw = onlyMatch[1].endsWith("s") ? onlyMatch[1].slice(0, -1) : onlyMatch[1];
    return keywords.has(kw);
  }

  return true;
}


function removeInjectedLegendaryAbility(npcObj) {
  if (!npcObj.special_abilities || !Array.isArray(npcObj.special_abilities)) return;

  npcObj.special_abilities = npcObj.special_abilities.filter(sa => {
    const desc = (sa?.desc || "");
    return !desc.includes("<!-- id:");
  });
}

function buildLegendaryInjectedDesc(ability) {
  // Use literal "\n" in YAML by storing "\\n" in the string
  const NL = "\\n";
  const NLB = "\\n\\n";

  const traitText =
    "A Legendary creature or Major character mutates the first time they are reduced to below half of their maximum HP, at which point they immediately take an extra turn (this is in addition to the creature or character’s normal turn) and gain the **Mutation** effect of their Legendary Ability for the remainder of the scene." +
    NL +
    "If a creature mutates and then regains enough HP to go above half its maximum HP, the creature cannot mutate a second time.";

  const descLines = [];

  descLines.push(`<!-- id: ${ability.id} -->`);
  descLines.push(traitText);
  descLines.push(""); // blank line

  // Quote block for name (matches your desired formatting)
  descLines.push(`>**${ability.name}**`);

  if (ability.description) {
    descLines.push(ability.description);
    descLines.push(""); // blank line
  }

  descLines.push(`**Effect:** ${ability.effect}`);
  descLines.push(""); // blank line
  descLines.push(`**Mutation:** ${ability.mutation}`);

  // Join with literal \n
  return descLines.join(NL).replaceAll(`${NL}${NL}${NL}`, NLB); // keep it tidy
}

function injectLegendaryAbility(npcObj, ability) {
  if (!npcObj.special_abilities || !Array.isArray(npcObj.special_abilities)) {
    npcObj.special_abilities = [];
  }

  // Replace policy: remove old injected entries, then add new
  removeInjectedLegendaryAbility(npcObj);

  const title = isCreatureNPC(npcObj) ? "LEGENDARY CREATURE" : "MAJOR CHARACTER";
  npcObj.special_abilities.unshift({
    name: title,
    desc: buildLegendaryInjectedDesc(ability),
  });
}


return container;
})();

```