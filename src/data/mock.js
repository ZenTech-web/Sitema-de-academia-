// ─── Biblioteca completa de exercícios ───────────────────────────────────────
// gifUrl aponta para /public/gifs/ (servidos estáticos, funciona offline via PWA)
// Migração para Firebase: cada doc em /exercicios/{id}
export const bibliotecaExercicios = {
  remada_convergente:   { id: 'remada_convergente',   nome: 'Remada Convergente',         grupo: 'Costas',     gifUrl: '/gifs/remada_convergente.gif' },
  remada_baixa:         { id: 'remada_baixa',         nome: 'Remada Baixa',               grupo: 'Costas',     gifUrl: '/gifs/remada_baixa.gif' },
  puxada_alta_aberta:   { id: 'puxada_alta_aberta',   nome: 'Puxada Alta Aberta',         grupo: 'Costas',     gifUrl: '/gifs/puxada_alta_aberta.gif' },
  pull_down:            { id: 'pull_down',            nome: 'Pull Down',                  grupo: 'Costas',     gifUrl: '/gifs/pull_down.gif' },
  triceps_pulley:       { id: 'triceps_pulley',       nome: 'Tríceps Pulley',             grupo: 'Tríceps',    gifUrl: '/gifs/triceps_pulley.gif' },
  triceps_frances:      { id: 'triceps_frances',      nome: 'Tríceps Francês',            grupo: 'Tríceps',    gifUrl: '/gifs/triceps_frances.gif' },
  abdominal_crunch:     { id: 'abdominal_crunch',     nome: 'Abdominal Crunch',           grupo: 'Abdome',     gifUrl: '/gifs/abdominal_crunch.gif' },
  abdominal_infra:      { id: 'abdominal_infra',      nome: 'Abdominal Infra',            grupo: 'Abdome',     gifUrl: '/gifs/abdominal_infra.gif' },
  prancha:              { id: 'prancha',              nome: 'Prancha',                    grupo: 'Abdome',     gifUrl: '/gifs/prancha.gif' },
  hiperextensao_lombar: { id: 'hiperextensao_lombar', nome: 'Hiperextensão Lombar',       grupo: 'Costas',     gifUrl: '/gifs/hiperextensao_lombar.gif' },
  desenvolvimento_halteres: { id: 'desenvolvimento_halteres', nome: 'Desenvolvimento com Halteres', grupo: 'Ombro', gifUrl: '/gifs/desenvolvimento_halteres.gif' },
  elevacao_lateral:     { id: 'elevacao_lateral',     nome: 'Elevação Lateral',           grupo: 'Ombro',      gifUrl: '/gifs/elevacao_lateral.gif' },
  elevacao_frontal:     { id: 'elevacao_frontal',     nome: 'Elevação Frontal',           grupo: 'Ombro',      gifUrl: '/gifs/elevacao_frontal.gif' },
  panturrilha_smith:    { id: 'panturrilha_smith',    nome: 'Panturrilha no Smith',       grupo: 'Panturrilha',gifUrl: '/gifs/panturrilha_smith.gif' },
  panturrilha_sentado:  { id: 'panturrilha_sentado',  nome: 'Panturrilha Sentado',        grupo: 'Panturrilha',gifUrl: '/gifs/panturrilha_sentado.gif' },
  leg_press:            { id: 'leg_press',            nome: 'Leg Press',                  grupo: 'Perna',      gifUrl: '/gifs/leg_press.gif' },
  cadeira_extensora:    { id: 'cadeira_extensora',    nome: 'Cadeira Extensora',          grupo: 'Perna',      gifUrl: '/gifs/cadeira_extensora.gif' },
  cadeira_flexora:      { id: 'cadeira_flexora',      nome: 'Cadeira Flexora',            grupo: 'Perna',      gifUrl: '/gifs/cadeira_flexora.gif' },
  agachamento_livre:    { id: 'agachamento_livre',    nome: 'Agachamento Livre',          grupo: 'Perna',      gifUrl: '/gifs/agachamento_livre.gif' },
  stiff:                { id: 'stiff',                nome: 'Stiff',                      grupo: 'Perna',      gifUrl: '/gifs/stiff.gif' },
  rosca_direta:         { id: 'rosca_direta',         nome: 'Rosca Direta',               grupo: 'Bíceps',     gifUrl: '/gifs/rosca_direta.gif' },
  rosca_martelo:        { id: 'rosca_martelo',        nome: 'Rosca Martelo',              grupo: 'Bíceps',     gifUrl: '/gifs/rosca_martelo.gif' },
  rosca_concentrada:    { id: 'rosca_concentrada',    nome: 'Rosca Concentrada',          grupo: 'Bíceps',     gifUrl: '/gifs/rosca_concentrada.gif' },
  supino_reto:          { id: 'supino_reto',          nome: 'Supino Reto',                grupo: 'Peito',      gifUrl: '/gifs/supino_reto.gif' },
  supino_inclinado:     { id: 'supino_inclinado',     nome: 'Supino Inclinado',           grupo: 'Peito',      gifUrl: '/gifs/supino_inclinado.gif' },
  crossover:            { id: 'crossover',            nome: 'Crossover',                  grupo: 'Peito',      gifUrl: '/gifs/crossover.gif' },
}

