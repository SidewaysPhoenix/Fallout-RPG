```statblock
name: Paladin
desc: "Paladins are the prize soldier within the Brotherhood’s forces. Equipped with Power Armor and the best weapons the Brotherhood can offer, they represent the veterans of the Brotherhood and often those who are decorated fighters. Achieving the rank of Paladin requires an individual to show both extreme devotion to the Brotherhood and have an impressive record and is a rank many aspire to achieve."
level: 8
type: Notable Character
keywords: Human
xp: 120
strength: 7\n (11)
per: 9
end: 8
cha: 6
int: 6
agi: 6
lck: 4
skills:
  - name: "Athletics"
    desc: "2"
  - name: "Energy Weapons"
    desc: "4 ⬛"
  - name: "Pilot"
    desc: "1"
  - name: "Repair"
    desc: "2"
  - name: "Science"
    desc: "3 ⬛"
  - name: "Small Guns"
    desc: "2"
  - name: "Speech"
    desc: "3"
  - name: "Unarmed"
    desc: "3 ⬛"
hp: 20 (10 Head, 10 Arms, 10 Legs, 21 Torso)
initiative: 17
modifier: 17
defense: 1
ac: 1
carry_wt: 360 lbs.
melee_bonus: +3 D6
luck_points: 2
phys_dr: 7 (Head), 9 (Torso), 6 (Arms, Legs)
energy_dr: 6 (Head), 8 (Torso), 5 (Arms, Legs)
rad_dr: 7 (Head, Arms, Legs), 9 (Torso)
poison_dr: 0
attacks:
 - name: "`dice: 2d20|render|text(UNARMED STRIKE: STR + Unarmed (TN 14))`"
   desc: "5 D6  Physical damage"
 - name: "`dice: 2d20|render|text(IMPROVED LONG LASER RIFLE: PER + Energy Weapons (TN 14))`"
   desc: "6 D6  [[Piercing]] 1 Energy damage, Range M, Fire Rate 2, [[Two-Handed]]"
special_abilities:
- name: "POWER ARMOR:"
  desc: "A Brotherhood Paladin wears Power Armor. They use the armor’s **STR** of 11 instead of their own. They are immune to damage from falling and inflict 3 D6  physical damage to all creatures within Reach of their landing. They can breathe underwater and in toxic environments. See p.137 Core Rule Book."
- name: "THE CHAIN THAT BINDS:"
  desc: "As a major action, a Paladin can order a Brotherhood character of lower level to immediately perform a major action. The Paladin assists that action with **CHA + Speech**."
- name: "WELL-EQUIPPED:"
  desc: "Once per combat, the Paladin may ‘let rip’ with a volley from their Improved Long Laser Rifle. This adds the weapon’s Fire Rate of 2 to the weapon’s damage for a single attack (for 8 D6  total)"
scavenge_rules:
 - name: ""
   desc: "[[Power Armor Frame]]\n [[T-60 Helm]]\n [[T-60 Chest Piece]]\n [[T-60 Arm]]\n [[T-60 Leg]]\n Improved Long Laser Rifle=[[Laser Gun]] ([[Long Barrel]], [[Standard Stock]])\n Brotherhood of Steel Holotags"
```

