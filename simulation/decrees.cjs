const DECREE_SPECS = {
  D01: {
    traitMin: { Voador: 3 },
    min: { pv: 12, int: 8 },
  },
  D02: {
    traitMin: { Nadador: 2 },
    min: { atk: 10, cards: 3 },
  },
  D03: {
    traitMin: { Bruto: 2 },
    min: { atk: 16 },
    max: { int: 6 },
  },
  D04: {
    min: { distinct: 4, pv: 14, atk: 12 },
  },
  D05: {
    min: { cards: 4, int: 10 },
    max: { averageCost: 3 },
  },
  D06: {
    traitMin: { Arcano: 2 },
    min: { int: 16, pv: 10 },
  },
  D07: {
    min: { atk: 20, pv: 14 },
    max: { int: 10 },
  },
  D08: {
    min: { pv: 12, atk: 12, int: 12, cards: 4 },
  },
};

module.exports = { DECREE_SPECS };
