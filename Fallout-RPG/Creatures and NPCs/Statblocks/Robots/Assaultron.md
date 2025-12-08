```statblock
name: Assaultron
desc: "Designed by RobCo Industries, the Assaultron is a formidable military robot, designed to fight on the front lines and leave enemy forces devastated. Powerful mechanical legs propel this robot forward, allowing it to move with incredible speed towards its targets. Its arms are designed to fit a number of attachments to suit the type of combat it was needed for, with most base models having two claw-like appendages where hands would be. Perhaps the most destructive of its weaponry is the laser at the center of its head, giving it an inhuman cycloptic appearance. Combined with the razor-sharp precision the Assaultronpossesses, this laser is capable of vaporizing targets upon impact. Even when severely damaged, the Assaultron continues to push forward. The loss of an arm or leg, or even severe damage to the head or torso won’t stop it pursuing its target, and they have been known to crawl towards their enemy and detonate a devastating self-destruct as a last ditch attempt to fulfil their purpose."
level: 13
type: Normal Creature
keywords: Robot
xp: 95
body_attr: 9
mind: 6
melee: 5
guns: 5
other: 4
hp: 22
initiative: 15
modifier: 15
defense: 1
ac: 1
phys_dr: 3 (All)
energy_dr: 3 (All)
rad_dr: Immune
poison_dr: Immune
attacks:
 - name: "`dice: 2d20|render|text(UNARMED: BODY + Melee (TN 14))`"
   desc: "9 D6  Physical damage"
 - name: "`dice: 2d20|render|text(LASER: BODY + Guns (TN 14))`"
   desc: "9 D6  [[Vicious]] Energy damage, Range L"
 - name: "`dice: 2d20|render|text(SELF DESTRUCT: BODY + Guns (TN 14))`"
   desc: "6 DC  Physical damage, [[Blast]]"
special_abilities:
  - name: "ROBOT:"
    desc: "The Assaultron is a robot. They are immune to the effects of starvation, thirst, and suffocation. They are also immune to Poison and Radiation damage. However, machines cannot use food and drink or other consumables, they do not heal naturally, and the Medicine skill cannot be used to heal them: damage to them must be repaired (p.34 Core Rule Book)."
  - name: "IMMUNE TO POISON:"
    desc: " The Assaultron reduces all Poison damage suffered to 0 and cannot suffer any damage or effects from poison."
  - name: "IMMUNE TO RADIATION:"
    desc: "The Assaultron reduces all Radiation damage suffered to 0 and cannot suffer any damage or effects from radiation."
  - name: "IMMUNE TO DISEASE:"
    desc: "The Assaultron is immune to the effects of all diseases, and they will never suffer the symptoms of any disease."
  - name: "KEEN SENSES:"
    desc: "One or more of the Assaultron's senses are especially keen; they can attempt to detect creatures or objects which characters normally cannot, and they reduce the difficulty of all other PER tests by 1 (to a minimum of 0)."
  - name: "SELF-DESTRUCT:"
    desc: "If the Assaultron has both its arms or legs injured, or it has been reduced to half or fewer of its maximum HP, it will move towards the nearest enemy and use its major action to self-destruct. This self-destruct is an attack centered upon itself and destroys the Assaultron after it attempts this attack."
  - name: "NIGHT VISION:"
    desc: "The Assaultron can see in complete darkness. It ignores all difficulty increases caused by dim light or darkness, and they may attempt skill tests that would normally be impossible in."
scavenge_rules:
 - name: "SALVAGE:"
   desc: "Scavengers can salvage from a destroyed Assaultron with a successful **INT + Science** test with a difficulty of 1.\n This yields:\n 3 DC  fusion cells, +1 DC  per AP spent, and each Effect rolled yields 1 uncommon material."
```
![[Assaultron image.jpg]]