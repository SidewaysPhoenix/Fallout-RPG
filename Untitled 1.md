```statblock
name: "Albino Radscorpion"
desc: "Pale and grotesque, these mutated monstrosities roam the Wasteland looking for prey, ranging from brahmin to deathclaws; there are few things they won’t fight. Twice the size of their obsidian cousins, the albino radscorpion has mutated beyond the normal bonds of nature. Its lighter carapace, though more sensitive to light, transforms the sun’s rays into energy, increasing its endurance and vitality. Able to shrug off heavy wounds, immune to radiation, and with a deadly poison sting, the albino radscorpion is able to go toe to toe with the greatest threats the wasteland has to offer.\n\n Though they rely mostly on the sting to fight, evidence of their claws can be found in their wake; an eviscerated carcass torn to pieces, or the limbs and extremities of once mighty foes. Whatever the case, the albino radscorpion is not something to be messed with."
level: "15"
type: "Mighty Creature"
keywords: "Mutated Arachnid"
xp: "204"
body_attr: 13
mind: 6
melee: "6"
guns: ""
other: "4"
hp: "82"
initiative: 19
modifier: "17"
defense: 1
ac: "1"
phys_dr: "8"
energy_dr: "5 (All)"
rad_dr: Immune
poison_dr: Immune
attacks:
  - name: "`dice: 2d20|render|text(CLAW: BODY + Melee (TN 19))`"
    desc: "6 D6 [[Vicious]] Physical damage"
  - name: "`dice: 2d20|render|text(STING: BODY + Melee (TN 19))`"
    desc: "7 D6 [[Persistent]] Poison damage"
special_abilities:
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
  - name: ALPHA
    desc: "<!-- form_id: alpha -->\n> **Level:** The creature is one level higher than normal. Make the following changes:\n>\n> - Add +1 to the creature’s Body or Mind\n> - Add +1 to one of the creature’s skills\n> - Adjust Initiative in line with increased Body or Mind\n> - Add +1 HP, or +2 if Body was increased\n> - Add either +1 to one type of damage resistance on all locations, or +1 D6 to one attack\n>\n> **Special Abilities:** The creature gains the Aggressive and the Leader of the Pack abilities:\n>\n> **Aggressive:** The creature is quick to action when it senses prey. When the creature enters a scene, immediately generate 1 Action Point. If the creature is an ally, then this goes into the group pool. If the creature is an enemy, then it goes into the GM’s pool.\n>\n> **Leader of the Pack:** The creature leads a group of its kind. All Normal creatures of the same kind and lower level within Close range may re-roll 1d20 on all tests while this creature is still alive.\n>\n> ---"
scavenge_rules:
  - name: "Butchery:"
    desc: "Scavengers can butcher a dead albino radscorpion with a successful **END + Survival** test with a difficulty of 1. \n\n* This yields 2 D6 portions of [[Radscorpion Meat]]; if an Effect is rolled, it also yields 1 [[Radscorpion Stinger]], or a [[Radscorpion Egg]] if two Effects are rolled."
skills:

```