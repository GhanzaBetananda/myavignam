import { useMemo, useState } from 'react'
import HistoryChart from './components/HistoryChart.jsx'
import { getLoginProfile } from './utils/session'
import { KEYS, addEntry, loadList, removeEntry } from './utils/storage'

const JENJANG = [
  { id: 'pemula', nama: 'Rescuer Pemula' },
  { id: 'terampil', nama: 'Rescuer Terampil' },
  { id: 'mahir', nama: 'Rescuer Mahir' },
  { id: 'penyelia', nama: 'Rescuer Penyelia' },
]

const MATERI = {
  pemula: {
    pengetahuan: ['Pengenalan SAR', 'K3 Dasar', 'Pertolongan Pertama Dasar'],
    keterampilan: ['Medical First Responder (MFR)', 'Teknik Dasar Water Rescue'],
    kesamaptaan: ['Lari 2,4 km', 'Push-up', 'Sit-up', 'Renang 100 m'],
  },
  terampil: {
    pengetahuan: ['Navigasi Darat', 'Manajemen Insiden', 'Dasar Hukum SAR'],
    keterampilan: ['Medical First Responder (MFR)', 'Jungle Rescue', 'Water Rescue'],
    kesamaptaan: ['Lari 2,4 km', 'Push-up', 'Sit-up', 'Pull-up', 'Renang 200 m', 'Shuttle Run'],
  },
  mahir: {
    pengetahuan: ['Perencanaan Operasi SAR', 'Koordinasi Lapangan', 'Analisis Risiko'],
    keterampilan: ['High Angle Rescue Technique (HART)', 'Jungle Rescue', 'Water Rescue', 'MFR Lanjutan'],
    kesamaptaan: ['Lari 3,2 km', 'Push-up', 'Sit-up', 'Pull-up', 'Shuttle Run', 'Renang 400 m', 'Water Trappen'],
  },
  penyelia: {
    pengetahuan: ['Supervisi Operasi', 'Evaluasi Kinerja Tim', 'Manajemen Sumber Daya'],
    keterampilan: ['HART Lanjutan', 'Koordinasi Multi-Tim', 'MFR Instruktur'],
    kesamaptaan: ['Lari 3,2 km', 'Push-up', 'Sit-up', 'Pull-up', 'Shuttle Run', 'Renang 400 m', 'Water Trappen'],
  },
}

const JADWAL = [
  { jenjang: 'Rescuer Pemula', tanggal: '12 Okt 2026', lokasi: 'BWI Banyuwangi' },
  { jenjang: 'Rescuer Terampil', tanggal: '02 Nov 2026', lokasi: 'BWI Banyuwangi' },
  { jenjang: 'Rescuer Mahir', tanggal: '24 Nov 2026', lokasi: 'Jakarta' },
]

const KATEGORI = [
  { key: 'pengetahuan', label: 'Pengetahuan' },
  { key: 'keterampilan', label: 'Keterampilan' },
  { key: 'kesamaptaan', label: 'Kesamaptaan' },
]

