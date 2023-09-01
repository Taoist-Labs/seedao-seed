import itertools
import os
import random
import math
from multiprocessing import Pool
from PIL import Image, ImageOps
import json


def loading_wrong_json(path):
    filelist = []
    for root, _, files in os.walk(path):
        for fileName in files:
            sufix = fileName.rsplit('.', 1)[1]
            if sufix == 'json':
                f = os.path.join(root, fileName)
                metadata = json.load(open(f))
                for attr in metadata['attributes']:
                    if attr['value'] == 'Special':
                        filelist.append(f)
                        break
    return filelist

def fix_json(wrong_json):
    metadata = json.load(open(wrong_json))
    
    correct_metadata = {'attributes': [], 'image': "ipfs://"}

    correct_metadata['attributes'].append({
        "trait_type": "Special",
        "value": "Special"
    })

    star = ''
    for attr in metadata['attributes']:
        if attr['trait_type'] == "Tai Chi Star":
            star = attr['value']
            break

    correct_metadata['attributes'].append({
        "trait_type": "Tai Chi Star",
        "value": star
    })

    
    json.dump(correct_metadata, open(wrong_json, 'w'), indent=4)
    pass

def main():

    wrong_jsons = loading_wrong_json('.tmp/FinalDone/json/')

    print(wrong_jsons)

    print(len(wrong_jsons))

    for wrong_json in wrong_jsons:
        fix_json(wrong_json)

    pass


if __name__ == '__main__':
    main()
