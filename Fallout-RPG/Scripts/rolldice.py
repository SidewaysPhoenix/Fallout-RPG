import sys
import random

# dice conversion table
# 1 :: 1
# 2 :: 2
# 3 :: 0
# 4 :: 0
# 5 :: Effect
# 6 :: Effect

dice_to_roll = input("\nHow many dice are we rolling?\n")
dice_to_roll = int(dice_to_roll)
print("-------------------------------------------------------\n")

damage_effect_y_n = input("\nIs there a damage effect for this roll? y/n\n")
damage_effect_y_n = damage_effect_y_n.lower()
print("-------------------------------------------------------\n")

def roll_selections(damage_effect_y_n):
    damage_effect_options = ["Arc", "Breaking", "Burst", "Freeze", "Persistent", "Piercing", "Radioactive", "Spread", "Stun", "Vicious", "Cancel"]
    
    if damage_effect_y_n == "no" or damage_effect_y_n == "n":
        print("-------------------------------------------------------\n")
        print("\nNo damage effects applied\n")
        print(f"*** You hit the {roll_location()} ***\n")
        roll_dice(dice_to_roll)
    
    elif damage_effect_y_n == "yes" or damage_effect_y_n == "y":
        #list out options for user to select from
        for i in range(len(damage_effect_options)):
            print(f"{i+1}). {damage_effect_options[i]}")
        effect_option_select = input("\nEnter option(s) seperated by commas ex: 3,5,10\n")
        effect_option_select = effect_option_select.replace(" ", "")
        effect_option_select = effect_option_select.split(",")
        print("-------------------------------------------------------\n")
        
        results = roll_dice(dice_to_roll)
        if results[3] == 0:
            print("No effects rolled, damage effects will not apply.")
            return
        print("/ --------------- /")
        print("/ Applied Effects /")
        print("/ --------------- /\n")
        for i in effect_option_select:
            selected_option = int(i)

            #Check for invalid entry or cancelation
            if (selected_option - 1) not in range(len(damage_effect_options)):
                print("Invalid option selected")
                sys.exit(0)
            elif selected_option == 11:
                print("Canceled")
                return

            #Run option value variable as function
            option_value = f'{damage_effect_options[selected_option-1].lower()}'
            globals()[option_value](results)

        print("-------------------------------------------------------\n")

    else:
        print("Invalid option selected.")
        sys.exit(0)

def roll_dice(dice_to_roll):
    #counts for each dice roll type
    one_count = 0
    two_count = 0
    zero_count = 0
    effect_count = 0
    
    #rolling the dice and recording results
    for i in range(0, dice_to_roll):
        current_roll = random.randrange(1,7)
        if current_roll == 1:
            one_count += 1
        elif current_roll == 2:
            two_count += 2
        elif current_roll == 3 or current_roll == 4:
            zero_count += 1
        elif current_roll == 5 or current_roll == 6:
            effect_count += 1

    calculated_total = one_count + two_count + effect_count
    print(f"\n*** Rolling {dice_to_roll} Combat Dice ***")
    print(f"\n    0's: {zero_count}\n    1's: {one_count}\n    2's: {two_count // 2} (2's Total: {two_count})\n    Effect's: {effect_count}")
    print(f"\n*** Total: {calculated_total}***\n ")
    print("-------------------------------------------------------\n")
    
    return (one_count, two_count, zero_count, effect_count, calculated_total)

def roll_location():
    # 1–2 Head 
    # 3–8 Torso 
    # 9–11 Left arm 
    # 12–14 Right arm 
    # 15–17 Left Leg 
    # 18–20 Right Leg
    location_roll = random.randrange(1,21)
    if location_roll in range(1,3):
        return "Head"
    if location_roll in range(3,9):
        return "Torso"
    if location_roll in range(9,12):
        return "Left Arm"
    if location_roll in range(12,15):
        return "Right Arm"
    if location_roll in range(15,18):
        return "Left Leg"
    if location_roll in range(18,21):
        return "Right Leg"

### Damage Effect Functions
def arc(results):
    print("*** Arc ***")
    print(f"You automatically hit {results[3]} additional targets in Close range of the primary target.\n")

def breaking(results):
    print("*** Breaking ***")
    print(f"If target is in cover reduce the Cover Combat Die amount by {results[3]} permanently.\nIf the target is not in cover, instead reduce the DR of the location struck by 1, according to the damage type of the weapon. Ex: physical damage only reduces physical DR.\n")

def burst(results):
    print("*** Burst ***")
    print(f"The attack hits {results[3]} additional targets, for each additional target spend 1 additional unit of ammunition from the weapon.\n")

def freeze(results):
    print("*** Freeze ***")
    print(f"Enemies will be frozen if half of their END or Body score is less than or equal to {results[3]}.\nA Frozen creature cannot take actions on its next turn.\n")

def persistent(results):
    print("*** Persistent ***")
    print(f"The target suffers the weapon’s damage again at the end of their next and subsequent turns, for {results[3]} rounds.\nThe target can spend a major action to make a test to stop persistent damage early, with a difficulty of {results[3]}, and the attribute + skill chosen by the GM.\nSome Persistent weapons may inflict a different type of damage to the weapon, and where this is the case, it will be noted in brackets, for example: Persistent (Poison).\n")

def piercing(results):
    print("*** Piercing ***")
    print(f"Ignore {results[3]} points of the target’s DR.\n")

def radioactive(results):
    print("*** Radioactive ***")
    print(f"The target also suffers {results[3]} point(s) of radiation damage.\nThis radiation damage is totalled and applied separately, after a character has suffered the normal damage from the attack.\n")

def spread(results):
    print("*** Spread ***")
    location_list = []
    for i in range(results[3]):
        location_list.append(roll_location())
    print(f"Your attack inflicts {results[3]} additional hit(s) on the target.\nEach additional hit inflicts {results[3] // 2} damage to the following random locations even if a specific location was targeted for the initial attack.")
    print(f"{location_list}\n")

def stun(results):
    print("*** Stun ***")
    print("The target cannot take their normal actions on their next turn.\nA stunned character or creature can still spend AP to take additional actions as normal.")

def vicious(results):
    print("*** Vicious ***")
    print(f"{results[3]} Vicious Effect Damage")
    print(f"{results[3] + results[4]} Total Damage with Vicious\n")

roll_selections(damage_effect_y_n)











