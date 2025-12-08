```statblock
name: Minuteman
desc: "Sometimes thought of as the people’s militia, the Minutemen were once a prominent faction throughout the Commonwealth. Their influence has dwindled in recent years however but several them still do what they can to help those in need. From helping to establish settlements and then defending them from dangers, the sight of a Minute Man is always welcome."
level: 7
type: Normal Character
keywords: Human
xp: 39
strength: 6
per: 7
end: 5
cha: 7
int: 5
agi: 5
lck: 4
skills:
  - name: "Athletics"
    desc: "1"
  - name: "Energy Weapons"
    desc: "3 ⬛"
  - name: "Medicine"
    desc: "1"
  - name: "Melee Weapons"
    desc: "2"
  - name: "Repair"
    desc: "2"
  - name: "Small Guns"
    desc: "2"
  - name: "Sneak"
    desc: "1"
  - name: "Speech"
    desc: "2"
  - name: "Survival"
    desc: "2 ⬛"
hp: 12
initiative: 12
modifier: 12
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
 - name: "`dice: 2d20|render|text(UNARMED STRIKE: STR + Unarmed (TN 6))`"
   desc: "3 D6  Physical damage"
 - name: "`dice: 2d20|render|text(LASER MUSKET: AGI + Energy Weapons (TN 8))`"
   desc: "5 D6  [[Piercing]] Energy damage, Range M, [[Two-Handed]]"
special_abilities:
- name: ""
  desc: "None"
scavenge_rules:
 - name: ""
   desc: "[[Tough Clothing]]\n Wealth 2"
```