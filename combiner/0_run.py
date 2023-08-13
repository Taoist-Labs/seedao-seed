import itertools
import os
import random
import math
from multiprocessing import Pool
from PIL import Image, ImageOps
import json


def load_images(path):
    images = []
    for root, _, files in os.walk(path):
        for fileName in files:
            sufix = fileName.rsplit('.')[1]
            # directory = fileName.rsplit('.')[0]
            if sufix == 'png':
                f = os.path.join(root, fileName)
                # images.append((os.path.basename(fileName), Image.open(f)))
                img = Image.open(f)
                print(f, img.size, img.mode)
                images.append((f, img))
    return images


def load_1_background():
    return load_images('./meta/1.background')


def load_2_body():
    return load_images('./meta/2.body')


def load_3_eye():
    return load_images('./meta/3.eye')


def load_4_star():
    return load_images('./meta/4.star')


def load_5_head():
    return load_images('./meta/5.head')


def load_6_ring():
    return load_images('./meta/6.ring')


def load_7_cloth():
    return load_images('./meta/7.cloth')


def merge_nft(params):
    # merge_metadata(params)
    merge_img(params)
    pass


def merge_metadata(params):
    save_name, _ = params
    name = os.path.splitext(os.path.basename(save_name))[0].split('-', 1)[1]
    print(name)
    n_background, n_body, n_eye, n_star, n_head, n_ring, n_cloth = name.split(
        '#')
    # todo: save metadata
    metadata = {'attributes': [], 'image': "ipfs://"}

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

    # print(metadata)

    with open(f'{save_name}'.replace('.png', '.json'), 'w') as f:
        js = json.dumps(metadata, indent=4)
        # print(js)
        f.write(js)
    pass


def merge_img(params):
    save_name, combination = params
    # print(save_name, combination)
    # im = Image.new('RGBA', (5000, 5000))
    im = Image.new('RGBA', (3000, 3000))

    # 图层顺序从上到下：
    # 7.cloth
    # 6.ring
    # 5.head
    # 4.star
    # 3.eye
    # 2.body
    # 1.background
    background, body, eye, star, head, ring, cloth = combination

    if background is not None:
        im = Image.alpha_composite(im, background)
    if body is not None:
        im = Image.alpha_composite(im, body)
    if eye is not None:
        im = Image.alpha_composite(im, eye)
    if star is not None:
        im = Image.alpha_composite(im, star)
    if head is not None:
        im = Image.alpha_composite(im, head)
    if ring is not None:
        im = Image.alpha_composite(im, ring)
    if cloth is not None:
        im = Image.alpha_composite(im, cloth)

    # ImageOps.scale(im, 1, Image.NEAREST).save(save_name)
    im.save(save_name)
    pass


def dup_list(l, num):
    times = num//len(l)
    remain = num % len(l)
    lll = sum(list(map(lambda n: l[:], range(times))), []) + l[:remain]
    return lll
    pass


def gen_random_comb(backgrounds, bodys, eyes, stars, heads, rings, clothes, directory, num=0):
    if not os.path.exists(directory):
        os.mkdir(directory)

    list_backgrouds = dup_list(backgrounds, num)
    random.shuffle(list_backgrouds)  # backgrounds

    list_bodys = dup_list(bodys, num)
    random.shuffle(list_bodys)  # bodys

    list_eyes_a = dup_list(
        list(filter(lambda n: "3.eye/30" in n[0], eyes)), math.floor(0.3 * num))
    list_eyes_b = dup_list(
        list(filter(lambda n: "3.eye/70" in n[0], eyes)), num - math.floor(0.3 * num))
    list_eyes = list_eyes_a + list_eyes_b
    random.shuffle(list_eyes)  # eyes

    list_stars = dup_list(stars, num)
    random.shuffle(list_stars)  # stars

    list_heads_girl = dup_list(
        list(filter(lambda n: "5.head/girl" in n[0], heads)), math.floor(0.5 * num))
    random.shuffle(list_heads_girl)
    list_heads_man = dup_list(
        list(filter(lambda n: "5.head/man" in n[0], heads)), num - math.floor(0.5 * num))
    random.shuffle(list_heads_man)
    list_heads = list_heads_girl + list_heads_man  # heads

    list_rings = dup_list(rings, math.floor(0.15 * num)) + \
        dup_list([{"", None}], num - math.floor(0.15 * num))
    random.shuffle(list_rings)  # rings

    list_clothes_girls_1 = dup_list(
        list(filter(lambda n: "7.cloth/girl" in n[0], clothes)), math.floor(0.2 * 0.5 * num))  # girls 10% only
    list_clothes_girls_2 = dup_list(
        list(filter(lambda n: "7.cloth/man+girl" in n[0], clothes)), math.floor(0.5 * num) - math.floor(0.2 * 0.5 * num))  # 40%
    list_clothes_girls = list_clothes_girls_1 + list_clothes_girls_2
    random.shuffle(list_clothes_girls)

    list_clothes_man = dup_list(
        list(filter(lambda n: "7.cloth/man+girl" in n[0], clothes)), math.floor(0.5 * num))  # 50%
    random.shuffle(list_clothes_man)
    list_clothes = list_clothes_girls + list_clothes_man  # clothes

    items = []

    for x in range(len(list_backgrouds)):
        n_background, background = list_backgrouds[x]
        n_body, body = list_bodys[x]
        n_eye, eye = list_eyes[x]
        n_star, star = list_stars[x]
        n_head, head = list_heads[x]
        n_ring, ring = list_rings[x]
        n_cloth, cloth = list_clothes[x]

        name = '#'.join(list(map(lambda n: os.path.splitext(os.path.basename(n))
                        [0], [n_background, n_body, n_eye, n_star, n_head, str(n_ring), n_cloth])))

        save_name = os.path.join(
            directory, 'seed-' + name + '.png')
        items.append(
            (save_name, (background, body, eye, star, head, ring, cloth)))
        pass

    print("max number:", len(items))
    return items
    pass


def merge(items):
    pool = Pool(processes=4)
    pool.map(merge_nft, items)
    pool.close()


def main():
    backgrounds = load_1_background()
    bodys = load_2_body()
    eyes = load_3_eye()
    stars = load_4_star()
    heads = load_5_head()
    rings = load_6_ring()
    clothes = load_7_cloth()

    print(len(backgrounds), len(bodys), len(eyes), len(
        stars), len(heads), len(rings), len(clothes))

    # backgrounds, bodys, eyes, starts, heads, rings, clothes
    combinations = gen_random_comb(
        backgrounds, bodys, eyes, stars, heads, rings, clothes, './output', 30)

    print(len(combinations))
    merge(combinations)

    pass


if __name__ == '__main__':
    main()
