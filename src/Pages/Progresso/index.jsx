import { useState, useEffect } from 'react'
import { Flame, Trophy, TrendingUp, Dumbbell, Ruler } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend,
} from 'recharts'
import Header from '../../Components/Header'
import { api, formatDate } from '../../services/api'

const CORES = ['#0056D2', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe']

function Spinner() {
  return (
    <div className="flex justify-center py-12">
      <div className="w-6 h-6 border-2 border-[#0056D2]/30 border-t-[#0056D2] rounded-full animate-spin" />
    </div>
  )
}

function CardStat({ icon: Icon, label, valor, cor = 'text-[#0056D2]' }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm px-4 py-4 flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
        <Icon size={20} className={cor} />
      </div>
      <div>
        <p className="text-xs text-gray-400 font-medium">{label}</p>
        <p className="text-xl font-extrabold text-gray-800">{valor}</p>
      </div>
    </div>
  )
}

function SecaoTitulo({ children }) {
  return (
    <p className="text-xs text-gray-500 uppercase tracking-wider font-bold px-1 mt-1">
      {children}
    </p>
  )
}

export default function Progresso() {
  const [stats, setStats]       = useState(null)
  const [avaliacoes, setAval]   = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    Promise.all([api.getStats(), api.getMinhasAvaliacoes()])
      .then(([s, a]) => { setStats(s); setAval(a) })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex flex-col min-h-full">
      <Header title="Progresso" />
      <Spinner />
    </div>
  )

  const ultimaAval   = avaliacoes[0] ?? null
  const anteriorAval = avaliacoes[1] ?? null

  return (
    <div className="flex flex-col min-h-full">
      <Header title="Progresso" />

      <div className="flex flex-col gap-4 p-4 pb-24">

        {/* Cards de resumo */}
        <div className="grid grid-cols-2 gap-3">
          <CardStat icon={Trophy}    label="Sessões (90 dias)" valor={stats?.totalSessoes ?? 0} />
          <CardStat icon={Flame}     label="Streak atual"      valor={`${stats?.streak ?? 0} dias`} cor="text-orange-500" />
        </div>

        {/* Gráfico — Frequência semanal */}
        {stats?.frequenciaSemanal?.length > 0 && (
          <>
            <SecaoTitulo>Treinos por semana</SecaoTitulo>
            <div className="bg-white rounded-2xl shadow-sm px-3 pt-4 pb-2">
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={stats.frequenciaSemanal.slice(-12)} margin={{ top: 0, right: 8, left: -20, bottom: 0 }}>
                  <XAxis dataKey="semana" tick={{ fontSize: 9 }} tickLine={false} axisLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 9 }} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ fontSize: 11, borderRadius: 8, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                    formatter={(v) => [`${v} treino(s)`, '']}
                  />
                  <Bar dataKey="total" fill="#0056D2" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {/* Gráfico — Duração das sessões */}
        {stats?.duracoes?.length > 0 && (
          <>
            <SecaoTitulo>Duração das sessões (min)</SecaoTitulo>
            <div className="bg-white rounded-2xl shadow-sm px-3 pt-4 pb-2">
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={stats.duracoes} margin={{ top: 0, right: 8, left: -20, bottom: 0 }}>
                  <XAxis dataKey="data" tick={{ fontSize: 9 }} tickLine={false} axisLine={false}
                    tickFormatter={(v) => v.slice(5)} />
                  <YAxis tick={{ fontSize: 9 }} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ fontSize: 11, borderRadius: 8, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                    formatter={(v) => [`${v} min`, 'Duração']}
                  />
                  <Line type="monotone" dataKey="minutos" stroke="#0056D2" strokeWidth={2} dot={{ r: 3, fill: '#0056D2' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {/* Gráfico — Distribuição muscular */}
        {stats?.distribuicaoMuscular?.length > 0 && (
          <>
            <SecaoTitulo>Grupos musculares treinados</SecaoTitulo>
            <div className="bg-white rounded-2xl shadow-sm px-3 pt-4 pb-2">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={stats.distribuicaoMuscular}
                    dataKey="total"
                    nameKey="grupo"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    label={({ grupo, percent }) => `${grupo} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {stats.distribuicaoMuscular.map((_, i) => (
                      <Cell key={i} fill={CORES[i % CORES.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ fontSize: 11, borderRadius: 8, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                    formatter={(v, n) => [`${v} sessão(ões)`, n]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {/* Avaliações físicas */}
        <SecaoTitulo>Avaliações físicas</SecaoTitulo>

        {avaliacoes.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm px-4 py-8 flex flex-col items-center gap-2">
            <Ruler size={32} className="text-gray-200" />
            <p className="text-sm text-gray-400">Nenhuma avaliação registrada</p>
            <p className="text-xs text-gray-300 text-center">Peça ao seu professor para registrar sua avaliação</p>
          </div>
        ) : (
          <>
            {/* Última avaliação */}
            <div className="bg-white rounded-2xl shadow-sm px-4 py-4">
              <div className="flex justify-between items-center mb-3">
                <p className="text-sm font-bold text-gray-800">Última avaliação</p>
                <p className="text-xs text-gray-400">{formatDate(ultimaAval.data)}</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Peso', val: ultimaAval.peso, unit: 'kg' },
                  { label: 'Altura', val: ultimaAval.altura, unit: 'cm' },
                  { label: 'IMC', val: ultimaAval.imc, unit: '' },
                  { label: '% Gordura', val: ultimaAval.gordura, unit: '%' },
                  { label: 'Massa Magra', val: ultimaAval.massaMagra, unit: 'kg' },
                  { label: 'Cintura', val: ultimaAval.cintura, unit: 'cm' },
                  { label: 'Quadril', val: ultimaAval.quadril, unit: 'cm' },
                  { label: 'Braço', val: ultimaAval.braco, unit: 'cm' },
                  { label: 'Coxa', val: ultimaAval.coxa, unit: 'cm' },
                ].filter((m) => m.val !== null && m.val !== undefined).map(({ label, val, unit }) => (
                  <div key={label} className="bg-gray-50 rounded-xl p-2 text-center">
                    <p className="text-[10px] text-gray-400 mb-0.5">{label}</p>
                    <p className="text-sm font-bold text-gray-800">{val}{unit}</p>
                  </div>
                ))}
              </div>
              {ultimaAval.observacao && (
                <p className="text-xs text-gray-500 mt-3 bg-blue-50 rounded-xl px-3 py-2 italic">
                  "{ultimaAval.observacao}"
                </p>
              )}
            </div>

            {/* Comparativo com avaliação anterior */}
            {anteriorAval && (
              <div className="bg-white rounded-2xl shadow-sm px-4 py-4">
                <p className="text-sm font-bold text-gray-800 mb-1">Evolução</p>
                <p className="text-xs text-gray-400 mb-3">
                  {formatDate(anteriorAval.data)} → {formatDate(ultimaAval.data)}
                </p>
                <div className="flex flex-col gap-2">
                  {[
                    { label: 'Peso', a: anteriorAval.peso, b: ultimaAval.peso, unit: 'kg', inverso: true },
                    { label: '% Gordura', a: anteriorAval.gordura, b: ultimaAval.gordura, unit: '%', inverso: true },
                    { label: 'Massa Magra', a: anteriorAval.massaMagra, b: ultimaAval.massaMagra, unit: 'kg', inverso: false },
                    { label: 'Cintura', a: anteriorAval.cintura, b: ultimaAval.cintura, unit: 'cm', inverso: true },
                  ].filter((m) => m.a !== null && m.b !== null).map(({ label, a, b, unit, inverso }) => {
                    const diff = b - a
                    const positivo = inverso ? diff < 0 : diff > 0
                    return (
                      <div key={label} className="flex items-center justify-between">
                        <p className="text-xs text-gray-600">{label}</p>
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-gray-400">{a}{unit}</p>
                          <span className="text-gray-300">→</span>
                          <p className="text-xs font-bold text-gray-800">{b}{unit}</p>
                          {diff !== 0 && (
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${positivo ? 'text-green-600 bg-green-50' : 'text-red-500 bg-red-50'}`}>
                              {diff > 0 ? '+' : ''}{diff.toFixed(1)}
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Histórico de avaliações */}
            {avaliacoes.length > 1 && (
              <div className="flex flex-col gap-2">
                <p className="text-xs text-gray-400 px-1">Histórico ({avaliacoes.length} avaliações)</p>
                {avaliacoes.slice(1).map((av) => (
                  <div key={av.id} className="bg-white rounded-2xl shadow-sm px-4 py-3 flex justify-between items-center">
                    <p className="text-xs text-gray-500">{formatDate(av.data)}</p>
                    <div className="flex gap-4">
                      {av.peso && <span className="text-xs text-gray-700 font-medium">{av.peso}kg</span>}
                      {av.imc && <span className="text-xs text-gray-500">IMC {av.imc}</span>}
                      {av.gordura && <span className="text-xs text-gray-500">{av.gordura}% gord.</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

      </div>
    </div>
  )
}
