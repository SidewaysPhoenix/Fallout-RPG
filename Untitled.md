```statblock
name: "Super Mutant Brute"
desc: "Super mutant brutes are tougher than the ordinary Institute super mutant. They retain more of their intelligence, have an increased eloquence to their speech, and often employ better tactics in combat, such as actively looking seeking cover and looking for weak points in their enemies. They tend to carry better weapons to reflect this increased awareness and often wear heavier armor. Increased constitution and resistance to damage also exists in super mutant brutes, making them harder to put down in a fight."
level: "13"
type: "Major Character"
keywords: "Mutated Human"
xp: "156"
strength: 9
per: 5
end: 7
cha: 1
int: 1
agi: 5
lck: 4
skills:
  - name: Athletics
    desc: "1"
  - name: "Big Guns"
    desc: "0"
  - name: "Melee Weapons "
    desc: "4 ⬛"
  - name: "Small Guns"
    desc: "0"
  - name: Survival
    desc: "2"
  - name: Throwing
    desc: "0"
  - name: Unarmed
    desc: "2"
  - name: Medicine
    desc: "2 ⬛"
  - name: "Energy Weapons"
    desc: "2 ⬛"
hp: "28"
initiative: "14"
modifier: "10"
defense: 1
ac: "1"
carry_wt: "240 lbs."
melee_bonus: "+2 D6"
luck_points: 0
phys_dr: "4 (Head); 3 (Legs); 2 (Torso, Arms)"
energy_dr: "3 (Legs); 2 (Torso, Arms, Head)"
rad_dr: Immune
poison_dr: Immune
attacks:
  - name: "UNARMED STRIKE: STR + Unarmed (TN 11)"
    desc: "4 D6  Physical damage"
  - name: "BOARD: STR + Melee Weapons (TN 9)"
    desc: "6 D6  Physical damage, [[Two-Handed]]"
  - name: "PIPE BOLT-ACTION RIFLE: AGI + Small Guns (TN 5)"
    desc: "5 D6  [[Piercing]] Physical damage, Range M, Fire Rate 0, [[Two-Handed]], [[Unreliable]]"
special_abilities:
  - name: "Special Abilities:"
    desc: "\n **Requirements:** This template can only be applied to a non-mutated human character or a non-robot creature.\n\n **Attributes:** A character’s CHA and INT are reduced to 1. A Scorched character has 0 Luck points. A creature’s Body and Mind scores are unchanged.\n\n **Skills:** A character loses all ranks in skills except Athletics, Melee Weapons, Sneak, Survival, and Unarmed. The character must change their tag skills to one of the listed skills. Creatures’ skills are unchanged.\n>>\n>> **Attacks:** Scorched are still able to wield melee weapons if they did so before, but they can no longer use weapons to make ranged attacks (they may still make ranged attacks natural to the creature). Attacks from a scorched character or creature count as exposure to a source of disease.\n>>\n>> **Special Abilities:** The scorched character or creature gains the Scorched ability:\n>>\n>> **Scorched:** The creature is barely intelligent, driven by instinct and aggression against the uninfected. Scorched creatures cannot be persuaded or influenced by Speech tests. Scorched creatures move towards and attack the nearest enemy, and due to their hive mind, when one scorched becomes aware of prey, all others within Long range will be alerted and move to attack. If they cannot detect an enemy, they move towards the nearest source of bright light or loud noise. Failing that, they will move around randomly or simply stand perfectly still."
  - name: "MAJOR CHARACTER"
    desc: "<!-- id: toxic -->\n>>A Legendary creature or Major character mutates the first time they are reduced to below half of their maximum HP, at which point they immediately take an extra turn (this is in addition to the creature or character’s normal turn) and gain the **Mutation** effect of their Legendary Ability for the remainder of the scene.\n>>If a creature mutates and then regains enough HP to go above half its maximum HP, the creature cannot mutate a second time.\n>\n>>**TOXIC**\n>The creature’s bite, sting, or claws are home to a particularly nasty venom, which often kills those who aren’t slain by the initial attack.\n>\n>>**Effect:** The creature’s melee attacks gain the [[Persistent]] (Poison) damage effect. Further, choose one of the following damage effects: [[Fallout-RPG/Descriptions and Rules/Combat/Damage Effects/Radioactive|Radioactive]], [[Stun]], or [[Vicious]]. The persistent Poison damage is counted as having the chosen damage effect.\n>>\n>>**Mutation:** When this creature mutates, it exudes toxic fumes as well. Anyone within Reach of the creature at the start of its turn suffers 5 D6 Poison damage. This Poison damage also has the damage effect chosen."
  - name: "BARBARIAN:"
    desc: "+2 to Physical and Energy damage resistances (included)."
  - name: "IMMUNE TO RADIATION:"
    desc: "The super mutant brute reduces all Radiation damage suffered to 0 and cannot suffer any damage or effects from radiation."
  - name: "IMMUNE TO POISON:"
    desc: "The super mutant brute reduces all Poison damage suffered to 0 and cannot suffer any damage or effects from poison."
scavenge_rules:
  - name: ""
    desc: "[[Pipe Bolt-Action]]\n [[Board]]\n Assorted Human Bones\n Wealth 3\n Super Mutant Helmet\n Super Mutant Leg Guards x2"
melee_damage: "+2D6"
```