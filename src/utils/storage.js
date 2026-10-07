const KEY = 'basarnas-leaves'

export function loadLeaves() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || []
  } catch {
    return []
  }
}

export function saveLeaves(leaves) {
  localStorage.setItem(KEY, JSON.stringify(leaves))
}

// Penyimpanan generik untuk hasil input mandiri pegawai.
// key: 'basarnas-kesamaptaan' | 'basarnas-uji-periodik' | 'basarnas-ukom' | 'basarnas-sertifikasi'
const KEAHLIAN_KEY = 'basarnas-sertifikasi'
const SAMAPTA_KEY = 'basarnas-kesamaptaan'
const PERIODIK_KEY = 'basarnas-uji-periodik'
const UKOM_KEY = 'basarnas-ukom'

// Kondisi awal: pegawai yang login (Andi Pratama / PROFILES[0]) sudah punya
// 2 keahlian + 5 riwayat kesamaptaan + 5 uji periodik + 5 hasil UKOM.
// Hanya di-seed sekali saat key belum pernah diinisialisasi (getItem === null),
// sehingga kalau pengguna menghapus semua data, tidak muncul lagi otomatis.
function keahlianSeed() {
  return [
    {
      id: 'seed-keahlian-mfr',
      tanggal: '2026-08-12',
      nama: 'Andi Pratama',
      kategori: 'Keahlian Utama Rescuer (Teknis Penyelamatan)',
      keahlian: 'Medical First Responder (MFR)',
      deskripsi:
        'Memberikan pertolongan pertama pada korban cedera atau trauma di lokasi kejadian sebelum dievakuasi ke fasilitas medis.',
      penerbit: 'Basarnas',
      berlaku: '2027-08-12',
      foto: '',
    },
    {
      id: 'seed-keahlian-water',
      tanggal: '2026-09-20',
      nama: 'Andi Pratama',
      kategori: 'Keahlian Utama Rescuer (Teknis Penyelamatan)',
      keahlian: 'Water Rescue & Underwater Rescue',
      deskripsi:
        'Teknik penyelamatan di permukaan air (sungai/laut) serta kemampuan menyelam (diving) untuk mencari korban di bawah air.',
      penerbit: 'Basarnas',
      berlaku: '2027-09-20',
      foto: '',
    },
  ]
}

// 5 uji kesamaptaan terakhir — terbaru dulu (sesuai urutan addEntry).
function samaptaSeed() {
  const N = 'Andi Pratama'
  const mk = (id, tanggal, hasil) => ({ id, tanggal, nama: N, hasil, foto: '' })
  return [
    mk('seed-samapta-1', '2026-09-18', { lari: '11.2', pushup: '42', situp: '40', pullup: '12', shuttle: '11.1', renang: '5.2', trappen: '7' }),
    mk('seed-samapta-2', '2026-08-19', { lari: '11.5', pushup: '38', situp: '37', pullup: '11', shuttle: '11.4', renang: '5.4', trappen: '6' }),
    mk('seed-samapta-3', '2026-07-15', { lari: '11.8', pushup: '35', situp: '34', pullup: '10', shuttle: '11.6', renang: '5.6', trappen: '6' }),
    mk('seed-samapta-4', '2026-06-11', { lari: '12.1', pushup: '33', situp: '32', pullup: '9', shuttle: '11.9', renang: '5.8', trappen: '5' }),
    mk('seed-samapta-5', '2026-05-12', { lari: '12.4', pushup: '30', situp: '30', pullup: '8', shuttle: '12.2', renang: '6.0', trappen: '5' }),
  ]
}

// 5 uji periodik terakhir — terbaru dulu.
function periodikSeed() {
  const N = 'Andi Pratama'
  const mk = (id, tanggal, jenis, nilai) => ({ id, tanggal, nama: N, jenis, tanggalUji: tanggal, nilai, foto: '' })
  return [
    mk('seed-periodik-1', '2026-09-10', 'Uji Fisik Semester II', '88'),
    mk('seed-periodik-2', '2026-06-12', 'Uji Fisik Semester I', '84'),
    mk('seed-periodik-3', '2026-03-14', 'Uji Keterampilan Tahunan', '81'),
    mk('seed-periodik-4', '2025-12-10', 'Uji Fisik Semester II', '78'),
    mk('seed-periodik-5', '2025-09-12', 'Uji Fisik Semester I', '75'),
  ]
}

