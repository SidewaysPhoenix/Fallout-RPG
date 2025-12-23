import sys
import random

dice_to_roll = sys.argv[1]

# dice conversion table
# 1 :: 1
# 2 :: 2
# 3 :: 0
# 4 :: 0
# 5 :: Effect
# 6 :: Effect


def roll_dice(dice_to_roll=int):
    dice_amount = int(dice_to_roll)
    rolled_list = []
    one_count = 0
    two_count = 0
    zero_count = 0
    effect_count = 0
    for i in range(0, dice_amount):
        current_roll = random.randrange(1,7)
        if current_roll == 1:
            one_count += 1
        elif current_roll == 2:
            two_count += 2
        elif current_roll == 3 or current_roll == 4:
            zero_count += 1
        elif current_roll == 5 or current_roll == 6:
            effect_count += 1
    print(f"\nRolling {dice_amount} Combat Dice")
    print(f"\n    0's: {zero_count}\n    1's: {one_count}\n    2's: {two_count // 2} (2's Total: {two_count})\n    Effect's: {effect_count}\n\nTotal: {one_count + two_count + effect_count}\n")
    

    
    # sorted_dice = sorted(rolled_list)
    

roll_dice(dice_to_roll)