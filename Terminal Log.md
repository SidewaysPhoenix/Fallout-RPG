```js-engine
// === Project ATLAS — EXECUTIVE ACCESS LOG (single-note, no globals/collisions) ===
// replace old styles so this note's CSS actually updates
document.getElementById("atlas-terminal-css")?.remove();

// 1) Content (edit these three only)
const ATLAS_TITLE = "EXECUTIVE ACCESS LOG — SECURE NODE";
const ATLAS_BOOT_LINES = [
  "Initializing Vault-Tec Secure Link...",
  "------------------------------------",
  "ATLAS Relay Interface Online.",
  ""
];
const ATLAS_SCREEN_HTML = `
<pre style="margin:0">
>> USER AUTH: C.DUNHAM / CIVIL DEFENSE LIAISON
>> ACCESS ORIGIN: CITY HALL / SUBLEVEL-2 TERMINAL
>> SECURITY LEVEL: OMEGA-PRIORITY (LEGACY OVERRIDE)
>> DATE: 10.23.2287  22:49:07

--------------------------------------------
  COMMAND INTERFACE — PROJECT ATLAS LINK
--------------------------------------------

> VERIFY LINK [ATLAS_MAIN / NODE_A]
  STATUS: STANDBY — REMOTE CHANNEL STABLE
  ENCRYPTION: VT-COMM_63/VAULTNET LEGACY
  HANDSHAKE CODE ACCEPTED (ELEVATED CLEARANCE)

> SYSTEM PROMPT: "INPUT TARGET COORDINATES"
  > LONGITUDE: -71.1002
  > LATITUDE:  42.3661
  COORDINATES ACCEPTED — MAPPING NODE GRID
  SITE IDENTIFIER: CIV_REGION-04 (CONFIDENTIAL)

> EXECUTE PROTOCOL: A-7  ("EMERGENCY STABILIZATION")
  WARNING: AUTHORIZED PERSONNEL ONLY
  SECONDARY CONFIRMATION REQUIRED

> CONFIRMATION: M.HOLLOWAY-DELTA
  ACCEPTED — COMMAND CHANNEL OPEN

> ROUTING POWER TO LOCAL RELAY GRID...
  RELAY 1... ACTIVE
  RELAY 2... ACTIVE
  RELAY 3... ACTIVE
  GRID BALANCE: UNSTABLE (34%)

> OVERRIDE CIVIL RESTRICTIONS?  [Y/N]
  > Y

> INITIATE ATLAS CYCLE?
  > Y

  PROCESSING…
  INITIALIZATION SEQUENCE COMMENCED
  SYSTEM RESPONSE: DELAYED (11.3s)
  UNKNOWN FEEDBACK DETECTED
  WARNING: PRESSURE INDEX RISING

> CONTINUE?  [Y/N]
  > Y

EXECUTION COMPLETE — PROJECT ATLAS NOW ACTIVE
NOTE: Environmental sensors exceed safe thresholds.
System response pending from NODE_A.

**End of session.**
</pre>
`;

// 2) Style (loaded once, unique ID)
if (!document.getElementById("atlas-terminal-css")) {
  const s = document.createElement('style');
  s.id = "atlas-terminal-css";
  s.textContent = `
.atlas-terminal {
  background: #181818;
  border: 3px solid #38ff88;
  border-radius: 11px;
  padding: 18px 14px 22px 18px;
  margin: 30px 0 25px 0;
  font-family: 'VT323', 'Fira Mono', 'Consolas', 'Courier New', monospace;
  color: #38ff88;
  box-shadow: 0 0 30px 2px #18ff55b0;
  position: relative;
  overflow: hidden;
}
.atlas-title {
  font-size: 2em;
  font-weight: bold;
  margin-bottom: 2px;
  color: #8fffbe;
  text-shadow: 0 0 12px #38ff88, 0 0 4px #fff;
  letter-spacing: 2px;
  font-family: inherit;
  text-align: left;
  padding-left: 3px;
  margin-top: 0;
}
.atlas-boot {
  font-size: 1.18em;
  color: #4cf386;
  letter-spacing: 1.2px;
  margin-bottom: 6px;
  padding-left: 2px;
  min-height: 45px;
  font-family: inherit;
  white-space: pre-line;
  animation: terminalBoot 1.6s steps(16, end) 1;
}
@keyframes terminalBoot {
  from { opacity: 0; }
  25% { opacity: 1; }
  to { opacity: 1; }
}
.atlas-screen {
  width: 100%;
  min-height: 135px;
  background: #181818;
  color: #38ff88;
  border: none;
  outline: none;
  font-family: inherit;
  font-size: 1.2em;
  line-height: 1.42em;
  box-shadow: 0 0 8px #14ff55a0;
  padding: 8px;
  border-radius: 4px;
  margin-bottom: 7px;
  z-index: 3;
  position: relative;
}
.atlas-scan {
  pointer-events: none;
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  z-index: 99;
  opacity: 0.17;
  background: repeating-linear-gradient(
    to bottom,
    #18ff55 0px, #18ff5508 2px,
    transparent 3px, transparent 7px
  );
  animation: scanlinesMove 5s linear infinite;
}
@keyframes scanlinesMove {
  0% { background-position-y: 0; }
  100% { background-position-y: 18px; }
}
.atlas-power {
  position: absolute;
  top: 11px; right: 17px;
  width: 16px; height: 16px;
  background: radial-gradient(circle at 8px 8px, #38ff88 70%, #163f1c 95%);
  border-radius: 50%;
  box-shadow: 0 0 14px 2px #38ff88b7, 0 0 3px 2px #7cffb9;
  border: 2px solid #38ff88b3;
  z-index: 50;
}
`;
  document.head.appendChild(s);
}


// 3) Build DOM (ALL NAMES UNIQUE → no collisions)
const atlasContainer = document.createElement('div');
atlasContainer.className = "atlas-terminal";

const atlasPower = document.createElement('div');
atlasPower.className = "atlas-power";
atlasContainer.appendChild(atlasPower);

const atlasTitle = document.createElement('div');
atlasTitle.className = "atlas-title";
atlasTitle.textContent = ATLAS_TITLE;
atlasContainer.appendChild(atlasTitle);

const atlasBoot = document.createElement('div');
atlasBoot.className = "atlas-boot";
atlasContainer.appendChild(atlasBoot);

const atlasScreen = document.createElement('div');
atlasScreen.className = "atlas-screen";
atlasScreen.innerHTML = ATLAS_SCREEN_HTML;
atlasScreen.style.display = "none"; // revealed after boot
atlasContainer.appendChild(atlasScreen);

const atlasScan = document.createElement('div');
atlasScan.className = "atlas-scan";
atlasContainer.appendChild(atlasScan);

// 4) Boot animation → then reveal the screen
let __atlas_i = 0;
(function __atlas_type() {
  if (__atlas_i < ATLAS_BOOT_LINES.length) {
    atlasBoot.textContent += ATLAS_BOOT_LINES[__atlas_i] + "\n";
    __atlas_i++; setTimeout(__atlas_type, 420);
  } else {
    atlasScreen.style.display = "";
  }
})();

// 5) Return the root (this is how your working file mounts)
return atlasContainer;


```