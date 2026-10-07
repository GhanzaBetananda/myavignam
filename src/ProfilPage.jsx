import { useState } from 'react'
import { PROFILES } from './utils/profil'
import { DIVISIONS } from './utils/data'

const FOTO_KEY = 'basarnas-profil-foto'

function loadFotoMap() {
  try {
    return JSON.parse(localStorage.getItem(FOTO_KEY)) || {}
  } catch {
    return {}
  }
}

function saveFotoMap(map) {
  try {
    localStorage.setItem(FOTO_KEY, JSON.stringify(map))
  } catch {
    // abaikan jika penyimpanan penuh
  }
}

function readPhoto(file, cb) {
  if (!file) return
  const r = new FileReader()
  r.onload = () => cb(r.result)
  r.readAsDataURL(file)
}

function initials(nama) {
  return nama.split(' ').map((w) => w[0]).slice(0, 2).join('')
}

function DetailModal({ profil, foto, onFoto, onClose }) {
  if (!profil) return null
  const biodata = [
    ['Nama Lengkap', profil.nama],
    ['NIP', profil.nip],
    ['Tempat, Tanggal Lahir', profil.ttl],
    ['Jabatan', profil.jabatan],
    ['Pangkat / Golongan', profil.pangkat],
    ['Unit / Divisi', profil.divisi],
    ['Masa Kerja', profil.masaKerja],
  ]

  return (
    <div
      className="fixed inset-0 z-30 flex items-end justify-center bg-slate-950/60 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        className="anim-pop max-h-[90vh] w-full max-w-xl overflow-y-auto bg-white sm:rounded-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          {foto ? (
            <img src={foto} alt={profil.nama} className="aspect-[16/9] w-full object-cover" />
          ) : (
            <div className="flex aspect-[16/9] w-full items-center justify-center bg-slate-900">
              <span className="font-display text-6xl font-bold text-white/20">{initials(profil.nama)}</span>
            </div>
          )}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm shadow-lg transition hover:bg-slate-900 hover:text-white"
          >
            ✕
          </button>
          <label className="absolute bottom-4 right-4 cursor-pointer rounded-full bg-orange-600 px-4 py-2 text-xs font-bold text-white shadow-lg transition hover:bg-slate-900">
            {foto ? 'Ganti Foto' : 'Tambah Foto'}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => readPhoto(e.target.files[0], (data) => onFoto(profil.id, data))}
            />
          </label>
        </div>

        <div className="px-6 py-6 sm:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-orange-600">{profil.id}</p>
          <h2 className="font-display mt-1 text-2xl font-bold tracking-tight sm:text-3xl">{profil.nama}</h2>
          <p className="mt-1 text-sm text-slate-500">{profil.jabatan} · {profil.divisi}</p>

          <h3 className="mt-6 text-xs font-bold uppercase tracking-[0.25em] text-slate-400">Biodata</h3>
          <dl className="mt-3 divide-y divide-slate-100 border-y border-slate-200">
            {biodata.map(([label, value]) => (
              <div key={label} className="flex gap-4 py-3 text-sm">
                <dt className="w-36 shrink-0 text-slate-400 sm:w-44">{label}</dt>
                <dd className="font-semibold text-slate-900">{value}</dd>
              </div>
            ))}
          </dl>

          <h3 className="mt-6 text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
            Riwayat jabatan / mutasi
          </h3>
          <div className="mt-3">
            {profil.riwayat.map((r, i) => (
              <div key={i} className="relative flex gap-5 pb-6 pl-8 last:pb-0">
                <span className="absolute bottom-0 left-[9px] top-6 w-px bg-slate-200" />
                <span className={`absolute left-0 top-1.5 h-5 w-5 rounded-full border-2 ${i === profil.riwayat.length - 1 ? 'border-orange-600 bg-orange-600' : 'border-slate-300 bg-white'}`} />
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-orange-600">{r.periode}</div>
                  <div className="font-display mt-0.5 text-lg font-bold tracking-tight">{r.jabatan}</div>
                  <div className="text-sm text-slate-500">{r.unit}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProfilPage() {
  const [filter, setFilter] = useState('Semua')
  const [cari, setCari] = useState('')
  const [selected, setSelected] = useState(null)
  const [fotoMap, setFotoMap] = useState(() => loadFotoMap())

  const setFoto = (id, data) => {
    const next = { ...fotoMap, [id]: data }
    setFotoMap(next)
    saveFotoMap(next)
  }

  const list = PROFILES.filter(
    (p) =>
      (filter === 'Semua' || p.divisi === filter) &&
      p.nama.toLowerCase().includes(cari.toLowerCase())
  )

  return (
    <div className="bg-white text-slate-900">
      <div className="border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:py-16">
          <p className="anim-fade-up flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-orange-600">
            <span className="inline-block h-px w-10 bg-orange-600" />
            Data pegawai
          </p>
          <h1 className="anim-fade-up-1 font-display mt-3 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Profil personel <span className="text-slate-300">({PROFILES.length})</span>
          </h1>
          <div className="anim-fade-up-2 mt-6 flex max-w-md items-center gap-3 border-b-2 border-slate-900 pb-2">
            <span className="text-slate-400">⌕</span>
            <input
              value={cari}
              onChange={(e) => setCari(e.target.value)}
              placeholder="Cari nama pegawai..."
              className="w-full bg-transparent text-[15px] outline-none placeholder:text-slate-400"
            />
          </div>
          <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
            {['Semua', ...DIVISIONS.map((d) => d.name)].map((d) => (
              <button
                key={d}
                onClick={() => setFilter(d)}
                className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-semibold transition ${
                  filter === d
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-500 ring-1 ring-slate-200 hover:text-slate-900 hover:ring-slate-400'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {list.map((p) => {
            const foto = fotoMap[p.id]
            return (
              <button
                key={p.id}
                onClick={() => setSelected(p)}
                className="group overflow-hidden border border-slate-200 bg-white text-left transition hover:-translate-y-1 hover:border-slate-900 hover:shadow-xl hover:shadow-slate-900/10"
              >
                <div className="relative overflow-hidden bg-slate-100">
                  {foto ? (
                    <img
                      src={foto}
                      alt={p.nama}
                      className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-2 bg-slate-900">
                      <span className="font-display text-4xl font-bold text-white/25">{initials(p.nama)}</span>
                      <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                        Belum ada foto
                      </span>
                    </div>
                  )}
                  <span className="absolute left-3 top-3 bg-white/95 px-2.5 py-1 font-mono text-[11px] font-bold text-orange-600">
                    {p.id}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-display truncate text-lg font-bold tracking-tight">{p.nama}</h3>
                  <p className="mt-0.5 truncate text-sm text-slate-500">{p.jabatan}</p>
                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                    <span className="font-semibold text-slate-500">{p.divisi}</span>
                    <span className="font-bold text-slate-900">{p.masaKerja}</span>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
        {list.length === 0 && (
          <p className="py-12 text-center text-sm text-slate-400">Pegawai tidak ditemukan</p>
        )}
      </div>

      <DetailModal
        profil={selected}
        foto={selected ? fotoMap[selected.id] : null}
        onFoto={setFoto}
        onClose={() => setSelected(null)}
      />
    </div>
  )
}
