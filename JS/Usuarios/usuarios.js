const url = "http://localhost:3000/user"
const urlGrupo = "http://localhost:3000/grupo"
inventario = false;

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

    dadosUser = JSON.parse(localStorage.getItem('dadosUsuario'))
    if (window.location.href == 'http://localhost/projetoMHR/index.html') {
        if (dadosUser) {
            buscarPermissao(dadosUser.email, dadosUser.senha).then(
                function (response) {
                    if (response.status) {
                        if (response.message[0].perm_usuarios) {
                            $('.accountName').append(dadosUser.nome)
                            $('.nomeCompleto').val(dadosUser.nome)
                            $('.emailUsuario').val(dadosUser.email)
                            getUser()
                        } else {
                            window.location.href = "http://localhost/projetoMHR/erro401.html"
                        }
                    } else {
                        toastr.warning(response.message)
                    }
                }
            )
        } else {
            window.location.href = "http://localhost/projetoMHR/signIn.html"
        }
    }

    if (window.location.href == 'http://localhost/projetoMHR/usuarios.html') {
        if (dadosUser) {
            buscarPermissao(dadosUser.email, dadosUser.senha).then(
                function (response) {
                    if (response.status) {
                        if (response.message[0].perm_usuarios) {
                            $('.accountName').append(dadosUser.nome)
                            $('.nomeCompleto').val(dadosUser.nome)
                            $('.emailUsuario').val(dadosUser.email)
                            getUser()
                        } else {
                            window.location.href = "http://localhost/projetoMHR/erro401.html"
                        }
                    } else {
                        toastr.warning(response.message)
                    }
                }
            )
        } else {
            window.location.href = "http://localhost/projetoMHR/signIn.html"
        }
    }

    if (window.location.href == 'http://localhost/projetoMHR/myaccount.html') {
        $('.accountName').append(dadosUser.nome)
        $('.nomeCompleto').val(dadosUser.nome)
        $('.emailUsuario').val(dadosUser.email)
        $('.editUsuario').attr('onclick', `editarUsuarioId(${dadosUser.id})`)
    }
})

buscarPermissao = (email, senha) => {
    return $.ajax({
        url: `${url}/permissao`,
        method: 'GET',
        data: {
            email,
            senha
        },
    })
}


editarUsuarioId = (id) => {
        nome = $('.nomeCompleto').val(),
        email = $('.emailUsuario').val()

    $.ajax({
        url: `${url}/${id}`,
        method: 'PUT',
        data: {
            nome,
            email
        },
        success: function (response) {
            debugger
            if (response.status) {
                toastr.success(response.message)
            } else {
                toastr.warning(response.message)
            }
        }
    })
}

getGrupos = () => {
    $.ajax({
        url: `${urlGrupo}/grupos`,
        method: 'GET',
        success: function (response) {
            if (response.status) {
                response.message.forEach(dado => {
                    $('#grupoUsuario').append(`<option value=${dado.id}>${dado.nome}</option>`)
                })
            }
        }
    })
}

openModalUsuario = () => {
    $('#modalUsuarioLabel').text('').append('Cadastrar Usuário')
    $('#formModalUsuario').each(function () {
        this.reset()
    })
    $('#grupoUsuario').html('')
    $('.btnUsuario').attr('onclick', 'cadastroUsuario()')
    getGrupos()
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

}

logout = () => {
    if (dadosUser) {
        localStorage.removeItem('dadosUsuario')
        window.location.href = "http://localhost/projetoMHR/signIn.html"
    }
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
                localStorage.setItem('dadosUsuario', JSON.stringify(response.data.usuario))
                localStorage.setItem('token', JSON.stringify(response.data.token))
                localStorage.setItem('isLogged', true)
                window.location.href = "http://localhost/projetoMHR/index.html"
            } else {
                toastr.warning(response.data.message)
            }
        })
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
    $('#formModalUsuario').each(function () {
        this.reset()
    })
    $('#grupoUsuario').empty()
    $('#modalUsuarioLabel').text('').append('Editar Usuário')
    getGrupos()

    $.ajax({
        url: `${url}/${id}`,
        method: 'GET',
        success: function (response) {
            if (response.status) {
                dados = response.message[0]
                $('#idUsuarioModal').val(dados.id)
                $('#nomeUsuarioModal').val(dados.nome)
                $('#emailUsuarioModal').val(dados.email)
                $(`#grupoUsuario option[value=${dados.grupo}]`).attr('selected', 'selected')
            }
        }
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
    $.ajax({
        url: url,
        method: 'GET',
        success: function (response) {
            if (response.status) {
                response.message.forEach(dado => {
                    $('#tbUsuarios tbody').append(`<tr id="tr${dado.id}"><td class="id">${dado.id}</td><td class="nome">${dado.nome}</td><td class="email">${dado.email}</td><td align="center" class="grupo">${dado.grupo}</td><td align="center" ><a onclick="openModalEditarUsuario(${dado.id})" class="on-default edit-row" style="cursor:pointer;"><i id="cbEditarUsuario(${dado.id})" style="color:orange" class="fa fa-pencil"></i></a></td><td align="center"><a onclick="openModalExclusaoUsuario(${dado.id}, ${dado.excluido == 1 ? true : false})" class="on-default modal-basic"><input id="cbExcluirUsuario${dado.id}" style="cursor:pointer;" type="checkbox" ${dado.excluido == 1 ? 'checked' : ''} ></a></td></tr>`)
                })
            }
        }
    })
}
