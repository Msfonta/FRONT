const urlProduto = "http://localhost:3000/produto"
let urlComposto = "http://localhost:3000/composto"
let urlCategoria = "http://localhost:3000/categoria"

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

    if (window.location.href == 'http://localhost/projetoMHR/produtos.html') {
        if (!dadosUsuario || dadosUsuario.id_grupo != 4) {
            irNaoAutorizado()
        } else {
            getProdutos()
        }
    }
})

irNaoAutorizado = () => {
    window.location.href = "pages404.html"
}

getListaCategorias = (tipo) => {
    axios.get(urlCategoria, {
        params: {
            tipo
        }
    })
        .then(response => {
            $('#categoriaProduto').prepend('<option value="0" disabled>Selecione...</option>')
            response.data.forEach(dado => {
                if (tipo == 1) {
                    $('#categoriaProduto').append(`<option value=${dado.id}>${dado.nome}</option>`)
                } else {
                    $('#categoriaProdutoCpt').append(`<option value=${dado.id}>${dado.nome}</option>`)
                }
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
    getListaCategorias(1)
    $('#codigoProduto').attr('disabled', false)
    $('#ModalProduto').modal('show')
}

openModalInserirProdutoCpt = () => {
    $('#formCadastroProdutoCpt').each(function () {
        this.reset()
    })

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
                $('.selectProdutoCpt0').prepend('<option selected disabled>Selecione...</option>')
                $('#ModalProdutoCpt').modal('show')
            }
        })
}

let count = 0
let qtde = []
getInfoProduto = () => {
    id = $(`.selectProdutoCpt${count} option:selected`).val()
    axios.get(`${urlProduto}/${id}`)
        .then(response => {
            $(`#divAddProduto${count - 1} #btnListaProdutoComposto`).remove()

            dados = response.data[0]
            $(`.selectProdutoCpt${count}`).attr('disabled', true)
            $(`#codigoProdutoCpt${count}`).text(dados.id)
            for (i = 1; i <= dados.quantidade; i++) {
                $(`.selectQtdeCpt${count}`).append(`<option value="${i}">${i}</option>`)
            }
            $(`#qtdeProdutoCpt${count}`).val(1)
            $(`#divAddProduto${count}`)
                .append(`<button id="removeComposto${count}" onclick="removeProdutoListaComposto(${count})" type="button" class="btn btn-danger"><i class="fa fa-times"></i></button>
                         <button id="btnListaProdutoComposto" onclick="listaProdutoComposto()" type="button" class="btn btn-success"><i class="fa fa-plus"></i></button>`)
            count++;
        })
}

let contador = 1;
listaProdutoComposto = () => {
    $('.divAdicionalProdutoSimples').append(`<div class="row divProdutoSimples" id="prod${contador}" style="display: flex;align-items: center;">
            <label for="nomeProdutoCpt" class="col-sm-1">Produto</label>
            <div class="col-sm-3">
                <select onchange="getInfoProduto()" class="selectProdutoCpt${contador} form-select">
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
            <div id="divAddProduto${contador}" class="col-sm-3" style="display:flex; justify-content:space-between;"></div>
        </div>`);

    $(`.selectProdutoCpt${contador}`).prepend('<option value="0" selected disabled>Selecione...</option>')

    axios.get(urlProduto, {
        params: {
            composto: 0
        }
    })
        .then(response => {
            response.data.forEach(produto => {
                $(`.selectProdutoCpt${contador}`).append(`<option value="${produto.id}">${produto.nome}</option>`);
                $(`.selectQtdeCpt${contador}`).append(`<option value="${produto.id}">${produto.quantidade}</option>`);
            });
            contador++;
            $('.btnSalvarComposto').attr('onclick', `salvarComposto(${contador})`)
        });
}

removeProdutoListaComposto = (cont) => {
    if ($('.divProdutoSimples').length > 1) {
        $(`#prod${cont}`).remove()
    } else {
        $(`#removeComposto${cont}`).remove()
    }
}

closeModalProdutoCpt = () => {
    window.location.reload()
    // $('#formCadastroProdutoCpt').each(function () {
    //     this.reset()
    // })
    // count = 0;
    // contador = 1;
    // $('.selectProdutoCpt0').empty()
    // $('.divAdicionalProdutoSimples').remove()
    // $('.divSemProdutos').remove()
    // $('#ModalProdutoCpt').modal('hide')
}

salvarComposto = () => {
    valores = []
    let quantidade = $('.divProdutoSimples').length
    for (i = 0; i < quantidade; i++) {
        $('.divProdutoSimples').eq(i).addClass(`classProduto${i}`)
        valores[i] = { cod: $(`.classProduto${i} select option:selected`).val(), qtde: parseInt($(`.classProduto${i} input`).val()) }
    }
    composto = {
        valores,
        nome: $('#nomeProdutoCpt').val(),
        codigoSKU: $('#codProdutoCpt').val(),
        dtValidade: $('#dtValidadeProdutoCpt').val(),
        qntde: $('#qtdeProdutoCpt').val(),
        itensPCaixa: $('#itensCaixa').val(),
        pesoLiquido: $('#pesoLiquidoProdutoCpt').val(),
        pesoBruto: $('#pesoBrutoProdutoCpt').val(),
        marca: $('#marcaProdutoCpt').val(),
        categoria_id: $('#categoriaProdutoCpt').val()
    }
    axios.post(`${urlProduto}/cadastrocomposto`, {
        composto
    })
        .then(response => {
            if (response.data.status) {
                $('#tbProdutos tbody').html('')
                getProdutos()
                toastr.success(response.data.message)
                $('#ModalProdutoCpt').modal('hide')
            } else {
                toastr.warning(response.data.message)
            }
        })
}


cadastrarProduto = () => {
    produto = {
        nome: $('#nomeProduto').val(),
        codigoSKU: $('#codigoProduto').val(),
        dtValidade: $('#dtValidadeProduto').val(),
        quantidade: $('#qtdeProduto').val(),
        itensPCaixa: $('#itensCaixa').val(),
        pesoLiquido: $('#pesoLiquidoProduto').val(),
        pesoBruto: $('#pesoBrutoProduto').val(),
        marca: $('#marcaProduto').val(),
        categoria_id: $('#categoriaProduto').val()
    }

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
                $('#tbProdutos tbody').append(`<tr id=tr${dado.id}><td class="id">${contador}</td><td class="nome">${dado.nome}</td><td align="center">${dado.pcomposto ? `<i onclick="openModalProdutoComposto(${dado.pcomposto})" class="fa fa-plus" aria-hidden="true" style="cursor:pointer;"></i>` : ''}</td><td class="marca">${dado.marca}</td><td class="tipo">${dado.categoriaproduto}</td><td class="dtValidade" >${dado.dtValidade ? moment(dado.dtValidade).format('DD/MM/YYYY') : ''}</td><td align="center" class="qtde" >${dado.quantidade}</td><td class="pLiquido" >${dado.pesoLiquido ? dado.pesoLiquido : ''}</td><td class="pBruto" >${dado.pesoBruto ? dado.pesoBruto : ''}</td><td align="center" class=exc>${dado.excluido == 0 ? '<i style="color:green" class="fa fa-check"></i>' : '<i style="color: red"class="fa fa-times"></i>'}</td><td align="center" ><a onclick="openModalEditarProduto(${dado.id})" style="cursor:pointer;" class="on-default edit-row"><i id="cbEditarProduto(${dado.id})" style="color:orange" class="fa fa-pencil"></i></a></td><td align="center" ><a onclick="openModalExclusaoProduto(${dado.id})" style="cursor:pointer;" class="on-default edit-row"><i id="cbRemoverProduto(${dado.id})" style="color:red" class="fa fa-trash-o"></i></a></td></tr>`)
                contador++
            })

        })
}

