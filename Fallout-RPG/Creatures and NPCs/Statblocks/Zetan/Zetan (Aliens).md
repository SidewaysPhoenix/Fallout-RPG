```statblock
name: Zetan (Aliens)
image: [[Zetan (Aliens) image.jpg]]
desc: "Sightings of these extra-terrestrial beings have been rare in the wasteland. The Commonwealth itself is rumored to be home to the crash site of one of these alien ships. Zetans stand shorter than the average human with yellow-green skin. They are bi-pedal and have two arms that end in three elongated fingers. Their heads are pear-shaped, with an enlarged cranium, two jet black eyes, the semblance of nostrils and sharp pointed teeth. If wounded, their blood appears to be a light green color which darkens as it dries, and damage to the cranium often reveals green colored brain matter. They carry a unique alien blaster pistol which uses a technology not found on earth. "
level: 8
type: Normal Creature
keywords: Alien
xp: 38
body_attr: 7
mind: 5
melee: 0
guns: 4
other: 2
hp: 15
initiative: 12
modifier: 12
defense: 1
ac: 1
phys_dr: 1 (All)
energy_dr: 3 (All)
rad_dr: 0
poison_dr: 0
attacks:
 - name: "`dice: 2d20|render|text(ALIEN BLASTER: BODY + Guns (TN 11))`"
   desc: "5 D6  Energy damage, Range C, Fire Rate 2, [[Reliable]]"
special_abilities:
  - name: "ALIEN:"
    desc: "The Zetan cannot be reasoned with or influenced by Speech tests. "
scavenge_rules:
 - name: ""
   desc: "[[Alien Blaster]]\n 5d20 [[Alien Blaster Round]]s"
```