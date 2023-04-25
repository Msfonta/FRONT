const url = "http://localhost:3000/user"

irSignIn = () => {
    window.location.href = "signIn.html"
}

irHome = () => {
    window.location.href = "index.html"
}

cadastroUsuario = () => {
    nome = $('.nome-input').val()
    email = $('.email-input').val()
    senha = $('.senha-input').val()
    senha2 = $('.senha2-input').val()

    if (senha !== senha2) {
        alert('As senhas não coincidem!')
        return false
    } 
    
    axios.post(`${url}/cadastro`, {
        nome: nome,
        email: email,
        senha: senha
    })
    .then(response => {
        if(response.data.status){
            irSignIn()
        } else {
            alert('Erro ao cadastrar')
        }
    })
    .catch(error => console.log(error))  
}

login = () => {
    email = $('.email-input').val()
    senha = $('.senha-input').val()
    
    axios.post(`${url}/login`, {
        email: email,
        senha: senha
    })
    .then(response => {
        if(response.data.status){
            irHome()
        } else {
            alert('Erro ao logar')
        }
    })
    .catch(error => console.log(error))  
}

updateUser = () => {
    var dados;
    axios.get(url)
    .then(response => {
        dados = response.data[0]
        $('.nome-input').val(dados.nome)
        $('.senha-input').val(dados.senha)
        $.notify('SUCESSO', 'success')

    })
    .catch(error => console.log(error))  
}

getUser = () => {
    var dados;
    axios.get(url)
    .then(response => {
        dados = response.data[0]
        $('.nome-input').val(dados.nome)
        $('.senha-input').val(dados.senha)
        $.notify('SUCESSO', 'success')
        irHome()

    })
    .catch(error => console.log(error))  
}

getUserById = () => {
    var dados;
    axios.get(`url`)
    .then(response => {
        dados = response.data[0]
        $('.nome-input').val(dados.nome)
        $('.senha-input').val(dados.senha)
        $.notify('SUCESSO', 'success')

    })
    .catch(error => console.log(error))  
}