// 5 penyimpanan checklist UKOM terakhir — terbaru dulu.
function ukomSeed() {
  const N = 'Andi Pratama'
  const mk = (id, tanggal, jenjang, progress, done, total) => ({ id, tanggal, nama: N, jenjang, progress, done, total })
  return [
    mk('seed-ukom-1', '2026-09-21', 'Rescuer Terampil', 100, 12, 12),
    mk('seed-ukom-2', '2026-08-15', 'Rescuer Terampil', 83, 10, 12),
    mk('seed-ukom-3', '2026-06-20', 'Rescuer Pemula', 100, 9, 9),
    mk('seed-ukom-4', '2026-04-11', 'Rescuer Pemula', 78, 7, 9),
    mk('seed-ukom-5', '2026-02-08', 'Rescuer Pemula', 56, 5, 9),
  ]
}

const SEED_FLAG = 'basarnas-seed-v1'
let seededThisSession = false

// Menggabungkan data demo yang belum ada (berdasar id) lalu urut terbaru dulu.
// Idempoten: aman dipanggil berulang, tidak menggandakan data.
function mergeSeeds(key, seedFn) {
  let list
  try {
    list = JSON.parse(localStorage.getItem(key)) || []
  } catch {
    list = []
  }
  const ids = new Set(list.map((it) => it && it.id))
  const missing = seedFn().filter((s) => !ids.has(s.id))
  if (!missing.length) return list
  const next = [...list, ...missing].sort((a, b) =>
    String(b.tanggal || '').localeCompare(String(a.tanggal || ''))
  )
  try {
    localStorage.setItem(key, JSON.stringify(next))
  } catch {
    // abaikan jika penyimpanan gagal
  }
  return next
}

// Dijalankan sekali per sesi (dan sekali selamanya via flag): memastikan akun
// login (Andi Pratama) punya 2 keahlian + 5 riwayat tiap fitur, walau browser
// sudah pernah dibuka sebelumnya. Data input pengguna tidak dihapus.
export function ensureSeeded() {
  if (seededThisSession) return
  seededThisSession = true
  try {
    if (localStorage.getItem(SEED_FLAG)) return
    mergeSeeds(KEAHLIAN_KEY, keahlianSeed)
    mergeSeeds(SAMAPTA_KEY, samaptaSeed)
    mergeSeeds(PERIODIK_KEY, periodikSeed)
    mergeSeeds(UKOM_KEY, ukomSeed)
    localStorage.setItem(SEED_FLAG, '1')
  } catch {
    // abaikan jika penyimpanan gagal
  }
}

export function loadList(key) {
  try {
    ensureSeeded()
    return JSON.parse(localStorage.getItem(key)) || []
  } catch {
    return []
  }
}

export function addEntry(key, entry) {
  const list = loadList(key)
  const next = [{ id: Date.now(), tanggal: new Date().toISOString().slice(0, 10), ...entry }, ...list]
  try {
    localStorage.setItem(key, JSON.stringify(next))
  } catch {
    // localStorage penuh (mis. foto besar) — simpan tanpa foto
    const { foto, ...rest } = next[0]
    void foto
    localStorage.setItem(key, JSON.stringify([rest, ...list]))
  }
  return next
}

export function removeEntry(key, id) {
  const next = loadList(key).filter((it) => it.id !== id)
  try {
    localStorage.setItem(key, JSON.stringify(next))
  } catch {
    // abaikan jika penyimpanan gagal
  }
  return next
}

export const KEYS = {
  kesamaptaan: 'basarnas-kesamaptaan',
  ujiPeriodik: 'basarnas-uji-periodik',
  ukom: 'basarnas-ukom',
  keahlian: 'basarnas-sertifikasi',
  // alias lama — tetap dibaca agar data sebelumnya tidak hilang
  sertifikasi: 'basarnas-sertifikasi',
}
