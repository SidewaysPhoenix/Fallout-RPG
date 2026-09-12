```statblock
name: "Prime's Mutant"
image: "[[Super Mutant image.jpg]]"
desc: "Standing at around seven-feet tall, the green skin and bulky muscular form of a super mutant is impossible to miss. Though often mocked for their intelligence, they are capable fighters and possess an understanding of weapons and armor. They areusually found in groups of at least two or more, and usually act beneath a superior super mutant who leads the group. Sometimes they can be found accompanied by mutant hounds."
level: "12"
type: "Normal Character"
keywords: "Mutated Human"
xp: "38"
strength: 9
per: 5
end: 7
cha: 4
int: 8
agi: 5
lck: 4
skills:
  - name: "Big Guns"
    desc: "2"
  - name: "Melee Weapons"
    desc: "6 ⬛"
  - name: "Small Guns"
    desc: "5"
  - name: Survival
    desc: "5 ⬛"
  - name: Unarmed
    desc: "2"
hp: 19
initiative: 10
modifier: "10"
defense: 1
ac: "1"
carry_wt: "240 lbs."
melee_bonus: "+2 D6"
luck_points: "1"
phys_dr: "5 (All)"
energy_dr: "5 (All)"
rad_dr: "0"
poison_dr: "0"
attacks:
  - name: "`dice: 2d20|render|text(UNARMED STRIKE: STR + Unarmed (TN 11))`"
    desc: "4 D6  Physical damage"
  - name: "`dice: 2d20|render|text(SUPER SLEDGE: STR + Melee Weapons (TN 15))`"
    desc: "6 D6  [[Breaking]] Physical damage, [[Two-Handed]]"
  - name: "`dice: 2d20|render|text(ASSAULT RIFLE: AGI + Small Guns (TN 10))`"
    desc: "5 D6  [[Burst]] Physical damage, Range M, Fire Rate 2, [[Two-Handed]]"
special_abilities:
  - name: "BARBARIAN:"
    desc: "+2 to Physical and Energy damage resistances (included)."
  - name: "IMMUNE TO RADIATION:"
    desc: "The super mutant reduces all Radiation damage suffered to 0 and cannot suffer any damage or effects from radiation."
  - name: "IMMUNE TO POISON:"
    desc: "The super mutant reduces all Poison damage suffered to 0 and cannot suffer any damage or effects from poison."
scavenge_rules:
  - name: ""
    desc: "[[Fallout-RPG/Items/Weapons/Small Guns/Assault Rifle|Assault Rifle]]\n [[Fallout-RPG/Items/Weapons/Melee/Super Sledge|Super Sledge]]\n assorted human bones\n Wealth 3"
```