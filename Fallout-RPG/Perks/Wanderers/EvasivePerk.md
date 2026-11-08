```statblock
layout: Fallout_2d20_Perks
name: "Evasive"
levelReq: "7"
lvlIncreasePerRank: ""

otherReq: ""
otherReqModifier: ""

maxRank: "1"
specialReq:
  - name: "STR"
    desc: "-"
  - name: "PER"
    desc: "-"
  - name: "END"
    desc: "-"
  - name: "CHA"
    desc: "-"
  - name: "INT"
    desc: "-"
  - name: "AGI"
    desc: "7"
  - name: "LCK"
    desc: "-"
    
effectPerRank:
  - name: "Rank 1"
    desc: |
            Your Physical damage resistance and Energy damage resistance on all hit locations increase based on your Agility.
            *You do not gain this benefit while wearing Power Armor or while encumbered.*
            
            | AGI Score | Resistance Bonus |
            | --- | --- |
            | *AGI 7-8* | +1 Physical & Energy Damage Resistance |
            | *AGI 9-10* | +2 Physical & Energy Damage Resistance |
            | *AGI 11+* | +3 Physical & Energy Damage Resistance |

showCurrentRankEffectOnly: "false"

oldFileName: "EVASIVE"
```