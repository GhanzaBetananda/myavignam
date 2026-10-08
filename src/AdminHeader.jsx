import { useState } from 'react'

export default function AdminHeader({ active, setActive, onLogout }) {
  const [openMenu, setOpenMenu] = useState(false)
  const menus = ['Dashboard', 'Kelola Pegawai', 'Kelola Cuti', 'Kelola UKOM', 'Akun']

  const go = (m) => {
    setActive(m)
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
        <div className="flex min-w-0 items-center gap-1.5">
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
              Admin Panel
            </div>
          </div>
        </div>
        <div className="flex-1" />

        <nav className="hidden items-center gap-6 lg:flex">
          {menus.map((m) => (
            <button key={m} className={link(active === m)} onClick={() => go(m)}>
              {m.replace('Kelola ', '')}
              <span className={underline(active === m)} />
            </button>
          ))}
        </nav>

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

      {openMenu && (
        <nav className="anim-pop max-h-[70vh] space-y-0.5 overflow-y-auto border-t border-slate-100 bg-white px-4 py-4 lg:hidden">
          {menus.map((m) => (
            <button
              key={m}
              className={`block w-full rounded-xl px-4 py-3 text-left text-[15px] font-semibold ${active === m ? 'bg-orange-50 text-orange-600' : 'text-slate-800'}`}
              onClick={() => go(m)}
            >
              {m}
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
