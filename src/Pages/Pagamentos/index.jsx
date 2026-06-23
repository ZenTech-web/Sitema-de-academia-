import { useState, useEffect } from 'react'
import { CreditCard } from 'lucide-react'
import Header from '../../Components/Header'
import { api, formatCurrency, formatDate } from '../../services/api'

const STATUS_LABEL = {
  PENDENTE: { label: 'Pendente', color: 'text-yellow-600 bg-yellow-50' },
  PAGO:     { label: 'Pago',     color: 'text-green-600 bg-green-50' },
  ATRASADO: { label: 'Atrasado', color: 'text-red-600 bg-red-50' },
}

export default function Pagamentos() {
  const [pagamentos, setPagamentos] = useState([])
  const [loading, setLoading]       = useState(true)

  useEffect(() => {
    api.getMeusPagamentos()
      .then(setPagamentos)
      .finally(() => setLoading(false))
  }, [])

  const totalPendente = pagamentos
    .filter((p) => p.status !== 'PAGO')
    .reduce((sum, p) => sum + p.valor, 0)

  return (
    <div className="flex flex-col min-h-full">
      <Header title="Pagamentos" />

      <div className="flex flex-col gap-3 p-4">

        {/* Resumo */}
        <div className={`rounded-2xl px-4 py-4 flex items-center gap-3 ${totalPendente > 0 ? 'bg-red-50' : 'bg-green-50'}`}>
          <CreditCard size={22} className={totalPendente > 0 ? 'text-red-500' : 'text-green-500'} />
          <div>
            <p className="text-xs font-medium text-gray-500">Total pendente</p>
            <p className={`text-lg font-extrabold ${totalPendente > 0 ? 'text-red-500' : 'text-green-600'}`}>
              {formatCurrency(totalPendente)}
            </p>
          </div>
        </div>

        {/* Lista */}
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 border-2 border-[#0056D2]/30 border-t-[#0056D2] rounded-full animate-spin" />
          </div>
        ) : pagamentos.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm px-4 py-8 flex flex-col items-center gap-2">
            <CreditCard size={32} className="text-gray-300" />
            <p className="text-sm text-gray-400">Nenhum pagamento encontrado</p>
          </div>
        ) : (
          pagamentos.map((p) => {
            const status = STATUS_LABEL[p.status] ?? STATUS_LABEL.PENDENTE
            return (
              <div key={p.id} className="bg-white rounded-2xl shadow-sm px-4 py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-800">{p.descricao ?? 'Mensalidade'}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Venc: {formatDate(p.vencimento)}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <p className="text-base font-extrabold text-gray-800">{formatCurrency(p.valor)}</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${status.color}`}>
                    {status.label}
                  </span>
                </div>
              </div>
            )
          })
        )}

      </div>
    </div>
  )
}
