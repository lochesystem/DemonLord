const {
  MICRO_RACES_BASE,
  MICRO_RACES,
  MICRO_DECREES,
  MICRO_COUNTS,
} = require('../../docs/print/js/micro-v02-data.js');
const { DECREE_SPECS } = require('../decrees.cjs');

let applied = false;

const EFFECTS = {
  R01: {
    effect: 'Enquanto estiver: receba +1 ATK se você controlar outro Voador.',
    ability: {
      kind: 'conditionalSelfStat',
      when: { otherTrait: 'Voador' },
      bonus: { atk: 1 },
    },
  },
  R02: {
    effect: 'Enquanto estiver: +1 PV sob Terreno urbano.',
    ability: {
      kind: 'conditionalSelfStat',
      when: { terrain: 'Urbano' },
      bonus: { pv: 1 },
    },
  },
  R03: {
    effect: 'Ao entrar: olhe a próxima Raça; devolva ao topo ou ao fundo.',
    ability: { kind: 'marketScry', cards: 1 },
  },
  R04: {
    effect: 'Ao entrar: um rival descarta 1 Raça de PV 2 ou menos.',
    ability: { kind: 'expelEnemy', maxPv: 2 },
  },
  R05: {
    effect: 'Enquanto estiver: +1 PV se sua INT total for 5 ou menos.',
    ability: {
      kind: 'conditionalSelfStat',
      when: { totalIntMax: 5 },
      bonus: { pv: 1 },
    },
  },
  R06: {
    effect: 'Enquanto estiver: receba +1 ATK se você controlar outro Goblin.',
    ability: {
      kind: 'conditionalSelfStat',
      when: { otherSpecies: 'R06' },
      bonus: { atk: 1 },
    },
  },
  R07: {
    effect: 'Enquanto estiver: mantenha +1◆ sobre cada outra Raça sua.',
    ability: { kind: 'taxOtherContracts', amount: 1 },
  },
  R08: {
    effect: 'Enquanto estiver: receba +1 ATK se você controlar outro Bruto.',
    ability: {
      kind: 'conditionalSelfStat',
      when: { otherTrait: 'Bruto' },
      bonus: { atk: 1 },
    },
  },
  R09: {
    effect: 'Ao entrar: transfira para seu exército 1 Raça Masculina de contrato 3◆ ou menos controlada por um rival.',
    ability: {
      kind: 'transferEnemy',
      filters: { sex: 'Masculino', maxContract: 3 },
    },
  },
  R10: {
    effect: 'Enquanto estiver: receba +1 PV se você controlar outro Nadador.',
    ability: {
      kind: 'conditionalSelfStat',
      when: { otherTrait: 'Nadador' },
      bonus: { pv: 1 },
    },
  },
  R11: {
    effect: 'Enquanto estiver: +1 INT se controlar outro Furtivo.',
    ability: {
      kind: 'conditionalSelfStat',
      when: { otherTrait: 'Furtivo' },
      bonus: { int: 1 },
    },
  },
  R12: {
    effect: 'Enquanto estiver: receba +1 PV se você controlar outro Bruto.',
    ability: {
      kind: 'conditionalSelfStat',
      when: { otherTrait: 'Bruto' },
      bonus: { pv: 1 },
    },
  },
  R13: {
    effect: 'Enquanto estiver: ignore penalidades de Terreno físico.',
    ability: { kind: 'terrainImmunity', category: 'Fisico' },
  },
  R14: {
    effect: 'Enquanto estiver: receba +1 PV se você controlar outro Nadador.',
    ability: {
      kind: 'conditionalSelfStat',
      when: { otherTrait: 'Nadador' },
      bonus: { pv: 1 },
    },
  },
  R15: {
    effect: 'Ao entrar: Goblins ficam −2 ATK até o fim da rodada.',
    ability: {
      kind: 'roundTraitDebuff',
      species: 'R06',
      stat: 'atk',
      amount: -2,
    },
  },
  R16: {
    effect: 'Enquanto estiver: receba +1 INT se você controlar outro Arcano.',
    ability: {
      kind: 'conditionalSelfStat',
      when: { otherTrait: 'Arcano' },
      bonus: { int: 1 },
    },
  },
  R17: {
    effect: 'Enquanto estiver: outras Raças recebem +1 ATK na rodada em que entram.',
    ability: { kind: 'entryAlliesBuff', stat: 'atk', amount: 1 },
  },
};

