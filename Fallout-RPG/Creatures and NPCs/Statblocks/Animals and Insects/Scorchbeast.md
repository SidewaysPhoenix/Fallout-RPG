```statblock
name: "Scorchbeast"
desc: "Sitting as the apex predator of Appalachia, the scorchbeast is death on wings. The first indicator of their presence is the sound of their colossal wings cutting and beating against the air. These scientific mistakes were created when Enclave scientists accidentally exposed irradiated bats to an experimental mutation serum, and the result was something more powerful than anyone could have expected. Though the Enclave did its best to contain the creatures, some regularly broke confinement, reaching the surface multiple times. It was only when Thomas Eckhart, in an attempt to continue the Great War, released the creatures on the unsuspecting populous to gain access to the few nuclear weapons the United States still had. Little did he know the true terror he unleashed as the Scorched Plague ravaged the country. The scorched beast is undeniably dangerous, whether by claw and fang or by the pestilence it brings."
level: "14"
type: "Mighty Creature"
keywords: "Mutated Mammal"
xp: "204"
body_attr: "11"
mind: "6"
melee: "4"
guns: "5"
other: "4"
hp: "74"
initiative: "17"
modifier: "17"
defense: "1"
ac: "1"
phys_dr: "6 (All)"
energy_dr: "6 (All)"
rad_dr: "Immune"
poison_dr: "Immune"
attacks: 
 - name: "`dice: 2d20|render|text(SCREECH: BODY + Guns (TN 16))`"
   desc: "8 D6 [[Burst]], [[Stun]], Physical damage, Fire Rate 2, Range M"
 - name: "`dice: 2d20|render|text(WING STRIKE: BODY + Melee (TN 15))`"
   desc: "9 D6 [[Breaking]] [[Vicious]] Physical damage"
 - name: "`dice: 2d20|render|text(SHOCKWAVE: BODY + Guns (TN 16))`"
   desc: "10 D6 [[Burst]], [[Radioactive]], Physical damage, Range C"
special_abilities:
 - name: "HIVE MIND:"
   desc: "Scorchbeasts are the originators of the Scorched Plague, as such, and can exert some influence over the rudimentary hive mind that controls all scorched. When a scorchbeast enters the scene or uses its Irradiate ability, it may spend up to 3 AP to summon 1 D6 scorched creatures per AP spent (see Scorched template on p.140)."
 - name: "IRRADIATE:"
   desc: "When threatened, scorchbeasts will fly overhead and mist a single zone with radioactive waste. The affected zone is covered by an obscuring mist and radioactive waste (**Fallout: The Roleplaying Game Core Rulebook**, p.39) that inflicts 5 D6 Radiation damage and increases the difficulty of all **PER** tests to anyone that starts its turn within the zone. The scorchbeast must land before using this ability again."
 - name: "FLYING:"
   desc: "The scorchbeast can move freely through the air. It can ignore most ground-level obstacles and difficult terrain effects, and it can move through 'empty' zones above the battlefield if desired. It must spend at least one minor action each turn moving, and if it is knocked prone it falls to the ground, suffering 3 D6 [[Stun]] Physical damage, +2 D6 for each zone above ground level it was before it fell."
 - name: "WEAK SPOT:"
   desc: "If an attacker chooses to target the scorchbeast's head, it ignores the creature’s DR. This does not apply against hits which hit the head due to random chance."
 - name: "BIG:"
   desc: "The scorchbeast is bigger than most characters. The creature receives an additional +1 health point per Level, but its Defense is reduced by 1, to a minimum of 1. Further, it only suffers a critical hit if an attack inflicts 7+ damage (after damage resistance) in a single hit, rather than the normal 5+."
 - name: "BLIGHTED:"
   desc: "Scorchbeasts carry more than just the Scorched Plague; the myriad diseases that incubate inside these creatures make for a deadly cocktail to those unfortunate enough to encounter them. Whenever the scorchbeast hits with an attack, it may spend 2 AP to inflict a 'blight' on the target. A blighted character generates one fewer AP on any successful skill tests (to a minimum of 0) for the remainder of the scene. Furthermore, a blighted character adds +1 to the difficulty of the **END + Survival** test taken at the end of the scene to avoid contracting a disease."
 - name: "AGGRESSIVE:"
   desc: "The scorchbeast is quick to action when they sense prey. When the scorchbeast enters a scene, immediately generate 1 Action Point. If the scorchbeast is an ally, this goes into the group pool. If they are an enemy, it goes into the GM’s pool."
scavenge_rules:
 - name: "BUTCHERY:"
   desc: "Scavengers can butcher a dead scorchbeast with a successful **END + Survival** test with a difficulty of 1. \n\n * This results in 3 D6 portions of [[Scorchbeast Meat]]; if an Effect is rolled, this also yields 1 Uncommon material per Effect."
```

# Scorched Plague

The Scorched Plague is a deadly disease that causes the skin to peel away and petrify, the eyes and ears to bleed, and ultracite crystals slowly form from the infected body. Eventually, the afflicted lose their faculties and become part of the rudimentary hive mind that connects all scorched. If left untreated for too long, the infected’s body becomes completely petrified, and they become one of the statue-like corpses that litter Appalachia. Any creature or NPC can contract the scorch plague from contact with a scorched creature or scorch beast; however, it is the GM’s discretion as to whether their players are susceptible. 

We encourage GMs to discuss with their players when introducing the scorch plague and possibly having PCs become infected and risk their characters becoming mindless scorched if left untreated. If the players agree, we recommend using this as a plot hook to race against the disease to find a cure as the disease slowly overtakes the infected players.