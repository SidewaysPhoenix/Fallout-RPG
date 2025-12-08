```statblock
name: "Gatorclaw"
desc: "Created by Dr. Darren McDermot, resident biologist at Nuka World’s Safari Adventure Replication Facility, the gatorclaw was designed by splicing the DNA of the Jackson chameleon (the genetic ancestor of the mighty deathclaw) and the American alligator. Initially unsuccessful, it was only when McDermot extracted a sample of the FEV from a deceased super mutant did his project bear fruit. Though originally created to protect McDermot, the gatorclaws turned on their master as they grew too powerful and ferocious. \n\n They now wander Nuka World as apex predators, shorter and squatter than a deathclaw but even more dangerous. Rumors say that McDermot never managed to turn off the replicator creating the gatorclaws before he died. If true, this would be disastrous for the wastelands."
level: "11"
type: "Mighty Creature"
keywords: "Mutated Reptile"
xp: "162"
body_attr: "11"
mind: "5"
melee: "5"
guns: ""
other: "3"
hp: "66"
initiative: "16"
modifier: "16"
defense: "1"
ac: "1"
phys_dr: "6 (All)"
energy_dr: "6 (All)"
rad_dr: "Immune"
poison_dr: "9 (All)"
attacks:
 - name: "`dice: 2d20|render|text(CLAWS: BODY + Melee (TN 14))`"
   desc: "6 D6  [[Piercing]] 1 Physical damage"
 - name: "`dice: 2d20|render|text(SLAM: BODY + Melee (TN 14))`"
   desc: "4 D6  [[Stun]] Physical damage"
 - name: "`dice: 2d20|render|text(HEAVY OBJECT: BODY + Guns (TN 9))`"
   desc: "4 D6  [[Stun]] Physical damage, Throwing, Range M"
special_abilities:
 - name: "DIVER:"
   desc: "The gatorclaw can swim and submerge itself in water for a number of rounds equal to its Body statistic before needing to come up for air. They suffer no difficulty increase for attacks and movements made underwater."
scavenge_rules:
 - name: "BUTCHERY:"
   desc: "Scavengers can butcher a dead deathclaw with a successful **END + Survival** test with a difficulty of 1.\n* This yields 2 D6  portions of Gatorclaw Meat **(Use [[Deathclaw Meat]] stats)**."
```

Gatorclaw Conversion
The gatorclaw uses the same base stats as the deathclaw 
(Fallout: The Roleplaying Game Core Rulebook, 
p.342) and be repurposed with some minor changes. 