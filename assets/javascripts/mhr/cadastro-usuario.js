'use strict'
import '../../../uibuilder/uibuilder.esm.min.js'

// Botao de login, envia dados de login para node-red
document.getElementById("btCadastrar").addEventListener("click", function fnCadUser() {
	var full_name, email, user_name, pass, pass_confirm, cad_ok = true;
	
	full_name = document.getElementById("full_name").value;
	email = document.getElementById("email").value;
	user_name = document.getElementById("user_name").value;
	pass = document.getElementById("pass").value;
	pass_confirm = document.getElementById("pass_confirm").value;
	
	fnAllNormal();
	
	if (full_name == "") {
		fnGrayToRed("full_name");
		fnVisibility("full_name_msg", true);
		
		cad_ok = false;
	};
	
	if (email == "") {
		fnGrayToRed("email");
		fnVisibility("email_msg", true);
		
		cad_ok = false;
	};
	
	if (user_name == "") {
		fnGrayToRed("user_name");
		fnVisibility("user_name_msg", true);
		document.getElementById("user_name_msg").innerHTML = "Campo não pode ficar em branco.";
		
		cad_ok = false;
	};
	
	if (pass == "") {
		fnGrayToRed("pass");
		fnVisibility("pass_msg", true);
		
		cad_ok = false;
	};
	
	if (pass_confirm == "") {
		fnGrayToRed("pass_confirm");
		fnVisibility("pass_confirm_msg", true);
		document.getElementById("pass_confirm_msg").innerHTML = "Campo não pode ficar em branco.";
		
		cad_ok = false;
	};
	
	if (pass_confirm != pass) {
		fnGrayToRed("pass_confirm");
		fnVisibility("pass_confirm_msg", true);
		document.getElementById("pass_confirm_msg").innerHTML = "Senha de confirmação diferente.";
		
		cad_ok = false;
	};
	
	if (cad_ok) {
		uibuilder.send({
			'topic': "cadastro-usuario",
			'full_name': full_name,
			'email': email,
			'user_name': user_name,
			'pass': pass
		})
	};
});


window.onload = function() {
    // Start uibuilder
	uibuilder.start();
	
    // Listen for incoming messages from Node-RED
    uibuilder.onChange('msg', function(msg) {
		if (msg.topic == "cadastro-usuario") { 
			if (msg.result == 1) {
				fnAllNormal();
				
				fnGrayToRed("user_name");
				fnVisibility("user_name_msg", true);
				document.getElementById("user_name_msg").innerHTML = "Usuário já cadastrado.";
			}else if (msg.result == 2) {
				window.location.replace("./index.html");
			};
		};
    })
}


// All Gray and Invisible
function fnAllNormal() {
	fnRedToGray("full_name");
	fnRedToGray("email");
	fnRedToGray("user_name");
	fnRedToGray("pass");
	fnRedToGray("pass_confirm");
	fnVisibility("full_name_msg", false);
	fnVisibility("email_msg", false);
	fnVisibility("user_name_msg", false);
	fnVisibility("pass_msg", false);
	fnVisibility("pass_confirm_msg", false);
}

// Gray to Red
function fnGrayToRed(id) {
	// Retira class GRAY
	document.getElementById(id).classList.remove("dark:border-gray-600");
	document.getElementById(id).classList.remove("focus:border-purple-400");
	document.getElementById(id).classList.remove("focus:shadow-outline-purple");
	
	// Adiciona class RED
	document.getElementById(id).classList.add("border-red-600");
	document.getElementById(id).classList.add("focus:border-red-400");
	document.getElementById(id).classList.add("focus:shadow-outline-red");
}

// Red to Gray
function fnRedToGray(id) {
	// Retira class RED
	document.getElementById(id).classList.remove("border-red-600");
	document.getElementById(id).classList.remove("focus:border-red-400");
	document.getElementById(id).classList.remove("focus:shadow-outline-red");
	
	// Adiciona class GRAY
	document.getElementById(id).classList.add("dark:border-gray-600");
	document.getElementById(id).classList.add("focus:border-purple-400");
	document.getElementById(id).classList.add("focus:shadow-outline-purple");
}

// Vibility
function fnVisibility(id, visible) {
	if (visible) {
		document.getElementById(id).style = "visibility: visible";
	}else{
		document.getElementById(id).style = "visibility: hidden";
	};
}
