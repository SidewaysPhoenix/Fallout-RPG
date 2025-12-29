```statblock
name: Raider Veteran
image: [[Raider Veteran image.jpg]]
desc: "Survival in the wasteland often earns you at least a modicum of respect among your peers and that is the case for veteran raiders. The improved armor and higher-grade weaponry often point to their ability to survive and even thrive in the wasteland, making them difficult to come up against. Often both effective in combat and intelligent, they are not to be underestimated. "
level: 8
type: Notable Character
keywords: Human Raider
xp: 120
strength: 7
per: 8
end: 7
cha: 6
int: 5
agi: 7
lck: 6
skills:
  - name: "Athletics"
    desc: "2"
  - name: "Explosives"
    desc: "1"
  - name: "Medicine"
    desc: "1"
  - name: "Melee Weapons"
    desc: "4 ⬛"
  - name: "Small Guns"
    desc: "4 ⬛"
  - name: "Sneak"
    desc: "1"
  - name: "Speech"
    desc: "2"
  - name: "Survival"
    desc: "2"
  - name: "Unarmed"
    desc: "2"
hp: 21
initiative: 17
modifier: 17
defense: 1
ac: 1
carry_wt: 210 lbs
melee_bonus: +1 D6
luck_points: 3
phys_dr: 2 (All)
energy_dr: 2 (All)
rad_dr: 0
poison_dr: 0
attacks:
 - name: "`dice: 2d20|render|text(UNARMED STRIKE: STR + Unarmed (TN 9))`"
   desc: "3 D6  Physical damage"
 - name: "`dice: 2d20|render|text(MACHETE: STR + Melee Weapons (TN 11))`"
   desc: "3 D6  [[Piercing]] 1 Physical damage"
 - name: "`dice: 2d20|render|text(COMBAT RIFLE: AGI + Small Guns (TN 11))`"
   desc: "3 D6  Physical damage, Range M, Fire Rate 2, [[Two-Handed]]"
 - name: "`dice: 2d20|render|text(MOLOTOV COCKTAIL: PER + Explosives (TN 9))`"
   desc: "4 D6  [[Persistent]], Energy damage, [[Blast]], [[Thrown]], Range M. (See below.)"
special_abilities:
- name: "IN CHARGE:"
  desc: "A raider veteran may spend a minor action to order a raider of lower level within Close range to immediately perform a minor action. Alternatively, they may spend a major action to order another raider to take a major action immediately."
- name: "LET RIP:"
  desc: "Once per combat, the raider veteran may ‘let rip’ with a volley from their Combat Rifle. This adds the weapon’s Fire Rate of 2 to the weapon’s damage for a single attack (for 7 D6 total)."
scavenge_rules:
 - name: ""
   desc: "[[Spike Armor]]\n [[Combat Rifle]]\n [[Machete]]\n Wealth 2"
```