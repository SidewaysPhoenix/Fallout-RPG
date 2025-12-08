```statblock
name: Glowing One
desc: "These glowing green ghouls are what happens when a feral ghoul, or someone predisposed to ghoulification absorbs radiation inextreme excess. The result is a feral ghoul that becomes a conduit of radiation. They glow a deep green color and emit heavy radiation even after death. They can even discharge radiation outwards in a toxic cloud, which can heal the injuries of other ghouls and cause extreme radiation damage to non-ghouls."
level: 9
type: Normal Creature
keywords: Mutated Human
xp: 67
body_attr: 8
mind: 5
melee: 5
guns: 
other: 3
hp: 17
initiative: 12
modifier: 12
defense: 1
ac: 1
phys_dr: 4 (All)
energy_dr: 3 (All)
rad_dr: Immune
poison_dr: Immune
attacks:
 - name: "`dice: 2d20|render|text(UNARMED: BODY + Melee (TN 13))`"
   desc: "7 D6  [[Radioactive]] Physical damage"
special_abilities:
  - name: "RADIATION PULSE:"
    desc: "Once per combat, the glowing one may unleash a pulse of radiation. This inflicts 5 D6  radiation damage to everything within Range C. If it inflicts 3 or more damage, then any defeated ghoul within that range is restored to 1HP and returns to the fight."
  - name: "GLOWING:"
    desc: "The glowing one is saturated with so much radiation that they literally glow, emitting a strange luminescence and irradiating the world around them. The glowing feral ghoul inflicts 2 D6  Radiation damage to anyone within Reach of it. In addition, any melee attacks it makes gain the [[Radioactive]] damage effect; if it already had this damage effect, it instead inflicts 2 Radiation damage per Effect rolled."
  - name: "IMMUNE TO RADIATION:"
    desc: "The glowing one reduces all Radiation damage suffered to 0 and cannot suffer any damage or effects from radiation."
  - name: "IMMUNE TO POISON:"
    desc: "The glowing one reduces all Poison damage suffered to 0 and cannot suffer any damage or effects from poison."
  - name: "FERAL:"
    desc: "The glowing one is unintelligent, driven purely by feral instinct. Feral NPCs cannot be persuaded or influenced by Speech tests. Feral NPCs move towards and attack the nearest enemy. If they cannot detect an enemy, they move towards the nearest source of bright light or loud noise. Failing that, they will move around randomly or simply lie down and do nothing."
  - name: "GHOUL:"
    desc: "A glowing one is healed by radiation. It regains 1HP for every 3 points of Radiation damage inflicted upon it."
  - name: "PLAY DEAD:"
    desc: "A glowing one which is prone and not moving is difficult to tell apart from a corpse. It takes a **PER + Survival** test, difficulty 2, to spot a Ghoul which is currently ‘playing dead’. They often use this to ambush unsuspecting passers-by."
scavenge_rules:
 - name: ""
   desc: "2D6 junk items can be found on a dead glowing one’s body, which can be salvaged as normal."
```