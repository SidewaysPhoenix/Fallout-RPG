```statblock
name: Sentry Bot
desc: "The U.S. military made use of robots throughout its structure, especially in active combat roles, none were hardier or more destructive than the sentry bot. While Assaultrons prioritized melee combat, and Mister Gutsys focused on balancing speed with firepower, the sentry bot was designed to bring in heavy armor and even heavier weapons. Moving on wheels rather than legs or jet thrusters, Sentry bots are formidable, possessing heavy armor that can easily withstand direct hits from missiles and mini nukes. Their inbuilt weaponry also includes an automatic chain gun and in some cases missiles. While their design is to take out their enemies from a distance, they are also capable of melee attacks with devastating results. Some models were even equipped with self-destruct programming, both for a last-ditch attempt to take out the enemy but also to prevent the unit falling into enemy hands. Sentry bots are often found in military or scientific installations, though some models appear to have been used for non-military means, such as general security. In rare cases it is possible to find that some sentry bots, like a select few of their Mister Handy cousins, seem to have grown past their original programming (such as Ironsides whocaptains the USS Constitution and its robotic crew), or those which have been reprogrammed and are kept as domestic guard bots. In most cases however, few who come across them in the wasteland survive the encounter. "
level: 15
type: Normal Creature
keywords: Robot
xp: 109
body_attr: 10
mind: 6
melee: 4
guns: 5
other: 4
hp: 40
initiative: 16
modifier: 16
defense: 1
ac: 1
phys_dr: 6 (All)
energy_dr: 5 (All)
rad_dr: Immune
poison_dr: Immune
attacks:
 - name: "`dice: 2d20|render|text(CHAIN GUN: BODY + Guns (TN 15))`"
   desc: "5 D6  Physical damage, [[Burst]], [[Spread]], Fire Rate 5, [[Gatling]], Range M"
 - name: "`dice: 2d20|render|text(UNARMED: BODY + Melee (TN 14))`"
   desc: "8 D6  [[Vicious]] Physical damage"
 - name: "`dice: 2d20|render|text(MISSILE LAUNCHER: BODY + Guns (TN 15))`"
   desc: "11 D6  Physical damage, [[Blast]], Range L"
 - name: "`dice: 2d20|render|text(SELF DESTRUCT: BODY + Melee (TN 14))`"
   desc: "6 D6 Physical damage, [[Blast]]"
special_abilities:
  - name: "ROBOT:"
    desc: "The Sentry bot is a robot. They are immune to the effects of starvation, thirst, and suffocation. They are also immune to Poison and Radiation damage. However, machines cannot use food and drink or other consumables, they do not heal naturally, and the Medicine skill cannot be used to heal them: damage to them must be repaired (p.34 Core Rulebook)."
  - name: "IMMUNE TO POISON:"
    desc: "The Sentry bot reduces all Poison damage suffered to 0 and cannot suffer any damage or effects from poison."
  - name: "IMMUNE TO RADIATION:"
    desc: "The Sentry bot reduces all Radiation damage suffered to 0 and cannot suffer any damage or effects from radiation."
  - name: "IMMUNE TO DISEASE:"
    desc: "The Sentry bot is immune to the effects of all diseases, and they will never suffer the symptoms of any disease."
  - name: "KEEN SENSES:"
    desc: "One or more of the Sentry bot’s senses are especially keen; they can attempt to detect creatures or objects which characters normally cannot, and they reduce the difficulty of all other PER tests by 1 (to a minimum of 0)."
  - name: "AGGRESSIVE:"
    desc: "The Sentry bot is quick to action when it senses prey. When the Sentry bot enters a scene, immediately generate 1 Action Point. If the Sentry bot is an ally, then this goes into the group pool. If the it is an enemy, it goes into the GM’s pool."
  - name: "SELF-DESTRUCT:"
    desc: "If both of a Sentry bot’s arms are injured, or it has been reduced to half or fewer of its maximum HP, it will move towards the nearest enemy and use its major action to self-destruct. This self-destruct is an attack centered upon itself and destroys the Sentry bot after it attempts this attack."
  - name: "Big"
    desc: "BIG: The sentry bot is bigger than most characters, towering over them. The robot receives an additional +1 health point per Level, but its Defense decreases by 1, to a minimum of 1. Further, it only suffers a Critical Hit if an attack inflicts 7+ damage (after damage resistance) in a single hit, rather than the normal 5+."
scavenge_rules:
 - name: "SALVAGE:"
   desc: "Scavengers can salvage from a destroyed Sentry bot with a successful **INT + Science** test with a difficulty of 1.\n This yields:\n 1 fusion core\n 2 D6  units of common materials with +1 D6  per AP spent, and each Effect yields 1 uncommon material."
```
![[Sentry Bot image.jpg]]