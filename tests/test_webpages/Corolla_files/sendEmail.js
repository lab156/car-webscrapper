
/**
 * Sends email
 */
$(function(){
    var button = $('#send-email');
    var form   = $('#send-advice form');
    var output = $('#send-advice .response');

    button.click(function(){
       var self = $(this);

       //Si #advice_id está seteado, tomamos el id del campo oculto seteado en el componente _show
       if($('#advice_id')[0]){
           var advices = new Array($('#advice_id').val());
       }else{
           //Eliminamos los ids de los avisos que hayan quedado guardado en el formulario
           form.find('.advice').remove();
           var checked_advices = $('.advice-checkbox:checked');
           var advices = new Array();
           checked_advices.each(function(i, element){
              advices.push(element.id);
           });
       }
       if(advices.length > 0){
           $.colorbox({inline: true, href: "#send-advice", close: '', opacity: 0.6});
           var submit_button = form.find('.submit');
           var submit_button_text = submit_button.text();
           submit_button.unbind('click');
           submit_button.click(function(){
               var from    = form.find('#from').val();
               var to      = form.find('#to').val();
               var mail_from = form.find('#mail-from').val();
               var mail_to = form.find('#mail-to').val();
               var message = form.find('#message').val();
               
               if ((validaremail(mail_from)) && (validaremail(mail_to))){
               
                var self = $(this);
                if(self.data('sending')) return false;
                self.data('sending', true);
                output.html('&nbsp;');

               

               submit_button.text('Enviando...').css('opacity', 0.5);
               
               $.post(base_url + '/ajax/email/sendAdvices', {from: from, to: to, mail_from: mail_from, mail_to: mail_to, message: message, advices: advices}, function(data){
                  alert(data.results);
                  submit_button.text(submit_button_text).css('opacity', 1);
                  self.data('sending', false);
                  if(data.success){
                      form[0].reset();
                      $.colorbox.close();
                  }
               }, 'json');
               return false;
               }else{
                    if (!validaremail(mail_from)){
                        alert ('Email remitente incorrecto'); 
                        $('#mail-from').attr("value","");
                    }else{
                        alert ('Email destinatario incorrecto'); 
                        $('#mail-to').attr("value","");
                    }                    
                } 
           });
       }else{
           alert('Debes seleccionar al menos 1 aviso');
       }
       return false;
   });
});
function validaremail(email) {
	
    var at = email.lastIndexOf("@");

    // Make sure the at (@) sybmol exists and  
    // it is not the first or last character
    if (at < 1 || (at + 1) === email.length)
        return false;

    // Make sure there aren't multiple periods together
    if (/(\.{2,})/.test(email))
        return false;

    // Break up the local and domain portions
    var local = email.substring(0, at);
    var domain = email.substring(at + 1);

    // Check lengths
    if (local.length < 1 || local.length > 64 || domain.length < 4 || domain.length > 255)
        return false;

    // Make sure local and domain don't start with or end with a period
    if (/(^\.|\.$)/.test(local) || /(^\.|\.$)/.test(domain))
        return false;

    // Check for quoted-string addresses
    // Since almost anything is allowed in a quoted-string address,
    // we're just going to let them go through
    if (!/^"(.+)"$/.test(local)) {
        // It's a dot-string address...check for valid characters
        if (!/^[-a-zA-Z0-9!#$%*\/?|^{}`~&'+=_\.]*$/.test(local))
            return false;
    }

    // Make sure domain contains only valid characters and at least one period
    if (!/^[-a-zA-Z0-9\.]*$/.test(domain) || domain.indexOf(".") === -1)
        return false;	

    return true;
}