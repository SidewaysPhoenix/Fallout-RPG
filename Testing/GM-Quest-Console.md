```js-engine
return await (async function(){
const qObsidian = engine.getObsidianModule();
const qRoot = document.createElement('section');
qRoot.className = 'vk-quests';
const qServerKey = 'vaultkit_vendor_server_url';
let qBase = String(localStorage.getItem(qServerKey) || 'http://localhost:3000').trim().replace(/\/+$/, '');
let qPrefix = 'vaultkit_quests:' + qBase + ':';
const qNode = (tag, cls, text, parent) => {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text !== undefined) node.textContent = text;
  parent?.appendChild(node);
  return node;
};
const qButton = (text, parent, fn, cls = '') => {
  const node = qNode('button', cls, text, parent); node.type = 'button';
  node.addEventListener('click', fn); return node;
};
const qRead = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(qPrefix + key)) ?? fallback; } catch { return fallback; }
};
const qWrite = (key, value) => localStorage.setItem(qPrefix + key, JSON.stringify(value));
const qStatus = (text, error = false) => { qMessage.textContent = text; qMessage.classList.toggle('is-error', error); };
const qDate = value => value ? new Date(value).toLocaleString() : 'Never';
async function qRequest(route, options = {}) {
  const controller = new AbortController();
  let timeout;
  const deadline = new Promise((resolve, reject) => {
    timeout = setTimeout(() => {
      reject(new Error('Connection timed out after 8 seconds.'));
      controller.abort();
    }, 8000);
  });
  try {
    const request = (async () => {
      const response = await fetch(qBase + route, { cache: 'no-store', ...options, signal: controller.signal });
      const data = await response.json().catch(() => null);
      if (!response.ok || data?.ok !== true) throw new Error(data?.reason || `HTTP ${response.status}`);
      return data;
    })();
    return await Promise.race([request, deadline]);
  } finally { clearTimeout(timeout); }
}
// Match the trade controls: stop editor handlers while allowing native input focus.
for (const type of ['pointerdown', 'mousedown', 'click']) qRoot.addEventListener(type, event => event.stopPropagation());
const qStyle = qNode('style', '', undefined, qRoot);
qStyle.textContent = `
.vk-quests {
  --q-accent: var(--vk-accent,#ffc200);
  --q-edge: var(--vk-edge,#365d78);
  --q-muted: var(--vk-muted,#aebdca);
  --q-bg: var(--vk-panel,#172a3b);
  --q-dark: var(--vk-recessed,#102434);
  font: var(--vk-font-size-body,14px)/1.5 var(--vk-font-family-body,var(--font-interface));
  color: var(--vk-text,#dce6eb);
  margin: 0 0 24px
}

.vk-quests * {
  box-sizing: border-box
}

.vk-quests .q-terminal {
  border: 1px solid var(--q-edge);
  border-top: 3px solid var(--q-accent);
  border-radius: 10px;
  background: var(--q-bg);
  overflow: hidden;
  container-type: inline-size
}

.vk-quests .q-header,.vk-quests .q-toolbar {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  padding: 14px 18px;
  border-bottom: 1px solid var(--q-edge)
}

.vk-quests .q-header h2 {
  margin: 0;
  color: var(--q-accent);
  font-size: 20px
}

.vk-quests .q-header small {
  color: var(--q-muted);
  margin-right: auto;
  display: block
}

.vk-quests .q-message {
  padding: 8px 18px;
  color: var(--q-muted);
  font-size: 12px;
  white-space: pre-wrap
}

.vk-quests .is-error {
  color: #ffb1a3!important
}

.vk-quests .q-layout {
  display: grid;
  grid-template-columns: minmax(200px,1fr) minmax(0,2.1fr);
  min-height: 330px;
  max-height: 650px
}

.vk-quests .q-list {
  padding: 12px;
  overflow: auto;
  border-right: 1px solid var(--q-edge)
}

.vk-quests .q-details {
  padding: 22px;
  overflow: auto;
  min-width: 0;
  overflow-wrap: anywhere
}

.vk-quests .q-details h3 {
  color: var(--q-accent);
  margin: 0 0 10px;
  font-size: 21px
}

.vk-quests .q-details h4 {
  color: var(--q-accent);
  margin: 18px 0 9px
}

.vk-quests button {
  height: auto;
  min-height: 30px;
  padding: 6px 11px;
  border: 1px solid var(--q-edge);
  border-radius: 6px;
  box-shadow: none;
  background: var(--vk-panel-raised,#1b3347);
  color: inherit;
  cursor: pointer;
  white-space: normal;
  font: inherit
}

.vk-quests button:hover,.vk-quests button.is-selected {
  border-color: var(--q-accent);
  color: var(--q-accent)
}

.vk-quests button:disabled {
  opacity: .5;
  cursor: default
}

.vk-quests button.q-entry {
  display: block;
  text-align: left;
  width: 100%;
  margin-bottom: 7px;
  padding: 10px
}

.vk-quests .q-entry small {
  display: block;
  color: var(--q-muted);
  font-size: 11px;
  margin-top: 3px
}

.vk-quests .q-group-label {
  color: var(--q-muted);
  text-transform: uppercase;
  letter-spacing: .08em;
  font-size: 11px;
  margin: 14px 0 8px
}

.vk-quests .q-group-label:first-child {
  margin-top: 0
}

.vk-quests .q-pin {
  margin: 12px 18px 0;
  padding: 12px 15px;
  border: 1px solid var(--q-edge);
  border-left: 3px solid var(--q-accent);
  border-radius: 6px;
  background: var(--q-dark)
}

.vk-quests .q-pin strong {
  color: var(--q-accent)
}

.vk-quests .q-pin p {
  margin: 6px 0 0;
  font-size: 13px
}

.vk-quests .q-objective {
  display: flex;
  gap: 10px;
  padding: 9px 0;
  border-bottom: 1px solid var(--q-edge)
}

.vk-quests .q-objective.is-completed {
  color: var(--q-muted)
}

.vk-quests .q-objective.is-completed .q-objective-text {
  text-decoration: line-through
}

.vk-quests .q-objective.is-failed {
  color: #ffb1a3
}

.vk-quests .q-symbol {
  flex: 0 0 17px;
  color: var(--q-accent)
}

.vk-quests .q-muted {
  color: var(--q-muted);
  font-size: 12px
}

.vk-quests .q-description {
  white-space: pre-wrap
}

.vk-quests .q-field {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 12px;
  min-width: 0
}

.vk-quests .q-field>span {
  color: var(--q-muted);
  font-size: 12px
}

.vk-quests :is(input:not([type=checkbox]),select,textarea) {
  width: 100%;
  max-width: 100%;
  min-width: 0;
  background: var(--q-dark);
  color: inherit;
  border: 1px solid var(--q-edge);
  border-radius: 5px;
  padding: 7px;
  font: inherit
}

.vk-quests textarea {
  resize: vertical;
  min-height: 75px
}

.vk-quests .q-check {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 12px;
  margin: 0 14px 10px 0
}

.vk-quests input[type=checkbox] {
  accent-color: var(--q-accent)
}

.vk-quests .q-form-grid {
  display: grid;
  grid-template-columns: repeat(2,minmax(0,1fr));
  gap: 12px
}

.vk-quests .q-edit-objective {
  padding: 12px;
  background: var(--q-dark);
  border: 1px solid var(--q-edge);
  border-radius: 7px;
  margin-bottom: 10px
}

.vk-quests .q-row {
  display: flex;
  gap: 7px;
  align-items: center;
  flex-wrap: wrap
}

.vk-quests .q-row select {
  width: auto;
  flex: 1
}

.vk-quests .q-danger {
  color: #ffb1a3
}

.vk-quests details {
  padding: 9px 18px;
  border-top: 1px solid var(--q-edge)
}

.vk-quests summary {
  cursor: pointer;
  color: var(--q-muted);
  font-size: 12px
}

.vk-quests .q-settings {
  display: flex;
  gap: 8px;
  align-items: end;
  padding-top: 10px
}

.vk-quests .q-settings label {
  flex: 1;
  margin: 0
}

.vk-quests :is(button,input,select,textarea):focus-visible {
  outline: 2px solid var(--q-accent);
  outline-offset: 2px
}

@container (max-width:650px) {
  .vk-quests .q-layout {
    grid-template-columns: 180px minmax(0,1fr)
  }

  .vk-quests .q-details {
    padding: 14px
  }

  .vk-quests .q-form-grid {
    grid-template-columns: 1fr
  }
}
`;
const qTerminal = qNode('div', 'q-terminal', undefined, qRoot);
const qHeader = qNode('div', 'q-header', undefined, qTerminal);
const qHeading = qNode('div', '', undefined, qHeader);
const qKicker = qNode('div', 'q-kicker', 'VAULT-KIT // QUESTS', qHeading);
const qTitle = qNode('h2', '', 'Quest Terminal', qHeading);
const qSubtitle = qNode('small', '', 'WASTELAND OPERATIONS', qHeading);
const qToolbar = qNode('div', 'q-toolbar', undefined, qTerminal);
const qMessage = qNode('div', 'q-message', 'Ready.', qTerminal);
qMessage.setAttribute('role', 'status');
const qLayout = qNode('div', 'q-layout', undefined, qTerminal);
const qList = qNode('nav', 'q-list', undefined, qLayout);
qList.setAttribute('aria-label', 'Quest list');
const qDetails = qNode('div', 'q-details', undefined, qLayout);
function qField(parent, title, value, onInput, multiline = false) {
  const label = qNode('label', 'q-field', undefined, parent); qNode('span', '', title, label);
  const input = qNode(multiline ? 'textarea' : 'input', '', undefined, label);
  if (!multiline) input.type = 'text'; input.value = value || '';
  input.addEventListener('input', () => onInput(input.value)); return input;
}
function qSelect(parent, title, value, choices, onChange) {
  const label = qNode('label', 'q-field', undefined, parent);qNode('span', '', title, label);
  const input = qNode('select', '', undefined, label);
  for (const [key,text] of choices) {const option = qNode('option','',text,input);option.value=key;}
  input.value=value;input.addEventListener('change',()=>onChange(input.value));return input;
}
function qCheck(parent, title, value, onChange) {
  const label=qNode('label','q-check',undefined,parent);const input=qNode('input','',undefined,label);
  input.type='checkbox';input.checked=value===true;qNode('span','',title,label);
  input.addEventListener('change',()=>onChange(input.checked));return input;
}
function qSection(parent, title) {
  const card=qNode('section','q-form-card',undefined,parent);
  qNode('div','q-section-heading',title,card);
  return qNode('div','q-section-body',undefined,card);
}
function qConnectionSettings() {
  const settings=qNode('details','',undefined,qTerminal);qNode('summary','','Server connection',settings);
  const body=qNode('div','q-settings',undefined,settings);
  const input=qField(body,'Shared with the trade tools',qBase,()=>{});
  qButton('Save address',body,()=>{
    try {const url=new URL(input.value.trim());if(!['http:','https:'].includes(url.protocol))throw Error('Use an HTTP or HTTPS address.');
      localStorage.setItem(qServerKey,url.href.replace(/\/+$/,''));qStatus('Address saved. Reopen this note to connect to it.');
    }catch(error){qStatus(error.message,true);}
  });
}

// CSS: shared controls and GM console styling.
qStyle.textContent += `
/* Vault-Kit controls: explicit sizes defeat Obsidian/theme control clipping. */
.vk-quests > .q-terminal {
  width: 100%;
  max-width: 100%;
  border-top-width: 1px;
  box-shadow: 0 10px 28px #0004
}

.vk-quests .q-header {
  display: flex!important;
  align-items: center!important;
  justify-content: space-between;
  gap: 20px;
  padding: 20px 22px!important;
  min-height: 100px;
  background: linear-gradient(135deg,#142536,#1d3d57 62%,#183149);
  border-left: 5px solid var(--q-accent)
}

.vk-quests .q-header>div {
  flex: 1 1 260px;
  min-width: 0
}

.vk-quests .q-kicker {
  font: 800 10px/1.5 var(--font-interface)!important;
  letter-spacing: .18em;
  color: var(--q-accent);
  text-transform: uppercase;
  margin-bottom: 5px
}

.vk-quests .q-header h2 {
  font: 850 28px/1.15 var(--font-interface)!important;
  color: var(--vk-text,#f4ead5)!important;
  letter-spacing: .02em;
  margin: 0 0 6px!important;
  border: 0!important;
  padding: 0!important;
  text-transform: none!important
}

.vk-quests .q-header small {
  font: 400 12px/1.5 var(--font-interface)!important;
  color: var(--q-muted)
}

.vk-quests .q-toolbar {
  padding: 10px 16px!important;
  background: var(--q-dark)
}

.vk-quests .q-layout {
  height: clamp(440px,70vh,820px);
  min-height: 0!important;
  max-height: none!important;
  grid-template-columns: minmax(200px,.75fr) minmax(0,2.25fr);
  grid-template-rows: minmax(0,1fr);
  overflow: hidden
}

.vk-quests .q-list,.vk-quests .q-layout>.q-details {
  min-width: 0!important;
  min-height: 0!important;
  max-height: 100%;
  overflow: auto!important;
  overscroll-behavior: contain;
  scrollbar-gutter: stable;
  align-self: stretch
}

.vk-quests .q-list {
  background: rgba(7,18,27,.25)
}

.vk-quests .q-layout>.q-details {
  padding: 16px!important;
  background: linear-gradient(180deg,#101d28,#142534)
}

.vk-quests .q-terminal button {
  min-height: 34px!important;
  height: auto!important;
  line-height: 1.4!important;
  padding: 7px 12px!important;
  white-space: normal!important;
  font: 600 13px/1.4 var(--font-interface)!important;
  box-shadow: none!important;
  flex-shrink: 0
}

.vk-quests .q-terminal .q-header>button {
  background: rgba(8,18,27,.46);
  border-color: var(--q-accent);
  color: var(--q-accent)
}

.vk-quests .q-field {
  display: flex!important;
  flex-direction: column!important;
  flex: 0 0 auto!important;
  align-items: stretch!important;
  height: auto!important;
  min-height: 0!important;
  overflow: visible!important;
  gap: 6px!important;
  margin: 0 0 12px!important
}

.vk-quests .q-field>span {
  display: block!important;
  font: 600 12px/1.5 var(--font-interface)!important;
  white-space: normal!important;
  overflow: visible!important
}

.vk-quests .q-terminal :is(input:not([type=checkbox]),select) {
  display: block!important;
  box-sizing: border-box!important;
  width: 100%!important;
  height: 40px!important;
  min-height: 40px!important;
  max-height: none!important;
  padding: 8px 10px!important;
  font: 400 14px/normal var(--font-interface)!important;
  flex: 0 0 auto!important;
  text-indent: 0!important;
  vertical-align: middle!important;
  box-shadow: inset 0 1px 2px #0003!important
}

.vk-quests .q-terminal select {
  padding-right: 30px!important;
  text-overflow: ellipsis
}

.vk-quests .q-terminal select option {
  font: 400 14px/normal var(--font-interface)!important;
  background: #102434;
  color: #dce6eb
}

.vk-quests .q-terminal textarea {
  display: block!important;
  box-sizing: border-box!important;
  height: 96px!important;
  min-height: 88px!important;
  max-height: 320px!important;
  width: 100%!important;
  flex: 0 0 auto!important;
  padding: 10px 12px!important;
  font: 400 14px/1.5 var(--font-interface)!important;
  resize: vertical!important;
  overflow: auto!important;
  white-space: pre-wrap!important
}

.vk-quests .q-check {
  display: inline-flex!important;
  align-items: center!important;
  height: auto!important;
  min-height: 28px!important;
  line-height: 1.5!important;
  padding: 0!important;
  white-space: normal!important
}

.vk-quests .q-check input {
  flex: 0 0 auto!important;
  width: 16px!important;
  height: 16px!important;
  margin: 0!important
}

.vk-quests .q-form-grid {
  align-items: start!important;
  gap: 12px!important;
  min-width: 0
}

.vk-quests .q-form-card {
  border: 1px solid var(--q-edge);
  border-radius: 9px;
  background: var(--q-bg);
  overflow: hidden;
  margin: 0 0 14px;
  box-shadow: inset 0 1px 0 #ffffff06
}

.vk-quests .q-section-heading {
  display: block;
  padding: 10px 14px;
  color: var(--q-accent);
  background: var(--vk-panel-header,#1b3a52);
  border-bottom: 1px solid var(--q-edge);
  font: 800 12px/1.5 var(--font-interface);
  letter-spacing: .09em;
  text-transform: uppercase
}

.vk-quests .q-section-body {
  padding: 14px
}

.vk-quests .q-section-body>:last-child {
  margin-bottom: 0!important
}

.vk-quests .q-edit-objective {
  padding: 12px!important;
  background: var(--q-dark)!important
}

.vk-quests .q-terminal>details {
  padding: 10px 18px;
  background: var(--q-dark);
  border-top: 1px solid var(--q-edge);
  position: relative
}

.vk-quests .q-settings {
  align-items: end;
  flex-wrap: wrap
}

.vk-quests .q-settings .q-field {
  flex: 1 1 240px!important;
  margin: 0!important
}

.vk-quests.is-gm-control .q-entry {
  border-left: 3px solid transparent
}

.vk-quests.is-gm-control .q-entry.is-selected {
  border-left-color: var(--q-accent);
  background: #203d53
}

@container (max-width:620px) {
  .vk-quests .q-layout {
    grid-template-columns: 160px minmax(0,1fr)
  }

  .vk-quests .q-form-grid {
    grid-template-columns: minmax(0,1fr)
  }

  .vk-quests .q-header {
    padding: 16px!important
  }

  .vk-quests .q-section-body {
    padding: 10px
  }

  .vk-quests .q-header h2 {
    font-size: 24px!important
  }
}
`;

qRoot.classList.add('is-gm-control');
qKicker.textContent='VAULT-KIT // GM TOOLS';
qTitle.textContent='Quest Control';
qSubtitle.textContent='Prepare quests · Reveal objectives · Publish updates';
const qStatuses=[['active','Active'],['completed','Completed'],['failed','Failed']];
const qStoredDraft=qRead('gm-draft',null);
let qDraft=qStoredDraft&&Array.isArray(qStoredDraft.quests)?qStoredDraft:{revision:0,quests:[]};
qDraft.quests.forEach(q=>{if(q.status==='failed')q.status='completed';});
let qChosen=qDraft.quests[0]?.id||'';
let qDraftChanged=false;
let qGmBusy=false;
let qLatest=null;
const qId=prefix=>prefix+'-'+(globalThis.crypto?.randomUUID?.()||Date.now().toString(36)+'-'+Math.random().toString(36).slice(2));
const qPreview=qNode('div','',undefined,qTerminal);qPreview.hidden=true;
function qSaveDraft() {
  qDraftChanged=true;
  try{qWrite('gm-draft',qDraft);qStatus('Draft saved locally. Player screens change only when you publish.');}
  catch(error){qStatus('Could not save this draft locally: '+error.message,true);}
}
function qPublicDraft() {
  return qDraft.quests.filter(q=>q.visible===true).map(q=>({
    id:q.id,title:q.title,description:q.description,reward:q.reward,kind:q.kind,status:q.status,visible:true,
    objectives:q.objectives.filter(o=>o.visible===true).map(o=>({id:o.id,text:o.text,status:o.status,optional:o.optional===true,visible:true}))
  }));
}
function qDrawPreview(quests,title,revision=null) {
  qPreview.hidden=false;qPreview.replaceChildren();
  const panel=qNode('div','q-details',undefined,qPreview);qNode('h3','',title,panel);
  qNode('p','q-muted','Only the content below is included in the player publication.',panel);
  if(!quests.length)qNode('p','q-muted','No visible quests. Publishing this draft clears the player quest list.',panel);
  for(const quest of quests){
    qNode('h4','',quest.title+' · '+quest.status,panel);
    if(quest.description)qNode('p','q-description',quest.description,panel);
    for(const objective of quest.objectives)qNode('p','',(objective.optional?'(Optional) ':'')+objective.text+' · '+objective.status,panel);
    if(quest.reward)qNode('p','','Reward: '+quest.reward,panel);
  }
  if(revision!==null&&revision!==qDraft.revision){
    qNode('p','is-error','This publication differs from your draft’s base revision. Keeping your draft and publishing will replace it.',panel);
    qButton('Keep my draft; use this publication revision',panel,()=>{qDraft.revision=revision;qSaveDraft();qDrawPreview(quests,title,revision);});
  }
  qButton('Close preview',panel,()=>{qPreview.hidden=true;});
}
function qRenderGmList() {
  qList.replaceChildren();
  if(!qDraft.quests.length)qNode('p','q-muted','Create a quest to begin.',qList);
  for(const quest of qDraft.quests){
    const button=qButton(quest.title||'Untitled quest',qList,()=>{qChosen=quest.id;qRenderGm();},'q-entry');
    button.classList.toggle('is-selected',quest.id===qChosen);
    qNode('small','',(quest.visible?'Revealed':'Hidden')+' · '+quest.status+(quest.kind==='misc'?' · Miscellaneous':''),button);
  }
}
function qRenderGm() {
  qRenderGmList();qDetails.replaceChildren();
  const quest=qDraft.quests.find(q=>q.id===qChosen);
  if(!quest){qNode('p','q-muted','Choose a quest or create a new one. Hidden content is kept in this GM draft only.',qDetails);return;}
  const identity=qSection(qDetails,'Quest details');
  qField(identity,'Quest title',quest.title,value=>{quest.title=value;qSaveDraft();qRenderGmList();});
  const grid=qNode('div','q-form-grid',undefined,identity);
  qSelect(grid,'Type',quest.kind,[['quest','Quest'],['misc','Miscellaneous']],value=>{quest.kind=value;qSaveDraft();qRenderGmList();});
  qSelect(grid,'Quest status',quest.status,qStatuses.filter(([value])=>value!=='failed'),value=>{quest.status=value;qSaveDraft();qRenderGmList();});
  qCheck(identity,'Reveal quest to players',quest.visible,value=>{quest.visible=value;qSaveDraft();qRenderGmList();});
  const briefing=qSection(qDetails,'Player briefing');
  qField(briefing,'Player description',quest.description,value=>{quest.description=value;qSaveDraft();},true);
  qField(briefing,'Known reward (leave blank to hide)',quest.reward,value=>{quest.reward=value;qSaveDraft();},true);
  const privateNotes=qSection(qDetails,'GM notes');
  qField(privateNotes,'Private GM notes — never published',quest.gmNotes,value=>{quest.gmNotes=value;qSaveDraft();},true);
  const objectives=qSection(qDetails,'Objectives');
  qNode('p','q-muted','Prepare future objectives as hidden. Reorder them with the arrows.',objectives);
  quest.objectives.forEach((objective,index)=>{
    const box=qNode('div','q-edit-objective',undefined,objectives);
    qField(box,'Objective '+(index+1),objective.text,value=>{objective.text=value;qSaveDraft();},true);
    qSelect(box,'Status',objective.status,qStatuses,value=>{objective.status=value;qSaveDraft();});
    qCheck(box,'Reveal objective',objective.visible,value=>{objective.visible=value;qSaveDraft();});
    qCheck(box,'Optional',objective.optional,value=>{objective.optional=value;qSaveDraft();});
    const row=qNode('div','q-row',undefined,box);
    const up=qButton('↑',row,()=>{[quest.objectives[index-1],quest.objectives[index]]=[objective,quest.objectives[index-1]];qSaveDraft();qRenderGm();});
    up.setAttribute('aria-label','Move objective up');up.disabled=index===0;
    const down=qButton('↓',row,()=>{[quest.objectives[index+1],quest.objectives[index]]=[objective,quest.objectives[index+1]];qSaveDraft();qRenderGm();});
    down.setAttribute('aria-label','Move objective down');down.disabled=index===quest.objectives.length-1;
    let armed=false;const remove=qButton('Remove objective',row,()=>{
      if(!armed){armed=true;remove.textContent='Confirm removal';return;}
      quest.objectives.splice(index,1);qSaveDraft();qRenderGm();
    },'q-danger');
  });
  qButton('Add objective',objectives,()=>{quest.objectives.push({id:qId('objective'),text:'',status:'active',optional:false,visible:false});qSaveDraft();qRenderGm();});
  const management=qSection(qDetails,'Quest management');
  const row=qNode('div','q-row',undefined,management);
  qButton('Duplicate as hidden quest',row,()=>{
    const copy=JSON.parse(JSON.stringify(quest));copy.id=qId('quest');copy.title+=' (copy)';copy.visible=false;
    copy.objectives.forEach(o=>o.id=qId('objective'));qDraft.quests.push(copy);qChosen=copy.id;qSaveDraft();qRenderGm();
  });
  let armed=false;const remove=qButton('Delete quest',row,()=>{
    if(!armed){armed=true;remove.textContent='Confirm deletion';return;}
    qDraft.quests=qDraft.quests.filter(q=>q.id!==quest.id);qChosen=qDraft.quests[0]?.id||'';qSaveDraft();qRenderGm();
  },'q-danger');
}
qButton('New quest',qToolbar,()=>{
  const quest={id:qId('quest'),title:'New quest',kind:'quest',status:'active',description:'',reward:'',gmNotes:'',visible:false,objectives:[]};
  qDraft.quests.push(quest);qChosen=quest.id;qSaveDraft();qRenderGm();
});
qButton('Preview player publication',qToolbar,()=>qDrawPreview(qPublicDraft(),'Draft preview'));
const qCheckButton=qButton('Check publication',qToolbar,()=>qCheckPublication(false));
const qPublish=qButton('Publish to players',qHeader,async()=>{
  if(qGmBusy)return;
  const quests=qPublicDraft();
  if(quests.some(q=>!q.title.trim()||q.objectives.some(o=>!o.text.trim()))){qStatus('Give every revealed quest and objective a title/text before publishing.',true);return;}
  qGmBusy=true;qPublish.disabled=true;qStatus('Publishing revealed quests…');
  try {
    const data=await qRequest('/api/quests/publish',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({expectedRevision:qDraft.revision,quests})});
    qDraft.revision=data.revision;qLatest=data;
    qWrite('gm-draft',qDraft);qStatus('Published revision '+data.revision+' · '+qDate(data.publishedAt)+'. Players can refresh their homepage.');
  }catch(error){qStatus(error.message+'\nYour draft is retained. Use Check publication if another publication was saved.',true);}
  finally{qGmBusy=false;qPublish.disabled=false;}
});
async function qCheckPublication(initial) {
  if(qGmBusy)return;qGmBusy=true;qCheckButton.disabled=true;qPublish.disabled=true;
  try {
    const data=await qRequest('/api/quests');qLatest=data;
    if(initial&&!qStoredDraft&&!qDraftChanged){
      qDraft={revision:data.revision,quests:data.quests.map(q=>({...q,status:q.status==='failed'?'completed':q.status,visible:true,gmNotes:'',objectives:q.objectives.map(o=>({...o,visible:true}))}))};
      qChosen=qDraft.quests[0]?.id||'';qWrite('gm-draft',qDraft);qRenderGm();
    }
    qStatus('Published revision '+data.revision+' · '+qDate(data.publishedAt)+'. Your draft is based on revision '+qDraft.revision+'.');
    if(!initial||data.revision!==qDraft.revision)qDrawPreview(data.quests,'Current player publication',data.revision);
  }catch(error){qStatus('Server unavailable: '+error.message+'\nYou can continue editing your local draft.',true);}
  finally{qGmBusy=false;qCheckButton.disabled=false;qPublish.disabled=false;}
}
qConnectionSettings();qRenderGm();void qCheckPublication(true);

return qRoot;
})();
```
