```statblock
name: Centaur
image: 
desc: "A grotesque fusion of human and animal flesh twisted together through uncontrolled FEV exposure. Centaurs crawl, slither, and lunge in unnatural ways, their bodies constantly shifting and reforming."
level: 10
type: Normal Creature
keywords: Mutated Human
xp: 60
body_attr: 8
mind: 2
melee: 4
guns:
other: 4
hp: 24
initiative: 12
modifier: 12
defense: 1
ac: 0
phys_dr: 3 (All)
energy_dr: 2 (All)
rad_dr: Immune
poison_dr: 4 (All)
attacks:
 - name: "`dice: 2d20|render|text(TENTACLE LASH: Body + Melee (TN 12))`"
   desc: "6 D6 [[Piercing]], [[Persistent]] Physical damage"
 - name: "`dice: 2d20|render|text(BILE SPIT: Body + Other (TN 12))`"
   desc: "5 D6 [[Persistent]], [[Radioactive]] Poison damage, Range M"
special_abilities:
  - name: "IMMUNE TO RADIATION:"
    desc: "The centaur reduces all radiation damage suffered to 0 and cannot suffer any damage or effects from radiation."
  - name: "AMORPHOUS:"
    desc: "The centaur may move through gaps or spaces that would normally be too small for a creature of its size."
  - name: "UNSTABLE FLESH:"
    desc: "When reduced to half HP, the centaur immediately makes a free Bile Spit attack."
  - name: "PACK HUNTER:"
    desc: "When attacking a target engaged by another centaur, reduce the difficulty of the attack by 1."
scavenge_rules:
 - name: ""
   desc: "1 D6 junk items\n1 D6 FEV-tainted organs"
```