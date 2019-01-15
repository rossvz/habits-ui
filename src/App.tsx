import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'

const API = 'http://localhost:8383'

const useEntries = id => {
  const [entries, setEntries] = useState([])
  // @ts-ignore
  useEffect(
    ()=> {
      if(id) {
        axios.get(`${API}/entries/today?userId=${id}`).then(({data})=> {
          setEntries(data)
        })
      }
    },[id])
  return entries
}


export function App () {
  const [user, setUser] = useState(null)
  const [email, setEmail] = useState('')
  const [habits, setHabits] = useState([])
  const [newHabit, setNewHabit] = useState('')
  const [newHabitCategory, setNewHabitCategory] = useState('')
  const entries = useEntries(user && user.id)


  useEffect( () => {
    if (!user) {
      const id = localStorage.getItem('userId')
      if (id){
         axios.get(`${API}/users/${id}`).then(({data}) => {
           setUser(data)
           setHabits(data.habits)
         })

      }
    }
    return
  },[user])

  const fetchOrCreateUser = async (e: any) => {
    e.preventDefault()
    const { data } = await axios.get(`${API}/users?email=${email}`)
    if (data && data[0]) {
      setUser(data[0])
      setHabits(data[0].habits)
      localStorage.setItem('userId',data[0].id)
    }
  }

  const handleNewHabit = async (e) => {
    e.preventDefault()
    const habit = {
      name: newHabit,
      category: newHabitCategory,
      weight: 1,
      user: user.id
    }
    await axios.post(`${API}/habits`, habit )
    setHabits([...habits, habit ])
    setNewHabit('')
    setNewHabitCategory('')
  }

  const removeHabit = async (id) => {
    await axios.delete(`${API}/habits/${id}`)
    setHabits(habits.filter(h => h.id !== id))
  }

  const completeHabit = async(id)=> {
    await axios.post(`${API}/entries`,{
      habit: id
    })
  }

  return (
    <div className="container">
      <div className='app'>
        {!user && (
          <form onSubmit={fetchOrCreateUser}>
            <p>Enter your email address to log in:</p>
            <input
              placeholder={'Email address'}
              type="text"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <button type={'submit'}>Go</button>
          </form>
        )}
        {user && <div>
          Welcome {user.name}
          <h1>Habits:</h1>
          {habits.map(habit => <div key={habit.id}>
            <button onClick={()=> removeHabit(habit.id)}>X</button>
            <span>{habit.name}</span>
            <button onClick={()=> completeHabit(habit.id) }>DONE</button>
          </div>)}
          <h2>{entries.length} point(s) earned today</h2>
          <form onSubmit={handleNewHabit}>
            <input type="text" value={newHabit} onChange={(e)=> setNewHabit(e.target.value)} placeholder={'New Habit'} />
            <input type="text" value={newHabitCategory} onChange={(e)=> setNewHabitCategory(e.target.value)} placeholder={'Category'} />
            <button type='submit'>+</button>
          </form>
        </div>}
      </div>

    </div>
  )
}