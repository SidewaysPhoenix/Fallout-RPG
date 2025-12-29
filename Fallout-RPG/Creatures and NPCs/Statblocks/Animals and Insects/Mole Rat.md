```statblock
name: Mole Rat
image: [[Molerat image.jpg]]
desc: "These rodents are the mutated form of the pre-War naked mole rat. They thrive almost anywhere in the wasteland, despite the number of creatures that would prey on them. They create their burrows underground, protecting them from most predators. They are much larger, akin to dogs in size, than their pre-War coun￾terparts andare usually incredible vicious when hunting prey or defending theirburrows. Mole rats live and hunt in packs, with their burrowing ability giving them the element of surprise in most situations, and a quick escape should their prey overwhelm them. With oversized front teeth and the ability to lunge at their prey with a surprising speed, mole rats are not to be underestimated. While they are most often mindless, savage creatures, some individuals in the wasteland have been able to train and domesticate the rodents as one would with a dog."
level: 2
type: Normal Creature
keywords: Mutated Mammal
xp: 17
body_attr: 5
mind: 4
melee: 2
guns: 
other: 2
hp: 7
initiative: 9
modifier: 9
defense: 1
ac: 1
phys_dr: 1
energy_dr: 0
rad_dr: Immune
poison_dr: 0
attacks:
 - name: "`dice: 2d20|render|text(BITE: BODY + Melee (TN 7))`"
   desc: "4 D6  [[Piercing]] Physical damage"
special_abilities:
  - name: "BURROW:"
    desc: "As a major action, the mole rat may burrow underground to get away from its enemies and prepare for its next attack. On its next turn it can use its minor action to appear above ground anywhere within medium range of the place it burrowed. For the cost of 1 AP it may also add an extra  D6  to its bite attack after emerging."
  - name: "KEEN SENSES:"
    desc: "One or more of the mole rat’s senses are especially keen; they can attempt to detect creatures or objects which characters normally cannot, and they reduce the difficulty of all other **PER** tests by 1 (to a minimum of 0). This includes detecting the presence of creatures above ground while burrowed."
  - name: "IMMUNE TO RADIATION:"
    desc: "The mole rat reduces all Radiation damage suffered to 0 and cannot suffer any damage or effects from radiation."
scavenge_rules:
 - name: "BUTCHERY:"
   desc: "Scavengers can butcher a dead mole rat with a successful **END + Survival** test with a difficulty of 0.\n This yields:\n 1 portion of [[Mole Rat Meat]]\n 1 common material."
```