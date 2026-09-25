```statblock
name: "Yao Guai"
image: "[[Yao Guai image.jpg]]"
desc: "These terrifying creatures are what remains of the bear population after the Great War. Heavily mutated, with longer claws, more muscle mass, and a powerful bite, the yao guai is not a creature any wasteland traveler wants to come across. They are territorial and protective of theiryoung and pack if part of one. These violent creatures have even been known to take on deathclaws if they threaten the yao guai’s territory."
level: "15"
type: "Legendary Creature"
keywords: "Mutated Mammal"
xp: "306"
body_attr: 12
mind: 8
melee: "6"
guns: ""
other: "4"
hp: "113"
initiative: 20
modifier: "15"
defense: 1
ac: "1"
phys_dr: "4"
energy_dr: "1 (All)"
rad_dr: Immune
poison_dr: "2 (All)"
attacks:
  - name: "`dice: 2d20|render|text(CLAWS: BODY + Melee (TN 18))`"
    desc: "9 D6  [[Vicious]] Physical damage"
  - name: "`dice: 2d20|render|text(BITE: BODY + Melee (TN 18))`"
    desc: "10 D6  [[Piercing]] Physical damage"
special_abilities:
  - name: ALPHA
    desc: "<!-- form_id: alpha -->\n>> **Level:** The creature is one level higher than normal. Make the following changes:\n>>\n>> - Add +1 to the creature’s Body or Mind\n>> - Add +1 to one of the creature’s skills\n>> - Adjust Initiative in line with increased Body or Mind\n>> - Add +1 HP, or +2 if Body was increased\n>> - Add either +1 to one type of damage resistance on all locations, or +1 D6 to one attack\n>>\n>> **Special Abilities:** The creature gains the Aggressive and the Leader of the Pack abilities:\n>>\n>> **Aggressive:** The creature is quick to action when it senses prey. When the creature enters a scene, immediately generate 1 Action Point. If the creature is an ally, then this goes into the group pool. If the creature is an enemy, then it goes into the GM’s pool.\n>>\n>> **Leader of the Pack:** The creature leads a group of its kind. All Normal creatures of the same kind and lower level within Close range may re-roll 1d20 on all tests while this creature is still alive."
  - name: "LEGENDARY CREATURE"
    desc: "<!-- id: toxic -->\n>>A Legendary creature or Major character mutates the first time they are reduced to below half of their maximum HP, at which point they immediately take an extra turn (this is in addition to the creature or character’s normal turn) and gain the **Mutation** effect of their Legendary Ability for the remainder of the scene.\n>>If a creature mutates and then regains enough HP to go above half its maximum HP, the creature cannot mutate a second time.\n>\n>>**TOXIC**\n>The creature’s bite, sting, or claws are home to a particularly nasty venom, which often kills those who aren’t slain by the initial attack.\n>\n>>**Effect:** The creature’s melee attacks gain the [[Persistent]] (Poison) damage effect. Further, choose one of the following damage effects: [[Fallout-RPG/Descriptions and Rules/Combat/Damage Effects/Radioactive|Radioactive]], [[Stun]], or [[Vicious]]. The persistent Poison damage is counted as having the chosen damage effect.\n>>\n>>**Mutation:** When this creature mutates, it exudes toxic fumes as well. Anyone within Reach of the creature at the start of its turn suffers 5 D6 Poison damage. This Poison damage also has the damage effect chosen."
  - name: "IMMUNE TO RADIATION:"
    desc: "The yao guai reduces all Radiation damage suffered to 0 and cannot suffer any damage or effects from radiation"
  - name: "BIG:"
    desc: "The yao guai is bigger than most characters, towering over them. The creature receives an additional +1 health point per Level, but its Defense is reduced by 1, to a minimum of 1. Further, it only suffers a Critical Hit if an attack inflicts 7+ damage (after damage resistance) in a single hit, rather than the normal 5+."
  - name: "AGGRESSIVE:"
    desc: "The yao guai is quick to action when it senses prey. When the yao guai enters a scene, immediately generate 1 Action Point. If the yao guai is an ally, then this goes into the group pool. If it is an enemy, it goes into the GM’s pool."
scavenge_rules:
  - name: "BUTCHERY:"
    desc: "Scavengers can butcher a dead yao guai with a successful **END + Survival** test with a difficulty of 1.\n This yields:\n 2 D6  portions of [[Yao Guai Meat]]; if an Effect is rolled, it also yields 2 common materials."
skills:

```