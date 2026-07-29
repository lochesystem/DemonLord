# DemonLord — relatório automático v0.2.1

Gerado em 2026-07-28T18:59:13.079Z.

> Escopo: atributos, contratos, orçamento, mercado de 6 Raças e recrutamento por bots.
> Táticas, habilidades de Raça, negociação, sabotagem e leitura humana ainda não entram nesta linha de base.

## Viabilidade exata dos Decretos

| Decreto | Possível | Soluções | Menor Verba | Menos Raças | Exemplo mínimo |
|---|---:|---:|---:|---:|---|
| D01 — Legião dos Céus | Sim | 4.339 | 10◆ | 4 | Gárgula, Morcego Infernal, Morcego Infernal, Slime |
| D02 — Tritões do Abismo | Sim | 1.252 | 10◆ | 4 | Slime, Slime, Lagáxido, Cão Infernal |
| D03 — Punho de Pedra | Sim | 2.627 | 11◆ | 3 | Orc Berserker, Orc Berserker, Cão Infernal |
| D04 — Esquadra Mista | Sim | 18.592 | 10◆ | 4 | Goblin, Tritão, Slime, Cão Infernal |
| D05 — Companhia Econômica | Sim | 42 | 10◆ | 4 | Gremlin Fiscal, Kobold, Espectro, Diabrete |
| D06 — Corte Arcana | Sim | 12.831 | 11◆ | 4 | Tritão, Kobold, Espectro, Diabrete |
| D07 — Força Bruta | Sim | 8.226 | 13◆ | 3 | Ogro, Cão Infernal, Troll de Guerra |
| D08 — Exército Equilibrado | Sim | 19.063 | 11◆ | 4 | Goblin, Kobold, Centauro, Cão Infernal |

## Partidas-bot

| Jogadores | Partidas | Conclusão | Rodadas média | Mediana | P90 | Alguma rodada sem recrutar |
|---:|---:|---:|---:|---:|---:|---:|
| 3 | 20.000 | 94.5% | 2.07 | 2 | 2 | 5.6% |
| 4 | 20.000 | 99.0% | 2.03 | 2 | 2 | 1.1% |
| 5 | 20.000 | 99.8% | 2.01 | 2 | 2 | 0.2% |

### Taxa de vitória quando o Decreto foi distribuído

| Decreto | 3 jogadores | 4 jogadores | 5 jogadores |
|---|---:|---:|---:|
| D01 — Legião dos Céus | 22.0% | 17.1% | 14.1% |
| D02 — Tritões do Abismo | 24.4% | 27.7% | 29.2% |
| D03 — Punho de Pedra | 45.1% | 36.0% | 26.8% |
| D04 — Esquadra Mista | 36.8% | 23.0% | 14.0% |
| D05 — Companhia Econômica | 23.5% | 28.1% | 31.3% |
| D06 — Corte Arcana | 26.5% | 19.1% | 15.4% |
| D07 — Força Bruta | 37.4% | 23.8% | 14.1% |
| D08 — Exército Equilibrado | 36.4% | 23.1% | 14.6% |

## Como interpretar

- Muitas soluções matemáticas não significam necessariamente um Decreto fácil: a oferta do mercado também importa.
- A taxa de vitória de cada Decreto considera apenas as partidas em que ele foi distribuído e inclui a competição pelos mesmos monstros.
- Bots não blefam e não negociam. Os números servem para localizar assimetrias grosseiras, não para declarar o balanceamento final.
- O perfil v0.2.1 já estrutura todas as habilidades; efeitos interativos ainda entram gradualmente no motor.

