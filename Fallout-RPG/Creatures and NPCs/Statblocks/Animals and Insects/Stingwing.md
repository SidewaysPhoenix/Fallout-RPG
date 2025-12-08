```statblock
name: Stingwing
desc: "The mutated form of the pre-War scorpion fly, Stingwings are another one of the wasteland’s common flyinginsects. They can often be found building nests in the same conditions and areas as bloatflies and bloodflies due to their similar preference in climate and food sources. Stingwings have developed a venomous sting which is both deadly and painful. These creatures are incredibly fast and agile, making them a difficult opponent to face in a swarm, and rush at their prey to bring it down as quickly as possible. They create nests both on the ground and at heights, which can be spotted by the bright yellow honey-like ooze they secrete. If nests are disturbed or threatened, a swarm of stingwings often emerge to defend it."
level: 5
type: Normal Creature
keywords: Mutated Insect
xp: 38
body_attr: 6
mind: 5
melee: 3
guns: 
other: 2
hp: 9
initiative: 1
modifier: 1
defense: 3
ac: 3
phys_dr: 0
energy_dr: 0
rad_dr: Immune
poison_dr: Immune
attacks:
 - name: "`dice: 2d20|render|text(BARBED STINGER: BODY + Melee (TN 9))`"
   desc: "2 D6  [[Persistent]] Poison Physical damage"
special_abilities:
  - name: "IMMUNE TO RADIATION:"
    desc: "The stingwing reduces all Radiation damage suffered to 0 and cannot suffer any damage or effects from radiation."
  - name: "IMMUNE TO POISON:"
    desc: "The stingwing reduces all Poison damage suffered to 0 and cannot suffer any damage or effects from poison."
  - name: "LITTLE:"
    desc: " The stingwing is smaller than most characters. The creature’s normal HP is reduced to Body + ½ level (rounded up), but its Defense is increased by 1. Further, it is slain by any hit which inflicts an Injury."
  - name: "FLYING:"
    desc: "The stingwing can move freely through the air. It can ignore most ground-level obstacles and difficult terrain effects, and they can move through “empty” zones above the battlefield if desired. It must spend at least one minor action each turn moving, and if it is knocked prone it falls to the ground, suffering 3 D6  [[Stun]] physical damage, +2 D6  for each zone above ground level it was before it fell."
  - name: "DIVE-BOMB:"
    desc: "If a stingwing moves into Reach and makes a melee attack in the same turn, it may re-roll 1d20 on the attack. After the attack, it may spend 1AP to move one zone."
scavenge_rules:
 - name: "BUTCHERY:"
   desc: "Scavengers can butcher a dead stingwing with a successful **END + Survival** test with a difficulty of 0.\n This yields:\n 1 D6  portions of [[Stingwing Meat]], and 1 [[Stingwing Barb]] if an Effect is rolled."
```
![[Stingwing image.jpg]]