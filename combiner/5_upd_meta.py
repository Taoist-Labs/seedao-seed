import itertools
import os
import random
import math
import json
from multiprocessing import Pool
from PIL import Image, ImageOps

# Need update json metadata

def load_jsons(path):
    jsons = []
    for root, _, files in os.walk(path):
        for fileName in files:
            sufix = fileName.rsplit('.', 1)[1]
            if sufix == 'json':
                f = os.path.join(root, fileName)
                jsons.append(f)
    return jsons

def update_metadatas(jsonFiles, cid):
    for file in jsonFiles:
        name = os.path.splitext(os.path.basename(file))[0]
        metadata = json.load(open(file))
        metadata['image'] = 'ipfs://' + cid + '/' + name + '.png'
        # print(meta)
        with open(file, 'w+') as f:
            js = json.dumps(metadata, indent=4)
            # print(js)
            f.write(js)

    pass

def main():
    cid = 'bafybeihwciazjns5wjehd3464ipqzxn2kzutazj2ovk3bol4oxjvpcl5za'
    jsons = load_jsons('./.tmp/FinalDone/json/')

    print(len(jsons))

    update_metadatas(jsons, cid)
    pass


if __name__ == '__main__':
    main()
