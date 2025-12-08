```statblock
name: "Giant Ant"
desc: "In the many years since the Great War, little has changed about these arthropods, living in colonies supporting their queen in a rigid social structure. The only noticeable change is their size. Ranging from the size of a dog to that of a minibus, these ants truly deserve the title giant. Like their ancestors, giant ants have a strong sense of teamwork, holding the nest and their queen above any individual member. Though many specialized ants exist even the lowliest drone will fight and gather for the good of the nest, even at the cost of their own life."
level: "3"
type: "Normal Creature"
keywords: "Mutated Insect"
xp: "24"
body_attr: "6"
mind: "4"
melee: "3"
guns: ""
other: "3"
hp: "9"
initiative: "10"
modifier: "10"
defense: "1"
ac: "1"
phys_dr: "1 (All)"
energy_dr: "1 (All)"
rad_dr: "Immune"
poison_dr: "Immune"
attacks: 
 - name: "`dice: 2d20|render|text(BITE: BODY + Melee (TN 9))`"
   desc: "4 D6 Physical damage" 
special_abilities:
 - name: "IMMUNE TO RADIATION:"
   desc: "The giant ant reduces all Radiation damage suffered to 0 and cannot suffer any damage or effects from radiation."
 - name: "FRENZY:"
   desc: "If an attacker deals an injury to the giant ant's head, the giant ant goes into a pained frenzy and treats all creatures and characters as enemies for the rest of the encounter."
scavenge_rules:
 - name: "BUTCHERY:"
   desc: "Scavengers can butcher a dead giant ant with a successful **END + Survival** test with a difficulty of 1. \n\n* This yields one portion of [[Giant Ant Meat]]."
```


### Fire Ants 

Originally found in the Capital Wasteland, these creatures are the results of Dr. Lesko’s ill-fated attempt to reduce giant ants back to their pre-War size. Needless to say, his experiment did not go as planned, and rather than returning to their minuscule size, these ants instead became increasingly aggressive and developed the ability to spit fire. 

When featuring fire ants, modify the giant ant as follows: 

* Increase Guns to 3. 
* Add the following attack, `dice: 2d20|render|text(FIRE SPIT: BODY + Guns (TN 9)))`  3D6 [[Persistent]] Energy damage, Range M
