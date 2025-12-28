<!-- id: scorched -->

###### SCORCHED
**Requirements:** Non-mutated Human Character **or** Non-Robot Creature

**Summary:** A scorched is created when a human, or other creature, comes in contact with a scorchbeast, as the mutated fungus-like plague called the Scorched Plague it carries mutates those infected. The skin goes through a rapid change, from a charred black to bloodred lesions, as if they had been flayed alive. Complete loss of hair and cataracts of the eyes also occurs, and green ultracite crystals begin to protrude randomly from the skin. As well as affecting the appearance, those infected also succumb to complete degeneration of their mental faculties. While a rudimentary hive mind seems to connect the Scorched, the only instinct left for those infected is violent aggression towards everything but other scorched. 

---

### Stat Changes
| Category | Change |
|---|---|
| Character Attributes | CHA = 1, INT = 1, Luck Points = 0 |
| Creature Attributes | Body/Mind unchanged |
| Skills | Character: loses most skills (see Effect); Creature: unchanged |
| Attacks | Restrictions apply (see Effect) |
| Special Abilities | Adds **Scorched** |

---

### Granted Abilities
- **Scorched**

---

### Effect
**Requirements:** This template can only be applied to a non-mutated human character or a non-robot creature.

**Attributes:** A character’s CHA and INT are reduced to 1. A Scorched character has 0 Luck points. A creature’s Body and Mind scores are unchanged. 

**Skills:** A character loses all ranks in skills except Athletics, Melee Weapons, Sneak, Survival, and Unarmed. The character must change their tag skills to one of the listed skills. Creatures’ skills are unchanged. 

**Attacks:** Scorched are still able to wield melee weapons if they did so before, but they can no longer use weapons to make ranged attacks (they may still make ranged attacks natural to the creature). Attacks from a scorched character or creature count as exposure to a source of disease. 

**Special Abilities:** The scorched character or creature gains the Scorched ability:

**Scorched:** The creature is barely intelligent, driven by instinct and aggression against the uninfected. Scorched creatures cannot be persuaded or influenced by Speech tests. Scorched creatures move towards and attack the nearest enemy, and due to their hive mind, when one scorched becomes aware of prey, all others within Long range will be alerted and move to attack. If they cannot detect an enemy, they move towards the nearest source of bright light or loud noise. Failing that, they will move around randomly or simply stand perfectly still.

---

```yaml
spec:
  id: scorched
  name: Scorched
  kind: template
  version: 1
  applies_to: creature_or_character
  mutually_exclusive_group: creature_template

  requirements:
    include:
      - creature_or_character
    exclude:
      - robot
    notes:
      - "Also requires: non-mutated human character (if character). This may require manual confirmation in UI."

  injection:
    target_list: special_abilities
    name: "CREATURE TEMPLATE"
    title: "SCORCHED"
    format: blockquote

  mechanics:
    # PARTIAL automation (safe subset). Full skills/attack restrictions should be added
    # only once your rule text is captured without truncation.
    operations:
      - id: scorched_character_set_cha_int
        type: set_stats_if_character
        set:
          cha: 1
          int: 1

      - id: scorched_character_set_luck_points
        type: set_field_if_character
        field: luck_points
        value: 0

    todo:
      - "Implement character skill wipe + exceptions once full list is captured."
      - "Implement attack/weapon restrictions once full rule text is captured."
