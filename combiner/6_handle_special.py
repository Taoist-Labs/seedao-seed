import itertools
import os
import random
import math
from PIL import Image
import json
import shutil


def load_images(path):
    images = []
    for root, _, files in os.walk(path):
        for fileName in files:
            print(fileName)
            sufix = fileName.rsplit('.', 1)[1]
            # directory = fileName.rsplit('.')[0]
            if sufix == 'png':
                f = os.path.join(root, fileName)
                # images.append((os.path.basename(fileName), Image.open(f)))
                print(f)
                # img = Image.open(f)
                # print(f, img.size, img.mode)
                images.append((f, None))
            else:
                print('ignore', fileName)
    return images


def load_stars(path):
    images = []
    for root, _, files in os.walk(path):
        for fileName in files:
            print(fileName)
            sufix = fileName.rsplit('.', 1)[1]
            # directory = fileName.rsplit('.')[0]
            if sufix == 'png':
                f = os.path.join(root, fileName)
                # images.append((os.path.basename(fileName), Image.open(f)))
                # img = Image.open(f)
                # print(f, img.size, img.mode)
                images.append((f, None))
            else:
                print('ignore', fileName)
    return images


def add_star(params):
    save_name, combination = params

    im = Image.new('RGBA', (3000, 3000))

    backgroundName, starFileName = combination

    if backgroundName is not None:
        background = Image.open(backgroundName)
        im = Image.alpha_composite(im, background)
        background.close()
    if starFileName is not None:
        star = Image.open(starFileName)
        im = Image.alpha_composite(im, star)
        star.close()

    # ImageOps.scale(im, 1, Image.NEAREST).save(save_name)
    im.save(save_name)
    im.close()
    pass


def dup_list(l, num):
    times = num//len(l)
    remain = num % len(l)
    lll = sum(list(map(lambda n: l[:], range(times))), []) + l[:remain]
    return lll
    pass


def gen_comp(nfts, star_, directory):
    if not os.path.exists(directory):
        os.mkdir(directory)

    items = []

    for x in range(len(nfts)):
        n_nft, nft = nfts[x]
        n_star, _ = star_

        name = os.path.splitext(n_nft)[0].split('-', 1)[1]
        print(name)

        name = '#'.join(
            list(map(lambda n: os.path.splitext(os.path.basename(n))[0], [name, n_star])))

        save_name = os.path.join(directory, 'seed-' + name + '.png')
        items.append((save_name, (n_nft, n_star)))
        pass

    print("max number:", len(items))
    return items
    pass


def add_stars(nfts, stars):
    pass


def gen_metadata(params):
    save_name, _ = params
    name = os.path.splitext(os.path.basename(save_name))[0].split('-', 1)[1]

    _, n_star = name.split('#')

    # todo: save metadata
    metadata = {'attributes': [], 'image': "ipfs://"}

    metadata['attributes'].append({
        "trait_type": "Background",
        "value": "Special"
    })

    metadata['attributes'].append({
        "trait_type": "Body",
        "value": "Special"
    })

    metadata['attributes'].append({
        "trait_type": "Eyes",
        "value": "Special"
    })

    metadata['attributes'].append({
        "trait_type": "Tai Chi Star",
        "value": n_star.title()
    })

    metadata['attributes'].append({
        "trait_type": "Head",
        "value": "Special"
    })

    metadata['attributes'].append({
        "trait_type": "Ear",
        "value": "Special"
    })

    metadata['attributes'].append({
        "trait_type": "Style",
        "value": "Special"
    })

    with open(f'{save_name}'.replace('.png', '.json'), 'w') as f:
        js = json.dumps(metadata, indent=4)
        # print(js)
        f.write(js)
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


def rename(params, srcPath, outPath):
    save_name, _ = params
    name = os.path.splitext(os.path.basename(save_name))[0].split('-', 1)[1]

    nnn, n_star = name.split('#')
    new_name = nnn
    if n_star == 'Red':
        new_name = nnn + '_1'
    elif n_star == 'Green':
        new_name = nnn + '_2'
    elif n_star == 'White':
        new_name = nnn + '_3'
    elif n_star == 'Purple':
        new_name = nnn + '_4'
    elif n_star == 'Blue':
        new_name = nnn + '_5'
    else:
        print('error, invlid name ', n_star)
        return

    rename_nft('seed-' + name, new_name, srcPath, outPath)
    pass


def main():

    imagePath = './.tmp/FinalSpecials/'
    starPath = './meta/4.star/'

    addedStarPath = './.tmp/FinalSpecialsWithStars/'
    
    renamedPath = './.tmp/FInalSpecialsDone/'

    nfts = load_images(imagePath)
    stars = load_stars(starPath)

    print(len(nfts), len(stars))

    for star in stars:
        # nft, star
        combinations = gen_comp(nfts, star, addedStarPath)

        # 1. add stars
        list(map(lambda item: add_star(item), combinations))

        # 2. gen meta
        list(map(lambda item: gen_metadata(item), combinations))

        # 3. rename
        list(map(lambda item: rename(item, addedStarPath, renamedPath), combinations))
        pass

    pass


if __name__ == '__main__':
    main()
