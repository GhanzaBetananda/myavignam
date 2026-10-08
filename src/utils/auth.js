export const LOGIN_EMAIL = 'ghanzabeta212@gmail.com'
export const LOGIN_PASSWORD = 'avignam700135'

const AUTH_KEY = 'myavignam_auth'

export function isLoggedIn() {
  try {
    return localStorage.getItem(AUTH_KEY) === '1'
  } catch {
    return false
  }
}

export function getAuthEmail() {
  try {
    return localStorage.getItem('myavignam_auth_email') || ''
  } catch {
    return ''
  }
}

export function tryLogin(email, password) {
  const ok =
    String(email || '').trim().toLowerCase() === LOGIN_EMAIL.toLowerCase() &&
    String(password || '') === LOGIN_PASSWORD
  if (ok) {
    try {
      localStorage.setItem(AUTH_KEY, '1')
      localStorage.setItem('myavignam_auth_email', String(email).trim())
      localStorage.setItem('myavignam_auth_at', new Date().toISOString())
    } catch {
      // abaikan bila storage tidak tersedia
    }
    return { ok: true }
  }
  return { ok: false, message: 'Email atau kata sandi salah.' }
}

export function logout() {
  try {
    localStorage.removeItem(AUTH_KEY)
    localStorage.removeItem('myavignam_auth_email')
    localStorage.removeItem('myavignam_auth_at')
  } catch {
    // abaikan
  }
}
