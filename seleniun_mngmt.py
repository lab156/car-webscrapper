from selenium import webdriver as wd
from selenium import common
import time
import clean_data as clean


def get_webID_set(browser, url, *args, **kwargs):
    try:
        browser.get(url)
    except(common.exceptions.TimeoutException):
        print('Sucedio un timeout')
        return None
    lis = browser.find_elements_by_class_name('sc-item')
    id_set = set()
    for l in lis:
       url = l.find_element_by_tag_name('a').get_attribute('href')
       id_set.add(url.split('/')[4])
    return id_set

def get_url_list(browser, url, *args, **kwargs):
    try:
        browser.get(url)
    except(common.exceptions.TimeoutException):
        print('Sucedio un timeout')
        return None
    lis = browser.find_elements_by_class_name('sc-item')
    url_lst = []
    for l in lis:
       url = l.find_element_by_tag_name('a').get_attribute('href')
       url_lst.append(url)
    return url_lst

class CarMan(object):
    def __init__(self,url):
        '''
        Se encarga de la parte de obtener la informacion 
        de la pagina de superclasificados
        usando Selenium.
        No deberia de intervenir en la base de datos.
        '''
        self.split_url = url.split('/')
        if 'autos' not in self.split_url[2]:
            #El dominio deberia de ser autos.superclasificados.hn
            raise ValueError('URL no parece correcto %s'%self.split_url[2])

        self.bro = wd.Chrome('/usr/bin/chromedriver')
        self.bro.get(url)
        self.dic = self.get_carac_bas()

    def get_model_title(self):
        '''
        retorna el modelo del titulo de la pagina de 
        clasificados
        '''
        e1 = self.bro.find_element_by_class_name('cabecera-detalle')
        e2 = e1.find_element_by_class_name('col-xs-9')
        e3 = e2.find_element_by_tag_name('h2')
        return e3.text
        
    def get_price_title(self):
        '''
        retorna el precio mostrado en el titulo de la pagina
        '''
        e1 = self.bro.find_element_by_class_name('cabecera-detalle')
        e2 = e1.find_element_by_class_name('col-xs-9')
        e3 = e2.find_element_by_tag_name('p')
        return e3.text

    def get_carac_bas(self):
        '''
        retorna un diccionario con toda la info denominada 
        Caracteristicas Basicas
        '''
        dic = {}
        e1 = self.bro.find_element_by_class_name('caracteristicas')
        dic['desc'] = e1.text.split('\n')[0]
        tabla = e1.find_element_by_class_name('table')
        for row in  tabla.find_elements_by_tag_name('tr'):
            for col in row.find_elements_by_tag_name('td'):
                td = col.text.split(':\n')
                dic[td[0]] = td[1]

        return dic

    def precio(self):
        '''
        Retorna el precio como un int o None
        '''
        return clean.precio(self.dic['Precio'])
    def maker(self):
        return clean.maker(self.dic['Marca'])
    def model(self):
        return clean.model(self.dic['Modelo'])
    def condicion(self):
        return clean.condicion(self.dic['Modelo'])


if __name__ == '__main__':
    bro = wd.Chrome('/usr/bin/chromedriver')
    heraldo = 'http://www.elheraldo.hn'

    old_set = get_webID_set(bro, heraldo) 
    while True:
        time.sleep(20)
        new_set = get_webID_set(bro, heraldo) 
        if new_set == old_set:
            print('iguales con long: %s'%(len(old_set)))
        elif new_set is not None:
            print('Entro: %s y salio: %s a las %s'%(len(new_set - old_set), len(old_set - new_set), time.ctime()))
            old_set = new_set
        else:
            print('Sobrevivio al timeout')
