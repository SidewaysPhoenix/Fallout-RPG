```statblock
name: Lancer
desc: "The rank of Lancer denotes a member of the Brotherhood who takes on the role as a Vertibird pilot. They undergo specialist training to learn how to fly and maintain the aircraft used by the Brotherhood of Steel so that they can properly provide transport and air support. Not only do Lancers need to have a good understanding of their craft but also a good understanding of how to fly while under heavy fire. While they primarily focus on combat from the skies, they also carry laser weaponry in case they find themselves on the ground amid a firefight. "
level: 5
type: Normal Character
keywords: Human
xp: 38
strength: 5
per: 6
end: 6
cha: 5
int: 6
agi: 6
lck: 4
skills:
  - name: "Athletics"
    desc: "1"
  - name: "Big Guns"
    desc: "1"
  - name: "Energy Weapons"
    desc: "3 ⬛"
  - name: "Explosives"
    desc: "1"
  - name: "Pilot"
    desc: "4 ⬛"
  - name: "Repair"
    desc: "3"
  - name: "Science"
    desc: "1"
  - name: "Small Guns"
    desc: "1"
hp: 11
initiative: 12
modifier: 12
defense: 1
ac: 1
carry_wt: 200 lbs.
melee_bonus: 
luck_points: 
phys_dr: 2 (Arms, Legs, Torso)
energy_dr: 2 (Arms, Legs, Torso)
rad_dr: 1 (Arms, Legs, Torso)
poison_dr: 0
attacks:
 - name: "`dice: 2d20|render|text(UNARMED STRIKE: STR + Unarmed (TN 5))`"
   desc: "2 D6  Physical damage"
 - name: "`dice: 2d20|render|text(LONG LASER RIFLE: PER + Energy Weapons (TN 9))`"
   desc: "5 D6  [[Piercing]] 1 Energy damage, Range M, Fire Rate 2, [[Two-Handed]]"
special_abilities:
- name: "THE CHAIN THAT BINDS:"
  desc: "As a major action, a Lancer can order a Brotherhood character of lower level to immediately perform a major action. The Lancer assists that action with **CHA + Speech**."
- name: "VERTIBIRD TRAINING:"
  desc: "The Lancer gains a bonus d20 when making tests to  pilot a Vertibird"
scavenge_rules:
 - name: ""
   desc: "[[Brotherhood of Steel Uniform]] (Bomber Jacket)\n Laser Rifle=[[Laser Gun]] ([[Long Barrel]], [[Standard Stock]])\n Brotherhood of Steel Holotags\n Wealth 2"
```