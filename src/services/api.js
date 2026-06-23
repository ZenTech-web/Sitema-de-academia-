const BASE = 'https://powerfit-backend-kqxn.onrender.com/api'

const TOKEN_KEY = 'powerfit_token'

function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

async function request(path, options = {}) {
  const token = getToken()

  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  // Sessão expirada — força logout
  if (res.status === 401) {
    localStorage.removeItem(TOKEN_KEY)
    window.location.href = '/'
    throw new Error('Sessão expirada')
  }

  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Erro na requisição')
  return data
}

export const api = {
  // ── Auth ────────────────────────────────────────────────
  login: (email, senha) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ email, senha }) }),

  // ── Perfil do aluno logado ──────────────────────────────
  getMe: () => request('/me'),

  // ── Treinos do aluno ────────────────────────────────────
  getMeusTreinos: () => request('/me/treinos'),
  getMeuTreino:   (id) => request(`/me/treinos/${id}`),

  // ── Histórico ───────────────────────────────────────────
  registrarSessao: (body) =>
    request('/me/historico', { method: 'POST', body: JSON.stringify(body) }),

  // ── Pagamentos ──────────────────────────────────────────
  getMeusPagamentos: () => request('/me/pagamentos'),

  // ── Biblioteca de exercícios ────────────────────────────
  getExercicios: () => request('/exercicios'),

  // ── Admin ───────────────────────────────────────────────
  admin: {
    getAlunos:        ()      => request('/admin/usuarios'),
    criarAluno:       (body)  => request('/admin/usuarios', { method: 'POST', body: JSON.stringify(body) }),
    getTreinosAluno:  (id)    => request(`/admin/usuarios/${id}/treinos`),
    criarTreinoAluno: (id, b) => request(`/admin/usuarios/${id}/treinos`, { method: 'POST', body: JSON.stringify(b) }),
    getExercicios:    ()      => request('/admin/exercicios'),
  },
}

// ── Helpers de formatação ────────────────────────────────
export function formatCurrency(value) {
  return `R$ ${Number(value).toFixed(2).replace('.', ',')}`
}

export function formatDate(isoString) {
  if (!isoString) return '-'
  const d = new Date(isoString)
  return d.toLocaleDateString('pt-BR')
}
