```statblock
name: Mirelurk Hatchlings
desc: "Hatchlings are the collective term for mirelurk young. Mirelurks lay eggs, often in a well-protected nest. Occasionally when a nest is disturbed, eggs will hatch in response to the stimuli. Hatchlings are easy to dispatch by acompetent individual providing the swarm isn’t large. At this stage, their shells are soft, and they are around the size of a radroach. "
level: 1
type: Normal Creature
keywords: Mutated Crustacean
xp: 10
body_attr: 4
mind: 4
melee: 1
guns: 
other: 1
hp: 5
initiative: 8
modifier: 8
defense: 2
ac: 2
phys_dr: 0
energy_dr: 0
rad_dr: Immune
poison_dr: 0
attacks: 
 - name: "`dice: 2d20|render|text(PINCERS: BODY + Melee (TN 5))`"
   desc: "3 D6  Physical damage"
special_abilities:
  - name: "IMMUNE TO RADIATION:"
    desc: "The hatchling reduces all Radiation damage suffered to 0 and cannot suffer any damage or effects from radiation."
  - name: "LITTLE:"
    desc: "The hatchling is smaller than most characters. The creature’s normal HP decreases to Body + ½ level (rounded up), but its Defense increases by 1. Further, it is slain by any hit that inflicts an Injury."
  - name: "AQUATIC:"
    desc: "The hatchling can swim and submerge itself in water indefinitely without needing to come up for air. They suffer no difficulty increase for attacks or movements made while underwater."
scavenge_rules:
 - name: "BUTCHERY:"
   desc: "Scavengers can butcher a dead hatchling with a successful **END + Survival** test with a difficulty of 0.\n This yields:\n 1 portion of [[Mirelurk Meat]]."
```
