#
# 3_gen_res.py:
# This script is used to generate thumbnail and metadata for each image.
# The outputs are:
# 1. thumbnail image and scaled image - 750px
# 2. nfts.json - metadata for each image
#
# The input is the folder of images, which is the output of 2_gen_meta.py

import itertools
import os
import random
import math
import json
from multiprocessing import Pool
from PIL import Image, ImageOps
import urllib.parse


def list_images(path, size, save_path):
    images = []
    for root, _, files in os.walk(path):
        for fileName in files:
            sufix = fileName.rsplit('.', 1)[1]
            if sufix == 'png':
                f = os.path.join(root, fileName)
                s = os.path.join(save_path, fileName)
                images.append((f, size, save_path))
    return images
    pass

def scale_image(param):
    file, size, save_path = param
    fileName = os.path.basename(file)
    s = os.path.join(save_path, fileName)
    img = Image.open(file)
    print(file, s, img.size, img.mode)
    # ImageOps.scale(img, size/img.size[0], Image.NEAREST).save(s)
    ImageOps.scale(img, size/img.size[0]).save(s)
    img.thumbnail((230, 230))  # gen thumbnail
    img.save(os.path.join(save_path, 'thumb-'+fileName))
    pass


def get_res_json(path, save_path, img_base_url='./'):
    image_list = []
    for root, _, files in os.walk(path):
        for fileName in files:
            sufix = fileName.rsplit('.', 1)[1]
            prefix = os.path.splitext(os.path.basename(fileName))[0]
            if sufix == 'png' and not prefix.startswith('thumb-'):
                name = os.path.splitext(os.path.basename(fileName))[
                    0].split('-', 1)[1]
                print(name)

                n_background, n_body, n_eye, n_star, n_head, n_ring, n_cloth = '', '', '', '', '', '', ''
                splited = name.split('#')

                # todo: save metadata
                metadata = {'attributes': [], 'image': "ipfs://"}
                
                if len(splited) < 6:
                    metadata['attributes'].append({
                            "trait_type": "Special",
                            "value": "Special"
                        })
                else: 
                    if len(splited) == 6:
                        n_background, n_body, n_eye, n_star, n_head, n_cloth = splited
                    else:
                        n_background, n_body, n_eye, n_star, n_head, n_ring, n_cloth = splited

                    

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

    images = list_images('./.tmp/FinalSpecials', 750, './.tmp/FinalRes')

    pool = Pool(processes=10)
    pool.map(scale_image, images)
    pool.close()

    get_res_json('./.tmp/FinalRes', './.tmp/',
                 'https://raw.githubusercontent.com/Taoist-Labs/test-res/main/nfts/')
    pass


if __name__ == '__main__':
    main()
