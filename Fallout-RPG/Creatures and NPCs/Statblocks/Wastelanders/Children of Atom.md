```statblock
name: Children of Atom
image: [[Children of Atom image.jpg]]
desc: "Some claim they are religious fanatics; others see them as a cult, but either way the Children of Atom can be found across the wasteland worshiping radioactive material and its effects. They often congregate in sites that are high in radiation, even more so if there is something physical for them to worship such as the impact crater of a nuclear bomb. Strangely, the Children of Atom seem to suffer decreased effects to radiation, with some living near sources a hundred times the safe limit without suffering sickness or ghoulification. When encountered in the wasteland they often try to spread the word of Atom, but some groups can be paranoid and turn hostile towards outsiders."
level: 6
type: Normal Character
keywords: Human
xp: 45
strength: 5
per: 5
end: 6
cha: 8
int: 5
agi: 5
lck: 4
skills:
  - name: "Barter"
    desc: "1"
  - name: "Energy Weapons"
    desc: "3"
  - name: "Melee Weapons"
    desc: "1"
  - name: "Repair"
    desc: "1"
  - name: "Sneak"
    desc: "2"
  - name: "Speech"
    desc: "3 ⬛"
  - name: "Survival"
    desc: "4 ⬛"
hp: 12
initiative: 10
modifier: 10
defense: 1
ac: 1
carry_wt: 200 lbs.
melee_bonus: 
luck_points: 
phys_dr: 1 (Arms, Legs, Torso)
energy_dr: 1 (Arms, Legs, Torso)
rad_dr: 2 (All)
poison_dr: 0
attacks:
 - name: "`dice: 2d20|render|text(UNARMED: STR + Unarmed (TN 5))`"
   desc: "2 D6  Physical damage"
 - name: "`dice: 2d20|render|text(GAMMA GUN: PER + Energy Weapons (TN 8))`"
   desc: "3 D6  [[Piercing]] [[Stun]] Radiation damage, Fire Rate 1, Range M, [[Blast]], [[Inaccurate]]"
special_abilities:
- name: "ATOMS GLOW:"
  desc: "Children of Atom are used to living in some of the most radioactive parts of the wasteland, and often seem to suffer little to no effect from the radiation. Whether this is luck, genetic disposition or truly proof of Atom’s existence, they gain +2 to their Radiation DR"
scavenge_rules:
 - name: ""
   desc: "[[Tough Clothing]]\n [[Gamma Gun]]\n 2d20 [[Gamma Round]]s\n Wealth 1"
```