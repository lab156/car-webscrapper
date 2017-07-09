///////////////////////////////////////////////////////////////////////////////
//THE I18N section. (every string that is displayed is defined here)
///////////////////////////////////////////////////////////////////////////////
//That is to make translations more easy when there is a single point to change.
//It is defined in the HTML to work with the language feature of http servers

var ChatI18N_SysPopup_NoPopups = 'Ha ocurrido un error al iniciar el chat.';

// /////////////////////////////////////////////////////////////////////////////
// THE I18N section. (END)
// /////////////////////////////////////////////////////////////////////////////

// enable (true) this when you desire some debuging options
var debug = false;
var list_loaded = false;

// checks that the launch parameters are valid
function checkForm() {
    var value;

    value = document.getElementById("ChatLauncherNombre").value;
    if (value === '') {
	document.getElementById("ChatLauncherStartButton").disabled = true;
	return;
    }
    
    value = document.getElementById("ChatLauncherTelefono").value;
    if (value === '') {
	document.getElementById("ChatLauncherStartButton").disabled = true;
	return;
    }    

    value = document.getElementById("ChatLauncherTopicID").value;
    if (value === '') {
	document.getElementById("ChatLauncherStartButton").disabled = true;
	return;
    }

    
    document.getElementById("ChatLauncherStartButton").disabled = false;
}



function createConversation() {
    document.getElementById("ChatLauncherStartButton").disabled = true;
    
    $.ajax({
	  type: "GET",
	  url: base_url + '/ajax/chat/conversation',
	  success: function(html) {
	      $('.ChatInit').hide();
	      $('#ChatConversation').html(html);
	      $('#ChatConversation').show();
	  },
          error: function() {
              alert(ChatI18N_SysPopup_NoPopups);
          }
    });
    
}



function updateTopicDropDown(response) {
    // this could be easy going if there wasn't
    // http://support.microsoft.com/kb/276228/en-us
    // document.getElementById("ChatLauncherTopicID").innerHTML = response;
    if (!response || response.length == 0) {
	return;
    }
    var selectNode = document.getElementById("ChatLauncherTopicID");
    var options = response.split('<option>');
    for (iOptions = 0; iOptions < options.length; iOptions++) 
    if (options[iOptions]!='') {
	option = options[iOptions].replace('</option>', '');
	var optionNode = document.createElement("option");
	optionNode.text = option;
	var valueAttrib = document.createAttribute("value");
	valueAttrib.nodeValue = option;
	optionNode.setAttributeNode(valueAttrib);
	selectNode.add(optionNode);
    }
}

function prefillValues() {
    if (debug) {
	document.getElementById("ChatLauncherNickName").value = "";
	document.getElementById("ChatLauncherInitialQuestion").value = "";
	document.getElementById("ChatLauncherPrivacyCheck").checked = true;
    }
}




function show_chat_form() {
    $("#ChatBackground").unbind('click');    
    $("#ChatBackground").bind('click', function() {
        hide_chat_form();           
    });

    if (list_loaded==false) {
        comergo_jsgenerics_ajax.post(base_url + '/ajax/chat/WebChatBackend', "Operation=getTopicOptionList", updateTopicDropDown);
        list_loaded = true;
    }
    
    $('.ChatInit').show();
    $("#ChatBackground").css('display', 'block');    
    $('#ChatLauncherContainer').show();    
}


function hide_chat_form() {
    $("#ChatBackground").css('display', 'none');
    $('#ChatLauncherContainer').hide();            
}

