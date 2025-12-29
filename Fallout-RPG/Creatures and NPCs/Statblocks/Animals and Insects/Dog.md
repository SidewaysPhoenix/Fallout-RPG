```statblock
name: Dog
desc: "Dogs are common across the wasteland and are one of few creatures who have not succumbed entirely to mutation as a species. Non-mutated dogs can be found in many settlements and as domestic pets or guard animals and appear to have the same intelligence and capability as their pre-War ancestors. Not all dogs are friendly, however. Packs of rabid, mutated, and irradiated dogs roam thewastes. While there are some rare accounts of friendly mutated dogs, it is far more common to encounter the creatures as they viciously try to tear you apart for their next meal. These mutated dogs often have patchy or no fur, with their skin taking on an almost ghoulified appearance. "
level: 3
type: Normal Creature
keywords: Mammal
xp: 24
body_attr: 5
mind: 5
melee: 3
guns: 
other: 2
hp: 8
initiative: 10
modifier: 10
defense: 1
ac: 1
phys_dr: 0
energy_dr: 0
rad_dr: 0
poison_dr: 0
attacks: 
 - name: "`dice: 2d20|render|text(BITE: BODY + Melee (TN 8))`"
   desc: "4 D6  Physical damage"
special_abilities:
  - name: "KEEN SENSES:"
    desc: "One or more of the dog’s senses are especially keen; they can attempt to detect creatures or objects which characters normally cannot, and they reduce the difficulty of all other PER tests by 1 (to a minimum of 0)."
scavenge_rules:
 - name: "BUTCHERY:"
   desc: "Scavengers can butcher a dead dog with a successful **END + Survival** test with a difficulty of 0.\n This yields:\n 1 portion of [[Mongrel Dog Meat]]."
```

	Mongrel Dogs
If you wish to create a mongrel dog, the vicious and 
mutated variant of man’s best friend, you can modify the 
Dog stats as follows:
 Replace the Mammal keyword with Mutated Mammal.
 Add the Feral, Aggressive, and Immune to Radiation 
special abilities
 Decrease Mind to 4 and increase Body to 6.