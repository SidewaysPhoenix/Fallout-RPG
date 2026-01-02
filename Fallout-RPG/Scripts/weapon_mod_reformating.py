import os
import sys
import re

dir_path = os.path.dirname(os.path.realpath(__file__))
main_mod_path = os.path.join(dir_path, "Weapon_Mods") 

folders_traversed = []
files = []
def path_crawl(path):
    for i in list_files(path):
        current_path = os.path.join(path, i)
        if os.path.isdir(current_path):
            folders_traversed.append(os.path.basename(current_path))
            path_crawl(current_path)
        elif os.path.isfile(current_path):
            files.append(os.path.basename(current_path))
            file_parser(current_path)




#helper functions
def list_files(path):
    return os.listdir(path)

def file_parser(file_to_read):
    file = open(file_to_read, "r", encoding="utf-8")
    content = file.read()
    content = content.strip()
    line_list = content.split("\n")
    new_yaml_lines = {
        "mod_dmg": "",
        "mod_fire_rate": "",
        "mod_range": "",
        "mod_ammo": "",
        "mod_base_dmg": "",
        "mod_dmg_effects": "",
        "mod_change_dmg_type": "",
        "uncategorized": "",
    }
    content_rebuild_list = []
    content_rebuild_list.append("```statblock") #apply starter codeblock backticks
    for i in range(1, len(line_list)-1):
        if line_list[i].startswith("effects:"):
            effects_to_pass = line_list[i].replace("effects: ", "")
            
            if effects_to_pass.startswith('"Melee weapon'): #deal with special melee mods here
                print("melee bayonete detected")
                content_rebuild_list.append(line_list[i])
                continue

            parsed_effects_list = effect_parser(effects_to_pass) #start effect parser here
            
            if parsed_effects_list == []: #empty effects cleared out here
                continue

            for i in parsed_effects_list:
                parsed_effect = i
                if parsed_effect.startswith("mod_dmg:"):
                    strip_starter = parsed_effect.replace("mod_dmg: ", "")
                    clean_line = strip_starter.strip('"')
                    if new_yaml_lines["mod_dmg"] == "":
                        new_yaml_lines["mod_dmg"] = clean_line
                    else:
                        new_yaml_lines["mod_dmg"] = f'{new_yaml_lines["mod_dmg"]}, {clean_line}'

                elif parsed_effect.startswith("mod_fire_rate:"):
                    strip_starter = parsed_effect.replace("mod_fire_rate: ", "")
                    clean_line = strip_starter.strip('"')
                    if new_yaml_lines["mod_fire_rate"] == "":
                        new_yaml_lines["mod_fire_rate"] = clean_line
                    else:
                        new_yaml_lines["mod_fire_rate"] = f'{new_yaml_lines["mod_fire_rate"]}, {clean_line}'

                elif parsed_effect.startswith("mod_range:"):
                    strip_starter = parsed_effect.replace("mod_range: ", "")
                    clean_line = strip_starter.strip('"')
                    if new_yaml_lines["mod_range"] == "":
                        new_yaml_lines["mod_range"] = clean_line
                    else:
                        new_yaml_lines["mod_fire_rate"] = f'{new_yaml_lines["mod_fire_rate"]}, {clean_line}'

                elif parsed_effect.startswith("mod_ammo:"):
                    strip_starter = parsed_effect.replace("mod_ammo: ", "")
                    clean_line = strip_starter.strip('"')
                    if new_yaml_lines["mod_ammo"] == "":
                        new_yaml_lines["mod_ammo"] = clean_line
                    else:
                        new_yaml_lines["mod_ammo"] = f'{new_yaml_lines["mod_ammo"]}, {clean_line}'

                elif parsed_effect.startswith("mod_base_dmg:"):
                    strip_starter = parsed_effect.replace("mod_base_dmg: ", "")
                    clean_line = strip_starter.strip('"')
                    if new_yaml_lines["mod_base_dmg"] == "":
                        new_yaml_lines["mod_base_dmg"] = clean_line
                    else:
                        new_yaml_lines["mod_base_dmg"] = f'{new_yaml_lines["mod_base_dmg"]}, {clean_line}'

                elif parsed_effect.startswith("mod_dmg_effects:"):
                    strip_starter = parsed_effect.replace("mod_dmg_effects: ", "")
                    clean_line = strip_starter.strip('"')
                    if new_yaml_lines["mod_dmg_effects"] == "":
                        new_yaml_lines["mod_dmg_effects"] = clean_line
                    else:
                        new_yaml_lines["mod_dmg_effects"] = f'{new_yaml_lines["mod_dmg_effects"]}, {clean_line}'

                elif parsed_effect.startswith("mod_change_dmg_type:"):
                    strip_starter = parsed_effect.replace("mod_change_dmg_type: ", "")
                    clean_line = strip_starter.strip('"')
                    if new_yaml_lines["mod_change_dmg_type"] == "":
                        new_yaml_lines["mod_change_dmg_type"] = clean_line
                    else:
                        new_yaml_lines["mod_change_dmg_type"] = f'{new_yaml_lines["mod_change_dmg_type"]}, {clean_line}'

                else:
                    strip_starter = i.replace("effects: ", "")
                    clean_line = strip_starter.strip('"')
                    if new_yaml_lines["uncategorized"] == "":
                        new_yaml_lines["uncategorized"] = clean_line
                    else:
                        new_yaml_lines["uncategorized"] = f'{new_yaml_lines["uncategorized"]}, {clean_line}'


            for i in new_yaml_lines:
                    content_rebuild_list.append(f'{i}: "{new_yaml_lines[i]}"')
        
        else:
            content_rebuild_list.append(line_list[i])
    
    content_rebuild_list.append("```") #reapply codeblock backticks
    content_rebuild = '\n'.join(content_rebuild_list)    
    print(content_rebuild)
        
    file.close()

