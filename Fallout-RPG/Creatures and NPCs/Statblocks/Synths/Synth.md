```statblock
name: Synth
image: [[Synth 1st Gen image.jpg]]
desc: "These first-generation synths are usually encountered in packs of four or more in Institute-controlled or -protected areas areas. They resemble humans in form and shape only, with most not even possessing synthetic skin, instead they appear like terrifying robotic caricatures, with mechanical parts where organs would be, and metal frames for bones. While intelligent and combat capable, they do not possess the higher sentience of third-generation synths."
level: 4
type: Normal Creature
keywords: Robotic Synth
xp: 31
body_attr: 6
mind: 4
melee: 2
guns: 2
other: 2
hp: 10
initiative: 11
modifier: 11
defense: 1
ac: 1
phys_dr: "2 (Head, Legs, Arms); 1 (Torso)"
energy_dr: "3 (Head, Legs, Arms); 2 (Torso)"
rad_dr: Immune
poison_dr: Immune
attacks:
 - name: "`dice: 2d20|render|text(INSITITUE LASER: BODY + Guns (TN 8))`"
   desc: "4 D6  [[Vicious]] Energy damage, [[Burst]], Fire Rate 3, [[Close Quarters]], [[Inaccurate]], Range C"
 - name: "`dice: 2d20|render|text(SHOCK BATON: BODY + Melee (TN 8))`"
   desc: "5 D6  Energy damage, Range C"
special_abilities:
  - name: "ROBOT:"
    desc: "The synth is a robot. They are immune to the effects of starvation, thirst, and suffocation. They are also immune to Poison and Radiation damage. However, machines cannot use food and drink or other consumables, they do not heal naturally, and the Medicine skill cannot be used to heal them: damage to them must be repaired (p.34 Core Rulebook)."
  - name: "IMMUNE TO POISON:"
    desc: " The synth reduces all Poison damage suffered to 0 and cannot suffer any damage or effects from poison."
  - name: "IMMUNE TO RADIATION:"
    desc: "The synth reduces all Radiation damage suffered to 0 and cannot suffer any damage or effects from radiation"
  - name: "IMMUNE TO FEAR:"
    desc: "The synth cannot be intimidated or threatened in any way and either ignores or attacks anyone who attempts to threaten or intimidate it"
  - name: "IMMUNE TO DISEASE:"
    desc: "The synth is immune to the effects of all diseases; they never suffer the symptoms of any disease."
scavenge_rules:
 - name: ""
   desc: "[[Institute Laser]] Gun=([[Photon Exciter]], [[Improved Barrel]])\n [[Baton]] ([[Electrified]])\n 3d20 Fusion Cells\n [[Synth Leg]] x2\n [[Synth Arm]] x2\n [[Synth Helmet]]"
```
	
	Third-Generation Synth
Third-generation synths are the result of combining early synth technology with the FEV modified DNA of a pre-War human. Synths of this generation can pass as human down to the cellular level, being made from lab-grown flesh and bone, and have the all the cognitive abilities and emotional breadth as an adult human. To program and control these synths, they are fitted with a neurological implant which is impossible to remove or detect without killing the synth. Synths who break free from their programming are often referred to as liberated synths, and sometimes continue to pose as human or seek help from the Railroad to avoid recapture by the Institute. Some third-generation synths are unaware of the fact they are synths at all as part of their programming. It is this generation of synth that continues to spark fear and paranoia in the Commonwealth, as you could encounter one without ever knowing. 

	To create an NPC that is a third-generation Synth, make the following changes:

 Upgrade the NPC to a Major Character and add all the appropriate changes as listed on page 337. 

 Add Synth Component to their inventory

 Add 1 to all DRs for all hit locations

 Add the ‘Immune to Poison’ and ‘Robotic’ special rules

 Add 1 to their Strength, Perception, and Intelligence 

 **Finally add the following special rule:**

 **Third Generation Synth:** These synths can pass as 
human, and any attempt to inspect them reveals them 
to be human. Third Generation Synths can only be 
identified after death by the recovery of their Synth 
Component. A Third Generation Synth posing as a 
known figure gains a bonus 2d20 to any rolls relating 
to impersonating the individual, including recalling 
knowledge and expressing their mannerisms. 