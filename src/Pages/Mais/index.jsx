import { LogOut, User, Mail, Target, Calendar, Dumbbell } from 'lucide-react'
import Header from '../../Components/Header'
import { useAuth } from '../../context/AuthContext'
import { formatDate } from '../../services/api'

export default function Mais() {
  const { estudante, treinos, logout } = useAuth()

  return (
    <div className="flex flex-col min-h-full">
      <Header title="Mais" />

      <div className="flex flex-col gap-4 p-4 pb-24">

        {/* Avatar + nome */}
        <div className="bg-white rounded-2xl shadow-sm px-4 py-5 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#0056D2] flex items-center justify-center shrink-0">
            <span className="text-xl font-extrabold text-white">{estudante.iniciais}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-bold text-gray-800 truncate">{estudante.nome}</p>
            <p className="text-xs text-gray-400 truncate">{estudante.email}</p>
          </div>
        </div>

        {/* Informações */}
        <div className="bg-white rounded-2xl shadow-sm px-4 py-4 flex flex-col gap-3">
          <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Informações</p>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
              <Mail size={15} className="text-[#0056D2]" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wide">E-mail</p>
              <p className="text-sm text-gray-700">{estudante.email}</p>
            </div>
          </div>

          {estudante.objetivo && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <Target size={15} className="text-[#0056D2]" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wide">Objetivo</p>
                <p className="text-sm text-gray-700">{estudante.objetivo}</p>
              </div>
            </div>
          )}

          {estudante.dataInicio && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <Calendar size={15} className="text-[#0056D2]" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wide">Aluno desde</p>
                <p className="text-sm text-gray-700">{formatDate(estudante.dataInicio)}</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
              <Dumbbell size={15} className="text-[#0056D2]" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wide">Treinos cadastrados</p>
              <p className="text-sm text-gray-700">{treinos.length} treino(s)</p>
            </div>
          </div>
        </div>

        {/* Sessões */}
        <div className="bg-white rounded-2xl shadow-sm px-4 py-4">
          <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-3">Progresso do plano</p>
          <div className="flex justify-between items-end mb-2">
            <p className="text-3xl font-extrabold text-[#0056D2]">
              {estudante.sessoesRealizadas}
              <span className="text-base font-semibold text-gray-400">/{estudante.sessoesTotal}</span>
            </p>
            <p className="text-xs text-gray-400">sessões realizadas</p>
          </div>
          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#0056D2] rounded-full"
              style={{
                width: `${estudante.sessoesTotal > 0 ? Math.min(100, (estudante.sessoesRealizadas / estudante.sessoesTotal) * 100) : 0}%`,
              }}
            />
          </div>
        </div>

        {/* Sair */}
        <button
          onClick={logout}
          className="flex items-center justify-center gap-2 bg-red-50 text-red-500 font-bold rounded-2xl py-4 text-sm active:scale-[0.98] transition-transform"
        >
          <LogOut size={16} />
          Sair da conta
        </button>

      </div>
    </div>
  )
}
