# DemonLord — kit raster em camadas v0.5

Este modelo não desenha a carta com CSS. Cada elemento visual é uma imagem raster independente e reutilizável.

## Cartas concluídas

- R01 — Harpia
- R03 — Morcego Infernal
- R04 — Mantícora
- R09 — Súcubo
- I04 — Auditoria Infernal
- D01 — Legião dos Céus

Todas são exportadas em `1050 × 1500 px` dentro de `exports/`.

A prancha `conjunto-completo-frentes-e-versos-v0.5.png` apresenta cada
carta ao lado do verso correspondente ao seu baralho: Raças, Itens ou
Decretos. A prancha anterior somente com as frentes continua disponível.

## Camadas

1. `components/pergaminho-base.png` — fundo.
2. `art/` — somente a ilustração do monstro.
3. `components/normalized/borda-raca.png` — moldura transparente.
4. Medalhão de custo, cápsulas de atributo e placas.
5. Textos e números rasterizados na montagem.
6. Faixa de traço e tag universal de ID.

Os arquivos em `components/chroma/` são as gerações originais. Os arquivos em `components/alpha/` tiveram o chroma key removido. `components/normalized/` contém as peças aparadas, prontas para montagem.

## Padrão

- Prancheta: `1050 × 1500 px`.
- A mesma cápsula é reutilizada para PV, ATK e INT.
- A tag de ID é a mesma em Raça, Item e Decreto.
- Títulos podem reduzir o corpo da fonte, mas a placa e sua posição permanecem estáveis.
- A IA nunca gera textos, números ou regras dentro dos componentes.

## Mapas

- `layers-race.json`
- `layers-item.json`
- `layers-decree.json`
- `cards-data.json` — conteúdo variável das seis cartas.

## Regerar

```bash
node prepare-components.mjs
node assemble-all.mjs
node render-set.mjs
```
