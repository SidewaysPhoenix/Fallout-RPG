```js-engine
// Source-driven equipment support shared by the GM and player notes.
// This block is embedded in both notes: no additional plugin or script is required.
const vendorEquipment = (() => {
  // JS-Engine injects obsidian; do not import it with Electron's require.
  let sheetRoot = null;
  let activeInspector = null;
  let inspectionEpoch = 0;
  function bindRoot(root) { sheetRoot = root; }
  const MOD_ROOT = 'Fallout-RPG/Items/Mods/';
  const filesByPath = new Map();
  const sources = new Map();
  let definitions = [];
  let pending = null;
  const text = v => v == null ? '' : String(v);
  const num = v => Number(text(v).match(/[+-]?\d+(?:\.\d+)?/)?.[0] || 0);
  const plain = v => text(v).replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_,p,a)=>a||p.split('/').pop()).replace(/\.md$/i,'');
  const kind = item => /\/Items\/Weapons\//.test(item?.sourcePath || '') || item?.category === 'WEAPONS' ? 'weapon' : /\/Items\/Apparel\//.test(item?.sourcePath || '') || item?.category === 'APPAREL' ? 'apparel' : null;
  function parse(content, path) {
    const block = text(content).match(/```statblock\s*([\s\S]*?)```/i)?.[1];
    if (!block) throw Error(`No statblock in ${path}`);
    // Bare Obsidian wikilinks are strings, not YAML flow arrays.
    const yaml = block.replace(/(:[ \t]*)(\[\[[^\r\n]+?\]\])([ \t]*(?:#.*)?$)/gm,(_,a,b,c)=>a+JSON.stringify(b)+c);
    try { return obsidian.parseYaml(yaml) || {}; }
    catch(e) { throw Error(`Cannot parse ${path}: ${e.message}`); }
  }
  function coverage(raw) {
    const all=['Head','Torso','Left Arm','Right Arm','Left Leg','Right Leg'];
    const parts=(Array.isArray(raw)?raw:text(raw).split(',')).map(x=>text(x).trim().toLowerCase()).filter(Boolean);
    if(parts.some(x=>['all','any','thruster'].includes(x)))return all;
    const m={head:['Head'],optics:['Head'],torso:['Torso'],'main body':['Torso'],arm:['Left Arm','Right Arm'],arms:['Left Arm','Right Arm'],leg:['Left Leg','Right Leg'],legs:['Left Leg','Right Leg'],'left arm':['Left Arm'],'right arm':['Right Arm'],'left leg':['Left Leg'],'right leg':['Right Leg']};
    return !parts.length||parts.some(x=>!m[x])?[]:[...new Set(parts.flatMap(x=>m[x]))];
  }
  function definition(file, data) {
    const weapon=file.path.includes('/Weapon Mods/') || /\/Legendary Mods\/(?:Custom)?Weapons\//i.test(file.path);
    const legendary=/\/Legendary Mods\//i.test(file.path) || /^legendary$/i.test(text(data.category)) || /^legendary$/i.test(text(data['mod type']));
    const dr={phys:0,en:0,rad:0};
    for(const entry of data['dmg resistances'] || []) {
      const key={physical:'phys',energy:'en',radiation:'rad'}[text(entry.name).toLowerCase()];
      if(key)dr[key]=/^immune$/i.test(text(entry.desc))?'Immune':num(entry.desc);
    }
    const displayName=text(data[weapon?'mod':'mod name'] || data.mod || file.basename);
    return {id:file.path,basename:file.basename,displayName,link:`[[${file.path.replace(/\.md$/i,'')}|${displayName}]]`,
      type:legendary?'legendary':'mod',isLegendary:legendary,kind:weapon?'weapon':'apparel',
      namePrefix:text(data['name prefix'] || (legendary?displayName:'')),rarity:text(data.rarity).trim().toLowerCase(),
      cost:text(data.cost),weight:text(data.weight),costDelta:num(data.cost),effects:Array.isArray(data.effects)?data.effects:[],
      deltas:{...dr,cost:num(data.cost),weight:num(data.weight),hp:num(data.hp)},locations:data.locations,
      gameEffects:text(data.gameEffects),data};
  }
  async function load(refresh=false) {
    if(pending&&!refresh)return pending;
    pending=(async()=>{
      const next=new Map(),mods=[];
      filesByPath.clear();
      for(const file of app.vault.getMarkdownFiles()) {
        filesByPath.set(file.path,file);
        if(!/^Fallout-RPG\/Items\/(Weapons|Apparel|Mods)\//.test(file.path))continue;
        const content=await app.vault.read(file);
        if(!/```statblock/i.test(content))continue;
        const data=parse(content,file.path);
        if(file.path.startsWith(MOD_ROOT))mods.push(definition(file,data));
        else next.set(file.path,{file,data});
      }
      sources.clear();for(const [path,value] of next)sources.set(path,value);
      definitions=mods;
      return definitions;
    })().catch(e=>{pending=null;throw e;});
    return pending;
  }
  function source(item) {
    const direct=sources.get(item?.sourcePath);if(direct)return direct;
    const target=text(item?.name||item?.link||item?.yamlName).replace(/^\[\[|\]\]$/g,'').split('|')[0];
    const file=app.metadataCache.getFirstLinkpathDest(target,'');
    return file?sources.get(file.path):null;
  }
  function slots(item) {
    const src=source(item);if(!src)return [];
    return (Array.isArray(src.data.mods)?src.data.mods:[]).flatMap((slot,group)=>{
      const raw=Array.isArray(slot.desc)?slot.desc.join('\n'):text(slot.desc);
      return [...raw.matchAll(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g)].map(m=>{
        const file=app.metadataCache.getFirstLinkpathDest(m[1],src.file.path);
        const def=definitions.find(d=>d.id===file?.path && d.type==='mod');
        return def?{slot:text(slot.name).replace(/:$/,''),group,target:m[1],name:m[2]||m[1],def}:null;
      }).filter(Boolean);
    });
  }
  function specialty(item) {
    if(kind(item)==='weapon')return 'weapons_dealer';
    const data=source(item)?.data;
    if(!data)return '';
    if(/^(clothing|outfit|outfits)$/i.test(text(data.category)) || /\/(Clothing|Outfits)\//i.test(item.sourcePath))return 'apparel_vendor';
    return 'armor_vendor';
  }
  function eligibleRegular(item, profileId, rareAccess) {
    if(specialty(item)!==profileId)return [];
    return slots(item).filter(s=>s.def.kind===kind(item) && ['common','uncommon',...(rareAccess?['rare']:[])].includes(s.def.rarity));
  }
  function legendaryCompatible(item, def) {
    if(def.type!=='legendary'||def.kind!==kind(item))return false;
    const data=source(item)?.data;if(!data)return false;
    if(kind(item)==='apparel') {
      const needs=coverage(def.locations),has=coverage(data.locations);
      return needs.length>0 && has.some(location=>needs.includes(location));
    }
    // Explosives and throwing weapons cannot gain legendary properties,
    // even when a property says Any Weapon. Check skill and source directory.
    const sourceType=plain(data.type || item.weaponType || item.type).trim();
    const sourceDirectory=String(source(item)?.file.path || item.sourcePath || '').split('/').slice(0,-1).join('/');
    if (/\b(?:explosives?|throwing)\b/i.test(sourceType) ||
        /(?:^|\/)(?:Explosives?|Throwing(?: Weapons)?)(?:\/|$)/i.test(sourceDirectory)) return false;
    // Legendary source headings carry their weapon-type restrictions.
    const heading=plain(def.gameEffects.split(/\\n|\n/)[0]).replace(/[*_]/g,'').toLowerCase();
    if(/any weapon|all weapons/.test(heading))return true;
    const weaponType=text(data.type).toLowerCase();
    if(/any (?:ranged weapon|gun)/.test(heading))return ['small guns','big guns','energy weapons'].includes(weaponType);
    if(/any melee weapon/.test(heading))return ['melee weapons','unarmed'].includes(weaponType);
    return ['small guns','big guns','energy weapons','melee weapons','unarmed','throwing','explosives'].some(t=>heading.includes(t)&&weaponType===t);
  }
  function adjustments(item, def) {
    if(kind(item)==='weapon')return {cost:num(def.cost),weight:num(def.weight)};
    const rules=source(item)?.data?.['mod multipliers'] || {};
    const locations=coverage(def.locations),torso=locations.length===1&&locations[0]==='Torso';
    const factor=key=>torso?1:(Number(rules[key])>0?Number(rules[key]):1);
    return {cost:num(def.cost)*factor('cost'),weight:num(def.weight)*factor('weight')};
  }
  function resolved(item) {
    return (item.addons || []).map(a=>definitions.find(d=>d.id===a.id) || {...a,missing:true,displayName:plain(a.link||a.id)});
  }
  function costs(item) {
    const data=source(item)?.data;if(!data)throw Error('Base item source note is missing.');
    const mods=resolved(item);if(mods.some(d=>d.missing))throw Error('An installed mod source note is missing.');
    const a=mods.map(d=>adjustments(item,d));
    return {cost:Math.max(0,num(item.baseCostOverride??data.cost)+a.reduce((s,x)=>s+x.cost,0)),weight:Math.max(0,num(data.weight)+a.reduce((s,x)=>s+x.weight,0))};
  }
  function generatedName(item) {
    const src=source(item);if(!src)return plain(item.name||item.yamlName);
    let base=src.file.basename;
    const installed=resolved(item),allowed=slots(item);
    if(kind(item)==='weapon') {
      for(const rule of src.data.modNaming || []) {
        if(!rule?.slot||!rule.replace)continue;
        if(!allowed.some(s=>s.slot.toLowerCase()===text(rule.slot).toLowerCase() && installed.some(d=>d.id===s.def.id)))continue;
        const escaped=text(rule.replace).replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
        base=base.replace(new RegExp(`\\b${escaped}\\b`,'gi'),()=>text(rule.with));
      }
    }
    const slotOrder=d=>allowed.find(s=>s.def.id===d.id)?.group??999;
    installed.sort((a,b)=>(a.type==='legendary'?0:1)-(b.type==='legendary'?0:1) || slotOrder(a)-slotOrder(b));
    return [...installed.map(d=>d.namePrefix || '').filter(Boolean),base].join(' ');
  }
  function finalize(item) {
    const value=costs(item);
    item.cost=String(value.cost);item.baseCost=value.cost;item.weight=String(value.weight);
    item.generatedName=generatedName(item);
    const allowed=slots(item);
    item.addons=resolved(item).sort((a,b)=>(a.type==='legendary'?0:1)-(b.type==='legendary'?0:1) || (allowed.find(s=>s.def.id===a.id)?.group??999)-(allowed.find(s=>s.def.id===b.id)?.group??999))
      .map(d=>({id:d.id,link:d.link,type:d.type}));
    return item;
  }

  // Weapon arithmetic copied from the supplied character sheet.
  const RANGE_LADDER = ["", "C", "M", "L", "X"];
  let cachedWeaponModData = [];
function vkWeaponTokenKey(raw){
  const value=String(raw || "").trim(),link=value.match(/\[\[([^\]|]+)(?:\|[^\]]*)?\]\]/);
  return (link?link[1].split("/").pop().split("#")[0]:value).replace(/\.md$/i,"").replace(/\s*\(-?\d+\).*$/,"").replace(/\s+(?:-?\d+|x)$/i,"").trim().toLowerCase();
}

function extractFirstInt(s) {
  if (s == null) return NaN;
  const m = String(s).match(/-?\d+/);
  return m ? parseInt(m[0], 10) : NaN;
}

function parseSignedInt(s) {
  const n = extractFirstInt(s);
  return Number.isNaN(n) ? 0 : n;
}

function parseNd6(raw) {
  // Accept: "7 D6", "7d6", "7 d6"
  const m = String(raw ?? "").trim().match(/^(\d+)\s*[dD]\s*6$/) || String(raw ?? "").trim().match(/^(\d+)\s*[dD]\s*6$/);
  if (!m) return null;
  return { n: parseInt(m[1], 10) };
}

function normalizeNd6(raw) {
  const p = parseNd6(String(raw ?? "").replace(/\s+/g, " ").trim().replace(/^(\d+)\s*[dD]\s*6$/i, "$1d6"));
  if (!p) return "";
  return `${p.n}d6`;
}

function toDisplayNd6(norm) {
  const p = String(norm ?? "").match(/^(\d+)d6$/i);
  if (!p) return String(norm ?? "");
  return `${parseInt(p[1], 10)} D6`;
}

function applyDamageDelta(baseNorm, deltaRaw) {
  // delta: "+1d6" or "-2d6"
  const dm = String(deltaRaw ?? "").trim().replace(/\s+/g, "").match(/^([+-])(\d+)d6$/i);
  if (!dm) return baseNorm;

  const sign = dm[1];
  const dn = parseInt(dm[2], 10);

  const bm = String(baseNorm ?? "").trim().match(/^(\d+)d6$/i);
  if (!bm) return baseNorm;

  const bn = parseInt(bm[1], 10);
  const out = sign === "+" ? (bn + dn) : (bn - dn);
  return `${Math.max(0, out)}d6`;
}

function shiftRange(baseRange, delta) {
  const r = String(baseRange ?? "").trim().toUpperCase();
  const idx = RANGE_LADDER.indexOf(r);
  const start = idx >= 0 ? idx : 0;
  const end = Math.max(0, Math.min(RANGE_LADDER.length - 1, start + (delta || 0)));
  return RANGE_LADDER[end];
}

function splitCommaList(s) {
  return String(s ?? "")
    .split(/,(?![^\[]*\]\])/)
    .map(x => x.trim())
    .filter(Boolean);
}

function parseBracketEntry(token) {
  const raw=String(token || "").trim();if(!raw||raw==="—"||raw==="-"||/^(none|n\/a|na)$/i.test(raw))return null;
  const link=raw.match(/^\[\[([^\]]+)\]\](.*)$/);
  let name=link?link[1].trim():raw,tail=link?link[2].trim():"",num=null;
  if(!link){const plain=name.match(/^(.*?)\s*(?:\((-?\d+)\)|\s+(-?\d+))$/);if(plain){name=plain[1].trim();num=Number(plain[2]??plain[3]);}}
  const numeric=tail.match(/^(?:\((-?\d+)\)|(-?\d+))\s*(.*)$/);if(numeric){num=Number(numeric[1]??numeric[2]);tail=numeric[3].trim();}
  if(num===null && name.includes("|")){const alias=name.split("|").pop().match(/(?:\((-?\d+)\)|\s+(-?\d+))$/);if(alias)num=Number(alias[1]??alias[2]);}
  return name?{name,num,extra:tail}:null;
}

function entryToString(entry){
  if(!entry)return "";let name=entry.name;
  if(!name.includes("|") && name.includes("/"))name=`${name}|${name.split("/").pop().replace(/\.md$/i,"")}`;
  if(entry.num!=null && name.includes("|")){const parts=name.split("|");parts[parts.length-1]=parts.at(-1).replace(/\s*(?:\(-?\d+\)|\s+-?\d+)$/,"");name=parts.join("|");}
  return `[[${name}]]${entry.num!=null?` (${entry.num})`:""}${entry.extra?` ${entry.extra}`:""}`;
}

function listToMap(raw){
  const map=new Map();for(const token of splitCommaList(raw)){
    const entry=parseBracketEntry(token);if(!entry)continue;const key=vkWeaponTokenKey(`[[${entry.name}]]`);if(!key)continue;
    if(!map.has(key))map.set(key,entry);
    else if(key==="piercing")map.get(key).num=(map.get(key).num??1)+(entry.num??1);
  }return map;
}

function mapToListString(map){return [...map.values()].map(entryToString).join(", ");}

function applyGainRemove(map,opLine){
  const match=String(opLine || "").trim().match(/^(Gain|Remove)\s+(.+)$/i);if(!match)return;
  const entry=parseBracketEntry(match[2]);if(!entry)return;const key=vkWeaponTokenKey(`[[${entry.name}]]`),existing=map.get(key),gain=match[1].toLowerCase()==="gain";
  if(!gain){
    if(!existing)return;
    if(key==="piercing"&&entry.num!=null){const value=(existing.num??1)-entry.num;if(value>0)existing.num=value;else map.delete(key);}
    else map.delete(key);return;
  }
  if(existing){if(key==="piercing")existing.num=(existing.num??1)+(entry.num??1);return;}
  const opposite={accurate:"inaccurate",inaccurate:"accurate",reliable:"unreliable",unreliable:"reliable"}[key];
  if(opposite && map.has(opposite)){map.delete(opposite);return;}
  if(key==="piercing")entry.num=entry.num??1;map.set(key,entry);
}

function enforceMutualExclusive(map){
  for(const [a,b]of [["reliable","unreliable"],["accurate","inaccurate"]])if(map.has(a)&&map.has(b)){map.delete(a);map.delete(b);}
}

function ensureWeaponBaseSnapshot(rowData) {
  if (!rowData) return;
  if (!rowData.baseWeapon) {
    rowData.baseWeapon = {
      damage: rowData.damage ?? "",
      damage_effects: rowData.damage_effects ?? "",
      qualities: rowData.qualities ?? "",
      ammo: rowData.ammo ?? "",
      dmgtype: rowData.dmgtype ?? "",
      range: rowData.range ?? "",
      fire_rate: rowData.fire_rate ?? "",
      rate: rowData.rate ?? "",
      weight: rowData.weight ?? "",
      cost: rowData.cost ?? "",
      type: rowData.type ?? "",
      link: rowData.link ?? ""
    };
  }

  // Keep these for compatibility with older logic
  if (rowData.baseCost === undefined) rowData.baseCost = rowData.baseWeapon.cost ?? "";
  if (rowData.baseWeight === undefined) rowData.baseWeight = rowData.baseWeapon.weight ?? "";
}

function recalcWeaponFromAddons(rowData) {
  ensureWeaponBaseSnapshot(rowData);

  const base = rowData.baseWeapon || {};
  const addons = (Array.isArray(rowData.addons) ? rowData.addons : []).map(addon=>(cachedWeaponModData || []).find(def=>def.id===addon.id) || addon);

  // --- last-write-wins SET operations ---
  let setBaseDamageTo = null;   // "Change Base Damage To"
  let setAmmoTo = null;         // "Change Ammo Type"
  let setDamageTypeTo = null;   // "Change Damage Type"

  // --- deltas / mutations ---
  const damageDeltas = [];      // list of "+1d6" / "-1d6"
  let fireRateDelta = 0;        // sum of +/- ints
  let rangeDelta = 0;           // sum of +/- ints
  let weightDelta = 0;          // sum of +/- ints (your weight is "+2" style)

  // For qualities + damage effects (compounding)
  const qualitiesMap = listToMap(base.qualities);
  const dmgEffectsMap = listToMap(base.damage_effects);

  // Cost is always additive like your prior behavior
  const baseCostNum = extractFirstInt(base.cost);
  const baseWeightNum = extractFirstInt(base.weight);

  // Walk all addon effects in order: last-write-wins naturally means "overwrite on later"
  for (const a of addons) {
    // Additive cost & weight from addon lines
    // (Even if effects also contain changes, your statblock already has weight/cost fields)
    weightDelta += parseSignedInt(a.weight);
    // costDelta is computed later from addon.cost so it remains aligned with your existing behavior

    const effs = Array.isArray(a.effects) ? a.effects : [];
    for (const eff of effs) {
      const name = String(eff?.name ?? "").trim().toLowerCase();
      const desc = String(eff?.desc ?? "").trim();

      if (!name) continue;

      // SET ops (last-write-wins)
      if (name === "change base damage to") {
        setBaseDamageTo = desc;
        continue;
      }
      if (name === "change ammo type") {
        setAmmoTo = desc;
        continue;
      }
      if (
		name === "change damage type" ||
		name === "change damage type to" ||
		name === "damage type"
	  ) {
		setDamageTypeTo = desc;
		continue;
	  }


      // DELTAS / mutations
      if (name === "damage") {
        // expect "+1d6" / "-1d6"
        damageDeltas.push(desc);
        continue;
      }
      if (name === "fire rate") {
        fireRateDelta += parseSignedInt(desc);
        continue;
      }
      if (name === "range") {
        rangeDelta += parseSignedInt(desc);
        continue;
      }
      if (name === "weapon qualities") {
	    for (const op of splitCommaList(desc)) applyGainRemove(qualitiesMap, op);
		continue;
	  }
	  if (name === "weapon damage effects") {
		for (const op of splitCommaList(desc)) applyGainRemove(dmgEffectsMap, op);
		continue;
	  }

      // If you later add more schema keys, handle them here
    }
  }

  // --- Apply SET ops first (base damage first) ---
  // Damage base
  let damageNorm = normalizeNd6(base.damage);

  if (setBaseDamageTo) {
    const over = normalizeNd6(setBaseDamageTo);
    if (over) damageNorm = over;
  }

  // Ammo and damage type base (last-write-wins)
  let ammo = base.ammo ?? "";
  if (setAmmoTo) ammo = setAmmoTo;

  let dmgtype = base.dmgtype ?? "";
  if (setDamageTypeTo) dmgtype = setDamageTypeTo;

  // --- Now apply deltas on top ---
  for (const d of damageDeltas) {
    // normalize delta to "+1d6" format
    const cleaned = String(d ?? "").trim().replace(/\s+/g, "");
    damageNorm = applyDamageDelta(damageNorm, cleaned);
  }

  // Fire Rate numeric adjust (stored field; not currently a column, but you parse it)
  let fire_rate_num = extractFirstInt(base.fire_rate);
  if (Number.isNaN(fire_rate_num)) fire_rate_num = extractFirstInt(base.rate);
  if (Number.isNaN(fire_rate_num)) fire_rate_num = extractFirstInt(rowData.fire_rate);
  if (Number.isNaN(fire_rate_num)) fire_rate_num = 0;
  const fire_rate = String(Math.max(0, fire_rate_num + fireRateDelta));

  // Range ladder adjust
  const range = shiftRange(base.range, rangeDelta);

  // Cost additive (preserve your existing behavior)
  if (!Number.isNaN(baseCostNum)) {
    const costDelta = addons.reduce((sum, x) => sum + (extractFirstInt(x.cost) || 0), 0);
    rowData.cost = String(baseCostNum + costDelta);
  }

  // Weight additive
  if (!Number.isNaN(baseWeightNum)) {
    rowData.weight = String(baseWeightNum + weightDelta);
  }

  // Write back the computed weapon fields
  rowData.damage = toDisplayNd6(damageNorm) || rowData.damage;
  rowData.ammo = ammo;
  rowData.dmgtype = dmgtype;
  rowData.fire_rate = fire_rate;
  rowData.rate = fire_rate;
  rowData.range = range;
  enforceMutualExclusive(qualitiesMap);
  rowData.qualities = mapToListString(qualitiesMap);
  rowData.damage_effects = mapToListString(dmgEffectsMap);

  // Special text comes from current source gameEffects, never cached narrative effects.
  delete rowData.effects_note;
}

  function view(item, unmodified=false) {
    const src=source(item);if(!src)throw Error('Base item source note is missing.');
    const d=src.data,mods=unmodified?[]:resolved(item),missing=mods.filter(m=>m.missing);
    if(missing.length)throw Error(`Missing mod source: ${missing.map(m=>m.displayName).join(', ')}`);
    const c=costs({...item,addons:unmodified?[]:item.addons});
    if(kind(item)==='weapon') {
      const w={damage:text(d.damage_rating),damage_effects:text(d.damage_effects),qualities:text(d.qualities),ammo:text(d.ammo),
        dmgtype:text(d.damage_type),range:text(d.range),fire_rate:text(d.fire_rate??d.rate),rate:text(d.fire_rate??d.rate),
        type:text(d.type),weight:text(d.weight),cost:text(d.cost),addons:mods};
      cachedWeaponModData=definitions.filter(d=>d.kind==='weapon');
      recalcWeaponFromAddons(w);
      const bypass=mods.filter(m=>m.data?.['fire rate bonus bypasses cap']===true).reduce((s,m)=>s+m.effects.filter(e=>text(e.name).toLowerCase()==='fire rate').reduce((s,e)=>s+Math.max(0,num(e.desc)),0),0);
      w.fire_rate=String(Math.max(0,Math.min(6,num(w.fire_rate)-bypass)+bypass));
      return {...w,...c};
    }
    const out={};
    for(const [key,label] of [['physdr','Physical'],['endr','Energy'],['raddr','Radiation']]) {
      const b=(d['dmg resistances']||[]).find(e=>text(e.name).toLowerCase()===label.toLowerCase())?.desc??'-';
      const k={physdr:'phys',endr:'en',raddr:'rad'}[key];
      out[key]=/^immune$/i.test(text(b))||mods.some(m=>m.deltas[k]==='Immune')?'Immune':String(num(b)+mods.reduce((s,m)=>s+num(m.deltas[k]),0)+(k!=='rad'&&mods.some(m=>m.type==='legendary')?1:0));
    }
    return {...out,...c,carryWeightBonus:mods.reduce((s,m)=>s+(/^[+-]?\d+$/.test(text(m.data?.['carry weight']).trim())?num(m.data['carry weight']):0),0),locations:text(d.locations),hp:text(d.hp)?String(num(d.hp)+mods.reduce((s,m)=>s+num(m.deltas.hp),0)):''};
  }
  function installStyles() {
    document.getElementById('vk-vendor-equipment-css')?.remove();
    if(document.getElementById('vk-vendor-equipment-css-v2'))return;
    const style=document.createElement('style');style.id='vk-vendor-equipment-css-v2';style.textContent=`
body:has(.vk-vendor-popup) .hover-popover,body:has(.vk-vendor-generated-preview) .hover-popover{z-index:100010!important}
.vk-vendor-inspect{color:#1aff80!important;background:#021509!important;border:1px solid #1aff8070!important;border-radius:1px!important;padding:2px 5px!important;min-width:24px;box-shadow:none!important;cursor:pointer}
.vk-vendor-inspect svg{width:15px;height:15px}.vk-vendor-inspect:hover{border-color:#1aff80!important;background:#105d28!important}
.vk-vendor-pane-overlay{position:absolute;inset:0;z-index:100001;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(0,0,0,.55);box-sizing:border-box}
.vk-vendor-popup{background:#021509;color:#1aff80;border:1px solid #1aff80;border-radius:2px;width:min(580px,100%);max-height:100%;overflow:auto;padding:18px 22px;box-sizing:border-box;min-width:0;font-family:var(--font-text);box-shadow:0 8px 32px #0008}
.vk-vendor-popup .vk-kicker{display:flex;justify-content:space-between;gap:16px;align-items:center}.vk-vendor-popup .vk-close{border:0!important;padding:0 4px!important;box-shadow:none!important;color:#1aff80}
.vk-vendor-popup h2{overflow-wrap:anywhere;color:#1aff80;margin:18px 0 4px;font-size:1.3em}.vk-vendor-popup .vk-kicker{border-bottom:1px solid #1aff8066;padding-bottom:10px;letter-spacing:1px}
.vk-vendor-popup a.internal-link{color:#1aff80!important;pointer-events:auto!important}.vk-vendor-popup .vk-sub{color:#93c6a8;font-size:.85em}
.vk-vendor-popup .vk-stats{display:grid;grid-template-columns:1fr 1fr;gap:0 24px;margin-top:16px}.vk-vendor-popup .vk-stat{display:flex;justify-content:space-between;gap:12px;padding:8px 0;border-bottom:1px solid #1aff8033}
.vk-vendor-popup .vk-label{color:#93c6a8}.vk-vendor-popup .vk-value{text-align:right;font-variant-numeric:tabular-nums}.vk-vendor-popup .vk-wide{grid-column:1/-1}
.vk-vendor-popup .vk-section{border-top:1px solid #1aff8066;padding-top:12px;margin-top:18px}.vk-vendor-popup p{margin:0}.vk-vendor-popup .vk-mod{display:flex;gap:12px;justify-content:space-between;margin:7px 0}.vk-vendor-popup .vk-mod .vk-label{flex:0 0 85px}
.vk-vendor-popup table{width:100%;font-size:.9em}.vk-vendor-popup td,.vk-vendor-popup th{border:0;border-bottom:1px solid #1aff8033;padding:6px;text-align:right;font-weight:normal}.vk-vendor-popup td:first-child,.vk-vendor-popup th:first-child{text-align:left}
.vk-vendor-popup summary{cursor:pointer}.vk-vendor-popup .vk-price{display:flex;justify-content:space-between;align-items:center;border-top:1px solid #1aff80;padding-top:12px;margin-top:18px}.vk-vendor-popup .vk-price strong{font-size:1.35em}.vk-vendor-popup .vk-footer{text-align:right;margin-top:14px}
.vk-vendor-popup button{background:#021509;color:#1aff80;border:1px solid #1aff80;border-radius:1px}.vk-vendor-popup .vk-footer button{padding:5px 14px}
@media(max-width:420px){.vk-vendor-popup .vk-stats{grid-template-columns:1fr}.vk-vendor-popup .vk-wide{grid-column:auto}}
`;document.head.append(style);
  }
  async function inspect(item, {price=null, priceLabel='ITEM VALUE', multiplier=null, trigger=null}={}) {
    const epoch = ++inspectionEpoch;
    activeInspector?.close(false);
    let close = null;
    try {
      await load();const base=view(item,true),final=view(item),mods=resolved(item),src=source(item);
      installStyles();
      if(epoch !== inspectionEpoch || !sheetRoot?.isConnected)return;
      // Match the character-sheet workbench: attach within this Markdown pane.
      // The GM generator already has a custom overlay; nest in that overlay
      // when Inspect is opened from its preview instead of covering other panes.
      const paneHost = trigger?.closest?.('.vk-vendor-generator-host') ||
        sheetRoot.closest('.view-content') || sheetRoot.closest('.workspace-leaf-content') || sheetRoot.parentElement;
      if(!paneHost)throw Error('The sheet pane is no longer available.');
      const component=new obsidian.Component();component.load();
      const oldPosition=paneHost.style.position;
      const changedPosition=getComputedStyle(paneHost).position==='static';
      if(changedPosition)paneHost.style.position='relative';
      const overlay=document.createElement('div');overlay.className='vk-vendor-pane-overlay';
      const el=document.createElement('section');el.className='vk-vendor-popup';
      el.setAttribute('role','dialog');el.setAttribute('aria-label','Equipment details');el.tabIndex=-1;
      overlay.append(el);
      const leaf=app.workspace.getLeavesOfType?.('markdown')?.find(leaf=>leaf.containerEl?.contains(sheetRoot));
      const hoverParent=leaf?.view || {hoverPopover:null};
      let closed=false;
      const owner={close:restore=>close(restore)};
      const observer=new MutationObserver(()=>{
        if(!sheetRoot.isConnected || !paneHost.isConnected || !overlay.isConnected)close(false);
      });
      close=(restore=true)=>{
        if(closed)return;closed=true;observer.disconnect();component.unload();
        if(!leaf?.view)hoverParent.hoverPopover?.hide?.();
        overlay.remove();
        if(changedPosition && paneHost.style.position==='relative')paneHost.style.position=oldPosition;
        if(activeInspector===owner)activeInspector=null;
        if(restore && trigger?.isConnected)trigger.focus({preventScroll:true});
      };
      activeInspector=owner;
      component.registerDomEvent(overlay,'pointerdown',event=>{event.stopPropagation();if(event.target===overlay)close();});
      component.registerDomEvent(overlay,'click',event=>event.stopPropagation());
      component.registerDomEvent(overlay,'keydown',event=>{
        if(event.key==='Escape'){event.preventDefault();event.stopImmediatePropagation();close();}
        if(event.key==='Tab'){
          const controls=[...el.querySelectorAll('button,a[href],summary')].filter(n=>!n.disabled && n.getClientRects().length);
          const first=controls[0],last=controls.at(-1);
          if(event.shiftKey && (document.activeElement===first || document.activeElement===el)){event.preventDefault();last?.focus();}
          else if(!event.shiftKey && document.activeElement===last){event.preventDefault();first?.focus();}
        }
      });
      const node=(tag,cls,value,parent=el)=>{const n=document.createElement(tag);n.className=cls||'';if(value!=null)n.textContent=value;parent.append(n);return n;};
      const md=(parent,value,path=src.file.path)=>obsidian.MarkdownRenderer.render(app,text(value)||'—',parent,path,component);
      component.registerDomEvent(el,'mouseover',event=>{
        const link=event.target.closest?.('a.internal-link');if(!link||link.contains(event.relatedTarget))return;
        app.workspace.trigger('hover-link',{event,source:'preview',hoverParent,targetEl:link,linktext:link.dataset.href||link.getAttribute('href'),sourcePath:src.file.path});
      });
      component.registerDomEvent(el,'click',event=>{
        const link=event.target.closest?.('a.internal-link');if(!link)return;
        event.preventDefault();event.stopPropagation();app.workspace.openLinkText(link.dataset.href||link.getAttribute('href'),src.file.path,obsidian.Keymap.isModEvent(event));
      });
      const header=node('div','vk-kicker','ITEM DETAILS');
      const x=node('button','vk-close','×',header);x.type='button';x.setAttribute('aria-label','Close equipment details');x.onclick=()=>close();
      const stars=mods.filter(m=>m.type==='legendary').length;
      node('h2','',`${stars?'★'.repeat(stars)+' ':''}${item.instanceName||generatedName(item)}`);
      await md(node('div'),`[[${src.file.path.replace(/\.md$/i,'')}|${src.file.basename}]]`);
      node('div','vk-sub',`${kind(item)==='weapon'?text(src.data.type):text(src.data.category)||'Apparel'} · ${mods.length} installed mods`);
      const fields=kind(item)==='weapon'?[['Damage','damage'],['Type','dmgtype'],['Fire rate','fire_rate'],['Range','range'],['Effects','damage_effects',true],['Qualities','qualities',true],['Ammo','ammo'],['Weight','weight']]:[['Physical DR','physdr'],['Energy DR','endr'],['Radiation DR','raddr'],['Locations','locations',true],...(final.carryWeightBonus?[['Carry weight bonus','carryWeightBonus']]:[]),...(final.hp?[['Maximum HP','hp']]:[]),['Weight','weight']];
      const grid=node('div','vk-stats');
      for(const [label,key,wide] of fields){const row=node('div',`vk-stat${wide?' vk-wide':''}`,null,grid);node('span','vk-label',label,row);await md(node('div','vk-value',null,row),key==='weight'?`${final[key]} lb`:final[key]);}
      const special=[{displayName:src.file.basename,gameEffects:src.data.gameEffects,id:src.file.path},...mods].filter(m=>text(m.gameEffects).trim());
      if(special.length){const section=node('div','vk-section');node('div','vk-sub','SPECIAL',section);for(const s of special){node('div','vk-label',s.displayName,section);await md(node('div','',null,section),text(s.gameEffects).replace(/\\n/g,'\n'),s.id);}}
      const section=node('div','vk-section');node('div','vk-sub','INSTALLED MODS',section);
      const allowed=slots(item);
      for(const mod of mods){const row=node('div','vk-mod',null,section);node('span','vk-label',mod.type==='legendary'?'Legendary':allowed.find(s=>s.def.id===mod.id)?.slot||'Mod',row);await md(node('div','',null,row),mod.link,mod.id);}
      const details=node('details','vk-section');node('summary','','Changes from Base',details);
      const table=node('table','',null,details),head=node('tr','',null,node('thead','',null,table));for(const h of ['Stat','Base','Modded'])node('th','',h,head);
      const body=node('tbody','',null,table);
      for(const [label,key] of [...fields,['Item value','cost']])if(text(base[key])!==text(final[key])){const row=node('tr','',null,body);node('td','',label,row);await md(node('td','',null,row),base[key]);await md(node('td','',null,row),final[key]);}
      if(!body.children.length){const row=node('tr','',null,body);const td=node('td','','No numeric changes; see Special.',row);td.colSpan=3;}
      const priceRow=node('div','vk-price');node('span','',priceLabel,priceRow);node('strong','',`${price??item.cost??final.cost} caps`,priceRow);
      if(multiplier!=null)node('div','vk-sub',`Item value ${item.cost??final.cost} caps · Vendor multiplier ×${multiplier}`);
      if(num(item.cost??final.cost)!==final.cost)node('div','vk-sub',`Current source value: ${final.cost} caps. Displayed trade price uses the stocked item value.`);
      const footer=node('div','vk-footer');node('button','','Close',footer).onclick=()=>close();
      if(epoch !== inspectionEpoch || !sheetRoot.isConnected || !paneHost.isConnected){close(false);return;}
      paneHost.append(overlay);
      observer.observe(document.body,{childList:true,subtree:true});
      el.focus({preventScroll:true});
    }catch(e){close?.(false);new obsidian.Notice(`Cannot inspect equipment: ${e.message}`);}
  }
  function button(item, options={}) {
    if(!kind(item)||!item.addons?.length)return null;
    installStyles();const b=document.createElement('button');b.type='button';b.className='vk-vendor-inspect';b.title='Inspect equipment';b.setAttribute('aria-label','Inspect equipment');
    obsidian.setIcon(b,'search');
    for(const event of ['pointerdown','mousedown','dblclick'])b.addEventListener(event,e=>e.stopPropagation());
    b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();inspect(item,{...options,trigger:b});});return b;
  }
  return {bindRoot,installStyles,load,source,slots,kind,specialty,eligibleRegular,legendaryCompatible,adjustments,resolved,costs,generatedName,finalize,view,inspect,button,coverage,
    get definitions(){return definitions;}};
})();

