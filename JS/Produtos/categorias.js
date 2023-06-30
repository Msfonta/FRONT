const urlCategoria = "http://localhost:3000/categoria"
let inventario = false;
dadosUser = false;

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
    dadosUser = JSON.parse(localStorage.getItem('dadosUsuario'))

    if (window.location.href == 'http://localhost/projetoMHR/categorias.html') {
        if (dadosUser) {
            buscarPermissao(dadosUser.email, dadosUser.senha).then(
                function (response) {
                    if (response.status) {
                        if (response.message[0].perm_categorias) {
                            inventario = JSON.parse(localStorage.getItem('inventario'))
                            if (inventario) {
                                $('.divInventario h4').css('display', 'block')
                            }
                            $('.accountName').append(dadosUser.nome)
                            $('.nomeCompleto').val(dadosUser.nome)
                            $('.emailUsuario').val(dadosUser.email)
                            getCategorias()
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

})

irNaoAutorizado = () => {
    window.location.href = "pages404.html"
}

getCategorias = () => {
    let contador = 1
    axios.get(`${urlCategoria}/`)
        .then(response => {
            response.data.data.forEach(dado => {
                $('#tbCategorias tbody').append(`<tr id=tr${dado.id}><td class="id">${contador}</td><td class="nome">${dado.nome}</td><td align="center"><a id="editarGrupo" onclick="showEditarCategoria(${dado.id}, ${dado.tipo})" style="cursor:pointer;" class="on-default edit-row"><i style="color:orange" class="fa fa-pencil"></i></a></td><td align="center"><a id="removerCategoria" onclick="showRemoverCategoria(${dado.id})" style=${inventario ? "pointer-events:none;" : "cursor:pointer;"} class="on-default edit-row"><i style="color:red" class="fa fa-trash-o"></i></a></td></tr>`)
                contador++
            })
        })
}

showRemoverCategoria = (id) => {
    $('#modalExclusaoCategoria').modal('show')
    if (inventario) {
        $('.btnExclusaoCategoria').css('pointer-events', 'none')
    } else {
        $('.btnExclusaoCategoria').attr('onclick', `removerCategoria(${id})`)
    }
}

showAddCategoria = () => {
    $('#idCadastroCategoria').each(function () {
        this.reset()
    })
    $('.btnAddCategoria').attr('disabled', true)
    $('#idCadastroCategoria').css('display', 'inline')
}

closeAddCategoria = () => {
    $('.btnAddCategoria').attr('disabled', false)
    $('#idCadastroCategoria').css('display', 'none')
}

showEditarCategoria = (id) => {
    $('.btnSalvarCategoria').text('Editar Categoria')
    $('.btnAddCategoria').attr('disabled', true)
    $('#nomeCategoria').val($(`#tbCategorias tbody #tr${id} .nome`).text())
    $('.btnSalvarCategoria').attr(`onclick`, `editarCategoria(${id})`)
    $('#idCadastroCategoria').css('display', 'inline')
}

salvarCategoria = () => {
    nome = $('#nomeCategoria').val()

    axios.post(`${urlCategoria}/cadastro`, {
        nome,
    })
        .then(response => {
            if (response.data.status) {
                $('#tbCategorias tbody').html('')
                getCategorias()
                $('.btnAddCategoria').attr('disabled', false)
                toastr.success(response.data.message)
            } else {
                toastr.warning(response.data.message)
            }
        })
        .catch(error => toastr.error(error))
}

editarCategoria = (id) => {
    nome = $('#nomeCategoria').val()
    axios.put(`${urlCategoria}/${id}`, {
        nome
    })
        .then(response => {
            if (response.data.status) {
                $('#tbCategorias tbody').html('')
                getCategorias()
                $('#idCadastroCategoria').css('display', 'none')
                $('.btnAddCategoria').attr('disabled', false)
                toastr.success(response.data.message)
            } else {
                toastr.warning(response.data.message)
            }
        })
        .catch((error => console.log(error)))
}

removerCategoria = (id) => {
    axios.put(`${urlCategoria}/delete/${id}`)
        .then(response => {
            if (response.data.status) {
                toastr.success(response.data.message)
                $(`#tbCategorias tbody #tr${id}`).remove()
                $('#modalExclusaoCategoria').modal('hide')
            } else {
                toastr.warning(response.data.message)
            }
        }).catch(error => toastr.error(error))
}