const {
  MICRO_RACES_BASE,
  MICRO_RACES,
  MICRO_DECREES,
} = require('../docs/print/js/micro-v02-data.js');
const { DECREE_SPECS } = require('./decrees.cjs');

function baseId(card) {
  return card.id.split('-')[0];
}

function aggregateArmy(cards) {
  const result = {
    cards: cards.length,
    distinct: new Set(cards.map(baseId)).size,
    cost: 0,
    pv: 0,
    atk: 0,
    int: 0,
    traits: {},
    averageCost: 0,
  };
  for (const card of cards) {
    result.cost += card.contract ?? card.cost;
    result.pv += card.pv;
    result.atk += card.atk;
    result.int += card.int;
    result.traits[card.trait] = (result.traits[card.trait] ?? 0) + 1;
  }
  for (const card of cards) {
    const ability = card.ability;
    if (ability?.kind !== 'conditionalSelfStat') continue;
    const condition = ability.when ?? {};
    const hasOtherTrait =
      !condition.otherTrait ||
      cards.some((other) => other !== card && other.trait === condition.otherTrait);
    const hasOtherSpecies =
      !condition.otherSpecies ||
      cards.some(
        (other) => other !== card && baseId(other) === condition.otherSpecies
      );
    const withinIntLimit =
      condition.totalIntMax === undefined || result.int <= condition.totalIntMax;
    if (!hasOtherTrait || !hasOtherSpecies || !withinIntLimit) continue;
    for (const [stat, amount] of Object.entries(ability.bonus ?? {})) {
      result[stat] += amount;
    }
  }
  result.averageCost = cards.length ? result.cost / cards.length : 0;
  return result;
}

function satisfies(decree, army) {
  const spec = DECREE_SPECS[decree.id];
  if (!spec) throw new Error(`Decreto sem especificação: ${decree.id}`);
  if (army.cost > decree.budget) return false;
  for (const [field, target] of Object.entries(spec.min ?? {})) {
    if (army[field] < target) return false;
  }
  for (const [field, target] of Object.entries(spec.max ?? {})) {
    if (army[field] > target) return false;
  }
  for (const [trait, target] of Object.entries(spec.traitMin ?? {})) {
    if ((army.traits[trait] ?? 0) < target) return false;
  }
  return true;
}

function progress(decree, army) {
  const spec = DECREE_SPECS[decree.id];
  let score = 0;
  let axes = 1;
  score += Math.min(army.cost / decree.budget, 1) * 0.05;
  for (const [field, target] of Object.entries(spec.min ?? {})) {
    score += Math.min(army[field] / target, 1);
    axes += 1;
  }
  for (const [field, target] of Object.entries(spec.max ?? {})) {
    const value = army[field];
    score += value <= target ? 1 : Math.max(-1, 1 - (value - target) / Math.max(target, 1));
    axes += 1;
  }
  for (const [trait, target] of Object.entries(spec.traitMin ?? {})) {
    score += Math.min((army.traits[trait] ?? 0) / target, 1);
    axes += 1;
  }
  if (army.cost > decree.budget) {
    score -= 3 * (army.cost - decree.budget) / decree.budget;
  }
  return score / axes;
}

function cloneRace(card) {
  return { ...card, contract: card.cost };
}

function createGame(playerCount, rng) {
  const raceDeck = shuffle(MICRO_RACES.map(cloneRace), rng);
  const decreeDeck = shuffle([...MICRO_DECREES], rng);
  const market = raceDeck.splice(0, 6);
  const players = Array.from({ length: playerCount }, (_, id) => ({
    id,
    decree: decreeDeck[id],
    army: [],
  }));
  return { raceDeck, market, players, discard: [] };
}

function refillMarket(game) {
  while (game.market.length < 6 && game.raceDeck.length) {
    game.market.push(game.raceDeck.shift());
  }
}

function recruit(game, player, marketIndex) {
  const [race] = game.market.splice(marketIndex, 1);
  if (!race) throw new Error('Espaço de mercado inválido');
  player.army.push(race);
  refillMarket(game);
  return race;
}

