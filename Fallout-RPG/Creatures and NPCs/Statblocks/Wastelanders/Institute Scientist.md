```statblock
name: Institute Scientist
image: [[Institute Scientist image.jpg]]
desc: "Most of the human individuals who reside within the Institute are scientists with varying backgrounds and fields of specialty. They can oversee projects that require knowledge of everything from robotics, biology, synthetic tissue creation, physics and genetics to name just a few and are the Institute's best resource for improving and developing technology."
level: 7
type: Normal Character
keywords: Human
xp: 39
strength: 4
per: 8
end: 5
cha: 5
int: 8
agi: 5
lck: 4
skills:
  - name: "Energy Weapons"
    desc: "2"
  - name: "Medicine"
    desc: "4 ⬛"
  - name: "Repair"
    desc: "4"
  - name: "Science"
    desc: "5 ⬛"
  - name: "Speech"
    desc: "3"
hp: 12
initiative: 12
modifier: 12
defense: 1
ac: 1
carry_wt: 190 lbs.
melee_bonus: 
luck_points: 
phys_dr: 0
energy_dr: 0
rad_dr: 0
poison_dr: 0
attacks:
 - name: "`dice: 2d20|render|text(UNARMED STRIKE: STR + Unarmed (TN 4))`"
   desc: "2 D6  Physical damage"
 - name: "`dice: 2d20|render|text(INSITITUE LASER: PER + Energy Weapons (TN 10))`"
   desc: " 4 D6  [[Vicious]] Energy damage, [[Burst]], Fire Rate 3, [[Close Quarters]], [[Inaccurate]]"
special_abilities:
- name: "LAB COAT:"
  desc: "Between the utility of the design, and simply feeling smarter while wearing one, a lab coat allows you to re-roll a single d20 on one **INT** based skill test you make each scene."
scavenge_rules:
 - name: ""
   desc: "[[Lab Coat]]\n [[Institute Laser]]\n 2d20 [[Fusion Cell]]s"
```