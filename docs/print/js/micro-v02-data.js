/**
 * DemonLord — microprotótipo Crédito de Guerra v0.2
 * 34 Raças + 28 Itens + 8 Decretos = 70 cartas
 */

const MICRO_RACES_BASE = [
  { id: 'R01', name: 'Harpia', sex: 'Feminino', pv: 3, atk: 4, int: 2, cost: 4, trait: 'Voador', art: '🦅', effect: '—' },
  { id: 'R02', name: 'Gárgula', sex: 'Neutro', pv: 5, atk: 3, int: 1, cost: 4, trait: 'Voador', art: '🗿', effect: 'Enquanto estiver: +1 PV sob Terreno urbano.' },
  { id: 'R03', name: 'Morcego Infernal', sex: 'Masculino', pv: 2, atk: 2, int: 3, cost: 2, trait: 'Voador', art: '🦇', effect: 'Ao entrar: olhe a próxima Raça; devolva ao topo ou ao fundo.' },
  { id: 'R04', name: 'Mantícora', sex: 'Feminino', pv: 4, atk: 5, int: 2, cost: 5, trait: 'Voador', art: '🦂', effect: 'Ao entrar: um rival descarta 1 Raça de PV 2 ou menos.' },
  { id: 'R05', name: 'Golem', sex: 'Neutro', pv: 6, atk: 5, int: 1, cost: 5, trait: 'Bruto', art: '🪨', effect: 'Enquanto estiver: +1 PV se sua INT total for 5 ou menos.' },
  { id: 'R06', name: 'Goblin', sex: 'Masculino', pv: 2, atk: 2, int: 3, cost: 2, trait: 'Furtivo', art: '👺', effect: '—' },
  { id: 'R07', name: 'Gremlin Fiscal', sex: 'Masculino', pv: 2, atk: 1, int: 4, cost: 2, trait: 'Furtivo', art: '🧾', effect: 'Enquanto estiver: mantenha +1◆ sobre cada outra Raça sua.' },
  { id: 'R08', name: 'Ogro', sex: 'Masculino', pv: 5, atk: 6, int: 1, cost: 5, trait: 'Bruto', art: '👹', effect: '—' },
  { id: 'R09', name: 'Súcubo', sex: 'Feminino', pv: 3, atk: 3, int: 5, cost: 4, trait: 'Arcano', art: '😈', effect: 'Ao entrar: transfira para seu exército 1 Raça Masculina de contrato 3◆ ou menos controlada por um rival.' },
  { id: 'R10', name: 'Tritão', sex: 'Masculino', pv: 4, atk: 3, int: 2, cost: 3, trait: 'Nadador', art: '🔱', effect: '—' },
  { id: 'R11', name: 'Kobold', sex: 'Masculino', pv: 2, atk: 1, int: 4, cost: 2, trait: 'Furtivo', art: '🐲', effect: 'Enquanto estiver: +1 INT se controlar outro Furtivo.' },
  { id: 'R12', name: 'Minotauro', sex: 'Masculino', pv: 5, atk: 5, int: 2, cost: 5, trait: 'Bruto', art: '🐂', effect: '—' },
  { id: 'R13', name: 'Espectro', sex: 'Neutro', pv: 2, atk: 2, int: 4, cost: 3, trait: 'Arcano', art: '👻', effect: 'Ignora penalidades de Terreno físico.' },
  { id: 'R14', name: 'Slime', sex: 'Neutro', pv: 4, atk: 2, int: 1, cost: 2, trait: 'Nadador', art: '🟢', effect: '—' },
  { id: 'R15', name: 'Lagáxido', sex: 'Masculino', pv: 3, atk: 2, int: 3, cost: 3, trait: 'Nadador', art: '🦎', effect: 'Ao entrar: Goblins ficam −2 ATK até o fim da rodada.' },
  { id: 'R16', name: 'Diabrete', sex: 'Masculino', pv: 2, atk: 3, int: 3, cost: 3, trait: 'Arcano', art: '🔥', effect: '—' },
  { id: 'R17', name: 'Centauro', sex: 'Masculino', pv: 4, atk: 4, int: 2, cost: 4, trait: 'Batedor', art: '🐎', effect: 'Enquanto estiver: outras Raças recebem +1 ATK na rodada em que entram.' },
];

const MICRO_RACES = MICRO_RACES_BASE.flatMap((race) =>
  [1, 2].map((copy) => ({ ...race, id: `${race.id}-${copy}` }))
);

