```statblock
name: Raider
image: [[Raider image.jpg]]
desc: "The average raider is not much of a threat on their own, but unfortunately for most travelers, they are very rarely alone. Raiders usually wear patchwork armor assembled from the belongings of their previous victims, and carry weapons salvaged from them, as well. Most are hostile to anyone outside of their own gang and will even fight raiders from other rival groups."
level: 2
type: Normal Character
keywords: Human Raider
xp: 17
strength: 6
per: 5
end: 6
cha: 4
int: 5
agi: 6
lck: 4
skills:
  - name: "Medicine"
    desc: "1"
  - name: "Melee Weapons"
    desc: "2 ⬛"
  - name: "Repair"
    desc: "1"
  - name: "Small Guns"
    desc: "2 ⬛"
  - name: "Sneak"
    desc: "1"
  - name: "Survival"
    desc: "1"
  - name: "Throwing"
    desc: "1"
  - name: "Unarmed"
    desc: "2"
hp: 8
initiative: 11
modifier: 11
defense: 1
ac: 1
carry_wt: 110 lbs.
melee_bonus: 
luck_points: 
phys_dr: 1 (Arms, Torso, Legs)
energy_dr: 1 (Arms, Torso, Legs)
rad_dr: 0
poison_dr: 0
attacks:
 - name: "`dice: 2d20|render|text(UNARMED STRIKE: STR + Unarmed (TN 8))`"
   desc: "2 D6  Physical damage"
 - name: "`dice: 2d20|render|text(TIRE IRON: STR + Melee Weapons (TN 8))`"
   desc: "4 D6  Physical damage"
 - name: "`dice: 2d20|render|text(PIPE GUN: AGI + Small Guns (TN 8))`"
   desc: "3 D6  Physical damage, Range C, Fire Rate 2, [[Close Quarters]], [[Unreliable]]"
special_abilities:
- name: "LET RIP:"
  desc: "Once per combat, the Raider may ‘let rip’ with a volley from their [[Pipe Gun]]. This adds the weapon’s Fire Rate of 2 to the weapon’s damage for a single attack (for 5 D6  total)."
scavenge_rules:
 - name: ""
   desc: "[[Road Leathers]]\n [[Pipe Gun]]\n [[Tire Iron]]\n Wealth 1"
```