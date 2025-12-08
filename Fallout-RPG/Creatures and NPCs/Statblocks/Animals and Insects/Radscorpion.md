```statblock
name: Radscorpion
desc: "The mutated form of the common emperor scorpion, radscorpions are one of the more terrifying creatures to be found inthe wasteland. These creatures perhaps received the most drastic mutation in size, with the largest being only a bit shorter than a small car. Their heavily armored bodies, powerful pincers, hefty stinger, and immense speed make them difficult to kill. Someof these creatures can even rival the fearsome deathclaw in their deadliness. The impact of their stingers combined with the poison can easily bring down even a large creature or armored human in one or two well placed hits. With the ability to burrow underground and surprise prey, they are truly a predator that anytraveler should fear."
level: 7
type: Normal Creature
keywords: Mutated Arachnid
xp: 52
body_attr: 7
mind: 5
melee: 5
guns: 
other: 3
hp: 21
initiative: 12
modifier: 12
defense: 1
ac: 1
phys_dr: 4 (All)
energy_dr: 3 (All)
rad_dr: Immune
poison_dr: Immune
attacks:
 - name: "`dice: 2d20|render|text(CLAW: BODY + Melee (TN 12))`"
   desc: "4 D6  [[Vicious]] Physical damage"
 - name: "`dice: 2d20|render|text(STING: BODY + Melee (TN 12))`"
   desc: "3 D6  [[Persistent]] Poison damage"
special_abilities:
  - name: "IMMUNE TO RADIATION:"
    desc: "The radscorpion reduces all Radiation damage suffered to 0 and cannot suffer any damage or effects from radiation."
  - name: "IMMUNE TO POISON:"
    desc: "The radscorpion reduces all Poison damage suffered to 0 and cannot suffer any damage or effects from poison."
  - name: "BIG:"
    desc: "The radscorpion is bigger than most characters. The creature receives an additional +1 health point per Level, but its Defense is reduced by 1, to a minimum of 1. Further, it only suffers a Critical Hit if an attack inflicts 7+ damage (after damage resistance) in a single hit, rather than the normal 5+."
  - name: "BURROW:"
    desc: "A radscorpion can tunnel under the ground to strike at attackers. Burrowing into the ground takes a major action, and while burrowing the radscorpion is not visible and cannot be targeted by attacks. It burrows two zones as a major action, moving underneath existing zones. It takes only a minor action to emerge from the ground after burrowing. A radscorpion cannot burrow through stone, metal, or wood."
  - name: "WEAK SPOT:"
    desc: "If an attacker chooses to target the radscorpion’s head, it ignores the creature’s DR. This does not apply against hits which hit the head due to random chance."
scavenge_rules:
 - name: "BUTCHERY:"
   desc: "Scavengers can butcher a dead radscorpion with a successful **END + Survival** test with a difficulty of 1.\n This yields:\n 2 D6  portions of [[Radscorpion Meat]]. If an Effect is rolled it yields 1 [[Radscorpion Stinger]], then it also yields 1 Rare material, or a [[Radscorpion Egg]] if two Effects are rolled."
```
![[Radscorpion image.jpg]]