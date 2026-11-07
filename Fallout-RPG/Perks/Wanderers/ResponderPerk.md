```statblock
layout: Fallout_2d20_Perks
name: "Responder"
levelReq: "9"
lvlIncreasePerRank: "7"

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
    desc: "8"
  - name: "INT"
    desc: "7"
  - name: "AGI"
    desc: "-"
  - name: "LCK"
    desc: "-"
    
effectPerRank:
  - name: "Rank 1"
    desc: "When you succeed at a [[First Aid]] action in combat to stabilize a dying ally, \n - You no longer need to spend 1 AP to wake them from unconsciousness. \n - In addition, the patient heals 2 HP at the start of their next turn."
  - name: "Rank 2"
    desc: "When you succeed at a [[First Aid]] action in combat to stabilize a dying ally, \n - You no longer need to spend 1 AP to wake them from unconsciousness. \n - In addition, the patient heals 4 HP at the start of their next two turns."
  - name: "Rank 3"
    desc: "When you succeed at a [[First Aid]] action in combat to stabilize a dying ally, \n - You no longer need to spend 1 AP to wake them from unconsciousness. \n - In addition, the patient heals 6 HP at the start of their next three turns."

showCurrentRankEffectOnly: "true"

oldFileName: "RESPONDER"
```