// ─── Planos por aluno ─────────────────────────────────────────────────────────
// Cada treino: nome livre + exerciciosIds[] da biblioteca + config por exercício
// Migração: /usuarios/{uid}/treinos/{treinoId}/exercicios/{exId}
const planosWilner = [
  {
    id: 'treino_a',
    nome: 'Treino A',
    musculos: ['Abdome', 'Costas', 'Tríceps'],
    exercicios: [
      { exId: 'remada_convergente', series: 3, repeticoes: 15, carga: '-' },
      { exId: 'remada_baixa',       series: 3, repeticoes: 15, carga: '-' },
      { exId: 'puxada_alta_aberta', series: 3, repeticoes: 15, carga: '-' },
      { exId: 'pull_down',          series: 3, repeticoes: 15, carga: '-' },
      { exId: 'triceps_pulley',     series: 3, repeticoes: 15, carga: '-' },
      { exId: 'triceps_frances',    series: 3, repeticoes: 15, carga: '-' },
      { exId: 'abdominal_crunch',   series: 3, repeticoes: 20, carga: '-' },
      { exId: 'hiperextensao_lombar', series: 3, repeticoes: 15, carga: '-' },
    ],
  },
  {
    id: 'treino_b',
    nome: 'Treino B',
    musculos: ['Ombro', 'Panturrilha', 'Perna'],
    exercicios: [
      { exId: 'desenvolvimento_halteres', series: 3, repeticoes: 15, carga: '-' },
      { exId: 'elevacao_lateral',         series: 3, repeticoes: 15, carga: '-' },
      { exId: 'elevacao_frontal',         series: 3, repeticoes: 15, carga: '-' },
      { exId: 'panturrilha_smith',        series: 4, repeticoes: 20, carga: '-' },
      { exId: 'panturrilha_sentado',      series: 3, repeticoes: 20, carga: '-' },
      { exId: 'leg_press',               series: 4, repeticoes: 12, carga: '-' },
      { exId: 'cadeira_extensora',        series: 3, repeticoes: 15, carga: '-' },
      { exId: 'cadeira_flexora',          series: 3, repeticoes: 15, carga: '-' },
      { exId: 'agachamento_livre',        series: 4, repeticoes: 12, carga: '-' },
      { exId: 'stiff',                   series: 3, repeticoes: 12, carga: '-' },
    ],
  },
  {
    id: 'treino_c',
    nome: 'Treino C',
    musculos: ['Abdome', 'Bíceps', 'Peito'],
    exercicios: [
      { exId: 'abdominal_infra',    series: 3, repeticoes: 20, carga: '-' },
      { exId: 'prancha',            series: 3, repeticoes: 30, carga: '-' },
      { exId: 'rosca_direta',       series: 3, repeticoes: 15, carga: '-' },
      { exId: 'rosca_martelo',      series: 3, repeticoes: 15, carga: '-' },
      { exId: 'rosca_concentrada',  series: 3, repeticoes: 12, carga: '-' },
      { exId: 'supino_reto',        series: 4, repeticoes: 12, carga: '-' },
      { exId: 'supino_inclinado',   series: 3, repeticoes: 12, carga: '-' },
      { exId: 'crossover',          series: 3, repeticoes: 15, carga: '-' },
    ],
  },
]

// ─── Alunos cadastrados ───────────────────────────────────────────────────────
// Migração: /usuarios/{uid}
export const estudantes = [
  {
    id: 'u1',
    nome: 'Wilner Victor Santos',
    iniciais: 'WV',
    faturasPendentes: 'R$ 0,00',
    sessoesRealizadas: 13,
    sessoesTotal: 90,
    objetivo: 'Hipertrofia',
    dataInicio: '06/07/2025',
    ultimoTreinoId: 'treino_a',
    proximoTreinoId: 'treino_b',
    treinos: planosWilner,
  },
  {
    id: 'u2',
    nome: 'João Pedro Silva',
    iniciais: 'JP',
    faturasPendentes: 'R$ 150,00',
    sessoesRealizadas: 5,
    sessoesTotal: 60,
    objetivo: 'Emagrecimento',
    dataInicio: '01/06/2025',
    ultimoTreinoId: 'treino_a',
    proximoTreinoId: 'treino_b',
    treinos: planosWilner,
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────
export function getEstudanteById(id) {
  return estudantes.find((e) => e.id === id) ?? null
}

export function getTreinoById(estudante, treinoId) {
  return estudante?.treinos.find((t) => t.id === treinoId) ?? null
}

// Expande exerciciosIds com dados completos da biblioteca
export function getExerciciosDoTreino(treino) {
  if (!treino) return []
  return treino.exercicios.map((cfg) => ({
    ...bibliotecaExercicios[cfg.exId],
    series: cfg.series,
    repeticoes: cfg.repeticoes,
    carga: cfg.carga,
  }))
}
