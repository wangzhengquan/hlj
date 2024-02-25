import os
import string
from urllib.request import urlopen
import urllib.request 
 
# url = 'http://p0.static.helijia.cn/zmw/upload/20240108/3b186851020449f2a7986c0e86c10de1!460'

def download(dist, url):
    # name_index = len(url) - url[::-1].index('/')
    name_index = url.rfind('/') + 1
    dir = url[url.find('upload/') : name_index]
    name = url[name_index:]
    dist = dist + '/' + dir
    if not os.path.exists(dist):
        os.makedirs(dist)
    print( dist + name)  
    urllib.request.urlretrieve(url, dist + name) 

def download2(url):
    # Opening a new file named img with extension .jpg 
    # This file would store the data of the image file 
    f = open('2.jpeg','wb') 
    
    # Storing the image data inside the data variable to the file 
    f.write(urlopen(url).read()) 
    f.close() 

barse_url = 'http://p0.static.helijia.cn/zmw/'
def download_rec(dist, data):
    if type(data) is str:
        # print(data)
        if data.find('upload/') >= 0:
            download(dist, barse_url+data)
            return 1
        else:
            return 0
    elif type(data) is list:
        count = 0
        for v in data:
            count += download_rec(dist, v)
        return count
    elif type(data) is dict:
        count = 0
        for k in data:
            count += download_rec(dist, data[k])
        return count
    else:
        return 0


data_str = open('data.json', 'r').read().strip()
data_str = data_str.replace('true', 'True').replace('false', 'False')
data = eval(data_str)
total = download_rec('../src', data)
print("download:", total)

# if os.path.exists(path):
#     return open('shakespeare.txt', encoding='ascii').read().split()
# else:
#     shakespeare = urlopen(url)
#     return shakespeare.read().decode(encoding='ascii').split()
