/**
 * DemonLord — dados das cartas para impressão
 * Medida de corte: 63,5 × 88,9 mm
 */
const CARD_SPEC = {
  trimW: 63.5,
  trimH: 88.9,
  bleed: 3,
  safe: 3,
};

const RESOURCES = (() => {
  const cards = [];
  const types = [
    { type: 'ouro', label: 'Ouro', icon: '◆' },
    { type: 'comida', label: 'Comida', icon: '♣' },
    { type: 'militar', label: 'Militar', icon: '⚔' },
  ];
  types.forEach((t) => {
    [1, 1, 1, 2, 2, 2, 3, 3, 3].forEach((v, i) => {
      cards.push({ id: `R-${t.type}-${i}`, kind: 'resource', subtype: t.type, label: t.label, icon: t.icon, value: v });
    });
    // completar até 20 por tipo
    for (let i = 9; i < 20; i++) {
      const v = i < 13 ? 1 : i < 17 ? 2 : 3;
      cards.push({ id: `R-${t.type}-x${i}`, kind: 'resource', subtype: t.type, label: t.label, icon: t.icon, value: v });
    }
  });
  return cards;
})();

const MARKET = [
  { id: 'K10', name: 'Escória', subtype: 'Raça', cost: '1◆', effect: '+1 ⚔', copies: 4 },
  { id: 'K01', name: 'Goblins', subtype: 'Raça', cost: '2◆', effect: '+2 ⚔', copies: 4 },
  { id: 'K02', name: 'Ogros', subtype: 'Raça', cost: '3◆ 1♣', effect: '+4 ⚔', copies: 2 },
  { id: 'K03', name: 'Súcubos', subtype: 'Raça', cost: '2◆ 1⚔', effect: 'Alvo −1 Influência', copies: 2 },
  { id: 'K05', name: 'Forja Abissal', subtype: 'Edifício', cost: '4◆', effect: '+1 ⚔ permanente ao Contribuir', copies: 2 },
  { id: 'K06', name: 'Banquete dos Clãs', subtype: 'Ritual', cost: '2◆', effect: '+3 ♣', copies: 2 },
  { id: 'K07', name: 'Ritual de Sangue', subtype: 'Ritual', cost: '2♣', effect: '+3 ⚔ (descarta após)', copies: 2 },
  { id: 'K04', name: 'Caravanas de Saque', subtype: 'Logística', cost: '1⚔', effect: '+3 ◆ · −1 Moral', copies: 2 },
  { id: 'K08', name: 'Suborno', subtype: 'Intriga', cost: '3◆', effect: 'Roube 2 ◆ de um jogador', copies: 2 },
  { id: 'K09', name: 'Tributo ao Rei', subtype: 'Intriga', cost: '−2◆', effect: '+2 Influência', copies: 2 },
  { id: 'K11', name: 'Celeiro Maldito', subtype: 'Logística', cost: '3♣', effect: '+2 ♣ por 2 rodadas', copies: 2 },
  { id: 'K12', name: 'Deserção Forçada', subtype: 'Intriga', cost: '1 Inf.', effect: 'Alvo perde 2 ⚔', copies: 2 },
].flatMap((c) => Array.from({ length: c.copies }, (_, i) => ({ ...c, id: `${c.id}-${i + 1}`, kind: 'market' })));

