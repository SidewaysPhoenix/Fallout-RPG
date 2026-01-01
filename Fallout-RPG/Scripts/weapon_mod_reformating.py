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

    content_rebuild_list = []
    content_rebuild_list.append("```statblock") #apply starter codeblock backticks
    for i in range(1, len(line_list)-1):
        if line_list[i].startswith("effects:"):
            effects_to_pass = line_list[i].replace("effects: ", "")
            parsed_effects = effect_parser(effects_to_pass) #start effect parser here
            for i in parsed_effects:
                content_rebuild_list.append(i)
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
    
    cleaned = effect_line.replace('"', '')
    effect_line_split_list = (cleaned.lower()).split(",")
    for i in effect_line_split_list:
        stripped = i.strip()
        fixed_string = string_classifier(stripped)

        if fixed_string == None:
            other_effects_list.append(stripped)
        else:
            lines_to_add.append(fixed_string)
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

    if re.search(r"\+[0-9]+d6", cleaned_line) or re.search(r"\-[0-9]+d6", cleaned_line):
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
    if re.search(r"\+[0-9]+",raw_fire_rate_string) or re.search(r"\-[0-9]+",raw_fire_rate_string):
        return f'mod_fire_rate: "{raw_fire_rate_string}"'
    else:
        return None
    
#Range parsing
def is_mod_range(string):
    if re.search(r"range",string):
        return True
    
def mod_range(range_string):
    range_by_removed = range_string.replace(" range by ", "")
    step_removed = range_by_removed.replace(" step", "")
    raw_range = ""
    if "reduce" in step_removed:
        raw_range = step_removed.replace("reduce", "-")
    elif "increase" in step_removed:
        raw_range = step_removed.replace("increase", "+")
    
    if re.search(r"\+[0-9]+", raw_range) or re.search(r"\-[0-9]+", raw_range):
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

path_crawl(main_mod_path)


#Damage Effects List [arc, breaking, burst, freeze, persistent, piercing, radioactive, spread, stun, vicious]
#Weapon Qualities List [accurate, ammo-hungry, blast, bombard, close quarters, concealed, debilitating, delay, gatling, inaccurate, mine, night vision, parry, placed, recoil, recon, reliable, slow load, suppressed, surge, thrown, two-handed, unreliable]
#Weapon Type List [big guns, energy weapons, explosives, melee weapons, small guns, throwing, unarmed]
#Weapon Damage Type List [physical, energy, radiation, poison]

#mod_qualities:
#mod_dmg_effect: +[[Piercing]] +1
#mod_ammo:
#mod_dmg_type:
#mod_weapon_type: bayonet will be effect only.
#mod_other_effects:


