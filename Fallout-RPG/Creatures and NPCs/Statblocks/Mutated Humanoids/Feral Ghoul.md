```statblock
name: Feral Ghoul
image: Fallout-RPG/Images/Creatures and NPC's/Feral Ghoul image.jpg
desc: "Ranging in age from those who underwent ghoulification hundreds of yearsago, and for those whom the process quickly degraded their body and mind, feral ghouls are what remain once humanity is lost. They are violent creatures who attack by rushing their victims and clawing at them. They cannot be reasoned with, having lost the ability to understand speech and seem to possess little higher thinking. Some appear to retain some sense of memory, carrying items that they would have done in their pre-feral state or returning to places they once knew. Feral ghouls often leave other ghouls alone, regardless of them being feral or not, but attack all other creatures on sight."
level: 3
type: Normal Creature
keywords: Mutated Human
xp: 10
body_attr: 5
mind: 5
melee: 3
guns: 
other: 2
hp: 8
initiative: 10
modifier: 10
defense: 1
ac: 1
phys_dr: 0
energy_dr: 0
rad_dr: Immune
poison_dr: Immune
attacks:
 - name: "`dice: 2d20|render|text(UNARMED: BODY + Melee (TN 8))`"
   desc: "3 D6  [[Radioactive]] Physical damage"
special_abilities:
  - name: "IMMUNE TO RADIATION:"
    desc: "The feral ghoul reduces all Radiation damage suffered to 0 and cannot suffer any damage or effects from radiation."
  - name: "IMMUNE TO POISON:"
    desc: "The feral ghoul reduces all Poison damage suffered to 0 and cannot suffer any damage or effects from poison."
  - name: "FERAL:"
    desc: " The feral ghoul is unintelligent, driven purely by feral instinct. Feral NPCs cannot be persuaded or influenced by Speech tests. Feral NPCs will move towards and attack the nearest enemy. If they cannot detect an enemy, they move towards the nearest source of bright light or loud noise. Failing that, they move around randomly or simply lie down and do nothing."
  - name: "GHOUL:"
    desc: "A ghoul is healed by radiation. It regains 1HP for every 3 points of Radiation damage inflicted upon it."
  - name: "PLAY DEAD:"
    desc: "A feral ghoul which is prone and not moving is difficult to tell apart from a corpse. It takes a **PER + Survival** test, difficulty 2, to spot a ghoul which is currently ‘playing dead’. They often use this to ambush unsuspecting passers-by"
scavenge_rules:
 - name: ""
   desc: "2D6 junk items can be found on a dead ghoul’s body, which can be salvaged as normal."
```
