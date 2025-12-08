```statblock
name: Hired Gun
desc: "A Hired Gun can be chosen as a companion by any character who takes the Hired Help perk. Hired guns are ready for a fight and don’t much care who they’re fighting, so long as they get enough caps to pay for ammo, a bed, and a few drinks. Many aspire to be more respectable mercenaries, but for now, they’re less picky about the work they take on."
level: 1
type:  Normal Character (Companion
keywords: Human
xp: 
strength: 6
per: 6
end: 6
cha: 4
int: 4
agi: 6
lck: 4
skills:
  - name: "Athletics"
    desc: "1"
  - name: "Melee Weapons"
    desc: "2 ⬛"
  - name: "Repair"
    desc: "1"
  - name: "Small Guns"
    desc: "3 ⬛"
  - name: "Survival"
    desc: "1"
  - name: "Unarmed"
    desc: "1"
hp: 7
initiative: As PC
modifier: As PC
defense: 1
ac: 1
carry_wt: 210 lbs.
melee_bonus: 0
luck_points: 0
phys_dr: "1 (Arms, Legs, Torso)"
energy_dr: "1 (Arms, Legs, Torso)"
rad_dr: "1 (All)"
poison_dr: "1 (All)"
attacks:
 - name: "`dice: 2d20|render|text(UNARMED STRIKE: STR + Unarmed (TN 7))`"
   desc: "2 D6 physical damage"
 - name: "`dice: 2d20|render|text(COMBAT KNIFE: STR + Melee Weapons (TN 8))`"
   desc: "3 D6 [[Piercing]] 1 physical damage"
 - name: "`dice: 2d20|render|text(SUBMACHINE GUN: AGI + Small Guns (TN 9))`"
   desc: "3 D6 [[Burst]] physical damage, Fire Rate 3, Range C, [[Inaccurate]], [[Two-Handed]]"
special_abilities:
- name: "READY TO FIGHT:"
  desc: "The hired gun is eager for violence. When you succeed at an attack, the hired gun attacks as well, choosing to make a ranged attack or a melee attack (it may need to move before making this attack). The hired gun attack hits automatically but inflicts half the listed damage (round up), to a minimum of 2 D6."
- name: "COMPANION:"
  desc: " The hired gun’s level is the same as yours and increases whenever you level up, representing ongoing upgrades and improvements. Increase one of the hired gun’s S.P.E.C.I.A.L. attributes by +1 when you reach level 3 or any odd-numbered level after that. Add +1 to a single skill at each level. Increase the hired gun’s HP by +1 per level, and with any increases to END. The hired gun receives an additional Perk at 5th level and every 5 levels."
scavenge_rules:
 - name: ""
   desc: "* [[Road Leathers]] \n* [[Combat Knife]] \n* [[Submachine Gun]] \n* 10+5 D6 shots of .[[45]] ammunition."
```


