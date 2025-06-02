// Importa hooks do React:
// useEffect: executa efeitos colaterais (ex: buscar dados ao carregar a página)
// useState: cria estados locais para armazenar e atualizar valores no componente
// useRef: cria referências mutáveis para acessar valores dos inputs diretamente
import { useEffect, useState, useRef } from 'react'

// Importa o arquivo de estilos CSS para estilizar o componente
import './style.css'

// Importa o ícone de lixeira da biblioteca react-icons para usar como botão de deletar
import { AiOutlineDelete } from "react-icons/ai"

// Importa a instância do axios configurada para fazer requisições HTTP à API do backend
import api from '../../services/api'

// Define o componente funcional Home
function Home() {

  // Cria um estado chamado 'users' para armazenar a lista de usuários, e 'setUsers' para atualizar esse estado
  const [users, setUsers] = useState([])

  // Cria referências para os inputs de nome, idade e email
  // Permite acessar os valores digitados sem usar estados controlados
  const inputName = useRef()
  const inputAge = useRef()
  const inputEmail = useRef()

  // Função assíncrona para buscar usuários na API
  async function getUsers() {
    // Faz uma requisição GET para o endpoint '/usuarios' e armazena a resposta em usersFromApi
    const usersFromApi = await api.get('/usuarios')

    // Atualiza o estado 'users' com os dados recebidos da API
    setUsers(usersFromApi.data)
  }

  // Função assíncrona para criar um novo usuário
  async function createUsers() {
    // Envia uma requisição POST para criar um usuário com os valores dos inputs
    await api.post('/usuarios', {
      name: inputName.current.value,
      age: inputAge.current.value,
      email: inputEmail.current.value
    })
    // Após criar, busca novamente todos os usuários para atualizar a lista
    getUsers()
  }

  // Função assíncrona para deletar um usuário pelo id
  async function deleteUsers(id) {
    try {
      // Envia uma requisição DELETE para remover o usuário com o id informado
      await api.delete(`/usuarios/${id}`)
      // Atualiza a lista após deletar
      getUsers()
    } catch (error) {
      // Caso dê erro (ex: usuário já removido), exibe um alerta
      alert('Erro ao deletar usuário. Ele pode já ter sido removido.')
    }
  }

  // useEffect executa a função getUsers apenas uma vez, quando o componente é montado
  useEffect(() => {
    getUsers()
  }, [])

  // Renderização do componente
  return (
    <div className='container'>
      {/* Formulário para cadastrar novo usuário */}
      <form >
        <h1>Cadastro de Usuarios</h1>

        {/* Input para nome, usando ref para acessar o valor */}
        <input placeholder='Nome' name='nome' type="text" ref={inputName} />

        {/* Input para idade, usando ref para acessar o valor */}
        <input placeholder='Idade' name='idade' type="number" ref={inputAge} />

        {/* Input para email, usando ref para acessar o valor */}
        <input placeholder='Email' name='email' type="email" ref={inputEmail} />

        {/* Botão para cadastrar usuário, chama createUsers ao clicar */}
        <button type='button' onClick={createUsers}> Cadastrar</button>
      </form>

      {/* Lista de usuários cadastrados */}
      {
        users.map((user) => (
          <div key={user.id} className="card">
            <div>
              <p>Nome: <span>{user.name}</span></p>
              <p>Idade: <span>{user.age}</span></p>
              <p>Email: <span> {user.email} </span></p>
              {/* Botão para deletar usuário, chama deleteUsers com o id do usuário */}
              <button onClick={() => deleteUsers(user.id)}>
                <AiOutlineDelete />
              </button>
            </div>
          </div>
        ))
      }

      {/* Exemplo de seção estática para mostrar estrutura da lista */}
      <div>
        <h2>Lista de Usuarios</h2>
        <p> Nome: </p>
        <p>Idade : </p>
        <p>Email : </p>
      </div>
      {/* Botão de lixeira sem função, apenas ilustrativo */}
      <button><AiOutlineDelete /></button>
    </div>
  )
}

// Exporta o componente para ser usado em outros arquivos
export default Home