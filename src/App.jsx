import { useState } from 'react'
import PegawaiApp from './PegawaiApp.jsx'
import AdminApp from './AdminApp.jsx'
import LoginPage from './LoginPage.jsx'
import { isLoggedIn, logout } from './utils/auth'

function App() {
  const [authed, setAuthed] = useState(() => isLoggedIn())
  const isAdmin = window.location.pathname === '/admin'

  if (!authed) {
    return <LoginPage onSuccess={() => setAuthed(true)} />
  }

  const handleLogout = () => {
    logout()
    setAuthed(false)
  }

  return isAdmin ? <AdminApp onLogout={handleLogout} /> : <PegawaiApp onLogout={handleLogout} />
}

export default App
