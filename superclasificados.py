from selenium import webdriver as wd
from selenium import common

bro = wd.Chrome('/usr/bin/chromedriver')
bro2 = wd.Chrome('/usr/bin/chromedriver')

bro.get('http://www.elheraldo.hn')
con = set()
lis = bro.find_elements_by_class_name('sc-item')
for l in lis:
   url = l.find_element_by_tag_name('a').get_attribute('href')
   con.add(url)
   bro2.get(url)
   try:
       f = bro2.find_element_by_class_name('col-xs-9')
       tit = f.find_element_by_tag_name('h2').text
       precio = f.find_element_by_tag_name('p').text
   except(common.exceptions.NoSuchElementException):
       tit = 'Pagina Problematica'
       precio = url

   print('index: %s url: %s %s precio: %s'%(l.get_attribute('data-slick-index'), url.split('/')[4], tit, precio))
   

bro.close()
bro2.close()
