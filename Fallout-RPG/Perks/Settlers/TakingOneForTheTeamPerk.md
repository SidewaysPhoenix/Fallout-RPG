```statblock
layout: Fallout_2d20_Perks
name: "Taking One For The Team"
levelReq: "1"
lvlIncreasePerRank: "4"

otherReq: ""
otherReqModifier: ""

maxRank: "3"
specialReq:
  - name: "STR"
    desc: "-"
  - name: "PER"
    desc: "-"
  - name: "END"
    desc: "7"
  - name: "CHA"
    desc: "6"
  - name: "INT"
    desc: "-"
  - name: "AGI"
    desc: "-"
  - name: "LCK"
    desc: "-"
    
effectPerRank:
  - name: "Rank 1"
    desc: "Whenever a creature NPC would roll to damage an ally in the same zone as you, roll 1D6. \n - On any result other than an Effect, you take the damage from the attack instead. \n - This effect can only trigger once per round of combat."
  - name: "Rank 2"
    desc: "Whenever a creature NPC would roll to damage an ally in the same zone as you, roll 1D6. \n - On any result other than an Effect, you take the damage from the attack instead. \n - This effect can only trigger *twice* per round of combat. \n\n If you take damage from the attack after calculating damage reduction, add 2 AP to the pool."
  - name: "Rank 3"
    desc: "Whenever a creature NPC would roll to damage an ally in the same zone as you, roll 1D6. \n - On any result other than an Effect, you take the damage from the attack instead. \n - This effect can only trigger *twice* per round of combat. \n\n If you take damage from the attack after calculating damage reduction, add 3 AP to the pool. \n\n After you have taken the damage, you and the ally can re-roll 3d20 on the next attack you make against the target that attacked."

showCurrentRankEffectOnly: "true"

oldFileName: "TAKING ONE FOR THE TEAM"
```