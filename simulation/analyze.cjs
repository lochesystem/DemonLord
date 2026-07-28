const fs = require('node:fs');
const path = require('node:path');
const PROFILE = process.env.DEMONLORD_PROFILE ?? 'v0.2';
if (PROFILE === 'v0.2.1') {
  require('./candidates/v0.2.1.cjs').applyCandidate();
}
const {
  MICRO_RACES_BASE,
  MICRO_DECREES,
  aggregateArmy,
  satisfies,
  simulateGame,
  seededRandom,
} = require('./engine.cjs');

const RUNS_PER_PLAYER_COUNT = Number(process.env.DEMONLORD_RUNS ?? 10000);
const MAX_BUDGET = Math.max(...MICRO_DECREES.map((decree) => decree.budget));

function exactFeasibility() {
  const results = Object.fromEntries(MICRO_DECREES.map((decree) => [
    decree.id,
    {
      id: decree.id,
      name: decree.name,
      budget: decree.budget,
      solutions: 0,
      minCost: Infinity,
      minCards: Infinity,
      example: null,
      closestDistance: Infinity,
      closest: null,
    },
  ]));
  const army = [];

  function distance(decree, totals) {
    const spec = require('./decrees.cjs').DECREE_SPECS[decree.id];
    if (totals.cost > decree.budget) return Infinity;
    let value = 0;
    for (const [field, target] of Object.entries(spec.min ?? {})) {
      value += Math.max(0, target - totals[field]) / target;
    }
    for (const [field, target] of Object.entries(spec.max ?? {})) {
      value += Math.max(0, totals[field] - target) / Math.max(target, 1);
    }
    for (const [trait, target] of Object.entries(spec.traitMin ?? {})) {
      value += Math.max(0, target - (totals.traits[trait] ?? 0)) / target;
    }
    return value;
  }

  function visit(index, cost) {
    if (cost > MAX_BUDGET) return;
    if (index === MICRO_RACES_BASE.length) {
      if (!army.length) return;
      const totals = aggregateArmy(army);
      for (const decree of MICRO_DECREES) {
        const result = results[decree.id];
        const missDistance = distance(decree, totals);
        if (
          missDistance < result.closestDistance ||
          (missDistance === result.closestDistance &&
            totals.cost < (result.closest?.cost ?? Infinity))
        ) {
          result.closestDistance = missDistance;
          result.closest = {
            cost: totals.cost,
            cards: totals.cards,
            pv: totals.pv,
            atk: totals.atk,
            int: totals.int,
            races: army.map((card) => card.name),
          };
        }
        if (!satisfies(decree, totals)) continue;
        result.solutions += 1;
        if (
          totals.cost < result.minCost ||
          (totals.cost === result.minCost && totals.cards < result.minCards)
        ) {
          result.minCost = totals.cost;
          result.minCards = totals.cards;
          result.example = army.map((card) => card.name);
        }
      }
      return;
    }

    const race = MICRO_RACES_BASE[index];
    visit(index + 1, cost);
    army.push(race);
    visit(index + 1, cost + race.cost);
    army.push(race);
    visit(index + 1, cost + race.cost * 2);
    army.pop();
    army.pop();
  }

  visit(0, 0);
  return Object.values(results).map((result) => ({
    ...result,
    feasible: result.solutions > 0,
    minCost: Number.isFinite(result.minCost) ? result.minCost : null,
    minCards: Number.isFinite(result.minCards) ? result.minCards : null,
    closestDistance: Number.isFinite(result.closestDistance)
      ? result.closestDistance
      : null,
  }));
}

function percentile(values, ratio) {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor((sorted.length - 1) * ratio)];
}

function monteCarlo(playerCount, runs, seed) {
  const rng = seededRandom(seed);
  const games = [];
  const winsByDecree = Object.fromEntries(MICRO_DECREES.map((decree) => [decree.id, 0]));
  const appearancesByDecree = Object.fromEntries(
    MICRO_DECREES.map((decree) => [decree.id, 0])
  );
  for (let index = 0; index < runs; index += 1) {
    const result = simulateGame(playerCount, rng);
    games.push(result);
    for (const decreeId of result.dealtDecrees) appearancesByDecree[decreeId] += 1;
    if (result.winnerDecree) winsByDecree[result.winnerDecree] += 1;
  }
  const completed = games.filter((game) => game.ended);
  const rounds = completed.map((game) => game.round);
  return {
    playerCount,
    runs,
    completionRate: completed.length / runs,
    rounds: {
      median: percentile(rounds, 0.5),
      p90: percentile(rounds, 0.9),
      mean: rounds.length
        ? rounds.reduce((sum, value) => sum + value, 0) / rounds.length
        : null,
    },
    noRecruitRoundRate:
      games.filter((game) => game.noRecruitRounds > 0).length / runs,
    winsByDecree,
    appearancesByDecree,
  };
}

