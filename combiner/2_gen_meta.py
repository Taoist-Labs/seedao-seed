import itertools
import os
import random
import math
import json
from multiprocessing import Pool
from PIL import Image, ImageOps


def load_images(path):
    images = []
    for root, _, files in os.walk(path):
        for fileName in files:
            sufix = fileName.rsplit('.')[1]
            # directory = fileName.rsplit('.')[0]
            if sufix == 'png':
                f = os.path.join(root, fileName)
                # images.append((os.path.basename(fileName), Image.open(f)))
                img = Image.open(f)
                print(f, img.size, img.mode)
                images.append((f, None))
    return images


def gen_metadata(params):
    save_name, _ = params
    name = os.path.splitext(os.path.basename(save_name))[0].split('-', 1)[1]
    print(name)
    # n_background, n_body, n_eye, n_star, n_head, n_ring, n_cloth = name.split(
    #     '#')
    n_background, n_body, n_eye, n_star, n_head, n_ring, n_cloth = '', '', '', '', '', '', ''
    splited = name.split('#')
    if len(splited) == 6:
        n_background, n_body, n_eye, n_star, n_head, n_cloth = splited
    else:
        n_background, n_body, n_eye, n_star, n_head, n_ring, n_cloth = splited

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


def gen(items):
    pool = Pool(processes=4)
    pool.map(gen_metadata, items)
    pool.close()


def main():
    # nfts = load_images('./output')
    nfts = load_images('./.tmp/520WithStars/')

    print(len(nfts))

    gen(nfts)
    pass


if __name__ == '__main__':
    main()
