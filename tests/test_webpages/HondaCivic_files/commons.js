function formatSeparator(input)
// Permite formatear un campo con separador de miles
{
    var num = input.value.replace(/\,/g,'');
    if(!isNaN(num)){
        num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g,'$1,');
        num = num.split('').reverse().join('').replace(/^[\,]/,'');
        input.value = num;
    }
    else{
        alert('Solo se permiten numeros.');
        input.value = input.value.replace(/[^\d\,]*/g,'');
    }
}
/*==============================================================================
  ------------------------------- TOOLTIPS -------------------------------------
 ============================================================================= */

//Muestra un tooltip en aquellos elementos que tienen definida la clase "tooltip"

function addTooltips(){
    $('.myTooltip').each(function(i, element){
        var tooltipButton = $(this);
        var position = tooltipButton.position();
        var singleLine = tooltipButton.hasClass('single-line');

        var tooltip      = $('<div>').addClass('myTooltip-container');
        var tooltipLeft  = $('<div>').addClass('myTooltip-left myTooltip-text').appendTo(tooltip).html(tooltipButton.html());
        var tooltipRight = $('<div>').addClass('myTooltip-right').appendTo(tooltip);

        if(tooltipLeft.text().length < 22) tooltipLeft.css({
            paddingTop: 12
        })

        tooltip.insertAfter(tooltipButton).css({
            position: 'absolute', 
            left: position.left, 
            top: position.top
            }).fadeOut(0);
        tooltipButton.mouseenter(function(){
            tooltip.fadeIn(0, function(){
                tooltip.attr('ready', true);
            });
        });
        tooltipButton.mouseout(function(){
            if(tooltip.attr('ready')) tooltip.fadeOut(0,function(){
                tooltip.attr('ready', false)
                });
        });
    });
}
function removeTooltips(){
    $('.myTooltip-container').remove();
}
function updateTooltips(){
    removeTooltips();
    addTooltips();
}

//Bind events to document ready and window resize
$(function(){
    //addTooltips();
});
$(window).resize(function(){
    //updateTooltips();
});


/*==============================================================================
  ----------------------------- PLACEHOLDERS -----------------------------------
 ============================================================================= */

/*
    Simula el comportamiento del atributo "placeholder" de HTML5 de los elementos input (text, password, textarea)
    Si el elemento tenia un valor inicial, cuando el usuario hace click en él este se guarda y se borra.
    Cuando el elemento pierde el foco, si está vacío, vuelve a tomar el valor original
*/
function addPlaceholders(){
    $('.placeholder:input').each(function(i, element){
        var element = $(this);
        var type = element.attr('type');
        var value = element.val();
        var title = element.attr('title');
        var placeholder = title || value;

        if(title && !value){
            element.attr('value', title);
        }

        element.attr('placeholder', placeholder)
        element.attr('disabled', false);

        if(element.val() != placeholder){
            element.removeClass('placeholder');
        }
       
        if(type == 'password'){
            var replace_element = $('<input type="text">').attr({
                className: element.attr('className'), 
                style: element.attr('style')
                });
            replace_element.val(placeholder);
            replace_element.focus(function(){
                replace_element.hide();
                element.show();
                element.focus();
            });
            element.hide();
            element.before(replace_element);
        }
        element.focus(function(){
            if(element.val() == placeholder){
                element.val('').removeClass('placeholder');
            }
        });
        element.blur(function(){
            if($.trim(element.val()) == ''){
                if(type == 'password'){
                    element.hide();
                    replace_element.show();
                } else {
                    element.val(placeholder);
                }
                element.addClass('placeholder');
            }
        });
    });
   
    $('form').submit(function(){
        var placeholder = $('.placeholder:input', this);
        placeholder.each(function(i, element){
            var esto = $(this);
            if(esto.val() == esto.attr('placeholder')){
                esto.val('');
            }
        });
        return true;
    });
};

$(function(){
    addPlaceholders();
});



function actual_date(){
    fecha = new Date()
    mes = fecha.getMonth()
    diaMes = fecha.getDate()
    diaSemana = fecha.getDay()
    anio = fecha.getFullYear()
    dias = new Array('Domingo','Lunes','Martes','Miercoles','Jueves','Viernes','Sábado')
    meses = new Array('Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre')
    return dias[diaSemana] + ", " + diaMes + " de " + meses[mes] + " de " + anio;
}

