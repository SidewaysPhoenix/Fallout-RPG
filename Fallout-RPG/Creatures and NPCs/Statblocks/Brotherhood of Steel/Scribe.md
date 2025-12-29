```statblock
name: Scribe
image: [[BOS Scribe image.jpg]]
desc: "Scribes are the recordkeepers and scholars of the Brotherhood of Steel. While they can fight and receive the same basic combat training as any other member, this is not their primary role. Scribes handle the cataloguing, repair, acquisition, and study of anytechnology that finds its way into the Brotherhood’s hands. They sometimes accompany field units if their expertise is required in retrieving or locating an artifact of importance, but most Scribes stay within the base of operations of the chapter. "
level: 4
type: Notable Character
keywords: Human
xp: 31
strength: 5
per: 6
end: 5
cha: 5
int: 7
agi: 5
lck: 4
skills:
  - name: "Energy Weapons"
    desc: "2"
  - name: "Lockpick"
    desc: "1"
  - name: "Medicince"
    desc: "1"
  - name: "Repair"
    desc: "2"
  - name: "Science"
    desc: "4 ⬛"
  - name: "Sneak"
    desc: "2"
  - name: "Speech"
    desc: "2 ⬛"
  - name: "Survival"
    desc: "1"
hp: 9
initiative: 11
modifier: 11
defense: 1
ac: 1
carry_wt: 200 lbs.
melee_bonus: 
luck_points: 
phys_dr: 1 (Arms, Legs, Torso)
energy_dr: 2 (Arms, Legs, Torso)
rad_dr: 2 (Arms, Legs, Torso)
poison_dr: 0
attacks:
 - name: "`dice: 2d20|render|text(UNARMED STRIKE: STR + Unarmed (TN 5))`"
   desc: "5 D6  Physical damage"
 - name: "`dice: 2d20|render|text(LASER PISTOL: PER + Energy Weapons (TN 8))`"
   desc: "4 D6  [[Piercing]] 1 Energy damage, Range C, Fire Rate 2, [[Close Quarters]]"
special_abilities:
- name: "THE CHAIN THAT BINDS:"
  desc: " As a major action, a Scribe can order a Brotherhood character of lower level to immediately perform a major action. The Scribe assists that action with **CHA + Speech**."
- name: "PRE-WAR EXPERTISE:"
  desc: "The Scribe gains a bonus d20 when making tests to examine, identify or use pre-War technology."
scavenge_rules:
 - name: ""
   desc: "[[Brotherhood Scribe’s Armor]]\n Laser Pistol=[[Laser Gun]]\n Brotherhood of Steel Holotags\n Wealth 2"
```
