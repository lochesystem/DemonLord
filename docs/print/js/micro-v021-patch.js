/**
 * DemonLord — patch do microprotótipo v0.2.1
 * Aplica o candidato balanceado sobre os dados históricos v0.2.
 */

(() => {
  const effects = {
    R01: 'Enquanto estiver: receba +1 ATK se você controlar outro Voador.',
    R02: 'Enquanto estiver: +1 PV sob Terreno urbano.',
    R03: 'Ao entrar: olhe a próxima Raça; devolva ao topo ou ao fundo.',
    R04: 'Ao entrar: um rival descarta 1 Raça de PV 2 ou menos.',
    R05: 'Enquanto estiver: +1 PV se sua INT total for 5 ou menos.',
    R06: 'Enquanto estiver: receba +1 ATK se você controlar outro Goblin.',
    R07: 'Enquanto estiver: mantenha +1◆ sobre cada outra Raça sua.',
    R08: 'Enquanto estiver: receba +1 ATK se você controlar outro Bruto.',
    R09: 'Ao entrar: transfira para seu exército 1 Raça Masculina de contrato 3◆ ou menos controlada por um rival.',
    R10: 'Enquanto estiver: receba +1 PV se você controlar outro Nadador.',
    R11: 'Enquanto estiver: receba +1 INT se você controlar outro Furtivo.',
    R12: 'Enquanto estiver: receba +1 PV se você controlar outro Bruto.',
    R13: 'Enquanto estiver: ignore penalidades de Terreno físico.',
    R14: 'Enquanto estiver: receba +1 PV se você controlar outro Nadador.',
    R15: 'Ao entrar: Goblins ficam −2 ATK até o fim da rodada.',
    R16: 'Enquanto estiver: receba +1 INT se você controlar outro Arcano.',
    R17: 'Enquanto estiver: outras Raças recebem +1 ATK na rodada em que entram.',
  };

  MICRO_RACES_BASE.forEach((race) => {
    race.effect = effects[race.id];
    if (race.id === 'R17') race.trait = 'Batedor';
  });

  MICRO_RACES.forEach((race) => {
    const id = race.id.split('-')[0];
    race.effect = effects[id];
    if (id === 'R17') race.trait = 'Batedor';
  });

  const newRaces = [
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
    },
  ];

  MICRO_RACES_BASE.push(...newRaces);
  newRaces.forEach((race) => {
    MICRO_RACES.push(
      { ...race, id: `${race.id}-1` },
      { ...race, id: `${race.id}-2` }
    );
  });

  const decreeChanges = {
    D02: {
      requirements: ['3+ Nadador', 'ATK total 10+', '3+ Raças'],
    },
    D05: {
      requirements: [
        '4+ Raças diferentes',
        '2+ Arcano',
        '2+ Furtivo',
        'INT total 12+',
        'Verba média 3◆ ou menos',
      ],
    },
    D06: {
      requirements: ['2+ Arcano', 'INT total 14+', 'PV total 10+'],
    },
    D07: {
      budget: 18,
      requirements: ['ATK total 17+', 'PV total 14+', 'INT total 10 ou menos'],
    },
    D08: {
      requirements: [
        'PV total 12+',
        'ATK total 12+',
        'INT total 10+',
        '4+ Raças',
      ],
    },
  };

  MICRO_DECREES.forEach((decree) => {
    Object.assign(decree, decreeChanges[decree.id] ?? {});
  });

  MICRO_COUNTS.races = MICRO_RACES.length;
  MICRO_COUNTS.total =
    MICRO_COUNTS.races + MICRO_COUNTS.tactics + MICRO_COUNTS.decrees;
})();