export default function UkomPage() {
  const loginProfile = getLoginProfile()
  const [jenjang, setJenjang] = useState('pemula')
  const [checked, setChecked] = useState({})
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [riwayat, setRiwayat] = useState(() => loadList(KEYS.ukom))
  const materi = MATERI[jenjang]
  const idx = JENJANG.findIndex((j) => j.id === jenjang)

  const milikSaya = useMemo(
    () => riwayat.filter((it) => it.nama === loginProfile.nama),
    [riwayat, loginProfile.nama]
  )
  // 5 penyimpanan terakhir — kronologis (terlama -> terbaru) untuk grafik.
  const limaTerakhir = useMemo(() => milikSaya.slice(0, 5).reverse(), [milikSaya])
  const titikGrafik = useMemo(
    () =>
      limaTerakhir
        .map((it) => ({ label: it.tanggal, value: Number(it.progress), hint: `${it.jenjang}: ${it.progress}%` }))
        .filter((p) => Number.isFinite(p.value)),
    [limaTerakhir]
  )

  const allItems = KATEGORI.flatMap((k) => materi[k.key].map((m) => `${k.key}:${m}`))
  const done = allItems.filter((i) => checked[`${jenjang}:${i}`]).length
  const progress = allItems.length ? Math.round((done / allItems.length) * 100) : 0

  const toggle = (item) =>
    setChecked((c) => ({ ...c, [`${jenjang}:${item}`]: !c[`${jenjang}:${item}`] }))

  const simpanHasil = () => {
    setSaved(false)
    setSaveError('')
    setRiwayat(
      addEntry(KEYS.ukom, {
        nama: loginProfile.nama,
        jenjang: JENJANG[idx].nama,
        progress,
        done,
        total: allItems.length,
      })
    )
    setSaved(true)
  }

  const hapusRiwayat = (id) => setRiwayat(removeEntry(KEYS.ukom, id))

  return (
    <div className="bg-white text-slate-900">
      <div className="border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:py-16">
          <p className="anim-fade-up flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-orange-600">
            <span className="inline-block h-px w-10 bg-orange-600" />
            Uji kompetensi
          </p>
          <h1 className="anim-fade-up-1 font-display mt-3 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            UKOM Rescuer Basarnas.
          </h1>
          <p className="anim-fade-up-2 mt-4 max-w-xl text-slate-500">
            Empat jenjang kenaikan — tandai materi yang telah dikuasai, lalu
            simpan hasilnya atas nama akun Anda untuk diteruskan ke admin.
          </p>

          {/* Jenjang */}
          <div className="anim-fade-up-2 mt-10 grid grid-cols-2 gap-px border border-slate-200 bg-slate-200 sm:grid-cols-4">
            {JENJANG.map((j, i) => (
              <button
                key={j.id}
                onClick={() => setJenjang(j.id)}
                className={`bg-white px-4 py-5 text-left transition hover:bg-orange-50/50 ${
                  jenjang === j.id ? 'bg-orange-50/70' : ''
                }`}
              >
                <span className={`font-display text-xs font-bold tracking-widest ${i <= idx ? 'text-orange-600' : 'text-slate-300'}`}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className={`font-display mt-1 block text-base font-bold tracking-tight sm:text-lg ${jenjang === j.id ? 'text-slate-900' : 'text-slate-500'}`}>
                  {j.nama.replace('Rescuer ', '')}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:py-16">
        {/* Akun yang sedang login */}
        <div className="mb-10 border border-slate-200 bg-slate-50/60 p-6 sm:p-8">
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
              {milikSaya.length} hasil tersimpan
            </span>
          </div>
          <p className="mt-4 text-sm text-slate-500">
            Tercatat sebagai <span className="font-semibold text-slate-900">{loginProfile.nama}</span> — checklist di bawah tersimpan atas nama ini.
          </p>
        </div>

        {/* Progres */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
              Checklist persiapan
            </p>
            <h2 className="font-display mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
              {JENJANG[idx].nama}
            </h2>
          </div>
          <div className="font-display text-5xl font-bold tracking-tight sm:text-6xl">
            {progress}
            <span className="text-2xl text-orange-600">%</span>
          </div>
        </div>
        <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-1.5 rounded-full bg-orange-600 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 text-sm text-slate-500">{done} dari {allItems.length} materi selesai</p>

        {/* Materi */}
        <div className="mt-10 grid gap-10 md:grid-cols-3">
          {KATEGORI.map((k) => (
            <div key={k.key}>
              <h3 className="border-b-2 border-slate-900 pb-3 text-xs font-bold uppercase tracking-[0.25em]">
                {k.label}
              </h3>
              <ul className="divide-y divide-slate-100">
                {materi[k.key].map((m) => {
                  const id = `${k.key}:${m}`
                  const isDone = !!checked[`${jenjang}:${id}`]
                  return (
                    <li key={m}>
                      <label className="flex cursor-pointer items-start gap-3 py-3.5">
                        <input
                          type="checkbox"
                          checked={isDone}
                          onChange={() => toggle(id)}
                          className="mt-1 h-4 w-4 shrink-0 accent-orange-600"
                        />
                        <span className={`text-[15px] ${isDone ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                          {m}
                        </span>
                      </label>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Simpan */}
        <div className="mt-10 flex flex-col gap-3 border-t border-slate-200 pt-8 sm:flex-row sm:items-center">
          <div className="flex-1 border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-600">
            Disimpan sebagai <span className="font-bold text-slate-900">{loginProfile.nama}</span>
          </div>
          <button
            onClick={simpanHasil}
            className="rounded-full bg-slate-900 px-8 py-3.5 text-sm font-bold text-white transition hover:bg-orange-600"
          >
            Simpan Hasil
          </button>
        </div>
        {saveError && <p className="mt-3 border-l-2 border-red-500 pl-3 text-sm font-medium text-red-600">{saveError}</p>}
        {saved && <p className="mt-3 border-l-2 border-emerald-500 pl-3 text-sm font-medium text-emerald-700">Hasil checklist tersimpan dan diteruskan ke admin.</p>}

        {/* Grafik 5 penyimpanan terakhir */}
        <section className="mt-16">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
            Grafik 5 penyimpanan terakhir
          </p>
          <h2 className="font-display mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
            Tren progres checklist.
          </h2>
          <div className="mt-4">
            <HistoryChart points={titikGrafik} unit="%" emptyText="Belum ada hasil tersimpan — tandai checklist lalu simpan untuk melihat grafik" />
          </div>
        </section>

        {/* Jadwal & riwayat */}
        <div className="mt-16 grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">Jadwal UKOM.</h2>
            <div className="mt-4 divide-y divide-slate-200 border-y border-slate-200">
              {JADWAL.map((j) => (
                <div key={j.jenjang} className="flex items-baseline justify-between gap-4 py-4">
                  <div>
                    <div className="font-semibold">{j.jenjang}</div>
                    <div className="text-sm text-slate-500">{j.lokasi}</div>
                  </div>
                  <div className="shrink-0 text-sm font-bold text-orange-600">{j.tanggal}</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
              Riwayat saya <span className="text-slate-400">({milikSaya.length})</span>
            </h2>
            <div className="mt-4 overflow-x-auto border-y border-slate-200">
              <table className="w-full min-w-[420px] text-left text-sm">
                <thead>
                  <tr className="text-xs uppercase tracking-widest text-slate-400">
                    <th className="py-3 pr-4 font-semibold">Tanggal</th>
                    <th className="py-3 pr-4 font-semibold">Jenjang</th>
                    <th className="py-3 pr-4 font-semibold">Progres</th>
                    <th className="py-3 font-semibold"><span className="sr-only">Aksi</span></th>
                  </tr>
                </thead>
                <tbody>
                  {milikSaya.map((r) => (
                    <tr key={r.id} className="border-t border-slate-100">
                      <td className="py-3 pr-4 text-slate-500">{r.tanggal}</td>
                      <td className="py-3 pr-4 font-semibold">{r.jenjang}</td>
                      <td className="py-3 pr-4">
                        <span className="font-display text-base font-bold">{r.progress}%</span>
                        <span className="ml-2 text-xs text-slate-400">{r.done}/{r.total} materi</span>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => hapusRiwayat(r.id)}
                          className="text-xs font-bold uppercase tracking-widest text-slate-400 transition hover:text-red-600"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {milikSaya.length === 0 && (
                <p className="py-8 text-center text-sm text-slate-400">
                  Belum ada hasil tersimpan — tandai checklist lalu simpan
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
