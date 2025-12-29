
```statblock
name: Bloodbug
image: [[Bloodbug image.jpg]]
desc: "A form of mutated mosquito, bloodbugs can be encountered in swarms wherever there is stagnant water and carrion. Fully grown, their dark reddish-brown bodies reach nearly two feet in length and their razor-sharp proboscis is capable of puncturing though some types of armor. Bloodbugs typically spit irradiated blood to blind their victims before puncturing the disorientated creature with their proboscis to feed on their blood. Brahmin and other domestic creatures often fall prey to these bugs, as well as unwary travelers who underestimate the deadly nature of a swarm."
level: 5
type: Normal Creature
keywords: Mutated Insect
xp: 38
body_attr: 6
mind: 5
melee: 1
guns:
other: 2
hp: 9
initiative: 11
modifier: 11
defense: 2
ac: 1
phys_dr: 0
energy_dr: 0
rad_dr: Immune
poison_dr: Immune
attacks: 
 - name: "`dice: 2d20|render|text(PROBOSCIS: BODY + Melee (TN 7))`"
   desc: "5 D6  Physical damage"
special_abilities:
 - name: "FLYING:"
   desc: "Bloodbugs can move freely through the air. They ignore most ground-level obstacles and difficult terrain effects, and they can move through “empty” zones above the battlefield if desired. It must spend at least one minor action each turn moving, and if it is knocked prone it falls to the ground, suffering 3 DC  [[Stun]] physical damage, +2 D6  for each zone above ground level it was before it fell."
 - name: "LITTLE:"
   desc: "Bloodbugs are smaller than most characters. The creature’s normal HP decreases to Body + ½ level (rounded up), but its Defense increases by 1. Further, it is slain by any hit which inflicts an Injury."
 - name: "IMMUNE TO RADIATION:"
   desc: "The bloodbug reduces all Radiation damage suffered to 0 and cannot suffer any damage or effects from radiation."   
scavenge_rules:
 - name: "BUTCHERY:"
   desc: "Scavengers can butcher a dead bloodbug with a successful **END + Survival** test with a difficulty of 0.\n This yields:\n 1 portion of [[Bloodbug Meat]]\n 1 [[Blood Sac]]\n 1 uncommon material."
```