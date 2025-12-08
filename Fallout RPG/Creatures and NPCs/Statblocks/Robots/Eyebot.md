```statblock
name: Eyebot
desc: "The eyebot is one of the smaller robots designed by RobCo Industries. Their spherical, hovering forms are a common sight in the wasteland. Despite their compact size, they areoutfitted with a number of useful technologies; long range antennas that allow them to receive radio broadcasts even in subway stations or other underground sites, facial and voice recognition for use insecurity applications and even a laser weapon. In pre-War America they were used to broadcast radio transmissions,announcements, and news bulletins. Now these eyebots are in use by the likes of the Brotherhood of Steel to promote propaganda and by the Minutemen for surveillance. Others can are roaming the wastes still following their original programming and broadcasting the local radio station, military chatter on repeat or mysterious messages and frequencies from unknown sources. While often friendly when encountered, they will defend themselves if attacked and thedegradation to their systems leads some units to be hostile on site."
level: 2
type: Normal Creature
keywords: Robot
xp: 17
body_attr: 5
mind: 4
melee: 0
guns: 3
other: 1
hp: 5
initiative: 9
modifier: 9
defense: 2
ac: 2
phys_dr: 2 (All)
energy_dr: 2 (All)
rad_dr: Immune
poison_dr: Immune
attacks:
 - name: "`dice: 2d20|render|text(LASER: BODY + Guns (TN 8))`"
   desc: "4 D6  Energy damage, Range M"
special_abilities:
  - name: "ROBOT:"
    desc: "The eyebot is a robot. They are immune to the effects of starvation, thirst, and suffocation. They are also immune to Poison and Radiation damage. However, machines cannot use food and drink or other consumables, they do not heal naturally, and the Medicine skill cannot be used to heal them: damage to them must be repaired (p.34 Core Rule Book)."
  - name: "IMMUNE TO POISON:"
    desc: "The eyebot reduces all Poison damage suffered to 0 and cannot suffer any damage or effects from poison."
  - name: "IMMUNE TO RADIATION:"
    desc: "The eyebot reduces all Radiation damage suffered to 0 and cannot suffer any damage or effects from radiation."
  - name: "IMMUNE TO DISEASE:"
    desc: "The eyebot is immune to the effects of all diseases, and they will never suffer the symptoms of any disease."
  - name: "LITTLE:"
    desc: "The eyebot is smaller than most characters. The creature’s normal HP is reduced to Body + ½ level (rounded up), but its Defense increases by 1. Further, it is slain by any hit which inflicts an Injury."
  - name: "RADIO TRANSMISSION:"
    desc: "The eyebot can receive and send radio transmissions, as well as playing these aloud. The eyebot can be heard playing these transmissions aloud from long range."
scavenge_rules:
 - name: "SALVAGE:"
   desc: "Scavengers can salvage from a destroyed eyebot with a successful **INT + Science** test with a difficulty of 1.\n This yields:\n 2 D6  common materials, and each Effect rolled yields 1 uncommon material."
```
![[Eyebot image.jpg]]