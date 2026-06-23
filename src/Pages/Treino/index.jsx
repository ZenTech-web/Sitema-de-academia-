import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Check, Dumbbell, List } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../services/api'
import { gifPorNome } from '../../data/gifMap'

function formatTime(s) {
  const m = Math.floor(s / 60).toString().padStart(2, '0')
  const sec = (s % 60).toString().padStart(2, '0')
  return `${m}:${sec}`
}

export default function Treino() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { treinos, refreshMe } = useAuth()

  const treino = treinos.find((t) => t.id === id)

  const exercicios = treino
    ? treino.exercicios.map((te) => ({
        id:         te.exercicio.id,
        nome:       te.exercicio.nome,
        grupo:      te.exercicio.grupo,
        gifUrl:     te.exercicio.gifUrl || gifPorNome[te.exercicio.nome] || '',
        series:     te.series,
        repeticoes: te.repeticoes,
        carga:      te.carga ?? null,
      }))
    : []

  const [view, setView]                 = useState('lista')
  const [exIndex, setExIndex]           = useState(0)
  const [seriesFeitas, setSeriesFeitas] = useState({})
  const [seconds, setSeconds]           = useState(0)
  const [salvando, setSalvando]         = useState(false)

  useEffect(() => {
    const interval = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(interval)
  }, [])

  if (!treino || exercicios.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 p-8 text-center">
        <p className="text-gray-500">Treino não encontrado.</p>
        <button onClick={() => navigate('/treinos')} className="text-[#0056D2] font-semibold text-sm">
          Ver treinos
        </button>
      </div>
    )
  }

  const todosFeitos = exercicios.every((e) => (seriesFeitas[e.id] ?? 0) >= e.series)

  // Retorna o índice do primeiro exercício com séries incompletas
  function primeiroIncompleto() {
    const idx = exercicios.findIndex((e) => (seriesFeitas[e.id] ?? 0) < e.series)
    return idx === -1 ? 0 : idx
  }

  function abrirDetalhe(index) {
    setExIndex(index)
    setView('detalhe')
  }

  function handleSair() {
    const temProgresso = Object.values(seriesFeitas).some((v) => v > 0)
    if (temProgresso) {
      if (!window.confirm('Sair do treino? O progresso desta sessão será perdido.')) return
    }
    navigate(-1)
  }

  async function handleFinalizar() {
    setSalvando(true)
    try {
      await api.registrarSessao({
        treinoId: treino.id,
        duracaoSegundos: seconds,
        exerciciosFeitos: exercicios
          .filter((e) => (seriesFeitas[e.id] ?? 0) > 0)
          .map((e) => ({
            exercicioId: e.id,
            series: Array(seriesFeitas[e.id]).fill({ reps: e.repeticoes, carga: 0 }),
          })),
      })
      await refreshMe()
    } catch {
      // falha silenciosa
    } finally {
      setSalvando(false)
      navigate('/')
    }
  }

  // ── LISTA GERAL ────────────────────────────────────────────────────────────
  if (view === 'lista') {
    const feitos = exercicios.filter((e) => (seriesFeitas[e.id] ?? 0) >= e.series).length
    const total  = exercicios.length

    return (
      <div className="flex flex-col min-h-full">
        <header className="bg-[#0056D2] text-white flex items-center justify-between px-4 h-14 shrink-0">
          <button onClick={handleSair} className="p-1 -ml-1">
            <ChevronLeft size={22} />
          </button>
          <div className="text-center">
            <p className="text-base font-bold leading-tight">{treino.nome}</p>
            <p className="text-xs text-blue-200">{feitos}/{total} exercícios</p>
          </div>
          <span className="font-mono text-sm font-bold bg-white/15 rounded-full px-3 py-1">
            {formatTime(seconds)}
          </span>
        </header>

        <div className="flex flex-col gap-3 p-4 pb-32">
          {exercicios.map((ex, i) => {
            const feitas   = seriesFeitas[ex.id] ?? 0
            const completo = feitas >= ex.series

            return (
              <button
                key={ex.id}
                onClick={() => abrirDetalhe(i)}
                className={`bg-white rounded-2xl shadow-sm flex items-center gap-3 px-3 py-3 w-full text-left active:scale-[0.98] transition-transform ${
                  completo ? 'opacity-60' : ''
                }`}
              >
                <div className="w-16 h-16 rounded-xl bg-gray-100 shrink-0 overflow-hidden">
                  {ex.gifUrl ? (
                    <img src={ex.gifUrl} alt={ex.nome} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Dumbbell size={22} className="text-gray-300" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#0056D2] leading-snug truncate">{ex.nome}</p>
                  <p className="text-[10px] text-gray-400 mb-1.5">{ex.grupo}</p>
                  <div className="flex gap-4">
                    <div className="text-center">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide">Séries</p>
                      <p className="text-sm font-bold text-gray-800">{ex.series}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide">Reps</p>
                      <p className="text-sm font-bold text-gray-800">x{ex.repeticoes}</p>
                    </div>
                    {ex.carga !== null && (
                      <div className="text-center">
                        <p className="text-[10px] text-gray-400 uppercase tracking-wide">Carga</p>
                        <p className="text-sm font-bold text-gray-800">{ex.carga} kg</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  {completo ? (
                    <div className="w-8 h-8 rounded-full bg-[#0056D2] flex items-center justify-center">
                      <Check size={14} className="text-white" strokeWidth={3} />
                    </div>
                  ) : (
                    <>
                      <div className="flex gap-1">
                        {Array.from({ length: ex.series }).map((_, si) => (
                          <div
                            key={si}
                            className={`w-2.5 h-2.5 rounded-full ${si < feitas ? 'bg-[#0056D2]' : 'bg-gray-200'}`}
                          />
                        ))}
                      </div>
                      <p className="text-[10px] text-gray-400">{feitas}/{ex.series} séries</p>
                    </>
                  )}
                </div>
              </button>
            )
          })}
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-linear-to-t from-gray-100 via-gray-100/90 to-transparent">
          <button
            onClick={todosFeitos ? handleFinalizar : () => abrirDetalhe(primeiroIncompleto())}
            disabled={salvando}
            className={`w-full py-4 rounded-2xl font-bold text-white text-base shadow-lg active:scale-[0.98] transition-transform disabled:opacity-60 ${
              todosFeitos ? 'bg-green-500' : 'bg-[#0056D2]'
            }`}
          >
            {salvando ? 'Salvando...' : todosFeitos ? '🏆 Finalizar Treino' : 'Iniciar Treino'}
          </button>
        </div>
      </div>
    )
  }

  // ── DETALHE DO EXERCÍCIO ───────────────────────────────────────────────────
  const ex             = exercicios[exIndex]
  const seriesFeitasEx = seriesFeitas[ex.id] ?? 0
  const todasFeitas    = seriesFeitasEx >= ex.series
  const isUltimo       = exIndex === exercicios.length - 1

  function handleRealizado() {
    if (seriesFeitasEx < ex.series) {
      setSeriesFeitas((prev) => ({ ...prev, [ex.id]: seriesFeitasEx + 1 }))
    }
  }

  return (
    <div className="flex flex-col min-h-full bg-gray-100">

      <header className="bg-[#0056D2] text-white flex items-center gap-3 px-4 h-14 shrink-0">
        <button onClick={() => setView('lista')} className="p-1 -ml-1 shrink-0">
          <ChevronLeft size={22} />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-base font-bold leading-tight truncate">{ex.nome}</p>
          <p className="text-xs text-blue-200">{ex.grupo}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-bold bg-white/15 rounded-full px-3 py-1">
            {formatTime(seconds)}
          </span>
          <button onClick={() => setView('lista')} className="p-1.5 bg-white/15 rounded-full">
            <List size={16} className="text-white" />
          </button>
        </div>
      </header>

      {/* Barra de progresso */}
      <div className="flex gap-1.5 px-4 pt-3 pb-1">
        {exercicios.map((e, i) => (
          <div
            key={e.id}
            onClick={() => setExIndex(i)}
            className={`h-1.5 rounded-full flex-1 transition-all ${
              (seriesFeitas[e.id] ?? 0) >= e.series
                ? 'bg-[#0056D2]'
                : i === exIndex
                ? 'bg-[#0056D2]/50'
                : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
      <p className="text-center text-[10px] text-gray-400 pb-2">
        {exIndex + 1} / {exercicios.length}
      </p>

      {/* Card principal */}
      <div className="mx-4 bg-white rounded-3xl shadow-sm overflow-hidden">
        <div className="w-full bg-gray-50 flex items-center justify-center" style={{ height: 240 }}>
          {ex.gifUrl ? (
            <img src={ex.gifUrl} alt={ex.nome} className="w-full h-full object-contain" />
          ) : (
            <div className="flex flex-col items-center gap-2 text-gray-300">
              <Dumbbell size={48} />
              <span className="text-sm">Sem GIF</span>
            </div>
          )}
        </div>

        <div className="flex justify-center gap-10 pt-4 pb-3">
          <div className="text-center">
            <p className="text-3xl font-extrabold text-gray-800 leading-none">{ex.repeticoes}</p>
            <p className="text-xs text-gray-400 mt-1">Repetições</p>
          </div>
          {ex.carga !== null && (
            <div className="text-center">
              <p className="text-3xl font-extrabold text-gray-800 leading-none">{ex.carga}</p>
              <p className="text-xs text-gray-400 mt-1">Carga (kg)</p>
            </div>
          )}
        </div>

        {/* Bolinhas de série */}
        <div className="flex justify-center gap-3 pb-5">
          {Array.from({ length: ex.series }).map((_, i) => (
            <div
              key={i}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-200 ${
                i < seriesFeitasEx
                  ? 'bg-[#0056D2] text-white shadow-md'
                  : i === seriesFeitasEx
                  ? 'bg-white text-[#0056D2] border-2 border-[#0056D2] scale-110'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              {i < seriesFeitasEx ? <Check size={14} strokeWidth={3} /> : i + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Controles */}
      <div className="flex-1 flex flex-col items-center justify-center py-6">
        {todosFeitos ? (
          <button
            onClick={handleFinalizar}
            disabled={salvando}
            className="bg-green-500 text-white font-bold text-base rounded-2xl px-12 py-4 shadow-xl active:scale-95 transition-transform disabled:opacity-60"
          >
            {salvando ? 'Salvando...' : '🏆 Finalizar Treino'}
          </button>
        ) : (
          <div className="flex items-center gap-5">
            <button
              onClick={() => setExIndex((i) => Math.max(0, i - 1))}
              disabled={exIndex === 0}
              className="w-14 h-14 rounded-full bg-[#0056D2] flex items-center justify-center shadow-lg disabled:opacity-30 active:scale-95 transition-transform"
            >
              <ChevronLeft size={26} className="text-white" />
            </button>

            <button
              onClick={handleRealizado}
              disabled={todasFeitas}
              className={`w-24 h-24 rounded-full flex flex-col items-center justify-center shadow-xl gap-1 active:scale-95 transition-all ${
                todasFeitas ? 'bg-green-500' : 'bg-[#0056D2]'
              } disabled:opacity-80`}
            >
              <Check size={30} className="text-white" strokeWidth={3} />
              <span className="text-[10px] font-bold text-white uppercase tracking-wide">
                {todasFeitas ? 'Feito!' : 'Realizado'}
              </span>
            </button>

            <button
              onClick={() => setExIndex((i) => Math.min(exercicios.length - 1, i + 1))}
              disabled={isUltimo}
              className="w-14 h-14 rounded-full bg-[#0056D2] flex items-center justify-center shadow-lg disabled:opacity-30 active:scale-95 transition-transform"
            >
              <ChevronRight size={26} className="text-white" />
            </button>
          </div>
        )}

        <button
          onClick={() => setView('lista')}
          className="mt-4 text-xs text-gray-400 underline underline-offset-2"
        >
          Ver todos os exercícios
        </button>
      </div>

    </div>
  )
}
