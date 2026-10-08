import { useState } from 'react'
import { tryLogin } from './utils/auth'

export default function LoginPage({ onSuccess }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    setError('')
    if (!email.trim()) {
      setError('Masukkan email terlebih dahulu.')
      return
    }
    if (!password) {
      setError('Masukkan kata sandi terlebih dahulu.')
      return
    }
    setLoading(true)
    // simulasi jeda kecil agar terasa responsif
    setTimeout(() => {
      const res = tryLogin(email, password)
      setLoading(false)
      if (res.ok) {
        onSuccess?.()
      } else {
        setError(res.message)
      }
    }, 450)
  }

  return (
    <div className="flex min-h-screen bg-white text-slate-900">
      {/* Panel kiri — branding */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-slate-950 p-10 text-white lg:flex xl:p-14">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              'radial-gradient(600px 320px at 20% 15%, rgba(234,88,12,0.55), transparent 60%), radial-gradient(500px 300px at 85% 90%, rgba(234,88,12,0.35), transparent 60%)',
          }}
        />
        <div className="relative flex items-center gap-3">
          <div className="flex items-center gap-2">
            {['/456.png', '/472.png', '/Basarnas%20BWI.png'].map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`Logo ${i + 1}`}
                className="h-10 w-10 rounded-xl border border-white/20 bg-white object-contain p-0.5"
              />
            ))}
          </div>
          <div className="leading-tight">
            <div className="font-display text-lg font-bold tracking-tight">MyAvignam</div>
            <div className="text-[11px] font-semibold uppercase tracking-widest text-orange-400">
              Basarnas Banyuwangi
            </div>
          </div>
        </div>

        <div className="relative">
          <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-orange-400">
            <span className="inline-block h-px w-10 bg-orange-500" />
            Sistem Informasi Kepegawaian
          </p>
          <h1 className="font-display mt-4 max-w-md text-4xl font-bold leading-[1.05] tracking-tight xl:text-5xl">
            Satu pintu data personel siap siaga.
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-300">
            Kelola kesamaptaan, uji periodik, UKOM, keahlian, dan cuti personel dalam satu
            dasbor yang cepat dan aman.
          </p>
          <div className="mt-8 grid max-w-md grid-cols-3 gap-px overflow-hidden rounded-2xl border border-white/15 bg-white/10">
            {[
              ['Siaga', '24/7 personel'],
              ['Terpadu', '5 divisi aktif'],
              ['Aman', 'Akses terverifikasi'],
            ].map(([a, b]) => (
              <div key={a} className="bg-slate-950/60 px-4 py-4">
                <div className="font-display text-base font-bold text-white">{a}</div>
                <div className="mt-0.5 text-xs text-slate-400">{b}</div>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-slate-500">
          © 2026 Basarnas Banyuwangi — MyAvignam
        </p>
      </div>

      {/* Panel kanan — form */}
      <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-10">
        <div className="w-full max-w-md">
          {/* Logo mobile */}
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <div className="flex items-center gap-1.5">
              {['/456.png', '/472.png', '/Basarnas%20BWI.png'].map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`Logo ${i + 1}`}
                  className="h-9 w-9 rounded-lg border border-slate-200 object-contain p-0.5"
                />
              ))}
            </div>
            <div className="leading-tight">
              <div className="font-display text-base font-bold tracking-tight">MyAvignam</div>
              <div className="text-[11px] font-semibold uppercase tracking-widest text-orange-600">
                Basarnas Banyuwangi
              </div>
            </div>
          </div>

          <p className="anim-fade-up flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-orange-600">
            <span className="inline-block h-px w-10 bg-orange-600" />
            Selamat datang kembali
          </p>
          <h2 className="anim-fade-up-1 font-display mt-3 text-4xl font-bold tracking-tight">
            Masuk akun.
          </h2>
          <p className="anim-fade-up-2 mt-2 text-sm text-slate-500">
            Gunakan email dan kata sandi yang terdaftar untuk mengakses dasbor.
          </p>

          <form onSubmit={submit} className="anim-fade-up-2 mt-8 space-y-4">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-slate-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="nama@contoh.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-[15px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/15"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-slate-700">
                Kata sandi
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPw ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 pr-14 text-[15px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/15"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                >
                  {showPw ? 'Tutup' : 'Lihat'}
                </button>
              </div>
            </div>

            {error && (
              <div className="anim-pop flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500 text-[11px] font-bold text-white">
                  !
                </span>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-slate-900 py-3.5 text-[15px] font-semibold text-white transition hover:bg-orange-600 disabled:cursor-wait disabled:opacity-70"
            >
              {loading ? 'Memeriksa…' : 'Masuk'}
            </button>

            <p className="pt-1 text-center text-xs leading-relaxed text-slate-400">
              Akses dilindungi. Hubungi admin Basarnas Banyuwangi
              <br />
              jika Anda lupa kredensial akun.
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
