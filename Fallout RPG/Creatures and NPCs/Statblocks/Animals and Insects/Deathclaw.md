```statblock
name: Deathclaw
desc: "Well known throughout the wasteland, the deathclaw is a creature feared by many, and for good reason. Created through the genetic engineering and gene splicing of the Jackson’s Chameleon, the pre-War U.S. government created these monstrosities to replace soldiers on the battlefield. Sporting vicious claws and horns, and a stature that towers over most humans, these creatures are killing machines with a speed faster than most creatures of their size. Female deathclaws are often larger than the males and are deeply protective of their eggs and young. Encountering a lone deathclaw is dangerous, but to stumble upon a nest is almost guaranteed to end in a swift, painful death."
level: 11
type: Normal Creature
keywords: Mutated Lizard
xp: 81
body_attr: 9
mind: 5
melee: 5
guns: 
other: 3
hp: 31
initiative: 14
modifier: 14
defense: 1
ac: 1
phys_dr: 6 (All)
energy_dr: 9 (All)
rad_dr: Immune
poison_dr: 9 (All)
attacks:
 - name: "`dice: 2d20|render|text(CLAWS: BODY + Melee (TN 14))`"
   desc: "6 D6  [[Piercing]] 1 Physical damage"
 - name: "`dice: 2d20|render|text(SLAM: BODY + Melee (TN 14))`"
   desc: "4 D6  [[Stun]] Physical damage"
 - name: "`dice: 2d20|render|text(HEAVY OBJECT: BODY + Guns (TN 9))`"
   desc: "4 D6  [[Stun]] Physical damage, Throwing, Range M"
special_abilities:
  - name: "IMMUNE TO RADIATION:"
    desc: "The deathclaw reduces all Radiation damage suffered to 0 and cannot suffer any damage or effects from radiation."
  - name: "BIG:"
    desc: "The deathclaw is bigger than most characters, towering over them. The creature receives an additional +1 health point per Level, but its Defense decreases by 1, to a minimum of 1. Further, it only suffers a Critical Hit if an attack inflicts 7+ damage (after damage resistance) in a single hit, rather than the normal 5+."  
  - name: "KEEN SENSES:"
    desc: "One or more of the deathclaw's senses are especially keen; they can attempt to detect creatures or objects which characters normally cannot, and they reduce the difficulty of all other PER tests by 1 (to a minimum of 0)."
  - name: "REND:"
    desc: A deathclaw may choose to make a deadlier Claw attack by increasing the difficulty of the attack by +1. If it succeeds, the attack’s damage increases by +2 D6
  - name: "WEAK SPOT:"
    desc: "If an attacker chooses to target the deathclaw’s torso, it ignores the creature’s DR. This does not apply against hits which hit the head due to random chance."
  - name: "MASSIVE STRENGTH:"
    desc: "A deathclaw is capable of lifting and throwing objects as large as a standard car."
scavenge_rules:
 - name: "BUTCHERY:"
   desc: "Scavengers can butcher a dead deathclaw with a successful **END + Survival** test with a difficulty of 1.\n This yields:\n 2 D6  portions of [[Deathclaw Meat]]."
```
![[Deathclaw image.jpg]]