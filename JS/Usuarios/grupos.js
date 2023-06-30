let dadosUser = false;

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

    if (window.location.href == 'http://localhost/projetoMHR/grupos.html') {
        if (dadosUser) {
            buscarPermissao(dadosUser.email, dadosUser.senha).then(
                function (response) {
                    if (response.status) {
                        if (response.message[0].perm_grupos) {
                            inventario = JSON.parse(localStorage.getItem('inventario'))
                            if (inventario) {
                                $('.divInventario h4').css('display', 'block')
                            }
                            $('.accountName').append(dadosUser.nome)
                            $('.nomeCompleto').val(dadosUser.nome)
                            $('.emailUsuario').val(dadosUser.email)
                            getListaGrupos()
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

showAddGrupo = () => {
    $('.btnAddGroup').attr('disabled', true)
    $('.btnSalvarGrupo').attr('onclick', 'salvarGrupo()')
    $('#idCadastroGrupo').css('display', 'inline')
}

salvarGrupo = () => {
    grupo = {
        checkDashboard: $('#checkDashboard').prop('checked') ? 1 : 0,
        checkUsuarios: $('#checkUsuarios').prop('checked') ? 1 : 0,
        checkProdutos: $('#checkProdutos').prop('checked') ? 1 : 0,
        checkGrupoUsuarios: $('#checkGrupoUsuarios').prop('checked') ? 1 : 0,
        checkInventario: $('#checkInventario').prop('checked') ? 1 : 0,
        checkControle: $('#checkControle').prop('checked') ? 1 : 0,
        checkCategorias: $('#checkCategorias').prop('checked') ? 1 : 0,
        nome: $('#nomeGrupo').val()
    }
    grupo.nome = grupo.nome.replace(/'/g, '');

    axios.post(`${urlGrupo}`, {
        grupo
    })
        .then(response => {
            if (response.data.status) {
                toastr.success(response.data.message)
                $('#tbGrupos tbody').html('')
                $('#nomeGrupo').val('')
                getListaGrupos()
                $('.btnAddGroup').attr('disabled', false)
                $('#idCadastroGrupo').css('display', 'none')

            } else {
                toastr.warning(response.data.message)
            }
        })
}

closeAddGroup = () => {
    $('.btnAddGroup').attr('disabled', false)
    $('#idCadastroGrupo').css('display', 'none')
}


getListaGrupos = () => {
    let contador = 1
    $.ajax({
        url: urlGrupo,
        method: 'GET',
        success: function (response) {
            if (response.status) {
                response.message.forEach(dado => {

                    $('#tbGrupos tbody').append(`<tr id="tr${dado.id}"><td class="idGrupo">${contador}</td><td class="nomeGrupo">${dado.nome}</td><td class="pUsuario" align="center">${dado.perm_usuarios ? '<i style="color:green" class="fa fa-check"></i>' : '<i style="color: red"class="fa fa-times"></i>'}</td><td class="pProduto" align="center">${dado.perm_produtos ? '<i style="color:green" class="fa fa-check"></i>' : '<i style="color: red"class="fa fa-times"></i>'}</td><td class="pDashboard" align="center">${dado.perm_dashboard ? '<i style="color:green" class="fa fa-check"></i>' : '<i style="color: red"class="fa fa-times"></i>'}</td><td class="pGrupo" align="center">${dado.perm_grupos ? '<i style="color:green" class="fa fa-check"></i>' : '<i style="color: red"class="fa fa-times"></i>'}</td><td class="pInventario" align="center">${dado.perm_inventario ? '<i style="color:green" class="fa fa-check"></i>' : '<i style="color: red"class="fa fa-times"></i>'}</td><td class="pControle" align="center">${dado.perm_controle ? '<i style="color:green" class="fa fa-check"></i>' : '<i style="color: red"class="fa fa-times"></i>'}</td><td class="pCategorias" align="center">${dado.perm_categorias ? '<i style="color:green" class="fa fa-check"></i>' : '<i style="color: red"class="fa fa-times"></i>'}</td><td align="center"><a id="editarGrupo${dado.id}" onclick="openModalEditarGrupo(${dado.id})" style="cursor:pointer;" class="on-default edit-row"><i style="color:orange" class="fa fa-pencil"></i></a></td></td><td align="center"><a id="removerGrupo${dado.id}" onclick="openModalRemoverGrupo(${dado.id})" style="cursor:pointer;" class="on-default edit-row"><i style="color:red" class="fa fa-trash-o"></i></a></td></td>`)
                    contador++
                })
            }
        }
    })
}

openModalEditarGrupo = (id) => {
    $('#permUsuarioModal').prop('checked', false)
    $('#permProdutosModal').prop('checked', false)
    $('#permGruposModal').prop('checked', false)
    $('#permDashboardModal').prop('checked', false)
    $('#permInventarioModal').prop('checked', false)
    $('#permControleModal').prop('checked', false)
    $('#permCategoriasModal').prop('checked', false)

    $.ajax({
        url: `${urlGrupo}/${id}`,
        method: 'GET',
        success: function (response) {
            if (response.status) {
                dados = response.message[0]
                $('#nomeGrupoModal').val(dados.nome)
                dados.perm_usuarios ? $('#permUsuarioModal').prop('checked', 'checked') : ''
                dados.perm_produtos ? $('#permProdutosModal').prop('checked', 'checked') : ''
                dados.perm_grupos ? $('#permGruposModal').prop('checked', 'checked') : ''
                dados.perm_dashboard ? $('#permDashboardModal').prop('checked', 'checked') : ''
                dados.perm_inventario ? $('#permInventarioModal').prop('checked', 'checked') : ''
                dados.perm_controle ? $('#permControleModal').prop('checked', 'checked') : ''
                dados.perm_categorias ? $('#permCategoriasModal').prop('checked', 'checked') : ''
                $('.btnGrupo').attr('onclick', 'editarGrupo(' + id + ')')
                $('#modalGrupos').modal('show')
            } else {
                toastr.warning(response.message)
            }
        }
    })
}


openModalRemoverGrupo = (id) => {
    if (!inventario) {
        $('.btnExclusaoGrupo').attr('onclick', 'removerGrupo(' + id + ')')
        $('#modalExclusaoGrupo').modal('show')
    } else {
        toastr.warning('Inventário em andamento, não é possível excluir o grupo!')
    }
}

editarGrupo = (id) => {
    grupo = {
        nome: $('#nomeGrupoModal').val(),
        pUsuario: $('#permUsuarioModal').prop('checked') ? 1 : 0,
        pProduto: $('#permProdutosModal').prop('checked') ? 1 : 0,
        pGrupo: $('#permGruposModal').prop('checked') ? 1 : 0,
        pDashboard: $('#permDashboardModal').prop('checked') ? 1 : 0,
        pInventario: $('#permInventarioModal').prop('checked') ? 1 : 0,
        pControle: $('#permControleModal').prop('checked') ? 1 : 0,
        pCategorias: $('#permCategoriasModal').prop('checked') ? 1 : 0
    }

    grupo.nome = grupo.nome.replace(/'/g, '');

    $.ajax({
        url: `${urlGrupo}/${id}`,
        method: 'PUT',
        data: {
            grupo
        },
        success: function (response) {
            if (response.status) {
                $(`#tbGrupos tbody #tr${id} .nomeGrupo`).text(response.data.nome)
                $(`#tbGrupos tbody #tr${id} .pUsuario`).html(parseInt(response.data.pUsuario) ? '<i style="color:green" class="fa fa-check"></i>' : '<i style="color: red"class="fa fa-times"></i>')
                $(`#tbGrupos tbody #tr${id} .pProduto`).html(parseInt(response.data.pProduto) ? '<i style="color:green" class="fa fa-check"></i>' : '<i style="color: red"class="fa fa-times"></i>')
                $(`#tbGrupos tbody #tr${id} .pDashboard`).html(parseInt(response.data.pDashboard) ? '<i style="color:green" class="fa fa-check"></i>' : '<i style="color: red"class="fa fa-times"></i>')
                $(`#tbGrupos tbody #tr${id} .pGrupo`).html(parseInt(response.data.pGrupo) ? '<i style="color:green" class="fa fa-check"></i>' : '<i style="color: red"class="fa fa-times"></i>')
                $(`#tbGrupos tbody #tr${id} .pInventario`).html(parseInt(response.data.pInventario) ? '<i style="color:green" class="fa fa-check"></i>' : '<i style="color: red"class="fa fa-times"></i>')
                $(`#tbGrupos tbody #tr${id} .pControle`).html(parseInt(response.data.pControle) ? '<i style="color:green" class="fa fa-check"></i>' : '<i style="color: red"class="fa fa-times"></i>')
                $(`#tbGrupos tbody #tr${id} .pCategorias`).html(parseInt(response.data.pCategorias) ? '<i style="color:green" class="fa fa-check"></i>' : '<i style="color: red"class="fa fa-times"></i>')
                $('#modalGrupos').modal('hide')
                toastr.success(response.message)
            } else {
                toastr.warning(response.message)
            }
        }
    })
}

removerGrupo = (id) => {
    $.ajax({
        url: `${urlGrupo}/delete/${id}`,
        method: 'PUT',
        data: { inventario, id },
        success: function (response) {
            if (response.status) {
                $(`#tbGrupos tbody #tr${id}`).remove()
                toastr.success(response.data.message)
                $('#modalExclusaoGrupo').modal('hide')
            } else {
                toastr.warning('Erro ao excluir grupo')
            }
        }
    })
}
