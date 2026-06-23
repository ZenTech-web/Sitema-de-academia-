import { createContext, useContext, useState, useEffect } from 'react'
import { getEstudanteById } from '../data/mock'

const AuthContext = createContext(null)

const STORAGE_KEY = 'powerfit_uid'

export function AuthProvider({ children }) {
  const [estudante, setEstudante] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) setEstudante(getEstudanteById(saved))
    setLoading(false)
  }, [])

  function login(id) {
    const e = getEstudanteById(id)
    if (!e) return
    localStorage.setItem(STORAGE_KEY, id)
    setEstudante(e)
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY)
    setEstudante(null)
  }

  return (
    <AuthContext.Provider value={{ estudante, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
