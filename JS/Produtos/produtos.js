const urlProduto = "http://localhost:3000/produto"

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

    if (url.split('localhost:5500/')[1] == 'produtos.html') {
        getProdutos()
    }
})
getListaCategorias = () => {
    axios.get(`${urlCategoria}/`)
        .then(response => {
            response.data.forEach(dado => {
                $('#categoriaProduto').append(`<option value=${dado.id}>${dado.nome}</option>`)
            })
        })
}

openModalProduto = () => {
    $('#modalProdutoLabel').text('').append('Cadastrar Produto')
    $('#formCadastroProduto').each(function () {
        this.reset()
    })
    $('.btnSalvarProduto').attr('onclick', 'cadastrarProduto()')
    $('#categoriaProduto').html('')
    getListaCategorias()
    $('#codigoProduto').attr('disabled', false)
    $('#ModalProduto').modal('show')
}


cadastrarProduto = () => {
    nome = $('#nomeProduto').val()
    codigoSKU = $('#codigoProduto').val()
    dtValidade = $('#dtValidadeProduto').val()
    quantidade = $('#qtdeProduto').val()
    itensPCaixa = $('#itensCaixa').val()
    pesoLiquido = $('#pesoLiquidoProduto').val()
    pesoBruto = $('#pesoBrutoProduto').val()
    marca = $('#marcaProduto').val()
    categoria_id = $('#categoriaProduto').val()

    axios.post(`${urlProduto}/cadastro`, {
        nome,
        codigoSKU,
        dtValidade,
        quantidade,
        itensPCaixa,
        pesoLiquido,
        pesoBruto,
        marca,
        categoria_id
    }).then(response => {
        if (response.data.status) {
            $('#tbProdutos tbody').html('')
            getProdutos()
            toastr.success('Produto cadastrado com sucesso!')
            $('#ModalProduto').modal('hide')
        }
    })

}

getProdutos = () => {
    axios.get(`${urlProduto}`)
        .then(response => {
            response.data.forEach(dado => {
                $('#tbProdutos tbody').append(`<tr id=tr${dado.id}><td class="id">${dado.id}</td><td class="nome">${dado.nome}</td><td class="marca">${dado.marca}</td><td class="tipo">${dado.categoriaproduto}</td><td class="dtValidade" >${moment(dado.dtValidade).format('DD/MM/YYYY')}</td><td align="center" class="qtde" >${dado.quantidade}</td><td class="pLiquido" >${dado.pesoLiquido}</td><td class="pBruto" >${dado.pesoBruto}</td><td align="center" class=exc>${dado.excluido == 0 ? '<i style="color:green" class="fa fa-check"></i>' : '<i style="color: red"class="fa fa-times"></i>'}</td><td align="center" ><a onclick="openModalEditarProduto(${dado.codigoSKU})" style="cursor:pointer;" class="on-default edit-row"><i id="cbEditarProduto(${dado.id})" style="color:orange" class="fa fa-pencil"></i></a></td><td align="center" ><a onclick="openModalExclusaoProduto(${dado.codigoSKU})" style="cursor:pointer;" class="on-default edit-row"><i id="cbRemoverProduto(${dado.codigoSKU})" style="color:red" class="fa fa-trash-o"></i></a></td></tr>`)
            })

        })
}

openModalExclusaoProduto = (id) => {
    $('.btnExclusaoProduto').attr('onclick', 'removerProduto(' + id + ')')
    $(`.cbRemoverProduto${id}`).prop('checked', false)
    $('#modalExclusaoProduto').modal('show')
}

openModalEditarProduto = (id) => {
    $('#modalProdutoLabel').text('').append('Editar Produto')
    getListaCategorias()

    axios.get(`${urlProduto}/${id}`)
        .then(response => {
            dados = response.data[0]
            $('#nomeProduto').val(dados.nome)
            $('#dtValidadeProduto').val(moment(dados.dtValidade).format('YYYY-MM-DD'))
            $('#qtdeProduto').val(dados.quantidade)
            $('#pesoLiquidoProduto').val(dados.pesoLiquido)
            $('#pesoBrutoProduto').val(dados.pesoBruto)
            $('#marcaProduto').val(dados.marca)
            $(`#categoriaProduto option[value=${dados.idcategoria}]`).prop('selected', 'selected')
            $('#codigoProduto').val(dados.codigoSKU).prop('disabled', 'disabled')
        })

    $(`.cbEditarProduto${id}`).prop('checked', false)
    $('.btnSalvarProduto').attr('onclick', 'editarProduto(' + id + ')')
    $('#ModalProduto').modal('show')
}

removerProduto = (id) => {
    axios.put(`${urlProduto}/delete/${id}`)
        .then(response => {
            if (response.data.status) {
                $(`.#tbProdutos tbody #tr${id}`).remove()
                toastr.success('Usuário removido com sucesso!')
                $('#modalExclusaoProduto').modal('hide')
            }
        })
}

editarProduto = (id) => {
    produto = {
        nome: $('#nomeProduto').val(),
        dtValidade: $('#dtValidadeProduto').val(),
        qtde: $('#qtdeProduto').val(),
        liquido: $('#pesoLiquidoProduto').val(),
        bruto: $('#pesoBrutoProduto').val(),
        marca: $('#marcaProduto').val(),
        tipo: $('#tipoProduto').val()
    }

    axios.put(`${urlProduto}/${id}`, {
        produto: produto
    })
        .then(response => {
            if (response.status = 200) {
                $(`#tbProdutos tbody #tr${id} .nome`).text(response.data.nome)
                $(`#tbProdutos tbody #tr${id} .dtValidade`).text(moment(response.data.dtValidade).format('DD/MM/YYYY'))
                $(`#tbProdutos tbody #tr${id} .qtde`).text(response.data.qtde)
                $(`#tbProdutos tbody #tr${id} .itensCaixa`).text(response.data.itensCaixa)
                $(`#tbProdutos tbody #tr${id} .pLiquido`).text(response.data.liquido)
                $(`#tbProdutos tbody #tr${id} .bruto`).text(response.data.bruto)
                $(`#tbProdutos tbody #tr${id} .marca`).text(response.data.marca)
                toastr.success('Produto atualizado com sucesso!')
                $('#ModalProduto').modal('hide')
            }
        })
}
