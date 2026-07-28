# DemonLord — sistema de cartas v0.4

Este diretório separa a **ilustração** da **interface da carta**. A imagem gerada nunca deve conter moldura, título, texto, atributos, símbolos ou identificador.

## Anatomia fixa

- Prancheta lógica: `700 × 1000`.
- Área segura da borda: `37 px`.
- Identificador universal: `150 × 34`, centralizado em `x=275`, `bottom=12`.
- A tag de ID é idêntica em Raça, Item e Decreto: carvão, contorno duplo ouro-antigo e texto marfim.
- A faixa de traço da Raça termina em `bottom=51`; não compartilha área com a tag.
- Símbolo de sexo: `42 × 42`, discreto, em coordenada própria. Não pertence à coluna de atributos.
- Verba/contrato/orçamento usa sempre `◆` dourado. Rubis e outras gemas são somente decoração da moldura.

## Componentes

- `CARD_DATA`, em `cards-data.js`, contém apenas conteúdo e referência de arte.
- `cards.js` escolhe o template por tipo e injeta o conteúdo.
- `cards.css` contém medidas e aparência. Alterar uma medida compartilhada atualiza todo o conjunto.
- `index.html` contém os templates sem conteúdo específico.

## Regra para novas artes

Gerar em proporção vertical, sem texto nem interface, com margem de recorte. A arte deve comunicar personalidade e mundo — nunca diagramar literalmente o efeito mecânico.

## Morcego Infernal

A nova arte mostra um morcego infernal com anatomia animal, pendurado em uma gárgula. O humor vem do comportamento e da capa presa na pedra; não existem papéis, setas, balões ou explicações visuais da habilidade.

## Identificadores deste conjunto

- R01 — Harpia
- R03 — Morcego Infernal
- R04 — Mantícora
- R09 — Súcubo
- I04 — Auditoria Infernal
- D01 — Legião dos Céus
