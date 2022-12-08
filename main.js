'use strict'


const openModal = () => document.getElementById('modal')
    .classList.add('active')

const closeModal = () => {
    clearFields();
    document.getElementById('modal').classList.remove('active')
}


const getLocalStorage = () => JSON.parse(localStorage.getItem('dbClient')) ?? [];
const setLocalStorage = (dbClient) => localStorage.setItem("dbClient", JSON.stringify(dbClient));

// CRUD create read update delete

// Para o push funcionar tem que existir pelo menos uma vez a array vazia antes do JSON.parse();


// CRUD - Create
const createClient = (client) => {
    const dbClient = getLocalStorage();
    dbClient.push(client)
    setLocalStorage(dbClient)
}

// CRUD - Read
const readClient = () => getLocalStorage();

// CRUD Update 
const updateClient = (index, client) => {
    const dbClient= readClient();
    dbClient[index] = client
    setLocalStorage(dbClient)
}

// CRUD delete
const deleteClient = (index) => {
    const dbClient = readClient();
    dbClient.splice(index,1);
    setLocalStorage(dbClient)
}

const isValidFields = () => {
    return document.getElementById('form').reportValidity();
}

const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field');
    fields.forEach( (field) => field.value = "");
}



// interação com layout
const saveClient = () => {
    if (isValidFields()) {
        const client = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            telefone: document.getElementById('telefone').value,
            cidade: document.getElementById('cidade').value,
        }
        const index = document.getElementById('nome').dataset.index
        if (index == 'new') {

            createClient(client);
            console.log('cliente cadastrado')
            updateTable();
            closeModal()
        } else {
            console.log('Editando....')
            updateClient(index,client)
            updateTable()
            closeModal();
        }
    }
}

const createRow = (client, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
    <td>${client.nome}</td>
    <td>${client.email}</td>
    <td>${client.telefone}</td>
    <td>${client.cidade}</td>
    <td>
    <button type="button" class="button green" id="edit-${index}" >Editar</button>
    <button type="button" class="button red" id="delete-${index}">Excluir</button>
    </td>
    `
    document.querySelector('#tbClient>tbody').appendChild(newRow);
}

const clearTable = () => {
    const rows = document.querySelectorAll('#tbClient>tbody tr');
    rows.forEach(row => row.parentNode.removeChild(row))
}

const updateTable = () => {
    const dbClient = readClient()
    clearTable();
    dbClient.forEach(createRow)
}

const fillFields = (client) => {
    document.getElementById('nome').value = client.nome;
    document.getElementById('email').value = client.email;
    document.getElementById('telefone').value = client.telefone;
    document.getElementById('cidade').value = client.cidade;
    document.getElementById('nome').dataset.index = client.index
}

const editClient = (index) => {
    const client = readClient()[index]
    client.index = index
    fillFields(client) 
    openModal();
}

const editDelete = (event) => {
    if(event.target.type == 'button') {
       const [action, index] = event.target.id.split('-')

       if(action == 'edit') {
        console.log('Editando o cliente')
        editClient(index)
       } else {
        const client = readClient()[index]
        const response = confirm (`Deseja realmente excluir o cliente ${client.nome}`);
        if(response) {

            console.log('Deletando o cliente')
            deleteClient(index);
            updateClient()
        }
       }
    }
}

updateTable()


// Eventos
document.getElementById('cadastrarCliente')
    .addEventListener('click', openModal)

document.getElementById('modalClose')
    .addEventListener('click', closeModal) 

document.getElementById('salvar').addEventListener('click', saveClient)

document.querySelector('#tbClient>tbody').addEventListener('click', editDelete)