```statblock
name: Mirelurk Queen
desc: "A rare variant of an average crab-like mirelurk, queens are even more terrifying and dangerous. They stand taller than any other mirelurk subspecies with some reaching the gigantic height of a behemoth. In addition to their added size, they are one of the most aggressive variants. Like all mirelurks, their shell is almost impenetrable but the soft skin of their face is still a weak spot. Mirelurk queens also can spit acid, as well as dispatching swarms of her hatchlings at would-be enemies. They are extremely protective of their nests and eggs and will viciously defend if threatened. You cannot mistake coming across one of these rare creatures, as they let out a terrifying sonic roar to announce their attacks."
level: 19
type: Normal Creature
keywords: Mutated Crustacean
xp: 137
body_attr: 12
mind: 6
melee: 5
guns: 
other: 4
hp: 50
initiative: 18
modifier: 18
defense: 1 (2 if aiming at the face)
ac: 1 (2 if aiming at the face)
phys_dr: 10 (Torso, Legs, Arms) 5 (Face
energy_dr: 7 (All)
rad_dr: Immune
poison_dr: 9 (All)
attacks: 
 - name: "`dice: 2d20|render|text(PINCERS: BODY + Melee (TN 17))`"
   desc: "12 D6  [[Vicious]] Physical damage"
 - name: "`dice: 2d20|render|text(ACID SPRAY: Body + Melee (TN 17))`"
   desc: "10 D6 , [[Piercing]] [[Radioactive]] Poison damage"
special_abilities:
  - name: "HATCHLING SPAWN:"
    desc: "Once per round the GM may spend 4 AP as a major action to spawn a group of 4 mirelurk hatchlings. If this action is taken, the mirelurk queen may not make an attack as a major action in the same round."
  - name: "IMMUNE TO RADIATION:"
    desc: "The mirelurk queen reduces all Radiation damage suffered to 0 and cannot suffer any damage or effects from radiation."
  - name: "IMMUNE TO FEAR:"
    desc: "The mirelurk queen cannot be intimidated or threatened in any way and will either ignore or attack anyone who attempts to threaten or intimidate it."
  - name: "SMALL WEAK POINT:"
    desc: "While the mirelurk queen’s body is covered in a toughened shell, its face is its weak point. This area is small and difficult to accurately hit. The face is treated as having a defense of 2"
  - name: "AQUATIC:"
    desc: "The mirelurk queen can swim and submerge itself in water indefinitely without needing to come up for air. They suffer no difficulty increase for attacks or movements made while underwater."
  - name: "BIG:"
    desc: "The mirelurk queen is bigger than most characters, towering over them. The creature receives an additional +1 health point per Level, but its Defense decreases by 1, to a minimum of 1. Further, it only suffers a Critical Hit if an attack inflicts 7+ damage (after damage resistance) in a single hit, rather than the normal 5+."
  - name: "AGGRESSIVE:"
    desc: "The mirelurk queen is quick to action when it senses prey. When the mirelurk queen enters a scene, immediately generate 1 Action Point. If the mirelurk queen is an ally, then this goes into the group pool. If it is an enemy, it goes into the GM’s pool."
scavenge_rules:
 - name: "SCAVENGING:"
   desc: "Upon the mirelurk queen’s death the players can find several items and caps among its body and lair. Roll 4d20 for the number of caps that can be found, roll 4 D6  and for each effect rolled make a single roll on the random junk table. The lair or body may also contain up to three weapons, and 3d20 rounds of ammunition appropriate to the weapons found, at the GM's discretion."
 - name: "BUTCHERY:"
   desc: "Scavengers can butcher a dead mirelurk queen with a successful **END + Survival** test with a difficulty of 0.\n This yields:\n 5 portions of [[Queen Mirelurk Meat]]." 
```
![[Mirelurk Queen image.jpg]]