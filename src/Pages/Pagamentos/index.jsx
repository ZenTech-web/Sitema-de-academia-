import Header from '../../Components/Header'
import { useAuth } from '../../context/AuthContext'
import { CreditCard } from 'lucide-react'

export default function Pagamentos() {
  const { estudante } = useAuth()
  const temPendente = estudante.faturasPendentes !== 'R$ 0,00'

  return (
    <div className="flex flex-col min-h-full">
      <Header title="Pagamentos" />
      <div className="flex flex-col gap-3 p-4">
        <div className={`rounded-2xl px-4 py-4 flex items-center gap-3 ${temPendente ? 'bg-red-50' : 'bg-green-50'}`}>
          <CreditCard size={22} className={temPendente ? 'text-red-500' : 'text-green-500'} />
          <div>
            <p className="text-xs font-medium text-gray-500">Faturas pendentes</p>
            <p className={`text-lg font-extrabold ${temPendente ? 'text-red-500' : 'text-green-600'}`}>
              {estudante.faturasPendentes}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm px-4 py-8 flex flex-col items-center text-center gap-2">
          <CreditCard size={32} className="text-gray-300" />
          <p className="text-sm text-gray-400">Histórico de pagamentos disponível em breve</p>
        </div>
      </div>
    </div>
  )
}
