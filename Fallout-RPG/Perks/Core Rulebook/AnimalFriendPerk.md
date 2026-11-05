```statblock
layout: Fallout_2d20_Perks
name: "Animal Friend"
levelReq: "1"
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
    desc: "6"
  - name: "INT"
    desc: "-"
  - name: "AGI"
    desc: "-"
  - name: "LCK"
    desc: "-"
    
effectPerRank:
  - name: "Rank 1"
    desc: "Whenever a creature NPC with the *Mammal*, *Lizard*, or *Insect* keyword would attack you, roll 1D6 : \n\n On any result other than an Effect, the creature chooses not to attack you, although it may still attack another character it can target."
  - name: "Rank 2"
    desc: "You can attempt a *CHA + Survival* test with a difficulty of 2 as a major action. If you succeed, the animal treats you as friendly and will attack anyone who attacks you. *Mighty* and *Legendary* animals are unaffected by this perk. "

showCurrentRankEffectOnly: "false"

oldFileName: "ANIMAL FRIEND"
```