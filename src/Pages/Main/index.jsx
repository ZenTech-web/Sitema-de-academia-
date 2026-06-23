import { useNavigate } from 'react-router-dom'
import { Dumbbell, ChevronRight, LogOut } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getTreinoById } from '../../data/mock'

export default function Home() {
  const { estudante, logout } = useAuth()
  const navigate = useNavigate()

  const progresso = (estudante.sessoesRealizadas / estudante.sessoesTotal) * 100
  const proximoTreino = getTreinoById(estudante, estudante.proximoTreinoId)

  return (
    <div className="flex flex-col min-h-full">
      {/* Header azul */}
      <header className="bg-[#0056D2] text-white px-4 pt-5 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center shrink-0">
            <span className="text-sm font-bold">{estudante.iniciais}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-blue-200 leading-tight">Bem-vindo(a)</p>
            <p className="font-semibold text-sm leading-snug truncate">{estudante.nome}</p>
            <p className="text-xs text-blue-100 mt-0.5">
              Faturas pendentes{' '}
              <span className="font-semibold text-white">{estudante.faturasPendentes}</span>
            </p>
          </div>
          <button onClick={logout} className="p-2 rounded-full bg-white/10 active:bg-white/20">
            <LogOut size={16} className="text-white" />
          </button>
        </div>
      </header>

      <div className="flex flex-col gap-3 p-4 -mt-3">

        {/* Card PowerFit */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-4">
            <div className="w-10 h-10 rounded-xl bg-[#0056D2] flex items-center justify-center shrink-0">
              <Dumbbell size={20} className="text-white" />
            </div>
            <span className="text-2xl font-extrabold text-[#0056D2] tracking-tight">PowerFit</span>
          </div>
          <div className="bg-[#0056D2] px-4 py-2.5">
            <p className="text-white text-sm font-medium">
              Seja bem-vindo, {estudante.nome.split(' ')[0]}!
            </p>
          </div>
        </div>

        {/* Card Sessões */}
        <div className="bg-white rounded-2xl shadow-sm px-4 py-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">
            Sessões realizadas
          </p>
          <p className="text-3xl font-extrabold text-gray-800 leading-tight">
            {estudante.sessoesRealizadas}
            <span className="text-base font-semibold text-gray-400">/{estudante.sessoesTotal}</span>
          </p>
          <div className="mt-3 h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#0056D2] rounded-full transition-all"
              style={{ width: `${progresso}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1.5 text-right">
            {progresso.toFixed(0)}% concluído
          </p>
        </div>

        {/* Card Próximo treino */}
        {proximoTreino && (
          <button
            onClick={() => navigate(`/treino/${proximoTreino.id}`)}
            className="bg-white rounded-2xl shadow-sm px-4 py-4 flex items-center justify-between w-full text-left active:scale-[0.98] transition-transform"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <Dumbbell size={20} className="text-[#0056D2]" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">A seguir</p>
                <p className="text-base font-bold text-gray-800">
                  Próximo treino:{' '}
                  <span className="text-[#0056D2]">{proximoTreino.nome}</span>
                </p>
              </div>
            </div>
            <ChevronRight size={20} className="text-gray-300" />
          </button>
        )}

      </div>
    </div>
  )
}
