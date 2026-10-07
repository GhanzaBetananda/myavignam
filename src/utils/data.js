// Struktur data anggota: { id, nama, divisi }
// ID unik, nama lengkap, divisi asal. Mudah diganti ke fetch API / database nantinya.

export const DIVISIONS = [
  {
    id: 'operasi',
    name: 'Operasi SAR',
    description: 'Tim penyelamatan & operasi lapangan',
    icon: '🚁',
    color: 'from-orange-500 to-red-500',
  },
  {
    id: 'siaga',
    name: 'Kesiapsiagaan',
    description: 'Siaga darurat & pemantauan 24/7',
    icon: '📡',
    color: 'from-blue-600 to-indigo-600',
  },
  {
    id: 'komdat',
    name: 'Komunikasi & Data',
    description: 'Komunikasi, IT & pengolahan data',
    icon: '💬',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'medlog',
    name: 'Medik & Logistik',
    description: 'Layanan medis & dukungan logistik',
    icon: '⛑️',
    color: 'from-violet-500 to-purple-600',
  },
  {
    id: 'admin',
    name: 'Administrasi & Umum',
    description: 'Tata usaha, keuangan & kepegawaian',
    icon: '📋',
    color: 'from-slate-600 to-slate-800',
  },
]

export const MEMBERS = [
  // Operasi SAR
  { id: 'BSN-001', nama: 'Andi Pratama', divisi: 'Operasi SAR' },
  { id: 'BSN-002', nama: 'Budi Santoso', divisi: 'Operasi SAR' },
  { id: 'BSN-003', nama: 'Dedi Kurniawan', divisi: 'Operasi SAR' },
  { id: 'BSN-004', nama: 'Eko Wahyudi', divisi: 'Operasi SAR' },
  { id: 'BSN-005', nama: 'Fajar Nugroho', divisi: 'Operasi SAR' },
  { id: 'BSN-006', nama: 'Gilang Ramadhan', divisi: 'Operasi SAR' },
  { id: 'BSN-007', nama: 'Hendra Gunawan', divisi: 'Operasi SAR' },
  { id: 'BSN-008', nama: 'Irwan Setiawan', divisi: 'Operasi SAR' },
  { id: 'BSN-009', nama: 'Joko Susilo', divisi: 'Operasi SAR' },

  // Kesiapsiagaan
  { id: 'BSN-010', nama: 'Kartika Sari', divisi: 'Kesiapsiagaan' },
  { id: 'BSN-011', nama: 'Lukman Hakim', divisi: 'Kesiapsiagaan' },
  { id: 'BSN-012', nama: 'Maya Putri', divisi: 'Kesiapsiagaan' },
  { id: 'BSN-013', nama: 'Nanda Firmansyah', divisi: 'Kesiapsiagaan' },
  { id: 'BSN-014', nama: 'Opik Hidayat', divisi: 'Kesiapsiagaan' },
  { id: 'BSN-015', nama: 'Putra Mahardika', divisi: 'Kesiapsiagaan' },
  { id: 'BSN-016', nama: 'Rian Saputra', divisi: 'Kesiapsiagaan' },
  { id: 'BSN-017', nama: 'Sinta Dewi', divisi: 'Kesiapsiagaan' },

  // Komunikasi & Data
  { id: 'BSN-018', nama: 'Taufik Hidayah', divisi: 'Komunikasi & Data' },
  { id: 'BSN-019', nama: 'Udin Saefudin', divisi: 'Komunikasi & Data' },
  { id: 'BSN-020', nama: 'Vina Marlina', divisi: 'Komunikasi & Data' },
  { id: 'BSN-021', nama: 'Wahyu Firmansyah', divisi: 'Komunikasi & Data' },
  { id: 'BSN-022', nama: 'Yoga Permana', divisi: 'Komunikasi & Data' },
  { id: 'BSN-023', nama: 'Zahra Amelia', divisi: 'Komunikasi & Data' },
  { id: 'BSN-024', nama: 'Ahmad Fauzi', divisi: 'Komunikasi & Data' },
  { id: 'BSN-025', nama: 'Bayu Aditya', divisi: 'Komunikasi & Data' },

  // Medik & Logistik
  { id: 'BSN-026', nama: 'Citra Lestari', divisi: 'Medik & Logistik' },
  { id: 'BSN-027', nama: 'Dian Puspita', divisi: 'Medik & Logistik' },
  { id: 'BSN-028', nama: 'Eriska Wulandari', divisi: 'Medik & Logistik' },
  { id: 'BSN-029', nama: 'Farhan Aziz', divisi: 'Medik & Logistik' },
  { id: 'BSN-030', nama: 'Galih Prakoso', divisi: 'Medik & Logistik' },
  { id: 'BSN-031', nama: 'Hesti Puspitasari', divisi: 'Medik & Logistik' },
  { id: 'BSN-032', nama: 'Irfan Maulana', divisi: 'Medik & Logistik' },
  { id: 'BSN-033', nama: 'Julia Rahmawati', divisi: 'Medik & Logistik' },

  // Administrasi & Umum
  { id: 'BSN-034', nama: 'Kurniawan Saputra', divisi: 'Administrasi & Umum' },
  { id: 'BSN-035', nama: 'Larasati Indah', divisi: 'Administrasi & Umum' },
  { id: 'BSN-036', nama: 'Muhammad Ridwan', divisi: 'Administrasi & Umum' },
  { id: 'BSN-037', nama: 'Nurul Hidayah', divisi: 'Administrasi & Umum' },
  { id: 'BSN-038', nama: 'Oktavia Sinaga', divisi: 'Administrasi & Umum' },
  { id: 'BSN-039', nama: 'Pramudya Ananta', divisi: 'Administrasi & Umum' },
  { id: 'BSN-040', nama: 'Ratna Suminar', divisi: 'Administrasi & Umum' },
  { id: 'BSN-041', nama: 'Surya Atmaja', divisi: 'Administrasi & Umum' },
  { id: 'BSN-042', nama: 'Tania Kusuma', divisi: 'Administrasi & Umum' },
]

export const MAX_CUTI_PER_DATE = 2
export const MAX_RANGE_DAYS = 3

export function getMembersByDivision(divisionName) {
  return MEMBERS.filter((m) => m.divisi === divisionName)
}

export function getMemberById(id) {
  return MEMBERS.find((m) => m.id === id)
}
