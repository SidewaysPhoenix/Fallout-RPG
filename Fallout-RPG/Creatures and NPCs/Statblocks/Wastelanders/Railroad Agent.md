```statblock
name: Railroad Agent
desc: "The underground faction of the Railroad seeks to liberate third-generation synths from the Institutes control. Railroad agents often work undercover, acting and dressing as discreetly as possible. They rarely act in the open, preferring to resort to subterfuge to carry out their mission. Despite this, they have no issue in taking up arms against those who might stand in their way, or stand with their enemies, such as the Brotherhood of Steel."
level: 7
type: Normal Character
keywords: Human
xp: 39
strength: 5
per: 7
end: 6
cha: 6
int: 6
agi: 5
lck: 4
skills:
  - name: "Barter"
    desc: "1"
  - name: "Energy Weapons"
    desc: "1"
  - name: "Lockpick"
    desc: "2"
  - name: "Medicine"
    desc: "1"
  - name: "Melee Weapons"
    desc: "1"
  - name: "Repair"
    desc: "1"
  - name: "Science"
    desc: "2"
  - name: "Small Guns"
    desc: "2 ⬛"
  - name: "Sneak"
    desc: "3 ⬛"
  - name: "Speech"
    desc: "1"
  - name: "Survival"
    desc: "2"
hp: 13
initiative: 12
modifier: 12
defense: 1
ac: 1
carry_wt: 200 lbs.
melee_bonus: 
luck_points: 
phys_dr: 1 (Arms, Legs, Torso)
energy_dr: 1 (Arms, Legs, Torso)
rad_dr: 0
poison_dr: 0
attacks:
 - name: "`dice: 2d20|render|text(UNARMED STRIKE: STR + Unarmed (TN 5))`"
   desc: "2 D6  Physical damage"
 - name: "`dice: 2d20|render|text(HUNTING RIFLE: AGI + Small Guns (TN 7))`"
   desc: "6 D6  [[Piercing]] Physical damage, Range M, [[Two-Handed]]"
special_abilities:
- name: "RAILROAD AGENT:"
  desc: "When working undercover, the Railroad agent gains a bonus d20 in any Speech tests where deception is involved."
scavenge_rules:
 - name: ""
   desc: "[[Tough Clothing]]\n Wealth 2"
```