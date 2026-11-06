```statblock
layout: Fallout_2d20_Perks
name: "Contractor"
levelReq: "2"
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
    desc: "-"
  - name: "CHA"
    desc: "5"
  - name: "INT"
    desc: "5"
  - name: "AGI"
    desc: "-"
  - name: "LCK"
    desc: "-"
    
effectPerRank:
  - name: "Rank 1"
    desc: "When building structures for your settlement, you know how to make the process faster, cheaper, and more efficient. \n\n When you start constructing something, you can reduce the number of materials required to construct it by half (to a minimum of 1 unit of each material type), decreasing the overall Happiness by 2. \n - You can double the amount of construction time required to ignore the reduction in Happiness."
  - name: "Rank 2"
    desc: "You can have a person take a settlement action to construct an object even if they do not have the required skill. \n - Doing so reduces the settlement’s overall Happiness by 1. \n - If you have at least one person working on the construction object that has the skill, then you can ignore the reduction in Happiness."
  - name: "Rank 3"
    desc: "You can have a person take a settlement action to construct an object even if they do not have the required perk, but at least one person working on the object still must have the perk."

showCurrentRankEffectOnly: "false"

oldFileName: "CONTRACTOR"
```