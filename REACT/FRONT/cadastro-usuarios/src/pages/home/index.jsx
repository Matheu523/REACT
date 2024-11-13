import { useEffect, useState, useRef } from 'react'
import './style.css'
import Trash from '../../asssets/trash.svg'
import api from '../../services/api'

function Home() {

    const [users,setUsers] = useState([])
    const [editingUser, setEditingUser] = useState(null);

    const inputName = useRef()
    const inputAge = useRef()
    const inputEmail = useRef()

    async function getUsers(){
        const usersFromApi = await api.get('/usuarios')
        setUsers(usersFromApi.data)
    }

    async function createUsers(){

      await api.post('/usuarios', {
        name: inputName.current.value,
        age: inputAge.current.value,
        email: inputEmail.current.value
      })

      getUsers()
  }

  async function deleteUsers(id){
    await api.delete(`/usuarios/${id}`)
    getUsers()
}

  async function updateUser(id) {
    await api.put(`/usuarios/${id}`,{
      name: inputName.current.value,
      age: inputAge.current.value,
      email: inputEmail.current.value
    })
    
    getUsers()
    setEditingUser(null)
  }


  function handleEdit(user){
    setEditingUser(user);
    inputName.current.value = user.name;
    inputAge.current.value = user.age;
    inputEmail.current.value = user.email;
  }

    useEffect(()=>{
        getUsers()
    }, [])

  return (

      <div className='container'>
        <form>
          <h1>{editingUser ? 'Editar usuário' : 'Cadastro de usuário'}</h1>
          <input placeholder="Nome" name='nome' type='text' ref={inputName} defaultValue={editingUser ? editingUser.name : ''}/>
          <input placeholder="Idade" name='idade' type='number' ref={inputAge} defaultValue={editingUser ? editingUser.age : ''}/>
          <input placeholder="E-mail" name='email' type='email' ref={inputEmail} defaultValue={editingUser ? editingUser.email : ''}/>
          <button type="button"
          onClick={() => {
            if (editingUser) {
              updateUser(editingUser.id); // Se está editando, chama o update
            } else {
              createUsers(); // Caso contrário, cria um novo usuário
            }
          }}
        >
          {editingUser ? 'Salvar Alterações' : 'Cadastrar'}
        </button>
      </form>

      {users.map(user => (
        <div key={user.id} className="card">
          <div>
          <p>Nome:<span>{user.name}</span> </p>
          <p>Idade:<span>{user.age}</span> </p>
          <p>Email: <span>{user.email} </span></p>
          </div>

        <button onClick={() => handleEdit(user)}>
          <span>Editar</span> 
        </button>

        <button onClick={() => deleteUsers(user.id)}>
          <img src={Trash}/>
        </button>
        </div>
      ))}

      </div>
  )
}

export default Home
