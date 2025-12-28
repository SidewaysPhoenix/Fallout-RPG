<!-- id: rabid -->

###### RABID
**Requirements:** Creature | Not Robot

**Summary:** The creature is diseased and driven mad by the sickness ravaging its body. The foaming spittle at its mouth is a clear sign, and its bite is a sure way to pick up some nasty infection. 

---

### Stat Changes
| Category | Change |
|---|---|
| Special Abilities | Adds **Feral** and **Rabid** |

---

### Granted Abilities
- **Feral**
- **Rabid**

---

### Effect
**Special Abilities:** The creature gains the Feral and Rabid abilities:

**Feral:** The creature is unintelligent, driven purely by feral instinct. Feral creatures cannot be persuaded or influenced by Speech tests. Feral creatures move towards and attack the nearest enemy. If they cannot detect an enemy, they move towards the nearest source of bright light or loud noise. Failing that, they will move around randomly or simply lie down and do nothing. 

**Rabid:** The creature’s melee attacks gain the [[Persistent]] (Poison) damage effect. Further, when a creature suffers any Poison damage from a Rabid creature’s attacks, it counts as two exposures to disease for the purposes of seeing if you’ve contracted a disease (**Fallout: The Roleplaying Game Core Rulebook**, p.193).

---

```yaml
spec:
  id: rabid
  name: Rabid
  kind: template
  version: 1
  applies_to: creature
  mutually_exclusive_group: creature_template

  requirements:
    include:
      - creature
    exclude:
      - robot

  injection:
    target_list: special_abilities
    name: "CREATURE TEMPLATE"
    title: "RABID"
    format: blockquote

  mechanics:
    # Injection-only template (no automated stat edits in v1)
    operations: []
