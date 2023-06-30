const urlProduto = "http://localhost:3000/produto"
urlComposto = "http://localhost:3000/composto"

let quantidadeProdutos = false;
inventario = false
dadosUser = false

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

    if (window.location.href == 'http://localhost/projetoMHR/produtos.html') {
        if (dadosUser) {
            buscarPermissao(dadosUser.email, dadosUser.senha).then(
                function (response) {
                    if (response.status) {
                        if (response.message[0].perm_produtos) {
                            inventario = JSON.parse(localStorage.getItem('inventario'))
                            if (inventario) {
                                $('.divInventario h4').css('display', 'block')
                            }
                            $('.accountName').append(dadosUser.nome)
                            $('.nomeCompleto').val(dadosUser.nome)
                            $('.emailUsuario').val(dadosUser.email)
                            getProdutos()
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

getListaCategorias = (tipo) => {
    $.ajax({
        url: `${urlCategoria}`,
        method: 'GET',
        data: {
            tipo
        }, success: function (response) {
            $('#categoriaProduto').prepend('<option value="0" disabled>Selecione...</option>')
            response.data.forEach(dado => {
                if (tipo == 1) {
                    $('#categoriaProduto').append(`<option value=${dado.id}>${dado.nome}</option>`)
                } else {
                    $('#categoriaProdutoCpt').append(`<option value=${dado.id}>${dado.nome}</option>`)
                }
            })
        }
    })

}

openModalProduto = () => {
    $('#modalProdutoLabel').text('').append('Cadastrar Produto Simples')
    $('#formCadastroProduto').each(function () {
        this.reset()
    })
    $('.btnSalvarProduto').attr('onclick', 'cadastrarProduto()')
    $('#categoriaProduto').html('')
    getListaCategorias(1)
    $('#codigoProduto').attr('disabled', false)
    $('#ModalProduto').modal('show')
}

getInfoProduto = (contador = 0) => {
    id = $(`.selectProdutoCpt${contador} option:selected`).val()
    $.ajax({
        url: `${urlProduto}/${id}`,
        method: 'GET',
        success: function (response) {
            if (response.status) {
                dados = response.message[0]
                $(`.selectProdutoCpt${contador}`).attr('disabled', true)
                $(`#codigoProdutoCpt${contador}`).text(dados.id)
                for (i = 1; i <= dados.quantidade; i++) {
                    $(`.selectQtdeCpt${contador}`).append(`<option value="${i}">${i}</option>`)
                }
                $(`#qtdeProdutoCpt${contador}`).val(1)
                contador++;
            } else {
                toastr.warning(response.message)
            }
        }
    })

}
cadastrarProduto = () => {
    produto = {
        nome: $('#nomeProduto').val(),
        codigoSKU: $('#codigoProduto').val(),
        dtValidade: $('#dtValidadeProduto').val(),
        quantidade: $('#qtdeProduto').val(),
        pesoLiquido: $('#pesoLiquidoProduto').val(),
        pesoBruto: $('#pesoBrutoProduto').val(),
        marca: $('#marcaProduto').val(),
        categoria_id: $('#categoriaProduto').val()
    }

    produto.nome = produto.nome.replace(/'/g, '');
    produto.marca = produto.marca.replace(/'/g, '');

    axios.post(`${urlProduto}/cadastro`, {
        produto
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
    let contador = 1
    axios.get(`${urlProduto}`)
        .then(response => {
            response.data.forEach(dado => {
                $('#tbProdutos tbody').append(`<tr id=tr${dado.id}><td class="id">${contador}</td><td class="nome">${dado.nome}</td><td class="marca">${dado.marca}</td><td class="tipo">${dado.categoriaproduto}</td><td class="dtValidade" >${dado.dtValidade ? moment(dado.dtValidade).format('DD/MM/YYYY') : ''}</td><td align="center" class="qtde">${dado.quantidade}</td><td align="center" class=exc>${dado.excluido == 0 ? '<i style="color:green" class="fa fa-check"></i>' : '<i style="color: red"class="fa fa-times"></i>'}</td><td align="center" >${dado.pcomposto ? `<a onclick="openModalEditarProdutoCpt(${dado.id}, ${dado.pcomposto})" style=${inventario ? "pointer-events:none;" : "cursor:pointer;"} class="on-default edit-row"><i id="cbEditarProduto(${dado.id})" style="color:orange" class="fa fa-pencil"></i></a> ` : `<a onclick="openModalEditarProduto(${dado.id})" style=${inventario ? "pointer-events:none;" : "cursor:pointer;"} class="on-default edit-row"><i id="cbEditarProduto(${dado.id})" style="color:orange" class="fa fa-pencil"></i></a>`}</td><td align="center" ><a onclick="openModalExclusaoProduto(${dado.id})" style=${inventario ? "pointer-events:none;" : "cursor:pointer;"} class="on-default edit-row"><i id="cbRemoverProduto(${dado.id})" style="color:red" class="fa fa-trash-o"></i></a></td></tr>`)
                contador++
            })

        })
}

openModalExclusaoProduto = (id) => {
    $('.btnExclusaoProduto').attr('onclick', 'removerProduto(' + id + ')')
    $(`.cbRemoverProduto${id}`).prop('checked', false)
    $('#modalExclusaoProduto').modal('show')
}

openModalEditarProduto = (id) => {
    $('#modalProdutoLabel').text('').append('Editar Produto Simples')


    $.ajax({
        url: `${urlProduto}/${id}`,
        method: 'GET',
        success: function(response){
            if(response.status){
                dados = response.message[0]
                $('#nomeProduto').val(dados.nome)
                $('#dtValidadeProduto').val(moment(dados.dtValidade).format('YYYY-MM-DD'))
                $('#qtdeProduto').val(dados.quantidade).attr('disabled', 'disabled')
                $('#pesoLiquidoProduto').val(dados.pesoLiquido)
                $('#pesoBrutoProduto').val(dados.pesoBruto)
                $('#marcaProduto').val(dados.marca)
                $('#categoriaProduto option').text(dados.nomecategoria).val(dados.categoria)
                $('#codigoProduto').val(dados.id).prop('disabled', 'disabled')
            } else {
                toastr.warning(response.message)
            }
        }
    })

    $(`.cbEditarProduto${id}`).prop('checked', false)
    $('.btnSalvarProduto').attr('onclick', 'editarProduto(' + id + ')')
    $('#ModalProduto').modal('show')
}

removerProduto = (id) => {
    $.ajax({
        method: 'PUT',
        url: `${urlProduto}/delete/${id}`,
        data: { inventario },
        success: function (response) {
            if (response.status) {
                $(`#tbProdutos tbody #tr${id}`).remove()
                toastr.success(response.message)
                $('#modalExclusaoProduto').modal('hide')
            } else {
                toastr.warning(response.message)
                $('#modalExclusaoProduto').modal('hide')
            }
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
    }

    produto.nome = produto.nome.replace(/'/g, '');
    produto.marca = produto.marca.replace(/'/g, '');

    axios.put(`${urlProduto}/${id}`, {
        produto,
        inventario
    })
        .then(response => {
            if (response.data.status) {
                $(`#tbProdutos tbody #tr${id} .nome`).text(response.data.produto.nome)
                $(`#tbProdutos tbody #tr${id} .dtValidade`).text(moment(response.data.produto.dtValidade).format('DD/MM/YYYY'))
                $(`#tbProdutos tbody #tr${id} .qtde`).text(response.data.produto.qtde)
                $(`#tbProdutos tbody #tr${id} .pLiquido`).text(response.data.produto.liquido)
                $(`#tbProdutos tbody #tr${id} .bruto`).text(response.data.produto.bruto)
                $(`#tbProdutos tbody #tr${id} .marca`).text(response.data.produto.marca)
                toastr.success('Produto atualizado com sucesso!')
                $('#ModalProduto').modal('hide')
            } else {
                toastr.warning(response.data.message)
                $('#ModalProduto').modal('hide')
            }
        })
}

openModalInserirProdutoCpt = () => {
    $('.btnSalvarComposto').attr('disabled', true)
    $('#modalProdutoCptLabel').text('').append('Cadastrar Produto Composto')
    $('#formCadastroProdutoCpt').each(function () {
        this.reset()
    })
    $('#categoriaProdutoCpt').html('')

    axios.get(urlProduto, {
        params: {
            composto: 0
        }
    })
        .then(response => {
            if (!response.data.length) {
                toastr.warning('Sem produto disponível para criar um Produto Composto!')
            } else {
                $('.selectProdutoCpt0').empty().attr('disabled', false)
                getListaCategorias(2)
                axios.get(urlProduto, {
                    params: {
                        composto: 0
                    }
                })
                    .then(response =>
                        response.data.forEach(produto => {
                            $('.selectProdutoCpt0').append(`<option value=${produto.id}>${produto.nome}</option>`)
                        }))
                $('#categoriaProdutoCpt').prepend('<option value="0" disabled selected>Selecione...</option>')
                $('.selectProdutoCpt0').prepend('<option selected disabled>Selecione...</option>')
                $('#btnListaProdutoComposto').attr('onclick', 'listaProdutoComposto(1)')
                $('#ModalProdutoCpt').modal('show')
            }
        })
}

let contador = 0
listaProdutoComposto = (modal) => {
    $('.btnSalvarComposto').attr('disabled', false)
    $('#divAdicionalProdutoSimples').append(`<div class="row divProdutoSimples" id="prod${contador}" style="display: flex;align-items: center;">
            <label for="nomeProdutoCpt" class="col-sm-1">Produto</label>
            <div class="col-sm-3">
                <select onchange="getInfoProduto(${contador})" class="selectProdutoCpt${contador} form-select">
                </select>
            </div>
            <label for="codigoProdutoCpt${contador}" class="col-sm-1">Código:</label>
                <div class="col-sm-4">
                <span style="font-size: 20px; font-weight: bold;" id="codigoProdutoCpt${contador}"></span>
                </div>
            <label for="qtdeProdutoCpt${contador}" class="col-sm-1">Qtde</label>
            <div class="col-sm-2">
                <input type="number" class="form-control" id="qtdeProdutoCpt${contador}" required min="1">
            </div>
            <div id="divAddProduto${contador}" class="col-sm-3" style="display:flex; justify-content:space-between;">
                <button id="removeComposto${contador}" onclick="removeProdutoListaComposto(${contador})" type="button" class="btn btn-danger"><i class="fa fa-times"></i></button>
            </div>
        </div>`);

    $(`.selectProdutoCpt${contador}`).prepend('<option value="0" selected disabled>Selecione...</option>')

    $.ajax({
        url: urlProduto,
        method: 'GET',
        data: {
            composto: 0
        },
        success: function (response) {
            response.forEach(produto => {
                $(`.selectProdutoCpt${contador}`).append(`<option value="${produto.id}">${produto.nome}</option>`);
            });
            contador++;
            if (modal) {
                $('.btnSalvarComposto').attr('onclick', `salvarComposto(${contador})`)
            }

        }
    });

    $('#ModalProdutoCpt').on('hidden.bs.modal', function () {
        contador = 0;
    });
}

removeProdutoListaComposto = (cont) => {
    if ($('.divProdutoSimples').length > 1 || $('#prod1 input[type=number]').val() == '') {
        $(`#prod${cont}`).remove()
    } else {
        toastr.warning('Não foi possível excluir!')
    }
}

closeModalProdutoCpt = () => {
    $('#formCadastroProdutoCpt')[0].reset()
    $('#divAdicionalProdutoSimples').empty()
    $('.produtosCompostos').css('pointer-events', 'all')
    $('#btnAdicionarProdutoSimples span').remove()
}

salvarComposto = () => {
    valores = []
    let quantidade = $('.divProdutoSimples').length
    for (i = 0; i < quantidade; i++) {
        $('.divProdutoSimples').eq(i).addClass(`classProduto${i}`)
        valores[i] = { cod: $(`.classProduto${i} select option:selected`).val(), qtde: parseInt($(`.classProduto${i} input`).val()) }
        if (!valores[i].cod || !valores[i].qtde) {
            toastr.warning('Não foi possivel cadastrar este produto pois tem valores vazios!')
            return
        }
    }
    composto = {
        valores,
        nome: $('#nomeProdutoCpt').val(),
        codigoSKU: $('#codProdutoCpt').val(),
        dtValidade: $('#dtValidadeProdutoCpt').val(),
        qntde: $('#qtdeProdutoCpt').val(),
        pesoLiquido: $('#pesoLiquidoProdutoCpt').val(),
        pesoBruto: $('#pesoBrutoProdutoCpt').val(),
        marca: $('#marcaProdutoCpt').val(),
        categoria_id: $('#categoriaProdutoCpt').val()
    }

    composto.nome = composto.nome.replace(/'/g, '');
    composto.marca = composto.marca.replace(/'/g, '');

    axios.post(`${urlProduto}/cadastrocomposto`, {
        composto
    })
        .then(response => {
            if (response.data.status) {
                $('#tbProdutos tbody').html('')
                getProdutos()
                toastr.success(response.data.message)
                closeModalProdutoCpt()
                $('#ModalProdutoCpt').modal('hide')
            } else {
                toastr.warning(response.data.message)
            }
        })
}


openModalEditarProdutoCpt = (id, idComposto) => {
    $('#modalProdutoCptLabel').text('').append('Editar Produto Composto')
    $('.btnSalvarComposto').attr('disabled', false)

    $.ajax({
        url: `${urlProduto}/${id}`,
        method: 'GET',
        success: function(response){
            if(response.status){
                dados = response.message[0]
                $('#nomeProdutoCpt').val(dados.nome)
                $('#dtValidadeProdutoCpt').val(moment(dados.dtValidade).format('YYYY-MM-DD'))
                $('#qtdeProdutoCpt').val(dados.quantidade).attr('disabled', 'disabled')
                $('#pesoLiquidoProdutoCpt').val(dados.pesoLiquido)
                $('#pesoBrutoProdutoCpt').val(dados.pesoBruto)
                $('#marcaProdutoCpt').val(dados.marca)
                $('#categoriaProdutoCpt option').text(dados.nomecategoria).val(dados.categoria)
                $('#codProdutoCpt').val(dados.id).prop('disabled', 'disabled')
                if (dados.quantidade != 0) {
                    $('.produtosCompostos').css('pointer-events', 'none')
                    $('#btnAdicionarProdutoSimples').append(`<span style="color: red; font-weight:bold;"> Não é possível editar os produtos simples pois a quantidade não está zerada! </span>`)
                }
            } else {
                toastr.warning(response.message)
            }
        }
    })

    axios.get(`${urlProduto}/composto/${idComposto}`)
        .then(response => {
            response.data.forEach(dado => {
                $('#divAdicionalProdutoSimples').append(`<div class="row divProdutoSimples" id="prod${dado.idproduto}" style="display: flex;align-items: center;">
                <label for="nomeProdutoCpt" class="col-sm-1">Produto</label>
                <div class="col-sm-3">
                    <select onchange="getInfoProduto(${contador})" class="selectProdutoCpt${contador} form-select" disabled>
                        <option value="${dado.idproduto}">${dado.nome}</option>
                    </select>
                </div>
                <label for="codigoProdutoCpt${contador}" class="col-sm-1">Código:</label>
                    <div class="col-sm-4">
                    <span style="font-size: 20px; font-weight: bold;" id="codigoProdutoCpt${contador}">${dado.codigoSKU}</span>
                    </div>
                <label for="qtdeProdutoCpt${contador}" class="col-sm-1">Qtde</label>
                <div class="col-sm-2">
                    <input type="number" class="form-control" id="qtdeProdutoCpt${dado.idproduto}" required min="1" value="${dado.quantidade}">
                </div>
                    <div class="col-sm-1">
                        <button id="removeComposto${dado.idproduto}" onclick="removerComposto(${dado.id}, ${dado.idproduto})" type="button" class="btn btn-danger"><i class="fa fa-times"></i></button>
                    </div>
            </div>`);
                contador++;
            })
        })

    $('#btnListaProdutoComposto').attr('onclick', `listaProdutoComposto(0)`)
    $(`.cbEditarProduto${id}`).prop('checked', false)
    $('.btnSalvarComposto').attr('onclick', 'editarProdutoCpt(' + id + ',' + idComposto + ')')
    $('#ModalProdutoCpt').modal('show')

}

editarProdutoCpt = (id, idComposto) => {
    valores = []
    produto = {
        nome: $('#nomeProdutoCpt').val(),
        dtValidade: $('#dtValidadeProdutoCpt').val(),
        qtde: $('#qtdeProdutoCpt').val(),
        liquido: $('#pesoLiquidoProdutoCpt').val(),
        bruto: $('#pesoBrutoProdutoCpt').val(),
        marca: $('#marcaProdutoCpt').val(),
    }
    quantidade = $('.divProdutoSimples').length
    for (i = 0; i < quantidade; i++) {
        $('.divProdutoSimples').eq(i).addClass(`classProduto${i}`)
        valores[i] = { cod: $(`.classProduto${i} select option:selected`).val(), qtde: parseInt($(`.classProduto${i} input`).val()) }
    }

    produto.nome = produto.nome.replace(/'/g, '');
    produto.marca = produto.marca.replace(/'/g, '');
    $.ajax({
        url: `${urlProduto}/composto/${id}`,
        method: 'PUT',
        data: {
            produto,
            valores,
            idComposto,
            inventario
        },
        success: function (response) {
            if (response.status) {
                $(`#tbProdutos tbody #tr${id} .nome`).text(response.prod.nome)
                $(`#tbProdutos tbody #tr${id} .dtValidade`).text(moment(response.prod.dtValidade).format('DD/MM/YYYY'))
                $(`#tbProdutos tbody #tr${id} .qtde`).text(response.prod.qtde)
                $(`#tbProdutos tbody #tr${id} .pLiquido`).text(response.prod.liquido)
                $(`#tbProdutos tbody #tr${id} .pBruto`).text(response.prod.bruto)
                $(`#tbProdutos tbody #tr${id} .marca`).text(response.prod.marca)
                closeModalProdutoCpt()
                toastr.success('Produto atualizado com sucesso!')
                $('#ModalProdutoCpt').modal('hide')
            } else {
                toastr.warning(response.message)
                $('#ModalProdutoCpt').modal('hide')
            }
        }
    })

}

updateProdutoComposto = (idComposto, idProduto) => {
    quantidade = $(`#qtdeProdutoCpt${idProduto}`).val()
    axios.put(`${urlComposto}/${idComposto}`, {
        idProduto,
        quantidade
    })
        .then(response => {
            if (response.data.status) {
                toastr.success(response.data.message)
            } else {
                toastr.warning(response.data.message)
            }
        })
}

removerComposto = (idComposto, idProduto) => {
    axios.delete(`${urlComposto}/delete/${idComposto}`, {
        data: {
            idProduto
        }
    })
        .then(response => {
            if (response.data.status) {
                $(`#prod${idProduto}`).remove()
                toastr.success(response.data.message)
            } else {
                toastr.warning(response.data.message)
            }
        })
}
