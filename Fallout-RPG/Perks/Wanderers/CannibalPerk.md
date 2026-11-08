```statblock
layout: Fallout_2d20_Perks
name: "Cannibal"
levelReq: "10"
lvlIncreasePerRank: "9"

otherReq: "Robot"
otherReqModifier: "false"

maxRank: "3"
specialReq:
  - name: "STR"
    desc: "-"
  - name: "PER"
    desc: "-"
  - name: "END"
    desc: "8"
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
    desc: "*Super mutants may ignore the level requirement for the first rank only.* \n\n You may attempt to butcher a dead human, requiring an *END + Survival* test with a difficulty of 0. \n - Success yields one portion of human flesh, which you may immediately consume. \n - To you, human flesh counts as a food item which restores 4 HP and is Irradiated (_roll 1D6 and suffer 1 Radiation damage if an Effect is rolled_). \n - Consuming human flesh is regarded as abhorrent by most people and is a crime in most settlements. \n\n > [!warning]- Dark Cravings \n *Cannibalism can be addictive*: After consuming *human flesh*, roll *1D6 equal to the number of times you’ve eaten human flesh this session*. \n > - If *two or more Effects are rolled*, you are *addicted*. \n > - While *addicted*, *no food* will satisfy your hunger *other than human flesh* (_which moves you immediately to the sated state_). \n > - After *four hours of being sated*, you *immediately gain 1 Fatigue and become starving, skipping the intervening states*. \n > This can be *cured in the same way* as *other addictions*."
  - name: "Rank 2"
    desc: "You may also butcher ghouls in this way."
  - name: "Rank 3"
    desc: "You may also butcher super mutants in this way."

showCurrentRankEffectOnly: "false"

oldFileName: "CANNIBAL"
```