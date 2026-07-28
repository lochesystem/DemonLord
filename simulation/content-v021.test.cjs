const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function loadPrintData() {
  const context = vm.createContext({});
  const dataPath = path.join(
    __dirname,
    '../docs/print/js/micro-v02-data.js'
  );
  const patchPath = path.join(
    __dirname,
    '../docs/print/js/micro-v021-patch.js'
  );
  vm.runInContext(fs.readFileSync(dataPath, 'utf8'), context);
  vm.runInContext(fs.readFileSync(patchPath, 'utf8'), context);
  return JSON.parse(
    vm.runInContext(
      'JSON.stringify({ races: MICRO_RACES, decrees: MICRO_DECREES, counts: MICRO_COUNTS })',
      context
    )
  );
}

test('Print & Play v0.2.1 possui 76 cartas e nenhuma Raça sem habilidade', () => {
  const print = loadPrintData();
  assert.deepEqual(print.counts, {
    races: 40,
    items: 28,
    decrees: 8,
    total: 76,
  });
  assert.equal(new Set(print.races.map((race) => race.id.split('-')[0])).size, 20);
  assert.equal(
    print.races.filter((race) => !race.effect || race.effect === '—').length,
    0
  );
});

test('Decretos impressos coincidem com o candidato simulado v0.2.1', () => {
  const print = loadPrintData();
  require('./candidates/v0.2.1.cjs').applyCandidate();
  const { MICRO_DECREES } = require('../docs/print/js/micro-v02-data.js');
  assert.deepEqual(
    print.decrees.map(({ id, budget, requirements }) => ({
      id,
      budget,
      requirements,
    })),
    MICRO_DECREES.map(({ id, budget, requirements }) => ({
      id,
      budget,
      requirements,
    }))
  );
});
