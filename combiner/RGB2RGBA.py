import itertools
import os
import random
import math
from multiprocessing import Pool
from PIL import Image, ImageOps


def listFiles(path):
    filelist = []
    for root, _, files in os.walk(path):
        for fileName in files:
            sufix = fileName.rsplit('.', 1)[1]
            # directory = fileName.rsplit('.')[0]
            if sufix == 'png':
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

def main():
    files = listFiles('./.tmp/FinalSpecials/')
    print(len(files))

    pool = Pool(processes=16)
    pool.map(convert, files)
    pool.close()

    pass


if __name__ == '__main__':
    main()
