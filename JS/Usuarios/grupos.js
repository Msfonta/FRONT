const urlGrupo = "http://localhost:3000/grupo"

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

    var dadosUsuario = JSON.parse(localStorage.getItem('dadosUsuario'))

    if (window.location.href == 'http://localhost/projetoMHR/grupos.html') {
        if (!dadosUsuario || dadosUsuario.id_grupo != 4) {
            irNaoAutorizado()
        } else {
            $('.accountName').append(dadosUsuario.nome)
            $('.nomeCompleto').val(dadosUsuario.nome)
            $('.emailUsuario').val(dadosUsuario.email)
            if (dadosUsuario.id_grupo != 4) {
                $('.listaUsuarios').css('display', 'none')
            }
            getListaGrupos()
        }
    }
})

getGrupos = () => {
    axios.get(`${urlGrupo}/grupos`)
        .then(response => {
            response.data.forEach(dado => {
                $('#grupoUsuario').append(`<option value=${dado.id}>${dado.nome}</option>`)
            })
        })
}

showAddGrupo = () => {
    $('.btnAddGroup').attr('disabled', true)
    $('.btnSalvarGrupo').attr('onclick', 'salvarGrupo()')
    $('#idCadastroGrupo').css('display', 'inline')
}

salvarGrupo = () => {
    nome = $('#nomeGrupo').val()
    checkDashboard = $('#checkDashboard').prop('checked') ? 1 : 0
    checkUsuarios = $('#checkUsuarios').prop('checked') ? 1 : 0
    checkProdutos = $('#checkProdutos').prop('checked') ? 1 : 0
    checkControleUsuarios = $('#checkControleUsuarios').prop('checked') ? 1 : 0

    axios.post(`${urlGrupo}`, {
        nome,
        checkDashboard,
        checkProdutos,
        checkUsuarios,
        checkControleUsuarios
    })
        .then(response => {
            if (response.data.status) {
                toastr.success(response.data.message)
                $('#tbGrupos tbody').html('')
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
    axios.get(`${urlGrupo}`)
        .then(response => {
            response.data.forEach(dado => {
                $('#tbGrupos tbody').append(`<tr id="tr${dado.id}"><td class="idGrupo">${dado.id}</td><td class="nomeGrupo">${dado.nome}</td><td class="pUsuario" align="center">${dado.perm_usuarios ? '<i style="color:green" class="fa fa-check"></i>' : '<i style="color: red"class="fa fa-times"></i>'}</td><td class="pProduto" align="center">${dado.perm_produtos ? '<i style="color:green" class="fa fa-check"></i>' : '<i style="color: red"class="fa fa-times"></i>'}</td><td class="pDashboard" align="center">${dado.perm_dashboard ? '<i style="color:green" class="fa fa-check"></i>' : '<i style="color: red"class="fa fa-times"></i>'}</td><td class="pGrupo" align="center">${dado.perm_grupos ? '<i style="color:green" class="fa fa-check"></i>' : '<i style="color: red"class="fa fa-times"></i>'}</td><td align="center"><a id="editarGrupo${dado.id}" onclick="openModalEditarGrupo(${dado.id})" style="cursor:pointer;" class="on-default edit-row"><i style="color:orange" class="fa fa-pencil"></i></a></td></td><td align="center"><a id="removerGrupo${dado.id}" onclick="openModalRemoverGrupo(${dado.id})" style="cursor:pointer;" class="on-default edit-row"><i style="color:red" class="fa fa-trash-o"></i></a></td></td>`)
            })
        })
}

openModalEditarGrupo = (id) => {
    $('#permUsuarioModal').prop('checked', false)
    $('#permProdutosModal').prop('checked', false)
    $('#permGruposModal').prop('checked', false)
    $('#permDashboardModal').prop('checked', false)

    axios.get(`${urlGrupo}/${id}`)
        .then(response => {
            dados = response.data[0]
            $('#nomeGrupoModal').val(dados.nome)
            dados.perm_usuarios == 1 ? $('#permUsuarioModal').prop('checked', 'checked') : ''
            dados.perm_produtos == 1 ? $('#permProdutosModal').prop('checked', 'checked') : ''
            dados.perm_grupos == 1 ? $('#permGruposModal').prop('checked', 'checked') : ''
            dados.perm_dashboard == 1 ? $('#permDashboardModal').prop('checked', 'checked') : ''
        })
    $('.btnGrupo').attr('onclick', 'editarGrupo(' + id + ')')
    $('#modalGrupos').modal('show')
}


openModalRemoverGrupo = (id) => {
    $('.btnExclusaoGrupo').attr('onclick', 'removerGrupo(' + id + ')')
    $('#modalExclusaoGrupo').modal('show')
}

editarGrupo = (id) => {
    nome = $('#nomeGrupoModal').val()
    pUsuario = $('#permUsuarioModal').prop('checked') ? 1 : 0
    pProduto = $('#permProdutosModal').prop('checked') ? 1 : 0
    pGrupo = $('#permGruposModal').prop('checked') ? 1 : 0
    pDashboard = $('#permDashboardModal').prop('checked') ? 1 : 0

    axios.put(`${urlGrupo}/${id}`, {
        nome,
        pUsuario,
        pProduto,
        pGrupo,
        pDashboard
    })
        .then(response => {
            if (response.status == 200) {
                $(`#tbGrupos tbody #tr${id} .nomeGrupo`).text(response.data.nome)
                $(`#tbGrupos tbody #tr${id} .pUsuario`).html(response.data.pUsuario ? '<i style="color:green" class="fa fa-check"></i>' : '<i style="color: red"class="fa fa-times"></i>')
                $(`#tbGrupos tbody #tr${id} .pProduto`).html(response.data.pProduto ? '<i style="color:green" class="fa fa-check"></i>' : '<i style="color: red"class="fa fa-times"></i>')
                $(`#tbGrupos tbody #tr${id} .pDashboard`).html(response.data.pDashboard ? '<i style="color:green" class="fa fa-check"></i>' : '<i style="color: red"class="fa fa-times"></i>')
                $(`#tbGrupos tbody #tr${id} .pGrupo`).html(response.data.pGrupo ? '<i style="color:green" class="fa fa-check"></i>' : '<i style="color: red"class="fa fa-times"></i>')
                $('#modalGrupos').modal('hide')
                toastr.success('Grupo atualizado com sucesso!')
            } else {
                toastr.warning('Erro ao atualizar grupo')
            }

        })
}

removerGrupo = (id) => {
    axios.put(`${urlGrupo}/delete/${id}`)
        .then(response => {
            if (response.data.status) {
                $(`#tbGrupos tbody #tr${id}`).remove()
                toastr.success(response.data.message)
                $('#modalExclusaoGrupo').modal('hide')
            } else {
                toastr.warning('Erro ao excluir grupo')
            }
        })
}
