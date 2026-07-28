# DemonLord — impacto inicial da negociação v0.2.1

20.000 pares de partidas com quatro jogadores e a mesma ordem inicial de cartas.

| Métrica | Sem negociação | Com negociação |
|---|---:|---:|
| Partidas concluídas | 98.9% | 99.4% |
| Rodadas médias | 2.03 | 2.02 |
| Vencedor não liderava após a 1ª rodada | 64.2% | 64.7% |
| Houve mudança de liderança | 74.7% | 74.8% |
| Partidas com ao menos uma troca | — | 15.4% |
| Vencedor participou de uma troca | — | 6.2% |

A negociação mudou a identidade do vencedor em **5.3%** dos pares comparáveis.

## Cenário com no máximo um recrutamento por turno

| Métrica | Sem negociação | Com negociação |
|---|---:|---:|
| Partidas concluídas | 99.1% | 99.5% |
| Rodadas médias | 3.68 | 3.60 |
| Vencedor não liderava após a 1ª rodada | 58.0% | 53.7% |
| Partidas com ao menos uma troca | — | 52.7% |
| Vencedor participou de uma troca | — | 30.1% |

Com o ritmo reduzido, a negociação mudou o vencedor em **19.6%** dos pares comparáveis.

## Hipóteses desta simulação

- Bots conhecem o valor que cada Raça possui para o outro jogador durante a proposta.
- Somente trocas de uma Raça por uma Raça são consideradas.
- A troca custa uma ação do jogador ativo e é limitada a uma por turno.
- Ambos só aceitam quando seu progresso estimado melhora.

Este é um teto otimista para acordos racionais. Blefe, promessas, Itens e kingmaking ainda exigem playtest humano.

