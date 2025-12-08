```statblock
name: "Hermit Crab"
desc: "Having grown far too large for simple shells to contain them, these gigantic crustaceans have taken up residence in the ruined vehicles of the Wastelands. Using them to protect their squishy innards and hide from their unsuspecting prey. They spring out into action, using their giant claws to rend flesh from bone and then retreating back into their shells should things turn dire spawning hatchlings to protect themselves."
level: "12"
type: "Mighty Creature"
keywords: "Mutated Crustacean"
xp: "176"
body_attr: "12"
mind: "4"
melee: "3"
guns: ""
other: ""
hp: "72"
initiative: "16"
modifier: "16"
defense: "2"
ac: "2"
phys_dr: "7 (All)"
energy_dr: "6 (All)"
rad_dr: "7 (All)"
poison_dr: "-"
attacks: 
 - name: "`dice: 2d20|render|text(CLAW: BODY + Melee (TN 15))`"
   desc: "5 D6 Physical damage" 
special_abilities:
 - name: "BIG:"
   desc: "The hermit crab is bigger than most characters. The creature receives an additional +1 health point per Level, but its Defense is reduced by 1, to a minimum of 1. Further, it only suffers a critical hit if an attack inflicts 7+ damage (after damage resistance) in a single hit, rather than the normal 5+."
 - name: "METALLIC SHELL:"
   desc: "As a major action, the hermit crab may retreat inside its shell. While it is inside its shell, it gains +3 to all DRs, its defense becomes 0, and it may not voluntarily take any move actions. The hermit crab may exit its shell as a minor action."
 - name: "HATCHING SPAWN:"
   desc: "While inside the shell, the GM may spend up to 5 AP as a major action to spawn a group of 5 hermit crab hatchlings."
 - name: "CAMOUFLAGE:"
   desc: "While it remains motionless and in its shell, the hermit crab is indistinguishable from a wrecked vehicle. Close inspection or attempting to enter the vehicle will reveal the object as a creature."
 - name: "SLOW:"
   desc: "The hermit crab cannot sprint and any movement action is always a major action for it."
scavenge_rules:
 - name: "BUTCHERY:"
   desc: "Scavengers can butcher a dead hermit crab with a successful **END + Survival** test with a difficulty of 1. \n\n * This yields 2 D6 portions of hermit crab meat."
 - name: "SCAVENGING:"
   desc: "Upon a hermit crab’s death, the players can find several items and caps among its body. \n\n * Roll 3d20 for the number of caps that can be found, and 5 D6 for the number of junk items found. \n\n * The body contains a mix of weaponry, roll twice on the ranged weapons table and once on the melee weapons table. \n\n There will also be 2d20 rounds of ammunition appropriate to the weapons found."
```



# Hermit Crab Hatchlings

Hermit crab hatchlings are nearly identical to mirelurk hatchlings (**Fallout: The Roleplaying Game Core Rulebook**, p.344). They even look similar and behave like them. 