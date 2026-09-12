```statblock
name: The Prototype
image: 
desc: "A failed attempt at perfecting FEV adaptation. The Prototype is a monstrous half-formed giant, its flesh constantly shifting, muscles overgrowing and tearing apart in real time. One arm is grotesquely oversized, while exposed organs pulse beneath translucent skin."
level: 16
type: Legendary Creature
keywords: Mutated Human
xp: 180
body_attr: 11
mind: 3
melee: 6
guns:
other: 5
hp: 42
initiative: 17
modifier: 17
defense: 2
ac: 1
phys_dr: 7 (All)
energy_dr: 4 (All)
rad_dr: Immune
poison_dr: 6 (All)
attacks:
 - name: "`dice: 2d20|render|text(MUTATED SLAM: Body + Melee (TN 17))`"
   desc: "9 D6 [[Vicious]], [[Knockdown]] Physical damage"
 - name: "`dice: 2d20|render|text(FLESH WHIP: Body + Melee (TN 17))`"
   desc: "7 D6 [[Piercing]], [[Persistent]] Physical damage, Reach"
 - name: "`dice: 2d20|render|text(RUPTURE BURST: Body + Other (TN 16))`"
   desc: "6 D6 [[Blast]], [[Radioactive]] Poison damage"
special_abilities:
  - name: "IMMUNE TO RADIATION:"
    desc: "The Prototype reduces all radiation damage suffered to 0 and cannot suffer any damage or effects from radiation."
  - name: "UNSTABLE EVOLUTION:"
    desc: "At 50% HP, the Prototype mutates violently. Immediately gains +2 D6 damage on all attacks and may make one free Mutated Slam attack."
  - name: "REGENERATIVE MASS:"
    desc: "At the start of its turn, the Prototype heals 2 HP unless it took fire or energy damage since its last turn."
  - name: "VIOLENT DEATH THROES:"
    desc: "When reduced to 0 HP, the Prototype explodes in a wave of flesh and bile. All creatures within Close range suffer 5 D6 [[Blast]] Poison damage."
  - name: "BIG:"
    desc: "The Prototype is bigger than most characters. It only suffers a Critical Hit if an attack inflicts 7+ damage (after damage resistance) in a single hit."
scavenge_rules:
 - name: ""
   desc: "Wealth 2\n2 D6 FEV tissue\nExperimental organ cluster"
```