def effect_parser(effect_line):
    lines_to_add = []
    other_effects_list = []
    mod_other_effects = 'effects: '
    remove_periods = effect_line.replace(".","")
    cleaned = remove_periods.replace('"', '')
    effect_line_split_list = (cleaned.lower()).split(",")
    for i in effect_line_split_list:
        stripped = i.strip()
        fixed_string = string_classifier(stripped)

        if fixed_string == None:
            other_effects_list.append(stripped)
        else:
            lines_to_add.append(fixed_string)
    if other_effects_list == []:
        return lines_to_add
    else:
        lines_to_add.append(f'{mod_other_effects}"{','.join(other_effects_list)}"')
        return lines_to_add

def string_classifier(string):
    if is_mod_dmg(string):
        return mod_dmg(string)
    elif is_mod_fire_rate(string):
        return mod_fire_rate(string)
    elif is_mod_range(string):
        return mod_range(string)
    elif is_mod_ammo(string):
        return mod_ammo(string)
    elif is_mod_base_dmg(string):
        return mod_base_dmg(string)
    elif is_mod_dmg_effect(string):
        return mod_dmg_effects(string)
    elif is_mod_change_dmg_type(string):
        mod_change_dmg_type(string)

    else:
        return None

#Damage parsing
def is_mod_dmg(string):
    if re.search(r"\+[0-9]+ d6",string) or re.search(r"\-[0-9]+ d6", string):
        return True
    elif re.search(r"\+[0-9]+d6",string) or re.search(r"\-[0-9]+d6", string):
        return True

def mod_dmg(damage_string):
    no_spaces_string = damage_string.replace(" ", "")
    raw_damage_string = no_spaces_string.replace('"', '')
    cleaned_line = raw_damage_string.replace("damage", "")

    if re.search(r"^\+[0-9]+d6", cleaned_line) or re.search(r"^\-[0-9]+d6", cleaned_line):
        return f'mod_dmg: "{cleaned_line}"'
    else:
        return None

#Fire Rate parsing
def is_mod_fire_rate(string):
    if re.search(r"[0-9]+\s+[A-Za-z]+\s[A-Za-z]+",string):
        return True

def mod_fire_rate(fire_rate_string):
    clear_fire_rate_text = fire_rate_string.replace("fire rate", "")
    raw_fire_rate_string = clear_fire_rate_text.replace(" ", "")
    if re.search(r"^\+[0-9]+",raw_fire_rate_string) or re.search(r"^\-[0-9]+",raw_fire_rate_string):
        return f'mod_fire_rate: "{raw_fire_rate_string}"'
    else:
        return None
    
#Range parsing
def is_mod_range(string):
    if re.search(r"range",string) and (re.search(r"increase",string) or re.search(r"reduce",string)):
        return True
    
def mod_range(range_string):
    string_list = range_string.split(" ")
    new_string_list = []
    for i in string_list:
        if i == "increases":
            new_string_list.append("+")
        elif i == "increase":
            new_string_list.append("+")
        elif i == "reduces":
            new_string_list.append("-")
        elif i == "reduce":
            new_string_list.append("-")
        
        if i == r"[0-9]+":
            new_string_list.append(i)
    if r"[0-9]+" not in new_string_list:
        new_string_list.append("1")
    raw_range = "".join(new_string_list)
    
    if re.search(r"^\+[0-9]+", raw_range) or re.search(r"^\-[0-9]+", raw_range):
        return f'mod_range: "{raw_range}"'

    else:
        return None
 
#Ammo parsing
def is_mod_ammo(string):
    if re.search(r"ammo to", string) or re.search(r"ammo changes to", string):
        return True

def mod_ammo(ammo_string):
    if re.search(r"ammo", ammo_string):    
        clean_string_list = ammo_string.split(" ")
        final_list = []
        for i in clean_string_list:
            string_piece = i.strip()
            if re.search(r"ammo", string_piece):
                pass
            elif re.search(r"changes", string_piece):
                pass
            elif re.search(r"to", string_piece):
                pass
            else:
                final_list.append(string_piece)

        final_string = " ".join(final_list)
        return f'mod_ammo: "{final_string}"'
    else:
        return None
    
