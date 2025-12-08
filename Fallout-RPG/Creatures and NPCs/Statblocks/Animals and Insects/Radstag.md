```statblock
name: Radstag
desc: "These creatures are the mutated descendants of the common deer. While they retain a mostly unchanged form in that their body remains deer-like and they sport antlers, they suffer the same mutation as brahmin in havingtwo heads. The inner eye of each head is blind, requiring the radstag to navigate using both heads. Like brahmin, both heads can move independently. The otherstrange mutation that is very apparent is the additional two legs that hang undeveloped from thefront of the creature’s chest. While the radstag can bend these legs when needed for comfort, such as when laying down, they are otherwise useless. While radstags still retain a coat, it is often mangey in places from radiation, and rabid radstags often lose their coat in places. These creatures travel in packs and are usually docile unless threatened."
level: 5
type: Normal Creature
keywords: Mutated Mammal
xp: 38
body_attr: 6
mind: 5
melee: 3
guns: 
other: 2
hp: 11
initiative: 10
modifier: 10
defense: 1
ac: 1
phys_dr: 1 (All)
energy_dr: 0
rad_dr: Immune
poison_dr: 0
attacks:
 - name: "`dice: 2d20|render|text(ANTLERS: BODY + Melee (TN 9))`"
   desc: "5 D6  [[Piercing]] Physical damage"
special_abilities:
  - name: 
    desc: ""
scavenge_rules:
 - name: "BUTCHERY:"
   desc: "Scavengers can butcher a dead radstag with a successful **END + Survival** test with a difficulty of 0.\n This yields:\n 2 D6  of [[Radstag Meat]]. If an Effect is rolled, it also yields a [[Radstag Hide]]."
```
![[Radstag image.jpg]]