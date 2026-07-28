const {
  MICRO_DECREES,
  simulateGame,
  seededRandom,
} = require('./engine.cjs');
const { DECREE_SPECS } = require('./decrees.cjs');

const RUNS = Number(process.env.DEMONLORD_RUNS ?? 20000);
const originalDecrees = structuredClone(MICRO_DECREES);
const originalSpecs = structuredClone(DECREE_SPECS);

function restore() {
  for (let index = 0; index < MICRO_DECREES.length; index += 1) {
    Object.assign(MICRO_DECREES[index], structuredClone(originalDecrees[index]));
  }
  for (const key of Object.keys(DECREE_SPECS)) delete DECREE_SPECS[key];
  Object.assign(DECREE_SPECS, structuredClone(originalSpecs));
}

function conditionalRates(seed) {
  const rng = seededRandom(seed);
  const appearances = Object.fromEntries(MICRO_DECREES.map((card) => [card.id, 0]));
  const wins = Object.fromEntries(MICRO_DECREES.map((card) => [card.id, 0]));
  let completed = 0;
  let rounds = 0;
  for (let index = 0; index < RUNS; index += 1) {
    const game = simulateGame(4, rng);
    for (const id of game.dealtDecrees) appearances[id] += 1;
    if (game.ended) {
      completed += 1;
      rounds += game.round;
      wins[game.winnerDecree] += 1;
    }
  }
  return {
    completion: completed / RUNS,
    meanRounds: rounds / completed,
    rates: Object.fromEntries(
      MICRO_DECREES.map((card) => [
        card.id,
        appearances[card.id] ? wins[card.id] / appearances[card.id] : 0,
      ])
    ),
  };
}

const scenarios = [
  ['Base atual', () => {}],
  ['D05: INT 12+', () => {
    DECREE_SPECS.D05.min.int = 12;
  }],
  ['D05: 5+ Raças', () => {
    DECREE_SPECS.D05.min.cards = 5;
  }],
  ['D05: orçamento 11', () => {
    MICRO_DECREES.find((card) => card.id === 'D05').budget = 11;
  }],
  ['D05: orçamento 11 e INT 11+', () => {
    MICRO_DECREES.find((card) => card.id === 'D05').budget = 11;
    DECREE_SPECS.D05.min.int = 11;
  }],
  ['D05: 4+ Raças diferentes', () => {
    DECREE_SPECS.D05.min.distinct = 4;
  }],
  ['D05: 4 diferentes e INT 12+', () => {
    DECREE_SPECS.D05.min.distinct = 4;
    DECREE_SPECS.D05.min.int = 12;
  }],
  ['D05: Verba média 2,5 ou menos', () => {
    DECREE_SPECS.D05.max.averageCost = 2.5;
  }],
  ['D05: 2+ Furtivo e 4 diferentes', () => {
    DECREE_SPECS.D05.traitMin = { Furtivo: 2 };
    DECREE_SPECS.D05.min.distinct = 4;
  }],
  ['D05: 2+ Arcano e 4 diferentes', () => {
    DECREE_SPECS.D05.traitMin = { Arcano: 2 };
    DECREE_SPECS.D05.min.distinct = 4;
  }],
  ['D07: orçamento 18', () => {
    MICRO_DECREES.find((card) => card.id === 'D07').budget = 18;
  }],
  ['D07: orçamento 19', () => {
    MICRO_DECREES.find((card) => card.id === 'D07').budget = 19;
  }],
  ['D07: ATK 19+', () => {
    DECREE_SPECS.D07.min.atk = 19;
  }],
  ['D07: ATK 18+', () => {
    DECREE_SPECS.D07.min.atk = 18;
  }],
  ['D07: ATK 18+ e orçamento 18', () => {
    DECREE_SPECS.D07.min.atk = 18;
    MICRO_DECREES.find((card) => card.id === 'D07').budget = 18;
  }],
  ['D07: ATK 17+ e orçamento 18', () => {
    DECREE_SPECS.D07.min.atk = 17;
    MICRO_DECREES.find((card) => card.id === 'D07').budget = 18;
  }],
  ['D07: ATK 16+ e orçamento 18', () => {
    DECREE_SPECS.D07.min.atk = 16;
    MICRO_DECREES.find((card) => card.id === 'D07').budget = 18;
  }],
  ['D07: 2+ Bruto, ATK 18+ e orçamento 18', () => {
    DECREE_SPECS.D07.min.atk = 18;
    DECREE_SPECS.D07.traitMin = { Bruto: 2 };
    MICRO_DECREES.find((card) => card.id === 'D07').budget = 18;
  }],
  ['D07: ATK 19+ e orçamento 20', () => {
    DECREE_SPECS.D07.min.atk = 19;
    MICRO_DECREES.find((card) => card.id === 'D07').budget = 20;
  }],
  ['Candidato conjunto: D05 INT 12+; D07 orçamento 18', () => {
    DECREE_SPECS.D05.min.int = 12;
    MICRO_DECREES.find((card) => card.id === 'D07').budget = 18;
  }],
];

console.log(`Cenários: ${RUNS.toLocaleString('pt-BR')} partidas com 4 jogadores`);
console.log('Cenário | conclusão | rodadas | D05 | D07');
console.log('---|---:|---:|---:|---:');
scenarios.forEach(([name, configure], index) => {
  restore();
  configure();
  const result = conditionalRates(0xBADA55 + index);
  const pct = (value) => `${(value * 100).toFixed(1)}%`;
  console.log(
    `${name} | ${pct(result.completion)} | ${result.meanRounds.toFixed(2)} | ` +
    `${pct(result.rates.D05)} | ${pct(result.rates.D07)}`
  );
});
restore();
