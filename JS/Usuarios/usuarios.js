const url = "http://localhost:3000/user"

$(document).ready(function () {
    toastr.options = {
        'closeButton': true,
        'debug': false,
        'newestOnTop': false,
        'progressBar': false,
        'positionClass': 'toast-top-right',
        'preventDuplicates': false,
        'showDuration': '1000',
        'hideDuration': '1000',
        'timeOut': '5000',
        'extendedTimeOut': '1000',
        'showEasing': 'swing',
        'hideEasing': 'linear',
        'showMethod': 'fadeIn',
        'hideMethod': 'fadeOut',
    }

    $('#inputEmailLogin').keypress(function (e) {
        if (e.keyCode == 13) {
            e.preventDefault()
            login();
        }
    })

    $('#inputSenhaLogin').keypress(function (e) {
        if (e.keyCode == 13) {
            e.preventDefault()
            login();
        }
    })

    var dadosUsuario = JSON.parse(localStorage.getItem('dadosUsuario'))

    if (window.location.href == 'http://localhost/projetoMHR/index.html') {
        $('.accountName').append(dadosUsuario.nome)
        $('.nomeCompleto').val(dadosUsuario.nome)
        $('.emailUsuario').val(dadosUsuario.email)
        if (dadosUsuario.id_grupo != 4) {
            $('.listaUsuarios').css('display', 'none')
        }
    }

    if (window.location.href == 'http://localhost/projetoMHR/usuarios.html') {
        if (dadosUsuario.id_grupo != 4) {
            irNaoAutorizado()
        } else {
            $('.accountName').append(dadosUsuario.nome)
            $('.nomeCompleto').val(dadosUsuario.nome)
            $('.emailUsuario').val(dadosUsuario.email)
            if (dadosUsuario.id_grupo != 4) {
                $('.listaUsuarios').css('display', 'none')
            }
            getUser()
        }
    }

    if (window.location.href == 'http://localhost/projetoMHR/myaccount.html') {
        $('.accountName').append(dadosUsuario.nome)
        $('.nomeCompleto').val(dadosUsuario.nome)
        $('.emailUsuario').val(dadosUsuario.email)
    }


})

irSignIn = () => {
    window.location.href = "signIn.html"
}

irHome = () => {
    window.location.href = "index.html"
}

irNaoAutorizado = () => {
    window.location.href = "page401.html"
}

isUsuarios = () => {
    window.location.href = "usuarios.html"
}


openModalUsuario = () => {
    getGrupos()
    $('#modalUsuarioLabel').text('').append('Cadastrar Usuário')
    $('#formModalUsuario').each(function () {
        this.reset()
    })
    $('.btnUsuario').attr('onclick', 'cadastroUsuario()')
    $('#modalUsuario').modal('show')
}

