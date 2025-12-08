```statblock
name: Machine Gun Turret (Wall Mount)
desc: "Wall-mounted machine gun turrets are much smaller than their free-standing counterparts. They are housed in small semi-spherical cases which can be attached to walls or ceilings and if placed well can blend in with their environment easily. These smaller turrets fire 10mm ammunition but make up for their smaller bullet size with the high spread nature of their attacks and the likely hood of there being several in a single area. Although they have a small form factor, these turrets feature the same advanced targeting technology and biometric scanners as free-standing turrets. "
level: 5
type: Normal Creature
keywords: Robot
xp: 38
body_attr: 6
mind: 5
melee: 
guns: 3
other: 
hp: 9
initiative: 11
modifier: 11
defense: 2
ac: 2
phys_dr: 1 (All)
energy_dr: 1 (All)
rad_dr: Immune
poison_dr: Immune
attacks:
 - name: "`dice: 2d20|render|text(MACHINE GUN: BODY + Guns (TN 9))`"
   desc: "5 DC  Physical damage, Range M, [[Burst]], Fire Rate 3"
special_abilities:
  - name: "ROBOT:"
    desc: " The machine gun turret is a robot. It is immune to the effects of starvation, thirst, and suffocation. It is also immune to Poison and Radiation damage. However, machines cannot use food and drink or other consumables, they do not heal naturally, and the Medicine skill cannot be used to heal them: damage to them must be repaired (p.34 Core Rulebook)."
  - name: "IMMUNE TO POISON:"
    desc: "The machine gun turret reduces all Poison damage suffered to 0 and cannot suffer any damage or effects from poison"
  - name: "IMMUNE TO RADIATION:"
    desc: "The machine gun turret reduces all Radiation damage suffered to 0 and cannot suffer any damage or effects from radiation."
  - name: "IMMUNE TO DISEASE:"
    desc: "The machine gun turret is immune to the effects of all diseases, and they will never suffer the symptoms of any disease."
  - name: "LITTLE:"
    desc: "The machine gun turret is smaller than most characters. Its normal HP is reduced to Body + ½ level (rounded up), but its Defense is increased by 1. Further, it is slain by any hit which inflicts an Injury."
scavenge_rules:
 - name: "SALVAGE:"
   desc: " Scavengers can salvage from a destroyed machine gun turret with a successful **INT + Science** test with a difficulty of 1.\n This yields:\n 3d20 [[10mm round]]s\n 2 D6  uncommon materials."
```