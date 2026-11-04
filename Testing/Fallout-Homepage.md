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
      if (!response.ok || data?.ok !== true) {
        const error = new Error(data?.reason || `HTTP ${response.status}`);
        error.status = response.status;
        throw error;
      }
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
  input.setAttribute('aria-label', title);
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

/* GM workflow: compact identity, planning below objectives, top connection. */
.vk-quests.is-gm-control .q-entry.is-completed {
  opacity: .48
}

.vk-quests.is-gm-control .q-hidden-text {
  color: #c9a65c!important
}

.vk-quests.is-gm-control .q-revealed-text {
  color: #62d995!important
}

.vk-quests.is-gm-control .q-entry small.q-unpublished {
  color: var(--q-accent)!important;
  font-size: 10px
}

.vk-quests.is-gm-control .q-gm-objective-heading {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
  font-size: 11px
}

.vk-quests.is-gm-control .q-objectives-card>.q-section-heading {
  padding: 8px 12px
}

.vk-quests.is-gm-control .q-objectives-card>.q-section-body {
  padding: 10px
}

.vk-quests.is-gm-control .q-objectives-hint {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 14px;
  height: 14px;
  margin-left: 6px;
  border: 1px solid currentColor;
  border-radius: 50%;
  color: var(--q-muted);
  cursor: help;
  font: 400 10px/1 var(--font-interface)
}

.vk-quests.is-gm-control .q-edit-objective {
  padding: 10px!important;
  margin-bottom: 8px
}

.vk-quests.is-gm-control .q-gm-objective-heading .q-objective-label {
  color: var(--q-muted);
  font-size: 12px;
  font-weight: 600;
  margin-right: auto
}

.vk-quests.is-gm-control .q-edit-objective textarea.q-objective-input {
  height: 58px!important;
  min-height: 58px!important;
  padding: 7px 9px!important;
  font: 400 14px/20px var(--font-interface)!important;
  resize: vertical!important;
  margin: 0 0 8px
}

.vk-quests.is-gm-control .q-objective-controls {
  gap: 8px;
  align-items: center
}

.vk-quests.is-gm-control .q-objective-controls .q-field {
  flex-direction: row!important;
  align-items: center!important;
  gap: 6px!important;
  margin: 0!important
}

.vk-quests.is-gm-control .q-objective-controls .q-field>span {
  font-size: 11px!important
}

.vk-quests.is-gm-control .q-objective-controls select {
  width: 116px!important;
  min-height: 28px!important;
  height: 28px!important;
  padding: 3px 24px 3px 7px!important;
  font-size: 12px!important
}

.vk-quests.is-gm-control .q-objective-controls .q-check {
  margin: 0!important;
  min-height: 28px!important;
  font-size: 12px!important
}

.vk-quests.is-gm-control .q-objective-controls button {
  min-height: 28px!important;
  padding: 3px 9px!important;
  font-size: 12px!important
}

.vk-quests.is-gm-control .q-edit-objective.is-completed textarea {
  color: var(--q-muted)!important;
  opacity: .65
}

.vk-quests.is-gm-control .q-edit-objective.is-completed .q-gm-objective-square {
  color: var(--q-muted)
}

.vk-quests.is-gm-control .q-identity-card .q-section-heading {
  padding: 5px 10px!important;
  font-size: 11px!important
}

.vk-quests.is-gm-control .q-identity-card .q-section-body {
  padding: 8px 10px!important
}

.vk-quests.is-gm-control .q-identity-card .q-field {
  gap: 2px!important;
  margin: 0!important
}

.vk-quests.is-gm-control .q-identity-main {
  display: grid;
  grid-template-columns: minmax(140px,1.2fr) minmax(320px,2fr);
  align-items: end;
  gap: 12px
}

.vk-quests.is-gm-control .q-identity-card :is(input:not([type=checkbox]),select) {
  height: 28px!important;
  min-height: 28px!important;
  padding: 3px 8px!important;
  font-size: 12px!important;
  line-height: normal!important
}

.vk-quests.is-gm-control .q-identity-card .q-field>span {
  font-size: 11px!important;
  line-height: 1.3!important
}

.vk-quests.is-gm-control .q-identity-card button {
  min-height: 26px!important;
  padding: 3px 9px!important;
  font-size: 12px!important
}

.vk-quests.is-gm-control .q-quest-management {
  margin-top: 8px
}

.vk-quests.is-gm-control .q-identity-controls {
  grid-template-columns: minmax(90px,1fr) minmax(100px,1fr) auto;
  align-items: end!important;
  gap: 10px!important
}

.vk-quests.is-gm-control .q-identity-controls .q-check {
  margin: 0!important;
  min-height: 28px!important;
  font-size: 12px!important
}

.vk-quests.is-gm-control details.q-planning {
  padding: 0;
  border-top: 1px solid var(--q-edge)
}

.vk-quests.is-gm-control .q-planning>summary {
  display: list-item;
  list-style-position: inside;
  cursor: pointer
}

.vk-quests.is-gm-control .q-planning:not([open])>summary {
  border-bottom: 0
}

.vk-quests.is-gm-control .q-toolbar {
  align-items: flex-start
}

.vk-quests.is-gm-control .q-server-settings {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-left: auto;
  padding: 0;
  border: 0;
  flex: 0 1 auto;
  min-width: 0
}

.vk-quests.is-gm-control .q-server-inline-label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--q-muted);
  font-size: 12px
}

.vk-quests.is-gm-control .q-terminal input.q-gm-server-input {
  width: 210px!important;
  height: 34px!important;
  min-height: 34px!important;
  padding: 5px 8px!important;
  font-size: 12px!important
}

.vk-quests.is-gm-control .q-server-settings .q-settings {
  width: min(360px,100%);
  align-items: end
}

/* Top-layer popup: independent of the editor's scroll and overflow. */
.vk-quests.is-gm-control dialog.q-preview-dialog {
  width: min(860px,calc(100vw - 48px));
  max-width: calc(100vw - 48px);
  max-height: 82vh;
  padding: 0;
  border: 1px solid var(--q-edge);
  border-radius: 10px;
  background: var(--q-bg);
  color: inherit;
  box-shadow: 0 24px 80px #0009
}

.vk-quests.is-gm-control dialog.q-preview-dialog[open] {
  display: flex;
  flex-direction: column
}

.vk-quests.is-gm-control .q-preview-dialog::backdrop {
  background: #000b
}

.vk-quests.is-gm-control .q-preview-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 18px;
  background: var(--q-dark);
  border-bottom: 1px solid var(--q-edge);
  flex-shrink: 0
}

.vk-quests.is-gm-control .q-preview-top h3 {
  margin: 0;
  color: var(--q-accent)
}

.vk-quests.is-gm-control .q-preview-body {
  min-height: 0;
  overflow: auto;
  padding: 18px 22px;
  overflow-wrap: anywhere
}

.vk-quests.is-gm-control .q-preview-body h4 {
  color: var(--q-accent)
}

.vk-quests.is-gm-control .q-change-card {
  padding: 12px 0;
  border-bottom: 1px solid var(--q-edge)
}

.vk-quests.is-gm-control .q-change-values {
  display: grid;
  grid-template-columns: repeat(2,minmax(0,1fr));
  gap: 12px;
  margin: 6px 0 14px
}

.vk-quests.is-gm-control .q-change-value {
  padding: 8px 12px;
  background: var(--q-dark);
  border: 1px solid var(--q-edge);
  border-radius: 5px
}

.vk-quests.is-gm-control .q-change-value p {
  margin: 4px 0;
  white-space: pre-wrap
}

