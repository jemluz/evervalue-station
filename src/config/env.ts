import { z } from "zod";

// Define schemas for server and client environment variables
const serverSchema = z.object({
  COINGECKO_BASE_URL: z.url().default("https://api.coingecko.com/api/v3"),
});

// const clientSchema = z.object({});

// Validate server and client environment variables, with detailed error reporting
const serverResult = serverSchema.safeParse(process.env);
// const clientResult = clientSchema.safeParse(process.env);

// If validation fails, log detailed errors and throw an exception
if (!serverResult.success) {
  console.error(
    "❌ Invalid server env:",
    z.flattenError(serverResult.error).fieldErrors,
  );
  throw new Error("Invalid server environment variables");
}

// if (!clientResult.success) {
//   console.error(
//     "❌ Invalid client env:",
//     z.flattenError(clientResult.error).fieldErrors,
//   );
//   throw new Error("Invalid client environment variables");
// }

export const env = {
  ...serverResult.data,
  // ...clientResult.data,
};
