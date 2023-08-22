import itertools
import os
import random
import math
from multiprocessing import Pool
from PIL import Image, ImageOps


def load_images(path):
    images = []
    for root, _, files in os.walk(path):
        for fileName in files:
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

        name = os.path.splitext(n_nft)[0].split('-')[1]
        # print(name)

        # n_background, n_body, n_eye, _, n_head, n_ring, n_cloth = name.split(
        #     '#')
        n_background, n_body, n_eye, _, n_head, n_ring, n_cloth = '', '', '', '', '', '', ''

        splited = name.split('#')
        if len(splited) == 6:
            n_background, n_body, n_eye, _, n_head, n_cloth = splited
        else:
            n_background, n_body, n_eye, _, n_head, n_ring, n_cloth = splited

        name = '#'.join(list(map(lambda n: os.path.splitext(os.path.basename(n))
                        [0], [n_background, n_body, n_eye, n_star, n_head, n_ring, n_cloth])))

        save_name = os.path.join(directory, 'seed-' + name + '.png')
        items.append((save_name, (n_nft, n_star)))
        pass

    print("max number:", len(items))
    return items
    pass


def merge(items):
    pool = Pool(processes=10)
    pool.map(add_star, items)
    pool.close()


def main():
    # nfts = load_images('./.tmp/FinalChoose/')
    # stars = load_stars('./meta/4.star/')
    nfts = load_images('/Volumes/“RAMDisk”/FinalChoose')
    stars = load_stars('/Volumes/“RAMDisk”/4.star')

    print(len(nfts), len(stars))

    print(stars)

    for star in stars:
        # nft, star
        combinations = gen_comp(nfts, star, '/Volumes/“RAMDisk”/FinalChooseWithStars/')
        merge(combinations)

        # list(map(lambda item: add_star(item), combinations))
        pass

    pass


if __name__ == '__main__':
    main()
