```statblock
layout: Fallout_2d20_Perks
name: "Nocturnal Fortitude"
levelReq: "12"
lvlIncreasePerRank: ""

otherReq: "Robot"
otherReqModifier: "false"

maxRank: "1"
specialReq:
  - name: "STR"
    desc: "-"
  - name: "PER"
    desc: "-"
  - name: "END"
    desc: "6"
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
    desc: "At night, your maximum HP is increased by an amount equal to your *END*. \n - When you increase your maximum HP, you gain the same amount of additional current HP. \n - When the effect ends, your maximum HP is reduced back to normal, but your current HP remains unchanged unless it is above your maximum (in which case, it is reduced to your maximum)."

showCurrentRankEffectOnly: "false"

oldFileName: "NOCTURNAL FORTITUDE"
```