```statblock
name: Super Mutant Brute
desc: "Super mutant brutes are tougher than the ordinary Institute super mutant. They retain more of their intelligence, have an increased eloquence to their speech, and often employ better tactics in combat, such as actively looking seeking cover and looking for weak points in their enemies. They tend to carry better weapons to reflect this increased awareness and often wear heavier armor. Increased constitution and resistance to damage also exists in super mutant brutes, making them harder to put down in a fight."
level: 7
type: Normal Creature
keywords: Mutated Human
xp: 52
strength: 9
per: 5
end: 7
cha: 4
int: 5
agi: 5
lck: 4
skills:
  - name: "Athletics"
    desc: "1"
  - name: "Big Guns"
    desc: "2"
  - name: "Melee Weapons "
    desc: "4 ⬛"
  - name: "Small Guns"
    desc: "4 ⬛"
  - name: "Survival"
    desc: "2"
  - name: "Throwing"
    desc: "1"
  - name: "Unarmed"
    desc: "2"
hp: 14
initiative: 10
modifier: 10
defense: 1
ac: 1
carry_wt: 240 lbs.
melee_bonus: +2 D6
luck_points: 
phys_dr: "4 (Head); 3 (Legs); 2 (Torso, Arms)"
energy_dr: "3 (Legs); 2 (Torso, Arms, Head)"
rad_dr: Immune
poison_dr: Immune
attacks:
 - name: "`dice: 2d20|render|text(UNARMED STRIKE: STR + Unarmed (TN 11))`"
   desc: "4 D6  Physical damage"
 - name: "`dice: 2d20|render|text(BOARD: STR + Melee Weapons (TN 13))`"
   desc: "6 D6  Physical damage, [[Two-Handed]]"
 - name: "`dice: 2d20|render|text(PIPE BOLT-ACTION RIFLE: AGI + Small Guns (TN 9))`"
   desc: "5 D6  [[Piercing]] Physical damage, Range M, Fire Rate 0, [[Two-Handed]], [[Unreliable]]"
special_abilities:
- name: "BARBARIAN:"
  desc: "+2 to Physical and Energy damage resistances (included)."
- name: "IMMUNE TO RADIATION:"
  desc: "The super mutant brute reduces all Radiation damage suffered to 0 and cannot suffer any damage or effects from radiation."
- name: "IMMUNE TO POISON:"
  desc: "The super mutant brute reduces all Poison damage suffered to 0 and cannot suffer any damage or effects from poison."
scavenge_rules:
 - name: ""
   desc: "[[Pipe Bolt-Action]]\n [[Board]]\n Assorted Human Bones\n Wealth 1\n Super Mutant Helmet\n Super Mutant Leg Guards x2"
```