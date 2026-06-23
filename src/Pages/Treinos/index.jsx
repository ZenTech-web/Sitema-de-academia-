import { useNavigate } from 'react-router-dom'
import { ChevronRight, Trophy } from 'lucide-react'
import Header from '../../Components/Header'
import { useAuth } from '../../context/AuthContext'
import { getTreinoById } from '../../data/mock'

export default function Treinos() {
  const { estudante } = useAuth()
  const navigate = useNavigate()
  const ultimoTreino = getTreinoById(estudante, estudante.ultimoTreinoId)

  return (
    <div className="flex flex-col min-h-full">
      <Header
        title="Treinos"
        right={
          <button className="text-xs font-semibold text-white/80 underline underline-offset-2">
            Histórico
          </button>
        }
      />

      <div className="flex flex-col gap-3 p-4">

        {/* Meta e data */}
        <div className="bg-white rounded-2xl shadow-sm px-4 py-3 flex justify-between items-center">
          <div className="text-xs text-gray-500">
            <span className="font-medium text-gray-700">Objetivo:</span> {estudante.objetivo}
          </div>
          <div className="text-xs text-gray-500">
            <span className="font-medium text-gray-700">Início:</span> {estudante.dataInicio}
          </div>
        </div>

        {/* Cards de treino */}
        {estudante.treinos.map((treino) => (
          <button
            key={treino.id}
            onClick={() => navigate(`/treino/${treino.id}`)}
            className="bg-white rounded-2xl shadow-sm px-4 py-4 flex items-center gap-4 w-full text-left active:scale-[0.98] transition-transform"
          >
            <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
              <span className="text-xl font-extrabold text-[#0056D2] leading-none text-center px-1">
                {treino.sigla ?? treino.nome.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium mb-0.5">
                Grupos musculares
              </p>
              <p className="text-sm font-semibold text-gray-800 leading-snug">
                {treino.musculos.join(' / ')}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {treino.exercicios.length} exercícios
              </p>
            </div>
            <ChevronRight size={18} className="text-gray-300 shrink-0" />
          </button>
        ))}

        {/* Último treino */}
        {ultimoTreino && (
          <div className="bg-white rounded-2xl shadow-sm px-4 py-4 flex items-center gap-3">
            <Trophy size={22} className="text-[#0056D2] shrink-0" />
            <p className="text-sm text-gray-700">
              Último treino registrado no app:{' '}
              <span className="font-extrabold text-[#0056D2]">{ultimoTreino.nome}</span>
            </p>
          </div>
        )}

      </div>
    </div>
  )
}
