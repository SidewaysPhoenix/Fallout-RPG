```statblock
name: Machine Gun Turret MK III
image: [[Machine Gun Turret image.jpg]]
desc: "An improvement over the MK I model, the MK III was built to be much hardier, featuring improved armor plating and the use of high powered 5.56mm rounds. As with the MK I models, they also feature a dark green paint job, a tripod base, and the same enhanced targeting systems."
level: 10
type: Normal Creature
keywords: Robot
xp: 74
body_attr: 8
mind: 5
melee: 
guns: 4
other: 
hp: 18
initiative: 13
modifier: 13
defense: 1
ac: 1
phys_dr: 2 (All)
energy_dr: 1 (All)
rad_dr: Immune
poison_dr: Immune
attacks:
 - name: "`dice: 2d20|render|text(MACHINE GUN: BODY + Guns (TN 12))`"
   desc: "7 D6 Physical damage, Range M, [[Burst]], Fire Rate 3"
special_abilities:
  - name: "ROBOT:"
    desc: "The machine gun turret is a robot. It is immune to the effects of starvation, thirst, and suffocation. It is also immune to Poison and Radiation damage. However, machines cannot use food and drink or other consumables, they do not heal naturally, and the Medicine skill cannot be used to heal them: damage to them must be repaired (p.34 Core Rulebook)."
  - name: "IMMUNE TO POISON:"
    desc: " The machine gun turret reduces all Poison damage suffered to 0 and cannot suffer any damage or effects from poison."
  - name: "IMMUNE TO RADIATION:"
    desc: "The machine gun turret reduces all Radiation damage suffered to 0 and cannot suffer any damage or effects from radiation."
  - name: "IMMUNE TO DISEASE:"
    desc: " The machine gun turret is immune to the effects of all diseases, and they will never suffer the symptoms of any disease."
scavenge_rules:
 - name: "SALVAGE:"
   desc: "Scavengers can salvage from a destroyed machine gun turret with a successful **INT + Science** test with a difficulty of 1.\n This yields:\n 3d20 [[5.56mm]] rounds\n 2 D6  uncommon materials."
```