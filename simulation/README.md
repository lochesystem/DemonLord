# Simulação automática do DemonLord

Linha de base executável para detectar falhas matemáticas antes do playtest
humano.

## Executar

```bash
node --test engine.test.cjs
node analyze.cjs
DEMONLORD_PROFILE=v0.2.1 node analyze.cjs
node analyze-negotiation.cjs
```

Para mudar a quantidade de partidas por configuração:

```bash
DEMONLORD_RUNS=50000 node analyze.cjs
```

Os resultados são gravados em:

- `reports/baseline.md`
- `reports/baseline.json`
- `reports/candidate-v0.2.1.md`
- `reports/candidate-v0.2.1.json`
- `reports/negotiation-v0.2.1.md`
- `reports/negotiation-v0.2.1.json`

## Escopo atual

- perfil histórico v0.2 com 17 espécies;
- perfil candidato v0.2.1 com 21 espécies e duas cópias de cada;
- oito Decretos;
- orçamento e Verba comprometida;
- mercado com seis espaços e reposição imediata;
- bots que buscam melhorar o próprio Decreto;
- partidas com 3, 4 e 5 jogadores;
- invariantes de recrutamento, transferência, dispensa e Auditoria.

Ainda não são simulados Táticas, habilidades das Raças, negociação, blefe,
reações ou interpretação humana dos textos. Esses sistemas devem entrar
incrementalmente depois que a linha de base matemática estiver estável.
