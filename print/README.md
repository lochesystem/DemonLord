# DemonLord — Kit de impressão (Print & Play)

Arquivos prontos para protótipo e envio à gráfica. Abra no **Chrome** ou **Edge**, use **Imprimir → Salvar como PDF** com **gráficos de fundo ativados** e margens **nenhuma**.

## Arquivos

| Arquivo | Conteúdo |
|---------|----------|
| [index.html](index.html) | Índice do kit |
| [cartas.html](cartas.html) | Todas as cartas (frentes + verso) |
| [tabuleiro.html](tabuleiro.html) | Tabuleiro central + folha de referência |

## Especificações técnicas (para a gráfica)

### Cartas — tamanho Poker (padrão board game)

| Medida | Valor |
|--------|-------|
| **Corte final (trim)** | 63,5 × 88,9 mm (2,5" × 3,5") |
| **Sangria (bleed)** | 3 mm por lado |
| **Arquivo com sangria** | 69,5 × 94,9 mm por carta |
| **Área segura** | 3 mm dentro da linha de corte |
| **Papel sugerido** | 300 g/m² cartão (ou 250 g/m² mínimo) |
| **Acabamento** | Fosco ou sem laminação (protótipo) |
| **Páginas PDF** | A4, 9 cartas por folha (grade 3×3) |

### Tabuleiro

| Medida | Valor |
|--------|-------|
| **Formato** | A3 paisagem (420 × 297 mm) |
| **Sangria** | 3 mm (arquivo 426 × 303 mm se a gráfica pedir) |
| **Papel sugerido** | 200–250 g/m² ou impressão em adesivo / papel couché |

### Fichas de Influência (opcional)

Imprima a página de fichas no final de `cartas.html` em papel mais fino (180 g) ou use contadores de outro jogo.

## Contagem do MVP

| Tipo | Quantidade |
|------|------------|
| Recursos (Ouro / Comida / Militar) | 60 |
| Mercado | 40 |
| Missão (fases) | 12 |
| Heróis | 8 |
| Mandatos secretos | 24 |
| Decretos reais | 20 |
| Verso de carta | 1 arte (repetir) |

## Montagem

1. Imprima **verso** das cartas primeiro (espelhado se impressão frente-e-verso automática).
2. Alinhe e corte na linha de corte (guilhotina ou estilete + régua).
3. Mandatos: mesmo verso das outras cartas ou verso liso.
4. Tabuleiro: laminar opcional para durabilidade.

## Enviar à gráfica

Envie os PDFs gerados com esta tabela:

```
Produto: Cartas DemonLord v0.1
Formato corte: 63,5 x 88,9 mm
Sangria: 3 mm
Quantidade: [ver tabela acima]
Papel: Cartão 300g fosco
```

```
Produto: Tabuleiro DemonLord v0.1
Formato: A3 paisagem
Papel: Couché 250g ou cartão 200g
```
