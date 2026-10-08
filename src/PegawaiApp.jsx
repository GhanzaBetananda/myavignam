import { useState } from 'react'
import PegawaiHeader from './PegawaiHeader.jsx'
import PegawaiPage from './PegawaiPage.jsx'
import UkomPage from './UkomPage.jsx'
import CutiPage from './CutiPage.jsx'
import ProfilPage from './ProfilPage.jsx'
import AkunPage from './AkunPage.jsx'
import DashboardIntro from './components/DashboardIntro.jsx'

export default function PegawaiApp({ onLogout }) {
  const [active, setActive] = useState('Dashboard')

  return (
    <>
      <PegawaiHeader active={active} setActive={setActive} onLogout={onLogout} />
      {active === 'Dashboard' ? (
        <DashboardIntro role="pegawai" onNavigate={setActive} />
      ) : active === 'Cuti' ? (
        <CutiPage />
      ) : active === 'Profil' ? (
        <ProfilPage />
      ) : active === 'Akun' ? (
        <AkunPage role="pegawai" />
      ) : active === 'Pegawai/Ukom' ? (
        <UkomPage />
      ) : active?.startsWith('Pegawai/') ? (
        <PegawaiPage fitur={active.split('/')[1]} />
      ) : (
        <div className="p-10 text-2xl font-semibold">Selamat Datang</div>
      )}
    </>
  )
}
