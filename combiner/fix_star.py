import itertools
import os
import random
import math
from multiprocessing import Pool
from PIL import Image, ImageOps


def load_wrong_images(path):
    images = []
    filelist = []
    for root, _, files in os.walk(path):
        for fileName in files:
            basename = os.path.basename(fileName)
            sufix = fileName.rsplit('.', 1)[1]
            # directory = fileName.rsplit('.')[0]
            if sufix == 'png' and basename.endswith('_3.png'):
                f = os.path.join(root, fileName)
                filelist.append(f)
    return filelist


def convert(filename):
    img = Image.open(filename)
    # print(f, img.size, img.mode)
    if img.mode != 'RGBA':
        print("not RGBA, convert it", filename, img.size, img.mode)
        img = img.convert('RGBA')
        img.save(filename)
    else:
        print("RGBA, skip", filename, img.size, img.mode)
    img.close()
    pass


def fix_white(wrongImage):
    convert(wrongImage)

    fix(wrongImage, 'meta/4.star/White.png')
    pass


def fix(wrongImage, starName):
    im = Image.new('RGBA', (3000, 3000))

    ss = Image.open(wrongImage)
    print(ss.mode)
    im = Image.alpha_composite(im, ss)
    ss.close()

    star = Image.open(starName)
    im = Image.alpha_composite(im, star)
    star.close()

    im.save(wrongImage)
    im.close()
    pass


def main():

    wrong_images = load_wrong_images('.tmp/FinalDone/png/')

    print(len(wrong_images))

    # Convert wrong images
    pool = Pool(processes=16)
    pool.map(fix_white, wrong_images)
    pool.close()

    pass


if __name__ == '__main__':
    main()
