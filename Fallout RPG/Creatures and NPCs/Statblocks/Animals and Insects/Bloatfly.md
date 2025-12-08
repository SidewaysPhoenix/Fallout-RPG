
```statblock
name: Bloatfly
desc: "Nuclear radiation transformed the common pre-War blowfly into the oversized, deadly menace known as the bloatfly. Easily spotted by their mottled green-brown carapaceand plump, bloated appearance, bloatflies are not your common household pests. Often found in swarms of up to four, these creatures attack from a distance using their own dart-spined larvae launched from their abdomen. Bloatflies are aggressive and will pursue prey larger than themselves relentlessly. They can often be found living alongside bloodbugs and stingwings near bodies of water or rotting flesh."
level: 2
type: Normal Creature
keywords: Mutated Insect
xp: 17
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
poison_dr: 0
attacks: 
 - name: "`dice: 2d20|render|text(LARVE DART: BODY + Melee (TN 6))`"
   desc: "4 D6  [[Radioactive]] Physical damage" 
special_abilities:
 - name: "FLYING:"
   desc: "Bloatflies can move freely through the air. They ignore most ground-level obstacles and difficult terrain effects, and they can move through “empty” zones above the battlefield if desired. It must spend at least one minor action each turn moving, and if it is knocked prone it falls to the ground, suffering 3 D6  [[Stun]] physical damage, +2 D6  for each zone above ground level it was before it fell."
 - name: "LITTLE:"
   desc: "Bloatflies are smaller than most characters. The creature’s normal HP decreases to Body + ½ level (rounded up), but its Defense is increased by 1. Further, it is slain by any hit which inflicts an Injury" 
 - name: "IMMUNE TO RADIATION:"
   desc: "The bloatfly reduces all Radiation damage suffered to 0 and cannot suffer any damage or effects from radiation."  
scavenge_rules:
 - name: "BUTCHERY:"
   desc: "Scavengers can butcher a dead bloatfly with a successful **END + Survival** test with a difficulty of 0.\n This yields:\n 1 portion of [[Bloatfly Meat]]\n 1 [[Bloatfly Gland]]\n 1 uncommon material."
```
![[Bloatfly image.jpg]]