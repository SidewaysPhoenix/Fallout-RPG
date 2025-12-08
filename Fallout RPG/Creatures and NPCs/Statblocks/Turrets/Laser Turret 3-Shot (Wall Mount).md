```statblock
name: Laser Turret 3-Shot (Wall Mount)
desc: "A variant on the standard laser turret, this 3-shot model fires rapidly enough that its speed almost match that of a Gatling laser though what they gain in damage they lose in accuracy. The spread of this weapon is greater than its single shot counterpart, making it capable of hitting several targets in a single burst."
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
energy_dr: 2 (All)
rad_dr: Immune
poison_dr: Immune
attacks:
 - name: "`dice: 2d20|render|text(LASER GUN: BODY + Guns (TN 13))`"
   desc: "7 D6  [[Piercing]] Energy damage, Range M, [[Burst]], Fire Rate 3"
special_abilities:
  - name: "ROBOT:"
    desc: "The laser turret is a robot. It is immune to the effects of starvation, thirst, and suffocation. It is also immune to Poison and Radiation damage. However, machines cannot use food and drink or other consumables, they do not heal naturally, and the Medicine skill cannot be used to heal them: damage to them must be repaired (p.34 Core Rulebook)."
  - name: "IMMUNE TO POISON:"
    desc: "The laser turret reduces all Poison damage suffered to 0 and cannot suffer any damage or effects from poison."
  - name: "IMMUNE TO RADIATION:"
    desc: " The laser turret reduces all Radiation damage suffered to 0 and cannot suffer any damage or effects from radiation."
  - name: "IMMUNE TO DISEASE:"
    desc: "The laser turret is immune to the effects of all diseases, and they will never suffer the symptoms of any disease."
  - name: "LITTLE:"
    desc: "The laser turret is smaller than most characters. Its normal HP is reduced to Body + ½ level (rounded up), but its Defense is increased by 1. Further, it is slain by any hit which inflicts an Injury."
scavenge_rules:
 - name: "SALVAGE:"
   desc: "Scavengers can salvage from a destroyed laser turret with a successful **INT + Science** test with a difficulty of 1.\n This yields:\n 3d20 [[Fusion Cell]]s\n 2 D6  uncommon materials."
```