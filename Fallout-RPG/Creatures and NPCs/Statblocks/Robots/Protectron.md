```statblock
name: Protectron
image: [[Protectron image.jpg]]
desc: "Another one of RobCo Industries successful robots, the Protectron was designed as a multi-purpose work drone. They are capable of aiding in construction industries, offices and in public service roles. While the unit does feature laser weapons, its design is not for use in combat situations but merely to allow the robot to defend itself. Protectrons also feature the ability to self-destruct to take out their attackers. Various personalities could be programmed to the unit aside from the default, including fire brigadier, law enforcement, construction worker, medical responder, and subway steward. In the wasteland they are often encountered in both active and inactive states in many locations such as subway stations, public and office buildings, and various industrial sites."
level: 3
type: Normal Creature
keywords: Robot
xp: 24
body_attr: 5
mind: 5
melee: 2
guns: 2
other: 2
hp: 8
initiative: 10
modifier: 10
defense: 1
ac: 1
phys_dr: 4 (All)
energy_dr: 3 (All)
rad_dr: Immune
poison_dr: Immune
attacks:
 - name: "`dice: 2d20|render|text(CLAWS: BODY + Melee (TN 7))`"
   desc: "3 D6  Physical damage"
 - name: "`dice: 2d20|render|text(ARM LASERS: BODY + Melee (TN 7))`"
   desc: "3 D6  [[Burst]], [[Piercing]] 1 energy damage, Range C, Fire Rate 4"
 - name: "`dice: 2d20|render|text(SELF DESTRUCT: BODY + Guns (TN 7))`"
   desc: "6 D6  Physical damage, [[Blast]]"
special_abilities:
  - name: "ROBOT:"
    desc: "The Protectron is a robot. They are immune to the effects of starvation, thirst, and suffocation. They are also immune to Poison and Radiation damage. However, machines cannot use food and drink or other consumables, they do not heal naturally, and the Medicine skill cannot be used to heal them: damage to them must be repaired (p.34 Core Rulebook)."
  - name: "IMMUNE TO POISON:"
    desc: "The Protectron reduces all Poison damage suffered to 0 and cannot suffer any damage or effects from poison."
  - name: "IMMUNE TO RADIATION:"
    desc: "The Protectron reduces all Radiation damage suffered to 0 and cannot suffer any damage or effects from radiation."
  - name: "IMMUNE TO DISEASE:"
    desc: "The Protectron is immune to the effects of all diseases, and they will never suffer the symptoms of any disease."
  - name: "ARM LASERS:"
    desc: "If one of a Protectron’s arms suffers an injury, the Fire Rate of its Arm Lasers decreases to 2. If both its arms are injured, it can no longer attack with its Arm Lasers."
  - name: "LET RIP:"
    desc: "Once per combat, the Protectron may ‘let rip’ with a volley from their Arm Lasers. This adds the weapon’s Fire Rate of 4 to the weapon’s damage for a single attack (for 7 D6  total), and allows them to use the [[Burst]] damage effect without spending ammo. If one of the Protectron’s Arm Lasers is injured, this special attack decreases to 5 D6  damage."
  - name: "SELF-DESTRUCT:"
    desc: "If both of a Protectron’s arms are injured, or it has been reduced to half or fewer of its maximum HP, it will move towards the nearest enemy and use its major action to self-destruct. This self-destruct is an attack centered upon itself and destroys the Protectron after it attempts this attack."
scavenge_rules:
 - name: "SALVAGE:"
   desc: "Scavengers can salvage from a destroyed Protectron with a successful **INT + Science** test with a difficulty of 1.\n This yields:\n 2 D6  units of common materials with +1 D6  per AP spent, and each Effect yields 1 uncommon materials."
```

	Protectron Personalities
Across the Commonwealth you can encounter Protectrons with 
various personalities, programmed for different purposes. If 
you wish to further customize your Protectron NPCs with these 
personalities, you can use the following special rules: 

	Fire Brigadier
 Fire Hazard Detection: The Protectron is non-hostile 
unless a character is wielding a weapon which would be 
a fire hazard (such as a flame thrower), in this case the 
Protectron becomes hostile towards that individual. 

	Law Enforcement
 Holster Your Weapon: The protectron is non-hostile upon 
encountering it, but it becomes hostile to any character who 
unholsters their weapon and fires a shot, even if it is not at 
the Protectron, while in its presence. This Protectron will 
be hostile towards hostile wasteland creatures.

	Construction Worker
 Health and Safety: The Protectron construction worker 
is only hostile to any character not wearing a form of 
helmet headgear while in its presence, or a character 
who attacks it. 

	Medical Responder
 Defibrillator: The Protectron medical responder will 
attack any hostile creatures but is otherwise friendly 
providing that a character does not attack it. It also gains 
the ability to attack creatures with the defibrillator built 
into its arms. 
	 Defibrillator: BODY + Melee (TN 7), 
	4D6 Stun Energy damage

	Subway Steward
 Subway Token: The Protectron is not hostile and will 
approach any character it sees and requests a subway 
token. If one is supplied, the Protectron remains friendly. 
If a character cannot produce a subway token, the 
Protection immediately turns hostile