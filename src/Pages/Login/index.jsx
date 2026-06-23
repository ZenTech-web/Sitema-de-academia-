import { Dumbbell } from 'lucide-react'
import { estudantes } from '../../data/mock'
import { useAuth } from '../../context/AuthContext'

export default function Login() {
  const { login } = useAuth()

  return (
    <div className="min-h-screen bg-[#0056D2] flex flex-col items-center justify-center px-6 gap-8">
      {/* Logo */}
      <div className="flex flex-col items-center gap-3">
        <div className="w-20 h-20 rounded-3xl bg-white flex items-center justify-center shadow-xl">
          <Dumbbell size={40} className="text-[#0056D2]" />
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">PowerFit</h1>
        <p className="text-blue-200 text-sm">Selecione seu perfil para entrar</p>
      </div>

      {/* Lista de alunos */}
      <div className="w-full max-w-sm flex flex-col gap-3">
        {estudantes.map((e) => (
          <button
            key={e.id}
            onClick={() => login(e.id)}
            className="bg-white rounded-2xl px-5 py-4 flex items-center gap-4 shadow-md active:scale-[0.97] transition-transform text-left"
          >
            <div className="w-12 h-12 rounded-full bg-[#0056D2] flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-sm">{e.iniciais}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-800 truncate">{e.nome}</p>
              <p className="text-xs text-gray-400 mt-0.5">{e.objetivo}</p>
            </div>
            {parseFloat(e.faturasPendentes.replace(/[^0-9,]/g, '').replace(',', '.')) > 0 && (
              <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded-full shrink-0">
                {e.faturasPendentes}
              </span>
            )}
          </button>
        ))}
      </div>

      <p className="text-blue-300 text-xs">MVP — sem autenticação real</p>
    </div>
  )
}
