```statblock
layout: Fallout_2d20_statblock_test
name: "Mole Rat"
image: "[[Molerat image.jpg]]"
desc: "A mutated burrowing rodent that lives and hunts in packs."
level: "13"
type: "Normal Creature"
keywords: "Mutated Mammal"
xp: "17"

bodyAttribute: 11
mindAttribute: 4
meleeSkill: 2
gunsSkill: 0
otherSkill: 2

hp: 18
initiative: 15
defense: 1
phys_dr: "6"
energy_dr: "0"
rad_dr: "Immune"
poison_dr: "0"

attacks:
  - id: "bite"
    name: "BITE"
    attribute: "bodyAttribute"
    skill: "meleeSkill"
    damage: 9
    damageEffects: "[[Piercing]] 1"
    damageQualities: ""
    damageType: "Physical"

special_abilities:
  - name: "RABID:"
    desc: "*Special Abilities:* The creature gains the Feral and Rabid abilities:\n\n*Feral:* The creature is unintelligent, driven purely by feral instinct. Feral creatures cannot be persuaded or influenced by Speech tests. Feral creatures move towards and attack the nearest enemy. If they cannot detect an enemy, they move towards the nearest source of bright light or loud noise. Failing that, they will move around randomly or simply lie down and do nothing.\n\n*Rabid:* The creature’s melee attacks gain the [[Persistent]] (Poison) damage effect. Further, when a creature suffers any Poison damage from a Rabid creature’s attacks, it counts as two exposures to disease for the purposes of seeing if you’ve contracted a disease (*Fallout: The Roleplaying Game Core Rulebook*, p.193)."

  - name: "BURROW:"
    desc: "As a major action, the mole rat may burrow underground to get away from its enemies and prepare for its next attack. On its next turn it can use its minor action to appear above ground anywhere within medium range of the place it burrowed. For the cost of 1 AP it may also add an extra D6 to its bite attack after emerging."

  - name: "KEEN SENSES:"
    desc: "One or more of the mole rat’s senses are especially keen; they can attempt to detect creatures or objects which characters normally cannot, and they reduce the difficulty of all other **PER** tests by 1 (to a minimum of 0). This includes detecting the presence of creatures above ground while burrowed."

  - name: "IMMUNE TO RADIATION:"
    desc: "The mole rat reduces all Radiation damage suffered to 0 and cannot suffer any damage or effects from radiation."

scavenge_rules:
  - name: "BUTCHERY:"
    desc: "Scavengers can butcher a dead mole rat with a successful **END + Survival** test with a difficulty of 0.\nThis yields:\n1 portion of [[Mole Rat Meat]]\n1 common material."
```