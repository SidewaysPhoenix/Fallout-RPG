```statblock
name: Mutant Hound
desc: "These mutant dogs differ greatly from their domestic and rabid cousins. While the latter often turn rabid due to radiation exposure, mutant hounds are not natural creatures.They are created through exposure to the Forced Evolutionary Virus. They are several times larger than normal dogs, with an increased muscle mass and aggression, and suffer detrimental effects of lowered intelligence seen in super mutants. Their skin is often a patchy green color and they lack any fur. They are almost always found in the company of super mutants, who use them as guard dogs. It is unknown if this is their primary purpose, or if like humans, super mutants keep them for companionship."
level: 4
type: Normal Creature
keywords: Mutated Mammal
xp: 31
body_attr: 6
mind: 4
melee: 3
guns: 
other: 1
hp: 10
initiative: 10
modifier: 10
defense: 1
ac: 1
phys_dr: 1 (All)
energy_dr: 1 (All)
rad_dr: Immune
poison_dr: Immune
attacks:
 - name: "`dice: 2d20|render|text(BITE: BODY + Melee (TN 9))`"
   desc: "3 D6  Physical damage"
special_abilities:
  - name: "IMMUNE TO RADIATION:"
    desc: "The mutant hound reduces all Radiation damage suffered to 0 and cannot suffer any damage or effects from radiation."
  - name: "IMMUNE TO POISON:"
    desc: "The mutant hound reduces all Poison damage suffered to 0 and cannot suffer any damage or effects from poison."
  - name: "KEEN SENSES:"
    desc: " One or more of the mutant hound’s senses are especially keen; they can attempt to detect creatures or objects which characters normally cannot, and they reduce the difficulty of all other **PER** tests by 1 (to a minimum of 0)."
  - name: "WARNING HOWL:"
    desc: "During the first round of combat, a Mutant Hound may howl as a major action. Each super mutant or Mutant Hound within Long range may make a second minor action on their next turn. No NPC may benefit from this ability more than once per combat."
scavenge_rules:
 - name: "BUTCHERY:"
   desc: "Scavengers can butcher a dead Mutant Hound with a successful **END + Survival** test with a difficulty of 1.\n This yields:\n 1 D6  portions of [[Mutant Hound Meat]], +1 per AP spent. If an Effect is rolled, it also yields 1 common material."
```
![[Mutant Hound image.jpg]]