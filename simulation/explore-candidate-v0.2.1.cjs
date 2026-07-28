require('./candidates/v0.2.1.cjs').applyCandidate();

const {
  MICRO_DECREES,
  simulateGame,
  seededRandom,
} = require('./engine.cjs');
const { DECREE_SPECS } = require('./decrees.cjs');

const RUNS = Number(process.env.DEMONLORD_RUNS ?? 10000);
const originalDecrees = structuredClone(MICRO_DECREES);
const originalSpecs = structuredClone(DECREE_SPECS);

function restore() {
  MICRO_DECREES.forEach((decree, index) => {
    Object.assign(decree, structuredClone(originalDecrees[index]));
  });
  for (const key of Object.keys(DECREE_SPECS)) delete DECREE_SPECS[key];
  Object.assign(DECREE_SPECS, structuredClone(originalSpecs));
}

function run(seed) {
  const rng = seededRandom(seed);
  const appearances = Object.fromEntries(MICRO_DECREES.map((card) => [card.id, 0]));
  const wins = Object.fromEntries(MICRO_DECREES.map((card) => [card.id, 0]));
  for (let index = 0; index < RUNS; index += 1) {
    const game = simulateGame(4, rng);
    for (const id of game.dealtDecrees) appearances[id] += 1;
    if (game.winnerDecree) wins[game.winnerDecree] += 1;
  }
  return Object.fromEntries(
    MICRO_DECREES.map((card) => [
      card.id,
      wins[card.id] / appearances[card.id],
    ])
  );
}

const scenarios = [
  ['Candidato atual', () => {}],
  ['D02: 3+ Nadador', () => {
    DECREE_SPECS.D02.traitMin.Nadador = 3;
  }],
  ['D02: ATK 12+', () => {
    DECREE_SPECS.D02.min.atk = 12;
  }],
  ['D02: 3+ Nadador e ATK 11+', () => {
    DECREE_SPECS.D02.traitMin.Nadador = 3;
    DECREE_SPECS.D02.min.atk = 11;
  }],
  ['D06: INT 14+', () => {
    DECREE_SPECS.D06.min.int = 14;
  }],
  ['D06: INT 13+', () => {
    DECREE_SPECS.D06.min.int = 13;
  }],
  ['D06: INT 14+ e PV 9+', () => {
    DECREE_SPECS.D06.min.int = 14;
    DECREE_SPECS.D06.min.pv = 9;
  }],
  ['D08: INT 10+', () => {
    DECREE_SPECS.D08.min.int = 10;
  }],
  ['D08: todos os atributos 11+', () => {
    DECREE_SPECS.D08.min.pv = 11;
    DECREE_SPECS.D08.min.atk = 11;
    DECREE_SPECS.D08.min.int = 11;
  }],
  ['D08: orçamento 18', () => {
    MICRO_DECREES.find((card) => card.id === 'D08').budget = 18;
  }],
  ['Conjunto A: D02 3 Nadador; D06 INT 14; D08 INT 10', () => {
    DECREE_SPECS.D02.traitMin.Nadador = 3;
    DECREE_SPECS.D06.min.int = 14;
    DECREE_SPECS.D08.min.int = 10;
  }],
  ['Conjunto B: D02 ATK 12; D06 INT 13; D08 atributos 11', () => {
    DECREE_SPECS.D02.min.atk = 12;
    DECREE_SPECS.D06.min.int = 13;
    DECREE_SPECS.D08.min.pv = 11;
    DECREE_SPECS.D08.min.atk = 11;
    DECREE_SPECS.D08.min.int = 11;
  }],
  ['Conjunto C: A + D05 1 Furtivo; D07 ATK 17', () => {
    DECREE_SPECS.D02.traitMin.Nadador = 3;
    DECREE_SPECS.D06.min.int = 14;
    DECREE_SPECS.D08.min.int = 10;
    DECREE_SPECS.D05.traitMin.Furtivo = 1;
    DECREE_SPECS.D07.min.atk = 17;
  }],
  ['Conjunto D: A + D05 2 Furtivos; D07 ATK 17', () => {
    DECREE_SPECS.D02.traitMin.Nadador = 3;
    DECREE_SPECS.D06.min.int = 14;
    DECREE_SPECS.D08.min.int = 10;
    DECREE_SPECS.D05.traitMin.Furtivo = 2;
    DECREE_SPECS.D07.min.atk = 17;
  }],
  ['Conjunto E: A + D05 1 Furtivo; D07 orçamento 19', () => {
    DECREE_SPECS.D02.traitMin.Nadador = 3;
    DECREE_SPECS.D06.min.int = 14;
    DECREE_SPECS.D08.min.int = 10;
    DECREE_SPECS.D05.traitMin.Furtivo = 1;
    MICRO_DECREES.find((card) => card.id === 'D07').budget = 19;
  }],
];

console.log(`Cenários v0.2.1: ${RUNS.toLocaleString('pt-BR')} partidas com 4 jogadores`);
console.log('Cenário | D02 | D06 | D08 | menor | maior');
console.log('---|---:|---:|---:|---:|---:');
scenarios.forEach(([name, configure], index) => {
  restore();
  configure();
  const rates = run(0xC0FFEE + index);
  const values = Object.values(rates);
  const pct = (value) => `${(value * 100).toFixed(1)}%`;
  console.log(
    `${name} | ${pct(rates.D02)} | ${pct(rates.D06)} | ${pct(rates.D08)} | ` +
    `${pct(Math.min(...values))} | ${pct(Math.max(...values))}`
  );
});
restore();
