import sys
import random

# dice conversion table
# 1 :: 1
# 2 :: 2
# 3 :: 0
# 4 :: 0
# 5 :: Effect
# 6 :: Effect

dice_to_roll = input("How many dice are we rolling?\n")
dice_to_roll = int(dice_to_roll)

damage_effect_y_n = input("Is there a damage effect for this roll? y/n\n")
damage_effect_y_n = damage_effect_y_n.lower()


def roll_selections(damage_effect_y_n):
    damage_effect_options = ["Arc", "Breaking", "Burst", "Freeze", "Persistent", "Piercing", "Radioactive", "Spread", "Stun", "Vicious", "Cancel"]
    
    if damage_effect_y_n == "no" or damage_effect_y_n == "n":
        print("No damage effects applied")
        roll_dice(dice_to_roll)
    
    elif damage_effect_y_n == "yes" or damage_effect_y_n == "y":
        #list out options for user to select from
        for i in range(len(damage_effect_options)):
            print(f"{i+1}). {damage_effect_options[i]}")
        effect_option_select = input("Enter option(s) seperated by commas ex: 3,5,10\n")
        effect_option_select = effect_option_select.replace(" ", "")
        effect_option_select = effect_option_select.split(",")
        
        results = roll_dice(dice_to_roll)

        for i in effect_option_select:
            selected_option = int(i)

            #Check for invalid entry or cancelation
            if (selected_option - 1) not in range(len(damage_effect_options)):
                print("Invalid option selected")
                sys.exit(0)
            elif selected_option == 11:
                print("Canceled")
                sys.exit(0)

            #Run option value variable as function
            option_value = f'{damage_effect_options[selected_option-1].lower()}'
            globals()[option_value](results)

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
    print(f"\nRolling {dice_to_roll} Combat Dice")
    print(f"\n    0's: {zero_count}\n    1's: {one_count}\n    2's: {two_count // 2} (2's Total: {two_count})\n    Effect's: {effect_count}")
    print(f"\nTotal: {calculated_total}\n")
    
    return (one_count, two_count, zero_count, effect_count, calculated_total)


### Damage Effect Functions
def vicious(results):
    print("Vicious applied")
    print(f"{results[3]} Vicious Effect Damage")
    print(f"{results[3] + results[4]} Total Damage with Vicious\n")

def arc(results):
    print("Arc applied")




roll_selections(damage_effect_y_n)












"""
    damage_effect_options = ["Arc", "Breaking", "Burst", "Freeze", "Persistent", "Piercing", "Radioactive", "Spread", "Stun", "Vicious", "Cancel"]
    
    if damage_effect_y_n == "no" or damage_effect_y_n == "n":
        print("No damage effects applied")
        roll_dice(dice_to_roll)
    
    elif damage_effect_y_n == "yes" or damage_effect_y_n == "y":
        #list out options for user to select from
        for i in range(len(damage_effect_options)):
            print(f"{i+1}). {damage_effect_options[i]}")
        effect_option_select = input("Please select an option.\n")
        effect_option_select = int(effect_option_select)
        
        #Check for invalid entry or cancelation
        if (effect_option_select - 1) not in range(len(damage_effect_options)):
            print("Invalid option selected")
            sys.exit(0)
        elif effect_option_select == 11:
            print("Canceled")
            sys.exit(0)
        
        results = roll_dice(dice_to_roll)

        #Run option value variable as function
        option_value = f'{damage_effect_options[effect_option_select-1].lower()}'
        globals()[option_value](results)

    else:
        print("Invalid option selected.")
        sys.exit(0)
"""