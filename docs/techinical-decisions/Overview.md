Eva Station será um site para consulta de preços (USD, BTC, BRL, SATS e EVA).

Esse site surgiu da necessidade de abrir multiplas abas no navegador para consulta de preços toda vez que eu ia comprar o token EVA (evervalue coin).

### Arquitetura geral

O EVA Station será composto por: 
- Um sistema frontend
- Dois sistemas backend
- Um banco de dados

Esse sistemas dependem da API do coingecko para consulta de preços: 
https://api.coingecko.com/api/v3

O comportamento do sistema será: 
- Usuário consulta Frontend
- Frontend consulta Backend I
- Backend I consulta banco de dados e responde ao Frontend
- Database armazena preços e status da Coingecko API
- Backend II consulta a Coingecko API e escreve no Database

No futuro o sistema vai buscar dados on-chain, e as consultas para API da Coingecko passarão a ser um fallback (quando não for possível estabelecer conexão on-chain). 

--- 
### Comportamento

**Frontend**: 
- Deve exibir um formulário com os inputs: BTC, USD, EVA, BRL e SATS
- Cada input deve refletir os preços atualizados
- Ao modificar o valor em um dos inputs, os outros inputs devem ser atualizados com a conversão correspondente. 
	- Por exemplo: ao digitar R$ 100,00 no input BRL, os valores de USD, BTC, EVA e SATS devem ser o equivalente a R$ 100,00 convertidos para cada moeda.

**Backend I:**
- Deve fazer todos os cálculos de conversão (se necessário) e entregar a informação pronta para o Frontend.
- Deve consultar o Database para ler/obter informações de preço.
- Deve consultar o Database para ler/obter informações de status.

**Database**: 
- Deve armazenar o valor dos preços (USD, BRL, SATS, EVA e BTC)
- Deve armazenar o status da Coingecko API.
- Pode fornecer informações (preços e status) para Backend I.
- Pode ser alterado (preços e status) por Backend II.

**Backend II**:
- Deve consultar a Coingecko API para obter os valores de preço atualizados.
- Deve consultar a Coingecko API para obter o status da API atualizado.
- Deve realizar as consultas de preço e status periodicamente (a cada 5 min) a fim de manter a fidelidade dos dados, como um cronjob.
- Deve escrever no Database os dados (preços e status) atualizados.

**Coingecko API endpoints**:
- Para consultar status: https://api.coingecko.com/api/v3/ping 
- Para consultar preço BTC (USD e BRL): https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd,brl
- Para consultar preço EVA (USD, BRL, BTC e SATS): https://api.coingecko.com/api/v3/simple/price?ids=evervalue-coin&vs_currencies=usd,brl,btc,sats