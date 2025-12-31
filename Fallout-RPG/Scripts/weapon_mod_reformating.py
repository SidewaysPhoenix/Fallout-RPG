import os
import sys
import re

dir_path = os.path.dirname(os.path.realpath(__file__))
main_mod_path = os.path.join(dir_path, "Weapon_Mods") 

files = []
def path_crawl(path):
    for i in list_files(path):
        current_path = os.path.join(path, i)
        if os.path.isdir(current_path):
            path_crawl(current_path)
        elif os.path.isfile(current_path):
            #files.append(os.path.basename(current_path))
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
    if re.search("\+[0-9]+ d6",string) or re.search("\-[0-9]+ d6", string):
        return mod_dmg(string)
    elif re.search("\+[0-9]+d6",string) or re.search("\-[0-9]+d6", string):
        return mod_dmg(string)
    else:
        return None

def mod_dmg(damage_string):
    no_spaces_string = damage_string.replace(" ", "")
    raw_damage_string = no_spaces_string.replace('"', '')
    cleaned_line = raw_damage_string.replace("damage", "")

    if re.search("\+[0-9]+d6", cleaned_line) or re.search("\-[0-9]+d6", cleaned_line):
        return f'mod_dmg: "{cleaned_line}"'
    else:
        return damage_string
    


path_crawl(main_mod_path)





#lower line, split

#mod_dmg:
#mod_fire_rate:
#mod_qualities:
#mod_dmg_effect: +[[Piercing]] 1, +
#mod_range:
#mod_ammo:
#mod_dmg_type:
#mod_weapon_type: bayonet will be effect only.
#mod_other_effects:


