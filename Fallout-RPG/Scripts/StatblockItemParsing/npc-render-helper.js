import { resolveWeapon } from './npc-item-helper.js';
const norm = s => String(s ?? '').replace(/[^a-z0-9]/gi,'').toLowerCase();
const empty = v => v == null || String(v).trim() === '';
export function number(v) {
  if (v === '-' || v == null || v === '') return 0;
  const n = Number(v); if (!Number.isFinite(n)) throw Error(`Expected a number or '-': ${v}`); return n;
}
const immune = v => /^immune$/i.test(String(v).trim());
const sumDR = (a,b) => immune(a)||immune(b) ? 'Immune' : Math.max(0,number(a)+number(b));
const bodyLocations=['Head','Torso','Left Arm','Right Arm','Left Leg','Right Leg'];
const drFields={Physical:'phys_dr',Energy:'energy_dr',Radiation:'rad_dr',Poison:'poison_dr'};
const skillMap={athletics:'STR',barter:'CHA',bigguns:'END',energyweapons:'PER',explosives:'PER',lockpick:'PER',medicine:'INT',meleeweapons:'STR',pilot:'PER',repair:'INT',science:'INT',smallguns:'AGI',sneak:'AGI',speech:'CHA',survival:'END',throwing:'AGI',unarmed:'STR'};
export function locations(raw) {
  const map={head:['Head'],optics:['Head'],torso:['Torso'],mainbody:['Torso'],arm:['Left Arm','Right Arm'],arms:['Left Arm','Right Arm'],leg:['Left Leg','Right Leg'],legs:['Left Leg','Right Leg'],leftarm:['Left Arm'],rightarm:['Right Arm'],leftleg:['Left Leg'],rightleg:['Right Leg']};
  const parts=(Array.isArray(raw)?raw:String(raw||'').split(',')).map(norm);
  if(parts.some(p=>['all','any','thruster'].includes(p)))return [...bodyLocations];
  if(parts.some(p=>!map[p]))return [];
  return [...new Set(parts.flatMap(p=>map[p]))];
}
function readDR(data) {
  const result=Object.fromEntries(Object.keys(drFields).map(k=>[k,0]));
  for(const row of data['dmg resistances']??[]) {
    const key=Object.keys(result).find(k=>norm(k)===norm(row.name));
    if(key)result[key]=immune(row.desc)?'Immune':number(row.desc);
  }
  return result;
}
export function formatDR(values) {
  const unique=new Set(Object.values(values).map(String));
  if(unique.size===1)return `${Object.values(values)[0]} (All)`;
  const groups=new Map();for(const [loc,v]of Object.entries(values)){const key=String(v);groups.set(key,[...(groups.get(key)??[]),loc]);}
  return [...groups].map(([v,locs])=>`${v} (${locs.join(', ')})`).join('; ');
}
export function listedDR(raw) {
  if(empty(raw))return null;
  const text=String(raw).trim();
  if(immune(text)||text==='-'||/^\d+$/.test(text))return Object.fromEntries(bodyLocations.map(l=>[l,immune(text)?'Immune':number(text)]));
  const result={};
  for(const chunk of text.split(';')) {
    const m=chunk.trim().match(/^(Immune|-|\d+)\s*\(([^)]+)\)$/i);
    if(!m)return undefined;
    const locs=locations(m[2]);if(!locs.length)return undefined;
    for(const l of locs)result[l]=immune(m[1])?'Immune':number(m[1]);
  }
  return bodyLocations.every(l=>l in result)?result:undefined;
}
export async function resolveNpc({app,obsidian,npc,sourcePath=''}) {
  const out=structuredClone(npc),warnings=[],cache=new Map();
  async function load(link,from=sourcePath) {
    const target=String(link).replace(/^\[\[|\]\]$/g,'').split('|')[0].split('#')[0];
    const f=app.metadataCache.getFirstLinkpathDest(target,from);
    if(!f)throw Error(`Cannot find note: ${link}`);
    if(!cache.has(f.path)){
      const text=await app.vault.read(f),block=text.match(/^```statblock[^\r\n]*\r?\n([\s\S]*?)^```\s*$/m);
      if(!block)throw Error(`No statblock in ${f.path}`);
      cache.set(f.path,{file:f,data:obsidian.parseYaml(block[1])});
    }return cache.get(f.path);
  }
  out.special=(npc.special??[]).map(s=>({...s,desc:String(s.value)}));
  if(!out.special.length)delete out.special;
  out.skills=(npc.skills??[]).map(s=>({...s,desc:`${number(s.rank)}${s.tagged===true?' ⬛':''}`}));
  if(!out.skills.length)delete out.skills;
  const creature=String(npc.type).toLowerCase().includes('creature');
  const stats=Object.fromEntries((npc.special??[]).map(s=>[norm(s.name),number(s.value)]));
  const resolved=[],ids=new Map(),armor=[];
  for(const entry of npc.inventory??[]) {
    if(!entry.id||ids.has(entry.id))throw Error(`Missing or duplicate inventory id: ${entry.id}`);
    const item={...structuredClone(entry),quantity:empty(entry.quantity)?1:number(entry.quantity),mods:entry.mods??[]};
    if(!Number.isInteger(item.quantity)||item.quantity<0)throw Error(`Invalid quantity for ${entry.id}`);
    if(!String(entry.item??'').startsWith('[[')) {
      item.name=entry.name||entry.item||'Custom item';item.kind='custom';
    } else {
      const {data,file}=await load(entry.item);
      item.name=entry.name||data.name||file.basename;item.sourcePath=file.path;
      if(data.damage_rating!=null) {
        Object.assign(item,await resolveWeapon({app,obsidian,entry,sourcePath}));item.kind='weapon';delete item.data;
      } else if(data['dmg resistances']!=null||data.locations) {
        item.kind='armor';item.coverage=locations(data.locations);item.category=String(data.category??'').toLowerCase();item.dr=readDR(data);
        item.weight=number(data.weight);item.cost=number(data.cost);const prefixes=[],slots=new Set();let legendary=false;
        for(const modEntry of item.mods) {
          if(slots.has(norm(modEntry.slot))&&norm(modEntry.slot)!=='legendary')throw Error(`Duplicate mod slot on ${item.name}`);slots.add(norm(modEntry.slot));
          const {data:mod,file:mf}=await load(modEntry.item,file.path);
          const modLoc=locations(mod.locations);
          if(modLoc.length&&!item.coverage.some(l=>modLoc.includes(l)))throw Error(`Mod location mismatch: ${modEntry.item}`);
          const modDR=readDR(mod);for(const k of Object.keys(drFields))item.dr[k]=sumDR(item.dr[k],modDR[k]);
          for(const k of ['weight','cost']) {
            const multiplier=modLoc.length===1&&modLoc[0]==='Torso'?1:number(data['mod multipliers']?.[k]??1);
            item[k]+=number(mod[k])*multiplier;
          }
          const leg=mf.path.includes('/Legendary Mods/');legendary ||= leg;
          const prefix=String(mod['name prefix']??(leg?(mod['mod name']||mod.mod||mf.basename):''));
          if(prefix&&prefix!=='-')prefixes.push(prefix);
        }
        if(legendary){item.dr.Physical=sumDR(item.dr.Physical,1);item.dr.Energy=sumDR(item.dr.Energy,1);}
        if(!entry.name)item.name=[...prefixes,item.name].join(' ');
        item.weight=Math.max(0,item.weight);
        if(item.equipped===true&&item.quantity>0)armor.push(item);
      } else item.kind='gear';
    }
    ids.set(item.id,item);resolved.push(item);
  }
  const attacks=[];
  for(const original of npc.attacks??[]) {
    let attack=structuredClone(original);
    if(attack.inventoryId) {
      const w=ids.get(attack.inventoryId);if(!w)throw Error(`Attack references missing inventory id: ${attack.inventoryId}`);
      if(w.damage==null)throw Error(`Referenced item has no damage: ${w.name}`);
      const skill=attack.skill||w.skill;
      attack={...attack,name:attack.name||w.name,skill,attribute:attack.attribute||skillMap[norm(skill)],damage:w.damage,damageEffects:w.damageEffects,damageQualities:w.damageQualities,damageType:w.damageType,fireRate:w.fireRate,range:w.range};
    }
    const sk=norm(attack.skill);let rank,tag=false,attribute;
    if(creature) {
      const key={melee:'meleeSkill',meleeskill:'meleeSkill',guns:'gunsSkill',gunsskill:'gunsSkill',other:'otherSkill',otherskill:'otherSkill'}[sk];
      if(!key)throw Error(`Unknown creature skill: ${attack.skill}`);
      rank=number(npc[key]);tag=key==='meleeSkill'||key==='gunsSkill';
      if(key==='gunsSkill'&&rank===0){warnings.push(`${attack.name}: Guns is 0; ranged attack unavailable.`);continue;}
      if(!(attack.attribute in npc))throw Error(`Unknown creature attribute: ${attack.attribute}`);
      attribute=number(npc[attack.attribute]);attack.attributeLabel={bodyAttribute:'BODY',mindAttribute:'MIND'}[attack.attribute]||attack.attribute;
    } else {
      const found=(npc.skills??[]).find(s=>norm(s.name)===sk);rank=number(found?.rank);tag=found?.tagged===true;
      const ak=norm(attack.attribute);if(!(ak in stats))throw Error(`Unknown SPECIAL attribute: ${attack.attribute}`);
      attribute=stats[ak];attack.attributeLabel=String(attack.attribute).toUpperCase();
    }
    attack.TN=attribute+rank;attack.critical=tag?rank:1;attack.tagged=tag;attacks.push(attack);
  }
  out.attacks=attacks;
  const calculated=Object.fromEntries(Object.keys(drFields).map(k=>[k,Object.fromEntries(bodyLocations.map(l=>[l,0]))]));
  let armorComplete=true;const occupied=new Map(),clothing=[];
  for(const piece of armor) {
    if(!piece.coverage.length){warnings.push(`Unknown armor coverage: ${piece.name}. DR comparison disabled.`);armorComplete=false;continue;}
    if(['clothing','outfit'].includes(piece.category)) {clothing.push(piece);continue;}
    for(let i=0;i<piece.quantity;i++) {
      const candidates=piece.location?[piece.location]:piece.coverage;
      const loc=candidates.find(l=>piece.coverage.includes(l)&&!occupied.has(l));
      if(!loc){warnings.push(`Cannot place all equipped copies of ${piece.name}. DR comparison disabled.`);armorComplete=false;break;}
      occupied.set(loc,piece);
    }
  }
  if(clothing.length>1){warnings.push('Multiple clothing/outfit layers: DR comparison disabled.');armorComplete=false;}
  for(const piece of clothing)for(const loc of piece.coverage) {
    if(piece.category==='outfit'&&occupied.has(loc)){warnings.push(`Outfit conflicts with armor at ${loc}. DR comparison disabled.`);armorComplete=false;}
    for(const k of Object.keys(drFields))calculated[k][loc]=sumDR(calculated[k][loc],piece.dr[k]);
  }
  for(const [loc,piece] of occupied)for(const k of Object.keys(drFields))calculated[k][loc]=sumDR(calculated[k][loc],piece.dr[k]);
  out.npcDRWarnings={};
  if(armor.length&&armorComplete)for(const [kind,field]of Object.entries(drFields)) {
    const listed=listedDR(npc[field]),calc=calculated[kind];
    if(listed===null)out[field]=formatDR(calc);
    else if(listed===undefined||bodyLocations.some(l=>String(listed[l]).toLowerCase()!==String(calc[l]).toLowerCase())) {
      out.npcDRWarnings[field]=`Listed: ${npc[field]}\nEquipment: ${formatDR(calc)}${listed===undefined?'\nListed location format could not be compared.':''}`;
    }
  }
  out.inventory=resolved.map(i=>({name:norm(i.item)==='wealth'?`Wealth ${i.quantity}`:`${i.quantity} × ${i.sourcePath?`[[${i.sourcePath}|${i.name}]]`:i.name}${i.equipped?' (Equipped)':''}`,desc:[i.mods.length?`Mods: ${i.mods.map(m=>m.item).join(', ')}`:'',i.kind==='weapon'?`Ammo: ${i.ammo} · Weight: ${i.weight} · Cost: ${i.cost}`:'',i.kind==='armor'?`Weight: ${i.weight} · Cost: ${i.cost}`:''].filter(Boolean).join('  \n')}));
  if(!out.inventory.length)delete out.inventory;
  out.npcWarnings=warnings.map(w=>({name:'Check equipment',desc:w}));
  // Source objects, available-mod catalogs and transient item state are not serialized.
  return out;
}
