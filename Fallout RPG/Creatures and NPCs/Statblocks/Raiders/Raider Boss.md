```statblock
name: Raider Boss
desc: "Raider bosses tend to sit at the top of the hierarchy within a raider gang. They are usually equipped with better weapons and armor than their underlings and tend to be experienced combatants. They have often earned their position through repeated displays of strength, leadership, and bloodshed and keep it in much the same way. "
level: 10
type: Major Character
keywords: Human Raider
xp: 222
strength: 8
per: 9
end: 8
cha: 8
int: 7
agi: 8
lck: 6
skills:
  - name: "Athletics"
    desc: "2"
  - name: "Big Guns"
    desc: "2 ⬛"
  - name: "Explosives"
    desc: "2 ⬛"
  - name: "Melee Weapons"
    desc: "3 ⬛"
  - name: "Repair"
    desc: "2"
  - name: "Small Guns"
    desc: "4 ⬛"
  - name: "Sneak"
    desc: "1"
  - name: "Speech "
    desc: "2"
  - name: "Survival"
    desc: "3"
  - name: "Throwing"
    desc: "1"
  - name: "Unarmed"
    desc: "2"
hp: 30
initiative: 21
modifier: 21
defense: 1
ac: 1
carry_wt: 130 lbs.
melee_bonus: +1 D6
luck_points: 6
phys_dr: 0 (Head), 3 (Torso), 3 (Arms), 2 (Legs)
energy_dr: 0 (Head), 3 (Torso), 3 (Arms), 2 (Legs)
rad_dr: 0
poison_dr: 0
attacks:
 - name: "`dice: 2d20|render|text(UNARMED STRIKE: STR + Unarmed (TN 10))`"
   desc: "3 D6  Physical damage"
 - name: "`dice: 2d20|render|text(FRAG GRENADE: PER + Explosives (TN 11))`"
   desc: "6 D6  Physical Damage, [[Blast]], [[Thrown]], Range M"
 - name: "`dice: 2d20|render|text(HUNTING RIFLE: AGI + Small Guns (TN 12))`"
   desc: "6 D6  [[Piercing]] Physical damage, Range M, [[Two-Handed]]"
special_abilities:
- name: "AGGRESSIVE:"
  desc: "The raider boss is quick to action when it senses prey. When the boss enters a scene, immediately generate 1 Action Point. If the boss is an ally, then this goes into the group pool. If they are an enemy, it goes into the GM’s pool."
- name: "ACTION PACKED:"
  desc: "The raider boss is driven and motivated and takes matters into their own hands. The raider boss begins each scene with a personal pool of 4 Action Points, which it may spend instead of drawing from other sources."
scavenge_rules:
 - name: ""
   desc: "[[Heavy Raider Chest Piece]]\n [[Sturdy Raider Leg]] x2\n [[Heavy Raider Arm]] x2\n 3 [[Frag Grenade]]s\n [[Hunting Rifle]]\n Wealth 2"
```
![[Raider Boss image.jpg]]