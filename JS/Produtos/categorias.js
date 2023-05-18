const urlCategoria = "http://localhost:3000/categoria"

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
    var url = window.location.href

    if (url.split('localhost:5500/')[1] == 'categorias.html') {
        getCategorias()
    }

})

getCategorias = () => {
    axios.get(`${urlCategoria}/`)
        .then(response => {
            response.data.forEach(dado => {
                $('#tbCategorias tbody').append(`<tr id=tr${dado.id}><td class="id">${dado.id}</td><td class="nome">${dado.nome}</td><td align="center"><a id="editarGrupo" onclick="showEditarCategoria(${dado.id})" style="cursor:pointer;" class="on-default edit-row"><i style="color:orange" class="fa fa-pencil"></i></a></td><td align="center"><a id="removerCategoria" onclick="showRemoverCategoria(${dado.id})" style="cursor:pointer;" class="on-default edit-row"><i style="color:red" class="fa fa-trash-o"></i></a></td></tr>`)
            })
        })
}

showRemoverCategoria = (id) => {
    $('#modalExclusaoCategoria').modal('show')
    $('.btnExclusaoCategoria').attr('onclick', `removerCategoria(${id})`)
}

showAddCategoria = () => {
    $('#nomeCategoria').val('')
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
        nome
    })
        .then(response => {
            if (response.data.status) {
                $('#tbCategorias tbody').html('')
                getCategorias()
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
                toastr.success(response.data.message)
                $('#idCadastroCategoria').css('display', 'none')
            } else {
                toastr.warning(response.data.message)
            }
        })
        .catch((error => console.log(error)))
}

removerCategoria = (id) => {
    axios.put(`${urlCategoria}/delete/${id}`)
    .then(response => {
        if(response.data.status) {
            toastr.success(response.data.message)
            $(`#tbCategorias tbody #tr${id}`).remove()
            $('#modalExclusaoCategoria').modal('hide')
        } else {
            toastr.warning(response.data.message)
        }
    }).catch(error => toastr.error(error))
}