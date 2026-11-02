```statblock
layout: Fallout_2d20_statblock_test
name: "Paladin"
desc: "Paladins are the prize soldier within the Brotherhood’s forces. Equipped with Power Armor and the best weapons the Brotherhood can offer, they represent the veterans of the Brotherhood and often those who are decorated fighters. Achieving the rank of Paladin requires an individual to show both extreme devotion to the Brotherhood and have an impressive record and is a rank many aspire to achieve."
level: "8"
type: "Notable Character"
keywords: "Human"
xp: "120"

special:
  - name: "STR"
    desc: "7"
  - name: "PER"
    desc: "9"
  - name: "END"
    desc: "8"
  - name: "CHA"
    desc: "6"
  - name: "INT"
    desc: "6"
  - name: "AGI"
    desc: "6"
  - name: "LCK"
    desc: "4"

skills:
  - name: "Athletics"
    desc: "2"
    tagged: false
  - name: "Energy Weapons"
    desc: "4"
    tagged: true
  - name: "Pilot"
    desc: "1"
    tagged: false
  - name: "Repair"
    desc: "2"
    tagged: false
  - name: "Science"
    desc: "3"
    tagged: true
  - name: "Small Guns"
    desc: "2"
    tagged: false
  - name: "Speech"
    desc: "3"
    tagged: false
  - name: "Unarmed"
    desc: "3"
    tagged: true

hp: 20
initiative: 17
defense: 1
carry_wt: "360 lbs."
melee_bonus: "+3D6"
luck_points: "2"
phys_dr: "7 (Head), 9 (Torso), 6 (Arms, Legs)"
energy_dr: "6 (Head), 8 (Torso), 5 (Arms, Legs)"
rad_dr: "7 (Head, Arms, Legs), 9 (Torso)"
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

  - id: "chainsaw-attack"
    inventoryId: "chainsaw-1"

  - id: "lasergun-attack"
    inventoryId: "laser-gun-1"


special_abilities:
- name: "POWER ARMOR:"
  desc: "A Brotherhood Paladin wears Power Armor. They use the armor’s **STR** of 11 instead of their own. They are immune to damage from falling and inflict 3 D6  physical damage to all creatures within Reach of their landing. They can breathe underwater and in toxic environments. See p.137 Core Rule Book."
- name: "THE CHAIN THAT BINDS:"
  desc: "As a major action, a Paladin can order a Brotherhood character of lower level to immediately perform a major action. The Paladin assists that action with **CHA + Speech**."
- name: "WELL-EQUIPPED:"
  desc: "Once per combat, the Paladin may ‘let rip’ with a volley from their Improved Long Laser Rifle. This adds the weapon’s Fire Rate of 2 to the weapon’s damage for a single attack (for 8 D6  total)"
  
inventory:
  - id: "chainsaw-1"
    item: "[[Chainsaw]]"
    quantity: 1
    equipped: true
    mods:
      - slot: ""
        item: "[[Long Bow Bar  (Chainsaw)]]"
      - slot: "Bar Addon"
        item: "[[Flamer Mod  (Chainsaw)]]"
  
  - id: "laser-gun-1"
    item: "[[Laser Gun]]"
    quantity: 1
    equipped: true
    mods:
      - slot: "Barrel"
        item: "[[Long Barrel (Energy Weapons)]]"
      - slot: "Stock"
        item: "[[Standard Stock]]"
        
  - id: "helmet-1"
    item: "[[T-60 Helm]]"
    quantity: 1
    equipped: true
    mods:
      - slot: "Upgrade Mod"
        item: "[[T-60f Helm]]"

  - id: "chest-1"
    item: "[[T-60 Chest Piece]]"
    quantity: 1
    equipped: true
    mods: []

  - id: "legs-1"
    item: "[[T-60 Leg]]"
    quantity: 2
    equipped: true
    mods: []

  - id: "arms-1"
    item: "[[T-60 Arm]]"
    quantity: 2
    equipped: true
    mods: []

  - id: "power_armor_frame-1"
    item: "[[Power Armor Frame]]"
    quantity: 1
    equipped: true
    mods: []
  
  - id: "holotags-1"
    item: "[[Holotags]]"
    quantity: 1
  
  - id: "wealth-1"
    item: "*Wealth*"
    quantity: 2
```
