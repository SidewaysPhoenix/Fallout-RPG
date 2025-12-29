<!-- id: alpha -->

###### ALPHA
**Requirements:** Creature

**Summary:** The creature, part of a pack or other group, is somewhat larger than the others, but is mainly distinguished by its dominance, taking the lead and having the others follow.

---

### Stat Changes
| Category | Change |
|---|---|
| Level | +1 |
| Body / Mind | +1 (choose one) |
| Skills | +1 (choose one) |
| Initiative | Recalculate |
| HP | +1 (or +2 if Body increased) |
| DR / Attack | Choose one: +1 DR (type, all locations) **or** +1d6 to one attack |

---

### Granted Abilities
- **Aggressive**
- **Leader of the Pack**

---

### Effect
**Level:** The creature is one level higher than normal. Make the following changes:

- Add +1 to the creature’s Body or Mind
- Add +1 to one of the creature’s skills
- Adjust Initiative in line with increased Body or Mind
- Add +1 HP, or +2 if Body was increased
- Add either +1 to one type of damage resistance on all locations, or +1 D6 to one attack

**Special Abilities:** The creature gains the Aggressive and the Leader of the Pack abilities:

**Aggressive:** The creature is quick to action when it senses prey. When the creature enters a scene, immediately generate 1 Action Point. If the creature is an ally, then this goes into the group pool. If the creature is an enemy, then it goes into the GM’s pool. 

**Leader of the Pack:** The creature leads a group of its kind. All Normal creatures of the same kind and lower level within Close range may re-roll 1d20 on all tests while this creature is still alive.

```yaml
spec:
  id: alpha
  name: Alpha
  kind: template
  version: 1
  applies_to: creature
  mutually_exclusive_group: creature_template

  requirements:
    exclude: []

  injection:
    target_list: special_abilities
    name: "CREATURE TEMPLATE"
    title: "ALPHA"
    format: blockquote

  mechanics:
    level_delta: 1

    choices:
      - id: alpha_attr
        type: one_of
        label: "Increase Body or Mind"
        options:
          - key: body_attr
            delta: 1
          - key: mind
            delta: 1

      - id: alpha_skill
        type: pick_skill
        label: "Increase one skill"
        delta: 1

      - id: alpha_defense_or_offense
        type: one_of
        label: "Choose one"
        options:
          - id: dr_boost
            type: dr_all_locations
            label: "+1 DR to one damage type on all locations"
            dr_type_options: ["Physical", "Energy", "Radiation"]
            delta: 1
          - id: attack_boost
            type: attack_bonus_dice
            label: "+1d6 to one attack"
            dice: "1d6"

    derived:
      initiative: recalc
      hp:
        type: conditional_add
        if:
          choice_id: alpha_attr
          option_key: body_attr
          add: 2
        else_add: 1
```