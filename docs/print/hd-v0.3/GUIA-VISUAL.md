# DemonLord — modelo visual HD v0.3

Este diretório contém o modelo visual consolidado das cartas. A versão v0.3
substitui os estudos anteriores para novas produções.

## Elementos invariáveis

- Formato vertical em proporção aproximada de `0,70`.
- Aro carvão/preto com filetes em ouro antigo e pergaminho quente.
- Títulos em caixa-alta, com a mesma família tipográfica desenhada.
- `◆` mecânico sempre dourado: representa Verba, orçamento ou contrato.
- Rubis vermelhos e acentos turquesa, roxo ou carmesim são ornamentais.
- Margem segura constante e leitura clara a distância.

## Tag universal de identificação

Todas as frentes usam exatamente o mesmo componente no centro da borda inferior:

- hexágono horizontal curto;
- fundo carvão quase preto;
- filete duplo em ouro antigo;
- código em marfim, caixa-alta e tipografia condensada;
- mesma escala e alinhamento;
- nenhuma cor específica do tipo.

Somente o conteúdo muda: `R00` para Raça, `T00` para Tática e `D00` para Decreto.
Em Raças, a placa do traço sobe o necessário e a tag se encaixa abaixo dela sem
invadir o texto nem a área de corte.

## Sexo das Raças

Raças usam `♂`, `♀` ou o símbolo neutro em preto, pequeno e sem medalhão. O
símbolo fica na área livre de pergaminho abaixo da coluna de atributos e à
esquerda da habilidade. Nunca substitui um atributo.

## Versos

`verso-raca.png` é o mestre de composição. Tática e Decreto mantêm a mesma placa
`DEMONLORD`, tipografia, escala e geometria, variando somente cor secundária,
brasão e nome do tipo.

## Arquivos oficiais

- `frente-raca-morcego-infernal-r03.png`
- `frente-raca-manticora-r04.png`
- `frente-raca-sucubo-r09.png`
- `t04-auditoria-infernal.png`
- `frente-decreto-legiao-dos-ceus-d01.png`
- `verso-raca.png`
- `verso-tatica.png`
- `verso-decreto.png`

As imagens são mestres de aparência. No baralho completo, tag, textos, ícones e
moldura devem ser montados como camadas determinísticas no template para
garantir repetição pixel a pixel.

Os versos oficiais agora são exportados pelo montador raster
`../hd-raster-v0.5/assemble-backs.mjs`. As três artes, a moldura universal e a
placa vazia ficam separadas em `components/backs/`; o texto do tipo vem de
`back-data.json`.
