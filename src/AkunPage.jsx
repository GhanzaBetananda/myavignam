import { PROFILES } from './utils/profil'
import { KEYS, loadList } from './utils/storage'

const ADMIN_PROFILE = {
  nama: 'Administrator MyAvignam',
  nip: '19850101 1 0001',
  jabatan: 'Admin Sistem',
  pangkat: 'Penata / III-c',
  divisi: 'Administrasi & Umum',
  masaKerja: '10 tahun 0 bulan',
}

function SectionTitle({ index, title, sub }) {
  return (
    <div>
      <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
        <span className="font-display text-orange-600">{index}</span> {title}
      </p>
      {sub && <p className="mt-1 text-sm text-slate-500">{sub}</p>}
    </div>
  )
}

export default function AkunPage({ role }) {
  const isAdmin = role === 'admin'
  const p = isAdmin ? ADMIN_PROFILE : PROFILES[0]

  const info = [
    ['Nama Lengkap', p.nama],
    ['NIP', p.nip],
    ['Jabatan', p.jabatan],
    ['Pangkat / Golongan', p.pangkat],
    ['Unit / Divisi', p.divisi],
    ['Masa Kerja', p.masaKerja],
    ['Peran Akun', isAdmin ? 'Admin / Pimpinan' : 'Pegawai'],
  ]

  // Tes yang berhasil dilaksanakan pemilik akun
  const tes = isAdmin
    ? []
    : [
        ...loadList(KEYS.kesamaptaan)
          .filter((it) => it.nama === p.nama)
          .map((it) => ({
            id: `kes-${it.id}`,
            jenis: 'Tes Kesamaptaan',
            judul: `Lari ${it.hasil?.lari}' · Push-up ${it.hasil?.pushup}x · Sit-up ${it.hasil?.situp}x`,
            tanggal: it.tanggal,
          })),
        ...loadList(KEYS.ujiPeriodik)
          .filter((it) => it.nama === p.nama)
          .map((it) => ({
            id: `per-${it.id}`,
            jenis: 'Uji Periodik',
            judul: `${it.jenis} — Nilai ${it.nilai}`,
            tanggal: it.tanggalUji || it.tanggal,
          })),
        ...loadList(KEYS.ukom)
          .filter((it) => it.nama === p.nama)
          .map((it) => ({
            id: `ukom-${it.id}`,
            jenis: 'Uji Kompetensi',
            judul: `${it.jenjang} — ${it.done}/${it.total} materi (${it.progress}%)`,
            tanggal: it.tanggal,
          })),
      ]

  // Keahlian yang dimiliki pemilik akun
  const keahlian = isAdmin
    ? []
    : [
        ...loadList(KEYS.keahlian)
          .filter((it) => it.nama === p.nama)
          .map((it) => ({
            id: `ser-${it.id}`,
            nama: it.keahlian || it.sertifikat || '-',
            detail: `${it.kategori || 'Keahlian'} · ${it.penerbit || 'Basarnas'}${it.berlaku ? ` · berlaku s/d ${it.berlaku}` : ''}`,
          })),
        ...loadList(KEYS.ukom)
          .filter((it) => it.nama === p.nama && it.progress === 100)
          .map((it) => ({
            id: `ahl-${it.id}`,
            nama: it.jenjang,
            detail: `Checklist UKOM tuntas ${it.tanggal}`,
          })),
      ]

  return (
    <div className="bg-white text-slate-900">
      <div className="border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:py-16">
          <p className="anim-fade-up flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-orange-600">
            <span className="inline-block h-px w-10 bg-orange-600" />
            Akun saya
          </p>
          <h1 className="anim-fade-up-1 font-display mt-3 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            {p.nama}
          </h1>
          <p className="anim-fade-up-2 mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-slate-500">
            <span>{p.jabatan}</span>
            <span className="text-slate-300">·</span>
            <span>{p.divisi}</span>
            <span className="text-slate-300">·</span>
            <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-600">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Aktif
            </span>
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-14 px-5 py-12 sm:px-8">
        <section>
          <SectionTitle index="01" title="Data diri" />
          <dl className="mt-4 divide-y divide-slate-200 border-y border-slate-200">
            {info.map(([label, value]) => (
              <div key={label} className="grid gap-1 py-4 text-sm sm:grid-cols-[220px_1fr] sm:gap-6">
                <dt className="text-slate-400">{label}</dt>
                <dd className="font-semibold text-slate-900">{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        {!isAdmin && (
          <section>
            <SectionTitle
              index="02"
              title="Tes yang berhasil dilaksanakan"
              sub="Hasil tes kesamaptaan, uji periodik, dan UKOM yang telah Anda input."
            />
            <div className="mt-4 border-t border-slate-200">
              {tes.map((t) => (
                <div key={t.id} className="flex items-center gap-4 border-b border-slate-200 py-4">
                  <span className="flex h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                  <div className="min-w-0 flex-1">
                    <div className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                      {t.jenis}
                    </div>
                    <div className="truncate text-[15px] font-semibold text-slate-900">{t.judul}</div>
                  </div>
                  <span className="shrink-0 text-sm text-slate-400">{t.tanggal}</span>
                </div>
              ))}
              {tes.length === 0 && (
                <p className="border-b border-slate-200 py-8 text-center text-sm text-slate-400">
                  Belum ada tes yang dilaksanakan — isi melalui menu Kesamaptaan, Uji Periodik, atau Ukom.
                </p>
              )}
            </div>
          </section>
        )}

        {!isAdmin && (
          <section>
            <SectionTitle
              index="03"
              title="Keahlian yang dimiliki"
              sub="Keahlian dan jenjang kompetensi yang telah Anda raih."
            />
            <div className="mt-4 grid gap-px border border-slate-200 bg-slate-200 sm:grid-cols-2 lg:grid-cols-3">
              {keahlian.map((k) => (
                <div key={k.id} className="bg-white p-6">
                  <span className="flex h-2 w-2 rounded-full bg-orange-600" />
                  <h3 className="font-display mt-3 text-lg font-bold tracking-tight">{k.nama}</h3>
                  <p className="mt-1 text-sm text-slate-500">{k.detail}</p>
                </div>
              ))}
              {keahlian.length === 0 && (
                <p className="bg-white p-8 text-center text-sm text-slate-400 sm:col-span-2 lg:col-span-3">
                  Belum ada keahlian tercatat — ajukan melalui menu Keahlian atau tuntaskan checklist UKOM.
                </p>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
