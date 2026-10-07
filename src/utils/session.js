import { PROFILES } from './profil'

// Satu-satunya sumber "akun yang sedang login" di sisi pegawai.
// Disamakan dengan AkunPage (role pegawai -> PROFILES[0]) agar konsisten
// di semua fitur: Kesamaptaan, Uji Periodik, UKOM, Keahlian, dan Cuti.
export function getLoginProfile() {
  return PROFILES[0]
}
