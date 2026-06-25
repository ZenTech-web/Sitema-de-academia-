import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const AZUL       = '#0056D2'
const CINZA      = '#6B7280'
const CINZA_BG   = '#F3F4F6'
const VERDE      = '#16A34A'
const VERDE_BG   = '#F0FDF4'
const VERMELHO   = '#DC2626'
const VERMELHO_BG= '#FEF2F2'
const BORDA      = '#E5E7EB'

function fmtDate(iso) {
  if (!iso) return '-'
  return new Date(iso).toLocaleDateString('pt-BR', { timeZone: 'UTC' })
}

const s = StyleSheet.create({
  page: { fontFamily: 'Helvetica', fontSize: 9, color: '#111827', backgroundColor: '#F9FAFB' },

  // ── Header ──────────────────────────────────────────────
  header: { backgroundColor: AZUL, padding: '18 24', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  logo: { color: 'white', fontSize: 20, fontFamily: 'Helvetica-Bold' },
  logoSub: { color: 'rgba(255,255,255,0.6)', fontSize: 7, marginTop: 2 },
  hRight: { alignItems: 'flex-end' },
  hTitle: { color: 'white', fontSize: 11, fontFamily: 'Helvetica-Bold' },
  hDate: { color: 'rgba(255,255,255,0.65)', fontSize: 7, marginTop: 2 },

  // ── Body ────────────────────────────────────────────────
  body: { padding: '14 22 60 22' },

  // ── Aluno card ──────────────────────────────────────────
  alunoCard: { backgroundColor: 'white', borderRadius: 8, padding: '14 16', marginBottom: 10, flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: AZUL, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  avatarTxt: { color: 'white', fontFamily: 'Helvetica-Bold', fontSize: 15 },
  alunoInfo: { flex: 1 },
  alunoNome: { fontFamily: 'Helvetica-Bold', fontSize: 14, color: '#111827', marginBottom: 2 },
  alunoSub: { fontSize: 8, color: CINZA, marginBottom: 1 },
  alunoRight: { alignItems: 'flex-end', minWidth: 90 },
  sessoesNum: { fontFamily: 'Helvetica-Bold', fontSize: 18, color: AZUL },
  sessoesSub: { fontSize: 7, color: CINZA, marginBottom: 4 },
  barBg: { width: 90, height: 5, backgroundColor: '#E5E7EB', borderRadius: 3 },
  barFill: { height: 5, backgroundColor: AZUL, borderRadius: 3 },
  barPct: { fontSize: 7, color: CINZA, marginTop: 2, textAlign: 'right' },

  // ── Section label ────────────────────────────────────────
  secLabel: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: CINZA, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 },

  // ── Card genérico ────────────────────────────────────────
  card: { backgroundColor: 'white', borderRadius: 8, padding: '12 14', marginBottom: 10 },
  cardHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: BORDA },
  cardTitle: { fontFamily: 'Helvetica-Bold', fontSize: 10, color: '#111827' },
  cardDate: { fontSize: 7, color: CINZA },

  // ── Medidas grid ─────────────────────────────────────────
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 3 },
  cell: { width: '15.8%', backgroundColor: CINZA_BG, borderRadius: 5, padding: '6 4', alignItems: 'center', marginBottom: 3 },
  cellLabel: { fontSize: 6, color: CINZA, textTransform: 'uppercase', marginBottom: 2 },
  cellVal: { fontFamily: 'Helvetica-Bold', fontSize: 11, color: '#111827' },
  cellUnit: { fontSize: 6, color: CINZA },
  obs: { backgroundColor: '#EEF4FF', borderRadius: 6, padding: '6 10', marginTop: 6 },
  obsTxt: { fontSize: 8, color: '#1D4ED8', fontStyle: 'italic' },

  // ── Evolução ─────────────────────────────────────────────
  evolRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 5, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  evolLabel: { flex: 2.5, fontSize: 8, color: '#374151' },
  evolAnt: { flex: 1.5, fontSize: 8, color: CINZA, textAlign: 'right' },
  evolSeta: { width: 16, textAlign: 'center', fontSize: 8, color: '#D1D5DB' },
  evolAtual: { flex: 1.5, fontFamily: 'Helvetica-Bold', fontSize: 8, color: '#111827', textAlign: 'right' },
  evolDiff: { flex: 1.5, fontSize: 7, fontFamily: 'Helvetica-Bold', textAlign: 'right', paddingLeft: 4 },
  diffPos: { backgroundColor: VERDE_BG, color: VERDE, borderRadius: 10, paddingVertical: 1, paddingHorizontal: 4 },
  diffNeg: { backgroundColor: VERMELHO_BG, color: VERMELHO, borderRadius: 10, paddingVertical: 1, paddingHorizontal: 4 },

  // ── Treino card ──────────────────────────────────────────
  treinoCard: { backgroundColor: 'white', borderRadius: 8, padding: '10 14', marginBottom: 8, borderLeftWidth: 3, borderLeftColor: AZUL },
  treinoHead: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  treinoBadge: { backgroundColor: AZUL, borderRadius: 4, padding: '2 7', marginRight: 8 },
  treinoBadgeTxt: { color: 'white', fontFamily: 'Helvetica-Bold', fontSize: 9 },
  treinoNome: { fontFamily: 'Helvetica-Bold', fontSize: 10, color: '#111827', flex: 1 },
  treinoMusculos: { fontSize: 7, color: CINZA, marginBottom: 7 },
  exRow: { flexDirection: 'row', paddingVertical: 3, borderBottomWidth: 1, borderBottomColor: '#F9FAFB' },
  exNum: { width: 16, fontSize: 7, color: CINZA, fontFamily: 'Helvetica-Bold' },
  exNome: { flex: 1, fontSize: 8, color: '#374151' },
  exSpec: { fontSize: 7, color: CINZA },

  // ── Footer ───────────────────────────────────────────────
  footer: { position: 'absolute', bottom: 14, left: 22, right: 22, flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: BORDA, paddingTop: 5 },
  footerTxt: { fontSize: 7, color: '#9CA3AF' },
})

