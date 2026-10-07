import { DIVISIONS, MEMBERS } from './data'

const PANGKAT = [
  'Pengatur Muda / II-a',
  'Pengatur Muda Tk.I / II-b',
  'Pengatur / II-c',
  'Pengatur Tk.I / II-d',
  'Penata Muda / III-a',
  'Penata Muda Tk.I / III-b',
  'Penata / III-c',
  'Penata Tk.I / III-d',
]

const JABATAN = {
  'Operasi SAR': ['Rescuer Pelaksana', 'Rescuer Pelaksana Lanjutan', 'Rescuer Penyelia Pratama'],
  'Kesiapsiagaan': ['Petugas Siaga', 'Koordinator Regu Siaga', 'Kepala Regu Siaga'],
  'Komunikasi & Data': ['Pranata Komputer Pelaksana', 'Analis Data', 'Koordinator Komunikasi'],
  'Medik & Logistik': ['Perawat Pelaksana', 'Koordinator Logistik', 'Kepala Seksi Medik'],
  'Administrasi & Umum': ['Pengadministrasi Umum', 'Analis Kepegawaian', 'Kasubbag Umum'],
}

const KOTA = ['Banyuwangi', 'Jember', 'Surabaya', 'Malang', 'Denpasar', 'Mataram', 'Semarang', 'Yogyakarta']

function nip(i) {
  const tahun = 1978 + ((i * 7) % 20)
  const bulan = String(1 + (i % 12)).padStart(2, '0')
  const tgl = String(1 + (i % 28)).padStart(2, '0')
  const seri = String(1000 + ((i * 37) % 9000))
  return `${tahun}${bulan}${tgl} ${(i % 2) + 1} ${seri}`
}

export const PROFILES = MEMBERS.slice(0, 30).map((m, i) => {
  const daftar = JABATAN[m.divisi] || ['Staf Pelaksana']
  const jabatan = daftar[i % daftar.length]
  const junior = daftar[0]
  const tahun = 2 + ((i * 5) % 20)
  const bulan = (i * 7) % 12
  const divisiLain = DIVISIONS[(DIVISIONS.findIndex((d) => d.name === m.divisi) + 1) % DIVISIONS.length].name
  const mulai = 2026 - tahun

  return {
    ...m,
    nip: nip(i),
    ttl: `${KOTA[i % KOTA.length]}, ${1 + (i % 28)}-${1 + (i % 12)}-${1978 + ((i * 7) % 20)}`,
    jabatan,
    pangkat: PANGKAT[i % PANGKAT.length],
    divisi: m.divisi,
    masaKerja: `${tahun} tahun ${bulan} bulan`,
    riwayat: [
      { periode: `${mulai - 4} — ${mulai}`, jabatan: junior, unit: divisiLain },
      { periode: `${mulai} — Sekarang`, jabatan, unit: m.divisi },
    ],
  }
})
