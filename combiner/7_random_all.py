import itertools
import os
import random
import math
import json
from multiprocessing import Pool
from PIL import Image, ImageOps
import shutil


# Need mapping stars to levels
# Red L0-L1
# Green L2-L3
# White - L4-L5
# Purple - L6-L7
# Blue - L8-L9

def load_nfts(path):
    nfts = []
    for root, _, files in os.walk(path):
        for fileName in files:
            sufix = fileName.rsplit('.', 1)[1]
            if sufix == 'png':
                f = os.path.join(root, fileName)
                nfts.append(f)
    return nfts


def filterNames(fileList):
    filteredNames = []
    for file in fileList:
        filteredName = os.path.splitext(os.path.basename(file))[0].rsplit('_', 1)[0]
        if filteredName not in filteredNames:
            filteredNames.append(filteredName)
    return filteredNames


def rename_nfts(randomList, srcPath, outPath):
    idx = 0
    for _name in randomList:
        # Need mapping stars to levels
        # Red L0-L1
        # Green L2-L3
        # White - L4-L5
        # Purple - L6-L7
        # Blue - L8-L9

        l1_name = _name + '_1'
        nl1_name = str(idx) + '_1'
        rename_nft(l1_name, nl1_name, srcPath, outPath)

        l2_name = _name + '_2'
        nl2_name = str(idx) + '_2'
        rename_nft(l2_name, nl2_name, srcPath, outPath)

        l3_name = _name + '_3'
        nl3_name = str(idx) + '_3'
        rename_nft(l3_name, nl3_name, srcPath, outPath)

        l4_name = _name + '_4'
        nl4_name = str(idx) + '_4'
        rename_nft(l4_name, nl4_name, srcPath, outPath)

        l5_name = _name + '_5'
        nl5_name = str(idx) + '_5'
        rename_nft(l5_name, nl5_name, srcPath, outPath)

        idx += 1
        pass


def rename_nft(rawName, newName, srcPath, outPath):
    if not os.path.exists(outPath):
        os.mkdir(outPath)
        os.mkdir(os.path.join(outPath, 'png'))
        os.mkdir(os.path.join(outPath, 'json'))

    src = os.path.join(srcPath, rawName + '.png')
    dst = os.path.join(outPath, 'png', newName + '.png')
    shutil.copyfile(src, dst)

    src = os.path.join(srcPath, rawName + '.json')
    dst = os.path.join(outPath, 'json', newName + '.json')
    shutil.copyfile(src, dst)
    pass


def main():
    src = './.tmp/FinalDone/'
    out = './.tmp/FinalDone/'
    nfts = load_nfts(src)

    print(len(nfts))

    filteredNames = filterNames(nfts)

    random.shuffle(filteredNames)
    random.shuffle(filteredNames)

    rename_nfts(filteredNames, src, out)

    pass


if __name__ == '__main__':
    main()
