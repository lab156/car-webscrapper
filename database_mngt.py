import mysql.connector as sql
from datetime import date, datetime
#import seleniun_mngmt  as SelMan
from . import db_info
import pandas as pd

DB = db_info.DB_info()

class CarDB(object):
    def __init__(self, *args, **kwargs):
        self.user = kwargs.get('user', DB.user)
        self.password = kwargs.get('password', DB.passw)
        self.database = kwargs.get('database', DB.database)

        self.cnx = sql.connect(user=self.user,
                password=self.password,
                database=self.database)
        self.cursor = self.cnx.cursor()

        table_def = '''
        CREATE TABLE `CarPriceInfo` (
        `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
        `url` VARCHAR(1000) NOT NULL,
        `IdWeb` VARCHAR(50) NULL UNIQUE,
        `precio` INT UNSIGNED NULL,
        `moneda` enum('HNL', 'USD') NULL,
        `car_id` INT UNSIGNED NOT NULL, 
        `ubicacion` VARCHAR(200),
        `condicion` enum('used', 'new', 'scrap') NULL,
        `kms` INT UNSIGNED NULL,
        `cilindraje` INT UNSIGNED NULL,
        `color` VARCHAR(200) NULL,
        `transmision` enum('auto', 'mecan', 'trip') NULL,
        `carburacion` enum('gasol', 'diesel', 'gas_licuado', 'hibrido') NULL,
        `tipo` enum('Pickup', 'Turismo', 'Convertible', 'Busito', 'SUV') NULL,
        `fecha_pub` date NULL,
        `fecha_creacion` datetime NOT NULL,
        FOREIGN KEY (car_id) REFERENCES VehicleModelYear(`id`),
	 PRIMARY KEY (`id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
         '''

        try:
         self.cursor.execute(table_def)
        except sql.Error as err:
         if err.errno == sql.errorcode.ER_TABLE_EXISTS_ERROR:
             print("ya existe la tabla")
         else:
             print(err.msg)
        else:
         print("Creando la tabla CarPriceInfo")

        self.cursor.close()
        self.cnx.close()

    def open(self):
        self.cnx = sql.connect(user=self.user,
                password=self.password,
                database=self.database)
        self.cursor = self.cnx.cursor()
        return None

    def close(self):
        self.cursor.close()
        self.cnx.close()


    def create_entry(self, **kwargs):
        keys_lst = list(kwargs.keys())
        values_lst = list(kwargs.values())
        str_lst = ['%s']


#        precio = kwargs.get('precio', None)
#        if precio:
#            keys_lst.append('precio')
#            values_lst.append(precio)

        self.open()
        add_car_price = ''' INSERT INTO `CarPriceInfo` ( %s ) VALUES 
         ( %s );'''%(', '.join(keys_lst), ', '.join(len(values_lst)*str_lst))
        try:
            self.cursor.execute(add_car_price, values_lst)
            self.cnx.commit()
        except sql.errors.IntegrityError:
            print('Repetido...')

        self.close()

    def check_idweb(self, idweb):
        '''
        Checks if entry with given idweb already exists in database
        '''
        self.open()
        lookup_sql = '''SELECT id FROM CarPriceInfo WHERE IdWeb=( %s );'''
        self.cursor.execute(lookup_sql, (idweb,))
        result_lst = [ Id for Id in self.cursor ]
        self.close()
        if result_lst:
            return True
        else:
            return False



    def lookup_carId(self, make, model, year):
        self.open()
        lookup_sql = '''SELECT id FROM VehicleModelYear WHERE make=( %s ) AND model=( %s ) AND year=( %s );'''
        lookup_values = (make, model, year)
        self.cursor.execute(lookup_sql, lookup_values)
        result_list = [ Id for Id in self.cursor ]
        self.close()
        if result_list:
            return result_list[0][0]
        else:
            return None


    def get_or_add_car_model(self, make, model, year):
        #First check if the car Id does not exist yet
        search_res = self.lookup_carId(make, model, year)
        if search_res:
            return search_res
        else:
            insert_sql = '''insert into VehicleModelYear (make, model, year) values ( %s, %s, %s );'''
            self.open()
            self.cursor.execute(insert_sql, (make, model, year))
            self.cnx.commit()

            self.close()
            return self.lookup_carId(make, model, year)

    def count_by_model(self, cnt_limit=20):
        '''
        returns df with the models having the largest number of instances
        '''
        sql_query = '''select  V.make, V.model, count(C.id) as res_count from CarPriceInfo as C join VehicleModelYear as V on V.id = C.car_id group by V.model having count(C.id)>{} order by count(C.id) desc;'''
        self.open()
        df_res = pd.read_sql(sql_query.format(cnt_limit, self.cnx), con=self.cnx)
        self.close()
        return df_res.to_dict(orient='records')

    def pandas_query(self, query):
        '''
        Make a general query with pandas
        '''
        self.open()
        df_res = pd.read_sql(query, con=self.cnx)
        self.close()
        return df_res

    def update_carpriceinfo(self, column, value, where):
        '''
        updates the CarPriceInfo database where column is the 
        value to be updated and where is the identifier
        '''
        sql_state = '''UPDATE CarPriceInfo SET {} = %s WHERE IdWeb = %s;'''.format(column)
        self.open()
        self.cursor.execute(sql_state, (value, where))
        self.cnx.commit()
        self.close()
        return sql_state


class SC(object):
    def __init__(self, url, **kwargs):
        self.url = url
        if self.check():
            split_url = self.url.split('/')
            self.id_web = split_url[4]

    def check(self):
        '''
        checks if url is indeed from superclasificados webpage
        '''
        return 'superclasificados' in self.url