const VENDOR_SERVER_URL_KEY = "vaultkit_vendor_server_url";
const DEFAULT_VENDOR_SERVER_URL = "http://localhost:3000";

const WEAPON_MOD_FOLDERS = [
  "Fallout-RPG/Items/Mods/Weapon Mods"
];

const LEGENDARY_WEAPON_FOLDER =
  "Fallout-RPG/Items/Mods/Legendary Mods/Weapons";

const ARMOR_MOD_FOLDERS = [
  "Fallout-RPG/Items/Mods/Apparel Mods",
  "Fallout-RPG/Items/Mods/Armor Mods",
  "Fallout-RPG/Items/Mods/Robot Mods"
];

const POWER_ARMOR_MOD_FOLDERS = [
  "Fallout-RPG/Items/Mods/Power Armor Mods"
];

const LEGENDARY_ARMOR_FOLDER =
  "Fallout-RPG/Items/Mods/Legendary Mods/Apparel";


const VENDOR_GENERATOR_PROFILES = [
  {
    id: "general_store",
    label: "General Store",
    categoryWeights: { FOOD: 20, CHEMS: 15, AMMO: 15, APPAREL: 15, WEAPONS: 15, MISC: 20 },
    guarantees: []
  },
  {
    id: "weapons_dealer",
    label: "Weapons Dealer",
    categoryWeights: { WEAPONS: 55, AMMO: 45, APPAREL: 0, FOOD: 0, CHEMS: 0, MISC: 0 },
    guarantees: ["WEAPONS", "AMMO"]
  },
  {
    id: "doctor",
    label: "Doctor / Clinic",
    categoryWeights: { FOOD: 0, CHEMS: 70, MISC: 15, APPAREL: 5, AMMO: 5, WEAPONS: 5 },
    guarantees: ["CHEMS"]
  },
  {
    id: "armorer_outfitter",
    label: "Armorer / Outfitter (legacy)",
    categoryWeights: { APPAREL: 55, WEAPONS: 15, MISC: 15, FOOD: 5, CHEMS: 5, AMMO: 5 },
    guarantees: ["APPAREL"]
  },
  {
    id: "mechanic",
    label: "Mechanic / Utility",
    categoryWeights: { MISC: 55, WEAPONS: 15, APPAREL: 10, FOOD: 5, CHEMS: 5, AMMO: 10 },
    guarantees: ["MISC"]
  },
  {
    id: "cook",
    label: "Cook",
    categoryWeights: { MISC: 0, WEAPONS: 0, APPAREL: 0, FOOD: 95, CHEMS: 5, AMMO: 0 },
    guarantees: ["FOOD"]
  }
];

VENDOR_GENERATOR_PROFILES.push(
  {id:"armor_vendor",label:"Armor Vendor",apparelSpecialty:"armor_vendor",categoryWeights:{APPAREL:80,WEAPONS:5,MISC:10,FOOD:0,CHEMS:0,AMMO:5},guarantees:["APPAREL"]},
  {id:"apparel_vendor",label:"Apparel Vendor",apparelSpecialty:"apparel_vendor",categoryWeights:{APPAREL:80,WEAPONS:5,MISC:10,FOOD:0,CHEMS:5,AMMO:0},guarantees:["APPAREL"]}
);

const VENDOR_GENERATOR_TIERS = [
  { id: "poor", label: "Poor", capsMin: 50, capsMax: 75, itemsMin: 8, itemsMax: 14 },
  { id: "average", label: "Average", capsMin: 150, capsMax: 450, itemsMin: 12, itemsMax: 35 },
  { id: "well_stocked", label: "Well Stocked", capsMin: 300, capsMax: 900, itemsMin: 16, itemsMax: 55 },
  { id: "elite", label: "Elite", capsMin: 600, capsMax: 1600, itemsMin: 20, itemsMax: 100 }
];

const VENDOR_GENERATOR_RARITY = [
  { id: "scarce", label: "Mostly Common", highRarity: {5:0,6:0}, weights: { 0: 46, 1: 28, 2: 14, 3: 7, 4: 5, 5: 0, 6: 0 } },
  { id: "normal", label: "Balanced", highRarity: {5:.15,6:.03}, weights: { 0: 34, 1: 24, 2: 18, 3: 12, 4: 7, 5: 0, 6: 0 } },
  { id: "generous", label: "Rare-Favored", highRarity: {5:.35,6:.10}, weights: { 0: 24, 1: 20, 2: 18, 3: 14, 4: 10, 5: 0, 6: 0 } }
];

const VENDOR_GENERATOR_QTY_CLASSES = {
  single:       { min: 1,  max: 2,   cap: 3 },
  small_stack:  { min: 1,  max: 6,   cap: 12 },
  medium_stack: { min: 3,  max: 15,  cap: 30 },
  bulk:         { min: 20, max: 100, cap: 200 },
  charged_unit: { min: 1,  max: 4,   cap: 6 }
};

const VENDOR_GENERATOR_TIER_QTY = {
  poor: 0.45,
  average: 0.75,
  well_stocked: 1.0,
  elite: 1.25
};

const VENDOR_GENERATOR_RARITY_QTY = {
  0: 1.15, 1: 1.00, 2: 0.90, 3: 0.75, 4: 0.60, 5: 0.45, 6: 0.30
};

const VENDOR_LEGENDARY_RATES = {off:0,rare:.10,normal:.25,frequent:.50};

const VENDOR_GENERATOR_EXCLUDED_FOLDERS = [

  "Fallout-RPG/Items/Weapons/Unique",
  "Fallout-RPG/Items/Weapons/Custom",
  "Fallout-RPG/Items/Apparel/Unique",
  "Fallout-RPG/Items/Consumables/Quest",
  "Fallout-RPG/Items/Tools and Utilities/Books and Magazines"
];

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

function normalizeInstanceName(value) {
  return String(value ?? "")
    .replace(/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g, "$1")
    .trim();
}

function appendVendorSourceLink(container, payload, aliasText = "") {
  const sourcePath = String(payload?.sourcePath || "").trim();
  const raw = String(
    payload?.name ||
    (payload?.yamlName ? `[[${payload.yamlName}]]` : "")
  ).trim();

  const target = sourcePath
    ? sourcePath.replace(/\.md$/i, "")
    : stripWikiLink(raw);

  if (!target) return;

  const sourceName = stripWikiLink(raw || payload?.yamlName || target.split("/").pop() || "Item");
  const visibleName = String(aliasText || "").trim() || sourceName;

  const a = document.createElement("a");
  a.className = "internal-link";
  const hoverParent={hoverPopover:null};
  a.addEventListener("mouseover", event => app.workspace.trigger("hover-link", {event,source:"preview",hoverParent,targetEl:a,linktext:target,sourcePath:sourcePath || ""}));
  a.textContent = visibleName;
  a.setAttribute("data-href", target);
  a.href = target;
  a.onclick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    app.workspace.openLinkText(target, "", false);
  };
  container.appendChild(a);
}

