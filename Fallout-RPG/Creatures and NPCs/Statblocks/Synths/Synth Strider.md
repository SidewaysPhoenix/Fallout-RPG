```statblock
name: Synth Strider
image: [[Synth Strider image.jpg]]
desc: "Synth striders are similar to ordinary synths in that they too do not possess the same sentience as those of the third generation and can also be found protecting Institute assets and locations. Striders however are second generation synths and resemble a human more than their first-generation counterparts. Often they have at least partial covering of their mechanical organs and limbs with what appears to be an early attempt at synthetic skin, though for many synths this has aged poorly and is missing in places to expose the robotics beneath. Synth striders also have faces which more closely resemble a human face, with some having near complete facialfeatures, though they seem to lack hair. They are stronger and hardier than first-generation synths and are more capable in a fight."
level: 7
type: Normal Creature
keywords: Robotic Synth
xp: 52
body_attr: 6
mind: 6
melee: 4
guns: 4
other: 3
hp: 13
initiative: 12
modifier: 12
defense: 1
ac: 1
phys_dr: 3 (All)
energy_dr: 4 (All)
rad_dr: Immune
poison_dr: Immune
attacks:
 - name: "`dice: 2d20|render|text(INSITITUE LASER: BODY + Guns (TN 10))`"
   desc: "4 D6  [[Vicious]] Energy damage, [[Burst]], Fire Rate 3, Range M"
 - name: "`dice: 2d20|render|text(SHOCK BATON: BODY + Melee (TN 10))`"
   desc: "5 D6  Energy damage, Range C"
special_abilities:
  - name: "ROBOT:"
    desc: "The synth strider is a robot. They are immune to the effects of starvation, thirst, and suffocation. They are also immune to Poison and Radiation damage. However, machines cannot use food and drink or other consumables, they do not heal naturally, and the Medicine skill cannot be used to heal them: damage to them must be repaired (p.34 Core Rulebook)."
  - name: "IMMUNE TO POISON:"
    desc: " The synth strider reduces all Poison damage suffered to 0 and cannot suffer any damage or effects from poison"
  - name: "IMMUNE TO RADIATION:"
    desc: "The synth strider reduces all Radiation damage suffered to 0 and cannot suffer any damage or effects from radiation."
  - name: "IMMUNE TO FEAR:"
    desc: "The synth strider cannot be intimidated or threatened in any way and either ignores or attacks anyone who attempts to threaten or intimidate it."
  - name: "IMMUNE TO DISEASE:"
    desc: "The synth strider is immune to the effects of all diseases, and they will never suffer the symptoms of any disease."
scavenge_rules:
 - name: ""
   desc: "[[Institute Laser]]=([[Photon Agitator]], [[Long Barrel]], [[Short Scope]])\n [[Baton]] ([[Electrified]])\n 3d20 [[Fusion Cell]]s\n [[Sturdy Synth Helmet]]\n [[Sturdy Synth Chest Piece]]\n [[Sturdy Synth Leg]] x2\n [[Sturdy Synth Arm]] x2"
```