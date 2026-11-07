```statblock
layout: Fallout_2d20_Perks
name: "Spiritual Healer"
levelReq: "6"
lvlIncreasePerRank: "9"

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
    desc: "7"
  - name: "INT"
    desc: "-"
  - name: "AGI"
    desc: "-"
  - name: "LCK"
    desc: "-"
    
effectPerRank:
  - name: "Rank 1"
    desc: "When you succeed at a [[First Aid]] action to stabilize a dying ally, you regain 1 HP."
  - name: "Rank 2"
    desc: "When you succeed at a [[First Aid]] action to stabilize a dying ally, you regain 2 HP, and a further 2 HP at the start of your next turn."
  - name: "Rank 3"
    desc: "When you succeed at a [[First Aid]] action to stabilize a dying ally, you regain 3 HP, and you regain 3 HP at the start of your next *two* turns."

showCurrentRankEffectOnly: "true"

oldFileName: "SPIRITUAL HEALER"
```