import React, { useState } from 'react'
import { render } from 'react-dom'
import axios from 'axios'
import './styles.css'

const API = 'http://localhost:6000'

function App() {
  const [count, setCount] = useState(0)
  const [user, setUser] = useState(null)
  const [email, setEmail] = useState('')

  const fetchOrCreateUser = async e => {
    e.preventDefault()
    const { data } = await axios.get(`${API}/users?email=${email}`)
    if (data && data[0]) setUser(data[0])
  }

  return (
    <div className="App">
      {!user && (
        <form onSubmit={fetchOrCreateUser}>
          <input
            type="text"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <button type={'submit'}>Go</button>
        </form>
      )}
      {user && <div>Welcome {user.name}</div>}
    </div>
  )
}

const rootElement = document.getElementById('root')
render(<App />, rootElement)
