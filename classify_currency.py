import numpy as np
import pandas as pd
from . import database_mngt as db
from sklearn import svm
import time

c = db.CarDB()
#comenzamos jalando las bases de datos
hnl = c.pandas_query('''select C.precio, C.moneda, V.year, V.model from CarPriceInfo as C join VehicleModelYear as V on V.id = C.car_id where C.moneda='HNL' order by rand() limit 30;''')

usd = c.pandas_query("select C.precio, C.moneda, V.year, V.model from CarPriceInfo as C join VehicleModelYear as V on V.id = C.car_id where C.moneda='USD';")

up = usd[usd.precio>0][['precio', 'year']]
hp = hnl[hnl.precio>0][['precio', 'year']]


X = np.concatenate((up,hp)).astype(float)
X[:,0] = np.log(X[:,0]) 

y = [ int(i >= up.shape[0]) for i in range(X.shape[0])]

clf = svm.SVC(kernel='linear')   
clf.fit(X,y)

def run_update():
    all_entries = c.pandas_query('''select C.precio, C.moneda, V.year, V.model, C.IdWeb from CarPriceInfo as C join VehicleModelYear as V on V.id = C.car_id;''')

    pred = lambda p,y :  clf.predict(np.array([np.log(p),y]).reshape(1,-1))

    for e in all_entries[all_entries.precio>0].iterrows():
        if e[1].moneda:
            pass
        else:
            if pred(e[1].precio, e[1].year):
                pass
            else:
                print('cambiar un %s, anio %s, a %s ? (y/n)'%(e[1].model, e[1].year, e[1].precio)) 
                ans = input()
                if ans == 'y':
                    c.update_carpriceinfo('moneda', 'USD', e[1].IdWeb)
    return 0

