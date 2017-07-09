
/*==============================================================================
 * ------------------------------- LOGIN ---------------------------------------
 ============================================================================= */

//Bindeamos el submit del formulario para procesarlo por ajax
$(function(){
   var form = $('#login-form');
   var button = form.find(':submit');
   var loginForm = $('#login-form-container');
   //loginForm.find(':input').attr('autocomplete', 'off').focus(function(){$(this).attr('autocomplete', false)});
   //Muestra u oculta el formulario
   var enter = $('#user-control .enter').click(function(){
       loginForm.css('display') == 'none' ? loginForm.show('normal') : loginForm.hide('normal');
   });
   //Ocultamos el formulario cuando salimos del formulario
   loginForm.mouseleave(function(e){
       var offset = loginForm.offset();
       //Hacemos esta comprobacion para que el autocompletar no triguerée este evento
       if(e.pageX < offset.left && e.pageX > offset.left + loginForm.width() && e.pageY < offset.top && e.pageY > offset.top + loginForm.height()){
          enter.click();
       }

   });
   //Envia el formulario
   button.click(function(){
      button.attr('disabled', true);
      var postVars = {
          'signin[_csrf_token]':    form.find('#signin__csrf_token').val(),
          'signin[username]': form.find('#signin_username').val(),
          'signin[password]': form.find('#signin_password').val(),
          'signin[remember]': form.find('#signin_remember').val()
      };
      $.post(base_url + '/ajax/sfGuardAuth/ajaxSignin', postVars, function(data){
          if(data.error){
              alert(data.error);
              button.attr('disabled', false);
          }else{
              if(data.redirect){
                  location.href = data.redirect;
                  return false;
              }
              signinSuccess(data.user);
          }          
      }, 'json');
      return false;
   });
});

//Signin success
function signinSuccess(user){
    //Mostramos el menu del usuario
    if(user.minisite == 'true') $('#user-menu #minisite-button').removeClass('hidden');

    if(user.is_bulk){
        $('#user-menu').find('.bulk').show();
    }else{
        $('#user-menu').find('.particular').show();
    }
    
    $('#user-menu').removeClass('hidden').slideUp(0).slideDown('slow');
    $('.customer-profile').removeClass('hidden');
    $('#login-link').addClass('hidden');
    //Ocultamos el formulario de login
    $('#login-form-container').hide('normal', function(){
        //Ocultamos los botones de login
        $('#user-control .no-logged').fadeOut('fast', function(){
            //Mostramos los botones de usuario
            $('#user-control .logged').fadeIn('fast').find('.username').text(user.username);
        });
    });
}

