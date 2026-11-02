```statblock
layout: Fallout_2d20_statblock_test
name: "Knight"
desc: "A Brotherhood of Steel Knight."
level: "13"
type: "Normal Character"
keywords: "Human"
xp: "52"

special:
  - name: "STR"
    desc: "6"
  - name: "PER"
    desc: "6"
  - name: "END"
    desc: "7"
  - name: "CHA"
    desc: "5"
  - name: "INT"
    desc: "5"
  - name: "AGI"
    desc: "6"
  - name: "LCK"
    desc: "4"

skills:
  - name: "Athletics"
    desc: "1"
    tagged: false
  - name: "Big Guns"
    desc: "1"
    tagged: false
  - name: "Energy Weapons"
    desc: "4"
    tagged: true
  - name: "Pilot"
    desc: "1"
    tagged: false
  - name: "Repair"
    desc: "1"
    tagged: false
  - name: "Science"
    desc: "3"
    tagged: true
  - name: "Small Guns"
    desc: "1"
    tagged: false
  - name: "Speech"
    desc: "2"
    tagged: false
  - name: "Unarmed"
    desc: "2"
    tagged: false

hp: 20
initiative: 12
defense: 1
carry_wt: "110 lbs."
melee_bonus: ""
luck_points: ""
phys_dr: "2 (All)"
energy_dr: "2 (All)"
rad_dr: "1 (All)"
poison_dr: "0"

attacks:
  - id: "unarmed-strike"
    name: "UNARMED STRIKE"
    attribute: "STR"
    skill: "Unarmed"
    damage: 2
    damageEffects: ""
    damageQualities: ""
    damageType: "Physical"

  - id: "laser-rifle-attack"
    inventoryId: "laser-rifle-1"



special_abilities:
  - name: "THE CHAIN THAT BINDS:"
    desc: "As a major action, a Knight can order a Brotherhood character of lower level to immediately perform a major action. The Knight assists that action with **CHA + Speech**."
  - name: "WELL-EQUIPPED:"
    desc: "Twice per combat, the Knight may ‘let rip’ with a volley from their Long Laser Rifle. This adds the weapon’s Fire Rate of 2 to the weapon’s damage for a single attack."  
  
inventory:
  - id: "laser-rifle-1"
    item: "[[Laser Gun]]"
    quantity: 1
    equipped: true
    mods:
      - slot: "Barrel"
        item: "[[Long Barrel (Energy Weapons)|Long Barrel]]"
      - slot: "Stock"
        item: "[[Standard Stock]]"

  - id: "uniform-1"
    item: "[[Brotherhood of Steel Uniform]]"
    quantity: 1
    equipped: true
    mods: []

  - id: "helmet-1"
    item: "[[Combat Helmet]]"
    quantity: 1
    equipped: true
    mods: []

  - id: "chest-1"
    item: "[[Combat Chest Piece]]"
    quantity: 1
    equipped: true
    mods: []

  - id: "legs-1"
    item: "[[Combat Leg]]"
    quantity: 2
    equipped: true
    mods: []

  - id: "arms-1"
    item: "[[Combat Arm]]"
    quantity: 2
    equipped: true
    mods: []

  - id: "holotags-1"
    item: "[[Holotags]]"
    quantity: 1
  
  - id: "wealth-1"
    item: "*Wealth*"
    quantity: 2
```
