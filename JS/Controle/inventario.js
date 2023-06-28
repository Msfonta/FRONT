const urlInventario = 'http://localhost:3000/inventario'

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


    if (window.location.href == 'http://localhost/projetoMHR/inventario.html') {
        if (!dadosUsuario || dadosUsuario.id_grupo != 4) {
            irNaoAutorizado()
        } else {
            (async () => {
                const inventario = await getStatusInventario()
                if (inventario) {
                    getListaInventario()
                }
            })();
            $('.accountName').append(dadosUsuario.nome)
            $('.nomeCompleto').val(dadosUsuario.nome)
            $('.emailUsuario').val(dadosUsuario.email)
            if (dadosUsuario.id_grupo != 4) {
                $('.listaUsuarios').css('display', 'none')
            }
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
                $('#btnInventario').attr('disabled', true)
                $('.btnListaInventario')
                    .append(`<button class="btn btn-danger" style="margin: 0 15px 10px 15px;" data-toggle="tooltip"
                data-placement="right" id="btnFinalizarInventario" onclick="finalizarInventario()"
                title="">Finalizar Inventário</button>`)
                response.data.forEach(produto => {
                    $('#tbInventario tbody').append(`<tr><td>${contador}</td><td id="codigo${contador}">${produto.codigo}</td><td id="nome${contador}">${produto.nome}</td><td align="center" id="estoque${contador}">${produto.qtde_estoque}</td><td align="center" id="real${produto.id}"><input style="width:50%" type="number" name="qtde_real" value="${produto.qtde_estoque}"></td><td align="center" id="btnSalvarProdutoInventario${contador}"><button id="salvarProdutoInventario${contador}" onclick="salvarProdutoInventario(${produto.id})" type="button" class="btn btn-success btn-sm"><i class="fa fa-floppy-o"></i></button></td></tr>`)
                    contador++
                })
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