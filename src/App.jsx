import PegawaiApp from './PegawaiApp.jsx'
import AdminApp from './AdminApp.jsx'

function App() {
  const isAdmin = window.location.pathname === '/admin'
  return isAdmin ? <AdminApp /> : <PegawaiApp />
}

export default App
