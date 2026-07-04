Embora o endpoint do EVA traga o preço em BTC, existem três motivos para você monitorar o Bitcoin de forma independente:

- **Cálculo de SATS**: O Coingecko nem sempre retorna `sats` como uma `vs_currency` estável para todos os tokens. Ter o preço real do BTC/USD permite que seu Backend I calcule SATS de forma infalível:
  - 1 BTC = 100.000.000 SATS
  - Sendo assim, seu Backend I faz: `(Preço_EVA_em_BTC * 100.000.000)` para garantir o valor de SATS, sem depender de arredondamentos da API.

- **Fidelidade do Lastro**: O EVA tem um modelo de "BTC floor price" (preço mínimo em BTC que sobe diariamente). Monitorar o par BTC/BRL isoladamente permite que você valide se a valorização que está vendo no EVA é um ganho real perante o Bitcoin ou apenas uma flutuação do mercado de câmbio (BRL/USD).

- **Redundância de Status**: Se o par EVA/BTC apresentar alguma anomalia de liquidez na exchange (o que pode acontecer com tokens menores), você ainda tem o preço global do Bitcoin para manter o sistema funcional para as outras conversões.