const NEW_RACES = [
  {
    id: 'R18',
    name: 'Orc Berserker',
    sex: 'Masculino',
    pv: 3,
    atk: 6,
    int: 0,
    cost: 4,
    trait: 'Bruto',
    art: '🪓',
    effect: 'Enquanto estiver: receba +1 ATK se você controlar outro Bruto.',
    ability: {
      kind: 'conditionalSelfStat',
      when: { otherTrait: 'Bruto' },
      bonus: { atk: 1 },
    },
  },
  {
    id: 'R19',
    name: 'Cão Infernal',
    sex: 'Neutro',
    pv: 3,
    atk: 5,
    int: 1,
    cost: 3,
    trait: 'Batedor',
    art: '🐕',
    effect: 'Enquanto estiver: receba +1 PV se você controlar outro Batedor.',
    ability: {
      kind: 'conditionalSelfStat',
      when: { otherTrait: 'Batedor' },
      bonus: { pv: 1 },
    },
  },
  {
    id: 'R20',
    name: 'Troll de Guerra',
    sex: 'Masculino',
    pv: 6,
    atk: 5,
    int: 0,
    cost: 5,
    trait: 'Bruto',
    art: '🧌',
    effect: 'Enquanto estiver: receba +1 PV se você controlar outro Bruto.',
    ability: {
      kind: 'conditionalSelfStat',
      when: { otherTrait: 'Bruto' },
      bonus: { pv: 1 },
    },
  },
];

function applyCandidate() {
  if (applied) return;
  applied = true;

  for (const race of MICRO_RACES_BASE) {
    Object.assign(race, EFFECTS[race.id]);
  }
  for (const race of MICRO_RACES) {
    Object.assign(race, EFFECTS[race.id.split('-')[0]]);
  }

  for (const race of NEW_RACES) {
    MICRO_RACES_BASE.push(race);
    MICRO_RACES.push(
      { ...race, id: `${race.id}-1` },
      { ...race, id: `${race.id}-2` }
    );
  }

  const d05 = MICRO_DECREES.find((decree) => decree.id === 'D05');
  d05.requirements = [
    '4+ Raças diferentes',
    '2+ Arcano',
    '2+ Furtivo',
    'INT total 12+',
    'Verba média 3◆ ou menos',
  ];
  DECREE_SPECS.D05.min = { cards: 4, distinct: 4, int: 12 };
  DECREE_SPECS.D05.traitMin = { Arcano: 2, Furtivo: 2 };

  const d07 = MICRO_DECREES.find((decree) => decree.id === 'D07');
  d07.budget = 18;
  d07.requirements = ['ATK total 17+', 'PV total 14+', 'INT total 10 ou menos'];
  DECREE_SPECS.D07.min = { atk: 17, pv: 14 };
  DECREE_SPECS.D07.max = { int: 10 };

  const d02 = MICRO_DECREES.find((decree) => decree.id === 'D02');
  d02.requirements = ['3+ Nadador', 'ATK total 10+', '3+ Raças'];
  DECREE_SPECS.D02.traitMin = { Nadador: 3 };

  const d06 = MICRO_DECREES.find((decree) => decree.id === 'D06');
  d06.requirements = ['2+ Arcano', 'INT total 14+', 'PV total 10+'];
  DECREE_SPECS.D06.min = { int: 14, pv: 10 };

  const d08 = MICRO_DECREES.find((decree) => decree.id === 'D08');
  d08.requirements = [
    'PV total 12+',
    'ATK total 12+',
    'INT total 10+',
    '4+ Raças',
  ];
  DECREE_SPECS.D08.min = { pv: 12, atk: 12, int: 10, cards: 4 };

  MICRO_COUNTS.races = MICRO_RACES.length;
  MICRO_COUNTS.total =
    MICRO_COUNTS.races + MICRO_COUNTS.items + MICRO_COUNTS.decrees;
}

module.exports = { applyCandidate, EFFECTS, NEW_RACES };
