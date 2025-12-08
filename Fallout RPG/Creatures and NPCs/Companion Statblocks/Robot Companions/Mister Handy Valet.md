```statblock
name: Mister Handy Valet
desc: "A Mister Handy Valet can be chosen as a companion by any character who takes the Robot Wrangler perk. A basic model of the common and versatile Mister Handy robot, these machines are able assistants and attendants that can easily be adapted to their owner’s needs."
level: 1
type: Normal Character (Companion)
keywords: Robot
xp: 
strength: 5
per: 6
end: 5
cha: 5
int: 6
agi: 5
lck: 4
skills:
  - name: "Energy Weapons"
    desc: "3 ⬛"
  - name: "Medicine"
    desc: "1"
  - name: "Melee Weapons"
    desc: "1"
  - name: "Repair"
    desc: "2"
  - name: "Small Guns"
    desc: "1"
  - name: "Speech"
    desc: "3 ⬛"
  - name: ""
    desc: ""
  - name: ""
    desc: ""
  - name: ""
    desc: ""
  - name: ""
    desc: ""
  - name: ""
    desc: ""
  - name: ""
    desc: ""
hp: 6
initiative: As PC
modifier: As PC
defense: 1
ac: 1
carry_wt: 150 lbs.
melee_bonus: 
luck_points: 
phys_dr: "1 (All)"
energy_dr: ""
rad_dr: "Immune"
poison_dr: "Immune"
attacks:
 - name: "`dice: 2d20|render|text(PINCER: STR + Melee Weapons (TN 6))`"
   desc: "3 D6 physical damage, Range C"
 - name: "`dice: 2d20|render|text(BUZZSAW: STR + Melee Weapons (TN 6))`"
   desc: "3 D6 [[Piercing]] physical damage, Range C"
 - name: "`dice: 2d20|render|text(FLAMER: AGI + Energy Weapons (TN 8))`" 
   desc: "3 D6 [[Persistent]] energy damage, Fire Rate 1, Range C"
special_abilities:
- name: "ROBOT:"
  desc: "Mr. Handy is a robot. They are immune to the effects of starvation, thirst, suffocation. They are also immune to poison and radiation damage. However, machines cannot use food and drink or other consumables, they do not heal naturally, and the Medicine skill cannot be used to heal them: damage to them must be repaired."
- name: "IMMUNE TO POISON:"
  desc: "The Mr. Handy reduces all poison damage suffered to 0 and cannot suffer any damage or effects from poison."
- name: "IMMUNE TO RADIATION:"
  desc: "The Mr. Handy reduces all radiation damage suffered to 0 and cannot suffer any damage or effects from radiation."
- name: "IMMUNE TO DISEASE:"
  desc: " The Mr. Handy is immune to the effects of all diseases, and they will never suffer the symptoms of any disease."
- name: "MR. HANDY:"
  desc: "The Mr. Handy has 360° vision, and improved sensory systems that can detect smells, chemicals, and radiation, reducing the difficulty of **PER** tests that rely on sight and smell by 1. It moves through jet propulsion, hovering above the ground, unaffected by difficult terrain or obstacles."
- name: "COORDINATED:"
  desc: "Your companion takes a little more initiative to help you out. When you take a major action, if the companion does not assist, then you may spend 1 AP to allow the companion to take a major action of your choice, rolling their own skill test as if they were a player character."
- name: "COMPANION:"
  desc: " Mister Handy’s level is the same as yours and increases whenever you level up, representing ongoing upgrades and improvements. Increase one of Mister Handy’s S.P.E.C.I.A.L. attributes by +1 when you reach level 3 or any odd-numbered level after that. Add +1 to a single skill at each level. Increase Mister Handy’s HP by +1 per level, and with any increases to **END**. Mister Handy’s receives an additional Perk at 5th level and every 5 levels."
scavenge_rules:
 - name: ""
   desc: "Mister Handy carries 8+4 D6 shots of flamer fuel when first recruited."
```


