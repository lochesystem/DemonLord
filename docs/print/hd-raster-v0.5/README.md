# DemonLord — kit raster em camadas v0.5

Este modelo não desenha a carta com CSS. Cada elemento visual é uma imagem raster independente e reutilizável.

## Cartas concluídas

- R01 — Harpia
- R03 — Morcego Infernal
- R04 — Mantícora
- R09 — Súcubo
- T04 — Auditoria Infernal
- D01 — Legião dos Céus

Todas são exportadas em `1050 × 1500 px` dentro de `exports/`.

A prancha `conjunto-completo-frentes-e-versos-v0.5.png` apresenta cada
carta ao lado do verso correspondente ao seu baralho: Raças, Táticas ou
Decretos. A prancha anterior somente com as frentes continua disponível.

## Versos componentizados

Os três versos são montados em raster, sem CSS e sem texto incorporado à placa
do tipo. Cada baralho possui uma arte raster isolada; a placa, o texto e a
moldura seguem os mesmos componentes e coordenadas.

1. `components/backs/types/artwork-*.png` — arte completa e isolada de Raça,
   Tática ou Decreto.
2. `components/backs/common/type-plaque-blank.png` — placa inferior vazia com
   transparência.
3. `back-data.json` — nomes exibidos pelo montador.
4. `components/backs/common/frame-universal.png` — mesma borda aplicada por
   último nos três baralhos.
5. `components/backs/source/` — fontes imutáveis usadas somente para reextrair
   componentes, evitando degradação cumulativa.
6. `components/backs/labels/` — rótulos raster montados com os glifos dos
   versos originais; preservam a tipografia desenhada sem depender de fonte
   substituta.

O mapa `layers-back.json` registra dimensões e posições fixas. A prancha
`exports/biblioteca-componentes-versos.png` mostra a biblioteca separada.

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
- A tag de ID é a mesma em Raça, Tática e Decreto.
- Títulos podem reduzir o corpo da fonte, mas a placa e sua posição permanecem estáveis.
- A IA nunca gera textos, números ou regras dentro dos componentes.

## Mapas

- `layers-race.json`
- `layers-item.json` — nome técnico legado; representa o template de Tática
- `layers-decree.json`
- `cards-data.json` — conteúdo variável das seis cartas.

## Regerar

```bash
node prepare-components.mjs
node assemble-all.mjs
node extract-back-components.mjs
node process-back-components.mjs
node build-back-label-components.mjs
node assemble-backs.mjs
node render-back-library.mjs
node render-set.mjs
```

`extract-back-components.mjs` e `process-back-components.mjs` só precisam ser
executados quando a biblioteca de componentes mudar. Para alterar apenas nome,
arte ou ordem das camadas, edite `back-data.json` ou substitua
`components/backs/types/artwork-{tipo}.png` e rode `assemble-backs.mjs`.

## Mestre para gráfica

O diretório `print-master/` contém a versão normalizada para produção:

- formato Poker com corte final de `63,5 × 88,9 mm`;
- sangria de `3 mm` em todos os lados;
- página de `69,5 × 94,9 mm`;
- área segura de `3 mm` para dentro do corte;
- mestres PNG em `1642 × 2242 px`, com metadado de `600 dpi`;
- PDFs com `MediaBox`, `BleedBox`, `TrimBox` e `ArtBox`;
- arte reenquadrada proporcionalmente, sem esticar nem cortar conteúdo;
- margem carvão ao redor da moldura para absorver variações de corte.

Os PNGs são os mestres sem perdas. As cópias JPEG em qualidade 96 e amostragem
de cor 4:4:4 são usadas somente dentro dos PDFs para manter o pacote em tamanho
viável sem perda visual relevante.

Para regenerar:

```bash
node build-print-masters.mjs
/Users/aloche/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 build-print-pdfs.py
/Users/aloche/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 verify-print-master.py
```

Antes de converter para CMYK, solicite à gráfica o perfil ICC correto. Não há
uma conversão CMYK universal que seja segura para todos os fornecedores.
