import itertools
import os
import random
import math
import json
from multiprocessing import Pool
from PIL import Image, ImageOps
import urllib.parse


def scale_images(path, size, save_path):
    for root, _, files in os.walk(path):
        for fileName in files:
            sufix = fileName.rsplit('.')[1]
            if sufix == 'png':
                f = os.path.join(root, fileName)
                s = os.path.join(save_path, fileName)
                img = Image.open(f)
                print(f, s, img.size, img.mode)
                # ImageOps.scale(img, size/img.size[0], Image.NEAREST).save(s)
                ImageOps.scale(img, size/img.size[0]).save(s)
                img.thumbnail((230, 230))  # gen thumbnail
                img.save(os.path.join(save_path, 'thumb-'+fileName))
    pass


def get_res_json(path, save_path, img_base_url='./'):
    image_list = []
    for root, _, files in os.walk(path):
        for fileName in files:
            sufix = fileName.rsplit('.')[1]
            if sufix == 'png':
                name = os.path.splitext(os.path.basename(fileName))[
                    0].split('-', 1)[1]
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

                image_list.append({
                    'name': "Seed ????",
                    'metadata': metadata,
                    'image': os.path.join(img_base_url, urllib.parse.quote(fileName)),
                    'thumb': os.path.join(img_base_url, urllib.parse.quote('thumb-'+fileName))
                })

    with open(os.path.join(save_path, 'nfts.json'), 'w') as f:
        json.dump(image_list, f, indent=4)
    pass


def main():

    scale_images('./output', 750, './.tmp/result')

    get_res_json('./.tmp/result', './.tmp/',
                 'https://raw.githubusercontent.com/Taoist-Labs/test-res/main/nfts/')
    pass


if __name__ == '__main__':
    main()