function makeInstanceId(prefix = "inv") {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function recognizedItemCategory(path) {
  const p = String(path || "");

  if (p.startsWith("Fallout-RPG/Items/Weapons/")) return "WEAPONS";
  if (p.startsWith("Fallout-RPG/Items/Apparel/")) return "APPAREL";
  if (p.startsWith("Fallout-RPG/Items/Consumables/Food/")) return "FOOD";
  if (p.startsWith("Fallout-RPG/Items/Consumables/Beverages/")) return "FOOD";
  if (p.startsWith("Fallout-RPG/Items/Consumables/Chems/")) return "CHEMS";
  if (p.startsWith("Fallout-RPG/Items/Ammo/")) return "AMMO";
  if (p.startsWith("Fallout-RPG/Items/Tools and Utilities/")) return "MISC";

  return null;
}


function vendorModKind(payload) {
  const path = String(payload?.sourcePath || "");
  const category = String(payload?.category || "").toUpperCase();

  if (category === "WEAPONS" || path.startsWith("Fallout-RPG/Items/Weapons/")) {
    return "weapon";
  }

  if (category === "APPAREL" || path.startsWith("Fallout-RPG/Items/Apparel/")) {
    return path.includes("/Power Armor/") ? "powerArmor" : "armor";
  }

  return null;
}

function cleanQuotedValue(value) {
  return String(value ?? "").trim().replace(/^["']|["']$/g, "");
}

function parseSignedNumber(value) {
  const match = String(value ?? "").match(/[+-]?\d+(?:\.\d+)?/);
  if (!match) return 0;
  const n = Number(match[0]);
  return Number.isFinite(n) ? n : 0;
}


function normalizeVendorRarity(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 3;
  return Math.min(6, Math.max(0, Math.round(n)));
}

function xmur3Vendor(str) {
  let h = 1779033703 ^ String(str).length;
  for (let i = 0; i < String(str).length; i++) {
    h = Math.imul(h ^ String(str).charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return function() {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return h >>> 0;
  };
}

function mulberry32Vendor(a) {
  return function() {
    let t = (a += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeVendorRng(seed) {
  return mulberry32Vendor(xmur3Vendor(String(seed))());
}

function vendorRollInt(rng, min, max) {
  return Math.min(min, max) + Math.floor(rng() * (Math.abs(max - min) + 1));
}

function vendorWeightedPick(rng, entries) {
  const total = entries.reduce((sum, entry) => sum + Math.max(0, Number(entry.w) || 0), 0);
  if (total <= 0) return null;

  let cursor = rng() * total;
  for (const entry of entries) {
    cursor -= Math.max(0, Number(entry.w) || 0);
    if (cursor <= 0) return entry.key;
  }

  return entries[entries.length - 1]?.key ?? null;
}

function isVendorGeneratorExcluded(sourcePath) {
  const path = String(sourcePath || "");
  return VENDOR_GENERATOR_EXCLUDED_FOLDERS.some(prefix => path.startsWith(prefix));
}


function normalizeVendorWeaponType(value) {
  const raw = String(value || "").toLowerCase();
  if (raw.includes("small gun")) return "Small Guns";
  if (raw.includes("energy")) return "Energy Weapons";
  if (raw.includes("big gun")) return "Big Guns";
  if (raw.includes("melee")) return "Melee Weapons";
  if (raw.includes("unarmed")) return "Unarmed Weapons";
  return "";
}

function getVendorCoreKind(item) {
  const name = String(item?.name || item?.yamlName || "").trim().toLowerCase();
  if (name === "fusion core") return "fusion";
  if (name === "plasma core") return "plasma";
  return "";
}

function inferVendorQuantityClass(item) {
  if (item?.vendorQtyClass && VENDOR_GENERATOR_QTY_CLASSES[item.vendorQtyClass]) {
    return item.vendorQtyClass;
  }

  if (getVendorCoreKind(item)) return "charged_unit";

  switch (String(item?.category || "").toUpperCase()) {
    case "WEAPONS":
    case "APPAREL":
      return "single";
    case "AMMO":
      return "bulk";
    case "CHEMS":
      return "small_stack";
    case "FOOD":
      return "medium_stack";
    case "MISC":
    default:
      return "small_stack";
  }
}

function rollFalloutCombatDie(rng) {
  const face = vendorRollInt(rng, 1, 6);
  return [0, 1, 2, 0, 0, 1, 1][face];
}

function rollFalloutCombatDice(rng, count) {
  const dice = Math.max(0, Math.floor(Number(count) || 0));
  let total = 0;
  for (let i = 0; i < dice; i++) total += rollFalloutCombatDie(rng);
  return total;
}

function rollAmmoQtyFound(rng, rawFormula) {
  let expr = String(rawFormula || '').trim();
  if (!expr) return null;

  expr = cleanQuotedValue(expr)
    .replace(/\s+/g, '')
    .replace(/[×X]/g, 'x');

  const rollTerm = term => {
    const value = String(term || '').replace(/^\(|\)$/g, '');

    if (/^\d+$/.test(value)) return Number(value);

    const simpleDice = value.match(/^(\d*)D6$/i);
    if (simpleDice) {
      const count = simpleDice[1] ? Number(simpleDice[1]) : 1;
      return rollFalloutCombatDice(rng, count);
    }

    const addDice = value.match(/^(\d+)\+(\d*)D6$/i);
    if (addDice) {
      const base = Number(addDice[1]);
      const count = addDice[2] ? Number(addDice[2]) : 1;
      return base + rollFalloutCombatDice(rng, count);
    }

    return null;
  };

  const multiply = expr.match(/^(\d+)x\((.+)\)$/i);
  if (multiply) {
    const multiplier = Number(multiply[1]);
    const inner = rollTerm(multiply[2]);
    if (inner === null) return null;
    return Math.max(1, Math.round(multiplier * inner));
  }

  const value = rollTerm(expr);
  return value === null ? null : Math.max(1, Math.round(value));
}

function rollVendorQuantity(rng, item, tier) {
  if (item?.category === 'AMMO' && item?.qtyFound) {
    const ammoQty = rollAmmoQtyFound(rng, item.qtyFound);
    if (Number.isFinite(ammoQty) && ammoQty >= 1) return ammoQty;
  }

  const qtyClass = inferVendorQuantityClass(item);
  const rule = VENDOR_GENERATOR_QTY_CLASSES[qtyClass] || VENDOR_GENERATOR_QTY_CLASSES.single;

  const min = Number.isFinite(item?.vendorQtyMin) ? item.vendorQtyMin : rule.min;
  const max = Number.isFinite(item?.vendorQtyMax) ? item.vendorQtyMax : rule.max;

  let qty = vendorRollInt(rng, Math.max(1, min), Math.max(1, max));
  qty = Math.round(
    qty *
    (VENDOR_GENERATOR_TIER_QTY[tier.id] ?? 1) *
    (VENDOR_GENERATOR_RARITY_QTY[item.rarity] ?? 1)
  );

  if (!Number.isFinite(qty) || qty < 1) qty = 1;
  qty = Math.min(qty, rule.cap);
  return qty;
}

function rollFusionCoreCharge(rng) {
  return vendorWeightedPick(rng, [
    { key: 10, w: 18 }, { key: 11, w: 18 }, { key: 12, w: 18 },
    { key: 13, w: 16 }, { key: 14, w: 14 }, { key: 15, w: 10 },
    { key: 16, w: 6 }
  ]);
}

function rollPlasmaCoreCharge(rng) {
  const entries = [];
  for (let charge = 100; charge <= 500; charge += 10) {
    let w = 1;
    if (charge <= 200) w = 2.2;
    else if (charge <= 350) w = 4.0;
    else if (charge <= 450) w = 2.0;
    else if (charge < 500) w = 0.9;
    else w = 0.25;
    entries.push({ key: charge, w });
  }
  return vendorWeightedPick(rng, entries);
}

function coreEffectiveValue(baseValue, charges, maxCharges) {
  const base = Math.max(0, Number(baseValue) || 0);
  return Math.max(0, Math.round(base * (charges / maxCharges)));
}

function makeGeneratedCoreUnits(item, qty, rng) {
  const kind = getVendorCoreKind(item);
  if (!kind) return [];

  const maxCharges = kind === "fusion" ? 16 : 500;
  const units = [];

  for (let i = 0; i < qty; i++) {
    const charges = kind === "fusion"
      ? rollFusionCoreCharge(rng)
      : rollPlasmaCoreCharge(rng);

    const value = coreEffectiveValue(item.cost, charges, maxCharges);
    const unitId = makeInstanceId(kind === "fusion" ? "fusion-core" : "plasma-core");

    units.push({
      name: `[[${item.yamlName}]]`,
      yamlName: item.yamlName,
      sourcePath: item.sourcePath,
      category: item.category,
      qty: "1",
      baseCost: value,
      cost: String(value),
      sourceBaseCost: Number(item.cost) || 0,
      weight: item.weight || "",
      selected: false,
      addons: [],
      chargeUnits: [{
        instanceId: unitId,
        charges,
        maxCharges
      }]
    });
  }

  return units;
}

function isLegendaryArmorEligible(item) {
  const path = String(item?.sourcePath || "");
  return path.includes("/Items/Apparel/Armor/") ||
    path.includes("/Items/Apparel/Power Armor/");
}

function makeGeneratedBasePayload(item, qty) {
  return {
    name: `[[${item.yamlName}]]`,
    yamlName: item.yamlName,
    sourcePath: item.sourcePath,
    category: item.category,
    qty: String(qty),
    baseCost: Number(item.cost) || 0,
    cost: String(Number(item.cost) || 0),
    weight: item.weight || "",
    selected: false,
    addons: []
  };
}

function incidentalHealingChance(profileId) {
  const chances = {
    general_store: 0.45,
    weapons_dealer: 0.35,
    armorer_outfitter: 0.35,
    mechanic: 0.30,
    cook: 0.20
  };
  return chances[profileId] ?? 0;
}

function findGeneratorItemByNames(names) {
  const wanted = names.map(x => String(x).toLowerCase());
  return itemDefinitions.find(item => {
    const candidates = [item.name, item.yamlName].map(x => String(x || "").toLowerCase());
    return candidates.some(x => wanted.includes(x));
  }) || null;
}


function parseVendorFilterList(value) {
  return String(value || "")
    .split(",")
    .map(x => x.trim())
    .filter(Boolean);
}

function vendorPathDirectories(sourcePath) {
  const parts = String(sourcePath || "")
    .replace(/\\/g, "/")
    .split("/")
    .filter(Boolean);

  // Exclude the filename; everything else is treated as directory segments.
  return parts.slice(0, -1);
}

function vendorFileBaseName(item) {
  const explicit = String(item?.yamlName || "").trim();
  if (explicit) return explicit.replace(/\.md$/i, "");

  const path = String(item?.sourcePath || "").replace(/\\/g, "/");
  const file = path.split("/").pop() || "";
  return file.replace(/\.md$/i, "");
}

function vendorItemPassesAdvancedFilters(item, filters = {}) {
  const includeDirectories = parseVendorFilterList(filters.includeDirectories);
  const excludeDirectories = parseVendorFilterList(filters.excludeDirectories);
  const includeFileNames = parseVendorFilterList(filters.includeFileNames);
  const excludeFileNames = parseVendorFilterList(filters.excludeFileNames);

  const directories = vendorPathDirectories(item?.sourcePath)
    .map(x => x.toLowerCase());

  const fileName = vendorFileBaseName(item).toLowerCase();

  // Include-directory matching is exact against directory path segments.
  if (includeDirectories.length) {
    const passes = includeDirectories.some(term =>
      directories.includes(term.toLowerCase())
    );
    if (!passes) return false;
  }

  // Include-filename matching is case-insensitive substring matching.
  if (includeFileNames.length) {
    const passes = includeFileNames.some(term =>
      fileName.includes(term.toLowerCase())
    );
    if (!passes) return false;
  }

  // Exclusions always win.
  if (excludeDirectories.some(term =>
    directories.includes(term.toLowerCase())
  )) {
    return false;
  }

  if (excludeFileNames.some(term =>
    fileName.includes(term.toLowerCase())
  )) {
    return false;
  }

  return true;
}

// Version 2: inventory-level rarity gates and independent legendary availability.
async function generateVendorInventory({
  profileId, tierId, rarityBiasId, seed, vendorName,
  legendaryWeaponRateId='rare', legendaryArmorRateId='rare',
  regularModsEnabled=true, rareModsEnabled=false,
  includeDirectories='',excludeDirectories='',includeFileNames='',excludeFileNames=''
}) {
  await vendorEquipment.load();
  const profile=VENDOR_GENERATOR_PROFILES.find(x=>x.id===profileId)||VENDOR_GENERATOR_PROFILES[0];
  const tier=VENDOR_GENERATOR_TIERS.find(x=>x.id===tierId)||VENDOR_GENERATOR_TIERS[1];
  const rarityBias=VENDOR_GENERATOR_RARITY.find(x=>x.id===rarityBiasId)||VENDOR_GENERATOR_RARITY[1];
  const resolvedSeed=String(seed||`vendor:${vendorName}:${Date.now()}`),rng=makeVendorRng(resolvedSeed);
  const advancedFilters={includeDirectories,excludeDirectories,includeFileNames,excludeFileNames};
  const pool=itemDefinitions.filter(item=>!isVendorGeneratorExcluded(item.sourcePath)&&vendorItemPassesAdvancedFilters(item,advancedFilters)&&Number(profile.categoryWeights[item.category])>0 &&
    (!profile.apparelSpecialty || item.category!=='APPAREL' || vendorEquipment.specialty(item)===profile.apparelSpecialty));
  if(!pool.length)throw Error('No items match this vendor profile and its Advanced Filters.');
  const targetLines=vendorRollInt(rng,tier.itemsMin,tier.itemsMax),caps=vendorRollInt(rng,tier.capsMin,tier.capsMax);
  const used=new Set(),inventory=[];
  const choose=arr=>arr.length?arr[Math.floor(rng()*arr.length)]:null;
  const pickCategory=candidates=>{
    const categories=[...new Set(candidates.map(i=>i.category))];
    const category=vendorWeightedPick(rng,categories.map(key=>({key,w:profile.categoryWeights[key]})));
    return candidates.filter(i=>i.category===category);
  };
  function addRegularMods(item,payload) {
    if(!regularModsEnabled)return;
    let entries=vendorEquipment.eligibleRegular(item,profile.id,rareModsEnabled),chance=.25;
    const installed=new Set();
    while(entries.length && rng()<chance) {
      // Choose slots uniformly before choosing rarity or a mod.
      const groups=[...new Set(entries.map(e=>e.group))];
      const group=choose(groups),candidates=entries.filter(e=>e.group===group&&!installed.has(e.def.id));
      const rarities=[...new Set(candidates.map(e=>e.def.rarity))];
      const rarity=vendorWeightedPick(rng,rarities.map(key=>({key,w:{common:80,uncommon:18,rare:2}[key]})));
      const entry=choose(candidates.filter(e=>e.def.rarity===rarity));
      if(!entry)break;
      payload.addons.push({id:entry.def.id,link:entry.def.link,type:'mod'});installed.add(entry.def.id);
      entries=entries.filter(e=>e.group!==group&&!installed.has(e.def.id));
      chance=payload.addons.length===1?.30:chance/2;
    }
  }
  function addItem(item) {
    if(!item)return;
    used.add(item.sourcePath);
    const qty=rollVendorQuantity(rng,item,tier);
    if(getVendorCoreKind(item)){inventory.push(...makeGeneratedCoreUnits(item,qty,rng));return;}
    if(!vendorEquipment.kind(item)){inventory.push(makeGeneratedBasePayload(item,qty));return;}
    let standard=0;
    for(let n=0;n<qty;n++) {
      const payload=makeGeneratedBasePayload(item,1);addRegularMods(item,payload);
      if(payload.addons.length){payload.instanceId=makeInstanceId('mod');inventory.push(vendorEquipment.finalize(payload));}
      else standard++;
    }
    if(standard)inventory.push(makeGeneratedBasePayload(item,standard));
  }
  const highChances=rarityBias.highRarity;
  // High rarity rolls are global to the inventory, not repeated per stock line.
  for(const rarity of [5,6])if(rng()<highChances[rarity])addItem(choose(pickCategory(pool.filter(i=>i.rarity===rarity))));
  function pickLow(category=null) {
    let candidates=pool.filter(i=>!used.has(i.sourcePath)&&i.rarity<=4&&Number(rarityBias.weights[i.rarity])>0&&(!category||i.category===category));
    if(!category)candidates=pickCategory(candidates);
    const rarities=[...new Set(candidates.map(i=>i.rarity))];
    const rarity=vendorWeightedPick(rng,rarities.map(key=>({key,w:rarityBias.weights[key]})));
    return choose(candidates.filter(i=>i.rarity===rarity));
  }
  for(const category of profile.guarantees||[])if(!inventory.some(i=>i.category===category))addItem(pickLow(category));
  while(used.size<targetLines){const item=pickLow();if(!item)break;addItem(item);}
  // Incidental healing respects explicit filters and never fills an exhausted pool.
  if(profile.id!=='doctor' && rng()<incidentalHealingChance(profile.id)) {
    for(const [names,chance] of [[['stimpak','stimpack'],1],[['radaway','rad away'],.35]]) {
      if(rng()>=chance)continue;
      const item=findGeneratorItemByNames(names);
      if(item&&!used.has(item.sourcePath)&&!isVendorGeneratorExcluded(item.sourcePath)&&vendorItemPassesAdvancedFilters(item,advancedFilters)) {
        used.add(item.sourcePath);inventory.push(makeGeneratedBasePayload(item,vendorRollInt(rng,1,names.length===2?3:2)));
      }
    }
  }
  const summary=[];
  function makeLegendary(kind,rateId) {
    if(rng()>=(VENDOR_LEGENDARY_RATES[rateId]??.10))return;
    let count=1;if(rng()<.10){count=2;if(rng()<.05)count=3;}
    const maxRarity={1:5,2:4,3:3}[count];
    const candidates=inventory.filter(p=>vendorEquipment.kind(p)===kind && !p.addons.some(a=>a.type==='legendary')).map(payload=>{
      const item=itemDefinitions.find(i=>i.sourcePath===payload.sourcePath);
      const mods=vendorEquipment.definitions.filter(d=>vendorEquipment.legendaryCompatible(payload,d));
      return {payload,item,mods};
    }).filter(c=>c.item?.rarity>=1&&c.item.rarity<=maxRarity&&c.mods.length>=count);
    const chosen=vendorWeightedPick(rng,candidates.map(key=>({key,w:1})));
    if(!chosen){summary.push(`No compatible ${count}-star ${kind==='weapon'?'weapon':'apparel'} within base rarity 1–${maxRarity}; legendary skipped.`);return;}
    let target=chosen.payload;
    if(Number(target.qty)>1){target.qty=String(Number(target.qty)-1);target=JSON.parse(JSON.stringify(target));target.qty='1';inventory.push(target);}
    target.instanceId ||= makeInstanceId('legendary');
    const available=chosen.mods.slice();
    for(let n=0;n<count;n++){const def=choose(available);available.splice(available.indexOf(def),1);target.addons.push({id:def.id,link:def.link,type:'legendary'});}
    vendorEquipment.finalize(target);
  }
  makeLegendary('weapon',legendaryWeaponRateId);makeLegendary('apparel',legendaryArmorRateId);
  return {caps,inventory,targetLines,generationNotes:summary,randomConfig:{generatorVersion:2,profileId:profile.id,tierId:tier.id,rarityBiasId:rarityBias.id,legendaryWeaponRateId,legendaryArmorRateId,
    regularModsEnabled,rareModsEnabled,...advancedFilters,seed:resolvedSeed,excludedFolders:[...VENDOR_GENERATOR_EXCLUDED_FOLDERS]}};
}


let vendorAddonCache = {
  weapon: null,
  armor: null,
  powerArmor: null
};

async function loadVendorAddonDefinitions(kind) {
  await vendorEquipment.load();
  return vendorEquipment.definitions.filter(d => d.kind === (kind === "weapon" ? "weapon" : "apparel") &&
    (d.type === "legendary" || (kind === "powerArmor" ? d.id.includes("/Power Armor Mods/") : !d.id.includes("/Power Armor Mods/"))));
}

function sourceDefinitionForPayload(payload) {
  const sourcePath = String(payload?.sourcePath || "");
  return itemDefinitions.find(item => item.sourcePath === sourcePath) || null;
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

// Installed addons are lightweight records; resolve labels from current YAML
// when available, then use the saved alias or source basename for older items.
function addonDisplayName(addon) {
  const definition = vendorEquipment.definitions.find(def => def.id === addon?.id);
  if (definition?.displayName) return String(definition.displayName);
  if (addon?.displayName) return String(addon.displayName);
  const raw = String(addon?.link || addon?.name || addon?.id || "").trim();
  const link = raw.match(/^\[\[([^\]|]+)(?:\|([^\]]+))?\]\]$/);
  if (link?.[2]) return link[2].trim();
  const target = link?.[1] || raw;
  return target.split("/").pop().replace(/\.md(?:#.*)?$/i, "").trim() || "Mod";
}

function displayItemName(payload) {
  return normalizeInstanceName(payload?.instanceName) || payload?.generatedName ||
    stripWikiLink(payload?.name || payload?.yamlName || "Item");
}

function vendorRows(vendor) {
  const rows = [];

  for (const payload of (Array.isArray(vendor?.inventory) ? vendor.inventory : [])) {
    const coreType = getCoreType(payload);

    if (coreType && Array.isArray(payload.chargeUnits)) {
      for (const unit of payload.chargeUnits) {
        rows.push({
          id: getItemId(payload, unit),
          name: displayItemName(payload),
          qty: 1,
          cost: Math.max(0, parseIntSafe(payload.cost ?? payload.baseCost, 0)),
          detail: coreType === "fusion"
            ? `${parseIntSafe(unit.charges, 0)}/${parseIntSafe(unit.maxCharges, 100)}`
            : `${parseIntSafe(unit.charges, 0)}/500`,
          addons: [],
          unique: true,
          core: true,
          payload
        });
      }
      continue;
    }

    const unique = !!String(payload?.instanceId || "").trim()
      || (Array.isArray(payload?.addons) && payload.addons.length > 0)
      || !!payload?.powerArmorState;

    const addons = (Array.isArray(payload?.addons) ? payload.addons : [])
      .map(addon => ({
        id: addon?.id || "",
        name: addonDisplayName(addon),
        link: String(
          addon?.link ||
          `[[${String(addon?.id || "").split("/").pop()?.replace(/\.md$/i, "") || "Mod"}]]`
        )
      }))
      .filter(addon => addon.name);

    rows.push({
      id: getItemId(payload),
      name: displayItemName(payload),
      qty: unique ? 1 : Math.max(1, parseIntSafe(payload.qty, 1)),
      cost: Math.max(0, parseIntSafe(payload.cost ?? payload.baseCost, 0)),
      addons,
      unique,
      core: false,
      payload
    });
  }

  return rows.sort((a, b) => a.name.localeCompare(b.name));
}

const root = document.createElement("div");
vendorEquipment.bindRoot(root);
root.style.cssText = `
  width:100%;
  max-width:1280px;
  margin:0 auto;
  padding:14px;
  box-sizing:border-box;
  font-family:inherit;
  color:#f4ead5;
  background:
    radial-gradient(circle at top right, rgba(44,87,119,.18), transparent 28rem),
    linear-gradient(180deg, #0e1821, #0b1219);
  border:1px solid rgba(69,111,140,.30);
  border-radius:14px;
`;

function buttonStyle(btn, primary = false) {
  btn.style.cssText = primary
    ? `background:#f3c64d;color:#142c3f;border:1px solid #f3c64d;padding:7px 11px;cursor:pointer;border-radius:7px;font-weight:800;`
    : `background:#172a3b;color:#efdd6f;border:1px solid rgba(243,198,77,.48);padding:7px 11px;cursor:pointer;border-radius:7px;font-weight:700;`;
}

function inputStyle(input) {
  input.style.cssText = `
    background:#10283a;
    color:#f4ead5;
    border:1px solid rgba(74,118,146,.68);
    border-radius:7px;
    padding:7px 9px;
    box-sizing:border-box;
    outline:none;
  `;
}

const masthead = document.createElement("div");
masthead.style.cssText = `
  display:grid;
  grid-template-columns:minmax(0,1fr) auto;
  align-items:end;
  gap:18px;
  padding:18px 20px;
  margin-bottom:10px;
  border:1px solid rgba(74,118,146,.65);
  border-left:5px solid #f3c64d;
  border-radius:10px;
  background:linear-gradient(135deg, #142536 0%, #1d3d57 62%, #183149 100%);
  box-shadow:0 10px 28px rgba(0,0,0,.22);
`;
const mastText = document.createElement("div");
const mastKicker = document.createElement("div");
mastKicker.textContent = "VAULT-KIT • MERCHANT OPERATIONS";
mastKicker.style.cssText = `color:#f3c64d;font-size:.72rem;font-weight:800;letter-spacing:.20em;text-transform:uppercase;`;
const mastTitle = document.createElement("div");
mastTitle.textContent = "GM Vendor Console";
mastTitle.style.cssText = `color:#f4ead5;font-size:clamp(1.5rem,3vw,2.25rem);font-weight:850;line-height:1.05;margin-top:4px;`;
const mastSub = document.createElement("div");
mastSub.textContent = "Manage merchants, inventory, reservations, and live trade activity";
mastSub.style.cssText = `color:#c5c5c5;font-size:.9rem;margin-top:5px;`;
mastText.append(mastKicker, mastTitle, mastSub);
const mastBadge = document.createElement("div");
mastBadge.textContent = "GM CONTROL";
mastBadge.style.cssText = `padding:9px 12px;border:1px solid rgba(243,198,77,.72);border-radius:999px;color:#f3c64d;background:rgba(8,18,27,.46);font-size:.82rem;font-weight:800;letter-spacing:.06em;`;
masthead.append(mastText, mastBadge);

const top = document.createElement("div");
top.style.cssText = `
  display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:10px;
  padding:9px 10px;background:rgba(23,42,59,.74);border:1px solid rgba(74,118,146,.50);border-radius:7px;
`;

const serverInput = document.createElement("input");
serverInput.value = normalizeUrl(
  localStorage.getItem(VENDOR_SERVER_URL_KEY) || DEFAULT_VENDOR_SERVER_URL
);
serverInput.placeholder = "http://192.168.1.50:3000";
serverInput.style.width = "250px";
inputStyle(serverInput);

const connectBtn = document.createElement("button");
connectBtn.textContent = "Connect / Refresh";
buttonStyle(connectBtn);

const status = document.createElement("span");
status.textContent = "Not connected";
status.style.cssText = `font-size:12px;opacity:.9;`;

top.append("Server:", serverInput, connectBtn, status);


function makeConsoleCollapsibleSection(titleText, open = true) {
  const details = document.createElement("details");
  details.open = open;
  details.style.cssText = `
    margin-bottom:10px;
    border:1px solid rgba(74,118,146,.55);
    border-radius:10px;
    background:#101d28;
    overflow:hidden;
    box-shadow:0 8px 24px rgba(0,0,0,.16);
  `;

  const summary = document.createElement("summary");
  summary.textContent = titleText;
  summary.style.cssText = `
    cursor:pointer;
    min-height:42px;
    display:flex;
    align-items:center;
    padding:10px 14px;
    border-left:5px solid #f3c64d;
    background:linear-gradient(135deg,#142536 0%,#1d3d57 62%,#183149 100%);
    color:#f3c64d;
    font-size:12px;
    font-weight:850;
    letter-spacing:.07em;
    text-transform:uppercase;
    user-select:none;
  `;

  const body = document.createElement("div");
  body.style.cssText = `
    padding:12px;
    background:linear-gradient(180deg,rgba(24,45,61,.76),rgba(14,27,37,.72));
  `;

  details.append(summary, body);
  return { details, summary, body };
}

const vendorSection = makeConsoleCollapsibleSection("Vendor", true);

const vendorBar = document.createElement("div");
vendorBar.style.cssText = `
  display:flex;
  align-items:flex-end;
  gap:12px;
  flex-wrap:wrap;
  padding:0 0 12px;
  margin-bottom:12px;
  border-bottom:1px solid rgba(83,127,155,.24);
`;

const vendorSelectWrap = document.createElement("label");
vendorSelectWrap.style.cssText = `display:flex;flex-direction:column;gap:4px;min-width:260px;`;

const vendorSelectLabel = document.createElement("span");
vendorSelectLabel.textContent = "Active Vendor";
vendorSelectLabel.style.cssText = `font-size:12px;font-weight:bold;`;

const vendorSelect = document.createElement("select");
inputStyle(vendorSelect);
vendorSelect.style.minWidth = "260px";

vendorSelectWrap.append(vendorSelectLabel, vendorSelect);

const newVendorBtn = document.createElement("button");
newVendorBtn.textContent = "New Vendor";
buttonStyle(newVendorBtn);

const duplicateVendorBtn = document.createElement("button");
duplicateVendorBtn.textContent = "Duplicate Vendor";
duplicateVendorBtn.title = "Copy the current vendor, including live stock, saved template, and generator settings.";
buttonStyle(duplicateVendorBtn);

const deleteVendorBtn = document.createElement("button");
deleteVendorBtn.textContent = "Delete Vendor";
buttonStyle(deleteVendorBtn);
deleteVendorBtn.style.background = "rgba(118,43,43,.48)";
deleteVendorBtn.style.color = "#ffd8d2";
deleteVendorBtn.style.borderColor = "rgba(239,129,117,.52)";
deleteVendorBtn.title = "Permanently delete the currently selected vendor.";

const saveTemplateBtn = document.createElement("button");
saveTemplateBtn.textContent = "Save Template";
saveTemplateBtn.title = "Make the vendor's current caps, settings, and inventory the new restock baseline.";
buttonStyle(saveTemplateBtn);

const restockBtn = document.createElement("button");
restockBtn.textContent = "Restock Missing";
restockBtn.title = "Restore template stock that was purchased, without removing items sold to this vendor.";
buttonStyle(restockBtn);

const resetVendorBtn = document.createElement("button");
resetVendorBtn.textContent = "Reset to Template";
resetVendorBtn.title = "Replace the live vendor state with the saved template.";
buttonStyle(resetVendorBtn);

const regenerateVendorBtn = document.createElement("button");
regenerateVendorBtn.textContent = "Regenerate Stock";
regenerateVendorBtn.title = "Generate new stock using this vendor's saved generator profile, tier, and rarity settings.";
buttonStyle(regenerateVendorBtn);

const vendorActions = document.createElement("div");
vendorActions.style.cssText = `
  display:flex;
  align-items:center;
  gap:7px;
  flex-wrap:wrap;
`;
vendorActions.append(newVendorBtn, duplicateVendorBtn, deleteVendorBtn);

vendorBar.append(
  vendorSelectWrap,
  vendorActions
);

const settings = document.createElement("div");
settings.style.cssText = `
  display:grid;
  grid-template-columns:repeat(4,minmax(140px,1fr)) auto;
  gap:10px;
  align-items:end;
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
  inputStyle(input);

  wrap.append(span, input);
  return { wrap, input };
}

const nameField = field("Vendor Name");
const capsField = field("Caps", "number");
const buyField = field("Buy Multiplier", "number", "0.01");
const sellField = field("Sell Multiplier", "number", "0.01");

const saveBtn = document.createElement("button");
saveBtn.textContent = "Save Settings";
buttonStyle(saveBtn, true);

settings.append(
  nameField.wrap,
  capsField.wrap,
  buyField.wrap,
  sellField.wrap,
  saveBtn
);

vendorSection.body.append(vendorBar, settings);

const addSection = makeConsoleCollapsibleSection("Add Item", true);

const pickerWrap = document.createElement("div");
pickerWrap.style.cssText = `position:relative;margin-bottom:8px;`;

const searchInput = document.createElement("input");
searchInput.placeholder = "Search item...";
searchInput.style.width = "100%";
inputStyle(searchInput);

const dropdown = document.createElement("div");
dropdown.style.cssText = `
  display:none;
  position:absolute;
  z-index:1000;
  left:0;
  right:0;
  top:100%;
  max-height:260px;
  overflow-y:auto;
  background:#172a3b;
  border:1px solid #f3c64d;
  box-shadow:0 5px 18px rgba(0,0,0,.5);
`;

pickerWrap.append(searchInput, dropdown);

const selectedLabel = document.createElement("div");
selectedLabel.textContent = "No item selected";
selectedLabel.style.cssText = `font-size:12px;opacity:.8;margin-bottom:8px;`;

const addFields = document.createElement("div");
addFields.style.cssText = `
  display:grid;
  grid-template-columns:minmax(180px,2fr) minmax(120px,1fr) 90px auto;
  gap:8px;
  align-items:end;
`;

const customNameField = field("Display Name (optional)");
const customValueField = field("Base Value", "number");
const addQtyField = field("Quantity", "number");
addQtyField.input.min = "1";
addQtyField.input.value = "1";

const addBtn = document.createElement("button");
addBtn.textContent = "Add to Vendor";
buttonStyle(addBtn, true);

addFields.append(
  customNameField.wrap,
  customValueField.wrap,
  addQtyField.wrap,
  addBtn
);

addSection.body.append(pickerWrap, selectedLabel, addFields);

const stockToolbar = document.createElement("div");
stockToolbar.style.cssText = `
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:12px;
  flex-wrap:wrap;
  margin:12px 0 8px;
  padding:10px 12px;
  background:#172a3b;
  border:1px solid rgba(74,118,146,.50);
  border-radius:10px;
`;

const stockToolbarTitle = document.createElement("div");
stockToolbarTitle.textContent = "Stock";
stockToolbarTitle.style.cssText = `
  color:#f3c64d;
  font-size:12px;
  font-weight:850;
  letter-spacing:.07em;
  text-transform:uppercase;
`;

const stockActions = document.createElement("div");
stockActions.style.cssText = `
  display:flex;
  align-items:center;
  gap:7px;
  flex-wrap:wrap;
`;
stockActions.append(saveTemplateBtn, restockBtn, resetVendorBtn, regenerateVendorBtn);

stockToolbar.append(stockToolbarTitle, stockActions);

const table = document.createElement("div");
table.style.cssText = `display:flex;flex-direction:column;gap:3px;`;

const activityGrid = document.createElement("div");
activityGrid.style.cssText = `display:grid;grid-template-columns:minmax(320px,.8fr) minmax(420px,1.2fr);gap:12px;margin-top:16px;`;

function makeActivityPanel(titleText) {
  const panel = document.createElement("section");
  panel.style.cssText = `background:#172a3b;border:1px solid rgba(74,118,146,.55);border-radius:10px;overflow:hidden;box-shadow:0 6px 18px rgba(0,0,0,.18);`;
  const head = document.createElement("div");
  head.style.cssText = `display:flex;align-items:center;justify-content:space-between;gap:8px;padding:10px 12px;background:linear-gradient(90deg,#203f57,#18354b);border-left:4px solid #f3c64d;border-bottom:1px solid rgba(243,198,77,.28);`;
  const title = document.createElement("div");
  title.textContent = titleText;
  title.style.cssText = `color:#f3c64d;font-weight:850;letter-spacing:.08em;text-transform:uppercase;font-size:.88rem;`;
  const body = document.createElement("div");
  body.style.cssText = `padding:10px 12px;max-height:360px;overflow:auto;`;
  head.append(title);
  panel.append(head, body);
  return { panel, head, body };
}

const reservationsPanel = makeActivityPanel("Active Reservations");
const clearAllReservationsBtn = document.createElement("button");
clearAllReservationsBtn.textContent = "Clear All";
buttonStyle(clearAllReservationsBtn);
clearAllReservationsBtn.style.padding = "4px 8px";
reservationsPanel.head.append(clearAllReservationsBtn);

const historyPanel = makeActivityPanel("Trade History");
const refreshActivityBtn = document.createElement("button");
refreshActivityBtn.textContent = "Refresh";
buttonStyle(refreshActivityBtn);
refreshActivityBtn.style.padding = "4px 8px";
historyPanel.head.append(refreshActivityBtn);

activityGrid.append(reservationsPanel.panel, historyPanel.panel);
const refreshActivityLayout = () => {
  activityGrid.style.gridTemplateColumns = window.innerWidth < 950
    ? "1fr"
    : "minmax(320px,.8fr) minmax(420px,1.2fr)";
};
refreshActivityLayout();
window.addEventListener("resize", refreshActivityLayout);

root.append(
  masthead,
  top,
  vendorSection.details,
  addSection.details,
  stockToolbar,
  table,
  activityGrid
);

let vendor = null;
let vendorList = [];
let activeVendorId = "";
let itemDefinitions = [];
let selectedDefinition = null;

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



async function loadVendorList() {
  try {
    const result = await request("/api/vendors");
    vendorList = Array.isArray(result?.vendors) ? result.vendors : [];
    activeVendorId = String(result?.activeVendorId || "").trim();

    vendorSelect.innerHTML = "";

    for (const entry of vendorList) {
      const option = document.createElement("option");
      option.value = String(entry.vendorId || "");
      option.textContent = String(entry.name || entry.vendorId || "Vendor");
      option.selected = option.value === activeVendorId;
      vendorSelect.appendChild(option);
    }

    deleteVendorBtn.disabled = vendorList.length <= 1;
    deleteVendorBtn.style.opacity = deleteVendorBtn.disabled ? ".45" : "1";

    return true;
  } catch (err) {
    status.textContent = `Vendor list failed: ${String(err?.message || err)}`;
    return false;
  }
}

async function activateVendor(vendorId) {
  const id = String(vendorId || "").trim();
  if (!id || id === activeVendorId) return;

  try {
    status.textContent = "Switching vendor...";

    const result = await request(`/api/vendors/${encodeURIComponent(id)}/activate`, {
      method: "POST"
    });

    vendor = result.vendor;
    activeVendorId = String(result.activeVendorId || vendor?.vendorId || id);

    await loadVendorList();
    renderVendor();
    await refreshActivity();
    status.textContent = `Active: ${vendor?.name || "Vendor"}`;
  } catch (err) {
    status.textContent = `Switch failed: ${String(err?.message || err)}`;
    await loadVendorList();
  }
}

function openNewVendorModal() {
  const overlay = document.createElement("div");
  overlay.classList.add("vk-vendor-generator-host");
  overlay.style.cssText = `
    position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,.72);
    display:flex;align-items:center;justify-content:center;padding:18px;
  `;

  const modal = document.createElement("div");
  modal.style.cssText = `
    width:min(720px,96vw);
    max-height:90vh;
    overflow:auto;
    background:#172a3b;
    color:#f3c64d;
    border:1px solid #355f7d;
    border-top:3px solid #f3c64d;
    border-radius:10px;
    padding:16px;
    box-sizing:border-box;
    box-shadow:0 18px 55px rgba(0,0,0,.48);
  `;

  const heading = document.createElement("div");
  heading.textContent = "New Vendor";
  heading.style.cssText = `font-size:1.15em;font-weight:bold;margin-bottom:12px;`;

  const grid = document.createElement("div");
  grid.style.cssText = `display:grid;grid-template-columns:1fr 1fr;gap:10px;`;

  const vendorName = field("Vendor Name");
  vendorName.input.placeholder = "e.g. Lucky Harith";

  const profileWrap = document.createElement("label");
  profileWrap.style.cssText = `display:flex;flex-direction:column;gap:4px;`;
  const profileLabel = document.createElement("span");
  profileLabel.textContent = "Profile";
  profileLabel.style.cssText = `font-size:12px;font-weight:bold;`;
  const profileSelect = document.createElement("select");
  inputStyle(profileSelect);
  for (const profile of VENDOR_GENERATOR_PROFILES) {
    const option = document.createElement("option");
    option.value = profile.id;
    option.textContent = profile.label;
    profileSelect.appendChild(option);
  }
  profileWrap.append(profileLabel, profileSelect);

  const tierWrap = document.createElement("label");
  tierWrap.style.cssText = `display:flex;flex-direction:column;gap:4px;`;
  const tierLabel = document.createElement("span");
  tierLabel.textContent = "Stock Level";
  tierLabel.style.cssText = `font-size:12px;font-weight:bold;`;
  const tierSelect = document.createElement("select");
  inputStyle(tierSelect);
  tierSelect.value = "average";
  for (const tier of VENDOR_GENERATOR_TIERS) {
    const option = document.createElement("option");
    option.value = tier.id;
    option.textContent = tier.label;
    if (tier.id === "average") option.selected = true;
    tierSelect.appendChild(option);
  }
  tierWrap.append(tierLabel, tierSelect);

  const rarityWrap = document.createElement("label");
  rarityWrap.style.cssText = `display:flex;flex-direction:column;gap:4px;`;
  const rarityLabel = document.createElement("span");
  rarityLabel.textContent = "Item Rarity";
  rarityLabel.style.cssText = `font-size:12px;font-weight:bold;`;
  const raritySelect = document.createElement("select");
  inputStyle(raritySelect);
  for (const rarity of VENDOR_GENERATOR_RARITY) {
    const option = document.createElement("option");
    option.value = rarity.id;
    option.textContent = rarity.label;
    if (rarity.id === "normal") option.selected = true;
    raritySelect.appendChild(option);
  }
  rarityWrap.append(rarityLabel, raritySelect);

  const legendaryWeaponWrap = document.createElement("label");
  legendaryWeaponWrap.style.cssText = `display:flex;flex-direction:column;gap:4px;`;
  const legendaryWeaponLabel = document.createElement("span");
  legendaryWeaponLabel.textContent = "Legendary Weapons";
  legendaryWeaponLabel.style.cssText = `font-size:12px;font-weight:bold;`;
  const legendaryWeaponSelect = document.createElement("select");
  inputStyle(legendaryWeaponSelect);

  const legendaryArmorWrap = document.createElement("label");
  legendaryArmorWrap.style.cssText = `display:flex;flex-direction:column;gap:4px;`;
  const legendaryArmorLabel = document.createElement("span");
  legendaryArmorLabel.textContent = "Legendary Armor";
  legendaryArmorLabel.style.cssText = `font-size:12px;font-weight:bold;`;
  const legendaryArmorSelect = document.createElement("select");
  inputStyle(legendaryArmorSelect);

  for (const [id, label] of [
    ["off", "Off"],
    ["rare", "Rare (10% per vendor)"],
    ["normal", "Normal (25% per vendor)"],
    ["frequent", "Frequent (50% per vendor)"]
  ]) {
    const w = document.createElement("option");
    w.value = id;
    w.textContent = label;
    if (id === "rare") w.selected = true;
    legendaryWeaponSelect.appendChild(w);

    const a = document.createElement("option");
    a.value = id;
    a.textContent = label;
    if (id === "rare") a.selected = true;
    legendaryArmorSelect.appendChild(a);
  }

  legendaryWeaponWrap.append(legendaryWeaponLabel, legendaryWeaponSelect);
  legendaryArmorWrap.append(legendaryArmorLabel, legendaryArmorSelect);

  const modificationControls = document.createElement("div");
  modificationControls.style.cssText = "display:flex;flex-direction:column;gap:8px;margin:12px 0;";
  const regularMods = document.createElement("input"); regularMods.type="checkbox"; regularMods.checked=true;
  const rareMods = document.createElement("input"); rareMods.type="checkbox";
  for(const [input,caption] of [[regularMods,"Generate regular mods within the vendor specialty"],[rareMods,"Allow Rare regular mods within the specialty"]]) {
    const label=document.createElement("label");label.style.cssText="display:flex;gap:8px;align-items:center;";label.append(input,document.createTextNode(caption));modificationControls.append(label);
  }
  const modHelp=document.createElement("div");modHelp.textContent="Weapon, Apparel and Armor vendors only. First mod: 25%; continuation: 30%, 15%, 7.5%… Random eligible slots. Legendary settings are independent.";modHelp.style.cssText="font-size:12px;opacity:.8;";modificationControls.append(modHelp);
  regularMods.onchange=()=>{rareMods.disabled=!regularMods.checked;};

  const advancedFilters = document.createElement("details");
  advancedFilters.style.cssText = `
    grid-column:1 / -1;
    border:1px solid #365d78;
    border-radius:10px;
    background:#101d28;
    overflow:hidden;
    box-shadow:0 8px 24px rgba(0,0,0,.16);
  `;

  const advancedSummary = document.createElement("summary");
  advancedSummary.textContent = "Advanced Filters";
  advancedSummary.style.cssText = `
    cursor:pointer;
    min-height:42px;
    display:flex;
    align-items:center;
    padding:10px 14px;
    border-left:5px solid #f3c64d;
    background:linear-gradient(135deg,#142536 0%,#1d3d57 62%,#183149 100%);
    color:#f3c64d;
    font-weight:850;
    letter-spacing:.06em;
    text-transform:uppercase;
    user-select:none;
  `;

  const advancedGrid = document.createElement("div");
  advancedGrid.style.cssText = `
    display:grid;
    grid-template-columns:repeat(2,minmax(220px,1fr));
    gap:10px 12px;
    padding:12px 14px 14px;
    background:linear-gradient(180deg,rgba(24,45,61,.76),rgba(14,27,37,.72));
  `;

  const includeDirectoriesField = field("Include Directories");
  includeDirectoriesField.input.placeholder = "Weapons, Ammo";

  const excludeDirectoriesField = field("Exclude Directories");
  excludeDirectoriesField.input.placeholder = "Bows, Energy";

  const includeFileNamesField = field("Include File Names");
  includeFileNamesField.input.placeholder = "Laser, Plasma";

  const excludeFileNamesField = field("Exclude File Names");
  excludeFileNamesField.input.placeholder = "Alien, Institute";

  const advancedHelp = document.createElement("div");
  advancedHelp.style.cssText = `
    grid-column:1 / -1;
    color:#aebdca;
    font-size:11px;
    line-height:1.45;
    margin-top:-2px;
  `;
  advancedHelp.textContent =
    "Directories match exact folder names. File names use case-insensitive partial matches. " +
    "If Include fields are filled, an item must pass each populated Include field. Exclusions always win.";

  advancedGrid.append(
    includeDirectoriesField.wrap,
    excludeDirectoriesField.wrap,
    includeFileNamesField.wrap,
    excludeFileNamesField.wrap,
    advancedHelp
  );

  advancedFilters.append(advancedSummary, advancedGrid);

  const seedField = field("Seed (optional)");
  seedField.input.placeholder = "Blank = new random vendor";

  const previewShell = document.createElement("div");
  previewShell.style.cssText = `
    margin-top:12px;
    border:1px solid #365d78;
    border-radius:10px;
    overflow:hidden;
    background:#101d28;
    box-shadow:0 8px 24px rgba(0,0,0,.16);
  `;

  const previewTitle = document.createElement("div");
  previewTitle.textContent = "Generated Stock Preview";
  previewTitle.style.cssText = `
    min-height:40px;
    display:flex;
    align-items:center;
    padding:9px 14px;
    border-left:5px solid #f3c64d;
    background:linear-gradient(135deg,#142536 0%,#1d3d57 62%,#183149 100%);
    color:#f3c64d;
    font-size:12px;
    font-weight:850;
    letter-spacing:.07em;
    text-transform:uppercase;
  `;

  const preview = document.createElement("div");
  preview.style.cssText = `
    padding:10px 12px;
    min-height:54px;
    max-height:300px;
    overflow:auto;
    font-size:12px;
    background:#0c1c28;
    color:#f4ead5;
  `;
  vendorEquipment.installStyles();
  preview.classList.add("vk-vendor-generated-preview");
  preview.textContent = "Choose Generate Preview to inspect the result before creating it.";
  previewShell.append(previewTitle, preview);

  let generated = null;
  let generationRevision = 0;
  modal.addEventListener("input",()=>{generationRevision++;generated=null;createGenerated.disabled=true;createGenerated.style.opacity=".45";});

  const renderGeneratedPreview = () => {
    preview.innerHTML = "";
    if (!generated) return;

    const summary = document.createElement("div");
    summary.style.cssText = `
      font-weight:800;
      color:#efdd6f;
      margin:-2px 0 8px;
      padding:0 0 8px;
      border-bottom:1px solid rgba(83,127,155,.34);
    `;
    summary.textContent = `${generated.inventory.length} item lines • ${generated.caps} caps`;
    preview.appendChild(summary);
    for(const note of generated.generationNotes || []){const n=document.createElement("div");n.textContent=note;n.style.cssText="margin-bottom:8px;opacity:.8;";preview.append(n);}
    if(generated.inventory.length < generated.targetLines){const n=document.createElement("div");n.textContent="Eligible stock exhausted; rarity limits were preserved.";preview.append(n);}

    for (const item of generated.inventory) {
      const row = document.createElement("div");
      row.style.cssText = `
        display:grid;
        grid-template-columns:minmax(0,1fr) 55px 70px;
        gap:8px;
        align-items:center;
        padding:5px 4px;
        border-bottom:1px solid rgba(83,127,155,.16);
      `;

      const name = document.createElement("span");
      appendVendorSourceLink(name, item, item.yamlName || stripWikiLink(item.name));

      const qty = document.createElement("span");
      const coreUnit = Array.isArray(item.chargeUnits) ? item.chargeUnits[0] : null;
      qty.textContent = coreUnit
        ? `${coreUnit.charges}/${coreUnit.maxCharges}`
        : `x${item.qty}`;
      qty.style.cssText = `text-align:right;color:#f4ead5;font-variant-numeric:tabular-nums;`;

      const category = document.createElement("span");
      const legendary = Array.isArray(item.addons) && item.addons.some(a => a?.type === "legendary");
      category.textContent = legendary ? `${item.category} ${"★".repeat(item.addons.filter(a=>a.type==="legendary").length)}` : item.category;
      category.style.textAlign = "right";
      category.style.opacity = legendary ? "1" : ".72";
      category.style.fontSize = "11px";
      if (legendary) category.style.color = "#f3c64d";

      if (item.instanceName || item.generatedName) {
        name.innerHTML = "";
        appendVendorSourceLink(name, item, item.instanceName || item.generatedName);
      }

      const inspect = vendorEquipment.button(item);
      if(inspect)name.append(" ",inspect);
      for(const addon of item.addons || []) {
        const def=vendorEquipment.definitions.find(d=>d.id===addon.id);
        const line=document.createElement("div");line.style.cssText="font-size:12px;margin-top:3px;";
        appendVendorSourceLink(line,{sourcePath:addon.id,name:addon.link},def?.displayName || addon.link);name.append(line);
      }
      row.append(name, qty, category);
      preview.appendChild(row);
    }
  };

  const buttonRow = document.createElement("div");
  buttonRow.style.cssText = `display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap;margin-top:14px;`;

  const cancel = document.createElement("button");
  cancel.textContent = "Cancel";
  buttonStyle(cancel);

  const blank = document.createElement("button");
  blank.textContent = "Create Blank";
  buttonStyle(blank);

  const generatePreview = document.createElement("button");
  generatePreview.textContent = "Generate Preview";
  buttonStyle(generatePreview);

  const createGenerated = document.createElement("button");
  createGenerated.textContent = "Create Generated Vendor";
  buttonStyle(createGenerated);
  createGenerated.disabled = true;
  createGenerated.style.opacity = ".45";

  const getName = () => String(vendorName.input.value || "").trim();

  generatePreview.onclick = async () => {
    const name = getName();
    if (!name) {
      preview.textContent = "Enter a vendor name first.";
      vendorName.input.focus();
      return;
    }

    generatePreview.disabled = true;
    createGenerated.disabled = true;
    const revision = generationRevision;
    try {
    const result = await generateVendorInventory({
      profileId: profileSelect.value,
      tierId: tierSelect.value,
      rarityBiasId: raritySelect.value,
      legendaryWeaponRateId: legendaryWeaponSelect.value,
      legendaryArmorRateId: legendaryArmorSelect.value,
      regularModsEnabled: regularMods.checked,
      rareModsEnabled: rareMods.checked,
      includeDirectories: includeDirectoriesField.input.value.trim(),
      excludeDirectories: excludeDirectoriesField.input.value.trim(),
      includeFileNames: includeFileNamesField.input.value.trim(),
      excludeFileNames: excludeFileNamesField.input.value.trim(),
      seed: seedField.input.value.trim(),
      vendorName: name
    });

    if(revision !== generationRevision) {preview.textContent="Settings changed; generate a new preview.";return;}
    generated=result;
    createGenerated.disabled = false;
    createGenerated.style.opacity = "1";
    renderGeneratedPreview();
    } catch (error) { generated = null; preview.textContent = error.message; }
    finally { generatePreview.disabled = false; }
  };

  blank.onclick = async () => {
    const name = getName();
    if (!name) {
      preview.textContent = "Enter a vendor name first.";
      vendorName.input.focus();
      return;
    }

    blank.disabled = true;
    try {
      const result = await request("/api/vendors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, makeActive: true })
      });

      vendor = result.vendor;
      activeVendorId = String(result.activeVendorId || vendor?.vendorId || "");
      await loadVendorList();
      renderVendor();
      status.textContent = `Created ${vendor?.name || "vendor"}`;
      overlay.remove();
    } catch (err) {
      preview.textContent = `Create failed: ${String(err?.message || err)}`;
      blank.disabled = false;
    }
  };

  createGenerated.onclick = async () => {
    const name = getName();
    if (!name || !generated) return;

    createGenerated.disabled = true;
    try {
      const result = await request("/api/vendors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          caps: generated.caps,
          buyMultiplier: 1,
          sellMultiplier: 0.5,
          inventory: generated.inventory,
          mode: "generated",
          randomConfig: generated.randomConfig,
          makeActive: true
        })
      });

      vendor = result.vendor;
      activeVendorId = String(result.activeVendorId || vendor?.vendorId || "");
      await loadVendorList();
      renderVendor();
      status.textContent = `Generated ${vendor?.name || "vendor"} with ${generated.inventory.length} item lines`;
      overlay.remove();
    } catch (err) {
      preview.textContent = `Create failed: ${String(err?.message || err)}`;
      createGenerated.disabled = false;
    }
  };

  cancel.onclick = () => overlay.remove();
  overlay.onclick = e => { if (e.target === overlay) overlay.remove(); };

  grid.append(
    vendorName.wrap,
    profileWrap,
    tierWrap,
    rarityWrap,
    legendaryWeaponWrap,
    legendaryArmorWrap,
    modificationControls,
    advancedFilters,
    seedField.wrap
  );
  buttonRow.append(cancel, blank, generatePreview, createGenerated);
  modal.append(heading, grid, previewShell, buttonRow);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  vendorName.input.focus();
}



function openDuplicateVendorModal() {
  if (!vendor) return;

  const overlay = document.createElement("div");
  overlay.style.cssText = `
    position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,.72);
    display:flex;align-items:center;justify-content:center;padding:18px;
  `;

  const modal = document.createElement("div");
  modal.style.cssText = `
    width:min(460px,96vw);
    background:#172a3b;color:#f3c64d;border:2px solid #f3c64d;
    padding:16px;box-sizing:border-box;
  `;

  const heading = document.createElement("div");
  heading.textContent = "Duplicate Vendor";
  heading.style.cssText = `font-size:1.15em;font-weight:bold;margin-bottom:12px;`;

  const note = document.createElement("div");
  note.textContent =
    "Copies the current live inventory, caps, pricing, saved template, and generator settings into a new independent vendor.";
  note.style.cssText = `font-size:12px;opacity:.8;margin-bottom:12px;line-height:1.4;`;

  const name = field("New Vendor Name");
  name.input.value = `${String(vendor.name || "Vendor").trim()} Copy`;

  const actions = document.createElement("div");
  actions.style.cssText = `display:flex;gap:8px;justify-content:flex-end;margin-top:14px;`;

  const cancel = document.createElement("button");
  cancel.textContent = "Cancel";
  buttonStyle(cancel);

  const duplicate = document.createElement("button");
  duplicate.textContent = "Duplicate";
  buttonStyle(duplicate);

  cancel.onclick = () => overlay.remove();
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) overlay.remove();
  });

  duplicate.onclick = async () => {
    const newName = String(name.input.value || "").trim();
    if (!newName) {
      name.input.focus();
      return;
    }

    const sourceId = String(activeVendorId || vendor?.vendorId || "").trim();
    if (!sourceId) return;

    duplicate.disabled = true;

    try {
      const result = await request(
        `/api/vendors/${encodeURIComponent(sourceId)}/duplicate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: newName,
            makeActive: true
          })
        }
      );

      vendor = result.vendor;
      activeVendorId = String(result.activeVendorId || vendor?.vendorId || "");

      await loadVendorList();
      renderVendor();
      status.textContent = `Duplicated as ${vendor?.name || "vendor"}`;
      overlay.remove();
    } catch (err) {
      status.textContent = `Duplicate failed: ${String(err?.message || err)}`;
      duplicate.disabled = false;
    }
  };

  actions.append(cancel, duplicate);
  modal.append(heading, note, name.wrap, actions);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  setTimeout(() => {
    name.input.focus();
    name.input.select();
  }, 0);
}

async function saveCurrentVendorTemplate() {
  const id = String(activeVendorId || vendor?.vendorId || "").trim();
  if (!id || !vendor) return;
  const confirmed = window.confirm(`Save the current state of ${vendor.name || "this vendor"} as its new template?\n\nFuture Restock and Reset operations will use this inventory, caps, and vendor settings.`);
  if (!confirmed) return;
  try {
    const result = await request(`/api/vendors/${encodeURIComponent(id)}/template/save`, { method: "POST" });
    vendor = result.vendor; renderVendor(); status.textContent = "Vendor template saved";
  } catch (err) { status.textContent = `Template save failed: ${String(err?.message || err)}`; }
}

async function restockMissingVendorStock() {
  const id = String(activeVendorId || vendor?.vendorId || "").trim();
  if (!id || !vendor) return;
  try {
    const result = await request(`/api/vendors/${encodeURIComponent(id)}/restock`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mode: "missing" })
    });
    vendor = result.vendor; renderVendor(); status.textContent = "Missing template stock restored";
  } catch (err) { status.textContent = `Restock failed: ${String(err?.message || err)}`; }
}

async function resetVendorToTemplate() {
  const id = String(activeVendorId || vendor?.vendorId || "").trim();
  if (!id || !vendor) return;
  const confirmed = window.confirm(`Reset ${vendor.name || "this vendor"} to its saved template?\n\nThis replaces the current inventory, caps, pricing, and generator state. Items players sold to the vendor after the template was saved will be removed.`);
  if (!confirmed) return;
  try {
    const result = await request(`/api/vendors/${encodeURIComponent(id)}/restock`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mode: "reset" })
    });
    vendor = result.vendor; renderVendor(); status.textContent = "Vendor reset to template";
  } catch (err) { status.textContent = `Reset failed: ${String(err?.message || err)}`; }
}

async function regenerateVendorStock() {
  const id = String(activeVendorId || vendor?.vendorId || "").trim();
  if (!id || !vendor) return;
  const cfg = vendor?.template?.randomConfig || vendor?.randomConfig;
  if (!cfg || !cfg.profileId || !cfg.tierId || !cfg.rarityBiasId) {
    status.textContent = "This vendor has no saved generator settings.";
    return;
  }
  const confirmed = window.confirm(`Regenerate ${vendor.name || "this vendor"} using its saved generator settings?\n\nThis creates fresh inventory and a fresh caps roll using the same profile, wealth tier, and rarity bias, then saves that result as the new template.`);
  if (!confirmed) return;
  try {
    const generated = await generateVendorInventory({
      profileId: cfg.profileId,
      tierId: cfg.tierId,
      rarityBiasId: cfg.rarityBiasId,
      legendaryWeaponRateId: cfg.legendaryWeaponRateId || "rare",
      legendaryArmorRateId: cfg.legendaryArmorRateId || "rare",
      regularModsEnabled: cfg.regularModsEnabled !== false,
      rareModsEnabled: cfg.rareModsEnabled === true,
      includeDirectories: cfg.includeDirectories || "",
      excludeDirectories: cfg.excludeDirectories || "",
      includeFileNames: cfg.includeFileNames || "",
      excludeFileNames: cfg.excludeFileNames || "",
      seed: "",
      vendorName: vendor.name || id
    });
    const result = await request(`/api/vendors/${encodeURIComponent(id)}/regenerate`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ caps: generated.caps, inventory: generated.inventory, randomConfig: generated.randomConfig })
    });
    vendor = result.vendor; renderVendor(); status.textContent = `Regenerated ${vendor.name || "vendor"} with ${generated.inventory.length} item lines`;
  } catch (err) { status.textContent = `Regeneration failed: ${String(err?.message || err)}`; }
}

async function deleteActiveVendor() {
  const id = String(activeVendorId || vendor?.vendorId || "").trim();
  if (!id) return;

  const displayName = String(vendor?.name || "this vendor").trim();
  const confirmed = window.confirm(`Delete ${displayName}? This cannot be undone.`);
  if (!confirmed) return;

  try {
    const result = await request(`/api/vendors/${encodeURIComponent(id)}`, {
      method: "DELETE"
    });

    vendor = result.vendor;
    activeVendorId = String(result.activeVendorId || vendor?.vendorId || "");

    await loadVendorList();
    renderVendor();
    status.textContent = `Deleted ${displayName}`;
  } catch (err) {
    status.textContent = `Delete failed: ${String(err?.message || err)}`;
  }
}

async function openVendorItemEditor(row) {
  const payload = JSON.parse(JSON.stringify(row.payload || {}));
  const kind = vendorModKind(payload);
  const sourceDef = sourceDefinitionForPayload(payload);
  const sourceBaseCost = Math.max(
    0,
    parseIntSafe(
      sourceDef?.cost ??
      payload.baseCostOverride ??
      payload.cost ??
      payload.baseCost,
      0
    )
  );

  const overlay = document.createElement("div");
  overlay.style.cssText = `
    position:fixed;
    inset:0;
    z-index:99999;
    background:rgba(0,0,0,.72);
    display:flex;
    align-items:center;
    justify-content:center;
    padding:18px;
  `;

  const modal = document.createElement("div");
  modal.style.cssText = `
    width:min(680px,96vw);
    max-height:90vh;
    overflow:auto;
    background:#172a3b;
    color:#f3c64d;
    border:2px solid #f3c64d;
    padding:16px;
    box-sizing:border-box;
  `;

  const title = document.createElement("div");
  title.textContent = `Edit ${row.name}`;
  title.style.cssText = `font-weight:bold;font-size:1.1em;margin-bottom:12px;`;

  const editorGrid = document.createElement("div");
  editorGrid.style.cssText = `
    display:grid;
    grid-template-columns:1fr 160px;
    gap:10px;
    margin-bottom:14px;
  `;

  const editName = field("Display Name (optional)");
  editName.input.value = normalizeInstanceName(payload.instanceName || "");

  const editBase = field("Base Price");
  editBase.input.type = "number";
  editBase.input.min = "0";
  editBase.input.value = String(
    payload.baseCostOverride !== undefined
      ? payload.baseCostOverride
      : sourceBaseCost
  );

  editorGrid.append(editName.wrap, editBase.wrap);

  const modsTitle = document.createElement("div");
  modsTitle.textContent = kind ? "Mods" : "Mods — not applicable";
  modsTitle.style.cssText = `font-weight:bold;margin:4px 0 8px;`;

  const installed = document.createElement("div");
  installed.style.cssText = `
    display:flex;
    flex-wrap:wrap;
    gap:8px;
    min-height:28px;
    margin-bottom:10px;
  `;

  let workingAddons = (Array.isArray(payload.addons) ? payload.addons : [])
    .map(a => ({ id: a.id, link: a.link, type: a.type }))
    .filter(a => a.id);

  const modSearch = document.createElement("input");
  modSearch.placeholder = "Search mods / legendary...";
  modSearch.style.width = "100%";
  inputStyle(modSearch);

  const modResults = document.createElement("div");
  modResults.style.cssText = `
    display:none;
    max-height:220px;
    overflow:auto;
    border:1px solid #f3c64d;
    margin-top:4px;
  `;

  const pricePreview = document.createElement("div");
  pricePreview.style.cssText = `margin:12px 0;font-weight:bold;`;

  let defs = kind ? await loadVendorAddonDefinitions(kind) : [];
  const allowed=vendorEquipment.slots(payload);
  defs=defs.filter(def=>def.type==='legendary' ? vendorEquipment.legendaryCompatible(payload,def) : allowed.some(s=>s.def.id===def.id));

  function currentCostDelta() {
    return workingAddons.reduce((sum, addon) => {
      const def = defs.find(x => x.id === addon.id);
      return sum + (def ? vendorEquipment.adjustments(payload,def).cost : 0);
    }, 0);
  }

  function renderPreview() {
    const base = Math.max(0, parseIntSafe(editBase.input.value, sourceBaseCost));
    const final = Math.max(0, base + currentCostDelta());
    pricePreview.textContent = `Effective item value: ${final}`;
    return final;
  }

  function renderInstalled() {
    installed.innerHTML = "";

    if (!workingAddons.length) {
      const none = document.createElement("span");
      none.textContent = "None";
      none.style.opacity = ".65";
      installed.append(none);
    } else {
      for (const addon of workingAddons) {
        const chip = document.createElement("span");
        chip.style.cssText = `
          border:1px solid rgba(26,255,128,.5);
          padding:4px 7px;
          display:inline-flex;
          align-items:center;
          gap:6px;
        `;

        const text = document.createElement("span");
        appendVendorSourceLink(text, {
          name: addon.link || `[[${addonDisplayName(addon)}]]`,
          yamlName: addonDisplayName(addon),
          sourcePath: String(addon.id || "").endsWith(".md") ? String(addon.id) : ""
        }, addonDisplayName(addon));

        const rm = document.createElement("span");
        rm.textContent = "×";
        rm.title = "Remove mod";
        rm.style.cssText = `cursor:pointer;font-weight:bold;`;
        rm.onclick = () => {
          workingAddons = workingAddons.filter(x => x.id !== addon.id);
          renderInstalled();
          renderPreview();
          renderModResults();
        };

        chip.append(text, rm);
        installed.append(chip);
      }
    }
  }

  function renderModResults() {
    if (!kind) {
      modResults.style.display = "none";
      return;
    }

    const q = modSearch.value.trim().toLowerCase();
    const matches = defs
      .filter(def => !workingAddons.some(a => a.id === def.id))
      .filter(def => def.type !== "legendary" || workingAddons.filter(a=>a.type==="legendary").length < 3)
      .filter(def => !q || def.basename.toLowerCase().includes(q))
      .slice(0, 60);

    modResults.innerHTML = "";

    for (const def of matches) {
      const option = document.createElement("div");
      option.style.cssText = `
        padding:7px 9px;
        cursor:pointer;
        display:flex;
        justify-content:space-between;
        gap:12px;
        border-bottom:1px solid rgba(243,198,77,.10);
      `;

      const left = document.createElement("span");
      left.textContent = def.displayName || def.basename;

      const right = document.createElement("span");
      right.textContent = def.type === "legendary"
        ? "Legendary"
        : `Value ${def.costDelta >= 0 ? "+" : ""}${def.costDelta}`;
      right.style.opacity = ".75";

      option.onmouseenter = () => option.style.background = "rgba(243,198,77,.10)";
      option.onmouseleave = () => option.style.background = "transparent";

      option.onclick = () => {
        if(def.type!=="legendary") {
          const groups=new Set(allowed.filter(s=>s.def.id===def.id).map(s=>s.group));
          workingAddons=workingAddons.filter(a=>a.type==="legendary" || !allowed.some(s=>groups.has(s.group)&&s.def.id===a.id));
        }
        workingAddons.push({
          id: def.id,
          link: def.link,
          type: def.type
        });
        modSearch.value = "";
        renderInstalled();
        renderPreview();
        renderModResults();
      };

      option.append(left, right);
      modResults.append(option);
    }

    modResults.style.display = "block";
  }

  if (!kind) {
    modSearch.disabled = true;
    modSearch.style.opacity = ".45";
  } else {
    modSearch.addEventListener("focus", renderModResults);
    modSearch.addEventListener("input", renderModResults);
  }

  editBase.input.addEventListener("input", renderPreview);

  const buttons = document.createElement("div");
  buttons.style.cssText = `display:flex;justify-content:flex-end;gap:8px;margin-top:14px;`;

  const cancel = document.createElement("button");
  cancel.textContent = "Cancel";
  buttonStyle(cancel);

  const save = document.createElement("button");
  save.textContent = row.unique ? "Save Item" : "Customize 1";
  buttonStyle(save);

  cancel.onclick = () => document.body.removeChild(overlay);

  save.onclick = async () => {
    const enteredBase = Math.max(0, parseIntSafe(editBase.input.value, sourceBaseCost));
    const baseCostOverride = enteredBase !== sourceBaseCost ? enteredBase : null;
    const effectiveCost = Math.max(0, enteredBase + currentCostDelta());

    try {
      const calculated = kind ? vendorEquipment.finalize({...payload,addons:workingAddons,baseCostOverride:enteredBase}) : payload;
      const result = await request("/api/vendor/inventory/customize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId: row.id,
          instanceName: normalizeInstanceName(editName.input.value),
          baseCostOverride,
          generatedName: calculated.generatedName || "",
          weight: calculated.weight,
          addons: workingAddons,
          cost: effectiveCost,
          baseCost: effectiveCost
        })
      });

      vendor = result.vendor;
      document.body.removeChild(overlay);
      renderVendor();
      status.textContent = row.unique ? "Item updated" : "Customized 1 item from stack";
    } catch (err) {
      status.textContent = `Edit failed: ${String(err?.message || err)}`;
    }
  };

  buttons.append(cancel, save);
  modal.append(title, editorGrid, modsTitle, installed, modSearch, modResults, pricePreview, buttons);
  overlay.append(modal);
  document.body.append(overlay);

  renderInstalled();
  renderPreview();
}


function formatReservationTime(expiresAt) {
  const ms = Math.max(0, Number(expiresAt || 0) - Date.now());
  const seconds = Math.ceil(ms / 1000);
  if (seconds <= 0) return "expiring";
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}:${String(sec).padStart(2, "0")}`;
}

function tradePayloadName(payload) {
  return normalizeInstanceName(payload?.instanceName) || payload?.generatedName ||
    stripWikiLink(payload?.name || payload?.yamlName || "Item");
}

function summarizeTradeLines(lines) {
  const list = Array.isArray(lines) ? lines : [];
  if (!list.length) return "None";
  return list.map(row => `${tradePayloadName(row?.payload)} ×${Math.max(1, parseIntSafe(row?.qty, 1))}`).join(", ");
}

function renderReservations(rows) {
  reservationsPanel.body.innerHTML = "";
  const list = Array.isArray(rows) ? rows : [];
  clearAllReservationsBtn.disabled = !list.length;
  clearAllReservationsBtn.style.opacity = list.length ? "1" : ".45";

  if (!list.length) {
    const empty = document.createElement("div");
    empty.textContent = "No active reservations.";
    empty.style.cssText = `color:#c5c5c5;font-size:13px;padding:4px 0;`;
    reservationsPanel.body.append(empty);
    return;
  }

  for (const reservation of list) {
    const row = document.createElement("div");
    row.style.cssText = `display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;padding:9px 0;border-bottom:1px solid rgba(74,118,146,.28);`;

    const info = document.createElement("div");
    const who = document.createElement("div");
    who.textContent = String(reservation.playerName || "Player");
    who.style.cssText = `color:#f4ead5;font-weight:800;`;
    const items = document.createElement("div");
    items.textContent = (reservation.items || []).map(item => `${item.name} ×${item.qty}`).join(", ");
    items.style.cssText = `color:#c5c5c5;font-size:12px;margin-top:2px;line-height:1.35;`;
    const expires = document.createElement("div");
    expires.textContent = `Expires in ${formatReservationTime(reservation.expiresAt)}`;
    expires.style.cssText = `color:#e5c96e;font-size:11px;margin-top:3px;`;
    info.append(who, items, expires);

    const clear = document.createElement("button");
    clear.textContent = "Clear";
    buttonStyle(clear);
    clear.style.cssText += `align-self:center;padding:4px 8px;`;
    clear.onclick = async () => {
      try {
        const result = await request("/api/reservations/admin/clear", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ vendorId: activeVendorId, clientId: reservation.clientId })
        });
        renderReservations(result.reservations);
        status.textContent = `Cleared ${reservation.playerName || "player"}'s reservation`;
      } catch (err) {
        status.textContent = `Clear failed: ${String(err?.message || err)}`;
      }
    };

    row.append(info, clear);
    reservationsPanel.body.append(row);
  }
}

const openHistoryTransactions = new Set();

function historyEntryKey(trade, index) {
  return String(
    trade?.transactionId ||
    `${trade?.completedAt || "unknown"}::${trade?.playerName || "Player"}::${index}`
  );
}

function renderHistory(rows) {
  historyPanel.body.innerHTML = "";
  const list = Array.isArray(rows) ? rows : [];

  if (!list.length) {
    const empty = document.createElement("div");
    empty.textContent = "No completed trades recorded for this vendor yet.";
    empty.style.cssText = `color:#c5c5c5;font-size:13px;padding:4px 0;`;
    historyPanel.body.append(empty);
    return;
  }

  list.forEach((trade, index) => {
    const key = historyEntryKey(trade, index);
    const details = document.createElement("details");
    details.open = openHistoryTransactions.has(key);
    details.style.cssText = `padding:8px 0;border-bottom:1px solid rgba(74,118,146,.28);`;

    details.addEventListener("toggle", () => {
      if (details.open) openHistoryTransactions.add(key);
      else openHistoryTransactions.delete(key);
    });

    const summary = document.createElement("summary");
    summary.style.cssText = `cursor:pointer;color:#f4ead5;font-weight:750;`;
    const when = trade.completedAt ? new Date(trade.completedAt).toLocaleString() : "Unknown time";
    summary.textContent = `${trade.playerName || "Player"} • ${when}`;

    const meta = document.createElement("div");
    meta.style.cssText = `margin:7px 0 0 18px;color:#c5c5c5;font-size:12px;line-height:1.5;`;
    const bought = summarizeTradeLines(trade.purchases);
    const sold = summarizeTradeLines(trade.sales);
    meta.innerHTML = `
      <div><strong style="color:#efdd6f">Bought:</strong> ${bought}</div>
      <div><strong style="color:#efdd6f">Sold:</strong> ${sold}</div>
      <div><strong style="color:#efdd6f">Paid:</strong> ${Math.max(0, parseIntSafe(trade.buyTotal, 0))} caps</div>
      <div><strong style="color:#efdd6f">Received:</strong> ${Math.max(0, parseIntSafe(trade.vendorPayout, 0))} caps</div>
    `;
    details.append(summary, meta);
    historyPanel.body.append(details);
  });
}

async function refreshActivity() {
  if (!activeVendorId) return;
  try {
    const [reservations, history] = await Promise.all([
      request(`/api/reservations/admin?vendorId=${encodeURIComponent(activeVendorId)}`),
      request(`/api/history?vendorId=${encodeURIComponent(activeVendorId)}&limit=50`)
    ]);
    renderReservations(reservations.reservations);
    renderHistory(history.history);
  } catch (err) {
    reservationsPanel.body.textContent = "Could not load reservation data.";
    historyPanel.body.textContent = "Could not load trade history.";
  }
}

function renderVendor() {
  if (!vendor) return;

  nameField.input.value = String(vendor.name || "");
  capsField.input.value = String(Math.max(0, parseIntSafe(vendor.caps, 0)));
  buyField.input.value = String(Number(vendor.buyMultiplier ?? 1));
  sellField.input.value = String(Number(vendor.sellMultiplier ?? 1));

  const generatorConfig = vendor?.template?.randomConfig || vendor?.randomConfig;
  const canRegenerate = !!(generatorConfig?.profileId && generatorConfig?.tierId && generatorConfig?.rarityBiasId);
  regenerateVendorBtn.disabled = !canRegenerate;
  regenerateVendorBtn.style.opacity = canRegenerate ? "1" : ".45";

  table.innerHTML = "";

  const header = document.createElement("div");
  header.style.cssText = `
    display:grid;
    grid-template-columns:minmax(0,1fr) 90px 90px 300px;
    gap:8px;
    padding:6px 8px;
    border-bottom:1px solid #f3c64d;
    font-weight:bold;
  `;
  header.innerHTML = `
    <div>Name</div>
    <div style="text-align:right">Qty</div>
    <div style="text-align:right">Base</div>
    <div></div>
  `;
  table.append(header);

  const rows = vendorRows(vendor);

  for (const row of rows) {
    const el = document.createElement("div");
    el.style.cssText = `
      display:grid;
      grid-template-columns:minmax(0,1fr) 90px 90px 300px;
      gap:8px;
      align-items:center;
      padding:5px 8px;
      border-bottom:1px solid rgba(243,198,77,.12);
    `;

    const name = document.createElement("div");
    name.style.cssText = `
      display:flex;
      flex-direction:column;
      min-width:0;
      gap:2px;
    `;

    const customName = normalizeInstanceName(row.payload?.instanceName || "");
    const visibleName = customName || row.payload?.generatedName || stripWikiLink(
      row.payload?.name ||
      row.payload?.yamlName ||
      "Item"
    );

    const source = document.createElement("div");
    appendVendorSourceLink(source, row.payload, visibleName);
    name.appendChild(source);
    const inspect=vendorEquipment.button(row.payload);if(inspect)source.append(" ",inspect);

    if (row.detail) {
      const detail = document.createElement("div");
      detail.textContent = row.detail;
      detail.style.cssText = `font-size:12px;opacity:.7;white-space:normal;`;
      name.appendChild(detail);
    }

    if (Array.isArray(row.addons) && row.addons.length) {
      const mods = document.createElement("div");
      mods.style.cssText = `
        display:flex;
        flex-wrap:wrap;
        gap:4px 8px;
        font-size:12px;
        opacity:.78;
      `;

      const allowedSlots=vendorEquipment.slots(row.payload);
      for (const addon of row.addons) {
        if(mods.children.length) {
          const separator=document.createElement("span");separator.textContent="·";separator.setAttribute("aria-hidden","true");mods.append(separator);
        }
        const holder = document.createElement("span");
        const original=(row.payload.addons || []).find(a=>a.id===addon.id);
        const slot=original?.type==="legendary" ? "Legendary" : allowedSlots.find(s=>s.def.id===addon.id)?.slot;
        if(slot) {const label=document.createElement("span");label.textContent=`${slot}: `;holder.append(label);}
        appendVendorSourceLink(holder, {
          name: addon.link,
          yamlName: addon.name,
          sourcePath: String(addon.id || "").endsWith(".md") ? String(addon.id) : ""
        }, addon.name);
        mods.appendChild(holder);
      }

      name.appendChild(mods);
    }

    const qty = document.createElement("div");
    qty.textContent = String(row.qty);
    qty.style.textAlign = "right";

    const cost = document.createElement("div");
    cost.textContent = String(row.cost);
    cost.style.textAlign = "right";

    const actions = document.createElement("div");
    actions.style.cssText = `
      display:flex;
      gap:5px;
      justify-content:flex-end;
      flex-wrap:wrap;
    `;

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    buttonStyle(editBtn);

    const setQtyBtn = document.createElement("button");
    setQtyBtn.textContent = "Set Qty";
    buttonStyle(setQtyBtn);

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    buttonStyle(removeBtn);

    if (row.core) {
      editBtn.disabled = true;
      editBtn.style.opacity = ".45";
      editBtn.title = "Use core charge controls instead.";
    }

    if (row.unique) {
      setQtyBtn.disabled = true;
      setQtyBtn.style.opacity = ".45";
      setQtyBtn.title = "Unique items and charged cores have quantity 1.";
    }

    editBtn.onclick = async () => {
      await openVendorItemEditor(row);
    };

    setQtyBtn.onclick = async () => {
      const raw = window.prompt(
        `Set quantity for ${row.name}`,
        String(row.qty)
      );

      if (raw === null) return;

      const next = Math.max(0, parseIntSafe(raw, row.qty));
      await setQuantity(row.id, next);
    };

    removeBtn.onclick = async () => {
      await setQuantity(row.id, 0);
    };

    actions.append(editBtn, setQtyBtn, removeBtn);
    el.append(name, qty, cost, actions);
    table.append(el);
  }

  if (!rows.length) {
    const empty = document.createElement("div");
    empty.textContent = "Vendor inventory is empty.";
    empty.style.cssText = `padding:10px;opacity:.75;`;
    table.append(empty);
  }
}

async function refreshVendor() {
  status.textContent = "Connecting...";
  let serverConnected = false;

  try {
    vendor = await request("/api/vendor");
    serverConnected = true;
    activeVendorId = String(vendor?.vendorId || "").trim();

    await loadVendorList();

    status.textContent = "Connected";
    renderVendor();
    await refreshActivity();
  } catch (err) {
    status.textContent = serverConnected
      ? `Connected — display error: ${String(err?.message || err)}`
      : `Offline: ${String(err?.message || err)}`;
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
    activeVendorId = String(vendor?.vendorId || activeVendorId);
    await loadVendorList();
    status.textContent = "Settings saved";
    renderVendor();
  } catch (err) {
    status.textContent = `Save failed: ${String(err?.message || err)}`;
  }
}

async function setQuantity(itemId, quantity) {
  try {
    const result = await request("/api/vendor/inventory/set-quantity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId, quantity })
    });

    vendor = result.vendor;
    renderVendor();
  } catch (err) {
    status.textContent = `Quantity update failed: ${String(err?.message || err)}`;
  }
}