@container (max-width:620px) {
  .vk-quests.is-gm-control .q-identity-main {
    grid-template-columns: minmax(0,1fr)
  }
  .vk-quests.is-gm-control .q-identity-controls {
    grid-template-columns: repeat(2,minmax(0,1fr))
  }

  .vk-quests.is-gm-control .q-identity-controls .q-check {
    grid-column: 1 / -1;
    min-height: 28px!important
  }
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

// Isolate this panel from styles in other open note versions.
const qPlayerSelector = "#vk-quest-player-" + crypto.randomUUID();
qRoot.id = qPlayerSelector.slice(1);
// CSS: player quest terminal.
qStyle.textContent += `
/* Approved Pip-Boy mockup, scoped to the quest terminal only. */
.vk-quests.is-player-terminal {
  border: 0!important;
  outline: 0!important;
  box-shadow: none!important;
  background: transparent!important;
  display: block!important;
  height: auto!important;
  min-height: 0!important;
  flex: 0 0 auto!important
}

.vk-quests.is-player-terminal>.q-terminal {
  --q-accent: #1aff80;
  --q-edge: #1aff8070;
  --q-muted: #1aff80;
  --q-bg: #04170b;
  --q-dark: #04170b;
  --quest-panel-height: 300px;
  --quest-objectives-width: 300px;
  --quest-objectives-inset: 24px;
  display: block!important;
  height: auto!important;
  min-height: 0!important;
  max-height: none!important;
  box-sizing: border-box!important;
  width: 100%!important;
  max-width: 700px!important;
  padding: 0!important;
  background: #04170b!important;
  color: #1aff80!important;
  border: 0!important;
  border-radius: 0!important;
  box-shadow: none!important;
  container-type: normal!important;
  font: 400 16px/1.4 'Arial Narrow',Arial,sans-serif!important
}

.vk-quests.is-player-terminal .q-terminal * {
  box-sizing: border-box!important;
  text-shadow: none!important
}

/* Header: DATA, server field and connection segment */
.vk-quests.is-player-terminal .q-terminal .q-header {
  display: grid!important;
  grid-template-columns: minmax(0,1fr) max-content!important;
  align-items: stretch!important;
  justify-content: normal!important;
  gap: 8px!important;
  padding: 0!important;
  min-height: 0!important;
  height: auto!important;
  background: transparent!important;
  border: 0!important
}

.vk-quests.is-player-terminal .q-terminal .q-header>.q-header-segment {
  display: flex!important;
  flex: initial!important;
  justify-content: flex-end;
  align-items: center;
  min-width: 0;
  gap: 8px;
  position: relative;
  border-top: 2px solid #1aff80;
  border-right: 2px solid #1aff80;
  padding: 7px 9px
}

.vk-quests.is-player-terminal .q-terminal .q-header-segment:first-child::before {
  content: '';
  position: absolute;
  left: 0;
  top: -2px;
  bottom: 0;
  width: 2px;
  height: auto;
  background: #1aff80
}

.vk-quests.is-player-terminal .q-terminal .q-data-label {
  margin: 0 auto 0 50px!important;
  padding-right: 12px;
  color: #1aff80!important;
  font: 500 15px/1.4 'Arial Narrow',Arial,sans-serif!important;
  letter-spacing: .22em!important
}

.vk-quests.is-player-terminal .q-terminal .q-server-label {
  display: flex!important;
  align-items: center;
  justify-content: flex-end;
  gap: 7px;
  min-width: 0;
  max-width: 100%;
  margin: 0!important;
  color: #1aff80!important;
  font: 400 12px/1.4 'Arial Narrow',Arial,sans-serif!important
}

.vk-quests.is-player-terminal .q-terminal input.q-server-input {
  display: block!important;
  width: 155px!important;
  max-width: 100%!important;
  min-width: 0!important;
  flex: 0 1 155px!important;
  height: 26px!important;
  min-height: 26px!important;
  max-height: 26px!important;
  padding: 3px 6px!important;
  color: #1aff80!important;
  background: transparent!important;
  border: 1px solid #1aff8070!important;
  border-radius: 0!important;
  box-shadow: none!important;
  font: 400 12px/1.4 'Arial Narrow',Arial,sans-serif!important
}

.vk-quests.is-player-terminal .q-terminal .q-connection-wrap {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 9px;
  white-space: nowrap
}

.vk-quests.is-player-terminal .q-terminal button.q-connect {
  min-height: 0!important;
  height: auto!important;
  flex: none!important;
  padding: 4px 7px!important;
  border: 1px solid #1aff80!important;
  border-radius: 0!important;
  background: transparent!important;
  color: #1aff80!important;
  box-shadow: none!important;
  font: 400 11px/1.4 'Arial Narrow',Arial,sans-serif!important;
  white-space: nowrap!important
}

.vk-quests.is-player-terminal .q-terminal button.q-connect:hover {
  background: #1aff80!important;
  color: #04170b!important
}

.vk-quests.is-player-terminal .q-terminal .q-connection {
  color: #1aff80;
  font: 400 11px/1.4 'Arial Narrow',Arial,sans-serif!important
}

/* Fixed-height columns and independent scrolling */
.vk-quests.is-player-terminal .q-terminal .q-layout {
  display: grid!important;
  grid-template-columns: minmax(0,1fr) minmax(0,1fr)!important;
  grid-template-rows: minmax(0,1fr)!important;
  gap: 36px!important;
  margin: 17px 0 0!important;
  padding: 0 9px!important;
  height: var(--quest-panel-height)!important;
  min-height: 0!important;
  max-height: var(--quest-panel-height)!important;
  overflow: hidden!important
}

.vk-quests.is-player-terminal .q-terminal .q-scroll-shell {
  display: grid;
  grid-template-rows: 16px minmax(0,1fr) 16px;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  border: 0!important;
  outline: 0!important;
  box-shadow: none!important;
}

/* The quest list uses the full height; objectives sit inside a shorter window. */
.vk-quests.is-player-terminal .q-terminal .q-quest-scroll {
  position: relative;
  display: block!important;
  height: 100%;
  align-self: stretch;
}

/* Put list arrows in the left gutter instead of shortening the scroll area. */
.vk-quests.is-player-terminal .q-terminal .q-quest-scroll button.q-scroll-arrow {
  position: absolute;
  left: 0;
  z-index: 2;
}

.vk-quests.is-player-terminal .q-terminal .q-quest-scroll button.q-scroll-arrow:first-child {
  top: 0;
}

.vk-quests.is-player-terminal .q-terminal .q-quest-scroll button.q-scroll-arrow:last-child {
  bottom: 0;
}

.vk-quests.is-player-terminal .q-terminal .q-objective-scroll {
  width: min(100%,var(--quest-objectives-width))!important;
  max-width: var(--quest-objectives-width)!important;
  min-width: 0!important;
  height: calc(95% - var(--quest-objectives-inset) * 2);
  max-height: calc(95% - var(--quest-objectives-inset) * 2);
  align-self: center;
  justify-self: end;
  border: 0!important;
  background: transparent!important;
  box-shadow: none!important;
}

.vk-quests.is-player-terminal .q-terminal :is(.q-list,.q-details) {
  display: block!important;
  min-width: 0!important;
  min-height: 0!important;
  width: 100%!important;
  height: 100%!important;
  max-height: 100%!important;
  margin: 0!important;
  padding: 0!important;
  background: transparent!important;
  border: 0!important;
  overflow-x: hidden!important;
  overflow-y: auto!important;
  overscroll-behavior: contain;
  scrollbar-width: none!important;
  scrollbar-gutter: auto!important;
  color: #1aff80!important;
  font: 400 16px/1.4 'Arial Narrow',Arial,sans-serif!important
}

/* Prevent native/theme overflow decorations from drawing a line. */
.vk-quests.is-player-terminal .q-terminal .q-details {
  outline: 0!important;
  box-shadow: none!important;
  background-image: none!important;
}

.vk-quests.is-player-terminal .q-terminal .q-details::before,
.vk-quests.is-player-terminal .q-terminal .q-details::after {
  content: none!important;
}

.vk-quests.is-player-terminal .q-terminal :is(.q-list,.q-details)::-webkit-scrollbar {
  display: none!important;
  width: 0!important;
  height: 0!important;
  border: 0!important;
  background: transparent!important;
}

.vk-quests.is-player-terminal .q-terminal :is(.q-list,.q-details)::-webkit-scrollbar-track,
.vk-quests.is-player-terminal .q-terminal :is(.q-list,.q-details)::-webkit-scrollbar-thumb,
.vk-quests.is-player-terminal .q-terminal :is(.q-list,.q-details)::-webkit-scrollbar-corner {
  border: 0!important;
  background: transparent!important;
  box-shadow: none!important;
}

.vk-quests.is-player-terminal .q-terminal button.q-scroll-arrow {
  display: block!important;
  justify-self: start;
  align-self: center;
  min-height: 0!important;
  height: 16px!important;
  width: 24px!important;
  min-width: 24px!important;
  padding: 0!important;
  margin: 0!important;
  border: 0!important;
  border-radius: 0!important;
  background: transparent!important;
  color: #1aff80!important;
  box-shadow: none!important;
  font: 400 16px/16px Arial,sans-serif!important
}

.vk-quests.is-player-terminal .q-terminal .q-objective-scroll button.q-scroll-arrow {
  justify-self: end
}

.vk-quests.is-player-terminal .q-terminal button.q-scroll-arrow:disabled {
  visibility: hidden!important
}

.vk-quests.is-player-terminal .q-terminal button.q-scroll-arrow:hover {
  background: #105d283c!important
}

/* Quest rows: left alignment, selection and completed state */
.vk-quests.is-player-terminal .q-terminal button.q-entry {
  display: flex!important;
  justify-content: flex-start!important;
  align-items: baseline!important;
  gap: 8px!important;
  width: 100%!important;
  min-height: 29px!important;
  height: auto!important;
  margin: 0 0 1px!important;
  padding: 4px 20px!important;
  border: 1px solid transparent!important;
  border-radius: 0!important;
  background: transparent!important;
  box-shadow: none!important;
  text-align: left!important;
  white-space: normal!important;
  color: #1aff80!important;
  font: 400 16px/1.4 'Arial Narrow',Arial,sans-serif!important;
  letter-spacing: normal!important
}

.vk-quests.is-player-terminal .q-terminal button.q-entry::before {
  content: none!important
}

.vk-quests.is-player-terminal .q-terminal button.q-entry:hover {
  border-color: #1aff8070!important;
  background: #105d283c!important
}

.vk-quests.is-player-terminal .q-terminal button.q-entry.is-completed {
  color: #1aff80!important;
  opacity: .42!important
}

.vk-quests.is-player-terminal .q-terminal .q-square {
  display: inline-block;
  width: 8px;
  height: 8px;
  min-width: 8px;
  flex: 0 0 8px;
  border: 1px solid currentColor;
  align-self: baseline;
  margin-top: 5px
}

.vk-quests.is-player-terminal .q-terminal .q-entry .q-square {
  border-color: transparent
}

.vk-quests.is-player-terminal .q-terminal .q-entry[aria-current=true] .q-square {
  background: currentColor;
  border-color: currentColor
}

.vk-quests.is-player-terminal .q-terminal .q-entry-title {
  min-width: 0;
  overflow-wrap: anywhere
}

/* Objectives: vertical centering and checkbox states */
.vk-quests.is-player-terminal .q-terminal .q-objective-group {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 100%;
  padding: 4px 0
}

.vk-quests.is-player-terminal .q-terminal .q-objective {
  display: flex!important;
  align-items: baseline!important;
  gap: 9px!important;
  flex: 0 0 auto;
  padding: 0 0 14px!important;
  margin: 0!important;
  border: 0!important;
  color: #1aff80!important;
  font: 400 16px/1.45 'Arial Narrow',Arial,sans-serif!important
}

.vk-quests.is-player-terminal .q-terminal .q-objective:last-child {
  padding-bottom: 0!important
}

.vk-quests.is-player-terminal .q-terminal .q-objective.is-completed {
  color: #1aff80!important;
  opacity: .42!important
}

.vk-quests.is-player-terminal .q-terminal .q-objective.is-completed .q-square {
  background: currentColor
}

.vk-quests.is-player-terminal .q-terminal .q-objective-text {
  flex: 1 1 0;
  min-width: 0;
  white-space: normal!important;
  overflow-wrap: anywhere;
  word-break: normal;
  text-decoration: none!important
}

/* Bottom partial border */
.vk-quests.is-player-terminal .q-terminal .q-bottom-rule {
  position: relative;
  height: 8px;
  margin: 12px 0 0;
  border-bottom: 2px solid #1aff80
}

.vk-quests.is-player-terminal .q-terminal .q-bottom-rule::before,.vk-quests.is-player-terminal .q-terminal .q-bottom-rule::after {
  content: '';
  position: absolute;
  bottom: 0;
  height: 14px;
  width: 2px;
  background: #1aff80
}

.vk-quests.is-player-terminal .q-terminal .q-bottom-rule::before {
  left: 0
}

.vk-quests.is-player-terminal .q-terminal .q-bottom-rule::after {
  right: 0
}

.vk-quests.is-player-terminal .q-terminal .q-message {
  font: 400 11px/1.4 Arial,sans-serif!important;
  max-height: 44px;
  overflow: auto;
  padding: 5px 9px!important
}

.vk-quests.is-player-terminal .q-terminal [hidden] {
  display: none!important
}

.vk-quests.is-player-terminal .q-terminal .q-muted {
  color: #1aff80!important;
  opacity: .6;
  font: 400 14px/1.4 'Arial Narrow',Arial,sans-serif!important
}

.vk-quests.is-player-terminal>.fqr {
  margin-top: 18px!important
}

/* Narrow pane adjustments */
@media(max-width:520px) {
  .vk-quests.is-player-terminal>.q-terminal {
    padding: 18px 12px!important
  }

  .vk-quests.is-player-terminal .q-terminal .q-header {
    grid-template-columns: minmax(0,1fr) max-content!important;
    gap: 6px!important
  }

  .vk-quests.is-player-terminal .q-terminal .q-connection-wrap {
    gap: 3px;
    flex-wrap: wrap;
    max-width: 130px
  }

  .vk-quests.is-player-terminal .q-terminal input.q-server-input {
    width: 100px!important;
    flex: 1 1 50px!important
  }

  .vk-quests.is-player-terminal .q-terminal .q-data-label {
    padding-right: 5px;
    font-size: 12px!important
  }

  .vk-quests.is-player-terminal .q-terminal .q-server-label {
    gap: 4px
  }

  .vk-quests.is-player-terminal .q-terminal .q-layout {
    gap: 18px!important;
    padding: 0!important
  }

  .vk-quests.is-player-terminal .q-terminal :is(button.q-entry,.q-objective) {
    font-size: 14px!important
  }
}
.q-terminal {
    justify-self: center
  }
`.replaceAll(".vk-quests.is-player-terminal", qPlayerSelector);
qRoot.classList.add('is-player-terminal');
const qCached=qRead('publication',null);
let qPublication=qCached&&Array.isArray(qCached.quests)?qCached:{revision:0,publishedAt:null,quests:[]};
let qSelected=qRead('selected',qRead('tracked','')),qBusy=false,qRenderedSelection=null;
let qPlayerDisposed=false,qRafPending=false;
let qPollTimer=null;
let qPublicationSignature=JSON.stringify([qPublication.revision,qPublication.quests]);
qHeader.replaceChildren();qToolbar.remove();
const qLeftSegment=qNode('div','q-header-segment',undefined,qHeader);
qNode('div','q-data-label','DATA',qLeftSegment);
const qServerLabel=qNode('label','q-server-label','Server',qLeftSegment);
const qServerInput=qNode('input','q-server-input',undefined,qServerLabel);
qServerInput.type='text';qServerInput.value=qBase;qServerInput.placeholder='http://192.168.1.50:3000';
qServerInput.setAttribute('aria-label','Quest server address');
const qRightSegment=qNode('div','q-header-segment',undefined,qHeader);
const qConnectionWrap=qNode('div','q-connection-wrap',undefined,qRightSegment);
const qRefresh=qButton('Connect / Refresh',qConnectionWrap,()=>qRefreshPlayer(),'q-connect');
const qConnection=qNode('span','q-connection','Not connected',qConnectionWrap);qConnection.setAttribute('role','status');
qMessage.hidden=true;
qLayout.replaceChildren();
const qScrollStates=[];
function qScrollColumn(viewport,label,cls){
 const shell=qNode('div','q-scroll-shell '+cls,undefined,qLayout);
 const up=qButton('▴',shell,()=>qScroll(-1),'q-scroll-arrow');up.setAttribute('aria-label','Scroll '+label+' up');
 shell.appendChild(viewport);
 const down=qButton('▾',shell,()=>qScroll(1),'q-scroll-arrow');down.setAttribute('aria-label','Scroll '+label+' down');
 function qScroll(direction){viewport.scrollBy({top:direction*Math.max(80,viewport.clientHeight*.7),behavior:'auto'});qUpdateArrows();}
 viewport.addEventListener('scroll',qUpdateArrows,{passive:true});
 qScrollStates.push({viewport,up,down});
}
qScrollColumn(qList,'quests','q-quest-scroll');qScrollColumn(qDetails,'objectives','q-objective-scroll');
qDetails.setAttribute('role','region');
const qObjectiveGroup=qNode('div','q-objective-group',undefined,qDetails);
const qBottom=qNode('div','q-bottom-rule',undefined,qTerminal);qBottom.setAttribute('aria-hidden','true');
function qUpdateArrows(){
 for(const {viewport,up,down} of qScrollStates){
  const maximum=Math.max(0,viewport.scrollHeight-viewport.clientHeight);
  const atTop=maximum<=1||viewport.scrollTop<=1;
  const atBottom=maximum<=1||viewport.scrollTop>=maximum-1;
  if(up.disabled!==atTop)up.disabled=atTop;
  if(down.disabled!==atBottom)down.disabled=atBottom;
 }
}
function qScheduleArrows(){
 if(qRafPending||qPlayerDisposed)return;qRafPending=true;
 requestAnimationFrame(()=>{qRafPending=false;if(!qPlayerDisposed)qUpdateArrows();});
}
// Only the owning JS-Engine Component can end this panel's lifetime.
// Obsidian can temporarily detach and restore the SAME rendered element.
// Disconnection therefore pauses polling; it must never dispose the panel.
function qDisposePlayer() {
  if (qPlayerDisposed) return;
  qPlayerDisposed = true;
  clearInterval(qPollTimer);
  globalThis.removeEventListener?.('resize', qScheduleArrows);
}
if (typeof component !== 'undefined' && typeof component.register === 'function') {
  component.register(qDisposePlayer);
}
globalThis.addEventListener?.('resize', qScheduleArrows);

// Match the working Trade Menu: prevent editor/source-mode clicks without
// preventing normal text-field focus. Keep the connection button focus stable.
for (const eventName of ['pointerdown', 'mousedown']) {
  qRefresh.addEventListener(eventName, event => {
    if (event.button === 2) return;
    event.preventDefault();
    event.stopPropagation();
  }, true);
}
function qRemember(key,value){try{qWrite(key,value);}catch{qMessage.hidden=false;qStatus('Could not save local preferences.',true);}}
function qOrderedQuests(){return [...qPublication.quests.filter(q=>q.status==='active'),...qPublication.quests.filter(q=>q.status!=='active')];}
function qFocusSelected(){const button=[...qList.querySelectorAll('button')].find(b=>b.dataset.quest===qSelected);button?.focus();button?.scrollIntoView?.({block:'nearest'});}
function qChooseQuest(id,focus=false){qSelected=id;qRemember('selected',id);qRenderPlayer();if(focus)qFocusSelected();}
// Keep live DOM nodes stable across publication updates. Only changed values
// are written; newly revealed objectives are inserted beside existing rows.
const qQuestRows = new Map();
const qObjectiveRows = new Map();
const qEmptyList = qNode('p', 'q-muted', 'No quests available.');
const qEmptyObjectives = qNode('p', 'q-muted', 'Published quests will appear here.');
function qSetAttribute(node, name, value) {
  if (node.getAttribute(name) !== value) node.setAttribute(name, value);
}
function qReconcileChildren(parent, wanted) {
  const keep = new Set(wanted);
  for (const node of [...parent.children]) {
    if (!keep.has(node)) node.remove();
  }
  wanted.forEach((node, index) => {
    if (parent.children[index] !== node) {
      parent.insertBefore(node, parent.children[index] || null);
    }
  });
}
function qRenderPlayer() {
  if (qPlayerDisposed) return;
  const ordered = qOrderedQuests();
  if (!ordered.some(quest => quest.id === qSelected)) {
    qSelected = ordered[0]?.id || '';
    qRemember('selected', qSelected);
  }
  const previousTop = qList.scrollTop;
  const questIds = new Set();
  const questNodes = [];
  for (const quest of ordered) {
    questIds.add(quest.id);
    let entry = qQuestRows.get(quest.id);
    if (!entry) {
      const id = quest.id;
      const button = qButton('', null, () => qChooseQuest(id, true), 'q-entry');
      const square = qNode('span', 'q-square', '', button);
      square.setAttribute('aria-hidden', 'true');
      const title = qNode('span', 'q-entry-title', '', button);
      button.dataset.quest = id;
      entry = { button, title };
      qQuestRows.set(id, entry);
    }
    const completed = quest.status !== 'active';
    const className = 'q-entry' + (completed ? ' is-completed' : '');
    if (entry.button.className !== className) entry.button.className = className;
    if (entry.title.textContent !== quest.title) entry.title.textContent = quest.title;
    qSetAttribute(entry.button, 'aria-current', String(quest.id === qSelected));
    qSetAttribute(entry.button, 'aria-label', quest.title + (completed ? ' (completed)' : '') + (quest.id === qSelected ? ' (selected)' : ''));
    const tabIndex = quest.id === qSelected ? 0 : -1;
    if (entry.button.tabIndex !== tabIndex) entry.button.tabIndex = tabIndex;
    questNodes.push(entry.button);
  }
  for (const id of qQuestRows.keys()) if (!questIds.has(id)) qQuestRows.delete(id);
  qReconcileChildren(qList, questNodes.length ? questNodes : [qEmptyList]);
  if (qList.scrollTop !== previousTop) qList.scrollTop = previousTop;

  const quest = ordered.find(item => item.id === qSelected);
  qSetAttribute(qDetails, 'aria-label', quest ? quest.title + ' — objectives' : 'Selected quest objectives');
  const objectiveIds = new Set();
  const objectiveNodes = [];
  const objectives=quest?.objectives||[];
  const orderedObjectives=[...objectives.filter(o=>o.status==='active'),...objectives.filter(o=>o.status!=='active')];
  for (const objective of orderedObjectives) {
    const key = quest.id + ':' + objective.id;
    objectiveIds.add(key);
    let entry = qObjectiveRows.get(key);
    if (!entry) {
      const row = qNode('div', 'q-objective');
      const square = qNode('span', 'q-square', '', row);
      square.setAttribute('aria-hidden', 'true');
      const label = qNode('span', 'q-objective-text', '', row);
      entry = { row, label };
      qObjectiveRows.set(key, entry);
    }
    const className = 'q-objective' + (objective.status !== 'active' ? ' is-completed' : '');
    const text = (objective.optional ? '(Optional) ' : '') + objective.text;
    if (entry.row.className !== className) entry.row.className = className;
    if (entry.label.textContent !== text) entry.label.textContent = text;
    qSetAttribute(entry.row, 'aria-label', objective.status + ': ' + text);
    objectiveNodes.push(entry.row);
  }
  for (const id of qObjectiveRows.keys()) if (!objectiveIds.has(id)) qObjectiveRows.delete(id);
  if (!objectiveNodes.length) {
    const message = quest ? quest.description || 'No objectives revealed yet.' : 'Published quests will appear here.';
    if (qEmptyObjectives.textContent !== message) qEmptyObjectives.textContent = message;
    objectiveNodes.push(qEmptyObjectives);
  }
  qReconcileChildren(qObjectiveGroup, objectiveNodes);
  if (qRenderedSelection !== qSelected) {
    qDetails.scrollTop = 0;
    qRenderedSelection = qSelected;
  }
  qScheduleArrows();
}
qList.addEventListener('keydown',event=>{
 if(!['ArrowUp','ArrowDown','Home','End'].includes(event.key))return;
 event.preventDefault();event.stopPropagation();const quests=qOrderedQuests();if(!quests.length)return;
 let index=Math.max(0,quests.findIndex(q=>q.id===qSelected));
 if(event.key==='ArrowUp')index=Math.max(0,index-1);if(event.key==='ArrowDown')index=Math.min(quests.length-1,index+1);
 if(event.key==='Home')index=0;if(event.key==='End')index=quests.length-1;
 qChooseQuest(quests[index].id,true);
});
qServerInput.addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();event.stopPropagation();void qRefreshPlayer();}});
async function qRefreshPlayer({quiet=false}={}){
 if(qPlayerDisposed)return;
 if(qBusy)return;
 if(!quiet){try{
  const url=new URL(qServerInput.value.trim()||'http://localhost:3000');if(!['http:','https:'].includes(url.protocol))throw Error('Use an HTTP or HTTPS server address.');
  const base=url.href.replace(/\/+$/,'');if(localStorage.getItem(qServerKey)!==base)localStorage.setItem(qServerKey,base);if(qServerInput.value!==base)qServerInput.value=base;
  if(base!==qBase){qBase=base;qPrefix='vaultkit_quests:'+base+':';const cached=qRead('publication',null);qPublication=cached&&Array.isArray(cached.quests)?cached:{revision:0,publishedAt:null,quests:[]};qSelected=qRead('selected',qRead('tracked',''));qPublicationSignature=JSON.stringify([qPublication.revision,qPublication.quests]);qRenderPlayer();}
 }catch(error){qMessage.hidden=false;qStatus(error.message,true);return;}}
 qBusy=true;
 if(!quiet){qConnection.textContent='Connecting…';qConnection.classList.toggle('is-error',false);}
 try{
  const data=await qRequest('/api/quests');if(qPlayerDisposed)return;if(!Number.isSafeInteger(data.revision)||!Array.isArray(data.quests))throw Error('Invalid quest response.');
  qPublication={revision:data.revision,publishedAt:data.publishedAt,quests:data.quests,receivedAt:new Date().toISOString()};
  const signature=JSON.stringify([data.revision,data.quests]);
  if(!qMessage.hidden)qMessage.hidden=true;
  if(!quiet||signature!==qPublicationSignature){try{qWrite('publication',qPublication);}catch{if(!quiet){qMessage.hidden=false;qStatus('Connected, but the offline copy could not be saved.',true);}}}
  if(qConnection.textContent!=='Connected')qConnection.textContent='Connected';
  qConnection.classList.toggle('is-error',false);
  qConnection.title='Last checked: '+qDate(qPublication.receivedAt)+' · Last published: '+qDate(qPublication.publishedAt);
  if(signature!==qPublicationSignature){qPublicationSignature=signature;qRenderPlayer();}
  else qScheduleArrows();
 }catch(error){if(!quiet){qConnection.textContent='Offline · Saved quests';qConnection.classList.toggle('is-error',true);qMessage.hidden=false;qStatus('Refresh unavailable: '+error.message+'\nShowing saved quests. Last checked: '+qDate(qPublication.receivedAt),true);}}
 finally{
  qBusy=false;
 }
}
qPollTimer=setInterval(()=>{
 if(qPlayerDisposed)return;
 if(!qRoot.isConnected)return;
 if(!qBusy)void qRefreshPlayer({quiet:true});
},3000);
qRenderPlayer();void qRefreshPlayer();

