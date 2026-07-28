const CARD_DATA = [
  {
    kind: "race",
    id: "R01",
    name: "Harpia",
    cost: 4,
    pv: 3,
    atk: 4,
    int: 2,
    sex: "♀",
    sexLabel: "Feminino",
    trait: "Voador",
    effect: "<b>ENQUANTO ESTIVER:</b> RECEBE +1 ATK SE VOCÊ CONTROLAR OUTRO VOADOR.",
    art: "assets/fonte-harpia-r01.png",
    artClass: "art--harpia"
  },
  {
    kind: "race",
    id: "R03",
    name: "Morcego Infernal",
    cost: 2,
    pv: 2,
    atk: 2,
    int: 3,
    sex: "♂",
    sexLabel: "Masculino",
    trait: "Voador",
    effect: "<b>AO ENTRAR:</b> OLHE A PRÓXIMA RAÇA; DEVOLVA AO TOPO OU AO FUNDO.",
    art: "assets/arte-morcego-infernal-r03-v2.png",
    artClass: "art--morcego"
  },
  {
    kind: "race",
    id: "R04",
    name: "Mantícora",
    cost: 5,
    pv: 4,
    atk: 5,
    int: 2,
    sex: "♀",
    sexLabel: "Feminino",
    trait: "Voador",
    effect: "<b>AO ENTRAR:</b> EXPULSE DO EXÉRCITO ALVO 1 RAÇA COM PV 2 OU MENOS.",
    art: "assets/fonte-manticora-r04.png",
    artClass: "art--manticora"
  },
  {
    kind: "race",
    id: "R09",
    name: "Súcubo",
    cost: 4,
    pv: 3,
    atk: 3,
    int: 5,
    sex: "♀",
    sexLabel: "Feminino",
    trait: "Arcano",
    effect: "<b>AO ENTRAR:</b> TRANSFIRA PARA SEU EXÉRCITO 1 RAÇA MASCULINA DE <span class=\"nowrap\">CONTRATO 3<span class=\"resource\">◆</span> OU MENOS</span> CONTROLADA POR UM RIVAL.",
    art: "assets/fonte-sucubo-r09.png",
    artClass: "art--sucubo"
  },
  {
    kind: "item",
    id: "I04",
    type: "Campo individual",
    name: "Auditoria Infernal",
    effect: "ADICIONE +1<span class=\"resource\">◆</span> A CADA CONTRATO DO ALVO.<br>REMOVA AO DESCARTAR ESTE CAMPO.",
    art: "assets/fonte-auditoria-i04.png",
    artClass: "art--auditoria"
  },
  {
    kind: "decree",
    id: "D01",
    type: "Decreto secreto",
    name: "Legião dos Céus",
    budget: 18,
    requirements: [
      "<strong>3+</strong><span>VOADOR</span>",
      "<span>PV TOTAL</span><strong>12+</strong>",
      "<span>INT TOTAL</span><strong>8+</strong>"
    ],
    art: "assets/fonte-legiao-d01.png",
    artClass: "art--legiao"
  }
];