cadastroUsuario = () => {
    usuario = {
        nome: $('#nomeUsuarioModal').val(),
        email: $('#emailUsuarioModal').val(),
        senha: $('#senhaUsuarioModal').val(),
        grupo: $('#grupoUsuario').val()
    }

    usuario.nome = usuario.nome.replace(/'/g, '');
    usuario.email = usuario.email.replace(/'/g, '');
    usuario.senha = usuario.senha.replace(/'/g, '');

    let regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regex.test(usuario.email)) {
        toastr.warning("O e-mail é inválido.");
        return false
    }

    axios.post(`${url}/cadastro`, {
        usuario
    })
        .then(response => {
            if (response.data.status) {
                $('#tbUsuarios tbody').html('')
                getUser()
                toastr.success(response.data.message)
                $('#modalUsuario').modal('hide')
            } else {
                toastr.warning(response.data.message)
            }
        })
        .catch(error => {
            toastr.warning(error.response.data.message)
        })

}

login = () => {
    usuario = {
        email: $('.email-input').val().toLowerCase(),
        senha: $('.senha-input').val()
    }

    axios.post(`${url}/login`, {
        usuario
    })
        .then(response => {
            if (response.data.status) {
                localStorage.setItem('dadosUsuario', JSON.stringify(response.data.usuario[0]))
                localStorage.setItem('token', JSON.stringify(response.data.token))
                localStorage.setItem('isLogged', true)
                irHome()
            } else {
                toastr.warning(response.data.message)
            }
        })
        .catch(error => console.log(error))
}

authToUsuarios = () => {
    token = JSON.parse(localStorage.getItem('token'))

    if (localStorage.getItem('isLogged')) {
        axios.get(`${url}/listarUsuarios`, {
            headers: {
                'x-access-token': token
            }
        })
            .then(response => {
                if (response.data) {
                    response.data.forEach(resp => {
                        console.log(resp.nome)
                    });
                } else {
                    irNaoAutorizado()
                }
            })
            .catch(error => console.log(error))

    } else {
        irNaoAutorizado()
    }

}

openModalExclusaoUsuario = (id, reativar) => {
    if (reativar) {
        $(`#cbExcluirUsuario${id}`).prop('checked', true)
        $('#modalExclusaoUsuarioLabel').text('').append('Reativar usuário')
        $('#modalExclusaoUsuario .modal-body p').text('').append('Você tem certeza que deseja reativar este usuário?')
        $('.btnExclusao').attr('onclick', `exclusaoUsuario(${id}, true)`)
    } else {
        $(`#cbExcluirUsuario${id}`).prop('checked', false)
        $('#modalExclusaoUsuarioLabel').text('').append('Desabilitar usuário')
        $('#modalExclusaoUsuario .modal-body p').text('').append('Você tem certeza que deseja desabilitar este usuário?')
        $('.btnExclusao').attr('onclick', `exclusaoUsuario(${id}, false)`)
    }
    $('#modalExclusaoUsuario').modal('show')
}


exclusaoUsuario = (id, reativar) => {
    if (reativar) {
        axios.put(`${url}/activate/${id}`)
            .then(response => {
                if (response.data.status) {
                    $('#tbUsuarios tbody').html('')
                    getUser()
                    $('#modalExclusaoUsuario').modal('hide')
                    toastr.success(response.data.message)
                }
            })
            .catch(error => {
                toastr.warning('Erro ao alterar o usuário')
            })
    } else {
        axios.put(`${url}/delete/${id}`)
            .then(response => {
                if (response.data.status) {
                    $('#tbUsuarios tbody').html('')
                    getUser()
                    $('#modalExclusaoUsuario').modal('hide')
                    toastr.success(response.data.message)
                } else {
                    toastr.warning('Erro ao alterar o usuário')
                }
            })
    }

}


openModalEditarUsuario = (id) => {
    getGrupos()
    $('#modalUsuarioLabel').text('').append('Editar Usuário')
    $('#grupoUsuario').html('')

    axios.get(`${url}/${id}`)
        .then(response => {
            dados = response.data[0]
            $('#idUsuarioModal').val(dados.id)
            $('#nomeUsuarioModal').val(dados.nome)
            $('#emailUsuarioModal').val(dados.email)
            $(`#grupoUsuario option[value=${dados.grupo}]`).attr('selected', 'selected')
        })
    $('.btnUsuario').attr('onclick', `editarUsuario(${id})`)
    $('#modalUsuario').modal('show')
}

editarUsuario = (id) => {
    id = $('#idUsuarioModal').val()
    nome = $('#nomeUsuarioModal').val()
    email = $('#emailUsuarioModal').val()
    senha = $('#senhaUsuarioModal').val()
    grupo = $('#grupoUsuario').val()

    axios.put(`${url}/${id}`, {
        id,
        nome,
        email,
        senha,
        grupo
    })
        .then(response => {
            if (response.status == 200) {
                $('#tbUsuarios tbody').html('')
                getUser()
                toastr.success('Usuário alterado com sucesso!')
                $('#modalUsuario').modal('hide')
            }
        }).catch(error => {
            toastr.warning('Erro ao alterar o usuário')
        })
}

getUser = () => {
    usuario = JSON.parse(localStorage.getItem('dadosUsuario'))

    axios.get(`${url}`)
        .then(response => {
            response.data.forEach(dado => {
                $('#tbUsuarios tbody').append(`<tr id="tr${dado.id}"><td class="id">${dado.id}</td><td class="nome">${dado.nome}</td><td class="email">${dado.email}</td><td align="center" class="grupo">${dado.grupo}</td><td align="center" ><a onclick="openModalEditarUsuario(${dado.id})" class="on-default edit-row" style="cursor:pointer;"><i id="cbEditarUsuario(${dado.id})" style="color:orange" class="fa fa-pencil"></i></a></td><td align="center"><a onclick="openModalExclusaoUsuario(${dado.id}, ${dado.excluido == 1 ? true : false})" class="on-default modal-basic"><input id="cbExcluirUsuario${dado.id}" style="cursor:pointer;" type="checkbox" ${dado.excluido == 1 ? 'checked' : ''} ></a></td></tr>`)
            })
            $('.nameUsuario').append(usuario.nome)
        })
        .catch(error => console.log(error))
}
