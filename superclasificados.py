from selenium import webdriver as wd
from selenium import common
import database_mngt as datm
import seleniun_mngmt as selm

bro = wd.Chrome('/usr/bin/chromedriver')
bro2 = wd.Chrome('/usr/bin/chromedriver')

con = set()
lis = selm.get_url_list(bro, 'http://www.elheraldo.hn')
db = datm.CarDB()
for url in lis:
    if 'autos' in url:
        con.add(url)
        car = selm.CarMan(url, bro2)
        tit = car.get_model_title()
        precio = car.precio()
        make = car.maker()
        model = car.model()
        year = car.year()
        car_id = db.get_or_add_car_model(make,model,year)

        print('index: %s url: %s %s precio: %s'%(car_id, url.split('/')[4], tit, precio))
    else:
        tit = 'Es una casa'
        precio = ''
   

bro.close()
bro2.close()
