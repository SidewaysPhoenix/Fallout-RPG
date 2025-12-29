```statblock
name: Raider Scavver
image: [[Raider Scaver image.jpg]]
desc: "These battle-hardened raiders are often identified by their studier armor and their aggressive nature. Raider gangs with long histories, or those full of experienced members among their ranks are often made up largely of raider scavvers. One of them alone can be a challenging inconvenience, but a group of these fighters can prove to easily take the possessions and life of many a wasteland traveler."
level: 7
type: Normal Character
keywords: Human Raider
xp: 52
strength: 6
per: 7
end: 6
cha: 5
int: 5
agi: 6
lck: 4
skills:
  - name: "Athletics"
    desc: "2"
  - name: "Big Guns"
    desc: "1"
  - name: "Energy Weapons"
    desc: "2"
  - name: "Melee Weapons"
    desc: "3 ⬛"
  - name: "Repair"
    desc: "1"
  - name: "Small Guns"
    desc: "3 ⬛"
  - name: "Survival"
    desc: "2"
  - name: "Throwing"
    desc: "1"
  - name: "Unarmed"
    desc: "1"
hp: 13
initiative: 13
modifier: 13
defense: 1
ac: 1
carry_wt: 210 lbs.
melee_bonus: 
luck_points: 
phys_dr: "3 (Arms, Torso); 2 (Legs)"
energy_dr: "3 (Arms, Torso); 2 (Legs)"
rad_dr: 0
poison_dr: 0
attacks:
 - name: "`dice: 2d20|render|text(UNARMED STRIKE: STR + Unarmed (TN 7))`"
   desc: "2 D6  Physical damage"
 - name: "`dice: 2d20|render|text(MACHETE: STR + Melee Weapons (TN 9))`"
   desc: "4 D6  [[Piercing]] Physical damage"
 - name: "`dice: 2d20|render|text(COMBAT SHOTGUN: AGI + Small Guns (TN 9))`"
   desc: "5 D6  [[Spread]], Physical damage, Range C, [[Inaccurate]], [[Two-Handed]]"
special_abilities:
- name: "AGGRESSIVE:"
  desc: " Raider scavver is quick to action when it senses prey. When the scavver enters a scene, immediately generate 1 Action Point. If the scavver is an ally, then this goes into the group pool. If they are an enemy, it goes into the GM’s pool."
scavenge_rules:
 - name: ""
   desc: "[[Heavy Raider Chest Piece]]\n [[Sturdy Raider Leg]] x2\n [[Heavy Raider Arm]] x2\n [[Combat Shotgun]]\n [[Machete]]\n Wealth 1"
```