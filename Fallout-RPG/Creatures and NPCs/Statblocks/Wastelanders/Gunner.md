```statblock
name: Gunner
desc: "The gunners are perhaps the most prolific of the wasteland’s toughs aside from raiders. While they advertise as guns for hire, getting close enough to offer them the caps for a job can prove to be difficult. Often choosing destroyed overpasses as bases of operation with some choosing to use elevators to reach the upper levels and stay off the ground, the gunners are highly territorial. They defend the areas they occupy fiercely and are even known to use reprogrammed Assaultrons as part of their weapons arsenal."
level: 6
type: Normal Character
keywords: Human
xp: 45
strength: 5
per: 6
end: 6
cha: 5
int: 5
agi: 7
lck: 4
skills:
  - name: "Athletics"
    desc: "1"
  - name: "Big Guns"
    desc: "2"
  - name: "Energy Weapons"
    desc: "3 ⬛"
  - name: "Melee Weapons"
    desc: "3"
  - name: "Science"
    desc: "2"
  - name: "Small Guns"
    desc: "3 ⬛"
  - name: "Survival"
    desc: "1"
hp: 12
initiative: 13
modifier: 13
defense: 1
ac: 1
carry_wt: 200 lbs.
melee_bonus: 
luck_points: 
phys_dr: "1 (Arms); 2 (Legs, Torso)"
energy_dr: "2 (Arms, Legs, Torso)"
rad_dr: 0
poison_dr: 0 
attacks:
 - name: "`dice: 2d20|render|text(UNARMED: STR + Unarmed (TN 5))`"
   desc: "2 D6  Physical damage"
 - name: "`dice: 2d20|render|text(LASER GUN: PER + Energy Weapons (TN 9))`"
   desc: "4 D6  [[Piercing]] Energy damage, Fire Rate 2, Range C"
 - name: "`dice: 2d20|render|text(COMBAT RIFLE: AGI + Small Guns (TN 10))`"
   desc: "5 D6  Physical damage, Fire Rate 2, Range M, [[Two-Handed]]"
special_abilities:
- name: "LET RIP:"
  desc: "Once per combat, the Gunner may ‘let rip’ with a volley from their [[Combat Rifle]] or [[Laser Gun]]. This adds the weapon’s Fire Rate of 2 to the weapon’s damage for a single attack (for 7 D6 total)."
scavenge_rules:
 - name: ""
   desc: "[[Combat Chest Piece]]\n [[Leather Leg]] x2\n [[Leather Arm]] x2\n [[Combat Rifle]] or [[Laser Gun]]\n Wealth 2"
```