# DemonLord — relatório automático v0.2

Gerado em 2026-07-28T18:52:13.869Z.

> Escopo: atributos, contratos, orçamento, mercado de 6 Raças e recrutamento por bots.
> Táticas, habilidades de Raça, negociação, sabotagem e leitura humana ainda não entram nesta linha de base.

## Viabilidade exata dos Decretos

| Decreto | Possível | Soluções | Menor Verba | Menos Raças | Exemplo mínimo |
|---|---:|---:|---:|---:|---|
| D01 — Legião dos Céus | Sim | 3.225 | 10◆ | 4 | Gárgula, Morcego Infernal, Morcego Infernal, Slime |
| D02 — Tritões do Abismo | Sim | 3.422 | 9◆ | 3 | Ogro, Slime, Slime |
| D03 — Punho de Pedra | Sim | 188 | 14◆ | 3 | Ogro, Ogro, Centauro |
| D04 — Esquadra Mista | Sim | 9.477 | 12◆ | 4 | Tritão, Slime, Diabrete, Centauro |
| D05 — Companhia Econômica | Sim | 1.934 | 8◆ | 4 | Kobold, Kobold, Slime, Slime |
| D06 — Corte Arcana | Sim | 7.285 | 12◆ | 4 | Súcubo, Kobold, Espectro, Lagáxido |
| D07 — Força Bruta | NÃO | 0 | —◆ | — | Ogro, Ogro, Diabrete, Centauro (17◆; PV 16, ATK 19, INT 7) |
| D08 — Exército Equilibrado | Sim | 9.165 | 12◆ | 5 | Goblin, Goblin, Slime, Diabrete, Diabrete |

## Partidas-bot

| Jogadores | Partidas | Conclusão | Rodadas média | Mediana | P90 | Alguma rodada sem recrutar |
|---:|---:|---:|---:|---:|---:|---:|
| 3 | 10.000 | 96.9% | 2.19 | 2 | 3 | 3.8% |
| 4 | 10.000 | 99.4% | 2.08 | 2 | 2 | 0.8% |
| 5 | 10.000 | 99.9% | 2.03 | 2 | 2 | 0.1% |

### Taxa de vitória quando o Decreto foi distribuído

| Decreto | 3 jogadores | 4 jogadores | 5 jogadores |
|---|---:|---:|---:|
| D01 — Legião dos Céus | 24.3% | 14.9% | 9.7% |
| D02 — Tritões do Abismo | 64.3% | 59.7% | 53.7% |
| D03 — Punho de Pedra | 14.3% | 5.2% | 1.8% |
| D04 — Esquadra Mista | 37.9% | 23.5% | 12.2% |
| D05 — Companhia Econômica | 85.7% | 79.8% | 74.7% |
| D06 — Corte Arcana | 15.0% | 6.9% | 2.3% |
| D07 — Força Bruta | 0.0% | 0.0% | 0.0% |
| D08 — Exército Equilibrado | 16.3% | 8.9% | 4.3% |

## Como interpretar

- Muitas soluções matemáticas não significam necessariamente um Decreto fácil: a oferta do mercado também importa.
- A taxa de vitória de cada Decreto considera apenas as partidas em que ele foi distribuído e inclui a competição pelos mesmos monstros.
- Bots não blefam e não negociam. Os números servem para localizar assimetrias grosseiras, não para declarar o balanceamento final.
- Cartas com efeito `—` e efeitos ainda descritos apenas em texto precisam ser estruturados antes da segunda fase.

