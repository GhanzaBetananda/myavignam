// Katalog baku keahlian personel Basarnas.
// Dipakai halaman Keahlian sebagai referensi + opsi tambah keahlian.

export const KEAHLIAN_GROUPS = [
  {
    id: 'utama-rescuer',
    nama: 'Keahlian Utama Rescuer (Teknis Penyelamatan)',
    desc: 'Kompetensi dasar hingga lanjutan untuk evakuasi di berbagai medan ekstrim.',
    items: [
      {
        nama: 'Medical First Responder (MFR)',
        desc: 'Memberikan pertolongan pertama pada korban cedera atau trauma di lokasi kejadian sebelum dievakuasi ke fasilitas medis.',
      },
      {
        nama: 'Water Rescue & Underwater Rescue',
        desc: 'Teknik penyelamatan di permukaan air (sungai/laut) serta kemampuan menyelam (diving) untuk mencari korban di bawah air.',
      },
      {
        nama: 'Jungle Rescue (Gunung Hutan)',
        desc: 'Navigasi darat menggunakan peta dan kompas, teknik survival (bertahan hidup), serta pelacakan jejak di area hutan dan pegunungan.',
      },
      {
        nama: 'High Angle Rescue Technique (HART)',
        desc: 'Penyelamatan di ketinggian menggunakan tali-temali (rope rescue), seperti evakuasi korban di tebing, gedung bertingkat, maupun jurang.',
      },
      {
        nama: 'Collapsed Structure Search and Rescue (CSSR)',
        desc: 'Mencari dan menyelamatkan korban yang terjebak di reruntuhan bangunan akibat gempa bumi atau bencana serupa.',
      },
      {
        nama: 'Confined Space Rescue',
        desc: 'Evakuasi khusus di ruang terbatas dengan akses sempit dan minim oksigen, seperti sumur, gorong-gorong, atau tangki industri.',
      },
      {
        nama: 'Aviation / Heli Rescue',
        desc: 'Evakuasi korban menggunakan helikopter, termasuk teknik rappelling dan hoisting dari udara.',
      },
    ],
  },
  {
    id: 'operasional-angkutan',
    nama: 'Keahlian Operasional Angkutan (Laut & Udara)',
    desc: 'Operator armada khusus dengan sertifikasi profesional tinggi.',
    items: [
      {
        nama: 'Keahlian Penerbangan',
        desc: 'Pilot dan teknisi helikopter/pesawat SAR yang terlatih bermanuver di cuaca buruk untuk memantau koordinat atau mengevakuasi korban.',
      },
      {
        nama: 'Keahlian Nautika & Permesinan Kapal',
        desc: 'Nahkoda, Mualim, Markonis (operator radio kapal), dan Kepala Kamar Mesin untuk mengoperasikan Rescue Boat (Kapal SAR) dalam misi pencarian jarak jauh di lautan.',
      },
    ],
  },
  {
    id: 'manajerial-operasi',
    nama: 'Keahlian Manajerial & Perencanaan Operasi',
    desc: 'Koordinasi matang di posko agar misi penyelamatan berjalan.',
    items: [
      {
        nama: 'Search Mission Coordinator (SMC)',
        desc: 'Memimpin, merancang strategi, menetapkan plot area pencarian, dan mengoordinasikan seluruh unsur SAR di wilayah operasi.',
      },
      {
        nama: 'SAR Planner (Perencana Operasi)',
        desc: 'Menganalisis data cuaca, arus laut, arah angin, dan pemetaan geografis untuk memprediksi pergerakan objek atau korban yang hilang.',
      },
    ],
  },
  {
    id: 'pendukung',
    nama: 'Keahlian Pendukung (Logistik & Komunikasi)',
    desc: 'Penopang operasi dari sisi komunikasi dan logistik.',
    items: [
      {
        nama: 'Operator & Teknisi Radio Komunikasi',
        desc: 'Menjaga jalur komunikasi lapangan tetap terhubung antara tim rescue, posko pusat, kapal, hingga helikopter tanpa hambatan.',
      },
      {
        nama: 'Logistik Operasi',
        desc: 'Mengelola ketersediaan tenda darurat, dapur umum, armada darat (Rescue Truck/Rescue Car), hingga pasokan BBM untuk alat-alat evakuasi.',
      },
    ],
  },
]

export const KEAHLIAN_FLAT = KEAHLIAN_GROUPS.flatMap((g) =>
  g.items.map((it) => ({ ...it, kategori: g.nama, kategoriId: g.id }))
)

export function getKeahlianByName(nama) {
  return KEAHLIAN_FLAT.find((k) => k.nama === nama)
}

export function getKategoriOfKeahlian(nama) {
  return getKeahlianByName(nama)?.kategori || ''
}
