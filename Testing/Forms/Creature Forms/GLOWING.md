<!-- id: glowing -->

###### GLOWING
**Requirements:** Creature | Not Robot

**Summary:** The creature has absorbed so much radiation and somehow survived that its body glows with an unearthly green light. Glowing ones—feral ghouls who have had this happen to them—are particularly infamous, as they heal other ghouls nearby, but they are far from the only kind of Glowing creature out in the Wasteland. 

---

### Stat Changes
| Category | Change |
|---|---|
| Special Abilities | Adds **Glowing** and **Immune to Radiation** |

---

### Granted Abilities
- **Glowing**
- **Immune to Radiation**

---

### Effect
**Special Abilities:** The creature gains the Glowing and Immune to Radiation abilities:

**Glowing:** The creature inflicts 2 D6 Radiation damage to anyone within Reach of it at the start of each of its turns. In addition, any melee attacks it makes gain the Radioactive damage effect; if it already had this damage effect, it instead inflicts 2 Radiation damage per Effect rolled. 

**Immune to Radiation:** The creature reduces all Radiation damage suffered to 0, and cannot suffer any damage or effects from radiation.

---

```yaml
spec:
  id: glowing
  name: Glowing
  kind: template
  version: 1
  applies_to: creature
  mutually_exclusive_group: creature_template

  requirements:
    exclude:
      - robot

  injection:
    target_list: special_abilities
    name: "CREATURE TEMPLATE"
    title: "GLOWING"
    format: blockquote

  mechanics:
    operations:
      - op: set_dr
        dr_type: rad
        value: Immune
```