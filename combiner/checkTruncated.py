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


def check_truncated(file):
    img = Image.open(file)
    try:
        img.load()
    except IOError:
        print("truncated image: ", os.path.basename(file))
        pass


def main():
    files = listFiles('./.tmp/FinalDone/png/')
    print(len(files))

    pool = Pool(processes=10)
    pool.map(check_truncated, files)
    pool.close()
    pass


if __name__ == '__main__':
    main()
