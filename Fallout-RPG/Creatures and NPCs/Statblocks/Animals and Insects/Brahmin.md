```statblock
name: Brahmin
image: [[Brahmin image.jpg]]
desc: "A staple of many settlements, brahmin are one of the most found creatures in the wasteland. These mutated cattle share much with pre-War era cows, though the nuclear fallout has caused them to develop two heads and abnormally large udders. They can produce milk and meat and can be harvested for their hide. Wild brahmin roam the wasteland in small herds, but these creatures are commonly encountered being bred for livestock or used as pack animals by merchants. Their strong and bulky form make them resilient enough for long travel and heavy loads, and their docile nature allows for them to be handled easily. "
level: 3
type: Normal Creature
keywords: Mutated Mammal
xp: 24
body_attr: 6
mind: 4
melee: 1
guns: 
other: 2
hp: 9
initiative: 10
modifier: 10
defense: 1
ac: 1
phys_dr: 1 (All)
energy_dr: 0
rad_dr: Immune
poison_dr: 0
attacks:
 - name: "`dice: 2d20|render|text(HEADBUTT: BODY + Melee (TN 7))`"
   desc: "4 D6  Physical damage"
special_abilities:
  - name: "IMMUNE TO RADIATION:"
    desc: "The brahmin reduces all Radiation damage suffered to 0 and cannot suffer any damage or effects from radiation."
scavenge_rules:
 - name: "BUTCHERY:"
   desc: "Scavengers can butcher a dead brahmin with a successful **END + Survival** test with a difficulty of 0.\n This yields:\n 1 portion of [[Brahmin Meat]]\n 2 uncommon material."
```