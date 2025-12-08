```statblock
name: Super Mutant Suicider
desc: "While most super mutants possess little fear of death, super mutant suiciders are entirely oblivious to the concept of self-preservation when in pursuit of their targets. These super mutants often accompany patrols or serve as guards. Extremely hostile, when they spot a target, they arm the explosive mini nuke they hold and rush towards their targets, aiming to reach them as the missile detonates, which inevitably leads to both the death of their prey and themselves. They usually serve under higher-ranking super mutants and serve both as weapons to cause massive destruction and deterrents to keep people away from super mutant settlements."
level: 6
type: Normal Character
keywords: Mutated Human
xp: 45
strength: 8
per: 5
end: 6
cha: 4
int: 4
agi: 7
lck: 4
skills:
  - name: "Athletics"
    desc: "4 ⬛"
  - name: "Explosives"
    desc: "4 ⬛"
  - name: "Small Guns"
    desc: "2"
  - name: "Sneak"
    desc: "1"
  - name: "Survival"
    desc: "1"
  - name: "Unarmed"
    desc: "2"
hp: 12
initiative: 12
modifier: 12
defense: 1
ac: 1
carry_wt: 130 lbs.
melee_bonus: +1 D6
luck_points: 
phys_dr: "3 (Torso); 2 (Arms, Legs, Head)"
energy_dr: "4 (Torso); 2 (Arms, Legs, Head)"
rad_dr: Immune
poison_dr: Immune
attacks:
 - name: "`dice: 2d20|render|text(UNARMED STRIKE: STR + Unarmed (TN 10))`"
   desc: "4 D6  Physical damage"
 - name: "MODIFIED MINI NUKE:"
   desc: "(See Special Ability), 21 D6  Physical damage, [[Breaking]], [[Radioactive]], [[Vicious]], [[Blast]], Range C"
 - name: "`dice: 2d20|render|text(PIPE BOLT-ACTION RIFLE: AGI + Small Guns (TN 9))`"
   desc: "5 D6  [[Piercing]] 1 Physical damage, Range M, Fire Rate 0, [[Two-Handed]]"
special_abilities:
- name: "BARBARIAN:"
  desc: "+2 to Physical and Energy damage resistances (included)."
- name: "IMMUNE TO RADIATION:"
  desc: "The super mutant suicider reduces all Radiation damage suffered to 0 and cannot suffer any damage or effects from radiation."
- name: "IMMUNE TO POISON:"
  desc: "The super mutant suicider reduces all Poison damage suffered to 0 and cannot suffer any damage or effects from poison."
- name: "MODIFIED MINI NUKE:"
  desc: "The super mutant suicider carries a modified mini nuke. Once in close range of its target it makes an AGI + Explosives test (TN 11) to detonate the mini nuke. Anyone within close range of the super mutant suicider, including itself, suffers its effects."
scavenge_rules:
 - name: ""
   desc: "Wealth 1\n [[Pipe Bolt-Action]] \n Additionally if the super mutant suicider is killed before arming and detonating the mini nuke, 1 mini nuke can be looted from the body, which functions as a normal mini nuke. If the super mutant suicider is killed by the mini nuke explosion, no mini nuke can be found and instead the body yields 1 Rare Material."
```