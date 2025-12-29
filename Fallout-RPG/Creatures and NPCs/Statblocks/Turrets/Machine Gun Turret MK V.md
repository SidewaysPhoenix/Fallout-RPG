```statblock
name: Machine Gun Turret MK V
image: [[Machine Gun Turret image.jpg]]
desc: "The MK V version of the machine gun turret is like its predecessors in many ways. These turrets however were designed to not only pepper their targets with bullets, but also to stun them as well, making them more susceptible to the heavy fire. MK V turrets use incendiary 5.56mm ammunition and can be spotted by their darker grey-green paint scheme. "
level: 14
type: Normal Creature
keywords: Robot
xp: 102
body_attr: 9
mind: 6
melee: 
guns: 5
other: 
hp: 23
initiative: 15
modifier: 15
defense: 1
ac: 1
phys_dr: 4 (All)
energy_dr: 2 (All)
rad_dr: Immune
poison_dr: Immune
attacks:
 - name: "`dice: 2d20|render|text(MACHINE GUN: BODY + Guns (TN 14))`"
   desc: "9 D6  [[Stun]] Physical damage, Range M, [[Burst]], Fire Rate 3"
special_abilities:
  - name: "ROBOT:"
    desc: "The machine gun turret is a robot. It is immune to the effects of starvation, thirst, and suffocation. It is also immune to Poison and Radiation damage. However, machines cannot use food and drink or other consumables, they do not heal naturally, and the Medicine skill cannot be used to heal them: damage to them must be repaired (p.34 Core Rulebook)."
  - name: "IMMUNE TO POISON:"
    desc: " The machine gun turret reduces all Poison damage suffered to 0 and cannot suffer any damage or effects from poison"
  - name: "IMMUNE TO RADIATION:"
    desc: " The machine gun turret reduces all Radiation damage suffered to 0 and cannot suffer any damage or effects from radiation."
  - name: "IMMUNE TO DISEASE:"
    desc: "The machine gun turret is immune to the effects of all diseases, and they will never suffer the symptoms of any disease."
scavenge_rules:
 - name: "SALVAGE:"
   desc: "Scavengers can salvage from a destroyed machine gun turret with a successful **INT + Science** test with a difficulty of 1.\n This yields:\n 3d20 [[5.56mm]] rounds\n 2 D6  uncommon materials."
```