function pct(value) {
  return `${(value * 100).toFixed(1)}%`;
}

function buildMarkdown(report) {
  const lines = [
    `# DemonLord — relatório automático ${report.profile}`,
    '',
    `Gerado em ${report.generatedAt}.`,
    '',
    '> Escopo: atributos, contratos, orçamento, mercado de 6 Raças e recrutamento por bots.',
    '> Itens, habilidades de Raça, negociação, sabotagem e leitura humana ainda não entram nesta linha de base.',
    '',
    '## Viabilidade exata dos Decretos',
    '',
    '| Decreto | Possível | Soluções | Menor Verba | Menos Raças | Exemplo mínimo |',
    '|---|---:|---:|---:|---:|---|',
  ];
  for (const result of report.feasibility) {
    const example = result.feasible
      ? result.example?.join(', ')
      : result.closest
        ? `${result.closest.races.join(', ')} (${result.closest.cost}◆; ` +
          `PV ${result.closest.pv}, ATK ${result.closest.atk}, INT ${result.closest.int})`
        : '—';
    lines.push(
      `| ${result.id} — ${result.name} | ${result.feasible ? 'Sim' : 'NÃO'} | ` +
      `${result.solutions.toLocaleString('pt-BR')} | ${result.minCost ?? '—'}◆ | ` +
      `${result.minCards ?? '—'} | ${example} |`
    );
  }
  lines.push('', '## Partidas-bot', '');
  lines.push('| Jogadores | Partidas | Conclusão | Rodadas média | Mediana | P90 | Alguma rodada sem recrutar |');
  lines.push('|---:|---:|---:|---:|---:|---:|---:|');
  for (const run of report.simulations) {
    lines.push(
      `| ${run.playerCount} | ${run.runs.toLocaleString('pt-BR')} | ${pct(run.completionRate)} | ` +
      `${run.rounds.mean?.toFixed(2) ?? '—'} | ${run.rounds.median ?? '—'} | ` +
      `${run.rounds.p90 ?? '—'} | ${pct(run.noRecruitRoundRate)} |`
    );
  }
  lines.push('', '### Taxa de vitória quando o Decreto foi distribuído', '');
  lines.push('| Decreto | 3 jogadores | 4 jogadores | 5 jogadores |');
  lines.push('|---|---:|---:|---:|');
  for (const decree of MICRO_DECREES) {
    const cells = report.simulations.map((run) =>
      pct(run.winsByDecree[decree.id] / run.appearancesByDecree[decree.id])
    );
    lines.push(`| ${decree.id} — ${decree.name} | ${cells.join(' | ')} |`);
  }
  lines.push(
    '',
    '## Como interpretar',
    '',
    '- Muitas soluções matemáticas não significam necessariamente um Decreto fácil: a oferta do mercado também importa.',
    '- A taxa de vitória de cada Decreto considera apenas as partidas em que ele foi distribuído e inclui a competição pelos mesmos monstros.',
    '- Bots não blefam e não negociam. Os números servem para localizar assimetrias grosseiras, não para declarar o balanceamento final.',
    PROFILE === 'v0.2'
      ? '- Cartas com efeito `—` e efeitos ainda descritos apenas em texto precisam ser estruturados antes da segunda fase.'
      : '- O perfil v0.2.1 já estrutura todas as habilidades; efeitos interativos ainda entram gradualmente no motor.',
    ''
  );
  return lines.join('\n');
}

const report = {
  profile: PROFILE,
  generatedAt: new Date().toISOString(),
  runsPerPlayerCount: RUNS_PER_PLAYER_COUNT,
  feasibility: exactFeasibility(),
  simulations: [3, 4, 5].map((players, index) =>
    monteCarlo(players, RUNS_PER_PLAYER_COUNT, 0xD3A0 + index)
  ),
};

const reportsDir = path.join(__dirname, 'reports');
fs.mkdirSync(reportsDir, { recursive: true });
const reportName = PROFILE === 'v0.2' ? 'baseline' : `candidate-${PROFILE}`;
fs.writeFileSync(
  path.join(reportsDir, `${reportName}.json`),
  `${JSON.stringify(report, null, 2)}\n`
);
fs.writeFileSync(
  path.join(reportsDir, `${reportName}.md`),
  `${buildMarkdown(report)}\n`
);

console.log(buildMarkdown(report));
