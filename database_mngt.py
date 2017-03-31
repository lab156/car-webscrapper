import mysql.connector as sql
from datetime import date, datetime
import sc_update_monitor as monitor
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
        `IdWeb` VARCHAR(50) NULL,
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

    def create_entry(self, car_id, url, **kwargs):
        names_lst = ['car_id', 'url', 'fecha_creacion']
        values_lst = [car_id,  url, datetime.now()]
        str_lst = ['%s']

        is_superclasif = SC.check(url)
        if is_superclasif.check():
            names_lst.append('IdWeb')
            values_lst.append(is_superclasif.url)

        precio = kwargs.get('precio', None)
        if precio:
            names_lst.append('precio')
            values_lst.append(precio)

        id_web = kwargs.get('IdWeb', None)
        if id_web:
            names_lst.append('IdWeb')
            values_lst.append(id_web)

        self.open()
        add_car_price = ''' INSERT INTO `CarPriceInfo` ( %s ) VALUES 
         ( %s )'''%(', '.join(names_lst), ', '.join(len(values_lst)*str_lst))
        self.cursor.execute(add_car_price, values_lst)
        self.cnx.commit()
        self.close()

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
        if 'superclasificados' in self.url:
            return True
        else:
            False


