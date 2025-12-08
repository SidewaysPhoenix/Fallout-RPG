```statblock
name: Machine Gun Turret 3 Shot (Wall Mount)
desc: "The three-shot version of the wall-mounted machine gun turret is capable of an increased rate of fire, acting like a smaller wall mounted mini gun. It also fires 10mm ammunition but its ability to fire three rounds at once leads to an increased damage to its targets especially at close range."
level: 10
type: Normal Creature
keywords: Robot
xp: 74
body_attr: 8
mind: 5
melee: 
guns: 5
other: 
hp: 13
initiative: 13
modifier: 13
defense: 2
ac: 2
phys_dr: 2 (All)
energy_dr: 1 (All)
rad_dr: Immune
poison_dr: Immune
attacks:
 - name: "`dice: 2d20|render|text(MACHINE GUN: BODY + Guns (TN 13))`"
   desc: "5 D6  Physical damage, Range M, [[Burst]], Fire Rate 3"
special_abilities:
  - name: "Robot:"
    desc: "The machine gun turret is a robot. It is immune to the effects of starvation, thirst, and suffocation. It is also immune to Poison and Radiation damage. However, machines cannot use food and drink or other consumables, they do not heal naturally, and the Medicine skill cannot be used to heal them: damage to them must be repaired (p.34 Core Rulebook)."
  - name: "IMMUNE TO POISON:"
    desc: "The machine gun turret reduces all Poison damage suffered to 0 and cannot suffer any damage or effects from poison."
  - name: "IMMUNE TO RADIATION:"
    desc: "The machine gun turret reduces all Radiation damage suffered to 0 and cannot suffer any damage or effects from radiation."
  - name: "IMMUNE TO DISEASE:"
    desc: "The machine gun turret is immune to the effects of all diseases, and they will never suffer the symptoms of any disease."
  - name: "LITTLE:"
    desc: " The machine gun turret is smaller than most characters. Its normal HP is reduced to Body + ½ level (rounded up), but its Defense is increased by 1. Further, it is slain by any hit which inflicts an Injury."
scavenge_rules:
 - name: "Salvage:"
   desc: "Scavengers can salvage from a destroyed machine gun turret with a successful **INT + Science** test with a difficulty of 1.\n This yields:\n 3d20 [[10mm round]]s\n 2 D6  uncommon materials."
```