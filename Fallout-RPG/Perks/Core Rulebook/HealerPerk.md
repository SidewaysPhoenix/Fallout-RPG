```statblock
layout: Fallout_2d20_Perks
name: "Healer"
levelReq: "1"
lvlIncreasePerRank: "5"

otherReq: ""
otherReqModifier: ""

maxRank: "3"
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
    desc: "7"
  - name: "AGI"
    desc: "-"
  - name: "LCK"
    desc: "-"
    
effectPerRank:
  - name: "Rank 1"
    desc: "When you heal a patient’s HP using the [[First Aid]] action, increase the amount of HP healed by +1."
  - name: "Rank 2"
    desc: "When you heal a patient’s HP using the [[First Aid]] action, increase the amount of HP healed by +2."
  - name: "Rank 3"
    desc: "When you heal a patient’s HP using the [[First Aid]] action, increase the amount of HP healed by +3."

showCurrentRankEffectOnly: "true"

oldFileName: "HEALER"
```