function dismiss(game, player, armyIndex) {
  const [race] = player.army.splice(armyIndex, 1);
  if (!race) throw new Error('Raça inválida para dispensar');
  race.contract = 0;
  game.discard.push(race);
  return race;
}

function transfer(from, to, armyIndex) {
  const [race] = from.army.splice(armyIndex, 1);
  if (!race) throw new Error('Raça inválida para transferir');
  to.army.push(race);
  return race;
}

function swapRaces(first, second, firstIndex, secondIndex) {
  const firstRace = first.army[firstIndex];
  const secondRace = second.army[secondIndex];
  if (!firstRace || !secondRace) throw new Error('Raça inválida para troca');
  first.army[firstIndex] = secondRace;
  second.army[secondIndex] = firstRace;
  return [firstRace, secondRace];
}

function applyAudit(player, amount = 1) {
  const changes = [];
  for (const race of player.army) {
    race.contract += amount;
    changes.push({ race, amount });
  }
  return () => {
    for (const change of changes) {
      change.race.contract -= change.amount;
    }
  };
}

function chooseRecruit(game, player) {
  const current = aggregateArmy(player.army);
  const currentScore = progress(player.decree, current);
  let best = null;
  game.market.forEach((race, index) => {
    const nextArmy = aggregateArmy([...player.army, race]);
    if (nextArmy.cost > player.decree.budget) return;
    const score = progress(player.decree, nextArmy);
    const candidate = {
      index,
      score,
      gain: score - currentScore,
      tie: (race.pv + race.atk + race.int) / race.cost,
    };
    if (
      !best ||
      candidate.gain > best.gain ||
      (candidate.gain === best.gain && candidate.tie > best.tie)
    ) {
      best = candidate;
    }
  });
  return best;
}

function chooseDismiss(player) {
  if (!player.army.length) return null;
  const currentScore = progress(player.decree, aggregateArmy(player.army));
  let best = null;
  player.army.forEach((race, index) => {
    const next = player.army.filter((_, cardIndex) => cardIndex !== index);
    const score = progress(player.decree, aggregateArmy(next));
    if (!best || score > best.score) best = { index, score, gain: score - currentScore };
  });
  return best?.gain > 0 ? best : null;
}

function chooseTrade(game, player) {
  const playerScore = progress(player.decree, aggregateArmy(player.army));
  let best = null;
  for (const other of game.players) {
    if (other === player || !other.army.length) continue;
    const otherScore = progress(other.decree, aggregateArmy(other.army));
    for (let playerIndex = 0; playerIndex < player.army.length; playerIndex += 1) {
      for (let otherIndex = 0; otherIndex < other.army.length; otherIndex += 1) {
        const playerNext = [...player.army];
        const otherNext = [...other.army];
        [playerNext[playerIndex], otherNext[otherIndex]] = [
          otherNext[otherIndex],
          playerNext[playerIndex],
        ];
        const playerGain =
          progress(player.decree, aggregateArmy(playerNext)) - playerScore;
        const otherGain =
          progress(other.decree, aggregateArmy(otherNext)) - otherScore;
        if (playerGain <= 0.001 || otherGain <= 0.001) continue;
        const candidate = {
          other,
          playerIndex,
          otherIndex,
          playerGain,
          otherGain,
          combinedGain: playerGain + otherGain,
        };
        if (
          !best ||
          candidate.playerGain > best.playerGain ||
          (candidate.playerGain === best.playerGain &&
            candidate.combinedGain > best.combinedGain)
        ) {
          best = candidate;
        }
      }
    }
  }
  return best;
}

