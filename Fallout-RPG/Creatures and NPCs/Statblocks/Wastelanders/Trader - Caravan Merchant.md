```statblock
name: Trader - Caravan Merchant
desc: "Traders and merchant caravans can be found in almost every large settlement and traveling most major highway routes across the wasteland. In settlements some set up permanent shops for patrons to visit, using abandoned buildings or makeshift stalls to sell their wares. Some merchants prefer to travel from place to place, trading and buying at each stop and occasionally on the way to the passing traveler. Merchants rarely travel alone however, using brahmin as beasts of burden and employing mercenaries as guards. Even traders with permanent stalls often employ some form of security or have a trusty weapon tucked away for emergencies. "
level: 4
type: Normal Character
keywords: Human
xp: 62
strength: 5
per: 6
end: 6
cha: 9
int: 8
agi: 5
lck: 5
skills:
  - name: "Barter"
    desc: "4 ⬛"
  - name: "Lockpick"
    desc: "1"
  - name: "Melee Weapons"
    desc: "2"
  - name: "Repair"
    desc: "1"
  - name: "Small Guns"
    desc: "3"
  - name: "Speech"
    desc: "3 ⬛"
  - name: "Survival"
    desc: "2 ⬛"
  - name: "Unarmed"
    desc: "2"
hp: 15
initiative: 13
modifier: 13
defense: 1
ac: 1
carry_wt: 200 lbs.
melee_bonus: 
luck_points: 3
phys_dr: 1 (Arms, Legs, Torso)
energy_dr: 2 (Arms, Legs, Torso)
rad_dr: 0
poison_dr: 0
attacks:
 - name: "`dice: 2d20|render|text(UNARMED STRIKE: STR + Unarmed (TN 7))`"
   desc: "2 D6  Physical damage"
 - name: "`dice: 2d20|render|text(10MM AUTO PISTOL: AGI + Small Guns (TN 8))`"
   desc: "3 D6  [[Burst]] Physical damage, Range C, Fire Rate 4, [[Close Quarters]], [[Inaccurate]]"
 - name: "`dice: 2d20|render|text(DOUBLE-BARRELLED SHOTGUN: AGI + Small Guns (TN 8))`"
   desc: "6 D6  [[Spread]], [[Vicious]] Physical damage, Range C, [[Inaccurate]], [[Two-Handed]]"
 - name: "`dice: 2d20|render|text(MOLOTOV COCKTAIL: PER + Explosives (TN 6))`"
   desc: "4 D6  [[Persistent]] Energy damage, [[Blast]], [[Thrown]], Range M. (See below.)"
special_abilities:
- name: "LET RIP:"
  desc: " Once per combat, the Merchant may ‘let rip’ with a volley from their 10mm Auto Pistol. This adds the weapon’s Fire Rate of 4 to the weapon’s damage for a single attack (for 7 D6 total), and allows them to use the Burst damage effect without spending ammo."
- name: "MASTER TRADER:"
  desc: "When making an opposed test with Barter, the merchant generates one automatic success in addition to any they roll"
- name: "SHOPKEEP:"
  desc: "The merchant is accompanied by a pack brahmin or is running a shop.They have 6d20 caps on their person for trade. The GM determines the goods available."
scavenge_rules:
 - name: ""
   desc: "[[Drifter Outfit]]\n 10mm Auto Pistol=[[10mm Pistol]] ([[Automatic]])\n [[Double-Barrel Shotgun]]\n [[Molotov Cocktail]]\n Wealth 6"
```