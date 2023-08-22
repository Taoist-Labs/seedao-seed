import itertools
import os
import random
import math
import json
from multiprocessing import Pool
from PIL import Image, ImageOps

# Need update json metadata

def load_jsons(path):
    jsons = []
    for root, _, files in os.walk(path):
        for fileName in files:
            sufix = fileName.rsplit('.')[1]
            if sufix == 'json':
                f = os.path.join(root, fileName)
                jsons.append(f)
    return jsons


def gen_metadata(params):
    save_name, _ = params
    name = os.path.splitext(os.path.basename(save_name))[0].split('-', 1)[1]
    print(name)
    n_background, n_body, n_eye, n_star, n_head, n_ring, n_cloth = name.split(
        '#')
    # todo: save metadata
    metadata = {'attributes': [], 'image': "ipfs://"}

    if len(n_background) > 0:
        metadata['attributes'].append({
            "trait_type": "Background",
            "value": n_background
        })

    if len(n_body) > 0:
        metadata['attributes'].append({
            "trait_type": "Body",
            "value": n_body
        })

    if len(n_eye) > 0:
        metadata['attributes'].append({
            "trait_type": "Eyes",
            "value": n_eye
        })

    if len(n_star) > 0:
        metadata['attributes'].append({
            "trait_type": "Tai Chi Star",
            "value": n_star
        })

    if len(n_head) > 0:
        metadata['attributes'].append({
            "trait_type": "Head",
            "value": n_head
        })

    if len(n_ring) > 0:
        metadata['attributes'].append({
            "trait_type": "Ear",
            "value": n_ring
        })

    if len(n_cloth) > 0:
        metadata['attributes'].append({
            "trait_type": "Style",
            "value": n_cloth
        })

    # print(metadata)

    with open(f'{save_name}'.replace('.png', '.json'), 'w') as f:
        js = json.dumps(metadata, indent=4)
        # print(js)
        f.write(js)
    pass


def updateJsons(jsonFiles, cid):
    for file in jsonFiles:
        name = os.path.splitext(os.path.basename(file))[0]
        metadata = json.load(open(file))
        metadata['image'] = 'ipfs://' + cid + '/' + name + '.png'
        # print(meta)
        with open(file, 'w+') as f:
            js = json.dumps(metadata, indent=4)
            # print(js)
            f.write(js)

    pass

def main():
    cid = 'bafybeif7zcefrblohgf5tde3eh2g4pkieg25ym7fdklrv5kqlyftxcbwlu'
    jsons = load_jsons('./.tmp/520done/json/')

    print(len(jsons))

    updateJsons(jsons, cid)
    pass


if __name__ == '__main__':
    main()
