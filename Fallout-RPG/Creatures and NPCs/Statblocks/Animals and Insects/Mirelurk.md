```statblock
name: Mirelurk
desc: "The most common of the mirelurk family is just referred to as a mirelurk. These creatures resemble horseshoe crabs, with large pincers capable of breaking bones. Theycan be found in groups in most places where there are large bodies of water. Sometimes barnacles, netting or other debris can find it’s attached to its shell making them easier to spot. "
level: 7
type: Normal Creature
keywords: Mutated Crustacean
xp: 52
body_attr: 7
mind: 5
melee: 4
guns: 
other: 3
hp: 14
initiative: 12
modifier: 12
defense: 1 (2 if aiming at the face)
ac: 1 (2 if aiming at the face)
phys_dr: 4 (Torso, Legs, Arms) 1 (Face)
energy_dr: 2 (All)
rad_dr: Immune
poison_dr: 4 (Torso, Legs, Arms) 2 (Face)
attacks:
 - name: "`dice: 2d20|render|text(PINCERS: BODY + Melee (TN 11))`"
   desc: "6 D6  Physical damage"
special_abilities:
  - name: "IMMUNE TO RADIATION:"
    desc: "The mirelurk reduces all Radiation damage suffered to 0 and cannot suffer any damage or effects from radiation"
  - name: "SMALL WEAK POINT:"
    desc: "While the mirelurk’s body is covered in a toughened shell, its face is its weak point. This area is small and difficult to accurately hit. The face is treated as having a defense of 2"
  - name: "AQUATIC:"
    desc: "The mirelurk can swim and submerge itself in water indefinitely without needing to come up for air. They suffer no difficulty increase for attacks or movements made while underwater."
scavenge_rules:
 - name: "BUTCHERY:"
   desc: "Scavengers can butcher a dead mirelurk with a successful **END + Survival** test with a difficulty of 0.\n This yields:\n 2 D6  portions of [[Mirelurk Meat]]. \nFor each Effect rolled, they also yield 1 [[Softshell Mirelurk Meat]]."
```
![[Mirelurk image.jpg]]