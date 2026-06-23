import { useNavigate } from 'react-router-dom'
import { Dumbbell, ChevronRight, LogOut } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { formatCurrency } from '../../services/api'

export default function Home() {
  const { estudante, treinos, logout } = useAuth()
  const navigate = useNavigate()

  const progresso = estudante.sessoesTotal > 0
    ? Math.min(100, (estudante.sessoesRealizadas / estudante.sessoesTotal) * 100)
    : 0

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
              <span className="font-semibold text-white">
                {formatCurrency(estudante.faturasPendentes)}
              </span>
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

        {/* Lista de treinos */}
        {treinos.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm px-4 py-8 flex flex-col items-center gap-2">
            <Dumbbell size={36} className="text-gray-200" />
            <p className="text-sm text-gray-400 font-medium">Nenhum treino cadastrado</p>
            <p className="text-xs text-gray-300 text-center">Fale com seu professor para montar seu treino</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-medium px-1">
              Escolha seu treino
            </p>
            {treinos.map((treino) => {
              const isProximo = treino.id === (estudante.proximoTreinoId ?? treinos[0]?.id)
              const grupos = [...new Set(treino.exercicios.map((te) => te.exercicio?.grupo).filter(Boolean))]
              return (
                <button
                  key={treino.id}
                  onClick={() => navigate(`/treino/${treino.id}`)}
                  className="bg-white rounded-2xl shadow-sm px-4 py-4 flex items-center justify-between w-full text-left active:scale-[0.98] transition-transform"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isProximo ? 'bg-[#0056D2]' : 'bg-blue-50'}`}>
                      <Dumbbell size={20} className={isProximo ? 'text-white' : 'text-[#0056D2]'} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-base font-bold text-gray-800">{treino.nome}</p>
                        {isProximo && (
                          <span className="text-[10px] font-bold text-white bg-[#0056D2] rounded-full px-2 py-0.5">
                            PRÓXIMO
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400">
                        {grupos.join(' / ')} · {treino.exercicios.length} exercício(s)
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-gray-300 shrink-0" />
                </button>
              )
            })}
          </div>
        )}

      </div>
    </div>
  )
}

