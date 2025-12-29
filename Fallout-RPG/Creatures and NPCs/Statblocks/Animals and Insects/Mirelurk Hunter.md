```statblock
name: Mirelurk Hunter
image: [[Mirelurk Hunter image.jpg]]
desc: "Hunters appear to be descended from lobsters rather than crabs, giving them an elongated appearance with a flared tail. Like their crab-like cousins, they also have powerful pincers and are even more aggressive. Their shells are typically more resilient, and they have developed the ability to spit an acidic substance at their prey."
level: 12
type: Normal Creature
keywords: Mutated Crustacean
xp: 88
body_attr: 8
mind: 6
melee: 5
guns: 
other: 4
hp: 20
initiative: 14
modifier: 14
defense: 1 (2 if aiming at the face)
ac: 1 (2 if aiming at the face)
phys_dr: 4 (Torso, Legs, Arms) 1 (Face)
energy_dr: 2 (All)
rad_dr: Immune
poison_dr: 4 (Torso, Legs, Arms) 2 (Face)
attacks:
 - name: "`dice: 2d20|render|text(PINCERS: BODY + Melee (TN 13))`"
   desc: "9 D6  Physical damage"
special_abilities:
  - name: "IMMUNE TO RADIATION:"
    desc: "The mirelurk hunter reduces all Radiation damage suffered to 0 and cannot suffer any damage or effects from radiation."
  - name: "SMALL WEAK POINT:"
    desc: "While the mirelurk hunter’s body is covered in a toughened shell, its face is its weak point. This area is small and difficult to accurately hit. The face is treated as having a defense of 2."
  - name: "AQUATIC:"
    desc: "The mirelurk hunter can swim and submerge itself in water indefinitely without needing to come up for air. They suffer no difficulty increase for attacks or movements made while underwater."
scavenge_rules:
 - name: "BUTCHERY:"
   desc: "Scavengers can butcher a dead mirelurk with a successful **END + Survival** test with a difficulty of 0.\n This yields:\n 2 D6  portions of [[Mirelurk Meat]]. For each Effect rolled, they also yield 1 [[Softshell Mirelurk Meat]]."
```