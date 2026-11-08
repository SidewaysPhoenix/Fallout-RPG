```statblock
layout: Fallout_2d20_Perks
name: "Barbarian"
levelReq: "4"
lvlIncreasePerRank: ""

otherReq: "Robot"         
otherReqModifier: "false"

maxRank: "1"
specialReq:
  - name: "STR"
    desc: "7"
  - name: "PER"
    desc: "-"
  - name: "END"
    desc: "-"
  - name: "CHA"
    desc: "-"
  - name: "INT"
    desc: "-"
  - name: "AGI"
    desc: "-"
  - name: "LCK"
    desc: "-"
    
effectPerRank:
  - name: "Rank 1"
    desc: |
            Your Physical and Energy Damage Resistance increases on all hit locations based on your *STR*.
            *You do not gain this benefit while wearing Power Armor.*

            | Strength Attribute | Damage Resistance |
            | --- | --- |
            | *STR 7–8* | +1 physical DR, +1 energy DR |
            | *STR 9–10* | +2 physical DR, +2 energy DR |
            | *STR 11+* | +3 physical DR, +3 energy DR |
  

showCurrentRankEffectOnly: "false" #boolean REQUIRED

oldFileName: "BARBARIAN"
```