import itertools
import os
import random
import math
import json
from multiprocessing import Pool
from PIL import Image, ImageOps

# Need mapping stars to levels
# Red L0-L1
# Green L2-L3
# White - L4-L5
# Purple - L6-L7
# Blue - L8-L9

def load_images(path):
    images = []
    for root, _, files in os.walk(path):
        for fileName in files:
            sufix = fileName.rsplit('.')[1]
            # directory = fileName.rsplit('.')[0]
            if sufix == 'png':
                f = os.path.join(root, fileName)
                # images.append((os.path.basename(fileName), Image.open(f)))
                # img = Image.open(f)
                # print(f, img.size, img.mode)
                images.append((f, None))
    return images

def main():
    nfts = load_images('./output')

    print(len(nfts))

    pass


if __name__ == '__main__':
    main()
