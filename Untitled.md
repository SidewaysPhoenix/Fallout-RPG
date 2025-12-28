```statblock
name: "Albino Radscorpion"
desc: "Pale and grotesque, these mutated monstrosities roam the Wasteland looking for prey, ranging from brahmin to deathclaws; there are few things they won’t fight. Twice the size of their obsidian cousins, the albino radscorpion has mutated beyond the normal bonds of nature. Its lighter carapace, though more sensitive to light, transforms the sun’s rays into energy, increasing its endurance and vitality. Able to shrug off heavy wounds, immune to radiation, and with a deadly poison sting, the albino radscorpion is able to go toe to toe with the greatest threats the wasteland has to offer.\n\n Though they rely mostly on the sting to fight, evidence of their claws can be found in their wake; an eviscerated carcass torn to pieces, or the limbs and extremities of once mighty foes. Whatever the case, the albino radscorpion is not something to be messed with."
level: "14"
type: "Mighty Creature"
keywords: "Mutated Arachnid"
xp: "204"
body_attr: 11
mind: 6
melee: "5"
guns: ""
other: "4"
hp: 78
initiative: 17
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
  - name: GLOWING
    desc: "<!-- form_id: glowing -->\n> **Special Abilities:** The creature gains the Glowing and Immune to Radiation abilities:\n>\n> **Glowing:** The creature inflicts 2 D6 Radiation damage to anyone within Reach of it at the start of each of its turns. In addition, any melee attacks it makes gain the Radioactive damage effect; if it already had this damage effect, it instead inflicts 2 Radiation damage per Effect rolled.\n>\n> **Immune to Radiation:** The creature reduces all Radiation damage suffered to 0, and cannot suffer any damage or effects from radiation.\n>\n> ---"
scavenge_rules:
  - name: "Butchery:"
    desc: "Scavengers can butcher a dead albino radscorpion with a successful **END + Survival** test with a difficulty of 1. \n\n* This yields 2 D6 portions of [[Radscorpion Meat]]; if an Effect is rolled, it also yields 1 [[Radscorpion Stinger]], or a [[Radscorpion Egg]] if two Effects are rolled."
skills:

```