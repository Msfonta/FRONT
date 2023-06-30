const urlInventario = 'http://localhost:3000/inventario'
dadosUser = false
inventario = false

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

    if (window.location.href == 'http://localhost/projetoMHR/inventario.html') {
        if (dadosUser) {
            buscarPermissao(dadosUser.email, dadosUser.senha).then(
                function (response) {
                    if (response.status) {
                        if (response.message[0].perm_inventario) {
                            inventario = JSON.parse(localStorage.getItem('inventario'))
                            $('.accountName').append(dadosUser.nome)
                            $('.nomeCompleto').val(dadosUser.nome)
                            $('.emailUsuario').val(dadosUser.email)
                            getListaInventario()
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


iniciarInventario = () => {
    $.ajax({
        url: urlInventario,
        method: 'POST',
        success: function (response) {
            if (response.status) {
                getListaInventario()
                localStorage.setItem('inventario', 1)
                toastr.success(response.message)
            } else {
                toastr.warning(response.message)
            }
        }
    })
}

finalizarInventario = () => {
    $('#btnInventario').attr('disabled', false)

    $.ajax({
        url: `${urlInventario}/finalizar`,
        method: 'POST',
        success: function (response) {
            $('#btnInventario').attr('disabled', false)
            $('#btnFinalizarInventario').remove()
            if (response.status) {
                $('#tbInventario tbody').html('')
                localStorage.removeItem('inventario')
                toastr.success('Processo do inventario finalizado com sucesso!')
            } else {
                $('#btnInventario').attr('disabled', false)
                toastr.warning(response.message)
            }
        }
    })
}

salvarProdutoInventario = (id) => {
    quantidade = $(`#real${id} input`).val()
    $.ajax({
        url: `${urlInventario}/${id}`,
        method: 'PUT',
        data: {
            quantidade
        },
        success: function (response) {
            if (response.status) {
                toastr.success(response.message)
            }
        }

    })
}

getListaInventario = () => {
    let contador = 1;
    $.ajax({
        url: urlInventario,
        method: 'GET',
        success: function (response) {
            if (response.status) {
                if (response.status_inv.status) {
                    $('#btnInventario').attr('disabled', true)
                    $('.btnListaInventario')
                        .append(`<button class="btn btn-danger" style="margin: 0 15px 10px 15px;" data-toggle="tooltip"
                    data-placement="right" id="btnFinalizarInventario" onclick="finalizarInventario()"
                    title="">Finalizar Inventário</button>`)
                    response.message.forEach(produto => {
                        $('#tbInventario tbody').append(`<tr><td>${contador}</td><td id="codigo${contador}">${produto.codigo}</td><td id="nome${contador}">${produto.nome}</td><td align="center" id="estoque${contador}">${produto.qtde_estoque}</td><td align="center" id="real${produto.id}"><input style="width:50%" type="number" name="qtde_real" value="${produto.qtde_estoque}"></td><td align="center" id="btnSalvarProdutoInventario${contador}"><button id="salvarProdutoInventario${contador}" onclick="salvarProdutoInventario(${produto.id})" type="button" class="btn btn-success btn-sm"><i class="fa fa-floppy-o"></i></button></td></tr>`)
                        contador++
                    })
                }
            } else {
                toastr.warning(response.message)
            }
        }
    })
}

getStatusInventario = async () => {
    try {
        const response = await axios.get(`${urlInventario}/lista`)
        if (response.data.status) {
            return response.data.valor
        }

    } catch (err) {
        console.error(err)
    }
}