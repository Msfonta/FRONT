'use strict'
import '../../../uibuilder/uibuilder.esm.min.js'

// Botao de login, envia dados de login para node-red
document.getElementById("btLogin").addEventListener("click", function fnLogin() {
    uibuilder.send({
        'topic': "login",
        'user_name': document.getElementById("user_name").value,
		'pass': document.getElementById("pass").value
    })
});


// Campo senha, envia dados de login para node-red
document.getElementById("pass").addEventListener("keypress", function fnLogin() {
    if (event.key === "Enter") {
		uibuilder.send({
			'topic': "login",
			'user_name': document.getElementById("user_name").value,
			'pass': document.getElementById("pass").value
		})
	};
});


// Retorno login
function fnRetLogin(msg) {
	if (msg.result == 1) { // Usuario incorreto
		fnVisibility("user_name_msg", true);
		fnVisibility("pass_msg", false);
		fnGrayToRed("user_name");
		fnRedToGray("pass");
	}else if (msg.result == 2) { // Senha incorreta
		fnGrayToRed("pass");
		fnRedToGray("user_name");
		fnVisibility("user_name_msg", false);
		fnVisibility("pass_msg", true);
	}else if (msg.result == 3) { // Login realizado com sucesso
		window.location.replace("./index.html");
	};
}


window.onload = function() {
    // Start uibuilder
	uibuilder.start();
	
    // Listen for incoming messages from Node-RED
    uibuilder.onChange('msg', function(msg) {
		if (msg.topic == "login") { fnRetLogin(msg); };
    })
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
