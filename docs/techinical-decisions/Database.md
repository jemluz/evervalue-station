### Why PostgreSQL?

1. **Data Integrity**: To handle financial conversions (BTC, EVA, BRL), relational database consistency ensures calculations between tables stay accurate.
2. **Time-Series Performance**: If in future you want to show price variation charts, Postgres handles large volumes of time-based data very well (especially with extensions like TimescaleDB).
3. **Node.js Ecosystem**: Integration with ORMs like Prisma or TypeORM is excellent.

### 🗄️ Table `Price`

**Model**
This table stores market values. Using **Decimal** is mandatory to avoid rounding errors common in floating-point types.

| Field          | Logical Type    | Constraint       | Description                                          |
| :------------- | :-------------- | :--------------- | :--------------------------------------------------- |
| **symbol**     | String/Text     | Unique, Not Null | Asset identifier (example: "BTC", "EVA").         |
| **usd**        | Decimal (20, 8) | Not Null         | Asset price in US Dollar.                            |
| **brl**        | Decimal (20, 8) | Not Null         | Asset price in Brazilian Real.                       |
| **btc**        | Decimal (20, 8) | Not Null         | Asset price in Bitcoin (for BTC, value is 1).        |
| **sats**       | BigInt/Decimal  | Not Null         | Asset value in Satoshis.                             |
| **updated_at** | Timestamp       | Not Null         | Date and time of last Cronjob update.                |

**Example**

| symbol  | usd      | brl       | btc        | sats      | updated_at     |
| :------ | :------- | :-------- | :--------- | :-------- | :------------- |
| **BTC** | 65000.00 | 350000.00 | 1.00000000 | 100000000 | 2026-06-12T... |
| **EVA** | 34.86    | 188.20    | 0.00053600 | 53600     | 2026-06-12T... |

---

### 🗄️ Table `Status`

This table works with only one record with fixed ID, representing current "heartbeat" of external integration.

- **Performance**: Backend I runs very simple query: `SELECT * FROM api_status WHERE id = 1`. Instant read (O(1)).
- **Frontend Simplicity**: You do not need to handle arrays or date filters in frontend code to know if system is online. Just read single object returned by Backend I.
- **Storage Efficiency**: If you saved one log every 5 minutes, in one year you would have more than 100,000 rows only for "pings". Since goal is only to show current status on website, one row is enough.

**Model**

| Field          | Logical Type | Constraint  | Description                                                |
| :------------- | :----------- | :---------- | :--------------------------------------------------------- |
| **id**         | Integer      | Primary Key | Fixed ID (example: 1) to guarantee single record.          |
| **is_online**  | Boolean      | Not Null    | `true` if API replied to ping; `false` otherwise.          |
| **latency_ms** | Integer      | Nullable    | API response time in milliseconds.                         |
| **error_log**  | Text/String  | Nullable    | Technical error description (example: "404", "Timeout"). |
| **last_check** | Timestamp    | Not Null    | Date and time of last check performed.                     |

**Example**

| id  | is_online | latency_ms | error_log | last_check          |
| :-- | :-------- | :--------- | :-------- | :------------------ |
| 1   | true      | 145        | null      | 2026-06-12 14:30:00 |

or in case of failure:

| id  | is_online | latency_ms | error_log | last_check          |
| :-- | :-------- | :--------- | :-------- | :------------------ |
| 1   | false     | 30000      | Timeout   | 2026-06-12 14:38:00 |
