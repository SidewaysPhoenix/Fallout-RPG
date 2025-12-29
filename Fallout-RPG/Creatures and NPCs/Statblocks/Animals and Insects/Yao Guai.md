```statblock
name: Yao Guai
image: [[Yao Guai image.jpg]]
desc: "These terrifying creatures are what remains of the bear population after the Great War. Heavily mutated, with longer claws, more muscle mass, and a powerful bite, the yao guai is not a creature any wasteland traveler wants to come across. They are territorial and protective of theiryoung and pack if part of one. These violent creatures have even been known to take on deathclaws if they threaten the yao guai’s territory."
level: 14
type: Normal Creature
keywords: Mutated Mammal
xp: 102
body_attr: 9
mind: 6
melee: 5
guns: 
other: 4
hp: 37
initiative: 15
modifier: 15
defense: 1
ac: 1
phys_dr: 2 (All)
energy_dr: 1 (All)
rad_dr: Immune
poison_dr: 2 (All)
attacks:
 - name: "`dice: 2d20|render|text(CLAWS: BODY + Melee (TN 14))`"
   desc: "9 D6  [[Vicious]] Physical damage"
 - name: "`dice: 2d20|render|text(BITE: BODY + Melee (TN 14))`"
   desc: "10 D6  [[Piercing]] Physical damage"
special_abilities:
  - name: "IMMUNE TO RADIATION:"
    desc: "The yao guai reduces all Radiation damage suffered to 0 and cannot suffer any damage or effects from radiation"
  - name: "BIG:"
    desc: "The yao guai is bigger than most characters, towering over them. The creature receives an additional +1 health point per Level, but its Defense is reduced by 1, to a minimum of 1. Further, it only suffers a Critical Hit if an attack inflicts 7+ damage (after damage resistance) in a single hit, rather than the normal 5+."
  - name: "AGGRESSIVE:"
    desc: "The yao guai is quick to action when it senses prey. When the yao guai enters a scene, immediately generate 1 Action Point. If the yao guai is an ally, then this goes into the group pool. If it is an enemy, it goes into the GM’s pool."
scavenge_rules:
 - name: "BUTCHERY:"
   desc: "Scavengers can butcher a dead yao guai with a successful **END + Survival** test with a difficulty of 1.\n This yields:\n 2 D6  portions of [[Yao Guai Meat]]; if an Effect is rolled, it also yields 2 common materials."
```