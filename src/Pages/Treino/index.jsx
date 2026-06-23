import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Check, Trophy, ChevronLeft, RotateCcw } from 'lucide-react'
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

  // Achata estrutura da API: { exercicio: {...}, series, repeticoes, carga }
  const exercicios = treino
    ? treino.exercicios.map((te) => ({
        id:         te.exercicio.id,
        teId:       te.id,
        nome:       te.exercicio.nome,
        grupo:      te.exercicio.grupo,
        gifUrl:     te.exercicio.gifUrl || gifPorNome[te.exercicio.nome] || '',
        series:     te.series,
        repeticoes: te.repeticoes,
        carga:      te.carga ?? '-',
      }))
    : []

  const [isRunning, setIsRunning] = useState(false)
  const [seconds, setSeconds]     = useState(0)
  const [done, setDone]           = useState({})
  const [salvando, setSalvando]   = useState(false)

  useEffect(() => {
    if (!isRunning) return
    const interval = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(interval)
  }, [isRunning])

  if (!treino) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 p-8 text-center">
        <p className="text-gray-500">Treino não encontrado.</p>
        <button onClick={() => navigate('/treinos')} className="text-[#0056D2] font-semibold text-sm">
          Ver treinos
        </button>
      </div>
    )
  }

  function toggleDone(exId) {
    setDone((prev) => ({ ...prev, [exId]: !prev[exId] }))
  }

  function handleReset() {
    setSeconds(0)
    setIsRunning(false)
    setDone({})
  }

  async function handleFinalizar() {
    setSalvando(true)
    try {
      await api.registrarSessao({
        treinoId: treino.id,
        duracaoSegundos: seconds,
        exerciciosFeitos: exercicios
          .filter((ex) => done[ex.id])
          .map((ex) => ({
            exercicioId: ex.id,
            series: Array(ex.series).fill({ reps: ex.repeticoes, carga: 0 }),
          })),
      })
      await refreshMe()
    } catch {
      // falha silenciosa — não bloqueia navegação
    } finally {
      setSalvando(false)
      navigate('/treinos')
    }
  }

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <header className="bg-[#0056D2] text-white flex items-center justify-between px-4 h-14 shrink-0">
        <button onClick={() => navigate(-1)} className="p-1 -ml-1">
          <ChevronLeft size={22} />
        </button>
        <h1 className="text-base font-semibold">{treino.nome}</h1>
        <div className="bg-white/15 rounded-full px-3 py-1">
          <span className="text-xs font-mono font-bold tracking-widest">{formatTime(seconds)}</span>
        </div>
      </header>

      {/* Lista */}
      <div className="flex flex-col gap-3 p-4 pb-36">
        {exercicios.map((ex) => (
          <div
            key={ex.id}
            className={`bg-white rounded-2xl shadow-sm flex items-center gap-3 px-3 py-3 transition-opacity ${
              done[ex.id] ? 'opacity-60' : ''
            }`}
          >
            {/* GIF */}
            <div className="w-16 h-16 rounded-xl bg-gray-100 shrink-0 overflow-hidden">
              {ex.gifUrl ? (
                <img src={ex.gifUrl} alt={ex.nome} className="w-full h-full object-cover" loading="lazy" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-xs text-gray-400">GIF</span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[#0056D2] leading-snug truncate">{ex.nome}</p>
              <p className="text-[10px] text-gray-400 mb-1">{ex.grupo}</p>
              <div className="flex gap-4">
                <div className="text-center">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide">Séries</p>
                  <p className="text-sm font-bold text-gray-800">{ex.series}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide">Reps</p>
                  <p className="text-sm font-bold text-gray-800">x{ex.repeticoes}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide">Carga</p>
                  <p className="text-sm font-bold text-gray-800">{ex.carga}</p>
                </div>
              </div>
            </div>

            {/* Toggle */}
            <button
              onClick={() => toggleDone(ex.id)}
              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                done[ex.id] ? 'bg-[#0056D2] border-[#0056D2]' : 'bg-transparent border-gray-300'
              }`}
            >
              {done[ex.id] && <Check size={14} className="text-white" strokeWidth={3} />}
            </button>
          </div>
        ))}
      </div>

      {/* Barra flutuante */}
      <div className="fixed bottom-16 left-0 right-0 flex items-center justify-center gap-4 px-6 pb-3 pt-2">
        <button
          onClick={handleReset}
          className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-500 active:scale-95 transition-transform"
        >
          <RotateCcw size={18} />
        </button>

        <button
          onClick={() => setIsRunning((v) => !v)}
          className={`w-16 h-16 rounded-full shadow-xl flex flex-col items-center justify-center gap-0.5 active:scale-95 transition-all ${
            isRunning ? 'bg-red-500' : 'bg-[#0056D2]'
          }`}
        >
          <Trophy size={22} className="text-white" />
          <span className="text-[9px] font-bold text-white uppercase tracking-wide">
            {isRunning ? 'Pausar' : 'Iniciar'}
          </span>
        </button>

        <button
          onClick={handleFinalizar}
          disabled={salvando}
          className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-500 active:scale-95 transition-transform disabled:opacity-60"
        >
          <Check size={18} />
        </button>
      </div>
    </div>
  )
}
