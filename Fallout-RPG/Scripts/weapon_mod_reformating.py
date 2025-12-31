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
            files.append(os.path.basename(current_path))
    

def list_files(path):
    return os.listdir(path)

path_crawl(main_mod_path)
print(files)