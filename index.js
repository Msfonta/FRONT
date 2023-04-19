const url = "http://localhost:3000/posts"

function getUser(){
    var dados;
    axios.get(url)
    .then(response => {
        dados = response.data
        $('.userId-input').val(dados.userId)
        $('.id-input').val(dados.id)
        $('.title-input').val(dados.title)
        $('.body-ta').val(dados.body)
    })
    .catch(error => console.log(error))

   
}