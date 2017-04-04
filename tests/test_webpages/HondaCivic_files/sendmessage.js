/*==============================================================================
 * ----------------------------- SEND MESSAGE-----------------------------------
 ============================================================================= */

$(function(){
   //Envia el formulario
   var button = $('#sendmessage').data('enabled', true);
   var buttonText = button.text();
   button.click(function(){
      if(button.data('enabled') == false) return false;

      var form = $(this).parents('form:first');
      var postVars = {
          'advice_id':    form.find('#advice_id').val(),
          'customer_id':  form.find('#customer_id').val(),
          'name':         form.find('#name').val(),
          'email':        form.find('#email').val(),
          'phone':        form.find('#phone').val(),
          'message':      form.find('#message').val(),
          'captcha':      form.find('#captcha').val(),
          'contact_time': form.find('#contact_time').val()
      };

      button.data('enabled', false).fadeTo('fast', 0.5).text('Enviando...');
      $.post(base_url + '/ajax/customer/sendMessage', postVars, function(data){
          if(data.error){
              alert(data.error);
          }else{
              alert(data.msg);
              form[0].reset();
              //$('#seller-contact-frame').slideUp('slow');
          }
          button.data('enabled', true).fadeTo('fast', 1).text(buttonText);
      }, 'json');
      return false;
   });

});