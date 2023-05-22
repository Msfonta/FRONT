const urlEstoque = "http://localhost:3000/estoque"

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

    $('#dtValidadeEstoque').flatpickr({
        enableTime: true,
        mode: 'range',
        time_24hr: true,
        dateFormat: 'd-m-Y H:i',
        defaultHour: 0
    })

    var url = window.location.href

    if (url.split('localhost:5500/')[1] == 'controle.html') {
        getEstoque()
    }
})


EntradaSaidaProdutos = () => {
    $('#idCadastroProduto').each(function () {
        this.reset()
    })

    $('.selectProdutos').empty()
    axios.get(urlProduto)
        .then(response =>
            response.data.forEach(produto => {
                $('.selectProdutos').append(`<option value=${produto.id}>${produto.nome}</option>`)
            }))
    $('.selectProdutos').prepend('<option selected disabled>Selecione...</option>')
    $('#ModalControleEstoque').modal('show')
}

InfoProduto = () => {
    $('#codigoProdutoEstoque').val('')
    $('#marcaProdutoEstoque').val('')
    $('#categoriaProdutoEstoque').val('')
    produto = $('.selectProdutos option:selected').val()

    axios.get(`${urlProduto}/${produto}`)
        .then(response => {
            dados = response.data[0]
            $('#codigoProdutoEstoque').val(dados.id)
            $('#marcaProdutoEstoque').val(dados.marca)
            $('#categoriaProdutoEstoque').val(dados.categoriaproduto)
        })
}

EntradaProduto = (operacao) => {
    id = $('.selectProdutos option:selected').val()
    usuario = JSON.parse(localStorage.getItem('dadosUsuario'))

    axios.put(`${urlEstoque}/:id`, {
        id,
        operacao,
        usuario
    })
        .then(response => {
            if (response.data.status) {
                toastr.success(response.data.message)
                searchEstoque()
                $('#ModalControleEstoque').modal('hide')
            } else {
                toastr.warning(response.data.message)
            }
        })
}

getEstoque = () => {
    axios.get(urlEstoque)
        .then(response => {
            response.data.forEach(dado => {
                $('#tbControle tbody').append(`<tr id=tr${dado.id}><td class="id">${dado.id}</td><td class=nome>${dado.nomeproduto}</td><td class="marca">${dado.marca}</td><td class="categoria">${dado.categoria}</td><td class="operacao">${dado.operacao == 2 ? '<i style="color: green" class="fa fa-arrow-down" aria-hidden="true"></i>' : '<i style="color:red" class="fa fa-arrow-up" aria-hidden="true"></i>'}</td><td class="horario">${moment(dado.dataOperacao).format('DD/MM/YYYY HH:mm')}</td><td class="usuario">${dado.nomeusuario}</td></tr>`)
            })
        })
}

searchEstoque = () => {
    dataInicial = $('#dtValidadeEstoque').val().split(' to ')[0]
    dataFinal = $('#dtValidadeEstoque').val().split(' to ')[1]
    busca = $('#inputProduto').val()
    operacao = $('#selectOperacao').val()

    axios.get(`${urlEstoque}/produto`, {
        params: {
            dataInicial,
            dataFinal,
            busca,
            operacao
        }
    })
        .then(response => {
            $('#tbControle tbody').html('')
            response.data.forEach(dado => {
                $('#tbControle tbody').append(`<tr id=tr${dado.id}><td class="id">${dado.id}</td><td class=nome>${dado.nomeproduto}</td><td class="marca">${dado.marca}</td><td class="categoria">${dado.categoria}</td><td class="operacao">${dado.operacao == 2 ? '<i style="color: green" class="fa fa-arrow-up" aria-hidden="true"></i>' : '<i style="color:red" class="fa fa-arrow-down" aria-hidden="true"></i>'}</td><td class="horario">${moment(dado.dataOperacao).format('DD/MM/YYYY HH:mm')}</td><td class="usuario">${dado.nomeusuario}</td></tr>`)
            })
        })
}
