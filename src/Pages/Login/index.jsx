import { useState } from 'react'
import { Dumbbell, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const [email, setEmail]           = useState('')
  const [senha, setSenha]           = useState('')
  const [mostrarSenha, setMostrar]  = useState(false)
  const [loading, setLoading]       = useState(false)
  const [erro, setErro]             = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setErro(null)
    try {
      await login(email, senha)
    } catch (err) {
      setErro(err.message || 'E-mail ou senha incorretos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0056D2] flex flex-col items-center justify-center px-6 gap-8">
      {/* Logo */}
      <div className="flex flex-col items-center gap-3">
        <div className="w-20 h-20 rounded-3xl bg-white flex items-center justify-center shadow-xl">
          <Dumbbell size={40} className="text-[#0056D2]" />
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Imperious Fitness</h1>
        <p className="text-blue-200 text-sm">Entre com sua conta</p>
      </div>

      {/* Formulário */}
      <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-3">
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          className="bg-white rounded-2xl px-4 py-3.5 text-gray-800 placeholder-gray-400 outline-none text-sm w-full"
        />

        <div className="relative">
          <input
            type={mostrarSenha ? 'text' : 'password'}
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            autoComplete="current-password"
            className="bg-white rounded-2xl px-4 py-3.5 text-gray-800 placeholder-gray-400 outline-none text-sm w-full pr-12"
          />
          <button
            type="button"
            onClick={() => setMostrar((v) => !v)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
          >
            {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {erro && (
          <p className="text-red-200 text-xs text-center bg-red-500/20 rounded-xl px-3 py-2">
            {erro}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-white text-[#0056D2] font-bold rounded-2xl py-3.5 text-sm mt-1 active:scale-[0.98] transition-transform disabled:opacity-60"
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}
