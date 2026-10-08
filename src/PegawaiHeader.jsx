import { useState } from 'react'

const subFitur = [
  { name: 'Kesamaptaan', desc: 'Tes kebugaran fisik' },
  { name: 'Uji Periodik', desc: 'Ujian berkala pegawai' },
  { name: 'Ukom', desc: 'Uji kompetensi rescuer' },
  { name: 'Keahlian', desc: 'Profil & daftar keahlian' },
]

const menuUtama = [
  { label: 'Dashboard', target: 'Dashboard' },
  { label: 'Kesamaptaan', target: 'Pegawai/Kesamaptaan', desc: 'Tes kebugaran fisik' },
  { label: 'Uji Periodik', target: 'Pegawai/Uji Periodik', desc: 'Ujian berkala pegawai' },
  { label: 'Ukom', target: 'Pegawai/Ukom', desc: 'Uji kompetensi rescuer' },
  { label: 'Keahlian', target: 'Pegawai/Keahlian', desc: 'Profil & daftar keahlian' },
  { label: 'Cuti', target: 'Cuti' },
  { label: 'Profil', target: 'Profil' },
  { label: 'Akun', target: 'Akun' },
]

export default function PegawaiHeader({ active, setActive, onLogout }) {
  const [openPegawai, setOpenPegawai] = useState(false)
  const [openMenu, setOpenMenu] = useState(false)
  const pegawaiActive = active?.startsWith('Pegawai')

  const go = (target) => {
    setActive(target)
    setOpenPegawai(false)
    setOpenMenu(false)
  }

  const link = (isActive) =>
    `relative px-1 py-2 text-sm font-semibold transition-colors ${
      isActive ? 'text-slate-900' : 'text-slate-500 hover:text-slate-900'
    }`

  const underline = (isActive) =>
    `pointer-events-none absolute inset-x-0 -bottom-0.5 h-0.5 rounded-full bg-orange-600 transition-transform duration-300 ${
      isActive ? 'scale-x-100' : 'scale-x-0'
    }`

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center gap-2 px-4 sm:px-8">
        <div className="flex min-w-0 items-center gap-2.5">
          {['/456.png', '/472.png', '/Basarnas%20BWI.png'].map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`Logo ${i + 1}`}
              className={`h-9 w-9 rounded-lg border border-slate-200 object-contain p-0.5 sm:h-10 sm:w-10 ${
                i === 2 ? 'hidden min-[400px]:block' : ''
              }`}
            />
          ))}
          <div className="ml-1 leading-tight">
            <div className="font-display truncate text-base font-bold tracking-tight text-slate-900">
              MyAvignam
            </div>
            <div className="hidden text-[11px] font-semibold uppercase tracking-widest text-orange-600 min-[400px]:block">
              Basarnas Banyuwangi
            </div>
          </div>
        </div>
        <div className="flex-1" />

        {/* Navigasi desktop */}
        <nav className="hidden items-center gap-6 lg:flex">
          <button className={link(active === 'Dashboard')} onClick={() => go('Dashboard')}>
            Dashboard
            <span className={underline(active === 'Dashboard')} />
          </button>
          <div className="relative">
            <button className={link(pegawaiActive)} onClick={() => setOpenPegawai(!openPegawai)}>
              Pegawai
              <span className={`ml-1 inline-block text-[9px] transition-transform duration-200 ${openPegawai ? 'rotate-180' : ''}`}>
                ▼
              </span>
              <span className={underline(pegawaiActive)} />
            </button>
            {openPegawai && (
              <div className="anim-pop absolute right-0 top-[calc(100%+14px)] w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl shadow-slate-900/10">
                {subFitur.map((s) => (
                  <button
                    key={s.name}
                    className="group flex w-full items-center justify-between rounded-xl px-4 py-3 text-left transition hover:bg-orange-50"
                    onClick={() => go(`Pegawai/${s.name}`)}
                  >
                    <span>
                      <span className={`block text-sm font-semibold ${active === `Pegawai/${s.name}` ? 'text-orange-600' : 'text-slate-800'}`}>
                        {s.name}
                      </span>
                      <span className="block text-xs text-slate-400">{s.desc}</span>
                    </span>
                    <span className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-orange-600">→</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          {['Cuti', 'Profil', 'Akun'].map((m) => (
            <button key={m} className={link(active === m)} onClick={() => go(m)}>
              {m}
              <span className={underline(active === m)} />
            </button>
          ))}
        </nav>

        {/* Hamburger */}
        <button
          onClick={() => setOpenMenu(!openMenu)}
          aria-label="Buka menu"
          className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-700 transition hover:bg-slate-100 lg:hidden"
        >
          <span className="text-xl font-bold">{openMenu ? '✕' : '☰'}</span>
        </button>

        <button
          className="ml-1 hidden rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 sm:block"
          onClick={onLogout}
        >
          Logout
        </button>
      </div>

      {/* Panel menu HP */}
      {openMenu && (
        <nav className="anim-pop max-h-[70vh] space-y-0.5 overflow-y-auto border-t border-slate-100 bg-white px-4 py-4 lg:hidden">
          {menuUtama.map((m) => (
            <button
              key={m.target}
              className={`block w-full rounded-xl px-4 py-3 text-left ${active === m.target ? 'bg-orange-50' : ''}`}
              onClick={() => go(m.target)}
            >
              <span className={`block text-[15px] font-semibold ${active === m.target ? 'text-orange-600' : 'text-slate-800'}`}>
                {m.label}
              </span>
              {m.desc && <span className="block text-xs text-slate-400">{m.desc}</span>}
            </button>
          ))}
          <button
            className="mt-2 block w-full rounded-full bg-slate-900 px-4 py-3 text-center text-[15px] font-semibold text-white sm:hidden"
            onClick={onLogout}
          >
            Logout
          </button>
        </nav>
      )}
    </header>
  )
}
