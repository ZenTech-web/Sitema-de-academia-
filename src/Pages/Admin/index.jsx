import { useState, useEffect } from 'react'
import { Users, UserPlus, Dumbbell, LogOut, Check, ChevronDown, Activity, Calculator, BarChart2, Ruler } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts'
import { useAuth } from '../../context/AuthContext'
import { api, formatDate } from '../../services/api'

// ── Utilitários ───────────────────────────────────────────
function Spinner() {
  return (
    <div className="flex justify-center py-12">
      <div className="w-6 h-6 border-2 border-[#0056D2]/30 border-t-[#0056D2] rounded-full animate-spin" />
    </div>
  )
}

function Field({ label, className = '', ...props }) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && <label className="text-xs text-gray-500 font-medium px-1">{label}</label>}
      <input
        {...props}
        className="bg-white rounded-2xl px-4 py-3 text-sm text-gray-800 shadow-sm border border-gray-100 outline-none focus:border-[#0056D2]/50 w-full"
      />
    </div>
  )
}

// ── Tab: Alunos ───────────────────────────────────────────
function TabAlunos({ onGerenciarTreinos }) {
  const [alunos, setAlunos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.admin.getAlunos()
      .then((d) => setAlunos(d.filter((a) => a.role !== 'ADMIN')))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner />

  if (alunos.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-16 px-6 text-center">
        <Users size={40} className="text-gray-200" />
        <p className="text-sm text-gray-400">Nenhum aluno cadastrado ainda.</p>
        <p className="text-xs text-gray-300">Use a aba "Novo Aluno" para adicionar.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3 p-4">
      <p className="text-xs text-gray-400 font-medium px-1">{alunos.length} aluno(s) cadastrado(s)</p>
      {alunos.map((a) => (
        <div key={a.id} className="bg-white rounded-2xl shadow-sm px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-blue-50 flex items-center justify-center text-sm font-extrabold text-[#0056D2] shrink-0">
              {a.iniciais}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">{a.nome}</p>
              <p className="text-xs text-gray-400 truncate">{a.email}</p>
              {a.objetivo && (
                <p className="text-xs text-gray-500 mt-0.5 truncate">{a.objetivo}</p>
              )}
            </div>
            <button
              onClick={() => onGerenciarTreinos(a)}
              className="text-xs font-bold text-[#0056D2] bg-blue-50 px-3 py-2 rounded-xl shrink-0 active:scale-95 transition-transform"
            >
              Treinos
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Tab: Novo Aluno ───────────────────────────────────────
function TabNovoAluno({ onSuccess }) {
  const INIT = { nome: '', email: '', senha: '', objetivo: '', sessoesTotal: '90', dataInicio: '' }
  const [form, setForm] = useState(INIT)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState(null)
  const [ok, setOk] = useState(false)

  function upd(k) {
    return (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setErro(null)
    try {
      await api.admin.criarAluno({
        nome: form.nome,
        email: form.email,
        senha: form.senha,
        objetivo: form.objetivo || undefined,
        sessoesTotal: Number(form.sessoesTotal) || 90,
        dataInicio: form.dataInicio || undefined,
      })
      setOk(true)
      setForm(INIT)
      setTimeout(() => { setOk(false); onSuccess() }, 1800)
    } catch (err) {
      setErro(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide px-1 mb-1">Dados do aluno</p>

        <Field label="Nome completo *" required placeholder="ex: João Silva"
          value={form.nome} onChange={upd('nome')} />
        <Field label="E-mail *" required type="email" placeholder="joao@email.com"
          value={form.email} onChange={upd('email')} />
        <Field label="Senha *" required type="password" placeholder="••••••••"
          value={form.senha} onChange={upd('senha')} />
        <Field label="Objetivo" placeholder="ex: Hipertrofia"
          value={form.objetivo} onChange={upd('objetivo')} />

        <div className="flex gap-3">
          <Field label="Total de sessões" type="number" min="1" className="flex-1"
            value={form.sessoesTotal} onChange={upd('sessoesTotal')} />
          <Field label="Data de início" type="date" className="flex-1"
            value={form.dataInicio} onChange={upd('dataInicio')} />
        </div>

        {erro && (
          <p className="text-red-500 text-xs text-center bg-red-50 rounded-xl py-2 px-3">{erro}</p>
        )}
        {ok && (
          <p className="text-green-600 text-sm text-center font-semibold bg-green-50 rounded-xl py-2">
            ✓ Aluno cadastrado com sucesso!
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-[#0056D2] text-white font-bold rounded-2xl py-3.5 text-sm mt-2 disabled:opacity-60 active:scale-[0.98] transition-transform"
        >
          {loading ? 'Cadastrando...' : 'Cadastrar Aluno'}
        </button>
      </form>
    </div>
  )
}

// ── Tab: Treinos ──────────────────────────────────────────
function TabTreinos({ alunoInicial }) {
  const [alunos, setAlunos]             = useState([])
  const [alunoId, setAlunoId]           = useState(alunoInicial?.id ?? '')
  const [treinos, setTreinos]           = useState([])
  const [exerciciosDisp, setEx]         = useState([])
  const [loadingTreinos, setLT]         = useState(false)
  const [showForm, setShowForm]         = useState(false)
  const [salvando, setSalvando]         = useState(false)
  const [ok, setOk]                     = useState(false)
  const [erro, setErro]                 = useState(null)
  const [busca, setBusca]               = useState('')

  // Novo treino form
  const [formNome, setFormNome]         = useState('')
  const [formSigla, setFormSigla]       = useState('')
  const [siglaManual, setSiglaManual]   = useState(false)
  const [selecionados, setSel]          = useState({})

  useEffect(() => {
    Promise.all([api.admin.getAlunos(), api.admin.getExercicios()])
      .then(([a, e]) => {
        setAlunos(a.filter((x) => x.role !== 'ADMIN'))
        setEx(e)
      })
  }, [])

  useEffect(() => {
    if (!alunoId) { setTreinos([]); return }
    setLT(true)
    api.admin.getTreinosAluno(alunoId).then(setTreinos).finally(() => setLT(false))
  }, [alunoId])

  function handleNomeChange(v) {
    setFormNome(v)
    if (!siglaManual) {
      setFormSigla(v.split(' ').map((w) => w[0] || '').join('').slice(0, 2).toUpperCase())
    }
  }

  function toggleEx(ex) {
    setSel((prev) => {
      if (prev[ex.id]) { const n = { ...prev }; delete n[ex.id]; return n }
      return { ...prev, [ex.id]: { series: '3', repeticoes: '12', carga: '' } }
    })
  }

  function updEx(id, k, v) {
    setSel((prev) => ({ ...prev, [id]: { ...prev[id], [k]: v } }))
  }

  const termoBusca = busca.toLowerCase().trim()
  const exerciciosFiltrados = termoBusca
    ? exerciciosDisp.filter(
        (e) => e.nome.toLowerCase().includes(termoBusca) || e.grupo.toLowerCase().includes(termoBusca)
      )
    : exerciciosDisp

  const grupos = [...new Set(exerciciosFiltrados.map((e) => e.grupo))].sort()

  const musculosAuto = [
    ...new Set(
      Object.keys(selecionados)
        .map((id) => exerciciosDisp.find((e) => e.id === id)?.grupo)
        .filter(Boolean),
    ),
  ].join(', ')

  function resetForm() {
    setShowForm(false)
    setFormNome('')
    setFormSigla('')
    setSiglaManual(false)
    setSel({})
    setErro(null)
  }

  async function handleSalvar(e) {
    e.preventDefault()
    if (!alunoId || !formNome) return
    setSalvando(true)
    setErro(null)
    try {
      const exerciciosList = exerciciosDisp
        .filter((ex) => selecionados[ex.id])
        .map((ex, i) => ({
          exercicioId: ex.id,
          series:      Number(selecionados[ex.id].series) || 3,
          repeticoes:  Number(selecionados[ex.id].repeticoes) || 12,
          carga:       selecionados[ex.id].carga ? Number(selecionados[ex.id].carga) : null,
          ordem:       i,
        }))

      const novo = await api.admin.criarTreinoAluno(alunoId, {
        nome:      formNome,
        sigla:     formSigla || undefined,
        musculos:  musculosAuto ? musculosAuto.split(', ') : [],
        ordem:     treinos.length,
        exercicios: exerciciosList,
      })
      setTreinos((prev) => [...prev, novo])
      resetForm()
      setOk(true)
      setTimeout(() => setOk(false), 2500)
    } catch (err) {
      setErro(err.message)
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div className="flex flex-col gap-3 p-4 pb-8">
      {/* Select aluno */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500 font-medium px-1">Selecionar aluno</label>
        <div className="relative">
          <select
            value={alunoId}
            onChange={(e) => { setAlunoId(e.target.value); resetForm() }}
            className="bg-white rounded-2xl px-4 py-3 text-sm text-gray-800 shadow-sm border border-gray-100 w-full appearance-none pr-10 outline-none"
          >
            <option value="">— selecione um aluno —</option>
            {alunos.map((a) => (
              <option key={a.id} value={a.id}>{a.nome}</option>
            ))}
          </select>
          <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {alunoId && (
        <>
          {loadingTreinos ? <Spinner /> : (
            <>
              {treinos.length === 0 && !showForm && (
                <p className="text-sm text-gray-400 text-center py-4">
                  Nenhum treino cadastrado para este aluno.
                </p>
              )}

              {treinos.map((t) => (
                <div key={t.id} className="bg-white rounded-2xl shadow-sm px-4 py-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-xs font-extrabold text-[#0056D2] shrink-0">
                    {t.sigla || t.nome.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800">{t.nome}</p>
                    <p className="text-xs text-gray-400">
                      {t.musculos?.join(' / ')} · {t.exercicios?.length ?? 0} exercício(s)
                    </p>
                  </div>
                </div>
              ))}
            </>
          )}

          {ok && (
            <p className="text-green-600 text-sm text-center font-semibold bg-green-50 rounded-xl py-2">
              ✓ Treino criado com sucesso!
            </p>
          )}

          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-[#0056D2] text-white font-bold rounded-2xl py-3 text-sm active:scale-[0.98] transition-transform"
            >
              + Novo Treino
            </button>
          )}

          {showForm && (
            <form onSubmit={handleSalvar} className="bg-white rounded-2xl shadow-sm p-4 flex flex-col gap-4">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Novo Treino</p>

              <div className="flex gap-3">
                <Field label="Nome do treino *" required placeholder="ex: Treino A" className="flex-1"
                  value={formNome} onChange={(e) => handleNomeChange(e.target.value)} />
                <Field label="Sigla" placeholder="A" className="w-20"
                  value={formSigla}
                  onChange={(e) => {
                    setFormSigla(e.target.value.toUpperCase().slice(0, 2))
                    setSiglaManual(true)
                  }}
                />
              </div>

              {musculosAuto && (
                <p className="text-xs text-gray-400 -mt-2 px-1">
                  Músculos: <span className="text-gray-600 font-medium">{musculosAuto}</span>
                </p>
              )}

              {/* Exercise selector */}
              <div>
                <p className="text-xs text-gray-500 font-medium px-1 mb-2">
                  Exercícios ({Object.keys(selecionados).length} selecionado(s))
                </p>
                <input
                  type="text"
                  placeholder="Buscar exercício ou grupo..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#0056D2]/50 mb-3"
                />
                <div className="flex flex-col gap-2">
                  {grupos.length === 0 && (
                    <p className="text-xs text-gray-400 text-center py-3">Nenhum exercício encontrado</p>
                  )}
                  {grupos.map((grupo) => (
                    <div key={grupo}>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold px-1 mb-1">
                        {grupo}
                      </p>
                      {exerciciosFiltrados.filter((e) => e.grupo === grupo).map((ex) => (
                        <div key={ex.id} className="mb-1">
                          <button
                            type="button"
                            onClick={() => toggleEx(ex)}
                            className="w-full flex items-center gap-2 px-2 py-2 rounded-xl active:bg-gray-100 text-left"
                          >
                            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
                              selecionados[ex.id] ? 'bg-[#0056D2] border-[#0056D2]' : 'border-gray-300'
                            }`}>
                              {selecionados[ex.id] && <Check size={12} className="text-white" strokeWidth={3} />}
                            </div>
                            <span className="text-sm text-gray-700">{ex.nome}</span>
                          </button>

                          {selecionados[ex.id] && (
                            <div className="flex gap-2 px-7 mt-1 mb-2">
                              {[
                                { k: 'series',     label: 'Séries',   type: 'number', min: '1' },
                                { k: 'repeticoes', label: 'Reps',     type: 'number', min: '1' },
                                { k: 'carga',      label: 'Carga kg', type: 'number', min: '0', step: '0.5', placeholder: '—' },
                              ].map(({ k, label, ...rest }) => (
                                <div key={k} className="flex-1 flex flex-col items-center gap-0.5">
                                  <span className="text-[9px] text-gray-400 uppercase tracking-wide">{label}</span>
                                  <input
                                    {...rest}
                                    value={selecionados[ex.id][k]}
                                    onChange={(e) => updEx(ex.id, k, e.target.value)}
                                    className="w-full text-center text-sm font-bold text-gray-800 border border-gray-200 rounded-lg py-1.5 outline-none focus:border-[#0056D2]/50"
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {erro && (
                <p className="text-red-500 text-xs text-center bg-red-50 rounded-xl py-2">{erro}</p>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-100 text-gray-600 font-semibold rounded-2xl py-3 text-sm active:scale-[0.98] transition-transform"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={salvando || !formNome || Object.keys(selecionados).length === 0}
                  className="flex-1 bg-[#0056D2] text-white font-bold rounded-2xl py-3 text-sm disabled:opacity-50 active:scale-[0.98] transition-transform"
                >
                  {salvando ? 'Salvando...' : 'Salvar Treino'}
                </button>
              </div>
            </form>
          )}
        </>
      )}
    </div>
  )
}

// ── Tab: Avaliações ───────────────────────────────────────
function TabAvaliacoes() {
  const INIT = { peso: '', altura: '', gordura: '', massaMagra: '', cintura: '', quadril: '', peito: '', braco: '', coxa: '', panturrilha: '', observacao: '', data: new Date().toISOString().split('T')[0] }
  const [alunos, setAlunos]         = useState([])
  const [alunoId, setAlunoId]       = useState('')
  const [avaliacoes, setAval]       = useState([])
  const [loadingAval, setLA]        = useState(false)
  const [showForm, setShowForm]     = useState(false)
  const [form, setForm]             = useState(INIT)
  const [salvando, setSalvando]     = useState(false)
  const [ok, setOk]                 = useState(false)
  const [erro, setErro]             = useState(null)

  useEffect(() => {
    api.admin.getAlunos().then((a) => setAlunos(a.filter((x) => x.role !== 'ADMIN')))
  }, [])

  useEffect(() => {
    if (!alunoId) { setAval([]); return }
    setLA(true)
    api.admin.getAvaliacoesAluno(alunoId).then(setAval).finally(() => setLA(false))
  }, [alunoId])

  function upd(k) { return (e) => setForm((f) => ({ ...f, [k]: e.target.value })) }

  const num = (v) => v === '' ? null : Number(v)

  async function handleSalvar(e) {
    e.preventDefault()
    setSalvando(true)
    setErro(null)
    try {
      const nova = await api.admin.criarAvaliacaoAluno(alunoId, {
        peso: num(form.peso), altura: num(form.altura), gordura: num(form.gordura),
        massaMagra: num(form.massaMagra), cintura: num(form.cintura), quadril: num(form.quadril),
        peito: num(form.peito), braco: num(form.braco), coxa: num(form.coxa),
        panturrilha: num(form.panturrilha), observacao: form.observacao || null, data: form.data || undefined,
      })
      setAval((prev) => [nova, ...prev])
      setShowForm(false)
      setForm(INIT)
      setOk(true)
      setTimeout(() => setOk(false), 2500)
    } catch (err) { setErro(err.message) }
    finally { setSalvando(false) }
  }

  const ultima    = avaliacoes[0] ?? null
  const anterior  = avaliacoes[1] ?? null

  const medidas = [
    { label: 'Peso',        k: 'peso',        unit: 'kg' },
    { label: 'Altura',      k: 'altura',      unit: 'cm' },
    { label: '% Gordura',   k: 'gordura',     unit: '%'  },
    { label: 'Massa Magra', k: 'massaMagra',  unit: 'kg' },
    { label: 'Cintura',     k: 'cintura',     unit: 'cm' },
    { label: 'Quadril',     k: 'quadril',     unit: 'cm' },
    { label: 'Peito',       k: 'peito',       unit: 'cm' },
    { label: 'Braço',       k: 'braco',       unit: 'cm' },
    { label: 'Coxa',        k: 'coxa',        unit: 'cm' },
    { label: 'Panturrilha', k: 'panturrilha', unit: 'cm' },
  ]

  const camposComparativo = [
    { label: 'Peso',        k: 'peso',       unit: 'kg', inverso: true  },
    { label: '% Gordura',   k: 'gordura',    unit: '%',  inverso: true  },
    { label: 'Massa Magra', k: 'massaMagra', unit: 'kg', inverso: false },
    { label: 'Cintura',     k: 'cintura',    unit: 'cm', inverso: true  },
  ]

  return (
    <div className="flex flex-col gap-3 p-4 pb-8">
      {/* Selecionar aluno */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500 font-medium px-1">Selecionar aluno</label>
        <div className="relative">
          <select value={alunoId} onChange={(e) => { setAlunoId(e.target.value); setShowForm(false) }}
            className="bg-white rounded-2xl px-4 py-3 text-sm text-gray-800 shadow-sm border border-gray-100 w-full appearance-none pr-10 outline-none">
            <option value="">— selecione um aluno —</option>
            {alunos.map((a) => <option key={a.id} value={a.id}>{a.nome}</option>)}
          </select>
          <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {alunoId && (
        <>
          {ok && (
            <p className="text-green-600 text-sm text-center font-semibold bg-green-50 rounded-xl py-2">
              ✓ Avaliação registrada!
            </p>
          )}

          {loadingAval ? <Spinner /> : (
            <>
              {/* Última avaliação */}
              {ultima && (
                <div className="bg-white rounded-2xl shadow-sm px-4 py-4">
                  <div className="flex justify-between mb-3">
                    <p className="text-sm font-bold text-gray-800">Última avaliação</p>
                    <p className="text-xs text-gray-400">{formatDate(ultima.data)}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[...medidas, { label: 'IMC', k: 'imc', unit: '' }]
                      .filter(({ k }) => ultima[k] !== null && ultima[k] !== undefined)
                      .map(({ label, k, unit }) => (
                        <div key={k} className="bg-gray-50 rounded-xl p-2 text-center">
                          <p className="text-[10px] text-gray-400 mb-0.5">{label}</p>
                          <p className="text-sm font-bold text-gray-800">{ultima[k]}{unit}</p>
                        </div>
                      ))}
                  </div>
                  {ultima.observacao && (
                    <p className="text-xs text-gray-500 mt-3 bg-blue-50 rounded-xl px-3 py-2 italic">"{ultima.observacao}"</p>
                  )}
                </div>
              )}

              {/* Comparativo */}
              {ultima && anterior && (
                <div className="bg-white rounded-2xl shadow-sm px-4 py-4">
                  <p className="text-sm font-bold text-gray-800 mb-1">Evolução</p>
                  <p className="text-xs text-gray-400 mb-3">{formatDate(anterior.data)} → {formatDate(ultima.data)}</p>
                  <div className="flex flex-col gap-2">
                    {camposComparativo.filter(({ k }) => anterior[k] !== null && ultima[k] !== null).map(({ label, k, unit, inverso }) => {
                      const diff = ultima[k] - anterior[k]
                      const positivo = inverso ? diff < 0 : diff > 0
                      return (
                        <div key={k} className="flex items-center justify-between">
                          <p className="text-xs text-gray-600">{label}</p>
                          <div className="flex items-center gap-2">
                            <p className="text-xs text-gray-400">{anterior[k]}{unit}</p>
                            <span className="text-gray-300">→</span>
                            <p className="text-xs font-bold text-gray-800">{ultima[k]}{unit}</p>
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

              {avaliacoes.length === 0 && !showForm && (
                <p className="text-sm text-gray-400 text-center py-4">Nenhuma avaliação registrada.</p>
              )}
            </>
          )}

          {!showForm && (
            <button onClick={() => setShowForm(true)}
              className="bg-[#0056D2] text-white font-bold rounded-2xl py-3 text-sm active:scale-[0.98] transition-transform">
              + Nova Avaliação
            </button>
          )}

          {showForm && (
            <form onSubmit={handleSalvar} className="bg-white rounded-2xl shadow-sm p-4 flex flex-col gap-3">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Nova Avaliação</p>

              <Field label="Data" type="date" value={form.data} onChange={upd('data')} />

              <div className="grid grid-cols-2 gap-2">
                <Field label="Peso (kg)" type="number" step="0.1" min="0" placeholder="ex: 75.5" value={form.peso} onChange={upd('peso')} />
                <Field label="Altura (cm)" type="number" min="0" placeholder="ex: 175" value={form.altura} onChange={upd('altura')} />
              </div>

              {form.peso && form.altura && (
                <p className="text-xs text-[#0056D2] px-1">
                  IMC calculado: <strong>{(Number(form.peso) / Math.pow(Number(form.altura) / 100, 2)).toFixed(1)}</strong>
                </p>
              )}

              <div className="grid grid-cols-2 gap-2">
                <Field label="% Gordura" type="number" step="0.1" min="0" placeholder="ex: 22" value={form.gordura} onChange={upd('gordura')} />
                <Field label="Massa Magra (kg)" type="number" step="0.1" min="0" placeholder="ex: 60" value={form.massaMagra} onChange={upd('massaMagra')} />
              </div>

              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide px-1">Medidas (cm)</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  ['Cintura', 'cintura'], ['Quadril', 'quadril'], ['Peito', 'peito'],
                  ['Braço', 'braco'], ['Coxa', 'coxa'], ['Panturrilha', 'panturrilha'],
                ].map(([label, k]) => (
                  <Field key={k} label={label} type="number" step="0.1" min="0" placeholder="—" value={form[k]} onChange={upd(k)} />
                ))}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500 font-medium px-1">Observação</label>
                <textarea value={form.observacao} onChange={upd('observacao')} rows={2}
                  placeholder="Notas do professor..."
                  className="bg-white rounded-2xl px-4 py-3 text-sm text-gray-800 shadow-sm border border-gray-100 outline-none focus:border-[#0056D2]/50 resize-none" />
              </div>

              {erro && <p className="text-red-500 text-xs text-center bg-red-50 rounded-xl py-2">{erro}</p>}

              <div className="flex gap-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-100 text-gray-600 font-semibold rounded-2xl py-3 text-sm active:scale-[0.98] transition-transform">
                  Cancelar
                </button>
                <button type="submit" disabled={salvando}
                  className="flex-1 bg-[#0056D2] text-white font-bold rounded-2xl py-3 text-sm disabled:opacity-50 active:scale-[0.98] transition-transform">
                  {salvando ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          )}
        </>
      )}
    </div>
  )
}

// ── Tab: Stats ────────────────────────────────────────────
function TabStats() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.admin.getStats().then(setStats).finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner />
  if (!stats) return null

  return (
    <div className="flex flex-col gap-4 p-4 pb-8">
      {/* Cards de resumo */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Total Alunos',    val: stats.totalAlunos,   cor: 'text-[#0056D2]' },
          { label: 'Sessões Hoje',    val: stats.sessoesHoje,   cor: 'text-green-600'  },
          { label: 'Sessões Semana',  val: stats.sessoesSemana, cor: 'text-orange-500' },
          { label: 'Sessões 30 dias', val: stats.sessoesMes,    cor: 'text-purple-600' },
        ].map(({ label, val, cor }) => (
          <div key={label} className="bg-white rounded-2xl shadow-sm px-4 py-3">
            <p className="text-xs text-gray-400">{label}</p>
            <p className={`text-2xl font-extrabold ${cor}`}>{val}</p>
          </div>
        ))}
      </div>

      {stats.alunosInativos > 0 && (
        <div className="bg-orange-50 rounded-2xl px-4 py-3 flex items-center gap-2">
          <Activity size={16} className="text-orange-500 shrink-0" />
          <p className="text-sm text-orange-700 font-medium">
            <strong>{stats.alunosInativos}</strong> aluno(s) sem treino nos últimos 7 dias
          </p>
        </div>
      )}

      {/* Gráfico — Sessões por dia */}
      {stats.sessoesPorDia?.length > 0 && (
        <>
          <p className="text-xs text-gray-500 uppercase tracking-wider font-bold px-1">Sessões por dia (30 dias)</p>
          <div className="bg-white rounded-2xl shadow-sm px-3 pt-4 pb-2">
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={stats.sessoesPorDia.slice(-30)} margin={{ top: 0, right: 8, left: -20, bottom: 0 }}>
                <XAxis dataKey="data" tick={{ fontSize: 8 }} tickLine={false} axisLine={false}
                  tickFormatter={(v) => v.slice(5)} interval={3} />
                <YAxis allowDecimals={false} tick={{ fontSize: 9 }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ fontSize: 11, borderRadius: 8, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                  formatter={(v) => [`${v} sessão(ões)`, '']}
                  labelFormatter={(v) => formatDate(v)}
                />
                <Bar dataKey="total" fill="#0056D2" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {/* Top exercícios */}
      {stats.topExercicios?.length > 0 && (
        <>
          <p className="text-xs text-gray-500 uppercase tracking-wider font-bold px-1">Top exercícios (30 dias)</p>
          <div className="bg-white rounded-2xl shadow-sm px-4 py-3 flex flex-col gap-2">
            {stats.topExercicios.map((ex, i) => (
              <div key={ex.id} className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-300 w-4">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{ex.nome}</p>
                  <p className="text-xs text-gray-400">{ex.grupo}</p>
                </div>
                <span className="text-xs font-bold text-[#0056D2] bg-blue-50 px-2 py-0.5 rounded-full">
                  {ex.count}x
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ── Tab: Calculadora ──────────────────────────────────────
const CALC_TABS = ['IMC', 'TMB', '1RM', 'Gordura']

function TabCalculadora() {
  const [subtab, setSubtab] = useState('IMC')

  return (
    <div className="flex flex-col gap-4 p-4 pb-8">
      {/* Subtab bar */}
      <div className="flex bg-white rounded-2xl shadow-sm overflow-hidden">
        {CALC_TABS.map((t) => (
          <button key={t} onClick={() => setSubtab(t)}
            className={`flex-1 py-2.5 text-xs font-bold transition-colors ${subtab === t ? 'bg-[#0056D2] text-white' : 'text-gray-400'}`}>
            {t}
          </button>
        ))}
      </div>

      {subtab === 'IMC'    && <CalcIMC />}
      {subtab === 'TMB'    && <CalcTMB />}
      {subtab === '1RM'    && <Calc1RM />}
      {subtab === 'Gordura' && <CalcGordura />}
    </div>
  )
}

function useCalcField(init = '') { return useState(init) }

function CalcCard({ titulo, resultado, extra }) {
  if (!resultado) return null
  return (
    <div className="bg-blue-50 rounded-2xl px-4 py-4 flex flex-col gap-1">
      <p className="text-xs text-[#0056D2] font-medium">{titulo}</p>
      <p className="text-3xl font-extrabold text-[#0056D2]">{resultado}</p>
      {extra && <p className="text-xs text-gray-600 mt-1">{extra}</p>}
    </div>
  )
}

function CalcIMC() {
  const [peso, setPeso]     = useCalcField()
  const [altura, setAltura] = useCalcField()

  const imc = peso && altura ? Number(peso) / Math.pow(Number(altura) / 100, 2) : null
  const classificacao = imc ? (
    imc < 18.5 ? 'Abaixo do peso' :
    imc < 25   ? 'Peso normal' :
    imc < 30   ? 'Sobrepeso' :
    imc < 35   ? 'Obesidade grau I' :
    imc < 40   ? 'Obesidade grau II' : 'Obesidade grau III'
  ) : null

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-gray-400 px-1">Índice de Massa Corporal</p>
      <Field label="Peso (kg)" type="number" step="0.1" min="0" placeholder="ex: 75" value={peso} onChange={(e) => setPeso(e.target.value)} />
      <Field label="Altura (cm)" type="number" min="0" placeholder="ex: 175" value={altura} onChange={(e) => setAltura(e.target.value)} />
      <CalcCard titulo="IMC" resultado={imc ? imc.toFixed(1) : null} extra={classificacao} />
    </div>
  )
}

function CalcTMB() {
  const [peso, setPeso]     = useCalcField()
  const [altura, setAltura] = useCalcField()
  const [idade, setIdade]   = useCalcField()
  const [sexo, setSexo]     = useState('M')

  const tmb = peso && altura && idade ? (
    sexo === 'M'
      ? 10 * Number(peso) + 6.25 * Number(altura) - 5 * Number(idade) + 5
      : 10 * Number(peso) + 6.25 * Number(altura) - 5 * Number(idade) - 161
  ) : null

  const NIVEIS = [
    { label: 'Sedentário',          fator: 1.2  },
    { label: 'Leve (1-3x/sem)',     fator: 1.375 },
    { label: 'Moderado (3-5x/sem)', fator: 1.55  },
    { label: 'Intenso (6-7x/sem)', fator: 1.725 },
    { label: 'Atleta',              fator: 1.9   },
  ]

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-gray-400 px-1">Taxa Metabólica Basal (Mifflin-St Jeor)</p>
      <div className="flex gap-2">
        {['M', 'F'].map((s) => (
          <button key={s} type="button" onClick={() => setSexo(s)}
            className={`flex-1 py-2.5 rounded-2xl text-sm font-bold transition-colors ${sexo === s ? 'bg-[#0056D2] text-white' : 'bg-white text-gray-400 shadow-sm'}`}>
            {s === 'M' ? 'Masculino' : 'Feminino'}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2">
        <Field label="Peso (kg)"   type="number" step="0.1" placeholder="75"  value={peso}   onChange={(e) => setPeso(e.target.value)} />
        <Field label="Altura (cm)" type="number" placeholder="175" value={altura} onChange={(e) => setAltura(e.target.value)} />
        <Field label="Idade"       type="number" placeholder="30"  value={idade}  onChange={(e) => setIdade(e.target.value)} />
      </div>

      {tmb && (
        <>
          <CalcCard titulo="TMB (kcal/dia)" resultado={Math.round(tmb).toString()} extra="Calorias em repouso total" />
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wide px-1">TDEE por nível de atividade</p>
          <div className="bg-white rounded-2xl shadow-sm px-4 py-3 flex flex-col gap-2">
            {NIVEIS.map(({ label, fator }) => (
              <div key={label} className="flex justify-between items-center">
                <p className="text-xs text-gray-600">{label}</p>
                <p className="text-sm font-bold text-gray-800">{Math.round(tmb * fator)} kcal</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function Calc1RM() {
  const [carga, setCarga] = useCalcField()
  const [reps, setReps]   = useCalcField()

  const rm = carga && reps && Number(reps) > 0
    ? Number(carga) * (1 + Number(reps) / 30)
    : null

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-gray-400 px-1">Repetição Máxima (fórmula de Epley)</p>
      <Field label="Carga usada (kg)" type="number" step="0.5" min="0" placeholder="ex: 60" value={carga} onChange={(e) => setCarga(e.target.value)} />
      <Field label="Repetições realizadas" type="number" min="1" max="30" placeholder="ex: 8" value={reps} onChange={(e) => setReps(e.target.value)} />
      <CalcCard titulo="1RM estimado" resultado={rm ? `${rm.toFixed(1)} kg` : null}
        extra={rm ? `75% = ${(rm * 0.75).toFixed(1)}kg · 80% = ${(rm * 0.8).toFixed(1)}kg · 85% = ${(rm * 0.85).toFixed(1)}kg` : null} />
    </div>
  )
}

function CalcGordura() {
  const [sexo, setSexo]       = useState('M')
  const [peso, setPeso]       = useCalcField()
  const [altura, setAltura]   = useCalcField()
  const [pescoco, setPescoco] = useCalcField()
  const [cintura, setCintura] = useCalcField()
  const [quadril, setQuadril] = useCalcField()

  const gordura = (() => {
    if (!altura || !pescoco || !cintura) return null
    const h = Number(altura), n = Number(pescoco), w = Number(cintura), hip = Number(quadril)
    if (sexo === 'M') {
      if (!h || !n || !w) return null
      return 495 / (1.0324 - 0.19077 * Math.log10(w - n) + 0.15456 * Math.log10(h)) - 450
    } else {
      if (!h || !n || !w || !hip) return null
      return 495 / (1.29579 - 0.35004 * Math.log10(w + hip - n) + 0.22100 * Math.log10(h)) - 450
    }
  })()

  const massaMagra = gordura && peso ? Number(peso) * (1 - gordura / 100) : null

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-gray-400 px-1">% de Gordura Corporal (U.S. Navy)</p>
      <div className="flex gap-2">
        {['M', 'F'].map((s) => (
          <button key={s} type="button" onClick={() => setSexo(s)}
            className={`flex-1 py-2.5 rounded-2xl text-sm font-bold transition-colors ${sexo === s ? 'bg-[#0056D2] text-white' : 'bg-white text-gray-400 shadow-sm'}`}>
            {s === 'M' ? 'Masculino' : 'Feminino'}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Field label="Altura (cm)" type="number" placeholder="175" value={altura} onChange={(e) => setAltura(e.target.value)} />
        <Field label="Peso (kg)"   type="number" step="0.1" placeholder="75" value={peso} onChange={(e) => setPeso(e.target.value)} />
        <Field label="Pescoço (cm)" type="number" step="0.1" placeholder="37" value={pescoco} onChange={(e) => setPescoco(e.target.value)} />
        <Field label="Cintura (cm)" type="number" step="0.1" placeholder="80" value={cintura} onChange={(e) => setCintura(e.target.value)} />
        {sexo === 'F' && (
          <Field label="Quadril (cm)" type="number" step="0.1" placeholder="95" value={quadril} onChange={(e) => setQuadril(e.target.value)} />
        )}
      </div>
      {gordura !== null && gordura > 0 && (
        <CalcCard titulo="Gordura Corporal" resultado={`${gordura.toFixed(1)}%`}
          extra={massaMagra ? `Massa magra estimada: ${massaMagra.toFixed(1)} kg` : null} />
      )}
    </div>
  )
}

// ── Layout Admin ──────────────────────────────────────────
const TABS = [
  { id: 'alunos',      Icon: Users,       label: 'Alunos'     },
  { id: 'novo',        Icon: UserPlus,    label: 'Novo Aluno' },
  { id: 'treinos',     Icon: Dumbbell,    label: 'Treinos'    },
  { id: 'avaliacoes',  Icon: Ruler,       label: 'Avaliações' },
  { id: 'stats',       Icon: BarChart2,   label: 'Stats'      },
  { id: 'calculadora', Icon: Calculator,  label: 'Calc.'      },
]

export default function Admin() {
  const { logout } = useAuth()
  const [tab, setTab] = useState('alunos')
  const [alunoParaTreino, setAlunoParaTreino] = useState(null)

  function irParaTreinos(aluno) {
    setAlunoParaTreino(aluno)
    setTab('treinos')
  }

  return (
    <div className="min-h-screen bg-[#f0f0f0] flex flex-col">
      {/* Header */}
      <header className="bg-[#0056D2] text-white px-4 h-14 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Dumbbell size={20} />
          <span className="font-extrabold text-base tracking-tight">PowerFit</span>
          <span className="text-xs text-blue-200 font-medium ml-1 bg-white/10 px-2 py-0.5 rounded-full">
            Admin
          </span>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-1.5 text-xs text-white/80 font-semibold px-3 py-1.5 rounded-xl bg-white/10 active:bg-white/20"
        >
          <LogOut size={14} />
          Sair
        </button>
      </header>

      {/* Tab bar — scrollável horizontalmente */}
      <div className="bg-white border-b border-gray-100 flex overflow-x-auto shrink-0 scrollbar-none">
        {TABS.map(({ id, Icon, label }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex flex-col items-center gap-0.5 py-2.5 px-4 text-[10px] font-bold uppercase tracking-wide transition-colors shrink-0 ${
              tab === id
                ? 'text-[#0056D2] border-b-2 border-[#0056D2]'
                : 'text-gray-400'
            }`}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <main className="flex-1 overflow-y-auto">
        {tab === 'alunos'      && <TabAlunos onGerenciarTreinos={irParaTreinos} />}
        {tab === 'novo'        && <TabNovoAluno onSuccess={() => setTab('alunos')} />}
        {tab === 'treinos'     && <TabTreinos key={alunoParaTreino?.id ?? 'none'} alunoInicial={alunoParaTreino} />}
        {tab === 'avaliacoes'  && <TabAvaliacoes />}
        {tab === 'stats'       && <TabStats />}
        {tab === 'calculadora' && <TabCalculadora />}
      </main>
    </div>
  )
}