const MISSIONS = [
  { mission: 'M01', title: 'Portão de Cinzas', stars: '★★', phases: [
    { n: 1, name: 'Atravessar o Pântano', req: '4♣  2⚔', fail: '−1 Moral' },
    { n: 2, name: 'Romper o Muro', req: '6⚔  3◆', fail: '−1 Moral' },
    { n: 3, name: 'Tomar a Torre', req: '5◆  4♣  5⚔', fail: '−2 Moral' },
  ]},
  { mission: 'M02', title: 'Vale Fértil', stars: '★', phases: [
    { n: 1, name: 'Colheita Maldita', req: '6♣  1⚔', fail: '−1 Moral' },
    { n: 2, name: 'Travessia do Rio', req: '3◆  4♣', fail: '−1 Moral' },
    { n: 3, name: 'Assalto à Granja', req: '4◆  3♣  3⚔', fail: '−1 Moral' },
  ]},
  { mission: 'M03', title: 'Cidadela do Norte', stars: '★★★', phases: [
    { n: 1, name: 'Subornar a Guarda', req: '5◆  2⚔', fail: '−2 Moral' },
    { n: 2, name: 'Escalar as Muralhas', req: '4◆  5⚔  3♣', fail: '−2 Moral' },
    { n: 3, name: 'Trono de Gelo', req: '6◆  4♣  6⚔', fail: '−2 Moral · todos −1 Inf.' },
  ]},
  { mission: 'M04', title: 'Costa dos Refugiados', stars: '★★', phases: [
    { n: 1, name: 'Desembarque', req: '3◆  4♣  2⚔', fail: '−1 Moral · +2♣ na Fase 2' },
    { n: 2, name: 'Acampamento', req: '5♣  4⚔', fail: '−1 Moral' },
    { n: 3, name: 'Fortaleza do Farol', req: '4◆  4♣  5⚔', fail: '−2 Moral' },
  ]},
].flatMap((m) => m.phases.map((p) => ({
  kind: 'mission', id: `${m.mission}-F${p.n}`, mission: m.mission, title: m.title, stars: m.stars,
  phase: p.n, name: p.name, req: p.req, fail: p.fail,
})));

const HEROES = [
  { id: 'H01', name: 'Ser Aldric', title: 'o Paladino', effect: '+2 ⚔ exigido em toda fase. Em fases ímpares, ♣ extra não conta.' },
  { id: 'H02', name: 'Maga Elira', title: '', effect: 'Quem mais contribuir ◆ na rodada perde 1 Influência.' },
  { id: 'H03', name: 'Capitão Riven', title: '', effect: 'Falha parcial: remova 1 recurso aleatório do Cofre antes da contagem.' },
  { id: 'H04', name: 'Bispo Kael', title: '', effect: 'Início de cada rodada: −1 Moral.' },
  { id: 'H05', name: 'Ladina Sable', title: '', effect: '1× por partida: um tipo de recurso no Cofre −50% (antes da contagem).' },
  { id: 'H06', name: 'Arquimago Theron', title: '', effect: 'Cartas Ritual no mercado custam +1 ◆.' },
  { id: 'H07', name: 'Rainha Mira', title: '', effect: 'Fases vencidas com 60% do requisito, sem +1 Moral.' },
  { id: 'H08', name: 'Caçador Voss', title: '', effect: 'Fim da rodada: quem tiver mais Influência descarta 1 carta.' },
].map((h) => ({ ...h, kind: 'hero' }));

const EVENTS = [
  { id: 'E01', name: 'Fome no acampamento', effect: '+2 ♣ exigida nesta rodada.' },
  { id: 'E02', name: 'Auditoria real', effect: 'Maior estoque de ◆ revelado perde 1 Influência.' },
  { id: 'E03', name: 'Bênção do Rei', effect: '+1 Moral.' },
  { id: 'E04', name: 'Emboscada humana', effect: '−1 Moral; +2 ⚔ exigido nesta rodada.' },
  { id: 'E05', name: 'Mercadores demônios', effect: 'Descarte fila do mercado. Reponha 4 cartas.' },
  { id: 'E06', name: 'Revolta interna', effect: 'Menor Influência perde 1 recurso (tipo escolhido).' },
  { id: 'E07', name: 'Profecia', effect: 'Próxima resolução: −1 em qualquer requisito (mín. 1).' },
  { id: 'E08', name: 'Duplicidade', effect: 'Quem tiver mais cartas na mão descarta 1.' },
  { id: 'E09', name: 'Favor real', effect: 'Maior contribuidor ao Cofre ganha +1 Influência.' },
  { id: 'E10', name: 'Reforço humano', effect: 'Ative o efeito do herói uma vez extra nesta rodada.' },
].flatMap((e) => [1, 2].map((n) => ({ ...e, id: `${e.id}-${n}`, kind: 'event' })));

