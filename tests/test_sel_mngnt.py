import unittest
import os.path
import sys
sys.path.insert(0,'..')
from selenium import webdriver as wd
from .. import seleniun_mngmt as sel
import datetime

####run with
#### python -m unittest scrapper.tests.test_sel_mngnt -v

class CarManTest(unittest.TestCase):
    @classmethod
    def setUpClass(self):
        pages_dir = os.path.join(os.path.abspath(os.curdir), 'scrapper', 'tests','test_webpages')
        page_list = ['HondaCivic.html', 'Corolla.html', 'FordF250.html' , 'Yaris.html']
        path = os.path.join(pages_dir, page_list[0]) 
        browser = wd.Chrome('/usr/bin/chromedriver')
        self.dic = {}
        for P in page_list:
            car = sel.CarMan('file:///' + os.path.join(pages_dir, P), browser)
            self.dic[P] = car
        #self.dic = { P:sel.CarMan('file:///' + os.path.join(pages_dir, P), browser) for P in page_list }


    def test_IdWeb(self):
        self.assertEqual(self.dic['HondaCivic.html'].IdWeb(), '175797')

    def test_precio(self):
        self.assertEqual(self.dic['HondaCivic.html'].precio(), 150000)

    def test_maker(self):
        self.assertEqual(self.dic['HondaCivic.html'].maker(), 'Honda')
    
    def test_model(self):
        self.assertEqual(self.dic['HondaCivic.html'].model(), 'Civic')
        
    def test_condicion(self):
        self.assertEqual(self.dic['HondaCivic.html'].condicion(), 'Usado')

    def test_color(self):
        self.assertEqual(self.dic['HondaCivic.html'].color(), 'Negro')

    def test_year(self):
        self.assertEqual(self.dic['HondaCivic.html'].year(), 2008)

    def test_kms(self):
        self.assertEqual(self.dic['HondaCivic.html'].kms(), None)

    def test_cilindraje(self):
        self.assertEqual(self.dic['HondaCivic.html'].cilindraje(), None)

    def test_transmision(self):
        self.assertEqual(self.dic['HondaCivic.html'].transmision(), 'auto')
        self.assertEqual(self.dic['Corolla.html'].transmision(), 'auto')
        self.assertEqual(self.dic['FordF250.html'].transmision(), 'auto')

    def test_carburacion(self):
        self.assertEqual(self.dic['HondaCivic.html'].carburacion(), None)
        self.assertEqual(self.dic['FordF250.html'].carburacion(), 'diesel')

    def test_ubicacion(self):
        self.assertEqual(self.dic['HondaCivic.html'].ubicacion(), 'Tegucigalpa')

    def test_fecha_pub(self):
        self.assertEqual(self.dic['FordF250.html'].fecha_pub(),
                datetime.date(2017,3,8))
        self.assertEqual(self.dic['HondaCivic.html'].fecha_pub(),
                datetime.date(2017,3,19))

    def test_moneda(self):
        self.assertEqual(self.dic['Yaris.html'].moneda(), 'USD')
        self.assertEqual(self.dic['Corolla.html'].moneda(), 'HNL')
        self.assertEqual(self.dic['HondaCivic.html'].moneda(), 'HNL')
        self.assertEqual(self.dic['FordF250.html'].moneda(), 'HNL')



