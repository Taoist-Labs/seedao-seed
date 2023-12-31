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

                img = Image.open(f)
                # print(f, img.size, img.mode)
                if img.mode != 'RGB':
                    print("not RGB, ", f, img.size, img.mode)
                    filelist.append(f)
    return filelist

def check_truncated(files):
    for file in files:
        img = Image.open(file)
        try:
            img.load()
        except IOError:
            print("truncated image: ", os.path.basename(file))
            pass

def convert(filename):
    img = Image.open(filename)
    # print(f, img.size, img.mode)
    if img.mode != 'RGB':
        print("not RGB, convert it", filename, img.size, img.mode)
        img = img.convert('RGB')
        img.save(filename)
    else:
        print("RGB, skip", filename, img.size, img.mode)
    img.close()
    pass

def main():
    # files = listFiles('./.tmp/FinalChooseWithStars/')
    files = listFiles('.tmp/FinalDone/png/')
    print(len(files))

    # check_truncated(files)

    pool = Pool(processes=16)
    pool.map(convert, files)
    pool.close()

    pass


if __name__ == '__main__':
    main()
