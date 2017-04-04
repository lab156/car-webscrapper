//Functionalities for CompanyDictionary->Edit action
$(function(){


});

function mark_favorite(advice_id, customer_id){
    var confirm = window.confirm("¿Está seguro que desea agregar el anuncio seleccionado a sus Favoritos?");
    if (confirm) {
        var array = new Array();
        array.push(advice_id);

        $.post(base_url + '/ajax/advice/markFavorites', {advices: array, customer_id: customer_id}, function(data){
            if(data.error){
                alert(data.error);
            }else{
                alert('El anuncio han sido agregados a sus Favoritos');
            }
        }, 'json');
    }
    return false;
}

function breadcumps_search_send(name,val,name1,val1,name2,val2){
    $('#add_bc_term').val(val);
    $('#add_bc_term').attr("name",name);
    if(val1){
        $('#add_bc_term_1').val(val1);
    }
    if(name1){
        $('#add_bc_term_1').attr("name",name1);
    }
    if(val2){
        $('#add_bc_term_2').val(val2);
    }
    if(name2){
        $('#add_bc_term_2').attr("name",name2);
    }
    $('#breadcumps_search_form').submit();
}

function comments_advice(advice_id, customer_id){
    var confirm = window.confirm("¿Está seguro que desea comentar este anuncio?");
    if (confirm) {
        var array = new Array();
        array.push(advice_id);

        $.post(base_url + '/ajax/advice/markFavorites', {advices: array, customer_id: customer_id}, function(data){
            if(data.error){
                alert(data.error);
            }else{
                alert('Los anuncios han sido agregados a sus Favoritos');
            }
        }, 'json');
    }
    return false;
}

/**
 * Updates/sets form values and resets its status.
 */
function setUpReportForm(advice_id, customer_id, user_customer_id){
    if(user_customer_id != 0){
        $('#boxdenuncia #report_form').find('#reportSubmit').attr('disabled', false);
        $('#boxdenuncia #report_form').find('#reportSubmit').val('DENUNCIAR');
        $('#boxdenuncia #report_form').find('#complaints_comments').val('');
        $('#boxdenuncia #report_form').find('#complaints_advice_id').val(advice_id);
        $('#boxdenuncia #report_form').find('#complaints_customer_id').val(customer_id);
        $.colorbox({
            inline: true, 
            href: "#boxdenuncia", 
            close: '', 
            opacity: 0.6
        });        
    }
    else{
        alert('Debe estar logueado para poder realizar esta acción.');
    }
}

function sendReport(target_url, complaints_id, customer_id, advice_id, state, token, complaint_type, complaint_comment){
    var post_vars = {
        'complaints[id]': complaints_id,
        'complaints[customer_id]': customer_id,
        'complaints[advice_id]': advice_id,
        'complaints[state]': state,
        'complaints[_csrf_token]': token,
        'complaints[complainttype_id]': complaint_type,
        'complaints[comments]': complaint_comment
    };
    
    var response = false;
    $.ajaxSetup({
        async:false
    });
    
    $.post(target_url, post_vars, function(data){
        if(data.error){
            alert(data.error);
            response = false;
        }else{
            alert(data.success);
            response = true;
        }
    }, 'json');

    return response;
}