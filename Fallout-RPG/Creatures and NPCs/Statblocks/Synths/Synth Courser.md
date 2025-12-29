```statblock
name: Synth Courser
image: [[Synth Courser image.jpg]]
desc: "Synth coursers are feared by those who know of their existence. These third-generation synths act under the Synth Retention Bureau branch of the Institute, who send them out to reclaim escaped synths, as well as a number of other sensitive missions. Coursers are highly trained and possess abnormally high strength and constitution. When a third-generation synth is selected to become a courser, they receive upgrades to their neurological implants that gives them specialist weapons, combat, and espionage knowledge in order for them to carry out their missions. They also receive an implant of a courser chip, which allows them to be tracked and provides them the ability to teleport in and out of the Institute. Coursers all have the ‘X’ designation as the first letter oftheir identification number. "
level: 11
type: Notable Character
keywords: Robotic Synth
xp: 162
strength: 7
per: 8
end: 8
cha: 6
int: 8
agi: 7
lck: 4
skills:
  - name: "Energy Weapons"
    desc: "4 ⬛"
  - name: "Lockpick"
    desc: "2"
  - name: "Melee Weapons"
    desc: "3"
  - name: "Repair"
    desc: "3"
  - name: "Science"
    desc: "4 ⬛"
  - name: "Sneak"
    desc: "4 ⬛"
  - name: "Speech"
    desc: "3"
  - name: "Unarmed"
    desc: "2"
hp: 23
initiative: 17
modifier: 17
defense: 2
ac: 2
carry_wt: 220 lbs.
melee_bonus: +1 D6
luck_points: 2
phys_dr: "4 (Arms, Legs Torso); 2 (Head)"
energy_dr: "5 (Arms, Legs Torso); 2 (Head)"
rad_dr: Immune
poison_dr: Immune
attacks:
 - name: "`dice: 2d20|render|text(UNARMED STRIKE: STR + Unarmed (TN 9))`"
   desc: "2 D6  Physical damage"
 - name: "`dice: 2d20|render|text(INSITITUE LASER: PER + Energy Weapons (TN 12))`"
   desc: "5 D6  [[Vicious]], [[Piercing]] 1 Energy damage, [[Burst]], Fire Rate 3, [[Inaccurate]], [[Two-Handed]], Range C"
special_abilities:
- name: "ROBOT:"
  desc: "The synth courser is a robot. They are immune to the effects of starvation, thirst, and suffocation. They are also immune to Poison and Radiation damage. However, machines cannot use food and drink or other consumables, they do not heal naturally, and the Medicine skill cannot be used to heal them: damage to them must be repaired (p.34 Core Rulebook)."
- name: "IMMUNE TO POISON:"
  desc: "The synth courser reduces all Poison damage suffered to 0 and cannot suffer any damage or effects from poison."
- name: "IMMUNE TO RADIATION:"
  desc: "The synth courser reduces all Radiation damage suffered to 0 and cannot suffer any damage or effects from radiation."
- name: "IMMUNE TO FEAR:"
  desc: " The synth courser cannot be intimidated or threatened in any way and either ignores or attacks anyone who attempts to threaten or intimidate it."
- name: "IMMUNE TO DISEASE:"
  desc: "The synth courser is immune to the effects of all diseases, and they will never suffer the symptoms of any disease."
- name: "INSTITUTE ACCESS:"
  desc: "The synth courser can make use of the teleporter technology used by the Institute to enter and leave the Institute as needed"
- name: "THIRD-GENERATION SYNTH:"
  desc: "These synths can pass as human, and any attempt to inspect them reveals them to be human. Third-generation synths can only be identified after death by the recovery of their Synth Component. A Third generation synth posing as a known figure gains a bonus 2d20 to any rolls relating to impersonating the individual, including recalling knowledge and expressing their mannerisms."
scavenge_rules:
 - name: ""
   desc: "Synth Component\n [[Heavy Synth Chest Piece]]\n [[Heavy Synth Arm]]\n [[Heavy Synth Leg]]\n [[Institute Laser]] Rifle=([[Full Stock]], [[Photon Agitator]], [[Improved Barrel]])"
```