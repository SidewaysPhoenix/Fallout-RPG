import os
import sys

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
    
    line_list = content.split("\n")
    if line_list[0].startswith("```"):
        print("start good")
    else:
        raise Exception(f"Statblock start {os.path.basename(file_to_read)} invalid")
    if line_list[-1].endswith("```"):
        print("end good")
    else:
        raise Exception(f"Statblock end {os.path.basename(file_to_read)} invalid")

    for i in range(1, len(line_list)):
        print(line_list[i])
        
    file.close()

path_crawl(main_mod_path)




