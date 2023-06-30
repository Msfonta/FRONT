let urlEstoque = "http://localhost:3000/estoque"
// let urlProduto = "http://localhost:3000/produto"
inventario = false
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

    $('#dtValidadeEstoque').flatpickr({
        mode: 'range',
        time_24hr: true,
        dateFormat: 'd-m-Y',
        defaultHour: 'today'
    })

    dadosUser = JSON.parse(localStorage.getItem('dadosUsuario'))
    if (window.location.href == 'http://localhost/projetoMHR/controle.html') {
        if (dadosUser) {

            buscarPermissao(dadosUser.email, dadosUser.senha).then(
                function (response) {
                    if (response.status) {
                        if (response.message[0].perm_controle) {
                            inventario = JSON.parse(localStorage.getItem('inventario'))
                            if (inventario) {
                                $('.divInventario h4').css('display', 'block')
                            }
                            getEstoque()
                            $('.accountName').append(dadosUser.nome)
                            $('.nomeCompleto').val(dadosUser.nome)
                            $('.emailUsuario').val(dadosUser.email)

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


EntradaSaidaProdutos = () => {
    if (inventario) {
        $('.btnSaidaEstoque').css('pointer-events', 'none')
        $('.btnEntradaEstoque').css('pointer-events', 'none')
    }
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

    $.ajax({
        url: `${urlProduto}/${produto}`,
        method: 'GET',
        success: function (response) {
            if (response.status) {
                dados = response.message[0]
                $('#codigoProdutoEstoque').val(dados.id)
                $('#marcaProdutoEstoque').val(dados.marca)
                $('#categoriaProdutoEstoque').val(dados.nomecategoria)
            }
        }
    })
}

EntradaProduto = (operacao) => {
    id = $('.selectProdutos option:selected').val()
    usuario = JSON.parse(localStorage.getItem('dadosUsuario'))

    axios.put(`${urlEstoque}/${id}`, {
        id,
        operacao,
        usuario,
        inventario
    })
        .then(response => {
            if (response.data.status) {
                toastr.success(response.data.message)
                $('#tbControle tbody').html('')
                getEstoque()
                $('#ModalControleEstoque').modal('hide')
            } else {
                toastr.warning(response.data.message)
                $('#ModalControleEstoque').modal('hide')
            }
        })
}

getEstoque = () => {
    let contador = 1
    $.ajax({
        url: urlEstoque,
        method: 'GET',
        success: function (response) {
            response.message.forEach(dado => {
                $('#tbControle tbody').append(`<tr id=tr${dado.id}><td>${contador}</td><td class=nome>${dado.nomeproduto}</td><td class="marca">${dado.marca}</td><td class="categoria">${dado.categoria}</td><td class="operacao">${dado.operacao == 2 ? '<i style="color: green" class="fa fa-arrow-down" aria-hidden="true"></i>' : '<i style="color:red" class="fa fa-arrow-up" aria-hidden="true"></i>'}</td><td class="horario">${moment(dado.dataOperacao).format('DD/MM/YYYY HH:mm')}</td><td class="usuario">${dado.nomeusuario}</td></tr>`)
                contador++
            })
        }
    })
}

searchEstoque = () => {
    let contador = 1
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
                $('#tbControle tbody').append(`<tr id=tr${dado.id}><td>${contador}</td><td class=nome>${dado.nomeproduto}</td><td class="marca">${dado.marca}</td><td class="categoria">${dado.categoria}</td><td class="operacao">${dado.operacao == 2 ? '<i style="color: green" class="fa fa-arrow-up" aria-hidden="true"></i>' : '<i style="color:red" class="fa fa-arrow-down" aria-hidden="true"></i>'}</td><td class="horario">${moment(dado.dataOperacao).format('DD/MM/YYYY HH:mm')}</td><td class="usuario">${dado.nomeusuario}</td></tr>`)
                contador++
            })
        })
}

getPdfEstoque = () => {
    dataInicial = $('#dtValidadeEstoque').val().split(' to ')[0]
    dataFinal = $('#dtValidadeEstoque').val().split(' to ')[1]
    busca = $('#inputProduto').val()
    operacao = $('#selectOperacao').val()

    if ($('.circleSpin').css('display') == 'none') {
        $('.circleSpin').css('display', 'inline-block')
    }


    $('#ModalLoadingRel').modal('show')

    axios.get(`${urlEstoque}/relatorio`, {
        params: {
            dataInicial,
            dataFinal,
            busca,
            operacao
        },
    })
        .then(async response => {
            if (response.status = 200) {
                await $('#ModalLoadingRel .modal-body').append(`<a><button class="btnPDF btn btn-success" onclick="downloadPdf('${response.data.message.filename}')">Download PDF</button></a>`)
                await $('.circleSpin').css('display', 'none')

            }
        })
}


downloadPdf = (link) => {
    axios.get(`${urlEstoque}/download`, {
        params: {
            link
        },
        responseType: 'blob'
    }).
        then(response => {
            if (response.status = 200) {
                const blob = new Blob([response.data], { type: 'application/pdf' })
                const urll = window.URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.style.display = 'none'
                a.href = urll
                a.download = 'estoque.pdf'
                a.click()
                window.URL.revokeObjectURL(urll)
                $('#ModalLoadingRel .modal-body a')[0].remove('button')
                $('#ModalLoadingRel').modal('hide')
                toastr.success('PDF Gerado com sucesso!')
            }
        })
}
