```statblock
name: Super Mutant Master
image: [[Super Mutant Master image.jpg]]
desc: "Super mutant masters are higher up in the hierarchy than super mutant brutes and often have the armor, weaponry and combat experience to deserve their titles. These super mutants are almost always hostile and are equipped with much heavier and more destructive weapons, such as missile launchers and mini guns. While this kind of super mutant is often absent from smaller groups, they are almost always present within large communities."
level: 10
type: Normal Creature
keywords: Mutated Human
xp: 148
strength: 10
per: 8
end: 8
cha: 5
int: 6
agi: 5
lck: 5
skills:
  - name: "Big Guns"
    desc: "4 ⬛"
  - name: "Melee Weapons"
    desc: "4 ⬛"
  - name: "Small Guns"
    desc: "3"
  - name: "Survival"
    desc: "3 ⬛"
  - name: "Unarmed"
    desc: "4"
  - name: "Repair"
    desc: "2"
  - name: "Speech"
    desc: "2"
hp: 23
initiative: 15
modifier: 15
defense: 1
ac: 1
carry_wt: 250 lbs.
melee_bonus: +2 D6
luck_points: 3
phys_dr: "4 (All)"
energy_dr: "2 (Head), 4 (Arms, Legs, Torso)"
rad_dr: Immune
poison_dr: Immune
attacks:
 - name: "`dice: 2d20|render|text(UNARMED STRIKE: STR + Unarmed (TN 14))`"
   desc: "4 D6  Physical damage"
 - name: "`dice: 2d20|render|text(MINIGUN: END + Big Guns (TN 12))`"
   desc: "3 DC  Physical damage, [[Burst]], [[Spread]], Fire Rate 5, Range M,[[Gatling]], [[Inaccurate]], [[Two-Handed]]"
 - name: "`dice: 2d20|render|text(MISSILE LAUNCHER: END + Big Guns (TN 12))`"
   desc: "11 DC  Physical damage, Range L, [[Blast]], [[Two-Handed]]"
special_abilities:
 - name: "BARBARIAN:"
   desc: "+2 to Physical and Energy damage resistances (included)."
 - name: "IMMUNE TO RADIATION:"
   desc: "The super mutant master reduces all Radiation damage suffered to 0 and cannot suffer any damage or effects from radiation."
 - name: "IMMUNE TO POISON:"
   desc: "The super mutant master reduces all Poison damage suffered to 0 and cannot suffer any damage or effects from poison."
scavenge_rules:
 - name: ""
   desc: "[[Minigun]] OR [[Missile Launcher]]\n Assorted human bones (2 D6 Junk Items)\n Wealth 1\n [[Army Helmet]]\n [[Sturdy Raider Chest Piece]]\n [[Sturdy Raider Arm]] X2\n [[Sturdy Raider Leg]] X2"
```