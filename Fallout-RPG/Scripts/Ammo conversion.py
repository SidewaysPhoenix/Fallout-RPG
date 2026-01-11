import os
import sys
import re

dir_path = os.path.dirname(os.path.realpath(__file__))
main_mod_path = os.path.join(dir_path, "Weapons") 


Weapon_Ammo_Associations = {}
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
            NameAmmo_from_file = file_parser(current_path)
            
            if NameAmmo_from_file[0] in Weapon_Ammo_Associations:
                previous_entry = Weapon_Ammo_Associations[NameAmmo_from_file[0]]
                Weapon_Ammo_Associations[NameAmmo_from_file[0]] = (f"{previous_entry} / {NameAmmo_from_file[1]}")
            else:
                Weapon_Ammo_Associations[NameAmmo_from_file[0]] = NameAmmo_from_file[1]


def list_files(path):
    return os.listdir(path)



def file_parser(file_to_read): #return [Ammo, Name]
    file = open(file_to_read, "r", encoding="utf-8")
    content = file.read()
    content = content.strip()
    line_list = content.split("\n")
    captured_name = ""
    captured_ammo = ""
    content_rebuild_list = []
    content_rebuild_list.append("```statblock") #apply starter codeblock backticks
    for i in range(1, len(line_list)-1):
        if line_list[i].startswith("name:"):
            content_rebuild_list.append(line_list[i])
            name_to_pass = line_list[i].replace("name: ", "").strip('"')
            if name_to_pass == "":
                continue
            else:
                captured_name = name_to_pass
                
        elif line_list[i].startswith("ammo:"):
            content_rebuild_list.append(line_list[i])
            ammo_to_pass = line_list[i].replace("ammo: ", "").strip('"')
            if ammo_to_pass == "":
                captured_ammo = "N/A"
            else:
                captured_ammo = ammo_to_pass
        
        else:
            content_rebuild_list.append(line_list[i])
    
    if captured_ammo == "":
        captured_ammo = "No Ammo"

    content_rebuild_list.append("```") #reapply codeblock backticks
    content_rebuild = '\n'.join(content_rebuild_list)    
    print(content_rebuild)
    #with open(file_to_read, "w", encoding="utf-8") as f:
        #f.write(content_rebuild)    
    file.close()
    return [captured_ammo, captured_name]

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

for i in sorted(Weapon_Ammo_Associations):
    print(f"{i}: {Weapon_Ammo_Associations[i]}\n")

#print(Weapon_Ammo_Associations)





