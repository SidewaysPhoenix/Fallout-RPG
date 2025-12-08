```statblock
name: Super Mutant Behemoth
desc: "These are the oldest and the strongest of super mutant kind. Heavily mutated, behemoths stand at nearly thir￾teen-feet tall. Their age andcontinued mutation have led them to lose the ability to speak like other super mutants, instead they often let out monstrous roars. Even other super mutants have been known to fear behemoths because of their strength and size, as well as their hostility. They carry shopping carts strapped to their back, which they use to carry around boulders or human prisoners, and often massive bats made of fire hydrants. These creatures are mostly solitary or sometimes living alongside other supermutant groups."
level: 18
type: Normal Creature
keywords: Mutated Human
xp: 130
body_attr: 12
mind: 5
melee: 5
guns: 
other: 4
hp: 48
initiative: 17
modifier: 17
defense: 1
ac: 1
phys_dr: 8 (All)
energy_dr: 5 (All)
rad_dr: Immune
poison_dr: 8 (All)
attacks:
 - name: "`dice: 2d20|render|text(FIRE HYDRANT BAT: Body + Melee (TN 17))`"
   desc: "11 D6  [[Vicious]], [[Breaking]] Physical damage"
 - name: "`dice: 2d20|render|text(BOULDER THROW: Body + Guns (TN 12))`"
   desc: "8 D6  [[Vicious]], [[Stun]] Physical damage, [[Thrown]], Range M"
 - name: "`dice: 2d20|render|text(MISSILE LAUNCHER: BODY + Guns (TN 12))`"
   desc: "11 D6  Physical damage, [[Blast]], Range L"
special_abilities:
  - name: "IMMUNE TO RADIATION:"
    desc: "The behemoth reduces all radiation damage suffered to 0 and cannot suffer any damage or effects from radiation."
  - name: "IMMUNE TO FEAR:"
    desc: "The behemoth cannot be intimidated or threatened in any way and will either ignore or attack anyone who attempts to threaten or intimidate it."
  - name: "BIG:"
    desc: "The behemoth is bigger than most characters, towering over them. The creature receives an additional +1 health point per Level, but its Defense decreases by 1, to a minimum of 1. Further, it only suffers a Critical Hit if an attack inflicts 7+ damage (after damage resistance) in a single hit, rather than the normal 5+."
  - name: "AGGRESSIVE:"
    desc: "The behemoth is quick to action when it senses prey. When the behemoth enters a scene, immediately generate 1 Action Point. If the behemoth is an ally, then this goes into the group pool. If it is an enemy, it goes into the GM’s pool."
scavenge_rules:
 - name: ""
   desc: "Wealth 3\n 4 D6 junk items\n\n The body may also contain up to two weapons, and 2d20 rounds of ammunition appropriate to the weapons found, at the GM's discretion"
```
![[Super Mutant Behemoth image.jpg]]