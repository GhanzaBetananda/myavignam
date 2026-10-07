import { useMemo, useState } from 'react'
import HistoryChart from './components/HistoryChart.jsx'
import { getLoginProfile } from './utils/session'
import { KEAHLIAN_FLAT, KEAHLIAN_GROUPS, getKeahlianByName } from './utils/keahlian'
import { KEYS, addEntry, loadList, removeEntry } from './utils/storage'

const inputCls =
  'mt-2 w-full border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-600'

const labelCls = 'block text-xs font-bold uppercase tracking-widest text-slate-500'

function PageHead({ eyebrow, title, sub }) {
  return (
    <div className="border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:py-16">
        <p className="anim-fade-up flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-orange-600">
          <span className="inline-block h-px w-10 bg-orange-600" />
          {eyebrow}
        </p>
        <h1 className="anim-fade-up-1 font-display mt-3 max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        <p className="anim-fade-up-2 mt-4 max-w-xl text-slate-500">{sub}</p>
      </div>
    </div>
  )
}

function readPhoto(file, cb) {
  if (!file) return cb('')
  const r = new FileReader()
  r.onload = () => cb(r.result)
  r.readAsDataURL(file)
}

function PhotoInput({ foto, setFoto, label }) {
  return (
    <label className={labelCls}>
      {label}
      <div className="mt-2 flex items-center gap-4">
        {foto ? (
          <img src={foto} alt="pratinjau" className="h-20 w-20 border border-slate-200 object-cover" />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center border border-dashed border-slate-300 text-xs text-slate-400">
            Foto
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => readPhoto(e.target.files[0], setFoto)}
          className="text-xs text-slate-500 file:mr-2 file:rounded-full file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-xs file:font-bold file:text-white hover:file:bg-orange-600"
        />
      </div>
    </label>
  )
}

// Kartu ringkas akun yang sedang login — dipakai semua form pegawai
// agar input selalu tercatat atas 1 akun, bukan general.
function ProfilSayaCard({ profile, countLabel }) {
  return (
    <div className="border border-slate-200 bg-slate-50/60 p-6 sm:p-8">
      <div className="flex flex-wrap items-center gap-4">
        <div className="font-display flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
          {profile.nama.split(' ').map((w) => w[0]).slice(0, 2).join('')}
        </div>
        <div className="min-w-0">
          <h2 className="font-display truncate text-2xl font-bold tracking-tight">{profile.nama}</h2>
          <p className="mt-0.5 text-sm text-slate-500">
            {profile.jabatan} · {profile.divisi}
          </p>
        </div>
        {countLabel && (
          <span className="ml-auto flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-600">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            {countLabel}
          </span>
        )}
      </div>
      <dl className="mt-6 divide-y divide-slate-200 border-y border-slate-200">
        {[
          ['NIP', profile.nip],
          ['Jabatan', profile.jabatan],
          ['Pangkat / Golongan', profile.pangkat],
          ['Unit / Divisi', profile.divisi],
          ['Masa Kerja', profile.masaKerja],
        ].map(([label, value]) => (
          <div key={label} className="grid gap-1 py-3 text-sm sm:grid-cols-[220px_1fr] sm:gap-6">
            <dt className="text-slate-400">{label}</dt>
            <dd className="font-semibold text-slate-900">{value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 text-sm text-slate-500">
        Tercatat sebagai <span className="font-semibold text-slate-900">{profile.nama}</span> — semua data di halaman ini tersimpan atas nama ini.
      </p>
    </div>
  )
}

function FormShell({ title, children, onSubmit, error, done }) {
  return (
    <form onSubmit={onSubmit} className="border-t-2 border-slate-900 pt-8">
      <h2 className="font-display text-2xl font-bold tracking-tight">{title}</h2>
      <div className="mt-6 space-y-6">
        {children}
        {error && <p className="border-l-2 border-red-500 pl-3 text-sm font-medium text-red-600">{error}</p>}
        {done && <p className="border-l-2 border-emerald-500 pl-3 text-sm font-medium text-emerald-700">Data berhasil disimpan dan diteruskan ke admin.</p>}
        <button
          type="submit"
          className="w-full rounded-full bg-orange-600 py-4 text-sm font-bold text-white transition hover:bg-slate-900"
        >
          Simpan Data
        </button>
      </div>
    </form>
  )
}

const TES_ITEMS = [
  { key: 'lari', label: 'Lari 2,4 km (menit)', standar: '≤ 12' },
  { key: 'pushup', label: 'Push-up / 1 mnt (kali)', standar: '≥ 30' },
  { key: 'situp', label: 'Sit-up / 1 mnt (kali)', standar: '≥ 30' },
  { key: 'pullup', label: 'Pull-up (kali)', standar: '≥ 8' },
  { key: 'shuttle', label: 'Shuttle Run (detik)', standar: '≤ 12' },
  { key: 'renang', label: 'Renang 200 m (menit)', standar: '≤ 6' },
  { key: 'trappen', label: 'Water Trappen (menit)', standar: '≥ 5' },
]

function KesamaptaanForm() {
  const loginProfile = getLoginProfile()
  const [hasil, setHasil] = useState({})
  const [foto, setFoto] = useState('')
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [items, setItems] = useState(() => loadList(KEYS.kesamaptaan))
  const [metrik, setMetrik] = useState('pushup')

  const milikSaya = useMemo(
    () => items.filter((it) => it.nama === loginProfile.nama),
    [items, loginProfile.nama]
  )
  // 5 uji terakhir — kronologis (terlama -> terbaru) untuk grafik.
  const limaTerakhir = useMemo(() => milikSaya.slice(0, 5).reverse(), [milikSaya])
  const metaMetrik = TES_ITEMS.find((t) => t.key === metrik)
  const lowerBetter = ['lari', 'shuttle', 'renang'].includes(metrik)
  const unitMetrik = metrik === 'shuttle' ? ' dtk' : ['lari', 'renang', 'trappen'].includes(metrik) ? "'" : 'x'
  const titikGrafik = useMemo(
    () =>
      limaTerakhir
        .map((it) => ({ label: it.tanggal, value: parseFloat(it.hasil?.[metrik]), hint: `${it.tanggal}` }))
        .filter((p) => Number.isFinite(p.value)),
    [limaTerakhir, metrik]
  )

  const submit = (e) => {
    e.preventDefault()
    setError('')
    setDone(false)
    if (TES_ITEMS.some((t) => !hasil[t.key])) return setError('Isi semua hasil tes.')
    setItems(addEntry(KEYS.kesamaptaan, { nama: loginProfile.nama, hasil, foto }))
    setHasil({})
    setFoto('')
    setDone(true)
  }

  const hapus = (id) => setItems(removeEntry(KEYS.kesamaptaan, id))

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-5 py-12 sm:px-8 lg:py-16">
      <ProfilSayaCard profile={loginProfile} countLabel={`${milikSaya.length} tes tercatat`} />

      {/* Grafik 5 uji terakhir */}
      <section>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
              Grafik 5 uji terakhir
            </p>
            <h2 className="font-display mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              Tren {metaMetrik ? metaMetrik.label : metrik}
            </h2>
          </div>
          <label className={`${labelCls} w-full sm:w-64`}>
            Pilih metrik
            <select value={metrik} onChange={(e) => setMetrik(e.target.value)} className={inputCls}>
              {TES_ITEMS.map((t) => (
                <option key={t.key} value={t.key}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="mt-4">
          <HistoryChart points={titikGrafik} unit={unitMetrik} lowerBetter={lowerBetter} emptyText="Belum ada hasil numerik — isi formulir untuk melihat grafik" />
        </div>
      </section>

      <div className="grid items-start gap-12 lg:grid-cols-2">
        <FormShell title="Hasil tes kesamaptaan" onSubmit={submit} error={error} done={done}>
          <div className="border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            Disimpan sebagai <span className="font-bold text-slate-900">{loginProfile.nama}</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {TES_ITEMS.map((t) => (
              <label key={t.key} className={labelCls}>
                {t.label}
                <input
                  type="number"
                  step="any"
                  min="0"
                  placeholder={`Standar ${t.standar}`}
                  value={hasil[t.key] || ''}
                  onChange={(e) => setHasil({ ...hasil, [t.key]: e.target.value })}
                  className={inputCls}
                />
              </label>
            ))}
          </div>
          <PhotoInput foto={foto} setFoto={setFoto} label="Foto kegiatan (opsional)" />
        </FormShell>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
            Riwayat saya <span className="text-orange-600">({milikSaya.length})</span>
          </p>
          <div className="mt-4 divide-y divide-slate-200 border-y border-slate-200">
            {milikSaya.map((it) => (
              <div key={it.id} className="flex items-center gap-4 py-4">
                {it.foto ? (
                  <img src={it.foto} alt="" className="h-11 w-11 shrink-0 rounded-full object-cover" />
                ) : (
                  <div className="font-display flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                    {it.nama.split(' ').map((w) => w[0]).slice(0, 2).join('')}
                  </div>
                )}
                <div className="min-w-0 flex-1 text-sm">
                  <div className="font-bold text-slate-900">{it.tanggal}</div>
                  <div className="text-slate-500">
                    Lari {it.hasil.lari}' · Push-up {it.hasil.pushup}x · Sit-up {it.hasil.situp}x · Pull-up {it.hasil.pullup}x
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => hapus(it.id)}
                  className="shrink-0 text-xs font-bold uppercase tracking-widest text-slate-400 transition hover:text-red-600"
                >
                  Hapus
                </button>
              </div>
            ))}
            {milikSaya.length === 0 && (
              <p className="py-8 text-center text-sm text-slate-400">Belum ada data — silakan isi formulir</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const JENIS_UJI = ['Uji Fisik Semester I', 'Uji Fisik Semester II', 'Uji Keterampilan Tahunan']

function UjiPeriodikForm() {
  const loginProfile = getLoginProfile()
  const [jenis, setJenis] = useState(JENIS_UJI[0])
  const [tanggal, setTanggal] = useState('')
  const [nilai, setNilai] = useState('')
  const [foto, setFoto] = useState('')
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [items, setItems] = useState(() => loadList(KEYS.ujiPeriodik))

  const milikSaya = useMemo(
    () => items.filter((it) => it.nama === loginProfile.nama),
    [items, loginProfile.nama]
  )
  // 5 uji terakhir bernilai angka — kronologis untuk grafik.
  const limaTerakhir = useMemo(() => milikSaya.slice(0, 5).reverse(), [milikSaya])
  const titikGrafik = useMemo(
    () =>
      limaTerakhir
        .map((it) => ({ label: it.tanggalUji || it.tanggal, value: parseFloat(it.nilai), hint: `${it.jenis}: ${it.nilai}` }))
        .filter((p) => Number.isFinite(p.value)),
    [limaTerakhir]
  )

  const submit = (e) => {
    e.preventDefault()
    setError('')
    setDone(false)
    if (!tanggal || !nilai) return setError('Lengkapi tanggal dan nilai.')
    setItems(addEntry(KEYS.ujiPeriodik, { nama: loginProfile.nama, jenis, tanggalUji: tanggal, nilai, foto }))
    setTanggal('')
    setNilai('')
    setFoto('')
    setDone(true)
  }

  const hapus = (id) => setItems(removeEntry(KEYS.ujiPeriodik, id))

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-5 py-12 sm:px-8 lg:py-16">
      <ProfilSayaCard profile={loginProfile} countLabel={`${milikSaya.length} uji tercatat`} />

      {/* Grafik 5 uji terakhir */}
      <section>
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
          Grafik 5 uji terakhir
        </p>
        <h2 className="font-display mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
          Tren nilai periodik
        </h2>
        <div className="mt-4">
          <HistoryChart points={titikGrafik} unit="" emptyText="Belum ada nilai angka — isi formulir dengan nilai angka (cth: 85) untuk melihat grafik" />
        </div>
      </section>

      <div className="grid items-start gap-12 lg:grid-cols-2">
        <FormShell title="Hasil uji periodik" onSubmit={submit} error={error} done={done}>
          <div className="border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            Disimpan sebagai <span className="font-bold text-slate-900">{loginProfile.nama}</span>
          </div>
          <label className={labelCls}>
            Jenis uji
            <select value={jenis} onChange={(e) => setJenis(e.target.value)} className={inputCls}>
              {JENIS_UJI.map((j) => (
                <option key={j}>{j}</option>
              ))}
            </select>
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className={labelCls}>
              Tanggal uji
              <input type="date" value={tanggal} onChange={(e) => setTanggal(e.target.value)} className={inputCls} />
            </label>
            <label className={labelCls}>
              Nilai / hasil
              <input
                value={nilai}
                onChange={(e) => setNilai(e.target.value)}
                placeholder="cth: 85 / Lulus"
                className={inputCls}
              />
            </label>
          </div>
          <PhotoInput foto={foto} setFoto={setFoto} label="Foto bukti / dokumen (opsional)" />
        </FormShell>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
            Riwayat saya <span className="text-orange-600">({milikSaya.length})</span>
          </p>
          <div className="mt-4 divide-y divide-slate-200 border-y border-slate-200">
            {milikSaya.map((it) => (
              <div key={it.id} className="flex items-center gap-4 py-4">
                {it.foto ? (
                  <img src={it.foto} alt="" className="h-11 w-11 shrink-0 rounded-full object-cover" />
                ) : (
                  <div className="font-display flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                    {it.nama.split(' ').map((w) => w[0]).slice(0, 2).join('')}
                  </div>
                )}
                <div className="min-w-0 flex-1 text-sm">
                  <div className="font-bold text-slate-900">{it.jenis}</div>
                  <div className="text-slate-500">
                    {it.tanggalUji} · Nilai: {it.nilai}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => hapus(it.id)}
                  className="shrink-0 text-xs font-bold uppercase tracking-widest text-slate-400 transition hover:text-red-600"
                >
                  Hapus
                </button>
              </div>
            ))}
            {milikSaya.length === 0 && (
              <p className="py-8 text-center text-sm text-slate-400">Belum ada data — silakan isi formulir</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function KeahlianForm() {
  // Profil pegawai yang sedang login — 1 akun, bukan general.
  const loginProfile = getLoginProfile()
  const [kategori, setKategori] = useState(KEAHLIAN_GROUPS[0].nama)
  const [keahlian, setKeahlian] = useState(KEAHLIAN_GROUPS[0].items[0].nama)
  const [customNama, setCustomNama] = useState('')
  const [penerbit, setPenerbit] = useState('Basarnas')
  const [berlaku, setBerlaku] = useState('')
  const [foto, setFoto] = useState('')
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [items, setItems] = useState(() => loadList(KEYS.keahlian))

  const opsiKeahlian = useMemo(() => {
    const g = KEAHLIAN_GROUPS.find((x) => x.nama === kategori)
    return g ? g.items : []
  }, [kategori])

  const isCustom = keahlian === '__lainnya__'
  const namaKeahlian = (it) => it.keahlian || it.sertifikat || '-'

  const milikSaya = useMemo(
    () => items.filter((it) => it.nama === loginProfile.nama),
    [items, loginProfile.nama]
  )
  const dimilikiSet = useMemo(() => new Set(milikSaya.map(namaKeahlian)), [milikSaya])

  const pickKategori = (v) => {
    setKategori(v)
    const g = KEAHLIAN_GROUPS.find((x) => x.nama === v)
    setKeahlian(g ? g.items[0].nama : '')
    setError('')
    setDone(false)
  }

  const submit = (e) => {
    e.preventDefault()
    setError('')
    setDone(false)
    const finalNama = isCustom ? customNama.trim() : keahlian
    if (!finalNama) return setError('Pilih keahlian atau isi nama keahlian lainnya.')
    if (!foto) return setError('Lampirkan foto bukti keahlian.')
    const ref = getKeahlianByName(finalNama)
    setItems(
      addEntry(KEYS.keahlian, {
        nama: loginProfile.nama,
        kategori,
        keahlian: finalNama,
        deskripsi: ref?.desc || '',
        penerbit: penerbit.trim() || 'Basarnas',
        berlaku,
        foto,
      })
    )
    setCustomNama('')
    setBerlaku('')
    setFoto('')
    setDone(true)
  }

  const hapus = (id) => {
    setItems(removeEntry(KEYS.keahlian, id))
  }

  const profilInfo = [
    ['Nama Lengkap', loginProfile.nama],
    ['NIP', loginProfile.nip],
    ['Tempat, Tanggal Lahir', loginProfile.ttl],
    ['Jabatan', loginProfile.jabatan],
    ['Pangkat / Golongan', loginProfile.pangkat],
    ['Unit / Divisi', loginProfile.divisi],
    ['Masa Kerja', loginProfile.masaKerja],
  ]

  return (
    <div className="mx-auto max-w-7xl space-y-14 px-5 py-12 sm:px-8 lg:py-16">
      {/* 01 — Informasi pribadi yang sedang login */}
      <section>
        <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
          <span className="font-display text-orange-600">01</span> Informasi pribadi
        </p>
        <p className="mt-1 text-sm text-slate-500">
          Tercatat sebagai <span className="font-semibold text-slate-900">{loginProfile.nama}</span> — data keahlian di bawah akan tersimpan atas nama ini.
        </p>
        <div className="mt-4 border border-slate-200 bg-slate-50/60 p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-4">
            <div className="font-display flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
              {loginProfile.nama.split(' ').map((w) => w[0]).slice(0, 2).join('')}
            </div>
            <div className="min-w-0">
              <h2 className="font-display truncate text-2xl font-bold tracking-tight">{loginProfile.nama}</h2>
              <p className="mt-0.5 text-sm text-slate-500">
                {loginProfile.jabatan} · {loginProfile.divisi}
              </p>
            </div>
            <span className="ml-auto flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-600">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              {milikSaya.length} keahlian tercatat
            </span>
          </div>
          <dl className="mt-6 divide-y divide-slate-200 border-y border-slate-200">
            {profilInfo.map(([label, value]) => (
              <div key={label} className="grid gap-1 py-3 text-sm sm:grid-cols-[220px_1fr] sm:gap-6">
                <dt className="text-slate-400">{label}</dt>
                <dd className="font-semibold text-slate-900">{value}</dd>
              </div>
            ))}
          </dl>

          {/* Keahlian saya — menyatu di dalam card informasi pribadi */}
          <div className="mt-6 border-t border-slate-200 pt-6">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
              Keahlian saya <span className="text-orange-600">({milikSaya.length})</span>
            </p>
            <div className="mt-4 divide-y divide-slate-200 border-y border-slate-200 bg-white">
              {milikSaya.map((it) => (
                <div key={it.id} className="flex items-start gap-4 px-4 py-4">
                  {it.foto ? (
                    <img src={it.foto} alt="" className="h-14 w-14 shrink-0 border border-slate-200 object-cover" />
                  ) : (
                    <div className="font-display flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                      {it.nama.split(' ').map((w) => w[0]).slice(0, 2).join('')}
                    </div>
                  )}
                  <div className="min-w-0 flex-1 text-sm">
                    <div className="font-bold text-slate-900">{namaKeahlian(it)}</div>
                    <div className="mt-0.5 text-slate-500">{it.kategori || 'Keahlian'}</div>
                    <div className="mt-0.5 text-slate-500">
                      {it.penerbit || 'Basarnas'}
                      {it.berlaku ? ` · s/d ${it.berlaku}` : ''} · {it.tanggal}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => hapus(it.id)}
                    className="shrink-0 text-xs font-bold uppercase tracking-widest text-slate-400 transition hover:text-red-600"
                  >
                    Hapus
                  </button>
                </div>
              ))}
              {milikSaya.length === 0 && (
                <p className="px-4 py-8 text-center text-sm text-slate-400">
                  Belum ada keahlian tercatat — pilih dari daftar lalu tambah beserta foto bukti
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 02 — Daftar keahlian */}
      <section>
        <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
          <span className="font-display text-orange-600">02</span> Daftar keahlian
        </p>
        <p className="mt-1 text-sm text-slate-500">
          Acuan resmi kompetensi personel — pilih salah satu untuk ditambahkan sebagai milik Anda melalui formulir di bawah.
        </p>
        <div className="mt-4 space-y-6">
          {KEAHLIAN_GROUPS.map((g, gi) => (
            <div key={g.id} className="border border-slate-200">
              <div className="border-b border-slate-200 bg-white px-6 py-5">
                <p className="text-xs font-bold uppercase tracking-widest text-orange-600">
                  Kelompok {String(gi + 1).padStart(2, '0')}
                </p>
                <h3 className="font-display mt-1 text-xl font-bold tracking-tight">{g.nama}</h3>
                <p className="mt-1 text-sm text-slate-500">{g.desc}</p>
              </div>
              <div className="divide-y divide-slate-100">
                {g.items.map((k) => {
                  const owned = dimilikiSet.has(k.nama)
                  return (
                    <div key={k.nama} className="flex items-start gap-4 bg-white px-6 py-4">
                      <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${owned ? 'bg-emerald-500' : 'bg-orange-600'}`} />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[15px] font-bold text-slate-900">{k.nama}</span>
                          {owned && (
                            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-widest text-emerald-700">
                              Dimiliki
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-sm leading-relaxed text-slate-500">{k.desc}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setKategori(g.nama)
                          setKeahlian(k.nama)
                          setError('')
                          setDone(false)
                          document.getElementById('form-tambah-keahlian')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                        }}
                        className="shrink-0 rounded-full border border-slate-300 px-4 py-1.5 text-xs font-bold text-slate-700 transition hover:border-orange-600 hover:text-orange-600"
                      >
                        Pilih
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 03 — Tambah keahlian */}
      <section id="form-tambah-keahlian" className="scroll-mt-24">
        <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
          <span className="font-display text-orange-600">03</span> Tambah keahlian
        </p>
        <p className="mt-1 text-sm text-slate-500">
          Pilih dari daftar acuan lalu simpan beserta foto bukti — otomatis masuk ke card informasi pribadi di atas.
        </p>
        <div className="mt-4 max-w-2xl">
          <FormShell title="Tambah keahlian" onSubmit={submit} error={error} done={done}>
            <div className="border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              Disimpan sebagai <span className="font-bold text-slate-900">{loginProfile.nama}</span>
            </div>
            <label className={labelCls}>
              Kelompok keahlian
              <select value={kategori} onChange={(e) => pickKategori(e.target.value)} className={inputCls}>
                {KEAHLIAN_GROUPS.map((g) => (
                  <option key={g.id} value={g.nama}>
                    {g.nama}
                  </option>
                ))}
              </select>
            </label>
            <label className={labelCls}>
              Nama keahlian
              <select value={keahlian} onChange={(e) => { setKeahlian(e.target.value); setError(''); setDone(false) }} className={inputCls}>
                {opsiKeahlian.map((k) => (
                  <option key={k.nama} value={k.nama}>
                    {k.nama}
                  </option>
                ))}
                <option value="__lainnya__">Lainnya (tulis manual)</option>
              </select>
            </label>
            {isCustom && (
              <label className={labelCls}>
                Tulis nama keahlian
                <input
                  value={customNama}
                  onChange={(e) => setCustomNama(e.target.value)}
                  placeholder="cth: Rope Access Level 2"
                  className={inputCls}
                />
              </label>
            )}
            {!isCustom && (
              <p className="border-l-2 border-slate-200 pl-3 text-sm text-slate-500">
                {getKeahlianByName(keahlian)?.desc}
              </p>
            )}
            <div className="grid grid-cols-2 gap-4">
              <label className={labelCls}>
                Penerbit / lembaga
                <input
                  value={penerbit}
                  onChange={(e) => setPenerbit(e.target.value)}
                  placeholder="cth: Basarnas"
                  className={inputCls}
                />
              </label>
              <label className={labelCls}>
                Berlaku hingga (opsional)
                <input type="date" value={berlaku} onChange={(e) => setBerlaku(e.target.value)} className={inputCls} />
              </label>
            </div>
            <PhotoInput foto={foto} setFoto={setFoto} label="Foto bukti keahlian / sertifikat (wajib)" />
          </FormShell>

          <p className="mt-4 text-xs leading-relaxed text-slate-400">
            Total {KEAHLIAN_FLAT.length} jenis keahlian acuan dalam 4 kelompok. Data tersimpan lokal dan diteruskan ke pantauan admin.
          </p>
        </div>
      </section>
    </div>
  )
}

export default function PegawaiPage({ fitur }) {
  if (fitur === 'Kesamaptaan') {
    return (
      <div className="bg-white text-slate-900">
        <PageHead eyebrow="Input mandiri pegawai" title="Tes kesamaptaan." sub="Hasil kebugaran fisik Anda — tercatat otomatis atas nama akun yang sedang login." />
        <KesamaptaanForm />
      </div>
    )
  }

  if (fitur === 'Uji Periodik') {
    return (
      <div className="bg-white text-slate-900">
        <PageHead eyebrow="Input mandiri pegawai" title="Uji periodik." sub="Hasil ujian berkala Anda — tercatat otomatis atas nama akun yang sedang login." />
        <UjiPeriodikForm />
      </div>
    )
  }

  return (
    <div className="bg-white text-slate-900">
      <PageHead eyebrow="Input mandiri pegawai" title="Keahlian." sub="Profil Anda, daftar resmi 13 keahlian Basarnas dalam 4 kelompok, tambah milik Anda beserta foto bukti." />
      <KeahlianForm />
    </div>
  )
}
