require('./candidates/v0.2.1.cjs').applyCandidate();

const fs = require('node:fs');
const path = require('node:path');
const {
  MICRO_DECREES,
  simulateGame,
  seededRandom,
} = require('./engine.cjs');

const RUNS = Number(process.env.DEMONLORD_RUNS ?? 20000);

function summarize(games) {
  const completed = games.filter((game) => game.ended);
  const wins = Object.fromEntries(MICRO_DECREES.map((decree) => [decree.id, 0]));
  const appearances = Object.fromEntries(
    MICRO_DECREES.map((decree) => [decree.id, 0])
  );
  games.forEach((game) => {
    game.dealtDecrees.forEach((id) => appearances[id] += 1);
    if (game.winnerDecree) wins[game.winnerDecree] += 1;
  });
  return {
    completionRate: completed.length / games.length,
    meanRounds:
      completed.reduce((sum, game) => sum + game.round, 0) / completed.length,
    gamesWithTradeRate: games.filter((game) => game.trades > 0).length / games.length,
    meanTrades: games.reduce((sum, game) => sum + game.trades, 0) / games.length,
    winnerTradedRate:
      completed.filter((game) => game.winnerTraded).length / completed.length,
    comebackRate:
      completed.filter((game) => !game.initialLeaderWon).length / completed.length,
    leadChangeRate:
      games.filter((game) => game.leadChanges > 0).length / games.length,
    decreeWinRates: Object.fromEntries(
      MICRO_DECREES.map((decree) => [
        decree.id,
        wins[decree.id] / appearances[decree.id],
      ])
    ),
  };
}

const withoutNegotiation = [];
const withNegotiation = [];
const slowerWithoutNegotiation = [];
const slowerWithNegotiation = [];
let changedWinner = 0;
let comparableGames = 0;
let slowerChangedWinner = 0;
let slowerComparableGames = 0;

for (let index = 0; index < RUNS; index += 1) {
  const seed = 0xDEC0DE + index;
  const control = simulateGame(4, seededRandom(seed));
  const negotiated = simulateGame(4, seededRandom(seed), 20, {
    allowNegotiation: true,
  });
  const slowerControl = simulateGame(4, seededRandom(seed), 20, {
    maxRecruitmentsPerTurn: 1,
  });
  const slowerNegotiated = simulateGame(4, seededRandom(seed), 20, {
    allowNegotiation: true,
    maxRecruitmentsPerTurn: 1,
  });
  withoutNegotiation.push(control);
  withNegotiation.push(negotiated);
  slowerWithoutNegotiation.push(slowerControl);
  slowerWithNegotiation.push(slowerNegotiated);
  if (control.ended && negotiated.ended) {
    comparableGames += 1;
    if (control.winnerPlayerId !== negotiated.winnerPlayerId) changedWinner += 1;
  }
  if (slowerControl.ended && slowerNegotiated.ended) {
    slowerComparableGames += 1;
    if (slowerControl.winnerPlayerId !== slowerNegotiated.winnerPlayerId) {
      slowerChangedWinner += 1;
    }
  }
}

const report = {
  profile: 'v0.2.1',
  runs: RUNS,
  assumptions: [
    'Bots conhecem o valor que cada Raça possui para o outro jogador durante a proposta.',
    'Somente trocas de uma Raça por uma Raça são consideradas.',
    'A troca custa uma ação do jogador ativo e é limitada a uma por turno.',
    'Ambos só aceitam quando seu progresso estimado melhora.',
  ],
  withoutNegotiation: summarize(withoutNegotiation),
  withNegotiation: summarize(withNegotiation),
  changedWinnerRate: changedWinner / comparableGames,
  oneRecruitPerTurn: {
    withoutNegotiation: summarize(slowerWithoutNegotiation),
    withNegotiation: summarize(slowerWithNegotiation),
    changedWinnerRate: slowerChangedWinner / slowerComparableGames,
  },
};

const pct = (value) => `${(value * 100).toFixed(1)}%`;
const lines = [
  '# DemonLord — impacto inicial da negociação v0.2.1',
  '',
  `${RUNS.toLocaleString('pt-BR')} pares de partidas com quatro jogadores e a mesma ordem inicial de cartas.`,
  '',
  '| Métrica | Sem negociação | Com negociação |',
  '|---|---:|---:|',
  `| Partidas concluídas | ${pct(report.withoutNegotiation.completionRate)} | ${pct(report.withNegotiation.completionRate)} |`,
  `| Rodadas médias | ${report.withoutNegotiation.meanRounds.toFixed(2)} | ${report.withNegotiation.meanRounds.toFixed(2)} |`,
  `| Vencedor não liderava após a 1ª rodada | ${pct(report.withoutNegotiation.comebackRate)} | ${pct(report.withNegotiation.comebackRate)} |`,
  `| Houve mudança de liderança | ${pct(report.withoutNegotiation.leadChangeRate)} | ${pct(report.withNegotiation.leadChangeRate)} |`,
  `| Partidas com ao menos uma troca | — | ${pct(report.withNegotiation.gamesWithTradeRate)} |`,
  `| Vencedor participou de uma troca | — | ${pct(report.withNegotiation.winnerTradedRate)} |`,
  '',
  `A negociação mudou a identidade do vencedor em **${pct(report.changedWinnerRate)}** dos pares comparáveis.`,
  '',
  '## Cenário com no máximo um recrutamento por turno',
  '',
  '| Métrica | Sem negociação | Com negociação |',
  '|---|---:|---:|',
  `| Partidas concluídas | ${pct(report.oneRecruitPerTurn.withoutNegotiation.completionRate)} | ${pct(report.oneRecruitPerTurn.withNegotiation.completionRate)} |`,
  `| Rodadas médias | ${report.oneRecruitPerTurn.withoutNegotiation.meanRounds.toFixed(2)} | ${report.oneRecruitPerTurn.withNegotiation.meanRounds.toFixed(2)} |`,
  `| Vencedor não liderava após a 1ª rodada | ${pct(report.oneRecruitPerTurn.withoutNegotiation.comebackRate)} | ${pct(report.oneRecruitPerTurn.withNegotiation.comebackRate)} |`,
  `| Partidas com ao menos uma troca | — | ${pct(report.oneRecruitPerTurn.withNegotiation.gamesWithTradeRate)} |`,
  `| Vencedor participou de uma troca | — | ${pct(report.oneRecruitPerTurn.withNegotiation.winnerTradedRate)} |`,
  '',
  `Com o ritmo reduzido, a negociação mudou o vencedor em **${pct(report.oneRecruitPerTurn.changedWinnerRate)}** dos pares comparáveis.`,
  '',
  '## Hipóteses desta simulação',
  '',
  ...report.assumptions.map((assumption) => `- ${assumption}`),
  '',
  'Este é um teto otimista para acordos racionais. Blefe, promessas, Itens e kingmaking ainda exigem playtest humano.',
  '',
];

const reportsDir = path.join(__dirname, 'reports');
fs.mkdirSync(reportsDir, { recursive: true });
fs.writeFileSync(
  path.join(reportsDir, 'negotiation-v0.2.1.json'),
  `${JSON.stringify(report, null, 2)}\n`
);
fs.writeFileSync(
  path.join(reportsDir, 'negotiation-v0.2.1.md'),
  `${lines.join('\n')}\n`
);
console.log(lines.join('\n'));