function playBotTurn(game, player, options = {}) {
  let recruitments = 0;
  let trades = 0;
  const tradePartners = [];
  for (let action = 0; action < 2; action += 1) {
    if (satisfies(player.decree, aggregateArmy(player.army))) break;
    const recruitLimit = options.maxRecruitmentsPerTurn ?? 2;
    const recruitChoice =
      recruitments < recruitLimit ? chooseRecruit(game, player) : null;
    const tradeChoice =
      options.allowNegotiation && trades === 0 ? chooseTrade(game, player) : null;
    if (
      tradeChoice &&
      (!recruitChoice || tradeChoice.playerGain > recruitChoice.gain)
    ) {
      swapRaces(
        player,
        tradeChoice.other,
        tradeChoice.playerIndex,
        tradeChoice.otherIndex
      );
      trades += 1;
      tradePartners.push(tradeChoice.other.id);
      continue;
    }
    if (recruitChoice) {
      recruit(game, player, recruitChoice.index);
      recruitments += 1;
      continue;
    }
    const removal = chooseDismiss(player);
    if (removal) dismiss(game, player, removal.index);
    else break;
  }
  return { recruitments, trades, tradePartners };
}

function determineWinner(players) {
  const valid = players
    .filter((player) => satisfies(player.decree, aggregateArmy(player.army)))
    .map((player) => ({ player, army: aggregateArmy(player.army) }))
    .sort((a, b) =>
      a.army.cost - b.army.cost ||
      a.army.cards - b.army.cards ||
      a.player.id - b.player.id
    );
  return valid[0] ?? null;
}

function currentLeaders(players) {
  const scores = players.map((player) =>
    progress(player.decree, aggregateArmy(player.army))
  );
  const best = Math.max(...scores);
  return players
    .filter((_, index) => Math.abs(scores[index] - best) < 1e-9)
    .map((player) => player.id);
}

function simulateGame(playerCount, rng, maxRounds = 20, options = {}) {
  const game = createGame(playerCount, rng);
  let noRecruitRounds = 0;
  let budgetOverflowTurns = 0;
  let trades = 0;
  const traders = new Set();
  let initialLeaders = [];
  let previousLeaders = [];
  let leadChanges = 0;
  let round = 0;
  for (round = 1; round <= maxRounds; round += 1) {
    let recruitedThisRound = 0;
    for (const player of game.players) {
      const turn = playBotTurn(game, player, options);
      recruitedThisRound += turn.recruitments;
      trades += turn.trades;
      if (turn.trades) {
        traders.add(player.id);
        turn.tradePartners.forEach((id) => traders.add(id));
      }
      if (aggregateArmy(player.army).cost > player.decree.budget) {
        budgetOverflowTurns += 1;
      }
    }
    if (recruitedThisRound === 0) noRecruitRounds += 1;
    const leaders = currentLeaders(game.players);
    if (round === 1) initialLeaders = leaders;
    if (
      previousLeaders.length &&
      !leaders.some((leader) => previousLeaders.includes(leader))
    ) {
      leadChanges += 1;
    }
    previousLeaders = leaders;
    const winner = determineWinner(game.players);
    if (winner) {
      return {
        ended: true,
        round,
        winnerPlayerId: winner.player.id,
        winnerDecree: winner.player.decree.id,
        dealtDecrees: game.players.map((player) => player.decree.id),
        winnerCost: winner.army.cost,
        noRecruitRounds,
        budgetOverflowTurns,
        trades,
        winnerTraded: traders.has(winner.player.id),
        initialLeaderWon: initialLeaders.includes(winner.player.id),
        leadChanges,
      };
    }
    if (!game.raceDeck.length && !game.market.length) break;
  }
  return {
    ended: false,
    round: Math.min(round, maxRounds),
    winnerPlayerId: null,
    winnerDecree: null,
    dealtDecrees: game.players.map((player) => player.decree.id),
    noRecruitRounds,
    budgetOverflowTurns,
    trades,
    winnerTraded: false,
    initialLeaderWon: false,
    leadChanges,
  };
}

function shuffle(items, rng) {
  for (let index = items.length - 1; index > 0; index -= 1) {
    const target = Math.floor(rng() * (index + 1));
    [items[index], items[target]] = [items[target], items[index]];
  }
  return items;
}

function seededRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

module.exports = {
  MICRO_RACES_BASE,
  MICRO_DECREES,
  aggregateArmy,
  satisfies,
  progress,
  createGame,
  refillMarket,
  recruit,
  dismiss,
  transfer,
  swapRaces,
  applyAudit,
  simulateGame,
  seededRandom,
};