// ── Componente principal ──────────────────────────────────
export function RelatorioAluno({ aluno, avaliacoes, treinos }) {
  const hoje = new Date().toLocaleDateString('pt-BR')
  const ultima = avaliacoes[0] ?? null
  const anterior = avaliacoes[1] ?? null
  const pct = aluno.sessoesTotal > 0
    ? Math.min(100, (aluno.sessoesRealizadas / aluno.sessoesTotal) * 100)
    : 0

  const medidas = [
    { label: 'Peso',     k: 'peso',        unit: 'kg' },
    { label: 'Altura',   k: 'altura',      unit: 'cm' },
    { label: 'IMC',      k: 'imc',         unit: ''   },
    { label: 'Gordura',  k: 'gordura',     unit: '%'  },
    { label: 'M. Magra', k: 'massaMagra',  unit: 'kg' },
    { label: 'Cintura',  k: 'cintura',     unit: 'cm' },
    { label: 'Quadril',  k: 'quadril',     unit: 'cm' },
    { label: 'Peito',    k: 'peito',       unit: 'cm' },
    { label: 'Braço',    k: 'braco',       unit: 'cm' },
    { label: 'Coxa',     k: 'coxa',        unit: 'cm' },
    { label: 'Pantur.',  k: 'panturrilha', unit: 'cm' },
  ]

  const comparativos = [
    { label: 'Peso',        k: 'peso',       unit: 'kg', inv: true  },
    { label: '% Gordura',   k: 'gordura',    unit: '%',  inv: true  },
    { label: 'Massa Magra', k: 'massaMagra', unit: 'kg', inv: false },
    { label: 'Cintura',     k: 'cintura',    unit: 'cm', inv: true  },
    { label: 'Quadril',     k: 'quadril',    unit: 'cm', inv: true  },
    { label: 'Braço',       k: 'braco',      unit: 'cm', inv: false },
    { label: 'Coxa',        k: 'coxa',       unit: 'cm', inv: false },
  ]

  function getBadge(t) {
    if (t.sigla) return t.sigla
    return t.nome.split(' ').map((w) => w[0] || '').join('').slice(0, 2).toUpperCase()
  }

  return (
    <Document title={`Relatório — ${aluno.nome}`} author="Imperious Fitness">
      <Page size="A4" style={s.page}>

        {/* ── Header ── */}
        <View style={s.header}>
          <View>
            <Text style={s.logo}>Imperious Fitness</Text>
            <Text style={s.logoSub}>Sistema de Gestão de Academia</Text>
          </View>
          <View style={s.hRight}>
            <Text style={s.hTitle}>Relatório do Aluno</Text>
            <Text style={s.hDate}>Gerado em {hoje}</Text>
          </View>
        </View>

        <View style={s.body}>

          {/* ── Card do Aluno ── */}
          <View style={s.alunoCard}>
            <View style={s.avatar}>
              <Text style={s.avatarTxt}>{aluno.iniciais}</Text>
            </View>
            <View style={s.alunoInfo}>
              <Text style={s.alunoNome}>{aluno.nome}</Text>
              {aluno.email    && <Text style={s.alunoSub}>{aluno.email}</Text>}
              {aluno.objetivo && <Text style={s.alunoSub}>Objetivo: {aluno.objetivo}</Text>}
              {aluno.dataInicio && <Text style={s.alunoSub}>Aluno desde {fmtDate(aluno.dataInicio)}</Text>}
            </View>
            <View style={s.alunoRight}>
              <Text style={s.sessoesNum}>{aluno.sessoesRealizadas}<Text style={{ fontSize: 9, color: CINZA }}>/{aluno.sessoesTotal}</Text></Text>
              <Text style={s.sessoesSub}>sessões realizadas</Text>
              <View style={s.barBg}>
                <View style={[s.barFill, { width: `${pct}%` }]} />
              </View>
              <Text style={s.barPct}>{pct.toFixed(0)}% do plano</Text>
            </View>
          </View>

          {/* ── Avaliação Física ── */}
          {ultima ? (
            <>
              <Text style={s.secLabel}>Avaliação Física</Text>
              <View style={s.card}>
                <View style={s.cardHead}>
                  <Text style={s.cardTitle}>Última avaliação</Text>
                  <Text style={s.cardDate}>{fmtDate(ultima.data)}</Text>
                </View>
                <View style={s.grid}>
                  {medidas
                    .filter(({ k }) => ultima[k] !== null && ultima[k] !== undefined)
                    .map(({ label, k, unit }) => (
                      <View key={k} style={s.cell}>
                        <Text style={s.cellLabel}>{label}</Text>
                        <Text style={s.cellVal}>{ultima[k]}</Text>
                        {unit ? <Text style={s.cellUnit}>{unit}</Text> : null}
                      </View>
                    ))}
                </View>
                {ultima.observacao && (
                  <View style={s.obs}>
                    <Text style={s.obsTxt}>"{ultima.observacao}"</Text>
                  </View>
                )}
              </View>
            </>
          ) : (
            <>
              <Text style={s.secLabel}>Avaliação Física</Text>
              <View style={[s.card, { alignItems: 'center', padding: '18 14' }]}>
                <Text style={{ fontSize: 8, color: CINZA }}>Nenhuma avaliação registrada.</Text>
              </View>
            </>
          )}

          {/* ── Evolução ── */}
          {ultima && anterior && (
            <>
              <Text style={s.secLabel}>Evolução</Text>
              <View style={s.card}>
                <View style={s.cardHead}>
                  <Text style={s.cardTitle}>Comparativo de avaliações</Text>
                  <Text style={s.cardDate}>{fmtDate(anterior.data)} → {fmtDate(ultima.data)}</Text>
                </View>
                {comparativos
                  .filter(({ k }) => anterior[k] !== null && ultima[k] !== null)
                  .map(({ label, k, unit, inv }) => {
                    const diff = Number(ultima[k]) - Number(anterior[k])
                    const positivo = inv ? diff < 0 : diff > 0
                    return (
                      <View key={k} style={s.evolRow}>
                        <Text style={s.evolLabel}>{label}</Text>
                        <Text style={s.evolAnt}>{anterior[k]}{unit}</Text>
                        <Text style={s.evolSeta}>→</Text>
                        <Text style={s.evolAtual}>{ultima[k]}{unit}</Text>
                        {diff !== 0 ? (
                          <Text style={[s.evolDiff, positivo ? s.diffPos : s.diffNeg]}>
                            {diff > 0 ? '+' : ''}{diff.toFixed(1)}
                          </Text>
                        ) : (
                          <Text style={s.evolDiff} />
                        )}
                      </View>
                    )
                  })}
              </View>
            </>
          )}

          {/* ── Treinos ── */}
          {treinos.length > 0 && (
            <>
              <Text style={s.secLabel}>Plano de Treinos ({treinos.length} treino(s))</Text>
              {treinos.map((t) => (
                <View key={t.id} style={s.treinoCard} wrap={false}>
                  <View style={s.treinoHead}>
                    <View style={s.treinoBadge}>
                      <Text style={s.treinoBadgeTxt}>{getBadge(t)}</Text>
                    </View>
                    <Text style={s.treinoNome}>{t.nome}</Text>
                    <Text style={{ fontSize: 7, color: CINZA }}>{t.exercicios?.length ?? 0} exercícios</Text>
                  </View>
                  {t.musculos?.length > 0 && (
                    <Text style={s.treinoMusculos}>{t.musculos.join(' / ')}</Text>
                  )}
                  {(t.exercicios ?? []).map((te, i) => (
                    <View key={te.id ?? i} style={s.exRow}>
                      <Text style={s.exNum}>{i + 1}.</Text>
                      <Text style={s.exNome}>{te.exercicio?.nome ?? '—'}</Text>
                      <Text style={s.exSpec}>
                        {te.series}x{te.repeticoes}{te.carga ? ` · ${te.carga}kg` : ''}
                      </Text>
                    </View>
                  ))}
                </View>
              ))}
            </>
          )}

        </View>

        {/* ── Footer fixo ── */}
        <View style={s.footer} fixed>
          <Text style={s.footerTxt}>Imperious Fitness — Relatório Confidencial · {aluno.nome}</Text>
          <Text style={s.footerTxt} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
        </View>

      </Page>
    </Document>
  )
}
