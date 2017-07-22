import pandas as pd
import numpy as np
from . import database_mngt as db
import scipy.optimize as opt
import sys
import matplotlib.pyplot as plt

def precio_moneda(precio, moneda, quiero = 'HNL', tasa = 23.45):
    if quiero == 'USD': 
        if moneda == 'USD':
            return precio
        else:
            return precio/tasa;
    else: #ej si moneda es None asume que son HNL
        if moneda == 'USD':
            return tasa*precio
        else:
            return precio;

def converter(df,  quiero='HNL'):
    return df.apply(lambda l: precio_moneda(l['precio'], l['moneda']), axis=1)

class ModelQueryFit(object):
    def __init__(self, *args):
        '''
        *args: strings representing a model
        '''
        dat = db.CarDB()
        sql_models = ' or '.join([ "V.model like '%" + k + "%'" for k in args])
        sql_str = ''' select C.precio, C.moneda, V.year, V.model, C.url from CarPriceInfo as C join VehicleModelYear as V on V.id = C.car_id where {} order by V.year asc;'''.format(sql_models)
        dat.open()
        self.df = pd.read_sql(sql_str, con=dat.cnx)
        self.df_conv = self.df.copy()
        self.df_conv['precio'] = converter(self.df)
        dat.close()

    def outliers(self, col='precio'):
        return self.df_conv[self.df[col]>0]

    def npa(self, col):
        '''
        return self as numpy array without outliers
        and values converted to right currency
        '''
        return np.asarray(self.outliers()[col])


    def m(self, x):
        '''
        Evaluation of solution model
        '''
        npsol = self.log_linear_fit()
        return np.exp(npsol[1])*np.exp(npsol[0]*x)

    def log_linear_fit(self):
        car = self.outliers()
        x = self.npa('year')
        y = self.npa('precio')
        y_ln = np.log(y)
        self.T = np.polyfit(x, y_ln, 1)
        return self.T

    def range(self):
        '''
        returns a tuple of advisable upper and lower bounds
        for graphing
        '''
        low = pd.DataFrame.min(self.df_conv['year'])
        upp = pd.DataFrame.max(self.df_conv['year'])
        return (np.floor(low - (upp - low)*0.1 ), np.ceil(upp + (upp - low)*0.1 ))



    def json_to_plot(self, filename=None):
        '''
        json of points that should go in the plot
        if no filename is given returns a pandas dataframe
        '''
        df = self.outliers()
        if filename:
            return  df.to_json(orient='records', path_or_buf=filename)
        else:
            return df.to_json(orient='records') 

    def json_to_curve(self, filename=None):
        '''
        json file to plot fitting curve
        if no filename is given returns a pandas dataframe
        '''
        X = np.arange(*(self.range() + [1.0]))
        Y = self.m(X)
        js = np.append(X[...,np.newaxis],Y[...,np.newaxis],axis=1) 
        js_df = pd.DataFrame(data=js[:,:], columns=['year', 'precio'])
        if filename:
            return js_df.to_json(orient='records', path_or_buf=filename)
        else:
            return js_df.to_json(orient='records')

if __name__ == '__main__':
    print(sys.argv)
    m = ModelQueryFit(*sys.argv[1:])
    npsol = m.log_linear_fit()
    xreg = np.arange(*(m.range() + [1.0]))
    yreg = m.m(xreg)
    x = m.npa('year')
    y = m.npa('precio')
    plt.scatter(x,y)
    plt.plot(xreg,yreg,color='red')
    plt.savefig('/tmp/pic.png')