const MICRO_ITEMS_BASE = [
  { id: 'I01', name: 'Cidade Natal Destruída', type: 'Terreno', icon: '🏚', copies: 2, effect: 'Harpias ficam −2 ATK. Novos contratos de Harpia recebem −1◆.' },
  { id: 'I02', name: 'Praga no Pântano', type: 'Terreno', icon: '☣', copies: 2, effect: 'Raças Nadadoras ficam −2 PV enquanto este Terreno estiver ativo.' },
  { id: 'I03', name: 'Forja Abissal Aberta', type: 'Terreno', icon: '⚒', copies: 2, effect: 'Brutos ficam +1 ATK. Novos contratos de Bruto recebem +1◆.' },
  { id: 'I04', name: 'Auditoria Infernal', type: 'Campo individual', icon: '📜', copies: 2, effect: 'Adicione +1◆ a cada contrato do alvo. Remova ao descartar este Campo.' },
  { id: 'I05', name: 'Suborno de Clã', type: 'Roubo', icon: '🤝', copies: 2, effect: 'Roube 1 Raça de contrato 3◆ ou menos. Suas moedas acompanham a carta.' },
  { id: 'I06', name: 'Espionagem', type: 'Roubo', icon: '👁', copies: 1, effect: 'Roube 1 Item aleatório da mão de um rival.' },
  { id: 'I07', name: 'Transferência Compulsória', type: 'Intriga', icon: '↔', copies: 1, effect: 'Mova 1 Raça sua para o exército alvo. Ele assume a carta e o contrato.' },
  { id: 'I08', name: 'Deserção Planejada', type: 'Intriga', icon: '🏃', copies: 2, effect: 'Dispense 1 Raça sua sem gastar ação e compre 1 Item.' },
  { id: 'I09', name: 'Interrogatório Real', type: 'Intriga', icon: '❓', copies: 1, effect: 'Um rival revela seu Decreto até o fim da rodada.' },
  { id: 'I10', name: 'Realocar Missão', type: 'Intriga', icon: '✉', copies: 1, effect: 'Alvo que ainda não declarou coloca o Decreto no fundo e compra outro.' },
  { id: 'I11', name: 'Contrato Falso', type: 'Armadilha', icon: '⚠', copies: 2, effect: 'Reação: a próxima Raça recrutada pelo alvo recebe +2◆ de Verba.' },
  { id: 'I12', name: 'Propaganda de Guerra', type: 'Intriga', icon: '📣', copies: 2, effect: 'Escolha 1 Raça sua: seu traço conta duas vezes até o fim da rodada.' },
  { id: 'I13', name: 'Forja Portátil', type: 'Equipamento', icon: '⚙', copies: 2, effect: 'Anexe a uma Raça Bruta: ela recebe +2 ATK.' },
  { id: 'I14', name: 'Armadilha de Laço', type: 'Armadilha', icon: '🪤', copies: 2, effect: 'Reação: cancele um recrutamento. A Raça permanece no mercado.' },
  { id: 'I15', name: 'Treinamento Real', type: 'Buff', icon: '📚', copies: 2, effect: 'Suas Raças recebem +1 INT até o fim da rodada.' },
  { id: 'I16', name: 'Escudo de Pedra', type: 'Equipamento', icon: '🛡', copies: 2, effect: 'Anexe a 1 Raça: ela recebe +3 PV.' },
];

const MICRO_ITEMS = MICRO_ITEMS_BASE.flatMap((item) =>
  Array.from({ length: item.copies }, (_, index) => ({
    ...item,
    id: `${item.id}-${index + 1}`,
  }))
);

const MICRO_DECREES = [
  { id: 'D01', name: 'Legião dos Céus', budget: 18, requirements: ['3+ Voador', 'PV total 12+', 'INT total 8+'] },
  { id: 'D02', name: 'Tritões do Abismo', budget: 15, requirements: ['2+ Nadador', 'ATK total 10+', '3+ Raças'] },
  { id: 'D03', name: 'Punho de Pedra', budget: 20, requirements: ['2+ Bruto', 'ATK total 16+', 'INT total 6 ou menos'] },
  { id: 'D04', name: 'Esquadra Mista', budget: 16, requirements: ['4+ Raças diferentes', 'PV total 14+', 'ATK total 12+'] },
  { id: 'D05', name: 'Companhia Econômica', budget: 12, requirements: ['4+ Raças', 'Verba média 3◆ ou menos', 'INT total 10+'] },
  { id: 'D06', name: 'Corte Arcana', budget: 18, requirements: ['2+ Arcano', 'INT total 16+', 'PV total 10+'] },
  { id: 'D07', name: 'Força Bruta', budget: 17, requirements: ['ATK total 20+', 'PV total 14+', 'INT total 10 ou menos'] },
  { id: 'D08', name: 'Exército Equilibrado', budget: 16, requirements: ['PV total 12+', 'ATK total 12+', 'INT total 12+', '4+ Raças'] },
];

const MICRO_COUNTS = {
  races: MICRO_RACES.length,
  items: MICRO_ITEMS.length,
  decrees: MICRO_DECREES.length,
  total: MICRO_RACES.length + MICRO_ITEMS.length + MICRO_DECREES.length,
};