openModalExclusaoProduto = (id) => {
    $('.btnExclusaoProduto').attr('onclick', 'removerProduto(' + id + ')')
    $(`.cbRemoverProduto${id}`).prop('checked', false)
    $('#modalExclusaoProduto').modal('show')
}

updateProdutoComposto = (idComposto, idProduto) => {
    quantidade = $(`#qtdeProdutoComposto${idProduto}`).val()
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

openModalProdutoComposto = (id) => {
    $('#ModalShowComposto').modal('show')
    $('.btnEditarComposto').attr('onclick')
    axios.get(`${urlProduto}/composto/${id}`)
        .then(response => {
            if (response.status = 200) {
                response.data.forEach(dado => {
                    $('#formProdutoComposto').append(`<div class="row divProdutos${dado.idproduto}" style="display: flex;align-items: center; padding-bottom: 15px;">
                                            <label class="col-sm-1">Produto</label>
											<div class="col-sm-3">
                                            <select type="text" class="form-select">
                                                <option>${dado.nome}</option>
                                            </select>
											</div>
											<label class="col-sm-1">Qtde</label>
											<div class="col-sm-2">
                                            <input type="number" id="qtdeProdutoComposto${dado.idproduto}" class="form-control" value="${dado.quantidade}">
											</div>
                                            <div class="col-sm-1">
                                                <button type="button" onclick="removerComposto(${id}, ${dado.idproduto})" class="btn btn-danger"><i class="fa fa-times" aria-hidden="true"></i></button>
                                            </div>
                                            <div class="col-sm-2">
                                            <button type="button" data-toggle="tooltip" data-placement="right" title="Atualizar o produto" onclick="updateProdutoComposto(${id}, ${dado.idproduto})" class="btn btn-primary"><i class="fa fa-floppy-o" aria-hidden="true"></i></button>
                                        </div>
										</div>`)
                })
                $('#formProdutoComposto').append(`<div class="row produtoNovoComposto" style="display: flex; align-item;center; padding-left: 15px">
                                                    <button onclick="produtoNovoComposto()" type="button" class="btn btn-success"><i class="fa fa-plus" aria-hidden="true"></i> Produto</button>
                                                </div>`)
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
                $(`.divProdutos${idProduto}`).remove()
                toastr.success(response.data.message)
            } else {
                console.log(response.data.debug)
                toastr.warning(response.data.message)
            }
        })
}

produtoNovoComposto = () => {
    $('.produtoNovoComposto').css('display', 'none')
    $('#formProdutoComposto')
        .append(`<div class="row divProdutos" style="display: flex;align-items: center; padding-bottom: 15px;">
    <label class="col-sm-1">Produto</label>
    <div class="col-sm-3">
    <select id="selectProdutos" type="text" class="form-select">
    </select>
    </div>
    <label class="col-sm-1">Qtde</label>
    <div class="col-sm-2">
    <input type="number" class="form-control">
    </div>
</div>`)

    axios.get(urlProduto, {
        params: {
            composto: 0
        }
    })
        .then(response => {
            response.data.forEach(produto => {
                $('#selectProdutos').append(`<option value=${produto.id}>${produto.nome}</option>`)
            })
        })
}

openModalEditarProduto = (id) => {
    $('#modalProdutoLabel').text('').append('Editar Produto')

    axios.get(`${urlProduto}/${id}`)
        .then(response => {

            dados = response.data[0]
            $('#nomeProduto').val(dados.nome)
            $('#dtValidadeProduto').val(moment(dados.dtValidade).format('YYYY-MM-DD'))
            $('#qtdeProduto').val(dados.quantidade)
            $('#pesoLiquidoProduto').val(dados.pesoLiquido)
            $('#pesoBrutoProduto').val(dados.pesoBruto)
            $('#marcaProduto').val(dados.marca)
            $('#categoriaProduto option').text(dados.nomecategoria).val(dados.categoria)
            $('#codigoProduto').val(dados.id).prop('disabled', 'disabled')
        })

    $(`.cbEditarProduto${id}`).prop('checked', false)
    $('.btnSalvarProduto').attr('onclick', 'editarProduto(' + id + ')')
    $('#ModalProduto').modal('show')
}

removerProduto = (id) => {
    axios.put(`${urlProduto}/delete/${id}`)
        .then(response => {
            if (response.data.status) {
                $(`#tbProdutos tbody #tr${id}`).remove()
                toastr.success(response.data.message)
                $('#modalExclusaoProduto').modal('hide')
            } else {
                toastr.warning(response.data.message)
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
        produto
    })
        .then(response => {
            if (response.status == 200) {
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
