```statblock
name: Vault Dweller
desc: "Across the wastes some vaults house, or once housed, human populations. Those who lived within the vaults are known to the outside word as Vault Dwellers. For some it is a rare sight in the wasteland to see the striking blue of a Vault-Tec jumpsuit, with most vaults still being sealed or meeting a tragic fate at the fault of one of Vault-Tec’s abominable experiments. There are some vaults in the commonwealth that will open their doors to outsiders for trade however, and not all populations suffered lasting ruin at the hands of the makers of the fallout shelters."
level: 7
type: Normal Character
keywords: Human
xp: 52
strength: 5
per: 6
end: 7
cha: 6
int: 6
agi: 6
lck: 5
skills:
  - name: "Barter"
    desc: "2 ⬛"
  - name: "Energy Weapons"
    desc: "1"
  - name: "Medicine"
    desc: "1"
  - name: "Melee Weapons"
    desc: "2"
  - name: "Repair"
    desc: "2 ⬛"
  - name: "Science"
    desc: "3"
  - name: "Small Guns"
    desc: "3 ⬛"
  - name: "Survivial"
    desc: "2"
  - name: "Unarmed"
    desc: "1"
hp: 14
initiative: 10
modifier: 10
defense: 1
ac: 1
carry_wt: 100 lbs.
melee_bonus: 
luck_points: 
phys_dr: 1 (Arms, Legs, Torso)
energy_dr: 1 (Arms, Legs, Torso)
rad_dr: 2 (Arms, Legs, Torso)
poison_dr: 0
attacks:
 - name: "`dice: 2d20|render|text(UNARMED STRIKE: STR + Unarmed (TN 6))`"
   desc: "3 D6  Physical damage"
 - name: "`dice: 2d20|render|text(10MM PISTOL: AGI + Small Guns (TN 9))`"
   desc: "4 D6  Physical damage, Fire Rate 2, Range C, [[Close Quarters]], [[Reliable]]"
special_abilities:
- name: "VAULT KID:"
  desc: "Your healthier start to life at the hands of trained doctors and sophisticated autodocs means you reduce the difficulty of all **END** tests to resist the effects of disease. You may also work with the gamemaster to determine what sort of experiment took place within your vault. Once per quest, the GM may introduce a complication which reflects the nature of the experiment you unwittingly took part in, or introduce a complication related to your early life of isolation and confinement within the vault. If the GM does this, you immediately regain one Luck point"
- name: "EDUCATED:"
  desc: "You have one additional tag skill."
- name: "GIFTED:"
  desc: "You choose two S.P.E.C.I.A.L attributes and increase them by +1."
scavenge_rules:
 - name: ""
   desc: "[[Vault Jumpsuit]]\n [[10mm pistol]]\n 2d20 [[10mm round]]s\n Wealth 2"
```
![[Vault Dweller image.jpg]]