const MANDATES = [
  { cat: 'Lealdade', name: 'Favor do Trono', win: 'Invasão vence e ≥5 Influência', rule: '' },
  { cat: 'Lealdade', name: 'Mão de Ferro', win: 'Invasão vence e mais ⚔ contribuído que todos', rule: '' },
  { cat: 'Lealdade', name: 'Logística Impecável', win: 'Invasão vence e ≥4 ♣ pessoal', rule: '' },
  { cat: 'Lealdade', name: 'Veterano', win: 'Invasão vence e ≥3 cartas Raça jogadas', rule: '' },
  { cat: 'Lealdade', name: 'Estratega', win: 'Invasão vence e maior contribuidor em ≥2 resoluções', rule: '' },
  { cat: 'Lealdade', name: 'Sem Desperdício', win: 'Invasão vence sem falha total quando contribuiu', rule: '' },
  { cat: 'Lealdade', name: 'Protetor do Rei', win: 'Invasão vence e Moral nunca abaixo de 4', rule: '' },
  { cat: 'Lealdade', name: 'Marcha Forçada', win: 'Invasão vence e Fase 1 na 1ª rodada', rule: '' },
  { cat: 'Lealdade', name: 'Disciplina', win: 'Invasão vence sem converter ⚔→◆', rule: '' },
  { cat: 'Lealdade', name: 'Último Baluarte', win: 'Invasão vence e contribuiu na Fase 3', rule: '' },
  { cat: 'Restrição', name: 'Economia de Guerra', win: 'Invasão vence e 8+ ◆ pessoal', rule: 'Máx. 2◆/rodada em cartas Raça' },
  { cat: 'Restrição', name: 'Dieta do Exército', win: 'Invasão vence e 6+ ♣ pessoal', rule: 'Não converter ♣→⚔' },
  { cat: 'Restrição', name: 'Recrutador Seletivo', win: 'Invasão vence e 3 raças diferentes', rule: 'Máx. 1 Raça comprada/rodada' },
  { cat: 'Restrição', name: 'Tributo Silencioso', win: 'Invasão vence e contribuiu abaixo da média', rule: '' },
  { cat: 'Restrição', name: 'Pacifista Relutante', win: 'Invasão vence, Moral ≥5', rule: 'Máx. 4 ⚔ pessoal ao fim do turno' },
  { cat: 'Restrição', name: 'Mão Limpa', win: 'Invasão vence e ≥4 Influência', rule: 'Não usar Suborno' },
  { cat: 'Restrição', name: 'Frugal', win: 'Invasão vence e 5+ ◆ pessoal', rule: 'Máx. 3 ações Comprar na partida' },
  { cat: 'Ambição', name: 'Tesouro do General', win: 'Invasão vence e 10+ ◆ pessoal', rule: '' },
  { cat: 'Ambição', name: 'Senhor das Legiões', win: 'Invasão vence e 8+ ⚔ pessoal', rule: '' },
  { cat: 'Ambição', name: 'Duplo Agente', win: 'Invasão vence e usou Suborno', rule: '' },
  { cat: 'Golpe', name: 'Usurpador', win: 'Golpe bem-sucedido', rule: '6+◆, 3+Inf., Fase 2–3' },
  { cat: 'Golpe', name: 'Oportunista', win: '12+◆ sem golpe OU 6+◆ se invasão falhar', rule: '' },
  { cat: 'Golpe', name: 'Infiltrado Humano', win: 'Invasão falha e ≥4 Influência', rule: '' },
  { cat: 'Golpe', name: 'Herdeiro do Trono', win: 'Golpe (−1 Apoio) OU invasão + 8 Inf.', rule: 'Golpe precisa 1 Apoio a menos' },
].map((m, i) => ({ ...m, id: `MAN-${String(i + 1).padStart(2, '0')}`, kind: 'mandate' }));

const DECK_SECTIONS = [
  { key: 'resources', title: 'Recursos', subtitle: '60 cartas · ◆ Ouro · ♣ Comida · ⚔ Militar', cards: RESOURCES },
  { key: 'market', title: 'Mercado', subtitle: '40 cartas', cards: MARKET },
  { key: 'missions', title: 'Missões', subtitle: '12 cartas de fase (4 missões × 3)', cards: MISSIONS },
  { key: 'heroes', title: 'Heróis humanos', subtitle: '8 cartas', cards: HEROES },
  { key: 'mandates', title: 'Mandatos secretos', subtitle: '24 cartas · CONFIDENCIAL', cards: MANDATES },
  { key: 'events', title: 'Decretos reais', subtitle: '20 cartas (10 × 2)', cards: EVENTS },
];
