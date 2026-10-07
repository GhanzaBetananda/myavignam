const FITUR_PEGAWAI = [
  { nama: 'Pengajuan Cuti', desc: 'Formulir mandiri dengan kalender jadwal terpadu.', target: 'Cuti' },
  { nama: 'Uji Kompetensi', desc: 'Checklist materi per jenjang, dari Pemula hingga Penyelia.', target: 'Pegawai/Ukom' },
  { nama: 'Kesamaptaan', desc: 'Catat hasil tes fisik: lari, renang, hingga water trappen.', target: 'Pegawai/Kesamaptaan' },
  { nama: 'Uji Periodik', desc: 'Dokumentasikan hasil ujian berkala semester dan tahunan.', target: 'Pegawai/Uji Periodik' },
  { nama: 'Keahlian', desc: 'Profil Anda, 13 keahlian acuan Basarnas, tambah beserta foto bukti.', target: 'Pegawai/Keahlian' },
  { nama: 'Profil Pegawai', desc: 'Biodata, jabatan, dan riwayat mutasi seluruh personel.', target: 'Profil' },
]

const FITUR_ADMIN = [
  { nama: 'Rangkuman Hasil', desc: 'Pantau seluruh data yang diinput mandiri oleh pegawai.' },
  { nama: 'Kelola Pegawai', desc: 'Komposisi 42 personel di lima divisi operasional.' },
  { nama: 'Kelola Cuti', desc: 'Seluruh pengajuan cuti yang masuk dalam satu tempat.' },
  { nama: 'Kelola UKOM', desc: 'Jadwal uji kompetensi dan progres tiap peserta.' },
]

const GALERI = [
  { src: '/tes1.jpg', caption: 'Siaga', desc: 'Kesiapsiagaan 24/7 untuk setiap panggilan darurat.' },
  { src: '/tes2.jpg', caption: 'Kompeten', desc: 'Personel terlatih dengan kompetensi tersertifikasi.' },
  { src: '/tes3.jpg', caption: 'Bersinergi', desc: 'Satu tim, satu komando dalam setiap operasi SAR.' },
]

