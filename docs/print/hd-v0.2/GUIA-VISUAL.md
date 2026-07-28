# DemonLord — guia visual dos modelos HD v0.2

Este conjunto define a direção visual das três famílias principais de cartas.
As imagens são mestres de aparência para validação; a produção do baralho
completo deve reproduzir a moldura e a tipografia de forma determinística no
template HTML/CSS.

## Estrutura fixa da família

- Formato vertical com proporção aproximada de `0,70`.
- Aro externo largo em carvão/preto.
- Filete duplo em ouro antigo, com acabamento levemente gasto.
- Cantos recortados e quatro rubis vermelhos nos extremos.
- Pergaminho quente no interior e contornos grossos em tinta preta.
- Título em caixa-alta, grande e legível.
- Nas cartas de Raça, o sexo é indicado apenas por um símbolo pequeno (`♂`,
  `♀` ou neutro) na área livre de pergaminho abaixo da coluna de atributos e à
  esquerda da caixa de habilidade. Não usar texto, medalhão ou moldura. O traço
  permanece sozinho e perfeitamente centralizado na placa inferior.
- Toda frente possui identificador no formato `R00`, `I00` ou `D00`. Ele fica
  pequeno e centralizado em uma faixa neutra de pergaminho imediatamente acima
  da borda inferior, sempre na mesma coordenada vertical. Usa tinta preta, a
  mesma tipografia e o mesmo tamanho em todos os tipos. Não usar placas,
  contornos ou cores diferentes para o identificador.
- O símbolo `◆` significa sempre Verba/contrato e usa **ouro** em todas as
  frentes. Rubis vermelhos dos cantos e acentos turquesa, roxos ou carmesim são
  decorativos e nunca substituem o símbolo dourado de Verba.
- Nos versos, o modelo de `verso-raca.png` é o mestre oficial. A placa,
  posição, escala e tipografia de `DEMONLORD` devem ser reproduzidas sem
  alterações em todos os tipos.
- Margem de segurança constante para que texto e símbolos não encostem no corte.
- Humor visual irreverente, formas expressivas e leitura rápida; evitar
  realismo sombrio e excesso de microdetalhes.

## Identidade por tipo

| Tipo | Cor secundária | Símbolo principal | Função visual do verso |
| --- | --- | --- | --- |
| Raça | Roxo empoeirado e vinho | Monstro alado com chifres | Identificar o mercado/baralho de monstros |
| Item | Verde-petróleo e turquesa escuro | Contrato, ábaco e adaga | Identificar cartas de manipulação |
| Decreto | Carmesim e ouro | Coroa, pergaminho e selo | Identificar a missão secreta |

As diferenças entre os versos ficam restritas à cor secundária, ao brasão
central e ao nome do tipo. O aro preto, o ouro, os rubis, a placa de
`DEMONLORD`, sua tipografia e toda a geometria devem permanecer iguais.

## Arquivos

- `frente-raca-harpia-referencia.png`
- `frente-raca-manticora-efeito.png`
- `frente-raca-sucubo-r09.png`
- `frente-raca-sucubo-r09-v2.png` — posição aprovada para o símbolo de sexo
- `frente-item-auditoria-infernal.png`
- `frente-decreto-legiao-dos-ceus-v2.png`
- `verso-raca.png` — mestre oficial dos versos
- `verso-item-v2.png`
- `verso-decreto-v2.png`

Os arquivos de Item e Decreto sem o sufixo `v2` ficam preservados apenas como
histórico de exploração e não devem ser usados no baralho.

## Preparação para impressão

Os modelos têm aproximadamente `1050 × 1498 px`, resolução suficiente para
protótipos de alta definição. Antes de fechar a gráfica, o template final deve
receber sangria de 3 mm, área segura de 3 mm e exportação em 300 dpi no tamanho
físico escolhido.
