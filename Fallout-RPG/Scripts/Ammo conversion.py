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

def list_files(path):
    return os.listdir(path)



def file_parser(file_to_read):
    file = open(file_to_read, "r", encoding="utf-8")
    content = file.read()
    content = content.strip()
    line_list = content.split("\n")
    '''
    new_yaml_lines = {
        "Damage": "",
        "Fire Rate": "",
        "Range": "",
        "Change Ammo Type": "",
        "Change Base Damage To": "",
        "Weapon Damage Effects": "",
        "Change Damage Type To": "",
        "Weapon Qualities": "",
        "Effects": "",
    }
    '''

    content_rebuild_list = []
    content_rebuild_list.append("```statblock") #apply starter codeblock backticks
    for i in range(1, len(line_list)-1):
        if line_list[i].startswith("ammo:"):
            ammo_to_pass = line_list[i].replace("ammo: ", "")
            

            #parsed_ammo_list = ammo_parser(ammo_to_pass) #start effect parser here
            
            if ammo_to_pass == "": #empty effects cleared out here
                continue

            for i in parsed_ammo_list:
                content_rebuild_list.append(f'ammo: "{i}"')
        
        else:
            content_rebuild_list.append(line_list[i])
    
    content_rebuild_list.append("```") #reapply codeblock backticks
    content_rebuild = '\n'.join(content_rebuild_list)    
    print(content_rebuild)
    #with open(file_to_read, "w", encoding="utf-8") as f:
        #f.write(content_rebuild)    
    file.close()

'''
def ammo_parser(effect_line):
    lines_to_add = []
    other_effects_list = []
    mod_other_effects = 'ammo: '
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
'''
#---------------------------------------------------------------------------------------------
'''
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
        return mod_change_dmg_type(string)
    elif is_mod_qualities(string):
        return mod_qualities(string)

    else:
        return None
'''
    

path_crawl(main_mod_path)






