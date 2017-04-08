import mysql.connector as sql
from datetime import date, datetime
#import seleniun_mngmt  as SelMan
import db_info

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
        `url` VARCHAR(200) NOT NULL,
        `IdWeb` VARCHAR(50) NULL UNIQUE,
        `precio` INT UNSIGNED NULL,
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
        keys_lst = kwargs.keys()
        values_lst = kwargs.values()
        str_lst = ['%s']


        precio = kwargs.get('precio', None)
        if precio:
            keys_lst.append('precio')
            values_lst.append(precio)

        self.open()
        add_car_price = ''' INSERT INTO `CarPriceInfo` ( %s ) VALUES 
         ( %s )'''%(', '.join(keys_lst), ', '.join(len(values_lst)*str_lst))
        self.cursor.execute(add_car_price, values_lst)
        self.cnx.commit()
        self.close()

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


