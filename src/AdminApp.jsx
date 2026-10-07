import { useState } from 'react'
import AdminHeader from './AdminHeader.jsx'
import AkunPage from './AkunPage.jsx'
import DashboardIntro from './components/DashboardIntro.jsx'
import { DIVISIONS, MEMBERS, getMembersByDivision } from './utils/data'
import { KEYS, loadLeaves, loadList } from './utils/storage'

function PageHead({ eyebrow, title, sub, children }) {
  return (
    <div className="border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:py-16">
        <p className="anim-fade-up flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-orange-600">
          <span className="inline-block h-px w-10 bg-orange-600" />
          {eyebrow}
        </p>
        <h1 className="anim-fade-up-1 font-display mt-3 max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
          {title}
        </h1>
        {sub && <p className="anim-fade-up-2 mt-3 max-w-xl text-slate-500">{sub}</p>}
        {children}
      </div>
    </div>
  )
}

function FilterPills({ options, value, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {options.map((d) => (
        <button
          key={d}
          onClick={() => onChange(d)}
          className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-semibold transition ${
            value === d
              ? 'bg-slate-900 text-white'
              : 'text-slate-500 ring-1 ring-slate-200 hover:text-slate-900 hover:ring-slate-400'
          }`}
        >
          {d}
        </button>
      ))}
    </div>
  )
}

function Dashboard() {
  const total = MEMBERS.length
  const perDivisi = DIVISIONS.map((d) => ({
    ...d,
    count: getMembersByDivision(d.name).length,
  }))
  const kesamaptaan = loadList(KEYS.kesamaptaan)
  const ujiPeriodik = loadList(KEYS.ujiPeriodik)
  const ukom = loadList(KEYS.ukom)
  const keahlian = loadList(KEYS.keahlian)

  const rangkuman = [
    {
      title: 'Kesamaptaan',
      items: kesamaptaan,
      grad: 'from-orange-500 to-red-500',
      render: (it) => `Lari ${it.hasil?.lari}' · Push-up ${it.hasil?.pushup}x · ${it.tanggal}`,
    },
    {
      title: 'Uji Periodik',
      items: ujiPeriodik,
      grad: 'from-sky-500 to-indigo-500',
      render: (it) => `${it.jenis} · Nilai ${it.nilai} · ${it.tanggalUji}`,
    },
    {
      title: 'UKOM',
      items: ukom,
      grad: 'from-violet-500 to-purple-500',
      render: (it) => `${it.jenjang} · ${it.done}/${it.total} materi (${it.progress}%)`,
    },
    {
      title: 'Keahlian',
      items: keahlian,
      grad: 'from-emerald-500 to-teal-500',
      render: (it) => `${it.keahlian || it.sertifikat || '-'}${it.kategori ? ` · ${it.kategori}` : ''}${it.berlaku ? ` · s/d ${it.berlaku}` : ''}`,
    },
  ]

  return (
    <>
      <DashboardIntro
        role="admin"
        stats={[
          [total, 'Pegawai'],
          [DIVISIONS.length, 'Divisi'],
          [loadLeaves().length, 'Pengajuan Cuti'],
        ]}
      />
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-20">
        <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-orange-600">
          <span className="inline-block h-px w-10 bg-orange-600" />
          Pantauan terkini
        </p>
        <h2 className="font-display mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
          Rangkuman hasil pegawai.
        </h2>
        <div className="mt-10 border-t border-slate-200">
          {rangkuman.map((r) => (
            <div key={r.title} className="grid gap-4 border-b border-slate-200 py-8 lg:grid-cols-[240px_1fr] lg:gap-10">
              <div>
                <h3 className="font-display text-2xl font-bold tracking-tight">{r.title}</h3>
                <p className="mt-1 text-sm text-slate-500">
                  <span className="font-display text-lg font-bold text-orange-600">{r.items.length}</span> data masuk
                </p>
              </div>
              <div className="max-h-64 space-y-px overflow-y-auto border border-slate-200">
                {r.items.slice(0, 8).map((it) => (
                  <div key={it.id} className="flex items-center gap-4 bg-white px-4 py-3 transition hover:bg-orange-50/50">
                    {it.foto ? (
                      <img src={it.foto} alt="" className="h-11 w-11 shrink-0 rounded-xl object-cover" />
                    ) : (
                      <div className="font-display flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-xs font-bold text-white">
                        {it.nama.split(' ').map((w) => w[0]).slice(0, 2).join('')}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-bold text-slate-900">{it.nama}</div>
                      <div className="truncate text-sm text-slate-500">{r.render(it)}</div>
                    </div>
                    <span className="hidden text-xs text-slate-400 sm:block">{it.tanggal}</span>
                  </div>
                ))}
                {r.items.length === 0 && (
                  <div className="bg-white px-4 py-8 text-center text-sm text-slate-400">
                    Belum ada data masuk
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-16 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-orange-600">
          <span className="inline-block h-px w-10 bg-orange-600" />
          Kekuatan personel
        </p>
        <h2 className="font-display mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
          Komposisi per divisi.
        </h2>
        <div className="mt-10 border-t border-slate-200">
          {perDivisi.map((d) => (
            <div key={d.id} className="grid grid-cols-[1fr_auto] items-center gap-3 border-b border-slate-200 py-5 sm:grid-cols-[1fr_200px_64px] sm:gap-8">
              <div className="min-w-0">
                <div className="font-display truncate text-lg font-bold tracking-tight sm:text-xl">{d.name}</div>
                <div className="truncate text-sm text-slate-500">{d.description}</div>
              </div>
              <div className="hidden h-1.5 overflow-hidden rounded-full bg-slate-100 sm:block">
                <div
                  className="anim-bar h-1.5 rounded-full bg-orange-600"
                  style={{ width: `${Math.round((d.count / total) * 100)}%` }}
                />
              </div>
              <div className="font-display text-right text-2xl font-bold sm:text-3xl">
                {d.count}
                <span className="ml-1 text-xs font-semibold uppercase text-slate-400">org</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

function KelolaPegawai() {
  const [filter, setFilter] = useState('Semua')
  const list = filter === 'Semua' ? MEMBERS : getMembersByDivision(filter)

  return (
    <>
      <PageHead eyebrow="Administrasi" title="Kelola pegawai." sub={`${MEMBERS.length} personel terdaftar di lima divisi.`}>
        <div className="mt-6">
          <FilterPills
            options={['Semua', ...DIVISIONS.map((d) => d.name)]}
            value={filter}
            onChange={setFilter}
          />
        </div>
      </PageHead>
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        <div className="overflow-x-auto border border-slate-200">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-widest text-slate-400">
                <th className="px-5 py-4 font-semibold">ID</th>
                <th className="px-5 py-4 font-semibold">Nama</th>
                <th className="px-5 py-4 font-semibold">Divisi</th>
              </tr>
            </thead>
            <tbody>
              {list.map((m) => (
                <tr key={m.id} className="border-b border-slate-100 transition last:border-0 hover:bg-orange-50/40">
                  <td className="px-5 py-3.5 font-mono text-xs font-bold text-orange-600">{m.id}</td>
                  <td className="px-5 py-3.5 font-semibold text-slate-900">{m.nama}</td>
                  <td className="px-5 py-3.5 text-slate-500">{m.divisi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

function KelolaCuti() {
  const [leaves] = useState(() => loadLeaves())

  return (
    <>
      <PageHead eyebrow="Administrasi" title="Kelola cuti." sub={`${leaves.length} pengajuan masuk dari personel.`} />
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        <div className="border-t border-slate-200">
          {leaves.map((l) => (
            <div
              key={`${l.nama}-${l.mulai}`}
              className="flex items-center gap-5 border-b border-slate-200 py-5"
            >
              <div className="font-display flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                {l.nama.split(' ').map((w) => w[0]).slice(0, 2).join('')}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-display truncate text-lg font-bold tracking-tight">{l.nama}</div>
                <div className="text-sm text-slate-500">
                  {l.divisi} · {l.mulai} s/d {l.selesai}
                </div>
              </div>
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-600">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                Menunggu
              </span>
            </div>
          ))}
        </div>
        {leaves.length === 0 && (
          <p className="border-b border-slate-200 py-12 text-center text-sm text-slate-400">
            Belum ada pengajuan cuti
          </p>
        )}
      </div>
    </>
  )
}

function KelolaUkom() {
  const jadwal = [
    { jenjang: 'Rescuer Pemula', tanggal: '12 Okt 2026', lokasi: 'BWI Banyuwangi', peserta: 24 },
    { jenjang: 'Rescuer Terampil', tanggal: '02 Nov 2026', lokasi: 'BWI Banyuwangi', peserta: 18 },
    { jenjang: 'Rescuer Mahir', tanggal: '24 Nov 2026', lokasi: 'Jakarta', peserta: 30 },
  ]
  const hasil = loadList(KEYS.ukom)

  return (
    <>
      <PageHead eyebrow="Administrasi" title="Kelola UKOM." sub="Jadwal uji kompetensi dan progres persiapan peserta." />
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        <div className="grid gap-px border border-slate-200 bg-slate-200 sm:grid-cols-3">
          {jadwal.map((j) => (
            <div key={j.jenjang} className="bg-white p-7">
              <div className="text-xs font-bold uppercase tracking-widest text-orange-600">{j.tanggal}</div>
              <div className="font-display mt-2 text-xl font-bold tracking-tight">{j.jenjang}</div>
              <div className="mt-1 text-sm text-slate-500">{j.lokasi}</div>
              <div className="font-display mt-4 text-4xl font-bold">
                {j.peserta}
                <span className="ml-2 text-xs font-semibold uppercase tracking-widest text-slate-400">peserta</span>
              </div>
            </div>
          ))}
        </div>

        <h2 className="font-display mt-14 text-2xl font-bold tracking-tight sm:text-3xl">
          Progres peserta <span className="text-slate-400">({hasil.length})</span>
        </h2>
        <div className="mt-6 overflow-x-auto border border-slate-200">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-widest text-slate-400">
                <th className="px-5 py-4 font-semibold">Nama</th>
                <th className="px-5 py-4 font-semibold">Jenjang</th>
                <th className="px-5 py-4 font-semibold">Progres</th>
                <th className="px-5 py-4 font-semibold">Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {hasil.map((h) => (
                <tr key={h.id} className="border-b border-slate-100 transition last:border-0 hover:bg-orange-50/40">
                  <td className="px-5 py-3.5 font-semibold text-slate-900">{h.nama}</td>
                  <td className="px-5 py-3.5 text-slate-500">{h.jenjang}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="h-1.5 w-28 overflow-hidden rounded-full bg-slate-100">
                        <div className="h-1.5 rounded-full bg-orange-600" style={{ width: `${h.progress}%` }} />
                      </div>
                      <span className="font-display text-sm font-bold">{h.progress}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-500">{h.tanggal}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {hasil.length === 0 && (
            <p className="border-t border-slate-200 py-8 text-center text-sm text-slate-400">
              Belum ada hasil checklist yang disimpan peserta
            </p>
          )}
        </div>
      </div>
    </>
  )
}

export default function AdminApp() {
  const [active, setActive] = useState('Dashboard')

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <AdminHeader active={active} setActive={setActive} />
      {active === 'Kelola Pegawai' ? (
        <KelolaPegawai />
      ) : active === 'Akun' ? (
        <AkunPage role="admin" />
      ) : active === 'Kelola Cuti' ? (
        <KelolaCuti />
      ) : active === 'Kelola UKOM' ? (
        <KelolaUkom />
      ) : (
        <Dashboard />
      )}
    </div>
  )
}
