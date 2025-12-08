```statblock
name: Wastelander
desc: "Wastelander is the colloquial name given to the masses of individuals who roam, travel, and settle across the wasteland. Many are unextraordinary people who just seek to survive by any means necessary. Some are more competent than others when it comes to combat, while others might possess unique skills reflecting their background and life experience. They can hail from any settlement across the commonwealth and from any background. "
level: 2
type: Normal Character
keywords: Human
xp: 17
strength: 6
per: 5
end: 7
cha: 4
int: 5
agi: 5
lck: 4
skills:
  - name: "Athletics"
    desc: "1"
  - name: "Barter"
    desc: "1"
  - name: "Melee Weapons"
    desc: "2"
  - name: "Repair"
    desc: "1"
  - name: "Small Guns"
    desc: "2 ⬛"
  - name: "Speech"
    desc: "1"
  - name: "Survivial"
    desc: "2 ⬛"
  - name: "Unarmed"
    desc: "1"
hp: 9
initiative: 10
modifier: 10
defense: 1
ac: 1
carry_wt: 210 lbs.
melee_bonus: 
luck_points: 
phys_dr: 1 (Arms, Legs, Torso)
energy_dr: 1 (Arms, Legs, Torso)
rad_dr: 0
poison_dr: 0
attacks:
 - name: "`dice: 2d20|render|text(UNARMED STRIKE: STR + Unarmed (TN 7))`"
   desc: "2 D6  Physical damage"
 - name: "`dice: 2d20|render|text(MACHETE: STR + Melee Weapons (TN 8))`"
   desc: "3 D6  [[Piercing]] 1 Physical damage"
 - name: "`dice: 2d20|render|text(DOUBLE-BARRELLED SHOTGUN: AGI + Small Guns (TN 7))`"
   desc: "5 D6  [[Spread]], [[Vicious]] Physical damage, Range C, [[Inaccurate]], [[Two-Handed]]"
special_abilities:
- name: ""
  desc: "None"
scavenge_rules:
 - name: ""
   desc: "[[Road Leathers]]\n [[Double-Barrel Shotgun]]\n [[Machete]]\n Wealth 1"
```
![[Wastelander image.jpg]]