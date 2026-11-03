```js-engine
return await (async function () {
const referenceData = {"groups": [{"title": "Turn & Actions", "description": "Turn structure, major and minor actions, combat AP", "topics": ["Action Rules", "Assist", "Attack", "Command an NPC", "Defend", "First Aid", "Pass", "Rally", "Ready", "Sprint", "Test", "Aim", "Draw Item", "Interact", "Move", "Take Chem", "Action Points in Combat Encounters"]}, {"title": "Combat Situations", "description": "Prone movement, incoming attacks and sneak attacks", "topics": ["Prone", "Sneak Attacks"]}, {"title": "Damage & Recovery", "description": "Injuries, dying, stabilization, radiation and repairs", "topics": ["Critical Hits and Injuries", "Dying", "Stabilizing The Dying", "First Aid", "Radiation Damage", "Recovering from Rads", "Healing Robots", "Well Rested"]}, {"title": "Tests & Resources", "description": "Action Points, bonus dice, Luck and opposed tests", "topics": ["Action Points", "Luck", "Opposed Tests"]}], "topics": {"Action Rules": {"name": "Action Rules", "label": "Reference", "text": "**On your turn in combat, you can take one major action and one minor action.** You can take one additional minor action by spending 1 Action Point, and you can take one additional major action by spending 2 Action Points, but the difficulty of any test attempted on that second major action is increased by 1. You may take your actions in any order you wish during your turn.\n\n**You cannot take more than two minor actions and two major actions on your turn by any means. You cannot take more than one movement action per turn.**"}, "Assist": {"name": "Assist", "label": "Major action", "text": "You assist another character with their next test. When the character you are assisting takes their turn and attempts their task, you provide assistance (p.16 Core Rulebook). If you have not yet acted this round, you may give up your turn later in the round to assist an ally when they attempt a skill test."}, "Attack": {"name": "Attack", "label": "Major action", "text": "Make a melee or ranged attack, as described in Making an Attack, p.27 Core Rulebook."}, "Command an NPC": {"name": "Command an NPC", "label": "Major action", "text": "If you have an allied NPC under your command, choose a single major action for them to take. If the action requires a test, then you automatically assist using your **CHA + Speech** (if the NPC is a person), **CHA + Survival** (if the NPC is an animal), or **INT + Science**(if the NPC is a robot)."}, "Defend": {"name": "Defend", "label": "Major action", "text": "You focus on protecting yourself. Make an **AGI + Athletics** test with a difficulty equal to your current Defense. If you succeed, add +1 to your Defense. For 2 AP, add an extra +1 to your Defense."}, "First Aid": {"name": "First Aid", "label": "Major action", "text": "You try to quickly patch the wounds of yourself or an ally. Make an **INT + Medicine** test, with a difficulty equal to the number of injuries the patient has, and increase the difficulty by 1 if you are trying to perform first aid on yourself. If you succeed, you can either:\n- Heal HP equal to your Medicine rating (p.34 Core Rulebook),\n- Treat one injury the patient is suffering from \n(p.34 Core Rulebook), or \n- Stabilize a dying patient (p.34 Core Rulebook)"}, "Pass": {"name": "Pass", "label": "Major action", "text": "You choose not to do anything."}, "Rally": {"name": "Rally", "label": "Major action", "text": "You grit your teeth, catch your breath, and prepare yourself. Make an **END + Survival** test with a difficulty of 0, and save any Action Points you generate. The GM may allow you to use a different ATT + skill for this action depending on how you describe it, such as **CHA + Speech** to inspire your allies."}, "Ready": {"name": "Ready", "label": "Major action", "text": "Describe a situation you expect to occur, and choose a major action you will perform when it does. If that action occurs before the start of your next turn, you may perform that major action immediately, interrupting other characters’ actions as necessary. If more than one character has readied an action for the same situation, their readied actions occur in initiative order."}, "Sprint": {"name": "Sprint", "label": "Major action", "text": "Movement action. You move up to two zones, to anywhere within Long range."}, "Test": {"name": "Test", "label": "Major action", "text": "Perform a skill test for an action not covered by the other actions, with the gamemaster’s permission."}, "Aim": {"name": "Aim", "label": "Minor action", "text": "Re-roll 1d20 on the first attack roll you make this turn"}, "Draw Item": {"name": "Draw Item", "label": "Minor action", "text": "Draw one item carried on your person or pick up an object or item within your reach. You may put an item away as part of this action."}, "Interact": {"name": "Interact", "label": "Minor action", "text": "Interact with your equipment or environment in a simple way, like opening a door, or pushing a button."}, "Move": {"name": "Move", "label": "Minor action", "text": "Movement action. Move up to one zone, to any position within Medium range. Alternatively, stand up from a prone position."}, "Take Chem": {"name": "Take Chem", "label": "Minor action", "text": "Administer a dose of a chem that you are holding, targeting yourself or a willing character within your reach. If you’re not holding the chem, then you need to draw it first."}, "Action Points in Combat Encounters": {"name": "Action Points in Combat Encounters", "label": "Reference", "text": "During combat, you can spend Action Points to do the following:\n- **Buy d20s (1–6 AP):** Buy bonus d20s for a test, before the dice pool is rolled, but after the GM sets the difficulty. The cost increases for each die purchased: the first d20 costs 1 AP, the second costs 2, and the third costs 3. No more than three bonus d20s may be rolled for a single test, including any d20s from perks or traits.\n- **Obtain Information (1 AP):** Ask the gamemaster a \nsingle question about the current situation, based on your \ntest. The GM will answer truthfully, but the answer might \nnot be complete.\n- **Take Additional Minor Action (1 AP):** Take 1 additional minor action in your turn. You can only take a total \nof 2 minor actions in a single round.\n- **Take Additional Major Action (2 AP):** Take one additional major action on your turn. Any skill test you must attempt is increased in difficulty by +1. You can only take a total of two major actions in a single round.\n- **Add Extra Damage (1-3 AP):** On a successful melee attack or thrown weapon attack you can spend AP to add 1 D6 per AP spent, up to a maximum of +3 D6 for 3 AP."}, "Prone": {"name": "Prone", "label": "Reference", "text": "You may be knocked prone by attacks, hazards, or complications. You may also drop prone willingly, at the end of any movement action you perform. Being prone has the following effects:\n- When you’re prone, you crawl. The Move action becomes a major action, rather than a minor action, and you cannot take the Sprint action.\n- While you’re prone, enemies at Medium range or further add +1 to the difficulty of any attacks against you.\n- While you’re prone, enemies at Close range reduce the difficulty of attacks (including melee attacks) by 1, to a minimum of 0.\n- While you’re prone, you can re-roll any cover D6 you have"}, "Sneak Attacks": {"name": "Sneak Attacks", "label": "Reference", "text": "If the enemy is unaware of you before you attack, the difficulty to attack them is reduced by 1 (to a minimum of 0), and your attack gains the Vicious damage effect if it did not have it already, or the damage is increased by +2D6 if it already has the [[Vicious]] damage effect.\n\nIf the difficulty to hit your opponent is 0, you do not need to roll to hit them, but you may still decide to do so, generating Action Points and complications as normal."}, "Critical Hits and Injuries": {"name": "Critical Hits and Injuries", "label": "Reference", "text": "A **critical hit** occurs whenever a character suffers **five or more damage in one hit** (after reductions from Damage Resistance). A critical hit imposes an injury on the character, which confers a penalty depending on the location hit.\n\n- **Arm:** You drop any object held in that hand, and the arm is broken or otherwise unable to move. You cannot perform any actions using that arm—by itself or alongside your other arm.\n- **Leg:** You immediately fall prone as your leg gives out under your weight. You can no longer take the [[Sprint]] action, and the [[Move]] action is now a major action for you.\n- **Torso:** You begin bleeding heavily. At the end of each of your subsequent turns, you suffer 2 D6 physical damage, ignoring all your Damage Resistances.\n- **Head:** You are momentarily dazed and lose your normal actions in your next turn (though you may spend AP for extra actions as normal). Further, you cannot see clearly, and increase the difficulty of all tests which rely on vision by +2.\n\nThese effects last until the injury has received medical attention (see p.34 Core Rulebook)."}, "Dying": {"name": "Dying", "label": "Reference", "text": "When your character is reduced to 0 HP, they suffer an injury to the location struck, and then fall prone and start **dying**. If they suffer a critical hit and are reduced to 0 HP, they suffer two injuries: one for the critical hit, and one for being reduced to 0 HP.\n\nWhile they are dying, they are unconscious, cannot recover HP from the [[First Aid]] action, and cannot take any actions. Furthermore, at the start of each of your turns while they’re dying, you must attempt an **END +** **Survival** test, with a difficulty equal to the number of injuries they have, and a complication range of 19-20. If you pass this test, they remain alive, but are still dying. If you fail, they die.\n\nIf they suffer any damage while dying, they immediately gain one additional injury, in addition to any injury caused by another critical hit."}, "Stabilizing The Dying": {"name": "Stabilizing The Dying", "label": "Reference", "text": "Using the First Aid action, you can attempt to stabilize a dying character. This requires an **INT + Medicine** test with a difficulty equal to the number of injuries the patient has. Passing the test restores the character to 1 HP and they are no longer dying, and their player no longer has to attempt **END + Survival** tests to avoid death. The character remains unconscious and unable to take actions. \n\nIf radiation damage has reduced their maximum health points to 0, they cannot be stabilized until their maximum health points are above 0, by healing the radiation damage.\n\nIf you stabilize the patient, you can spend AP to heal additional health points. You can heal 1 HP for every AP spent. You may also spend 1 AP after stabilizing a character to wake them from unconsciousness, allowing them to continue to act."}, "Radiation Damage": {"name": "Radiation Damage", "label": "Reference", "text": "Radiation damage is applied differently than other damage types. Each point of radiation damage, after reduction for the location’s radiation DR, reduces a character’s **maximum health points**, rather than their current health points. If a character’s health point maximum is reduced below their current health point total, then their current HP are reduced as well.\n\nRadiation damage is only reduced by a target’s radiation Damage Resistance, according to the location hit. If the radiation would affect the whole body, like an environmental effect, then use the character or creature’s **lowest** locational radiation DR.\n\nIn all cases, where a character would suffer radiation damage and another type of damage at the same time, resolve the radiation damage after any other types of damage.\n\n***Example:** Piper is attacked by a glowing feral ghoul, taking 3 D6 radiation damage. The GM rolls their D6 and totals 4 damage with an Effect, inflicting 4 physical damage and 1 radiation damage. Piper has 2 physical resistance, so she reduces her current health points by 2. Then, she reduces her maximum health points by 1 because of the radiation damage.*\n\n\n### IRRADIATED FOOD AND DRINK \nSome items of food and drink are Irradiated, contaminated with the radiation which is all-pervasive in the wastelands. When you consume irradiated food or drink, roll 1 D6. If you roll an Effect, you suffer 1 Radiation damage, which ignores any resistance from equipment or armor."}, "Recovering from Rads": {"name": "Recovering from Rads", "label": "Reference", "text": "Because radiation damage reduces maximum health points, it doesn’t heal in the same way that most damage does—the effects of radiation damage don’t heal naturally at all. \n\nRadiation damage can only be removed by administering [[RadAway]], or other chems or consumables that remove radiation damage. When you heal HP and remove radiation damage at the same time, remove the radiation damage first, and then resolve the HP recovery."}, "Healing Robots": {"name": "Healing Robots", "label": "Reference", "text": "Robots and other machines cannot recover from injuries naturally, and they require maintenance to restore damage.\n\nAttempting the [[First Aid]] action on a robot, a suit of power armor, or other large machine (like a vehicle) requires an **INT + Repair** test, with a difficulty of 2. This increases by +1 for each injury the machine has suffered. Passing the test restores health points equal to your Repair rating, treats an injury, or stabilizes a dying machine. Machines cannot use chems, though a repair kit functions for machines as Stimpaks do for living characters.\n\nMachines cannot heal through eating, drinking, rest, or medical attention. Outside of combat, an hour’s work on a damaged machine restores HP equal to twice the repairer’s **Repair** skill rating."}, "Well Rested": {"name": "Well Rested", "label": "Reference", "text": "Max HP increased by +2 until you next sleep"}, "Action Points": {"name": "Action Points", "label": "Reference", "text": "When you check your successes against the task difficulty, each success you generate above the difficulty becomes an Action Point. For example, if the task’s difficulty is 2, and you generate 3 successes, the extra success becomes 1 Action Point.\n\nAction Points can be used to take additional actions, improve the outcome of a test, reduce the time it takes, learn more about a situation, or buy more d20s in future tests.\n\nYou can spend Action Points to do the following:\n\n**Buy d20s (1–6 AP):** Buy bonus d20s for a test, before the dice pool is rolled, but after the GM sets the difficulty. The cost increases for each die purchased: the first d20 costs 1 AP, the second costs 2, and the third costs 3. No more than three bonus d20s may be rolled for a single test, including any d20s from perks or traits.\n\n**Obtain Information (1 AP):** Ask the gamemaster a single question about the current situation, based on your test. The GM will answer truthfully, but the answer might not be complete.\n\n**Reduce Time (2 AP):** AP from a successful test can allow the test to take less time to complete, when time is important. Spending 2 AP halves the amount of time a test takes to attempt. In combat, you can spend Action Points to do the following:\n\n**Take Additional Minor Action (1 AP):** Take 1 additional minor action in your turn. You can only take a total of 2 minor actions in a single round.\n\n **Take Additional Major Action (2 AP):** Take one additional major action on your turn. Any skill test you must attempt is increased in difficulty by +1. You can only take a total of two major actions in a single round.\n\n **Add Extra Damage (1-3 AP):** On a successful melee attack or thrown weapon attack you can spend AP to add 1 D6 per AP spent, up to a maximum of +3 D6 for 3 AP.\n\n| Dicepool | Bonus D20s | AP Cost |\n| -------- | ---------- | ------- |\n| 2d20     | -          | 0       |\n| 3d20     | +1d20      | 1       |\n| 4d20     | +2d20      | 3       |\n| 5d20     | +3d20      | 6       |\n\nYou spend Action Points either before or after you roll dice, and each option describes when you can spend Action Points to take advantage of its effect. You buy extra d20s for a test before you roll, while you spend Action Points after a test to obtain information, reduce the time, improve the quality of the success, or take an additional action."}, "Luck": {"name": "Luck", "label": "Reference", "text": "| Luck Spend       | Description                                           |\n| ---------------- | ----------------------------------------------------- |\n| Luck of the Draw | Add a detail to a scene                               |\n| Stacked Deck     | Use your LCK attribute for a skill test               |\n| Lucky Timing     | Interrupt the normal turn order to take your turn now |\n| Miss Fortune     |    Re-roll 1d20 or 3D6 per Luck point spent                                                   |\n\n\t\n##### Trinkets\n>Personal trinkets also allow your character to regain Luck points. Once per quest, outside of combat, your character can spend a few moments looking at the trinket, thinking about what it means to them. When you do, you regain 1 Luck point. See Personal Trinkets, p.80 for more details."}, "Opposed Tests": {"name": "Opposed Tests", "label": "Reference", "text": "Sometimes you’ll face situations that are not difficult because of the task itself, but because of an opposing force trying to prevent your success. In these cases, you and the opposing player (normally the GM) will both roll a dice pool and compare results to see who wins.\n\nWhen another character opposes you in a test, their player rolls their d20 dice pool, after buying any extra d20s, and the number of successes they generate becomes the difficulty of your test. Then, you attempt your test with your opponent’s number of successes as your difficulty. If you equal or beat your opponent’s number of successes, you win the opposed test, and any extra successes become Action Points. If you do not generate enough successes to meet the difficulty, you fail, and your opponent could generate AP.\n\n***Example: Paladin Danse is grappling a deathclaw, holding it back from advancing on his squad. The GM decides this is an opposed test and rolls a test for the deathclaw. Rolling 2d20, the GM scores 3 successes, meaning Danse’s test will be difficulty 3. Danse has a target number of 8, so his player decides to buy two more d20s with the Action Points in the pool, to ensure he gets the successes he needs and rolls the pool of 4d20s. They roll a 1, 5, 6, and 18, which generates 4 successes! Danse holds his ground, and banks 1 AP for the extra success. Had he rolled a 10 instead of a 1, he would have failed by one success instead, and the GM would have gained one AP for the deathclaw.***\n\n**Increased Difficulties in Opposed Tests**\nIn an ordinary opposed test, it’s assumed the only real source of difficulty is the other character. However, if something increases the difficulty of your test, then your opponent adds that increase to their successes total instead. If something would decrease the difficulty of your test, then your opponent reduces their total successes by that amount instead. So, if your opponent is trying to sneak up on you, and it’s dark (increasing the difficulty of your **PER + Survival** test by 1), then your opponent adds +1 success to their total instead.\n\n**Action Points in Opposed Tests**\nIn an Opposed Test, the opposing characters spends AP first and then rolls. The active character then may spend AP to add dice to their pool (if they wish) and then rolls.\n\nIf two player characters are making an opposed test, then both players must generate AP for the GM in order to buy additional d20s (see p.18 Core Rulebook). The group pool is for team players!\n\nWhen you succeed in an opposed test, you generate Action Points by comparing your result to your opponent’s. When you are rolling against an established difficulty, any excess successes generate AP as normal. When you are the one to roll first, establishing a difficulty for your opponent, you generate 1 AP for each success less than your number of successes."}}};
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
.fqr{--qr-gold:#ffc200;--qr-panel:#102434;--qr-border:#365168;--qr-muted:#abc0ce;color:var(--text-normal,#e2e8ef);font-family:var(--font-interface);position:relative}
.fqr *{box-sizing:border-box}
.fqr .fqr-heading{margin:0 0 5px;color:var(--qr-gold);font-size:1.2em;font-weight:650}
.fqr .fqr-caption{color:var(--qr-muted);font-size:.85em;margin:0 0 16px}
.fqr .fqr-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
.fqr button.fqr-card{display:flex;flex-direction:column;align-items:flex-start;text-align:left;white-space:normal;height:auto;min-height:112px;padding:18px;background:linear-gradient(135deg,#152e40,#0c1a27);border:1px solid var(--qr-border);border-radius:10px;box-shadow:none;color:inherit;cursor:pointer}
.fqr button.fqr-card:hover{border-color:var(--qr-gold);background:#193447}
.fqr .fqr-card-title{color:var(--qr-gold);font-size:1.08em;font-weight:650;margin-bottom:7px}
.fqr .fqr-card-description{color:var(--qr-muted);font-size:.85em;line-height:1.5}
.fqr .fqr-card-footer{font-size:.75em;color:var(--qr-muted);margin-top:auto;padding-top:12px}
.fqr .fqr-overlay{position:fixed;inset:0;z-index:1000;background:rgba(0,0,0,.72);display:flex;align-items:center;justify-content:center;padding:28px}
.fqr .fqr-dialog{width:min(1080px,100%);height:min(760px,88vh);display:flex;flex-direction:column;overflow:hidden;background:#0e1d2a;border:1px solid var(--qr-border);border-radius:12px;box-shadow:0 24px 90px #0009}
.fqr .fqr-top{display:flex;gap:12px;align-items:center;justify-content:space-between;padding:18px 22px;border-bottom:1px solid var(--qr-border)}
.fqr .fqr-title{font-size:1.1em;color:var(--qr-gold);font-weight:650;margin:0}
.fqr button.fqr-close{background:transparent;border:1px solid var(--qr-border);box-shadow:none;color:var(--qr-muted);cursor:pointer;padding:5px 12px;height:auto}
.fqr .fqr-controls{padding:12px 18px;border-bottom:1px solid var(--qr-border)}
.fqr input.fqr-search{display:block;width:100%;background:#091722;border:1px solid var(--qr-border);color:#e2e8ef;box-shadow:none}
.fqr .fqr-body{display:grid;grid-template-columns:240px minmax(0,1fr);flex:1;min-height:0}
.fqr .fqr-nav{overflow:auto;padding:12px;border-right:1px solid var(--qr-border)}
.fqr button.fqr-topic{display:block;width:100%;height:auto;white-space:normal;text-align:left;padding:9px 10px;margin-bottom:4px;border:1px solid transparent;border-radius:6px;box-shadow:none;background:transparent;color:#c9d6df;cursor:pointer;line-height:1.35}
.fqr button.fqr-topic:hover{background:#193447}
.fqr button.fqr-topic[aria-current=true]{background:#20384a;border-color:#527c96;color:var(--qr-gold)}
.fqr .fqr-topic-type{display:block;font-size:.72em;color:var(--qr-muted);margin-top:3px}
.fqr .fqr-content{overflow:auto;padding:24px 28px;line-height:1.65;user-select:text;color:#e2e8ef}
.fqr .fqr-article-title{color:var(--qr-gold);font-size:1.3em;margin:0 0 4px}
.fqr .fqr-badge{display:inline-block;font-size:.75em;color:var(--qr-muted);border:1px solid var(--qr-border);border-radius:5px;padding:1px 8px;margin-bottom:14px}
.fqr .fqr-markdown p{margin:0 0 13px}.fqr .fqr-markdown li{margin-bottom:8px}
.fqr .fqr-markdown strong{color:#fff0bc}
.fqr .fqr-markdown a{color:var(--qr-gold)}
.fqr .fqr-markdown :is(h3,h4,h5){color:var(--qr-gold);margin:20px 0 10px}
.fqr .fqr-markdown table{width:100%;border-collapse:collapse;font-size:.9em}
.fqr .fqr-markdown :is(th,td){border:1px solid var(--qr-border);padding:8px 10px;text-align:left}
.fqr .fqr-markdown th{background:#1c3548}.fqr .fqr-markdown tr:nth-child(even){background:#122736}
.fqr .fqr-markdown blockquote{border-left:3px solid #527c96;margin:12px 0;padding:8px 14px;background:#122736}
.fqr .fqr-empty{color:var(--qr-muted);padding:8px;font-size:.9em}
.fqr :is(button,input,a):focus-visible{outline:2px solid var(--qr-gold);outline-offset:2px}
@media(max-width:700px){.fqr .fqr-body{grid-template-columns:180px minmax(0,1fr)}.fqr .fqr-content{padding:18px}.fqr .fqr-overlay{padding:12px}}
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

// Release MarkdownRenderer resources when the note or embedded panel is removed.
let wasMounted = false;
const observer = new MutationObserver(() => {
  if (root.isConnected) wasMounted = true;
  if (wasMounted && !root.isConnected) {
    disposed = true;
    closeCurrent?.();
    qrRenderComponent.unload();
    observer.disconnect();
  }
});
observer.observe(document.body, { childList: true, subtree: true });
return root;

})();
```
