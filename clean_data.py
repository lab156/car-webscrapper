import re
import datetime as dt

def precio(precio):
    '''
    >>> precio('L. 180,000')
    180000
    >>> precio('hola')


    '''
    only_digits = re.findall('[,\d]+', precio)
    if len(only_digits) > 0:
        decmark_reg = re.compile('(?<=\d),(?=\d)')
        return int(decmark_reg.sub('', only_digits[0]))
    else:
        return None

def moneda(precio):
    '''
    >>> moneda('$ 13,500')
    'USD'
    >>> moneda('L. 180,000')
    'HNL'
    >>> moneda('180,000')

    '''
    if precio[:2] == 'L.':
        return 'HNL'
    elif precio[:2] == '$ ':
        return 'USD'
    else:
        return None


def maker(marca):
    '''
    >>> maker('Toyota')
    'Toyota'
    '''
    return marca.title()

def model(modelo):
    '''
    >>> maker('Tacoma')
    'Tacoma'
    '''
    return modelo.title()

def id_web(id_text):
    '''
    >>> id_web('ID WEB: 175466')
    '175466'
    >>> id_web('175466')
    '175466'
    '''
    resu = re.findall(r'(ID WEB: )?(\d+)' , id_text)
    if len(resu) > 0:
        return resu[0][1]
    else:
        raise ValueError('No hay resultados en la IdWeb')

def condicion(cond):
    '''
    >>> condicion('Usado')
    'Usado'
    >>> condicion('No Proporcionado')

    '''

    if 'no propor' in cond.lower() :
        return None
    else:
        return cond.title()

def color(col):
    '''
    >>> color('Usado')
    'Usado'
    >>> color('No Proporcionado')

    '''

    if 'no propor' in col.lower() :
        return None
    else:
        return col.title()

def year(ano):
    '''
    >>> year('2004')
    2004
    >>> year('98')
    1998
    '''
    p_year = int(ano)
    if p_year < 100:
        return p_year + 1900
    else:
        return p_year

def kms(kils):
    '''
    
    >>> kms('189,000')
    189000
    >>> kms('No Proporcionado')
    

    '''
    only_digits = re.findall('[,\d]+', kils)
    if len(only_digits) > 0:
        decmark_reg = re.compile('(?<=\d),(?=\d)')
        return int(decmark_reg.sub('', only_digits[0]))
    else:
        return None

def cilindraje(cils):
    '''
    
    >>> cilindraje('1,600')
    1600
    >>> cilindraje('No Proporcionado')
    

    '''
    only_digits = re.findall('[,\d]+', cils)
    if len(only_digits) > 0:
        decmark_reg = re.compile('(?<=\d),(?=\d)')
        return int(decmark_reg.sub('', only_digits[0]))
    else:
        return None

def transmision(trans):
    '''
    >>> transmision('Auto')
    'auto'
    >>> transmision('MECAN')
    'mecan'
    >>> transmision('hola')
    
    '''
    opciones_meca = ['mecanico', 'mecan', 'mecánico']
    opciones_auto = ['automatica', 'auto', 'automática']

    if trans.lower() in opciones_meca:
        return 'mecan'
    elif trans.lower() in opciones_auto:
        return 'auto'
    else:
        return None

def carburacion(carb):
    '''
    >>> carburacion('Gasolina')
    'gasol'
    >>> carburacion('Diesel')
    'diesel'
    >>> carburacion('lpg')
    'gas_licuado'
    >>> carburacion('hola')
    
    '''

    if carb.lower() in ['gasolina', 'gasol']:
        return 'gasol'
    elif carb.lower() in ['diesel', 'disel']:
        return 'diesel'
    elif carb.lower() in ['gas licuado', 'lpg']:
        return 'gas_licuado'
    elif carb.lower() in ['hybrid', 'hibrido']:
        return 'gas_licuado'
    else:
        return None

def tipo(t):
    '''
    >>> tipo('pick up')
    'Pickup'
    >>> tipo('Turismo')
    'Turismo'
    >>> tipo('Convertible')
    'Convertible'
    >>> tipo('busito')
    'Busito'
    >>> tipo('Camioneta')
    'SUV'
    >>> tipo('Furgon')

    '''
    if t.lower() in ['pickup', 'pick up']:
        return 'Pickup'
    elif t.lower() in ['turismo', 'sedan']:
        return 'Turismo'
    elif t.lower() in ['convertible', 'descapotable']:
        return 'Convertible'
    elif t.lower() in ['busito', 'bus']:
        return 'Busito'
    elif t.lower() in ['suv', 'camioneta']:
        return 'SUV'
    else:
        return None

def fecha_pub(mens):
    '''
    >>> fecha_pub('Publicado: 24/03/2017')
    datetime.date(2017, 3, 24)
    '''
    search = re.findall('Publicado: (\d+)/(\d+)/(\d+)', mens)
    if search:
        return dt.date(int(search[0][2]), int(search[0][1]), int(search[0][0]))
    else:
        return None

def tipo_url(url):
    '''
    >>> tipo_url('https://autos.superclasificados.hn/aviso/174409/Venta-Turismo?utm_medium=Widget-sc&utm_source=elheraldo.hn&utm_campaign=widget-elheraldo')
    'Turismo'
    >>> tipo_url('https://autos.superclasificados.hn/aviso/175859/Venta-Pick-Ups?utm_medium=Widget-sc&utm_source=elheraldo.hn&utm_campaign=widget-elheraldo')
    'Pickup'
    >>> tipo_url('https://autos.superclasificados.hn/aviso/177394/Venta-Camionetas?utm_medium=Widget-sc&utm_source=elheraldo.hn&utm_campaign=widget-elheraldo')
    'SUV'
    '''
    if 'Venta-Turismo' in url:
        return 'Turismo'
    elif 'Venta-Pick-Ups' in url:
        return 'Pickup'
    elif 'Venta-Camionetas' in url:
        return 'SUV'
    else:
        return None



if __name__ == "__main__":
    import doctest
    doctest.testmod()

