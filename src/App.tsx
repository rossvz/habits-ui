import React, { useEffect, useState } from 'react'
import axios from 'axios'
import moment from 'moment'
import './App.css'
const API = process.env.REACT_APP_API
export function App() {
  const [entries, setEntries] = useState([])
  const [user, setUser] = useState(null)
  const [signedUp, setSignedUp] = useState(true)
  const [email, setEmail] = useState('')
  const [newUserName, setNewUserName] = useState('')
  const [habits, setHabits] = useState([])
  const [showNewHabit, setShowNewHabit] = useState(false)
  const [newHabit, setNewHabit] = useState('')
  const [newHabitCategory, setNewHabitCategory] = useState('')
  const [completedHabits, setCompletedHabits] = useState([])

  useEffect(
    () => {
      setCompletedHabits(
        Array.from(new Set(entries.map(entry => entry.habit.id)))
      )
    },
    [entries]
  )

  useEffect(
    () => {
      if (user) {
        localStorage.setItem('userId', user.id)
      }
      if (!user) {
        const id = localStorage.getItem('userId')
        if (id) {
          axios.get(`${API}/users/${id}`).then(({ data }) => {
            setUser(data)
            setHabits(data.habits)
            axios.get(`${API}/entries/today?userId=${id}`).then(({ data }) => {
              const today = moment().startOf('day')
              const todaysEntries = data.filter(d =>
                moment(d.created).isAfter(today)
              )
              setEntries(todaysEntries)
            })
          })
        }
      }
      return
    },
    [user]
  )

  const fetchOrCreateUser = async (e: any) => {
    e.preventDefault()
    try {
      const { data } = await axios.get(`${API}/users?email=${email}`)
      if (data && data[0]) {
        setUser(data[0])
        setHabits(data[0].habits)
        localStorage.setItem('userId', data[0].id)
        window.scrollTo(0, 0)
      }
    } catch (e) {
      setSignedUp(false)
    }
  }

  const handleNewHabit = async e => {
    e.preventDefault()
    const habit = {
      name: newHabit,
      category: newHabitCategory,
      weight: 1,
      user: user.id
    }
    await axios.post(`${API}/habits`, habit)
    setHabits([...habits, habit])
    setNewHabit('')
    setNewHabitCategory('')
    setShowNewHabit(false)
  }

  const handleNewUser = async e => {
    e.preventDefault()
    const user = {
      name: newUserName,
      email,
      habits: []
    }
    const { data } = await axios.post(`${API}/users`, user)
    setUser(data)
  }

  // const removeHabit = async (id) => {
  //   await axios.delete(`${API}/habits/${id}`)
  //   setHabits(habits.filter(h => h.id !== id))
  // }

  const toggleHabitComplete = async habitId => {
    if (completedHabits.includes(habitId)) {
      entries
        .filter(entry => entry.habit.id === habitId)
        .forEach(async entry => {
          setEntries(entries.filter(e => e.id !== entry.id))
          await axios.delete(`${API}/entries/${entry.id}`)
        })
    } else {
      const { data } = await axios.post(`${API}/entries`, {
        habit: habitId
      })
      setEntries([...entries, data])
    }
  }

  const logout = () => {
    localStorage.clear()
    setUser(null)
    setSignedUp(true)
    setEmail('')
  }

  return (
    <div className="container">
      <div className="app">
        {!user && signedUp && (
          <form onSubmit={fetchOrCreateUser}>
            <p>Enter your email address to log in:</p>
            <input
              className={'input'}
              placeholder={'Email address'}
              type="text"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <div className={'separator'} />
            <button type={'submit'}>Go</button>
          </form>
        )}

        {!user && !signedUp && (
          <div>
            <form onSubmit={handleNewUser}>
              <input
                className={'input'}
                type="text"
                value={newUserName}
                placeholder={'Your Name'}
                onChange={e => setNewUserName(e.target.value)}
              />
              <input
                className={'input'}
                type="text"
                value={email}
                placeholder={'Email'}
                onChange={e => setEmail(e.target.value)}
              />
              <button type="submit">Sign Up</button>
            </form>
          </div>
        )}

        {user && (
          <div>
            <h1>Habits</h1>
            <h2>{completedHabits.length} point(s) earned today</h2>
            <div className="habits-container">
              {habits.map(habit => (
                <div
                  key={habit.id}
                  className={`habit ${
                    completedHabits.includes(habit.id) ? 'completed' : 'pending'
                  }`}
                  onClick={() => toggleHabitComplete(habit.id)}
                >
                  <h3>{habit.name}</h3>
                </div>
              ))}
            </div>
            {!showNewHabit && (
              <div className={'footer'}>
                <span onClick={logout}>Logout</span>
                <button onClick={() => setShowNewHabit(true)}>Add Habit</button>
              </div>
            )}
            {showNewHabit && (
              <form className={'new-habit-form'} onSubmit={handleNewHabit}>
                <input
                  className={'input'}
                  type="text"
                  value={newHabit}
                  onChange={e => setNewHabit(e.target.value)}
                  placeholder={'New Habit'}
                />
                <input
                  className={'input'}
                  type="text"
                  value={newHabitCategory}
                  onChange={e => setNewHabitCategory(e.target.value)}
                  placeholder={'Category'}
                />
                <button type="submit">Add Habit</button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
