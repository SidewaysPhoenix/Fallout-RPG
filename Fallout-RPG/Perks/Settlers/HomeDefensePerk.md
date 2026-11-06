```statblock
layout: Fallout_2d20_Perks
name: "Home Defense"
levelReq: "5"
lvlIncreasePerRank: "5"

otherReq: ""
otherReqModifier: ""

maxRank: "2"
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
    desc: "6"
  - name: "AGI"
    desc: "-"
  - name: "LCK"
    desc: "-"
    
effectPerRank:
  - name: "Rank 1"
    desc: "You can craft traps from the Traps section, p.189. \n - Traps have a complexity of 2 and require the components for a [[Crafting Complexity]] 2 item. \n - If you fail the *INT + Repair* test, your trap misfires—resolve the trap’s effect against yourself."
  - name: "Rank 2"
    desc: "When you fail the *INT + Repair* test to set the trap, it does not misfire. \n - Instead, you succeed at cost, and the GM creates a *complication* related to the trap (e.g., it is easier to spot, deals less damage, or does not work as intended)."
    
showCurrentRankEffectOnly: "false"

oldFileName: "HOME DEFENSE"
```