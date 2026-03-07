# Backend terms

## Web2 concepts

### Rate limit

A rate limit is a maximum number of requests allowed in a given time window (for example, requests per second). It is used to protect infrastructure, prevent abuse, and keep services stable and fair for all users.

### SWR

SWR (stale-while-revalidate) is a data-fetching strategy and React library that returns cached data first, then revalidates in the background to fetch fresh data. It improves perceived performance and keeps UI data up to date with minimal manual state management.

### Dedup

Dedup (deduplication) is the process of avoiding duplicate requests for the same resource within a short time window. It reduces unnecessary network traffic, lowers backend load, and helps keep data-fetching behavior consistent across components.

### Exponential backoff

Exponential backoff is a retry strategy where the wait time between failed attempts increases exponentially (for example, 1s, 2s, 4s, 8s). It helps prevent overload during outages or rate limits and increases the chance of successful retries once the service recovers.

### Polling

Polling is a technique where the client requests updated data from a server or API at regular intervals (for example, every 5 seconds). It is useful when real-time updates are needed but push-basead solutions like WebSockets are not available.

### TTL

TTL (Time To Live) is the duration that cached data remains valid before it expires and must be refreshed. It helps balance performance and freshness by reducing repeated requests while preventing stale data from being used for too long.

### SSR

SSR (Server-Side Rendering) is a rendering approach where HTML is generated on the server for each request (or at render time on the server) before being sent to the browser. It improves initial page load and SEO, especially for content that should be visible immediately.

## Web3 concepts

### RPC

RPC (Remote Procedure Call) is the communication method your app uses to talk to a blockchain node. Through an RPC endpoint, you can read blockchain data (such as balances, blocks, and logs) and send transactions.

### ABIs

ABIs (Application Binary Interfaces) define how to interact with a smart contract. They describe the contract's functions, inputs, outputs, and events so applications and libraries can encode calls and decode responses correctly.

### EVM

EVM (Ethereum Virtual Machine) is the runtime environment where smart contracts are executed on Ethereum-compatible networks. It processes contract bytecode, updates blockchain state, and ensures execution follows consensus rules.

### SDK (using Ethers.js)

An SDK (Software Development Kit) is a set of tools and abstractions that helps developers build applications faster. In this context, Ethers.js acts as a Web3 SDK by providing utilities to connect wallets, call contracts, read on-chain data, and send transactions without dealing with low-level RPC details directly.

### On-chain

On-chain refers to data, actions, or logic that are recorded and executed directly on the blockchain. On-chain operations are transparent, verifiable, and secured by the network consensus.

### Off-chain

Off-chain refers to data, processing, or services that happen outside the blockchain, such as backend APIs, databases, or indexing services. Off-chain systems are often used for speed, lower cost, and richer querying, while still integrating with on-chain data when needed.

### Fallback by chain

Fallback by chain is a resilience strategy where the system keeps backup RPC providers for each blockchain network. If the primary provider for a chain fails, times out, or is rate-limited, the app automatically switches to another provider for that same chain.
