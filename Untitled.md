```statblock
name: "Albino Radscorpion"
desc: "Pale and grotesque, these mutated monstrosities roam the Wasteland looking for prey, ranging from brahmin to deathclaws; there are few things they won’t fight. Twice the size of their obsidian cousins, the albino radscorpion has mutated beyond the normal bonds of nature. Its lighter carapace, though more sensitive to light, transforms the sun’s rays into energy, increasing its endurance and vitality. Able to shrug off heavy wounds, immune to radiation, and with a deadly poison sting, the albino radscorpion is able to go toe to toe with the greatest threats the wasteland has to offer.\n\n Though they rely mostly on the sting to fight, evidence of their claws can be found in their wake; an eviscerated carcass torn to pieces, or the limbs and extremities of once mighty foes. Whatever the case, the albino radscorpion is not something to be messed with."
level: "14"
type: "Legendary Creature"
keywords: "Mutated Arachnid"
xp: "306"
body_attr: 11
mind: 8
melee: "5"
guns: ""
other: "4"
hp: "117"
initiative: 19
modifier: "17"
defense: 1
ac: "1"
phys_dr: "6 (All)"
energy_dr: "5 (All)"
rad_dr: Immune
poison_dr: Immune
attacks:
  - name: "`dice: 2d20|render|text(CLAW: BODY + Melee (TN 16))`"
    desc: "6 D6 [[Vicious]] Physical damage"
  - name: "`dice: 2d20|render|text(STING: BODY + Melee (TN 16))`"
    desc: "7 D6 [[Persistent]] Poison damage"
special_abilities:
  - name: RABID
    desc: "<!-- form_id: rabid -->\n>> **Special Abilities:** The creature gains the Feral and Rabid abilities:\n>>\n>> **Feral:** The creature is unintelligent, driven purely by feral instinct. Feral creatures cannot be persuaded or influenced by Speech tests. Feral creatures move towards and attack the nearest enemy. If they cannot detect an enemy, they move towards the nearest source of bright light or loud noise. Failing that, they will move around randomly or simply lie down and do nothing.\n>>\n>> **Rabid:** The creature’s melee attacks gain the [[Persistent]] (Poison) damage effect. Further, when a creature suffers any Poison damage from a Rabid creature’s attacks, it counts as two exposures to disease for the purposes of seeing if you’ve contracted a disease (**Fallout: The Roleplaying Game Core Rulebook**, p.193)."
  - name: "LEGENDARY CREATURE"
    desc: "<!-- id: rage_heal -->\n>>A Legendary creature or Major character mutates the first time they are reduced to below half of their maximum HP, at which point they immediately take an extra turn (this is in addition to the creature or character’s normal turn) and gain the **Mutation** effect of their Legendary Ability for the remainder of the scene.\n>>If a creature mutates and then regains enough HP to go above half its maximum HP, the creature cannot mutate a second time.\n>\n>>**RAGE HEAL**\n>The creature is driven by fury and adrenaline, and needs to be put down quickly or it will shake off any damage it suffers.\n>\n>>**Effect:** The creature regains 3 HP at the start of each of its turns.\n>>\n>>**Mutation:** When this creature mutates, it immediately heals back to its maximum HP."
  - name: "IMMUNE TO RADIATION:"
    desc: "The albino radscorpion reduces all Radiation damage suffered to 0 and cannot suffer any damage or effects from radiation."
  - name: "IMMUNE TO POISON:"
    desc: "The albino radscorpion reduces all Poison damage suffered to 0 and cannot suffer any damage or effects from poison."
  - name: "Big:"
    desc: "The albino radscorpion is bigger than most characters. The creature receives an additional +1 health point per Level, but its Defense is reduced by 1, to a minimum of 1. Further, it only suffers a critical hit if an attack inflicts 7+ damage (after damage resistance) in a single hit, rather than the normal 5+."
  - name: "Burrow:"
    desc: "An albino radscorpion can tunnel under the ground to strike at attackers. Burrowing into the ground takes a major action, and while burrowing the albino radscorpion is not visible and cannot be targeted by attacks. It burrows two zones as a major action, moving underneath existing zones. It takes only a minor action to emerge from the ground after burrowing. An albino radscorpion cannot burrow through stone, metal, or wood."
  - name: "Solar Regeneration:"
    desc: "The albino radscorpion is unusual amongst its kin as, beyond its lack of carapace pigmentation, it has mutated to absorb energy from sunlight. At the start of each round, if the albino radscorpion is in direct sunlight, it recovers 3 health points."
  - name: "Weak Spot"
    desc: "If an attacker chooses to target the albino radscorpion’s head, it ignores the creature’s DR. This does not apply against hits which hit the head due to random chance."
scavenge_rules:
  - name: "Butchery:"
    desc: "Scavengers can butcher a dead albino radscorpion with a successful **END + Survival** test with a difficulty of 1. \n\n* This yields 2 D6 portions of [[Radscorpion Meat]]; if an Effect is rolled, it also yields 1 [[Radscorpion Stinger]], or a [[Radscorpion Egg]] if two Effects are rolled."
skills:

```