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


def merge_img(params):
    save_name, combination = params
    # print(save_name, combination)
    im = Image.new('RGBA', (5000, 5000))

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

    if num == 0:
        generate_combinations(backgrounds, bodys, eyes,
                              stars, heads, rings, clothes, directory)
    else:
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

        list_rings = dup_list(heads, math.floor(0.15 * num)) + \
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

            save_name = os.path.join(
                directory, 'seed-' + str(10000000+x) + '.png')
            items.append(
                (save_name, (background, body, eye, star, head, ring, cloth)))
            pass

    print("max number:", len(items))
    return items
    pass


def generate_combinations(backgrounds, bodys, eyes, stars, heads, rings, clothes, directory):
    if not os.path.exists(directory):
        os.mkdir(directory)
    combinations = list(itertools.product(
        backgrounds, bodys, eyes, stars, heads, rings, clothes))

    items = []
    for i, combination in enumerate(combinations):
        # save_name = os.path.join(directory, str(10000000+i) + '.png')
        # items.append((save_name, combination))

        _backgrounds, _bodys, _eyes, _stars, _heads, _rings, _clothes = combination

        n_background, background = _backgrounds
        n_body, body = _bodys
        n_eye, eye = _eyes
        n_star, star = _stars
        n_head, head = _heads
        n_ring, ring = _rings
        n_cloth, cloth = _clothes

        save_name = os.path.join(directory, 'seed-' + str(10000000+i) + '.png')

        # handle levels
        if "white.png" not in n_star:
            continue

        # 7.cloth girl vs 5.head man
        if "7.cloth/girl" in n_cloth and "5.head/man" in n_head:
            continue

        # 2.body B and 3.eye B
        if "2.body/B" in n_body and "3.eye/B" not in n_eye:
            continue

        if "2.body/B" not in n_body and "3.eye/B" in n_eye:
            continue

        # 2.body B vs 7.cloth
        if "2.body/B" in n_body:
            n_cloth = ''
            cloth = None

        # print(save_name, n_background, n_body, n_eye, n_star, n_head, n_ring, n_cloth)

        items.append(
            (save_name, (background, body, eye, star, head, ring, cloth)))

    print("max number:", len(items))
    return items


def merge_nft(items):
    pool = Pool(processes=4)
    pool.map(merge_img, items)
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
        backgrounds, bodys, eyes, stars, heads, rings, clothes, './output', 3000)

    print(len(combinations))
    merge_nft(combinations)

    pass


if __name__ == '__main__':
    main()
