from selenium import webdriver as wd
from selenium import common
import database_mngt as datm
import seleniun_mngmt as selm
import datetime as dt

bro = wd.Chrome('/usr/bin/chromedriver')

lis = selm.get_url_list(bro, 'http://www.elheraldo.hn')
db = datm.CarDB()

def visitar(url, bro2, db):
    try:
        car = selm.CarMan(url, bro2)
    except common.exceptions.NoSuchElementException:
        print('Timeout en la url: %s '%url)
        return []
    except KeyError:
        print('Hubo KeyError en CarMan, la url: %s talves no sea de un carro'%url)
        return []

    tit = car.get_model_title()
    precio = car.precio()
    make = car.maker()
    model = car.model()
    year = car.year()
    car_id = db.get_or_add_car_model(make,model,year)

    print('index: %s url: %s %s precio: %s'%(car_id, url.split('/')[4], tit, precio))
    db.create_entry(url = url,
            IdWeb = int(car.IdWeb()),
            precio = car.precio(),
            car_id = car_id,
            ubicacion = car.ubicacion(),
            condicion = car.condicion(),
            kms = car.kms(),
            cilindraje = car.cilindraje(),
            color = car.color(),
            transmision = car.transmision(),
            carburacion = car.carburacion(),
            fecha_pub = car.fecha_pub(),
            fecha_creacion = dt.date.today(),
            tipo = car.tipo())
    return selm.get_url_list(bro, url)

def recur_engine(url, url_lst, bro, db):
    if 'autos' in url:
        idweb = int(url.split('/')[4])
        if db.check_idweb(idweb):
            return 0
        else:
            for _url in url_lst:
                _url_lst = selm.get_url_list(bro, _url)
                visitar(_url, bro, db)
                return recur_engine(_url, _url_lst, bro, db)
            
while len(lis)>0:
    print('long. de la lista de urls: %s'%len(lis))
    url = lis.pop()
    if 'autos' in url:
        idweb = int(url.split('/')[4])
        if db.check_idweb(idweb):
            print('YALA!')
        else:
            url_lst = visitar(url, bro, db)
            lis += url_lst


            
bro.close()
