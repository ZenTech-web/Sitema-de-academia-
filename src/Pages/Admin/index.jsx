import { useState, useEffect } from 'react'
import { Users, UserPlus, Dumbbell, LogOut, Check, ChevronDown } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../services/api'

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

  const grupos = [...new Set(exerciciosDisp.map((e) => e.grupo))].sort()

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
                <div className="flex flex-col gap-2">
                  {grupos.map((grupo) => (
                    <div key={grupo}>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold px-1 mb-1">
                        {grupo}
                      </p>
                      {exerciciosDisp.filter((e) => e.grupo === grupo).map((ex) => (
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

// ── Layout Admin ──────────────────────────────────────────
const TABS = [
  { id: 'alunos',  Icon: Users,    label: 'Alunos'     },
  { id: 'novo',    Icon: UserPlus, label: 'Novo Aluno' },
  { id: 'treinos', Icon: Dumbbell, label: 'Treinos'    },
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

      {/* Tab bar */}
      <div className="bg-white border-b border-gray-100 flex shrink-0">
        {TABS.map(({ id, Icon, label }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-bold uppercase tracking-wide transition-colors ${
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
        {tab === 'alunos'  && <TabAlunos onGerenciarTreinos={irParaTreinos} />}
        {tab === 'novo'    && <TabNovoAluno onSuccess={() => setTab('alunos')} />}
        {tab === 'treinos' && (
          <TabTreinos key={alunoParaTreino?.id ?? 'none'} alunoInicial={alunoParaTreino} />
        )}
      </main>
    </div>
  )
}
