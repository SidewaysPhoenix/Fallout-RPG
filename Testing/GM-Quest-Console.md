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

qRoot.classList.add('is-gm-control');
const qGmSelector='#vk-quest-gm-'+crypto.randomUUID();
qRoot.id=qGmSelector.slice(1);
qStyle.textContent=qStyle.textContent.replaceAll('.vk-quests.is-gm-control',qGmSelector);
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
const qDeletedQuestRecovery=qRead('gm-deleted-quests',{});
const qId=prefix=>prefix+'-'+(globalThis.crypto?.randomUUID?.()||Date.now().toString(36)+'-'+Math.random().toString(36).slice(2));
// Native dialog uses the top layer, so the editor's clipping cannot hide it.
const qPreview=qNode('dialog','q-preview-dialog',undefined,qRoot);
let qPreviewOpener=null;
qPreview.addEventListener('close',()=>{if(qPreviewOpener?.isConnected)qPreviewOpener.focus();});
qPreview.addEventListener('keydown',event=>{
  event.stopPropagation();
  if(event.key==='Escape'){event.preventDefault();qPreview.close();}
});
qPreview.addEventListener('click',event=>{if(event.target===qPreview){
  const bounds=qPreview.getBoundingClientRect();
  if(event.clientX<bounds.left||event.clientX>bounds.right||event.clientY<bounds.top||event.clientY>bounds.bottom)qPreview.close();
}});
const qPlanningOpen=new Set();
function qSaveDraft() {
  qDraftChanged=true;
  qDraftPending=true;
  qDraftEditSerial++;
  try{qWrite('gm-draft',qDraft);qWrite('gm-draft-pending',true);qStatus('Draft saved locally · waiting to save to server. Players see only published content.');}
  catch(error){qStatus('Could not save this draft locally: '+error.message,true);}
  qQueueDraftSave();
}
function qPublicDraft() {
  return qDraft.quests.filter(q=>q.visible===true).map(q=>({
    id:q.id,title:q.title,kind:q.kind,status:q.status,visible:true,
    objectives:q.objectives.filter(o=>o.visible===true).map(o=>({id:o.id,text:o.text,status:o.status,optional:o.optional===true,visible:true}))
  }));
}
function qDrawPreview(quests,title,revision=null,opener=document.activeElement) {
  if(!qPreview.open)qPreviewOpener=opener;
  qPreview.replaceChildren();
  const top=qNode('div','q-preview-top',undefined,qPreview);
  const heading=qNode('h3','',title,top);heading.id='quest-preview-'+qId('title');
  qPreview.setAttribute('aria-labelledby',heading.id);
  qButton('Close preview',top,()=>qPreview.close());
  const panel=qNode('div','q-preview-body',undefined,qPreview);
  qNode('p','q-muted','Only the content below is included in the player publication.',panel);
  if(!quests.length)qNode('p','q-muted',revision===null?'No visible quests. Publishing this draft clears the player quest list.':'No quests currently published.',panel);
  for(const quest of quests){
    qNode('h4','',quest.title+' · '+quest.status,panel);
    for(const objective of quest.objectives)qNode('p','',(objective.optional?'(Optional) ':'')+objective.text+' · '+objective.status,panel);
  }
  if(revision!==null&&revision!==qDraft.revision){
    qNode('p','is-error','This publication differs from your draft’s base revision. Keeping your draft and publishing will replace it.',panel);
    qButton('Keep my draft; use this publication revision',panel,()=>{qDraft.revision=revision;qSaveDraft();qDrawPreview(quests,title,revision);});
  }
  if(!qPreview.open)qPreview.showModal();
}
function qComparableQuests(quests){
  return quests.map(q=>({id:q.id,title:q.title.trim(),kind:q.kind,status:q.status,
    objectives:q.objectives.map(o=>({id:o.id,text:o.text.trim(),status:o.status,optional:o.optional===true}))}));
}
function qMergePublishedQuest(published,existing){
  const publishedIds=new Set(published.objectives.map(o=>o.id));
  const future=(existing?.objectives||[]).filter(o=>!publishedIds.has(o.id)).map(o=>({...o,visible:false}));
  return {...existing,id:published.id,title:published.title,kind:published.kind,
    status:published.status==='failed'?'completed':published.status,visible:true,
    description:existing?.description||'',reward:existing?.reward||'',gmNotes:existing?.gmNotes||'',
    objectives:[...published.objectives.map(o=>({...o,visible:true})),...future]};
}
function qQuestHasChanges(quest){
  if(!qLatest)return false;
  const old=qLatest.quests.filter(q=>q.id===quest.id);
  const next=quest.visible?[{...quest,objectives:quest.objectives.filter(o=>o.visible===true)}]:[];
  return JSON.stringify(qComparableQuests(old))!==JSON.stringify(qComparableQuests(next));
}
function qUpdatePublicationIndicators(){
  qRenderGmList();
  const button=qDetails.querySelector('[data-revert-quest]');
  if(button){
    button.disabled=!qLatest?.quests.some(q=>q.id===button.dataset.revertQuest);
    button.title=button.disabled?'Only quests in the current publication can be reverted.':'Restore published content; keep private planning and future objectives.';
  }
}
async function qRevertQuest(id,button){
  if(qGmBusy)return;
  qGmBusy=true;button.disabled=true;
  try{
    const data=await qRequest('/api/quests');qLatest=data;
    const published=data.quests.find(q=>q.id===id);
    const index=qDraft.quests.findIndex(q=>q.id===id);
    if(!published||index<0)throw Error('This quest is not in the current publication.');
    qDraft.quests[index]=qMergePublishedQuest(published,qDraft.quests[index]);
    qSaveDraft();qRenderGm();
    qStatus('Quest reverted to the current publication. GM Planning and future objectives were kept. Player screens were not changed.');
  }catch(error){qStatus('Could not revert quest: '+error.message,true);}
  finally{qGmBusy=false;qUpdatePublicationIndicators();}
}
async function qRestoreQuest(id){
  if(qGmBusy)return;
  qGmBusy=true;
  try{
    const data=await qRequest('/api/quests');qLatest=data;
    const published=data.quests.find(q=>q.id===id);
    if(!published)throw Error('This quest is no longer published and cannot be restored from that publication.');
    const index=qDraft.quests.findIndex(q=>q.id===id);
    const existing=index>=0?qDraft.quests[index]:qDeletedQuestRecovery[id];
    const restored=qMergePublishedQuest(published,existing);
    if(index>=0)qDraft.quests[index]=restored;
    else{
      const publishedIndex=data.quests.findIndex(q=>q.id===id);
      const following=new Set(data.quests.slice(publishedIndex+1).map(q=>q.id));
      const insert=qDraft.quests.findIndex(q=>following.has(q.id));
      qDraft.quests.splice(insert<0?qDraft.quests.length:insert,0,restored);
    }
    qChosen=id;qSaveDraft();qRenderGm();qDrawChanges(data);
    qStatus('Quest restored to the GM draft. The player publication was not changed.');
  }catch(error){qStatus('Could not restore quest: '+error.message,true);}
  finally{qGmBusy=false;qUpdatePublicationIndicators();}
}
function qDrawChanges(published){
  qDrawPreview([],'Changes to player publication',null,qChangesButton);
  const panel=qPreview.querySelector('.q-preview-body');panel.replaceChildren();
  qNode('p','q-muted','Compares the current server publication with what publishing your draft would send. Private planning and hidden content are excluded.',panel);
  const before=qComparableQuests(published.quests),after=qComparableQuests(qPublicDraft());
  const oldById=new Map(before.map(q=>[q.id,q])),newById=new Map(after.map(q=>[q.id,q]));
  let count=0;
  function change(parent,label,oldValue,newValue){
    const row=qNode('div','q-change-row',undefined,parent);
    qNode('strong','q-change-label',label,row);
    const values=qNode('div','q-change-values',undefined,row);
    for(const [heading,value] of [['Currently published',oldValue],['After publishing',newValue]]){
      const side=qNode('div','q-change-value',undefined,values);
      qNode('span','q-muted',heading,side);qNode('p','',String(value),side);
    }
  }
  for(const quest of [...after,...before.filter(q=>!newById.has(q.id))]){
    const old=oldById.get(quest.id),next=newById.get(quest.id);
    if(old&&next&&JSON.stringify(old)===JSON.stringify(next))continue;
    count++;
    const card=qNode('section','q-change-card',undefined,panel);
    qNode('h4','',quest.title||'Untitled quest',card);
    if(!old||!next){
      qNode('p','',!old?'Added to player view':'Removed from player view',card);
      const shown=next||old;
      qNode('p','q-muted','Quest status: '+shown.status,card);
      for(const o of shown.objectives)qNode('p','',(o.optional?'(Optional) ':'')+o.text+' · '+o.status,card);
      if(old&&!next)qButton('Restore quest',card,()=>qRestoreQuest(old.id));
      continue;
    }
    for(const [key,label] of [['title','Quest name'],['kind','Quest type'],['status','Quest status']]){
      if(old[key]!==next[key])change(card,label,old[key],next[key]);
    }
    const oldObjectives=new Map(old.objectives.map(o=>[o.id,o]));
    const nextObjectives=new Map(next.objectives.map(o=>[o.id,o]));
    for(const objective of [...next.objectives,...old.objectives.filter(o=>!nextObjectives.has(o.id))]){
      const a=oldObjectives.get(objective.id),b=nextObjectives.get(objective.id);
      if(!a||!b){
        const describe=o=>(o.optional?'(Optional) ':'')+o.text+' · '+o.status;
        change(card,'Objective',a?describe(a):'Not published',b?describe(b):'Removed from player view');
      }else{
        if(a.text!==b.text)change(card,'Objective text',a.text,b.text);
        if(a.status!==b.status)change(card,'Objective status: '+b.text,a.status,b.status);
        if(a.optional!==b.optional)change(card,'Objective: '+b.text,a.optional?'Optional':'Required',b.optional?'Optional':'Required');
      }
    }
    const oldOrder=old.objectives.filter(o=>nextObjectives.has(o.id)).map(o=>o.id);
    const newOrder=next.objectives.filter(o=>oldObjectives.has(o.id)).map(o=>o.id);
    if(JSON.stringify(oldOrder)!==JSON.stringify(newOrder))change(card,'Objective order',old.objectives.map(o=>o.text).join(' → '),next.objectives.map(o=>o.text).join(' → '));
  }
  const oldOrder=before.filter(q=>newById.has(q.id)).map(q=>q.id);
  const newOrder=after.filter(q=>oldById.has(q.id)).map(q=>q.id);
  if(JSON.stringify(oldOrder)!==JSON.stringify(newOrder)){
    count++;change(panel,'Quest order',before.map(q=>q.title).join(' → '),after.map(q=>q.title).join(' → '));
  }
  if(!count)qNode('p','','No player-visible changes.',panel);
  if(published.revision!==qDraft.revision){
    qNode('p','is-error','Your draft is based on a different publication revision. Review these differences before replacing the current publication.',panel);
    qButton('Keep my draft; use this publication revision',panel,()=>{
      qDraft.revision=published.revision;qSaveDraft();qDrawChanges(published);
    });
  }
}
async function qViewChanges(){
  if(qGmBusy)return;
  qGmBusy=true;qChangesButton.disabled=true;
  qStatus('Checking changes against the current player publication…');
  try{
    const data=await qRequest('/api/quests');qLatest=data;
    if(!qDraftDisposed){qUpdatePublicationIndicators();qDrawChanges(data);qStatus('Compared draft with published revision '+data.revision+'.');}
  }catch(error){qStatus('Could not compare changes: '+error.message,true);}
  finally{qGmBusy=false;qChangesButton.disabled=false;}
}
function qRenderGmList() {
  const previousTop=qList.scrollTop;
  qList.replaceChildren();
  if(!qDraft.quests.length)qNode('p','q-muted','Create a quest to begin.',qList);
  const ordered=[...qDraft.quests.filter(q=>q.status==='active'),...qDraft.quests.filter(q=>q.status!=='active')];
  for(const quest of ordered){
    const button=qButton('',qList,()=>{qChosen=quest.id;qRenderGm();},'q-entry');
    qNode('span','q-gm-quest-title',quest.title||'Untitled quest',button);
    button.classList.toggle('is-completed',quest.status!=='active');
    button.classList.toggle('is-selected',quest.id===qChosen);
    const meta=qNode('small','q-gm-quest-meta',undefined,button);
    qNode('span',quest.visible?'q-revealed-text':'q-hidden-text',quest.visible?'Revealed':'Hidden',meta);
    qNode('span','',' · '+quest.status+(quest.kind==='misc'?' · Miscellaneous':''),meta);
    if(qQuestHasChanges(quest))qNode('small','q-unpublished','Unpublished changes',button);
  }
  qList.scrollTop=previousTop;
}
function qRenderGm() {
  qRenderGmList();qDetails.replaceChildren();
  const quest=qDraft.quests.find(q=>q.id===qChosen);
  if(!quest){qNode('p','q-muted','Choose a quest or create a new one. Hidden content is kept in this GM draft only.',qDetails);return;}
  const identity=qSection(qDetails,'Quest details');
  identity.parentElement.classList.add('q-identity-card');
  const identityMain=qNode('div','q-identity-main',undefined,identity);
  qField(identityMain,'Quest title',quest.title,value=>{quest.title=value;qSaveDraft();qRenderGmList();});
  const grid=qNode('div','q-form-grid q-identity-controls',undefined,identityMain);
  qSelect(grid,'Type',quest.kind,[['quest','Quest'],['misc','Miscellaneous']],value=>{quest.kind=value;qSaveDraft();qRenderGmList();});
  qSelect(grid,'Quest status',quest.status,qStatuses.filter(([value])=>value!=='failed'),value=>{quest.status=value;qSaveDraft();qRenderGmList();});
  qCheck(grid,'Reveal quest to players',quest.visible,value=>{quest.visible=value;qSaveDraft();qRenderGmList();});
  const objectives=qSection(qDetails,'Objectives');
  objectives.parentElement.classList.add('q-objectives-card');
  const objectivesHeading=objectives.parentElement.querySelector('.q-section-heading');
  const objectiveHelp=qNode('span','q-objectives-hint','?',objectivesHeading);
  objectiveHelp.title='Prepare future objectives as hidden. Reorder them with the arrows.';
  quest.objectives.forEach((objective,index)=>{
    const box=qNode('div','q-edit-objective',undefined,objectives);
    const objectiveHeading=qNode('div','q-gm-objective-heading',undefined,box);
    const square=qNode('span','q-gm-objective-square',objective.status==='active'?'□':'■',objectiveHeading);
    square.setAttribute('aria-hidden','true');
    const objectiveLabel=qNode('label','q-objective-label','Objective '+(index+1),objectiveHeading);
    const visibility=qNode('span','',undefined,objectiveHeading);
    const markObjective=()=>{
      box.classList.toggle('is-completed',objective.status!=='active');
      square.textContent=objective.status==='active'?'□':'■';
      visibility.className=objective.visible?'q-revealed-text':'q-hidden-text';
      visibility.textContent=objective.visible?'Revealed':'Hidden';
    };
    markObjective();
    const text=qNode('textarea','q-objective-input',undefined,box);
    text.id=qId('objective-text');objectiveLabel.htmlFor=text.id;
    text.rows=2;text.value=objective.text;
    text.setAttribute('aria-label','Objective '+(index+1));
    text.addEventListener('input',()=>{objective.text=text.value;qSaveDraft();qRenderGmList();});
    const row=qNode('div','q-row q-objective-controls',undefined,box);
    qSelect(row,'Status',objective.status,qStatuses,value=>{objective.status=value;markObjective();qSaveDraft();qRenderGmList();});
    qCheck(row,'Reveal objective',objective.visible,value=>{objective.visible=value;markObjective();qSaveDraft();qRenderGmList();});
    qCheck(row,'Optional',objective.optional,value=>{objective.optional=value;qSaveDraft();qRenderGmList();});
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
  const planning=qNode('details','q-form-card q-planning',undefined,qDetails);
  planning.open=qPlanningOpen.has(quest.id);
  qNode('summary','q-section-heading','GM Planning · private',planning);
  planning.addEventListener('toggle',()=>{if(planning.open)qPlanningOpen.add(quest.id);else qPlanningOpen.delete(quest.id);});
  const briefing=qNode('div','q-section-body',undefined,planning);
  qField(briefing,'GM description',quest.description,value=>{quest.description=value;qSaveDraft();},true);
  qField(briefing,'GM reward',quest.reward,value=>{quest.reward=value;qSaveDraft();},true);
  // Keep existing notes editable here; removing the separate card loses no data.
  qField(briefing,'Private GM notes — never published',quest.gmNotes,value=>{quest.gmNotes=value;qSaveDraft();},true);
  const row=qNode('div','q-row q-quest-management',undefined,identity);
  qButton('Duplicate as hidden quest',row,()=>{
    const copy=JSON.parse(JSON.stringify(quest));copy.id=qId('quest');copy.title+=' (copy)';copy.visible=false;
    copy.objectives.forEach(o=>o.id=qId('objective'));qDraft.quests.push(copy);qChosen=copy.id;qSaveDraft();qRenderGm();
  });
  let revertArmed=false;
  const revert=qButton('Revert to published',row,()=>{
    if(!revertArmed){revertArmed=true;revert.textContent='Confirm revert';return;}
    void qRevertQuest(quest.id,revert);
  });
  revert.dataset.revertQuest=quest.id;
  revert.disabled=!qLatest?.quests.some(q=>q.id===quest.id);
  revert.title='Restore published content; keep private planning and future objectives.';
  let armed=false;const remove=qButton('Delete quest',row,()=>{
    if(!armed){armed=true;remove.textContent='Confirm deletion';return;}
    qDeletedQuestRecovery[quest.id]=JSON.parse(JSON.stringify(quest));
    qWrite('gm-deleted-quests',qDeletedQuestRecovery);
    qDraft.quests=qDraft.quests.filter(q=>q.id!==quest.id);qChosen=qDraft.quests[0]?.id||'';qSaveDraft();qRenderGm();
  },'q-danger');
}
qButton('New quest',qToolbar,()=>{
  const quest={id:qId('quest'),title:'New quest',kind:'quest',status:'active',description:'',reward:'',gmNotes:'',visible:false,objectives:[]};
  qDraft.quests.push(quest);qChosen=quest.id;qSaveDraft();qRenderGm();
});
const qChangesButton=qButton('View changes',qToolbar,()=>qViewChanges());
const qCheckButton=qButton('View published',qToolbar,()=>qCheckPublication(false));
const qPublish=qButton('Publish to players',qHeader,async()=>{
  if(qGmBusy)return;
  if(!await qFlushDraft())return;
  if(qGmBusy)return;
  const quests=qPublicDraft();
  if(quests.some(q=>!q.title.trim()||q.objectives.some(o=>!o.text.trim()))){qStatus('Give every revealed quest and objective a title/text before publishing.',true);return;}
  qGmBusy=true;qPublish.disabled=true;qStatus('Publishing revealed quests…');
  try {
    const data=await qRequest('/api/quests/publish',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({expectedRevision:qDraft.revision,quests})});
    qDraft.revision=data.revision;qLatest=data;
    qUpdatePublicationIndicators();
    qSaveDraft();qStatus('Published revision '+data.revision+' · '+qDate(data.publishedAt)+'. Players can refresh their homepage.');
  }catch(error){qStatus(error.message+'\nYour draft is retained. Use View published if another publication was saved.',true);}
  finally{qGmBusy=false;qPublish.disabled=false;}
});
async function qCheckPublication(initial) {
  if(qGmBusy)return;qGmBusy=true;qCheckButton.disabled=true;qPublish.disabled=true;
  try {
    const data=await qRequest('/api/quests');qLatest=data;
    qUpdatePublicationIndicators();
    qStatus('Published revision '+data.revision+' · '+qDate(data.publishedAt)+'. Your draft is based on revision '+qDraft.revision+'.');
    if(!initial)qDrawPreview(data.quests,'Current player publication',data.revision,qCheckButton);
  }catch(error){qStatus('Server unavailable: '+error.message+'\nYou can continue editing your local draft.',true);}
  finally{qGmBusy=false;qCheckButton.disabled=false;qPublish.disabled=false;}
}
// Server draft revision is independent of the player publication revision.
let qDraftServerRevision=qRead('gm-draft-server-revision',null);
// A pre-upgrade local draft has never been synced: never replace it silently
// if another device has already initialized the server's GM draft.
let qDraftPending=qRead('gm-draft-pending',false)===true || Boolean(qStoredDraft&&qDraftServerRevision===null);
let qDraftEditSerial=0;
let qDraftReady=false,qDraftConflict=false,qDraftDisposed=false;
let qDraftSaveTimer=null,qDraftSavePromise=null,qDraftInitPromise=null;
const qDraftControls=qNode('div','q-row',undefined,qToolbar);
const qSyncDraftButton=qButton('Sync GM draft',qDraftControls,()=>qSyncDraft());
const qConflictControls=qNode('div','q-row',undefined,qToolbar);
qConflictControls.hidden=true;

function qQueueDraftSave(){
  clearTimeout(qDraftSaveTimer);
  if(qDraftDisposed||qDraftConflict)return;
  qDraftSaveTimer=setTimeout(()=>void qFlushDraft(),700);
}
function qAdoptDraft(draft){
  qDraft=draft;
  qDraft.quests.forEach(q=>{if(q.status==='failed')q.status='completed';});
  if(!qDraft.quests.some(q=>q.id===qChosen))qChosen=qDraft.quests[0]?.id||'';
  qWrite('gm-draft',qDraft);
  qDraftPending=false;qWrite('gm-draft-pending',false);
  qRenderGm();
}
function qShowDraftConflict(){
  qDraftConflict=true;
  qConflictControls.hidden=false;qConflictControls.replaceChildren();
  qStatus('The server and this device have different GM drafts. Your local preparation is retained. Choose which version to keep before saving or publishing.',true);
  qButton('Use server draft',qConflictControls,async()=>{
    try{
      const data=await qRequest('/api/quests/gm-draft');
      if(!data.draft)throw Error('The server has no draft to load.');
      qWrite('gm-draft-recovery',qDraft);
      qAdoptDraft(data.draft);qDraftServerRevision=data.revision;
      qWrite('gm-draft-server-revision',data.revision);
      qDraftReady=true;qDraftConflict=false;qConflictControls.hidden=true;
      qStatus('Server draft loaded. Previous local preparation is retained as a recovery copy.');
    }catch(error){qStatus(error.message,true);}
  });
  qButton('Keep this device’s draft',qConflictControls,async()=>{
    try{
      const data=await qRequest('/api/quests/gm-draft');
      if(data.draft)qWrite('gm-server-draft-recovery',data.draft);
      qDraftServerRevision=data.revision;qDraftReady=true;qDraftConflict=false;
      qWrite('gm-draft-server-revision',data.revision);
      qConflictControls.hidden=true;qDraftPending=true;
      qWrite('gm-draft-pending',true);await qFlushDraft();
    }catch(error){qStatus(error.message,true);}
  });
}
async function qInitializeDraft(){
  if(qDraftInitPromise)return qDraftInitPromise;
  qDraftInitPromise=(async()=>{
    try{
      const data=await qRequest('/api/quests/gm-draft');
      if(qDraftDisposed)return false;
      const knownRevision=qDraftServerRevision;
      qDraftServerRevision=data.revision;
      if(data.draft){
        if(qDraftPending&&JSON.stringify(data.draft)!==JSON.stringify(qDraft)){
          if(knownRevision!==data.revision){qShowDraftConflict();return false;}
          // Offline edits based on this same server revision can safely resume.
        }else{
          qAdoptDraft(data.draft);
        }
      }else if(qStoredDraft||qDraftChanged||qDraft.quests.length){
        // First upgraded GM device migrates its existing local preparation.
        qDraftPending=true;qWrite('gm-draft-pending',true);
      }else{
        const published=await qRequest('/api/quests');
        if(!qDraftChanged){
          qAdoptDraft({revision:published.revision,quests:published.quests.map(q=>({
            ...q,status:q.status==='failed'?'completed':q.status,visible:true,
            description:'',reward:'',gmNotes:'',objectives:q.objectives.map(o=>({...o,visible:true}))
          }))});
        }
        qDraftPending=true;qWrite('gm-draft-pending',true);
      }
      qDraftReady=true;
      qWrite('gm-draft-server-revision',data.revision);
      qStatus(qDraftPending?'Saving GM preparation to server…':'GM draft loaded from server · '+qDate(data.savedAt));
      return true;
    }catch(error){
      qStatus('GM draft server unavailable: '+error.message+'\nLocal preparation is retained; server saving will retry.',true);
      return false;
    }
  })();
  try{return await qDraftInitPromise;}finally{qDraftInitPromise=null;}
}
async function qFlushDraft(){
  clearTimeout(qDraftSaveTimer);
  if(qDraftDisposed||qDraftConflict)return false;
  if(qDraftSavePromise){const saved=await qDraftSavePromise;if(!saved)return false;if(qDraftPending&&!qDraftConflict)return qFlushDraft();return !qDraftPending;}
  if(!qDraftReady&&!await qInitializeDraft())return false;
  if(qDraftSavePromise)return qDraftSavePromise;
  if(!qDraftPending)return true;
  const serial=qDraftEditSerial;
  const snapshot=JSON.parse(JSON.stringify(qDraft));
  qDraftSavePromise=(async()=>{
    try{
      const data=await qRequest('/api/quests/gm-draft',{method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({expectedRevision:qDraftServerRevision,draft:snapshot})});
      qDraftServerRevision=data.revision;
      qWrite('gm-draft-server-revision',data.revision);
      if(serial===qDraftEditSerial){qDraftPending=false;qWrite('gm-draft-pending',false);}
      qStatus(qDraftPending?'More draft edits waiting to save…':'GM draft saved to server · '+qDate(data.savedAt)+'. Players see only published content.');
      if(qDraftPending)qQueueDraftSave();
      return !qDraftPending;
    }catch(error){
      if(error.status===409)qShowDraftConflict();
      else qStatus('Server draft save unavailable: '+error.message+'\nPreparation remains on this device; saving will retry.',true);
      return false;
    }
  })();
  try{return await qDraftSavePromise;}finally{qDraftSavePromise=null;}
}
async function qSyncDraft(){
  if(qDraftDisposed)return;
  qSyncDraftButton.disabled=true;
  try{
    if(qDraftConflict){qShowDraftConflict();return;}
    if(qDraftPending){await qFlushDraft();return;}
    qDraftReady=false;await qInitializeDraft();
    if(qDraftPending&&!qDraftConflict)await qFlushDraft();
  }finally{qSyncDraftButton.disabled=false;}
}
const qDraftRetryTimer=setInterval(()=>{
  if(qRoot.isConnected&&!qDraftDisposed&&!qDraftConflict&&(qDraftPending||!qDraftReady))void qFlushDraft();
},10000);
if(typeof component!=='undefined'&&typeof component.register==='function')component.register(()=>{
  qDraftDisposed=true;clearTimeout(qDraftSaveTimer);clearInterval(qDraftRetryTimer);
  if(qPreview.open)qPreview.close();
});
// Always-visible connection row; no disclosure or stacked field label.
const qServerSettings=qNode('div','q-server-settings',undefined,qToolbar);
const qServerLabel=qNode('label','q-server-inline-label','Server',qServerSettings);
const qGmServerInput=qNode('input','q-gm-server-input',undefined,qServerLabel);
qGmServerInput.type='url';qGmServerInput.value=qBase;
qGmServerInput.setAttribute('aria-label','GM server address');
qButton('Save address',qServerSettings,()=>{
  try{
    const url=new URL(qGmServerInput.value.trim());
    if(!['http:','https:'].includes(url.protocol))throw Error('Use an HTTP or HTTPS address.');
    localStorage.setItem(qServerKey,url.href.replace(/\/+$/,''));
    qStatus('Address saved. Reopen this note to connect to it.');
  }catch(error){qStatus(error.message,true);}
});
qRenderGm();
void (async()=>{if(await qInitializeDraft()){if(qDraftPending)await qFlushDraft();await qCheckPublication(true);}})();

return qRoot;
})();
```