$(function(){
    $('#header .today .date').text(actual_date());
});


jQuery.fn.equalCols = function(){
    //Array Sorter
    var sortNumber = function(a,b){
        return b - a;
    };
    var heights = [];
    //Push each height into an array
    $(this).each(function(){
        heights.push($(this).height());
    });
    heights.sort(sortNumber);
    var maxHeight = heights[0];
    return this.each(function(){
        //Set each column to the max height
        $(this).attr('style', 'height: '+maxHeight+'px !important');
    });
};


/*==============================================================================
  ----------------------------- GRID ACTIONS -----------------------------------
 ============================================================================= */

$(function(){
    $('.grid-actions :checkbox').click(function(){
        $(':checkbox.grid-action-checkbox').attr('checked', this.checked);
    });
});

/*==============================================================================
  ---------------------------- IGUALAR COLUMNAS --------------------------------
 ============================================================================= */

$(function(){
    var equal_columns = $('.equal-columns');
    var height = 0;
    equal_columns.each(function(){
        var current_column = $(this);
        if(current_column.outerHeight() > height){
            height = current_column.outerHeight();
        }
    });
    equal_columns.height(height);
});

/*==============================================================================
  ---------------------------- VALIDAR BUSCADOR --------------------------------
 ============================================================================= */

$(function() {
    //Realizamos las validaciones del buscador avanzado del header
    $('#search_hor').submit(function(){
        if($('#order_search_top').val() == 'busqueda_id') {
            alert("Debe seleccionar un tipo de aviso");
            return false;
        }
        else {
            if($('#order_search_top').val() == 'aviso_id') {
                if($('.free_search').val() == '') {
                    alert("Debe ingresar un ID");
                    return false;
                }
                else if($('.free_search').val().indexOf('#') != 0) {
                    alert("Debe ingresar un ID válido");
                    return false;
                }
            }
            else {
                if($('.free_search').val() == '') {
                    alert("Debe ingresar al menos una palabra clave");
                    return false;
                }
            }
        }
    }); 
}); 

/*==============================================================================
  ----------------- SITEMAP - ESCONDER / MOSTRAR OPCIONES ----------------------
 ============================================================================= */

$(function(){
    $('#search-parameters-frame .search-parameters ul.options').css('display', 'none');
    var parameters = $('#search-parameters-frame .search-parameters');
    var categories = $('.category', parameters);
    var options    = $('.option', categories);
    categories.toggle(
        function(event){
            $(this).find('.options').slideDown('normal').end().toggleClass('icon-arrow-opened icon-arrow-closed');
        },
        function(){
            $(this).find('.options').slideUp('fast').end().toggleClass('icon-arrow-opened icon-arrow-closed');
        }
        );
    options.click(function(){
        if(href = $(this).find('a').attr('href')) location.href = href;
        return false;
    });
});

/*==============================================================================
  -------------------------- LINKS PARA BUSQUEDAS ------------------------------
 ============================================================================= */

global.goto_search = function(url, operation_type_id, advice_type_id, attributes){
    var form = $('<form>').attr({
        action: url, 
        method: 'post'
    });
    
    if(operation_type_id){
        form.append($('<input type="hidden">').attr({
            name: 'config_operationtype', 
            value: operation_type_id
        }));
    }
    if(advice_type_id){
        form.append($('<input type="hidden">').attr({
            name: 'config_advicetype', 
            value: advice_type_id
        }));
    }
    if(attributes){
        $.each(attributes, function(i, attribute){
            if(attribute.id && attribute.value){
                form.append($('<input type="hidden">').attr({
                    name: 'search_parameters['+ i +'][value]', 
                    value: attribute.value
                    }));
                form.append($('<input type="hidden">').attr({
                    name: 'search_parameters['+ i +'][attribute_id]', 
                    value: attribute.id
                    }));
                form.append($('<input type="hidden">').attr({
                    name: 'search_parameters['+ i +'][search_type]', 
                    value: (attribute.search_type || 'With Options')
                    }));
            }
        });
    }
    
    form.append($('<input type="hidden">').attr({
        name: 'new_search', 
        value: true
    }));
    form.submit();
}