#Base Damage Parsing
def is_mod_base_dmg(string):
    if re.search(r"change damage to", string):
        return True

def mod_base_dmg(base_dmg_string):
    change_damage_text_removed = base_dmg_string.replace("change damage to", "")
    spaces_removed = change_damage_text_removed.replace(" ", "")
    print(spaces_removed)
    if re.search(r"[0-9]+d6",spaces_removed):
        return f'mod_base_dmg: "{spaces_removed}"'
    else:
        return None

#Damage Quality Parsing
def is_mod_dmg_effect(string):
    damage_effects_list = ["arc", "breaking", "burst", "freeze", "persistent", "piercing", "radioactive", "spread", "stun", "vicious"]
    for i in damage_effects_list:
        if re.search(rf"{i}", string):    
            return True
        
def mod_dmg_effects(dmg_effects_string):
    damage_effects_dict = {"arc": "[[Arc]]", "breaking": "[[Breaking]]", "burst": "[[Burst]]", "freeze": "[[Freeze]]", "persistent": "[[Persistent]]", "piercing": "[[Piercing]]", "radioactive": "[[Radioactive]]", "spread": "[[Spread]]", "stun": "[[Stun]]", "vicious": "[[Vicious]]"}
    weapon_damage_type_list = ["physical", "energy", "radiation", "poison"]
    remove_left_brackets = dmg_effects_string.replace("[[", "")
    
    remove_right_brackets = remove_left_brackets.replace("]]", "")
    remove_left_parenthesis = remove_right_brackets.replace("(", "")
    remove_right_parenthesis = remove_left_parenthesis.replace(")", "")


    spaces_removed = remove_right_parenthesis.split(" ")

    final_effect_list = []
    if spaces_removed[0] == "gain" or spaces_removed[0] == "gains" or spaces_removed[0] == "add" or spaces_removed[0] == "remove" or spaces_removed[0] in damage_effects_dict:
        if spaces_removed[0] == "gain" or spaces_removed[0] == "gains" or spaces_removed[0] == "add":
            spaces_removed[0] = "Gain"
            final_effect_list.append(spaces_removed[0])
        elif spaces_removed[0] == "remove":
            spaces_removed[0] = "Remove"
            final_effect_list.append(spaces_removed[0])
        elif spaces_removed[0] in damage_effects_dict:
            spaces_removed[0] = f"Gain {damage_effects_dict[spaces_removed[0]]}"
            final_effect_list.append(spaces_removed[0])
    else:
        return None
    
    if len(spaces_removed) >= 2:
        if spaces_removed[1] in damage_effects_dict:
            print(f"{spaces_removed[1]} is in the dictionary")
            final_effect_list.append(damage_effects_dict[spaces_removed[1]])
        else:
            return None
    
    if len(spaces_removed) >= 3:
        if spaces_removed [2] in weapon_damage_type_list:
            final_effect_list.append(spaces_removed[2])
        elif re.search(r"[0-9]+", spaces_removed[2]):
            print(f"the number {spaces_removed[2]} is detected")
            final_effect_list.append(spaces_removed[2])
        else:
            return None

    if len(spaces_removed) >= 4:
        for i in range(3 ,len(spaces_removed)):
            if spaces_removed[i] in damage_effects_dict:
                final_effect_list.append(f'+{damage_effects_dict[spaces_removed[i]]}')
    
    
    raw_string = " ".join(final_effect_list)
    return f'mod_dmg_effects: "{raw_string}"'

def is_mod_change_dmg_type(string):
    weapon_dmg_type_list = ["physical", "energy", "radiation", "poison"]
    for i in weapon_dmg_type_list:
        if re.search(rf"{i}", string):    
            return True

def mod_change_dmg_type(dmg_type_string):
    weapon_dmg_type_list = ["physical", "energy", "radiation", "poison"]
    if re.search(r"changes damage type to", dmg_type_string) or re.search(r"change damage type to", dmg_type_string):
        for i in weapon_dmg_type_list:
            if i in dmg_type_string:
                return f'mod_dmg_type: "{i}"'


            
path_crawl(main_mod_path)


#Damage Effects List ["arc", "breaking", "burst", "freeze", "persistent", "piercing", "radioactive", "spread", "stun", "vicious"]
#Weapon Qualities List ["accurate", "ammo-hungry", "blast", "bombard", "close quarters", "concealed", "debilitating", "delay", "gatling", "inaccurate", "mine", "night vision", "parry", "placed", "recoil", "recon", "reliable", "slow load", "suppressed", "surge", "thrown", "two-handed", "unreliable"]
#Weapon Type List ["big guns", "energy weapons", "explosives", "melee weapons", "small guns", "throwing", "unarmed"]
#Weapon Damage Type List ["physical", "energy", "radiation", "poison"]

#mod_dmg_effect: +[[Piercing]] +1
#mod_qualities:
#mod_change_dmg_type:
#mod_weapon_type: 





    



