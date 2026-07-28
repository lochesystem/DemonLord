const assert = require('node:assert/strict');
const test = require('node:test');
const {
  aggregateArmy,
  createGame,
  recruit,
  transfer,
  swapRaces,
  dismiss,
  applyAudit,
  seededRandom,
} = require('./engine.cjs');

test('recrutar retira do mercado, preserva contrato e repõe o slot', () => {
  const game = createGame(3, seededRandom(1));
  const player = game.players[0];
  const expected = game.market[2];
  const deckBefore = game.raceDeck.length;
  recruit(game, player, 2);
  assert.equal(player.army[0], expected);
  assert.equal(expected.contract, expected.cost);
  assert.equal(game.market.length, 6);
  assert.equal(game.raceDeck.length, deckBefore - 1);
});

test('transferência leva a mesma carta e toda a Verba ao novo controlador', () => {
  const game = createGame(3, seededRandom(2));
  const from = game.players[0];
  const to = game.players[1];
  const race = recruit(game, from, 0);
  race.contract += 2;
  const committed = race.contract;
  transfer(from, to, 0);
  assert.equal(from.army.length, 0);
  assert.equal(to.army[0], race);
  assert.equal(aggregateArmy(to.army).cost, committed);
});

test('dispensar devolve toda a Verba e move a carta ao descarte', () => {
  const game = createGame(3, seededRandom(3));
  const player = game.players[0];
  const race = recruit(game, player, 0);
  race.contract += 3;
  dismiss(game, player, 0);
  assert.equal(race.contract, 0);
  assert.equal(player.army.length, 0);
  assert.equal(game.discard.at(-1), race);
});

test('Auditoria adiciona 1◆ por contrato e reverte exatamente o que adicionou', () => {
  const game = createGame(3, seededRandom(4));
  const player = game.players[0];
  recruit(game, player, 0);
  recruit(game, player, 0);
  const before = player.army.map((race) => race.contract);
  const removeAudit = applyAudit(player);
  assert.deepEqual(
    player.army.map((race) => race.contract),
    before.map((value) => value + 1)
  );
  removeAudit();
  assert.deepEqual(player.army.map((race) => race.contract), before);
});

test('troca mantém cartas e contratos sem criar ou destruir Verba', () => {
  const game = createGame(3, seededRandom(5));
  const first = game.players[0];
  const second = game.players[1];
  recruit(game, first, 0);
  recruit(game, second, 0);
  const beforeCards = new Set([...first.army, ...second.army]);
  const beforeCost =
    aggregateArmy(first.army).cost + aggregateArmy(second.army).cost;
  swapRaces(first, second, 0, 0);
  assert.deepEqual(new Set([...first.army, ...second.army]), beforeCards);
  assert.equal(
    aggregateArmy(first.army).cost + aggregateArmy(second.army).cost,
    beforeCost
  );
});
