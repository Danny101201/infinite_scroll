import { ZodFormattedError } from "zod";
import { serverEnv, clientEnv, serverSchema } from "./schema";
const _serverEnv = serverSchema.safeParse(serverEnv)
export const formatErrors = (
  errors: ZodFormattedError<Map<string, string>, string>,
) =>
  Object.entries(errors)
    .map(([name, value]) => {
      if (value && "_errors" in value)
        return `${name}: ${value._errors.join(", ")}\n`;
    })
    .filter(Boolean);

if (!_serverEnv.success) {
  console.error(
    "❌ Invalid environment variables:\n",
    ...formatErrors(_serverEnv.error.format()),
  );
  throw new Error("Invalid environment variables");
}
export const env = { ...clientEnv, ..._serverEnv.data }