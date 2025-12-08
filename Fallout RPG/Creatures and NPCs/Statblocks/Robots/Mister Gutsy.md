```statblock
name: Mister Gutsy
desc: "The potential of the Mister Handy robots was not missed by the U.S. Military, who commissioned General Atomics International to create combat variants of the Mister Handy line. That commission would eventually lead to the creation of the Mister Gutsy robot. Featuring armor plating built into its body, a plethora of deadly weapon attachments, updates to its sensory analysis, and improvements to speed lead it to become a capable personal protection robot. Their specialist military programming allows them to receive and understand orders in real time, increased aggression in combat and even the ability to give them ranks alongside human soldiers. It is this programming which also gives them their unique Marine drill sergeant personality. With many Mister Gutsys now lacking orders, incapable of understanding the war is over, with their commanders long dead, they can often be found still protecting the military bases on which they serve or wandering nearby. They are often hostile to any they come across, though a rare few have managed to trick a Mister Gutsy into believing the individual is a member of the U.S. army in order to avoid conflict with one of these dangerous machines."
level: 7
type: Notable Character
keywords: Robot
xp: 104
strength: 6
per: 9
end: 7
cha: 5
int: 7
agi: 8
lck: 4
skills:
  - name: "Big Guns"
    desc: "4 ⬛"
  - name: "Melee Weapons"
    desc: "3 ⬛"
  - name: "Repair"
    desc: "1"
  - name: "Small Guns"
    desc: "4 ⬛"
  - name: "Speech"
    desc: "1"
hp: 18
initiative: 19
modifier: 19
defense: 1
ac: 1
carry_wt: 150 lbs.
melee_bonus: +0 D6
luck_points: 2
phys_dr: 2 (All)
energy_dr: 2 (All)
rad_dr: Immune
poison_dr: Immune
attacks:
 - name: "`dice: 2d20|render|text(PINCER: STR + Melee (TN 9))`"
   desc: "2 D6  Physical damage"
 - name: "`dice: 2d20|render|text(10MM AUTO PISTOL: AGI + Small Guns (TN 11))`"
   desc: "5 D6  Physical damage, Range C, Fire Rate 4, [[Close Quarters]], [[Reliable]], [[Burst]]"
 - name: "`dice: 2d20|render|text(FLAMER: END + Big Guns (TN 11))`"
   desc: "3 D6  [[Persistent]] Energy damage, Fire Rate 1, Range C"
special_abilities:
- name: "ROBOT:"
  desc: "The Mister Gutsy is a robot. They are immune to the effects of starvation, thirst, and suffocation. They are also immune to Poison and Radiation damage. However, machines cannot use food and drink or other consumables, they do not heal naturally, and the Medicine skill cannot be used to heal them: damage to them must be repaired (p.34 Core Rule Book)."
- name: "IMMUNE TO POISON:"
  desc: "The Mister Gutsy reduces all Poison damage suffered to 0 and cannot suffer any damage or effects from poison."
- name: "IMMUNE TO RADIATION:"
  desc: "The Mister Gutsy reduces all Radiation damage suffered to 0 and cannot suffer any damage or effects from radiation."
- name: "IMMUNE TO DISEASE:"
  desc: "The Mister Gutsy is immune to the effects of all diseases, and they will never suffer the symptoms of any disease."
- name: "MISTER HANDY:"
  desc: "The Mister Gutsy has 360° vision, and improved sensory systems that can detect smells, chemicals, and radiation, reducing the difficulty of PER tests that rely on sight and smell by 1. It moves through jet propulsion, hovering above the ground, unaffected by difficult terrain or obstacles."
- name: "MISTER GUTSY:"
  desc: "These robots are built for warfare/ Attacks from a Mister Gutsy gain 1 D6  damage and have Mister Gutsy Plating as standard armor. Additionally, if a character attempts a speech test to question, reason with or give the Mister Gutsy orders the difficulty of the test increases by 2 if the character is not in military uniform."
scavenge_rules:
 - name: "SALVAGE:"
   desc: "Scavengers can salvage from a destroyed Mister Gutsy with a successful **INT + Science** test with a difficulty of 1.\n This yields:\n 2d20 [[Flamer Fuel]]\n 2d20 [[10mm Round]]s\n 2 D6  units of common materials with +1 D6  per AP spent, and each Effect yields 1 uncommon materials."
```