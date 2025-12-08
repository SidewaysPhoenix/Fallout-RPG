```statblock
name: Knight
desc: "The rank of Knight among the Brotherhood of Steel is a much respected one. Knights are often responsible for maintaining weapons, armor, and technology within the brotherhood’s possession. Reaching this rank is not easy and requires dedication and years of service. Many who reach this rank are ambitious and aspire to move upwards towards the prestigious rank of Paladin."
level: 7
type: Normal Character
keywords: Human
xp: 52
strength: 6
per: 6
end: 7
cha: 5
int: 5
agi: 6
lck: 4
skills:
  - name: "Athletics"
    desc: "1"
  - name: "Big Guns"
    desc: "1"
  - name: "Energy Weapons"
    desc: "4 ⬛"
  - name: "Pilot"
    desc: "1"
  - name: "Repair"
    desc: "1"
  - name: "Science"
    desc: "3 ⬛"
  - name: "Small Guns"
    desc: "1"
  - name: "Speech"
    desc: "2"
  - name: "Unarmed"
    desc: "2"
hp: 14
initiative: 12
modifier: 12
defense: 1
ac: 1
carry_wt: 110 lbs.
melee_bonus: 
luck_points: 
phys_dr: 2 (All)
energy_dr: 2 (All)
rad_dr: 1 (All)
poison_dr: 0
attacks:
 - name: "`dice: 2d20|render|text(UNARMED STRIKE: STR + Unarmed (TN 8))`"
   desc: "2 D6  Physical damage"
 - name: "`dice: 2d20|render|text(LONG LASER RIFLE: PER + Energy Weapons (TN 10))`"
   desc: "5 D6  [[Piercing]] 1 Energy damage, Range M, Fire Rate 2, [[Two-Handed]]"
special_abilities:
- name: "THE CHAIN THAT BINDS:"
  desc: "As a major action, a Knight can order a Brotherhood character of lower level to immediately perform a major action. The Knight assists that action with **CHA + Speech**."
- name: "WELL-EQUIPPED:"
  desc: "Twice per combat, the Knight may ‘let rip’ with a volley from their Long Laser Rifle. This adds the weapon’s Fire Rate of 2 to the weapon’s damage for a single attack (for 7 D6 total)."
scavenge_rules:
 - name: ""
   desc: "[[Brotherhood of Steel Uniform]]\n [[Combat Helmet]]\n [[Combat Chest Piece]]\n [[Combat Leg]]\n [[Combat Arm]]\n Long Laser Rifle=[[Laser Gun]] ([[Long Barrel]], [[Standard Stock]])\n Brotherhood of Steel Holotags"
```

