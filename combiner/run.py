import itertools
import os
import random
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


def generate_combinations(backgrounds, bodys, eyes, stars, heads, rings, clothes, directory):
    if not os.path.exists(directory):
        os.mkdir(directory)
    combinations = list(itertools.product(backgrounds, bodys, eyes, stars, heads, rings, clothes))

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

        items.append((save_name, (background, body, eye, star, head, ring, cloth)))

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

    print(len(backgrounds), len(bodys), len(eyes), len(stars), len(heads), len(rings), len(clothes))

    # backgrounds, bodys, eyes, starts, heads, rings, clothes
    combinations = generate_combinations(backgrounds, bodys, eyes, stars, heads, rings, clothes, './output')

    random.shuffle(combinations)

    print(len(combinations))

    merge_nft(combinations[:300])

    pass


if __name__ == '__main__':
    main()
