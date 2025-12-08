```statblock
name: Elder
desc: "Elders make up the Brotherhood of Steel’s leadership council. To reach the lofty position of Elder, an individual must progress through the Brotherhood’s ranks and must reach at least Paladin to be considered. While a council of Elders are responsible for the entire organization, one or more Elders may also lead their own chapters in various parts of the wasteland."
level: 10
type: Major Character
keywords: Human
xp: 222
strength: 7
per: 8
end: 8
cha: 9
int: 8
agi: 7
lck: 7
skills:
  - name: "Athletics"
    desc: "1"
  - name: "Barter"
    desc: "1"
  - name: "Energy Weapons"
    desc: "4 ⬛"
  - name: "Medicine"
    desc: "1"
  - name: "Melee Weapons"
    desc: "2"
  - name: "Pilot"
    desc: "2"
  - name: "Repair"
    desc: "3 ⬛"
  - name: "Science"
    desc: "4 ⬛"
  - name: "Sneak"
    desc: "1"
  - name: "Speach"
    desc: "5 ⬛"
  - name: "Survival"
    desc: "3"
  - name: "Unarmed"
    desc: "2"
hp: 32
initiative: 19
modifier: 19
defense: 1
ac: 1
carry_wt: 220 lbs.
melee_bonus: +1 D6
luck_points: 
phys_dr: "3 (Arms, Legs, Torso)"
energy_dr: "2 (Arms, Legs, Torso)"
rad_dr: "1 (Arms, Legs, Torso)"
poison_dr: 0
attacks:
 - name: "`dice: 2d20|render|text(UNARMED STRIKE: STR + Unarmed (TN 9))`"
   desc: "3 D6  Physical damage"
 - name: "`dice: 2d20|render|text(LONG LASER RIFLE: PER + Energy Weapons (TN 12))`"
   desc: "5 D6  [[Piercing]] 1 Energy damage, Range M, Fire Rate 2, [[Two-Handed]]"
special_abilities:
- name: "THE CHAIN THAT BINDS:"
  desc: "As a major action, an Elder can order a Brotherhood character of lower level to immediately perform a major action. The Elder assists that action with **CHA + Speech**."
scavenge_rules:
 - name: ""
   desc: "[[Brotherhood of Steel Uniform]],\nLong Laser Rifle=[[Laser Gun]] ([[Long Barrel]], [[Standard Stock]]), \nBrotherhood of Steel Holotags"
```
![[BOS Elder image.jpg]]

