```statblock
name: Radroach
desc: "Cockroaches were a common pest in pre-War America, and after the bombs fell and brought about a nuclear apocalypse, not much changed. Dubbed as radroaches for their radioactive bite, these creatures are far larger than their ancestors but are still as much of a pest. Often infesting ruined buildings, rubbish heaps, and other dark, dank locations, they attack their prey by jumping at them and attacking with their pincers. While easy to deal with in small numbers, swarms can easily overwhelm the unprepared and devastate settlements if leftunchecked."
level: 1
type: Normal Creature
keywords: Mutated Insect
xp: 10
body_attr: 5
mind: 4
melee: 1
guns: 
other: 2
hp: 6
initiative: 9
modifier: 9
defense: 2
ac: 2
phys_dr: 0
energy_dr: 0
rad_dr: Immune
poison_dr: Immune
attacks:
 - name: "`dice: 2d20|render|text(BITE: BODY + Melee (TN 6))`"
   desc: "1 D6  [[Radioactive]] Physical damage"
special_abilities:
  - name: "IMMUNE TO RADIATION:"
    desc: "The radroach reduces all Radiation damage suffered to 0 and cannot suffer any damage or effects from radiation."
  - name: "IMMUNE TO POISON:"
    desc: "The radroach reduces all Poison damage suffered to 0 and cannot suffer any damage or effects from poison."
  - name: "LITTLE:"
    desc: "The radroach is smaller than most characters. The radroach’s normal HP is reduced to Body + ½ level (rounded up), but its Defense is increased by 1. Further, it is slain by any hit which inflicts an Injury."
  - name: "SNEAKY:"
    desc: "A radroach has a TN of 10 for Sneak tests, and rolls +1d20 on sneak attacks."
scavenge_rules:
 - name: "BUTCHERY:"
   desc: "Scavengers can butcher a dead radroach with a successful **END + Survival** test with a difficulty of 0.\n This yields:\n 1 portion of [[Radroach Meat]]."
```