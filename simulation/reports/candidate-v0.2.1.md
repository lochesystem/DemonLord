# DemonLord — relatório automático v0.2.1

Gerado em 2026-07-29T22:45:52.818Z.

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
| D07 — Força Bruta | Sim | 8.226 | 13◆ | 3 | Orc Gordo, Cão Infernal, Troll de Guerra |
| D08 — Exército Equilibrado | Sim | 19.063 | 11◆ | 4 | Goblin, Kobold, Centauro, Cão Infernal |

## Partidas-bot

| Jogadores | Partidas | Conclusão | Rodadas média | Mediana | P90 | Alguma rodada sem recrutar |
|---:|---:|---:|---:|---:|---:|---:|
| 3 | 10.000 | 94.3% | 2.06 | 2 | 2 | 5.8% |
| 4 | 10.000 | 99.0% | 2.03 | 2 | 2 | 1.0% |
| 5 | 10.000 | 99.8% | 2.01 | 2 | 2 | 0.2% |

### Taxa de vitória quando o Decreto foi distribuído

| Decreto | 3 jogadores | 4 jogadores | 5 jogadores |
|---|---:|---:|---:|
| D01 — Legião dos Céus | 22.3% | 17.5% | 13.9% |
| D02 — Tritões do Abismo | 24.8% | 27.5% | 28.8% |
| D03 — Punho de Pedra | 44.8% | 35.7% | 26.4% |
| D04 — Esquadra Mista | 36.6% | 23.0% | 14.4% |
| D05 — Companhia Econômica | 23.7% | 28.6% | 31.5% |
| D06 — Corte Arcana | 26.0% | 18.7% | 15.3% |
| D07 — Força Bruta | 37.8% | 23.6% | 14.2% |
| D08 — Exército Equilibrado | 35.8% | 23.6% | 15.1% |

## Como interpretar

- Muitas soluções matemáticas não significam necessariamente um Decreto fácil: a oferta do mercado também importa.
- A taxa de vitória de cada Decreto considera apenas as partidas em que ele foi distribuído e inclui a competição pelos mesmos monstros.
- Bots não blefam e não negociam. Os números servem para localizar assimetrias grosseiras, não para declarar o balanceamento final.
- O perfil v0.2.1 já estrutura todas as habilidades; efeitos interativos ainda entram gradualmente no motor.

