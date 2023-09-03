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


def list_base_images(path, size, save_path):
    images = []
    for root, _, files in os.walk(path):
        for fileName in files:
            basename = os.path.basename(fileName)
            sufix = fileName.rsplit('.', 1)[1]
            if sufix == 'png' and basename.endswith('_1.png'):
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
            # print(fileName)
            basename = os.path.basename(fileName)
            sufix = fileName.rsplit('.', 1)[1]
            if sufix == 'json' and basename.endswith('_1.json'):
                name = os.path.splitext(os.path.basename(fileName))[
                    0].split('_', 1)[0]
                print(name)

                data = json.load(open(os.path.join(root, fileName)))
                metadata = {
                    'attributes': data['attributes'], 'image': "ipfs://"}

                image_list.append({
                    'name': "Seed #"+name,
                    'metadata': metadata,
                    'image': os.path.join(img_base_url, urllib.parse.quote(basename.replace('_1.json', '_1.png'))),
                    'thumb': os.path.join(img_base_url, urllib.parse.quote('thumb-'+basename.replace('_1.json', '_1.png')))
                })

    with open(os.path.join(save_path, 'nfts.json'), 'w') as f:
        json.dump(image_list, f, indent=4)
    pass


def main():

    # images = list_base_images('./.tmp/FinalDone', 750, './.tmp/FinalRes')

    # pool = Pool(processes=10)
    # pool.map(scale_image, images)
    # pool.close()

    get_res_json('./.tmp/FinalDone/', './.tmp/',
                 'https://raw.githubusercontent.com/Taoist-Labs/test-res/main/nfts/')
    pass


if __name__ == '__main__':
    main()
