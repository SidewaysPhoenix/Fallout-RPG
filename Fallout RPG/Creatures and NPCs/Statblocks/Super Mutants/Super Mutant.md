```statblock
name: Super Mutant
desc: "Standing at around seven-feet tall, the green skin and bulky muscular form of a super mutant is impossible to miss. Though often mocked for their intelligence, they are capable fighters and possess an understanding of weapons and armor. They areusually found in groups of at least two or more, and usually act beneath a superior super mutant who leads the group. Sometimes they can be found accompanied by mutant hounds."
level: 5
type: Normal Character
keywords: Mutated Human
xp: 38
strength: 9
per: 5
end: 7
cha: 4
int: 4
agi: 5
lck: 4
skills:
  - name: "Big Guns"
    desc: "1"
  - name: "Melee Weapons"
    desc: "4 ⬛"
  - name: "Small Guns"
    desc: "3"
  - name: "Survival"
    desc: "3 ⬛"
  - name: "Unarmed"
    desc: "2"
hp: 12
initiative: 10
modifier: 10
defense: 1
ac: 1
carry_wt: 240 lbs.
melee_bonus: +2 D6
luck_points: 
phys_dr: 2 (All)
energy_dr: 2 (All)
rad_dr: 0
poison_dr: 0
attacks:
 - name: "`dice: 2d20|render|text(UNARMED STRIKE: STR + Unarmed (TN 11))`"
   desc: "4 D6  Physical damage"
 - name: "`dice: 2d20|render|text(BOARD: STR + Melee Weapons (TN 13))`"
   desc: "6 D6  Physical damage, [[Two-Handed]]"
 - name: "`dice: 2d20|render|text(PIPE BOLT-ACTION RIFLE: AGI + Small Guns (TN 8))`"
   desc: "5 D6  [[Piercing]] Physical damage, Range M, Fire Rate 0, [[Two-Handed]]"
special_abilities:
- name: "BARBARIAN:"
  desc: "+2 to Physical and Energy damage resistances (included)."
- name: "IMMUNE TO RADIATION:"
  desc: "The super mutant reduces all Radiation damage suffered to 0 and cannot suffer any damage or effects from radiation."
- name: "IMMUNE TO POISON:"
  desc: "The super mutant reduces all Poison damage suffered to 0 and cannot suffer any damage or effects from poison."
scavenge_rules:
 - name: ""
   desc: "[[Pipe Bolt-Action]]\n [[Board]]\n assorted human bones\n Wealth 1"
```
![[Super Mutant image.jpg]]