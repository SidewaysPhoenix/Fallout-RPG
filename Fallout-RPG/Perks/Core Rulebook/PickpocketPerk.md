```statblock
layout: Fallout_2d20_Perks
name: "Pickpocket"
levelReq: "1"
lvlIncreasePerRank: "3"

otherReq: ""
otherReqModifier: ""

maxRank: "3"
specialReq:
  - name: "STR"
    desc: "-"
  - name: "PER"
    desc: "8"
  - name: "END"
    desc: "-"
  - name: "CHA"
    desc: "-"
  - name: "INT"
    desc: "-"
  - name: "AGI"
    desc: "8"
  - name: "LCK"
    desc: "-"
    
effectPerRank:
  - name: "Rank 1"
    desc: "You can ignore the first complication you roll when you make an *AGI + Sneak* test to steal an object from someone else's person or to plant something on them."
  - name: "Rank 2"
    desc: "You can re-roll 1d20 in your dice pool when attempting to pick someone’s pocket."
  - name: "Rank 3"
    desc: "You reduce the difficulty of attempts to pick someone’s pocket by 1."

showCurrentRankEffectOnly: "false"

oldFileName: "PICKPOCKET"
```