export default function DashboardIntro({ role, onNavigate, stats }) {
  const isAdmin = role === 'admin'
  const fitur = isAdmin ? FITUR_ADMIN : FITUR_PEGAWAI

  return (
    <div className="bg-white text-slate-900">
      {/* Hero editorial */}
      <section className="mx-auto grid max-w-7xl items-center gap-8 px-5 pb-10 pt-8 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:gap-12 lg:pb-12 lg:pt-10">
        <div>
          <p className="anim-fade-up flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-orange-600">
            <span className="inline-block h-px w-10 bg-orange-600" />
            {isAdmin ? 'Panel Admin / Pimpinan' : 'Portal Pegawai'}
          </p>
          <h1 className="anim-fade-up-1 font-display mt-4 text-4xl font-bold leading-[1.02] tracking-tight sm:text-5xl xl:text-6xl">
            Satu sistem untuk <span className="text-orange-600">kesiapsiagaan</span> nasional.
          </h1>
          <p className="anim-fade-up-2 mt-4 max-w-md text-sm leading-relaxed text-slate-500 sm:text-base">
            {isAdmin
              ? 'MyAvignam merangkum seluruh hasil kerja kepegawaian — cuti, UKOM, kesamaptaan, uji periodik, dan keahlian — dalam satu pantauan.'
              : 'MyAvignam mendampingi setiap personel Basarnas Banyuwangi: ajukan cuti, catat hasil uji, dan kelola keahlian — mandiri dan terdokumentasi.'}
          </p>
          {!isAdmin && (
            <div className="anim-fade-up-2 mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => onNavigate?.('Cuti')}
                className="rounded-full bg-orange-600 px-7 py-3 text-sm font-bold text-white shadow-xl shadow-orange-600/25 transition hover:bg-slate-900"
              >
                Ajukan Cuti
              </button>
              <button
                onClick={() => onNavigate?.('Profil')}
                className="rounded-full border border-slate-300 px-7 py-3 text-sm font-bold text-slate-800 transition hover:border-slate-900"
              >
                Lihat Profil
              </button>
            </div>
          )}
          {stats && (
            <dl className="anim-fade-up-2 mt-7 grid grid-cols-3 gap-6 border-t border-slate-200 pt-6">
              {stats.map(([v, l]) => (
                <div key={l}>
                  <dt className="sr-only">{l}</dt>
                  <dd className="font-display text-2xl font-bold tracking-tight sm:text-3xl">{v}</dd>
                  <dd className="mt-1 text-xs font-semibold uppercase tracking-widest text-slate-400">{l}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
        <div className="anim-fade-up-1 relative">
          <div className="overflow-hidden rounded-[2rem]">
            <img
              src="/tes1.jpg"
              alt="Operasi SAR Basarnas"
              className="aspect-[16/10] w-full object-cover transition duration-700 hover:scale-105"
            />
          </div>
          <div className="absolute -bottom-5 -left-3 flex items-center gap-3 rounded-2xl bg-slate-900 px-5 py-4 text-white shadow-2xl sm:-left-6">
            <div className="font-display text-2xl font-bold text-orange-500">24/7</div>
            <div className="text-[11px] font-semibold uppercase tracking-widest text-slate-300">
              Siaga pencarian &amp; pertolongan
            </div>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="overflow-hidden border-y border-slate-900 bg-slate-900 py-4">
        <div className="anim-marquee flex w-max items-center gap-8 whitespace-nowrap">
          {[0, 1].map((k) => (
            <div key={k} className="flex items-center gap-8">
              {['Siaga', 'Kompeten', 'Bersinergi', 'Profesional', 'Terpercaya'].map((w) => (
                <span key={w} className="flex items-center gap-8">
                  <span className="font-display text-lg font-bold uppercase tracking-widest text-white">{w}</span>
                  <span className="h-2 w-2 rounded-full bg-orange-600" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Galeri */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-orange-600">
              <span className="inline-block h-px w-10 bg-orange-600" />
              Semangat pengabdian
            </p>
            <h2 className="font-display mt-3 max-w-md text-4xl font-bold tracking-tight sm:text-5xl">
              Satu tim, satu kesiapsiagaan.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-slate-500">
            Dokumentasi kesiapan personel Basarnas Banyuwangi — terlatih, terdisiplin, dan selalu siap bergerak.
          </p>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {GALERI.map((g, i) => (
            <figure
              key={g.caption}
              className={`group relative overflow-hidden rounded-[1.75rem] ${i === 1 ? 'sm:translate-y-8' : ''}`}
            >
              <img
                src={g.src}
                alt={g.caption}
                className="h-80 w-full object-cover transition duration-700 group-hover:scale-105 sm:h-96"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 p-6">
                <span className="font-display text-2xl font-bold text-white">{g.caption}</span>
                <p className="mt-1 max-w-[26ch] text-sm text-slate-300">{g.desc}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Fitur sebagai daftar editorial */}
      <section className="border-t border-slate-200 bg-slate-50/60">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
          <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-orange-600">
            <span className="inline-block h-px w-10 bg-orange-600" />
            {isAdmin ? 'Ruang lingkup pantauan' : 'Jelajahi fitur'}
          </p>
          <h2 className="font-display mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            {isAdmin ? 'Semua dalam satu pantauan.' : 'Semua dalam satu genggaman.'}
          </h2>
          <div className="mt-10 border-t border-slate-200">
            {fitur.map((f, i) => (
              <button
                key={f.nama}
                onClick={() => f.target && onNavigate?.(f.target)}
                disabled={!f.target}
                className={`group flex w-full items-center gap-5 border-b border-slate-200 py-6 text-left transition sm:gap-8 sm:py-7 ${
                  f.target ? 'hover:bg-white' : 'cursor-default'
                }`}
              >
                <span className="font-display w-10 shrink-0 text-sm font-bold text-slate-300 transition group-hover:text-orange-600">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="font-display block truncate text-xl font-bold tracking-tight sm:text-2xl">
                    {f.nama}
                  </span>
                  <span className="mt-1 block text-sm text-slate-500">{f.desc}</span>
                </span>
                {f.target && (
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-300 text-lg transition group-hover:border-orange-600 group-hover:bg-orange-600 group-hover:text-white">
                    →
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div>
            <div className="font-display text-xl font-bold tracking-tight">
              My<span className="text-orange-500">Avignam</span>
            </div>
            <p className="mt-1 text-sm text-slate-400">
              Sistem Informasi Kepegawaian · Basarnas Kelas B Banyuwangi
            </p>
          </div>
          <p className="text-xs uppercase tracking-widest text-slate-500">
            Siaga · Kompeten · Bersinergi
          </p>
        </div>
      </footer>
    </div>
  )
}
