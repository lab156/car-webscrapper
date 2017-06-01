import pandas as pd
import numpy as np
import database_mngt as db
import scipy.optimize as opt
import sys
import matplotlib.pyplot as plt

class ModelQueryFit(object):
    def __init__(self, *args):
        '''
        *args: strings representing a model
        '''
        dat = db.CarDB()
        sql_models = ' or '.join([ "V.model like '%" + k + "%'" for k in args])
        sql_str = ''' select C.precio, V.year, V.model from CarPriceInfo as C join VehicleModelYear as V on V.id = C.car_id where {} order by V.year asc;'''.format(sql_models)
        dat.open()
        self.df = pd.read_sql(sql_str, con=dat.cnx)
        dat.close()

    def outliers(self, col='precio'):
        return self.df[self.df[col]>0]

    def npa(self, col):
        '''
        return self as numpy array
        '''
        return np.asarray(self.outliers()[col])

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
        low = pd.DataFrame.min(self.df['year'])
        upp = pd.DataFrame.max(self.df['year'])
        return (np.floor(low - (upp - low)*0.1 ), np.ceil(upp + (upp - low)*0.1 ))

    def json_to_plot(self, filename):
        '''
        json of points that should go in the plot
        '''
        return self.outliers().to_json(orient='records', path_or_buf=filename)


if __name__ == '__main__':
    print(sys.argv)
    m = ModelQueryFit(*sys.argv[1:])
    npsol = m.log_linear_fit()
    xreg = np.arange(*m.range(), 1.0)
    yreg = np.exp(npsol[1])*np.exp(npsol[0]*xreg)
    x = m.npa('year')
    y = m.npa('precio')
    plt.scatter(x,y)
    plt.plot(xreg,yreg,color='red')
    plt.savefig('/tmp/pic.png')




