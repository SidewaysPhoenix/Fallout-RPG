```statblock
name: Mercenary
image: [[Mercenary image.jpg]]
desc: "Like the gunners, there are many other individuals and groups whose weapons and violence can be bought for caps. Many can be found escorting merchants, protecting them from the dangers of raiders and wildlife, while some protect settlements or private individuals. You can expect to pay dearly for a well-trained mercenary who knows the area and its dangers well, but there are plenty who would just as quickly turn on you for the right number of caps."
level: 6
type: Normal Character
keywords: Human
xp: 45
strength: 6
per: 6
end: 6
cha: 5
int: 5
agi: 6
lck: 4
skills:
  - name: "Athletics"
    desc: "1"
  - name: "Big Guns"
    desc: "1"
  - name: "Energy Weapons"
    desc: "1"
  - name: "Medicine"
    desc: "1"
  - name: "Melee Weapons"
    desc: "2 ⬛"
  - name: "Small Guns"
    desc: "3 ⬛"
  - name: "Sneak"
    desc: "2 ⬛"
  - name: "Speech"
    desc: "1"
  - name: "Survival"
    desc: "1"
  - name: "Unarmed"
    desc: "1"
hp: 12
initiative: 12
modifier: 12
defense: 1
ac: 1
carry_wt: 210 lbs.
melee_bonus: 
luck_points: 
phys_dr: 2 (Arms, Legs, Torso)
energy_dr: 2 (Arms, Legs, Torso)
rad_dr: 0
poison_dr: 0
attacks:
 - name: "`dice: 2d20|render|text(UNARMED STRIKE: STR + Unarmed (TN 7))`"
   desc: "2 D6  Physical damage"
 - name: "`dice: 2d20|render|text(COMBAT RIFLE: AGI + Small Guns (TN 9))`"
   desc: "2 D6  Physical damage, Fire Rate 2, Range M, [[Two-Handed]]"
 - name: "`dice: 2d20|render|text(DOUBLE-BARRELLED SHOTGUN: AGI + Small Guns (TN 9))`"
   desc: "6 D6  [[Spread]], [[Vicious]] Physical damage, Range C, [[Inaccurate]], [[Two-Handed]]"
 - name: "`dice: 2d20|render|text(MOLOTOV COCKTAIL: PER + Explosives (TN 6))`"
   desc: "4 D6  [[Persistent]] Energy damage, [[Blast]], [[Thrown]], Range M. (See below.)"
special_abilities:
- name: "LET RIP:"
  desc: " Once per combat, the Mercenary may ‘let rip’ with a volley from their [[Combat Rifle]]. This adds the weapon’s Fire Rate of 2 to the weapon’s damage for a single attack (for 7 D6  total)."
scavenge_rules:
 - name: ""
   desc: "[[Combat Chest Piece]]\n [[Combat Leg]] x2\n [[Combat Arm]] x2\n [[Combat Rifle]]\n Wealth 2"
```