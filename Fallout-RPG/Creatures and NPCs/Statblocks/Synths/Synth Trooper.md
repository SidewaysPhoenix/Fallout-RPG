```statblock
name: Synth Trooper
desc: "Used as the standard ‘soldier’ for the Institute, synth troopers are second-generation synths who are built to withstand heavy combat. While they share many similarities to other second-generation synths, such as having a full ‘skin’ covering and vaguely complete human features, they do not look human in the way third-generation synths do. They do however, have significant upgrades to their ability to use both ranged and melee weapons, and also wear armor which is built onto their bodies, making them significantly more durable in combat. Often one or more troopers can be in groups with other synths and synth striders, carrying Institute weaponry"
level: 16
type: Normal Creature
keywords: Robotic Synth
xp: 52
body_attr: 10
mind: 6
melee: 5
guns: 5
other: 5
hp: 26
initiative: 16
modifier: 16
defense: 1
ac: 1
phys_dr: 3 (All)
energy_dr: 4 (All)
rad_dr: Immune
poison_dr: Immune
attacks:
 - name: "`dice: 2d20|render|text(INSITITUE LASER: BODY + Guns (TN 15))`"
   desc: "4 D6  [[Vicious]] Energy damage, [[Burst]], Fire Rate 3, Range M"
 - name: "`dice: 2d20|render|text(SHOCK BATON: BODY + Melee (TN 15))`"
   desc: "5 D6  Energy damage, Range C"
special_abilities:
  - name: "ROBOT:"
    desc: "The synth trooper is a robot. They are immune to the effects of starvation, thirst, and suffocation. They are also immune to Poison and Radiation damage. However, machines cannot use food and drink or other consumables, they do not heal naturally, and the Medicine skill cannot be used to heal them: damage to them must be repaired (p.34 Core Rulebook)."
  - name: "IMMUNE TO POISON:"
    desc: "The synth trooper reduces all Poison damage suffered to 0 and cannot suffer any damage or effects from poison."
  - name: "IMMUNE TO RADIATION:"
    desc: "The synth trooper reduces all Radiation damage suffered to 0 and cannot suffer any damage or effects from radiation."
  - name: "IMMUNE TO DISEASE:"
    desc: "The synth trooper is immune to the effects of all diseases, and they will never suffer the symptoms of any disease"
  - name: "IMMUNE TO FEAR:"
    desc: "The synth trooper cannot be intimidated or threatened in any way and either ignores or attacks anyone who attempts to threaten or intimidate it."
  - name: "AGGRESSIVE:"
    desc: "The synth trooper is quick to action when it senses prey. When the synth trooper enters a scene, immediately generate 1 Action Point. If the synth trooper is an ally, then this goes into the group pool. If it is an enemy, it goes into the GM’s pool."
scavenge_rules:
 - name: ""
   desc: "[[Institute Laser]] Gun=([[Photon Agitator]], [[Long Barrel]], [[Short Scope]])\n [[Baton]] ([[Electrified]])\n 3d20 [[Fusion Cell]]s\n [[Sturdy Synth Helmet]]\n [[Sturdy Synth Chest Piece]]\n [[Sturdy Synth Leg]] x2\n [[Sturdy Synth Arm]] x2"
```