// Reference cards below the quest terminal.
const references = await (async function(){
const referenceData = {
  "groups": [
    {
      "title": "Turn & Actions",
      "description": "Turn structure, major and minor actions, combat AP",
      "topics": [
        "Action Rules",
        "Assist",
        "Attack",
        "Command an NPC",
        "Defend",
        "First Aid",
        "Pass",
        "Rally",
        "Ready",
        "Sprint",
        "Test",
        "Aim",
        "Draw Item",
        "Interact",
        "Move",
        "Take Chem",
        "Action Points in Combat Encounters"
      ]
    },
    {
      "title": "Combat Situations",
      "description": "Prone movement, incoming attacks and sneak attacks",
      "topics": [
        "Prone",
        "Sneak Attacks"
      ]
    },
    {
      "title": "Damage & Recovery",
      "description": "Injuries, dying, stabilization, radiation and repairs",
      "topics": [
        "Critical Hits and Injuries",
        "Dying",
        "Stabilizing The Dying",
        "First Aid",
        "Radiation Damage",
        "Recovering from Rads",
        "Healing Robots",
        "Well Rested"
      ]
    },
    {
      "title": "Tests & Resources",
      "description": "Action Points, bonus dice, Luck and opposed tests",
      "topics": [
        "Action Points",
        "Luck",
        "Opposed Tests"
      ]
    }
  ],
  "topics": {
    "Action Rules": {
      "name": "Action Rules",
      "label": "Reference",
      "text": "**On your turn in combat, you can take one major action and one minor action.** You can take one additional minor action by spending 1 Action Point, and you can take one additional major action by spending 2 Action Points, but the difficulty of any test attempted on that second major action is increased by 1. You may take your actions in any order you wish during your turn.\n\n**You cannot take more than two minor actions and two major actions on your turn by any means. You cannot take more than one movement action per turn.**"
    },
    "Assist": {
      "name": "Assist",
      "label": "Major action",
      "text": "You assist another character with their next test. When the character you are assisting takes their turn and attempts their task, you provide assistance (p.16 Core Rulebook). If you have not yet acted this round, you may give up your turn later in the round to assist an ally when they attempt a skill test."
    },
    "Attack": {
      "name": "Attack",
      "label": "Major action",
      "text": "Make a melee or ranged attack, as described in Making an Attack, p.27 Core Rulebook."
    },
    "Command an NPC": {
      "name": "Command an NPC",
      "label": "Major action",
      "text": "If you have an allied NPC under your command, choose a single major action for them to take. If the action requires a test, then you automatically assist using your **CHA + Speech** (if the NPC is a person), **CHA + Survival** (if the NPC is an animal), or **INT + Science**(if the NPC is a robot)."
    },
    "Defend": {
      "name": "Defend",
      "label": "Major action",
      "text": "You focus on protecting yourself. Make an **AGI + Athletics** test with a difficulty equal to your current Defense. If you succeed, add +1 to your Defense. For 2 AP, add an extra +1 to your Defense."
    },
    "First Aid": {
      "name": "First Aid",
      "label": "Major action",
      "text": "You try to quickly patch the wounds of yourself or an ally. Make an **INT + Medicine** test, with a difficulty equal to the number of injuries the patient has, and increase the difficulty by 1 if you are trying to perform first aid on yourself. If you succeed, you can either:\n- Heal HP equal to your Medicine rating (p.34 Core Rulebook),\n- Treat one injury the patient is suffering from \n(p.34 Core Rulebook), or \n- Stabilize a dying patient (p.34 Core Rulebook)"
    },
    "Pass": {
      "name": "Pass",
      "label": "Major action",
      "text": "You choose not to do anything."
    },
    "Rally": {
      "name": "Rally",
      "label": "Major action",
      "text": "You grit your teeth, catch your breath, and prepare yourself. Make an **END + Survival** test with a difficulty of 0, and save any Action Points you generate. The GM may allow you to use a different ATT + skill for this action depending on how you describe it, such as **CHA + Speech** to inspire your allies."
    },
    "Ready": {
      "name": "Ready",
      "label": "Major action",
      "text": "Describe a situation you expect to occur, and choose a major action you will perform when it does. If that action occurs before the start of your next turn, you may perform that major action immediately, interrupting other characters’ actions as necessary. If more than one character has readied an action for the same situation, their readied actions occur in initiative order."
    },
    "Sprint": {
      "name": "Sprint",
      "label": "Major action",
      "text": "Movement action. You move up to two zones, to anywhere within Long range."
    },
    "Test": {
      "name": "Test",
      "label": "Major action",
      "text": "Perform a skill test for an action not covered by the other actions, with the gamemaster’s permission."
    },
    "Aim": {
      "name": "Aim",
      "label": "Minor action",
      "text": "Re-roll 1d20 on the first attack roll you make this turn"
    },
    "Draw Item": {
      "name": "Draw Item",
      "label": "Minor action",
      "text": "Draw one item carried on your person or pick up an object or item within your reach. You may put an item away as part of this action."
    },
    "Interact": {
      "name": "Interact",
      "label": "Minor action",
      "text": "Interact with your equipment or environment in a simple way, like opening a door, or pushing a button."
    },
    "Move": {
      "name": "Move",
      "label": "Minor action",
      "text": "Movement action. Move up to one zone, to any position within Medium range. Alternatively, stand up from a prone position."
    },
    "Take Chem": {
      "name": "Take Chem",
      "label": "Minor action",
      "text": "Administer a dose of a chem that you are holding, targeting yourself or a willing character within your reach. If you’re not holding the chem, then you need to draw it first."
    },
    "Action Points in Combat Encounters": {
      "name": "Action Points in Combat Encounters",
      "label": "Reference",
      "text": "During combat, you can spend Action Points to do the following:\n- **Buy d20s (1–6 AP):** Buy bonus d20s for a test, before the dice pool is rolled, but after the GM sets the difficulty. The cost increases for each die purchased: the first d20 costs 1 AP, the second costs 2, and the third costs 3. No more than three bonus d20s may be rolled for a single test, including any d20s from perks or traits.\n- **Obtain Information (1 AP):** Ask the gamemaster a \nsingle question about the current situation, based on your \ntest. The GM will answer truthfully, but the answer might \nnot be complete.\n- **Take Additional Minor Action (1 AP):** Take 1 additional minor action in your turn. You can only take a total \nof 2 minor actions in a single round.\n- **Take Additional Major Action (2 AP):** Take one additional major action on your turn. Any skill test you must attempt is increased in difficulty by +1. You can only take a total of two major actions in a single round.\n- **Add Extra Damage (1-3 AP):** On a successful melee attack or thrown weapon attack you can spend AP to add 1 D6 per AP spent, up to a maximum of +3 D6 for 3 AP."
    },
    "Prone": {
      "name": "Prone",
      "label": "Reference",
      "text": "You may be knocked prone by attacks, hazards, or complications. You may also drop prone willingly, at the end of any movement action you perform. Being prone has the following effects:\n- When you’re prone, you crawl. The Move action becomes a major action, rather than a minor action, and you cannot take the Sprint action.\n- While you’re prone, enemies at Medium range or further add +1 to the difficulty of any attacks against you.\n- While you’re prone, enemies at Close range reduce the difficulty of attacks (including melee attacks) by 1, to a minimum of 0.\n- While you’re prone, you can re-roll any cover D6 you have"
    },
    "Sneak Attacks": {
      "name": "Sneak Attacks",
      "label": "Reference",
      "text": "If the enemy is unaware of you before you attack, the difficulty to attack them is reduced by 1 (to a minimum of 0), and your attack gains the Vicious damage effect if it did not have it already, or the damage is increased by +2D6 if it already has the [[Vicious]] damage effect.\n\nIf the difficulty to hit your opponent is 0, you do not need to roll to hit them, but you may still decide to do so, generating Action Points and complications as normal."
    },
    "Critical Hits and Injuries": {
      "name": "Critical Hits and Injuries",
      "label": "Reference",
      "text": "A **critical hit** occurs whenever a character suffers **five or more damage in one hit** (after reductions from Damage Resistance). A critical hit imposes an injury on the character, which confers a penalty depending on the location hit.\n\n- **Arm:** You drop any object held in that hand, and the arm is broken or otherwise unable to move. You cannot perform any actions using that arm—by itself or alongside your other arm.\n- **Leg:** You immediately fall prone as your leg gives out under your weight. You can no longer take the [[Sprint]] action, and the [[Move]] action is now a major action for you.\n- **Torso:** You begin bleeding heavily. At the end of each of your subsequent turns, you suffer 2 D6 physical damage, ignoring all your Damage Resistances.\n- **Head:** You are momentarily dazed and lose your normal actions in your next turn (though you may spend AP for extra actions as normal). Further, you cannot see clearly, and increase the difficulty of all tests which rely on vision by +2.\n\nThese effects last until the injury has received medical attention (see p.34 Core Rulebook)."
    },
    "Dying": {
      "name": "Dying",
      "label": "Reference",
      "text": "When your character is reduced to 0 HP, they suffer an injury to the location struck, and then fall prone and start **dying**. If they suffer a critical hit and are reduced to 0 HP, they suffer two injuries: one for the critical hit, and one for being reduced to 0 HP.\n\nWhile they are dying, they are unconscious, cannot recover HP from the [[First Aid]] action, and cannot take any actions. Furthermore, at the start of each of your turns while they’re dying, you must attempt an **END +** **Survival** test, with a difficulty equal to the number of injuries they have, and a complication range of 19-20. If you pass this test, they remain alive, but are still dying. If you fail, they die.\n\nIf they suffer any damage while dying, they immediately gain one additional injury, in addition to any injury caused by another critical hit."
    },
    "Stabilizing The Dying": {
      "name": "Stabilizing The Dying",
      "label": "Reference",
      "text": "Using the First Aid action, you can attempt to stabilize a dying character. This requires an **INT + Medicine** test with a difficulty equal to the number of injuries the patient has. Passing the test restores the character to 1 HP and they are no longer dying, and their player no longer has to attempt **END + Survival** tests to avoid death. The character remains unconscious and unable to take actions. \n\nIf radiation damage has reduced their maximum health points to 0, they cannot be stabilized until their maximum health points are above 0, by healing the radiation damage.\n\nIf you stabilize the patient, you can spend AP to heal additional health points. You can heal 1 HP for every AP spent. You may also spend 1 AP after stabilizing a character to wake them from unconsciousness, allowing them to continue to act."
    },
    "Radiation Damage": {
      "name": "Radiation Damage",
      "label": "Reference",
      "text": "Radiation damage is applied differently than other damage types. Each point of radiation damage, after reduction for the location’s radiation DR, reduces a character’s **maximum health points**, rather than their current health points. If a character’s health point maximum is reduced below their current health point total, then their current HP are reduced as well.\n\nRadiation damage is only reduced by a target’s radiation Damage Resistance, according to the location hit. If the radiation would affect the whole body, like an environmental effect, then use the character or creature’s **lowest** locational radiation DR.\n\nIn all cases, where a character would suffer radiation damage and another type of damage at the same time, resolve the radiation damage after any other types of damage.\n\n***Example:** Piper is attacked by a glowing feral ghoul, taking 3 D6 radiation damage. The GM rolls their D6 and totals 4 damage with an Effect, inflicting 4 physical damage and 1 radiation damage. Piper has 2 physical resistance, so she reduces her current health points by 2. Then, she reduces her maximum health points by 1 because of the radiation damage.*\n\n\n### IRRADIATED FOOD AND DRINK \nSome items of food and drink are Irradiated, contaminated with the radiation which is all-pervasive in the wastelands. When you consume irradiated food or drink, roll 1 D6. If you roll an Effect, you suffer 1 Radiation damage, which ignores any resistance from equipment or armor."
    },
    "Recovering from Rads": {
      "name": "Recovering from Rads",
      "label": "Reference",
      "text": "Because radiation damage reduces maximum health points, it doesn’t heal in the same way that most damage does—the effects of radiation damage don’t heal naturally at all. \n\nRadiation damage can only be removed by administering [[RadAway]], or other chems or consumables that remove radiation damage. When you heal HP and remove radiation damage at the same time, remove the radiation damage first, and then resolve the HP recovery."
    },
    "Healing Robots": {
      "name": "Healing Robots",
      "label": "Reference",
      "text": "Robots and other machines cannot recover from injuries naturally, and they require maintenance to restore damage.\n\nAttempting the [[First Aid]] action on a robot, a suit of power armor, or other large machine (like a vehicle) requires an **INT + Repair** test, with a difficulty of 2. This increases by +1 for each injury the machine has suffered. Passing the test restores health points equal to your Repair rating, treats an injury, or stabilizes a dying machine. Machines cannot use chems, though a repair kit functions for machines as Stimpaks do for living characters.\n\nMachines cannot heal through eating, drinking, rest, or medical attention. Outside of combat, an hour’s work on a damaged machine restores HP equal to twice the repairer’s **Repair** skill rating."
    },
    "Well Rested": {
      "name": "Well Rested",
      "label": "Reference",
      "text": "Max HP increased by +2 until you next sleep"
    },
    "Action Points": {
      "name": "Action Points",
      "label": "Reference",
      "text": "When you check your successes against the task difficulty, each success you generate above the difficulty becomes an Action Point. For example, if the task’s difficulty is 2, and you generate 3 successes, the extra success becomes 1 Action Point.\n\nAction Points can be used to take additional actions, improve the outcome of a test, reduce the time it takes, learn more about a situation, or buy more d20s in future tests.\n\nYou can spend Action Points to do the following:\n\n**Buy d20s (1–6 AP):** Buy bonus d20s for a test, before the dice pool is rolled, but after the GM sets the difficulty. The cost increases for each die purchased: the first d20 costs 1 AP, the second costs 2, and the third costs 3. No more than three bonus d20s may be rolled for a single test, including any d20s from perks or traits.\n\n**Obtain Information (1 AP):** Ask the gamemaster a single question about the current situation, based on your test. The GM will answer truthfully, but the answer might not be complete.\n\n**Reduce Time (2 AP):** AP from a successful test can allow the test to take less time to complete, when time is important. Spending 2 AP halves the amount of time a test takes to attempt. In combat, you can spend Action Points to do the following:\n\n**Take Additional Minor Action (1 AP):** Take 1 additional minor action in your turn. You can only take a total of 2 minor actions in a single round.\n\n **Take Additional Major Action (2 AP):** Take one additional major action on your turn. Any skill test you must attempt is increased in difficulty by +1. You can only take a total of two major actions in a single round.\n\n **Add Extra Damage (1-3 AP):** On a successful melee attack or thrown weapon attack you can spend AP to add 1 D6 per AP spent, up to a maximum of +3 D6 for 3 AP.\n\n| Dicepool | Bonus D20s | AP Cost |\n| -------- | ---------- | ------- |\n| 2d20     | -          | 0       |\n| 3d20     | +1d20      | 1       |\n| 4d20     | +2d20      | 3       |\n| 5d20     | +3d20      | 6       |\n\nYou spend Action Points either before or after you roll dice, and each option describes when you can spend Action Points to take advantage of its effect. You buy extra d20s for a test before you roll, while you spend Action Points after a test to obtain information, reduce the time, improve the quality of the success, or take an additional action."
    },
    "Luck": {
      "name": "Luck",
      "label": "Reference",
      "text": "| Luck Spend       | Description                                           |\n| ---------------- | ----------------------------------------------------- |\n| Luck of the Draw | Add a detail to a scene                               |\n| Stacked Deck     | Use your LCK attribute for a skill test               |\n| Lucky Timing     | Interrupt the normal turn order to take your turn now |\n| Miss Fortune     |    Re-roll 1d20 or 3D6 per Luck point spent                                                   |\n\n\t\n##### Trinkets\n>Personal trinkets also allow your character to regain Luck points. Once per quest, outside of combat, your character can spend a few moments looking at the trinket, thinking about what it means to them. When you do, you regain 1 Luck point. See Personal Trinkets, p.80 for more details."
    },
    "Opposed Tests": {
      "name": "Opposed Tests",
      "label": "Reference",
      "text": "Sometimes you’ll face situations that are not difficult because of the task itself, but because of an opposing force trying to prevent your success. In these cases, you and the opposing player (normally the GM) will both roll a dice pool and compare results to see who wins.\n\nWhen another character opposes you in a test, their player rolls their d20 dice pool, after buying any extra d20s, and the number of successes they generate becomes the difficulty of your test. Then, you attempt your test with your opponent’s number of successes as your difficulty. If you equal or beat your opponent’s number of successes, you win the opposed test, and any extra successes become Action Points. If you do not generate enough successes to meet the difficulty, you fail, and your opponent could generate AP.\n\n***Example: Paladin Danse is grappling a deathclaw, holding it back from advancing on his squad. The GM decides this is an opposed test and rolls a test for the deathclaw. Rolling 2d20, the GM scores 3 successes, meaning Danse’s test will be difficulty 3. Danse has a target number of 8, so his player decides to buy two more d20s with the Action Points in the pool, to ensure he gets the successes he needs and rolls the pool of 4d20s. They roll a 1, 5, 6, and 18, which generates 4 successes! Danse holds his ground, and banks 1 AP for the extra success. Had he rolled a 10 instead of a 1, he would have failed by one success instead, and the GM would have gained one AP for the deathclaw.***\n\n**Increased Difficulties in Opposed Tests**\nIn an ordinary opposed test, it’s assumed the only real source of difficulty is the other character. However, if something increases the difficulty of your test, then your opponent adds that increase to their successes total instead. If something would decrease the difficulty of your test, then your opponent reduces their total successes by that amount instead. So, if your opponent is trying to sneak up on you, and it’s dark (increasing the difficulty of your **PER + Survival** test by 1), then your opponent adds +1 success to their total instead.\n\n**Action Points in Opposed Tests**\nIn an Opposed Test, the opposing characters spends AP first and then rolls. The active character then may spend AP to add dice to their pool (if they wish) and then rolls.\n\nIf two player characters are making an opposed test, then both players must generate AP for the GM in order to buy additional d20s (see p.18 Core Rulebook). The group pool is for team players!\n\nWhen you succeed in an opposed test, you generate Action Points by comparing your result to your opponent’s. When you are rolling against an established difficulty, any excess successes generate AP as normal. When you are the one to roll first, establishing a difficulty for your opponent, you generate 1 AP for each success less than your number of successes."
    }
  }
};
// Fallout 2d20 quick references — self-contained JS-Engine panel.
const { MarkdownRenderer, Component } = engine.getObsidianModule();
const root = document.createElement('section');
root.className = 'fqr';
const qrRenderComponent = new Component();
qrRenderComponent.load();
const sourcePath = typeof engine.context?.file?.path === 'string'
  ? engine.context.file.path : app.workspace.getActiveFile()?.path || '';
const el = (tag, cls, text, parent) => {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text !== undefined) node.textContent = text;
  if (parent) parent.appendChild(node);
  return node;
};
const style = el('style', '', undefined, root);
style.textContent = `
.fqr {
  --qr-gold: #ffc200;
  --qr-panel: #102434;
  --qr-border: #365168;
  --qr-muted: #abc0ce;
  color: var(--text-normal,#e2e8ef);
  font-family: var(--font-interface);
  position: relative
}

.fqr * {
  box-sizing: border-box
}

.fqr .fqr-heading {
  margin: 0 0 5px;
  color: var(--qr-gold);
  font-size: 1.2em;
  font-weight: 650
}

.fqr .fqr-caption {
  color: var(--qr-muted);
  font-size: .85em;
  margin: 0 0 16px
}

.fqr .fqr-grid {
  display: grid;
  grid-template-columns: repeat(2,minmax(0,1fr));
  gap: 12px
}

.fqr button.fqr-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  white-space: normal;
  height: auto;
  min-height: 112px;
  padding: 18px;
  background: linear-gradient(135deg,#152e40,#0c1a27);
  border: 1px solid var(--qr-border);
  border-radius: 10px;
  box-shadow: none;
  color: inherit;
  cursor: pointer
}

.fqr button.fqr-card:hover {
  border-color: var(--qr-gold);
  background: #193447
}

.fqr .fqr-card-title {
  color: var(--qr-gold);
  font-size: 1.08em;
  font-weight: 650;
  margin-bottom: 7px
}

.fqr .fqr-card-description {
  color: var(--qr-muted);
  font-size: .85em;
  line-height: 1.5
}

.fqr .fqr-card-footer {
  font-size: .75em;
  color: var(--qr-muted);
  margin-top: auto;
  padding-top: 12px
}

.fqr .fqr-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0,0,0,.72);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 28px
}

.fqr .fqr-dialog {
  width: min(1080px,100%);
  height: min(760px,88vh);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #0e1d2a;
  border: 1px solid var(--qr-border);
  border-radius: 12px;
  box-shadow: 0 24px 90px #0009
}

.fqr .fqr-top {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  padding: 18px 22px;
  border-bottom: 1px solid var(--qr-border)
}

.fqr .fqr-title {
  font-size: 1.1em;
  color: var(--qr-gold);
  font-weight: 650;
  margin: 0
}

.fqr button.fqr-close {
  background: transparent;
  border: 1px solid var(--qr-border);
  box-shadow: none;
  color: var(--qr-muted);
  cursor: pointer;
  padding: 5px 12px;
  height: auto
}

.fqr .fqr-controls {
  padding: 12px 18px;
  border-bottom: 1px solid var(--qr-border)
}

.fqr input.fqr-search {
  display: block;
  width: 100%;
  background: #091722;
  border: 1px solid var(--qr-border);
  color: #e2e8ef;
  box-shadow: none
}

.fqr .fqr-body {
  display: grid;
  grid-template-columns: 240px minmax(0,1fr);
  flex: 1;
  min-height: 0
}

.fqr .fqr-nav {
  overflow: auto;
  padding: 12px;
  border-right: 1px solid var(--qr-border)
}

.fqr button.fqr-topic {
  display: block;
  width: 100%;
  height: auto;
  white-space: normal;
  text-align: left;
  padding: 9px 10px;
  margin-bottom: 4px;
  border: 1px solid transparent;
  border-radius: 6px;
  box-shadow: none;
  background: transparent;
  color: #c9d6df;
  cursor: pointer;
  line-height: 1.35
}

.fqr button.fqr-topic:hover {
  background: #193447
}

.fqr button.fqr-topic[aria-current=true] {
  background: #20384a;
  border-color: #527c96;
  color: var(--qr-gold)
}

.fqr .fqr-topic-type {
  display: block;
  font-size: .72em;
  color: var(--qr-muted);
  margin-top: 3px
}

.fqr .fqr-content {
  overflow: auto;
  padding: 24px 28px;
  line-height: 1.65;
  user-select: text;
  color: #e2e8ef
}

.fqr .fqr-article-title {
  color: var(--qr-gold);
  font-size: 1.3em;
  margin: 0 0 4px
}

.fqr .fqr-badge {
  display: inline-block;
  font-size: .75em;
  color: var(--qr-muted);
  border: 1px solid var(--qr-border);
  border-radius: 5px;
  padding: 1px 8px;
  margin-bottom: 14px
}

.fqr .fqr-markdown p {
  margin: 0 0 13px
}

.fqr .fqr-markdown li {
  margin-bottom: 8px
}

.fqr .fqr-markdown strong {
  color: #fff0bc
}

.fqr .fqr-markdown a {
  color: var(--qr-gold)
}

.fqr .fqr-markdown :is(h3,h4,h5) {
  color: var(--qr-gold);
  margin: 20px 0 10px
}

.fqr .fqr-markdown table {
  width: 100%;
  border-collapse: collapse;
  font-size: .9em
}

.fqr .fqr-markdown :is(th,td) {
  border: 1px solid var(--qr-border);
  padding: 8px 10px;
  text-align: left
}

.fqr .fqr-markdown th {
  background: #1c3548
}

.fqr .fqr-markdown tr:nth-child(even) {
  background: #122736
}

.fqr .fqr-markdown blockquote {
  border-left: 3px solid #527c96;
  margin: 12px 0;
  padding: 8px 14px;
  background: #122736
}

.fqr .fqr-empty {
  color: var(--qr-muted);
  padding: 8px;
  font-size: .9em
}

.fqr :is(button,input,a):focus-visible {
  outline: 2px solid var(--qr-gold);
  outline-offset: 2px
}

@media(max-width:700px) {
  .fqr .fqr-body {
    grid-template-columns: 180px minmax(0,1fr)
  }

  .fqr .fqr-content {
    padding: 18px
  }

  .fqr .fqr-overlay {
    padding: 12px
  }
}
`;
el('h2', 'fqr-heading', 'FIELD REFERENCE', root);
el('p', 'fqr-caption', 'Actions, combat situations, recovery and resources', root);
const grid = el('div', 'fqr-grid', undefined, root);
let closeCurrent = null;
let disposed = false;

function openGroup(group, opener) {
  if (disposed) return;
  closeCurrent?.();
  const overlay = el('div', 'fqr-overlay', undefined, root);
  const dialog = el('div', 'fqr-dialog', undefined, overlay);
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-modal', 'true');
  dialog.setAttribute('aria-label', group.title);
  const top = el('div', 'fqr-top', undefined, dialog);
  el('h2', 'fqr-title', group.title, top);
  const closeButton = el('button', 'fqr-close', 'Close', top);
  closeButton.type = 'button';
  const controls = el('div', 'fqr-controls', undefined, dialog);
  const search = el('input', 'fqr-search', undefined, controls);
  search.type = 'search';
  search.placeholder = 'Search all reference topics…';
  search.setAttribute('aria-label', 'Search all reference topics');
  const body = el('div', 'fqr-body', undefined, dialog);
  const nav = el('nav', 'fqr-nav', undefined, body);
  nav.setAttribute('aria-label', 'Reference topics');
  const content = el('article', 'fqr-content', undefined, body);
  let activeName = group.topics[0];
  let renderId = 0;
  let closed = false;

  const close = () => {
    if (closed) return;
    closed = true;
    renderId++;
    overlay.remove();
    if (closeCurrent === close) closeCurrent = null;
    if (opener.isConnected) opener.focus();
  };
  closeCurrent = close;
  closeButton.addEventListener('click', close);
  overlay.addEventListener('click', event => { if (event.target === overlay) close(); });
  overlay.addEventListener('keydown', event => {
    if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); close(); }
    if (event.key === 'Tab') {
      const nodes = [...dialog.querySelectorAll('button,input,a[href],[tabindex="0"]')].filter(n => !n.disabled && n.getClientRects().length);
      const first = nodes[0], last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }
  });

  async function showTopic(name) {
    activeName = name;
    const token = ++renderId;
    const topic = referenceData.topics[name];
    content.replaceChildren();
    content.scrollTop = 0;
    el('h3', 'fqr-article-title', topic.name, content);
    el('div', 'fqr-badge', topic.label, content);
    const markdown = el('div', 'fqr-markdown', undefined, content);
    for (const button of nav.querySelectorAll('button')) {
      button.setAttribute('aria-current', String(button.dataset.topic === name));
    }
    try {
      await MarkdownRenderer.render(app, topic.text, markdown, sourcePath, qrRenderComponent);
    } catch (error) {
      if (!closed && renderId === token) markdown.textContent = topic.text;
      console.error('Fallout reference: Markdown rendering failed', error);
    }
  }

  function filterTopics() {
    const query = search.value.trim().toLocaleLowerCase();
    const words = query.split(/\s+/).filter(Boolean);
    const names = query ? Object.keys(referenceData.topics).filter(name => {
      const topic = referenceData.topics[name];
      const haystack = `${name} ${topic.label} ${topic.text}`.toLocaleLowerCase();
      return words.every(word => haystack.includes(word));
    }) : group.topics;
    nav.replaceChildren();
    if (!names.length) {
      renderId++;
      el('p', 'fqr-empty', 'No matching topics.', nav);
      content.replaceChildren();
      el('p', 'fqr-empty', 'Try a different term, such as injury, AP, prone or robot.', content);
      return;
    }
    for (const name of names) {
      const topic = referenceData.topics[name];
      const button = el('button', 'fqr-topic', name, nav);
      button.type = 'button';
      button.dataset.topic = name;
      button.setAttribute('aria-current', String(activeName === name));
      el('span', 'fqr-topic-type', topic.label, button);
      button.addEventListener('click', () => showTopic(name));
    }
    showTopic(names.includes(activeName) ? activeName : names[0]);
  }
  search.addEventListener('input', filterTopics);
  filterTopics();
  search.focus();
}

for (const group of referenceData.groups) {
  const card = el('button', 'fqr-card', undefined, grid);
  card.type = 'button';
  el('span', 'fqr-card-title', group.title, card);
  el('span', 'fqr-card-description', group.description, card);
  el('span', 'fqr-card-footer', `${group.topics.length} topics · Open reference →`, card);
  card.addEventListener('click', () => openGroup(group, card));
}

// Temporary DOM removal is not the end of the note's lifetime: Obsidian can
// restore this same element. Keep its handlers and Markdown component alive
// until JS-Engine actually unloads the owning Component.
if (typeof component !== 'undefined' && typeof component.register === 'function') {
  component.register(() => {
    if (disposed) return;
    disposed = true;
    closeCurrent?.();
    qrRenderComponent.unload();
  });
}
return root;

})();
qRoot.appendChild(references);
return qRoot;
})();
```
