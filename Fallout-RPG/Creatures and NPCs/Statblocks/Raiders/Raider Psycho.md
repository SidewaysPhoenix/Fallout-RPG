```statblock
name: Raider Psycho
image: [[Raider Psycho image.jpg]]
desc: "Aptly named for their dependence on the Psycho, these raiders are among some of the most hostile and aggressive. They opt for melee weapons in fights, using Psycho to fuel their rage and make them less susceptible to pain in close combat. Telling a raider psycho apart from others is not always easy, but they tend to lack firearms and have tougher armor that covers more of the head, arms and torso to protect them in melee combat."
level: 7
type: Normal Character
keywords: Human Raider
xp: 52
strength: 7
per: 6
end: 7
cha: 4
int: 5
agi: 6
lck: 4
skills:
  - name: "Athletics"
    desc: "1"
  - name: "Energy Weapons"
    desc: "1"
  - name: "Medicine"
    desc: "2"
  - name: "Melee Weapons"
    desc: "3 ⬛"
  - name: "Repair"
    desc: "1"
  - name: "Science"
    desc: "1"
  - name: "Small Guns"
    desc: "2 ⬛"
  - name: "Sneak"
    desc: "1"
  - name: "Survival"
    desc: "2"
  - name: "Throwing"
    desc: "1"
  - name: "Unarmed"
    desc: "1"
hp: 14
initiative: 12
modifier: 12
defense: 1
ac: 1
carry_wt: 130 lbs.
melee_bonus: +1 D6
luck_points: 
phys_dr: 1 (Arms, Legs, Torso)
energy_dr: 2 (Torso), 2 (Arms, Legs
rad_dr: 0
poison_dr: 0
attacks:
 - name: "`dice: 2d20|render|text(UNARMED STRIKE: STR + Unarmed (TN 8))`"
   desc: "3 D6  Physical damage"
 - name: "`dice: 2d20|render|text(MACHETE: STR + Melee Weapons (TN 10))`"
   desc: "4 D6  [[Piercing]] 1 Physical damage"
 - name: "`dice: 2d20|render|text(DOUBLE-BARRELLED SHOTGUN: AGI + Small Guns (TN 8))`"
   desc: "6 D6  [[Spread]], [[Vicious]] Physical damage, Range C, [[Inaccurate]], [[Two-Handed]]"
 - name: "`dice: 2d20|render|text(MOLOTOV COCKTAIL: PER + Explosives (TN 6))`"
   desc: "4 D6  [[Persistent]] Energy damage, [[Blast]], [[Throwing]], Range M."
special_abilities:
- name: "CHEMS OR KABOOM:"
  desc: "A raider psycho carries either one [[Molotov Cocktail]] or one dose of [[Psycho]]. Which they are carrying is determined by which of the following actions they take first: after using one, they may not use the other in that combat."
- name: "MOLOTOV:"
  desc: " Once per combat, a raider psycho may throw a Molotov Cocktail, using the profile above."
- name: "PSYCHO:"
  desc: " A raider psycho may use a dose of Psycho as a minor action. For the remainder of the combat, the raider psycho adds +2 D6  to all damage rolls they make and add +2 to Physical and Energy damage resistances."
scavenge_rules:
 - name: ""
   desc: "[[Road Leathers]]\n [[Leather Chest Piece]]\n [[Double-Barrel Shotgun]]\n [[Machete]]\n Wealth 1"
```