async function loadItemDefinitions() {
  await vendorEquipment.load(true);
  const out = [];

  for (const file of app.vault.getMarkdownFiles()) {
    const category = recognizedItemCategory(file.path);
    if (!category) continue;

    const content = await app.vault.read(file);

    // Your item definitions store their data inside ```statblock fences, not
    // ordinary YAML frontmatter. Requiring frontmatter was why 1.1 found zero
    // items.
    const statblockMatch = content.match(/```statblock([\s\S]*?)```/i);
    if (!statblockMatch) continue;

    const block = statblockMatch[1];

    const costMatch = block.match(/^\s*cost:\s*(.+)$/im);
    if (!costMatch) continue;

    const rawCost = costMatch[1].trim().replace(/^["']|["']$/g, "");
    const cost = parseIntSafe(rawCost, NaN);
    if (!Number.isFinite(cost)) continue;

    const nameMatch = block.match(/^name:[ \t]*(.+)$/im);
    const rawName = nameMatch
      ? nameMatch[1].trim().replace(/^["']|["']$/g, "")
      : file.basename;

    const weightMatch = block.match(/^\s*weight:\s*(.+)$/im);
    const weight = weightMatch
      ? weightMatch[1].trim().replace(/^["']|["']$/g, "")
      : "";

    const rarityMatch =
      block.match(/^\s*item rarity\s*:\s*(.+)$/im) ||
      block.match(/^\s*rarity\s*:\s*(.+)$/im);
    const rarity = normalizeVendorRarity(
      rarityMatch ? cleanQuotedValue(rarityMatch[1]) : 3
    );

    const qtyFoundMatch =
      block.match(/^\s*qty[_ ]found\s*:\s*(.+)$/im) ||
      block.match(/^\s*quantity[_ ]found\s*:\s*(.+)$/im);
    const qtyFound = qtyFoundMatch
      ? cleanQuotedValue(qtyFoundMatch[1])
      : '';

    if (!rawName) continue;

    const typeMatch = block.match(/^\s*type:\s*(.+)$/im);
    const weaponType = typeMatch ? cleanQuotedValue(typeMatch[1]) : "";

    const locationsMatch = block.match(/^\s*locations:\s*(.+)$/im);
    const locations = locationsMatch ? cleanQuotedValue(locationsMatch[1]) : "";

    const vendorQtyClassMatch =
      block.match(/^\s*vendor[_ ]qty[_ ]class:\s*(.+)$/im) ||
      block.match(/^\s*vendorQuantityClass:\s*(.+)$/im);
    const vendorQtyMinMatch =
      block.match(/^\s*vendor[_ ]qty[_ ]min:\s*(.+)$/im) ||
      block.match(/^\s*vendorMinQty:\s*(.+)$/im);
    const vendorQtyMaxMatch =
      block.match(/^\s*vendor[_ ]qty[_ ]max:\s*(.+)$/im) ||
      block.match(/^\s*vendorMaxQty:\s*(.+)$/im);

    const vendorQtyClass = vendorQtyClassMatch
      ? cleanQuotedValue(vendorQtyClassMatch[1]).toLowerCase()
      : "";
    const vendorQtyMin = vendorQtyMinMatch
      ? parseIntSafe(cleanQuotedValue(vendorQtyMinMatch[1]), NaN)
      : NaN;
    const vendorQtyMax = vendorQtyMaxMatch
      ? parseIntSafe(cleanQuotedValue(vendorQtyMaxMatch[1]), NaN)
      : NaN;

    out.push({
      name: rawName,
      yamlName: file.basename,
      sourcePath: file.path,
      category,
      cost: Math.max(0, cost),
      weight,
      rarity,
      qtyFound,
      weaponType,
      locations,
      vendorQtyClass,
      vendorQtyMin,
      vendorQtyMax
    });
  }

  itemDefinitions = out.sort((a, b) => a.name.localeCompare(b.name));
  status.textContent = `Connected • ${itemDefinitions.length} items available`;
}

function closeDropdown() {
  dropdown.style.display = "none";
}

function renderDropdown() {
  const q = searchInput.value.trim().toLowerCase();
  dropdown.innerHTML = "";

  const matches = itemDefinitions
    .filter(item => !q || item.name.toLowerCase().includes(q))
    .slice(0, 50);

  if (!matches.length) {
    const none = document.createElement("div");
    none.textContent = "No matching items";
    none.style.cssText = `padding:8px;opacity:.7;`;
    dropdown.append(none);
    dropdown.style.display = "block";
    return;
  }

  for (const item of matches) {
    const option = document.createElement("div");
    option.style.cssText = `
      padding:7px 9px;
      cursor:pointer;
      border-bottom:1px solid rgba(243,198,77,.10);
    `;

    option.textContent = `${item.name}  •  ${item.cost}`;

    option.onmouseenter = () => {
      option.style.background = "rgba(243,198,77,.10)";
    };

    option.onmouseleave = () => {
      option.style.background = "transparent";
    };

    option.onclick = () => {
      selectedDefinition = item;
      searchInput.value = item.name;
      customNameField.input.value = "";
      customValueField.input.value = String(item.cost);
      selectedLabel.textContent = `${item.name} — ${item.sourcePath}`;
      closeDropdown();
    };

    dropdown.append(option);
  }

  dropdown.style.display = "block";
}

async function addSelectedItem() {
  if (!selectedDefinition) {
    status.textContent = "Select an item first.";
    return;
  }

  const qty = Math.max(1, parseIntSafe(addQtyField.input.value, 1));
  const baseValue = Math.max(
    0,
    parseIntSafe(customValueField.input.value, selectedDefinition.cost)
  );
  const customName = normalizeInstanceName(customNameField.input.value);

  const isSpecialty =
    !!customName ||
    baseValue !== selectedDefinition.cost;

  const payload = {
    name: `[[${selectedDefinition.yamlName}]]`,
    yamlName: selectedDefinition.yamlName,
    sourcePath: selectedDefinition.sourcePath,
    category: selectedDefinition.category,
    cost: baseValue,
    baseCost: baseValue,
    weight: selectedDefinition.weight,
    qty: String(qty)
  };

  // A specialty name or manual value represents a distinct physical instance.
  // Multiple requested copies become separate specialty instances server-side.
  if (isSpecialty) {
    payload.instanceId = makeInstanceId("vendor");
    if (customName) payload.instanceName = customName;
    if (baseValue !== selectedDefinition.cost) {
      payload.baseCostOverride = baseValue;
    }
  }

  const coreType = getCoreType(payload);

  if (coreType) {
    const maxCharge = coreType === "fusion" ? 100 : 500;
    const raw = window.prompt(
      `${selectedDefinition.name} charge (0-${maxCharge})`,
      String(maxCharge)
    );

    if (raw === null) return;

    const charge = Math.max(
      0,
      Math.min(maxCharge, parseIntSafe(raw, maxCharge))
    );

    payload.chargeUnits = [];

    for (let i = 0; i < qty; i++) {
      if (coreType === "fusion") {
        payload.chargeUnits.push({
          instanceId: makeInstanceId("core"),
          charges: charge,
          maxCharges: 100,
          weaponShotsRemaining: charge * 50
        });
      } else {
        payload.chargeUnits.push({
          instanceId: makeInstanceId("core"),
          charges: charge
        });
      }
    }

    delete payload.instanceId;
    payload.qty = String(payload.chargeUnits.length);
  }

  try {
    const result = await request("/api/vendor/inventory/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ payload, qty })
    });

    vendor = result.vendor;
    status.textContent = "Item added";

    selectedDefinition = null;
    searchInput.value = "";
    selectedLabel.textContent = "No item selected";
    customNameField.input.value = "";
    customValueField.input.value = "";
    addQtyField.input.value = "1";

    renderVendor();
  } catch (err) {
    status.textContent = `Add failed: ${String(err?.message || err)}`;
  }
}

connectBtn.onclick = refreshVendor;
saveBtn.onclick = saveSettings;
addBtn.onclick = addSelectedItem;

vendorSelect.addEventListener("change", async () => {
  await activateVendor(vendorSelect.value);
});

newVendorBtn.onclick = openNewVendorModal;
duplicateVendorBtn.onclick = openDuplicateVendorModal;
saveTemplateBtn.onclick = saveCurrentVendorTemplate;
restockBtn.onclick = restockMissingVendorStock;
resetVendorBtn.onclick = resetVendorToTemplate;
regenerateVendorBtn.onclick = regenerateVendorStock;
deleteVendorBtn.onclick = deleteActiveVendor;

clearAllReservationsBtn.onclick = async () => {
  if (!activeVendorId) return;
  const confirmed = window.confirm("Clear every active reservation for this vendor?");
  if (!confirmed) return;
  try {
    const result = await request("/api/reservations/admin/clear", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vendorId: activeVendorId })
    });
    renderReservations(result.reservations);
    status.textContent = "All reservations cleared";
  } catch (err) {
    status.textContent = `Clear failed: ${String(err?.message || err)}`;
  }
};

refreshActivityBtn.onclick = refreshActivity;

const activityPollTimer = window.setInterval(() => {
  if (!root.isConnected) {
    window.clearInterval(activityPollTimer);
    return;
  }
  refreshActivity();
}, 5000);

searchInput.addEventListener("focus", renderDropdown);
searchInput.addEventListener("input", () => {
  selectedDefinition = null;
  selectedLabel.textContent = "No item selected";
  renderDropdown();
});

document.addEventListener("click", (e) => {
  if (!pickerWrap.contains(e.target)) closeDropdown();
});

await loadItemDefinitions();
await refreshVendor();

return root;
```