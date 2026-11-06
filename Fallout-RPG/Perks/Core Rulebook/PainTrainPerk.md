```statblock
layout: Fallout_2d20_Perks
name: "Pain Train"
levelReq: "1"
lvlIncreasePerRank: "5"

otherReq: ""
otherReqModifier: ""

maxRank: "2"
specialReq:
  - name: "STR"
    desc: "9"
  - name: "PER"
    desc: "-"
  - name: "END"
    desc: "7"
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
    desc: "You may Charge as a major action if you are wearing Power Armor or are a super mutant. This is a movement action, and you may not [[Move]] or [[Sprint]] in the same turn. \n\n When you take this action, you move into reach of an enemy within Medium range (1 zone) and make a *STR + Athletics* test with a difficulty of 2. If you succeed, the enemy suffers damage equal to your normal *unarmed* damage, and is knocked [[Prone]]. \n\n *At the GM’s discretion, especially large or sturdy creatures cannot be knocked prone by this action.*"
  - name: "Rank 2"
    desc: "You add an additional +1D6 damage and the [[Stun]] damage effect to the damage inflicted."

showCurrentRankEffectOnly: "false"

oldFileName: "PAIN TRAIN"
```