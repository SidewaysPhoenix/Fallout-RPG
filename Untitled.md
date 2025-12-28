```statblock
name: Radroach
desc: "Cockroaches were a common pest in pre-War America, and after the bombs fell and brought about a nuclear apocalypse, not much changed. Dubbed as radroaches for their radioactive bite, these creatures are far larger than their ancestors but are still as much of a pest. Often infesting ruined buildings, rubbish heaps, and other dark, dank locations, they attack their prey by jumping at them and attacking with their pincers. While easy to deal with in small numbers, swarms can easily overwhelm the unprepared and devastate settlements if leftunchecked."
level: "1"
type: "Legendary Creature"
keywords: "Mutated Insect"
xp: "30"
body_attr: 7
mind: 6
melee: "1"
guns: ""
other: "2"
hp: "18"
initiative: 13
modifier: "9"
defense: 1
ac: "2"
phys_dr: "0"
energy_dr: "0"
rad_dr: Immune
poison_dr: Immune
attacks:
  - name: "`dice: 2d20|render|text(BITE: BODY + Melee (TN 8))`"
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
  - name: "LEGENDARY CREATURE"
    desc: "<!-- id: radioactive -->\nA Legendary creature or Major character mutates the first time they are reduced to below half of their maximum HP, at which point they immediately take an extra turn (this is in addition to the creature or character’s normal turn) and gain the **Mutation** effect of their Legendary Ability for the remainder of the scene.\nIf a creature mutates and then regains enough HP to go above half its maximum HP, the creature cannot mutate a second time.\n\n>**RADIOACTIVE**\nThe creature’s body, blood, and everything else are heavily irradiated. This doesn’t seem to hinder the creature in any way, but it certainly has an effect on everything near them. This is most common on insects and animals (especially ones with the Glowing template), glowing ones, super mutants, and any robot with a nuclear power source.\n\n**Effect:** The creature is immune to Radiation damage if it wasn’t already. In addition, the creature’s melee attacks all gain the Radioactive damage effect.\n\n**Mutation:** When this creature mutates, its damaged body leaks even more radiation. Any creature within Close range of the creature at the start of their turn suffers 5 D6 [[Piercing]] 1 Radiation damage."
scavenge_rules:
  - name: "BUTCHERY:"
    desc: "Scavengers can butcher a dead radroach with a successful **END + Survival** test with a difficulty of 0.\n This yields:\n 1 portion of [[Radroach Meat]]."
skills:

```