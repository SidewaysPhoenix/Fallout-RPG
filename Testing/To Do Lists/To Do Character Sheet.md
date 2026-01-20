- [x] Change mods to be appliable to weapons for proper calculation
- [x] Gain and Remove wording needs to be stripped from mod name on mod add
	- [x] Strip this before check for existing ability
	- [x] Make sure unable to add second of same ability
- [x] Cannot have reliable/unreliable accurate/inaccurate at the same time
- [x] Add in all Traits
- [x] Add in Trait calculation functionality
- [x] Radiation Damage block to affect Max HP
	- [x] Left Align HP Title
	- [x] Right Align "Rad DMG: " into HP Title block
	- [x] Turn Bar under HP Title into HP/Rad bar that moves with number adjustments
- [ ] Add Ammo Qty field in first cell of effects row for weapons, linked to qty in Gear table
	- [x] make weapon mod effects row permanent instead of hidden
	- [x] all ammo will be stored in the gear table and the ammo table will be removed
	- [x] Primary method match against ammo "name: " field in yaml and "ammo: " field in weapons
	- [x] For Explosives and Throwing Weapons check for item name instead of ammo name will be determined by const folders in script
	- [x] Some items have "or" ammo types separated by /  need way to handle in ui
	- [x] If ammo is Anything use infinity symbol
	- [x] make an exclusion folder/file list that will just show nothing in the cell for melee and others
	- [x] Allow for special folder/file inclusion list that will allow for special set items to be treated like explosive and thrown
	- [x] use same hidden plus minus ui/system like used in rads
	- [x] allow for manual changing and not just plus and minus movement to avoid clicking plus and minus for large number changes.
	- [x] all changes must be reflected live with ammo/items in the gear table
	- [x] If gear table has multiple of same ammo/item use stack with least qty first.
- [ ] Add effects line for ammo to allow for special lines, do same for effects line in weapons 



Throwing Weapons:
Fallout-RPG/Items/Weapons/Throwing

Explosive Weapons:
Fallout-RPG/Items/Weapons/Explosives

Special Inclusion list:
Fallout-RPG/Items/Weapons/Unique Items/Handy Rock.md
Fallout-RPG/Items/Weapons/Unique Items/Lightweight Mini-Nuke.md

Exclusion Items
Fallout-RPG/Items/Weapons/Melee
Fallout-RPG/Items/Weapons/Unique Items