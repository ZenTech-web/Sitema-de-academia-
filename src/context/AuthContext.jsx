import { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../services/api'

const AuthContext = createContext(null)

const TOKEN_KEY = 'imperious_token'

export function AuthProvider({ children }) {
  const [estudante, setEstudante] = useState(null)
  const [treinos, setTreinos]     = useState([])
  const [loading, setLoading]     = useState(true)

  // Restaura sessão salva no localStorage
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) { setLoading(false); return }

    Promise.all([api.getMe(), api.getMeusTreinos()])
      .then(([me, meusTreinos]) => {
        setEstudante(me)
        setTreinos(meusTreinos)
      })
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setLoading(false))
  }, [])

  async function login(email, senha) {
    const { token } = await api.login(email, senha)
    localStorage.setItem(TOKEN_KEY, token)
    const [me, meusTreinos] = await Promise.all([api.getMe(), api.getMeusTreinos()])
    setEstudante(me)
    setTreinos(meusTreinos)
  }

  async function refreshMe() {
    const [me, meusTreinos] = await Promise.all([api.getMe(), api.getMeusTreinos()])
    setEstudante(me)
    setTreinos(meusTreinos)
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY)
    setEstudante(null)
    setTreinos([])
  }

  return (
    <AuthContext.Provider value={{ estudante, treinos, login, logout, loading, refreshMe }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
