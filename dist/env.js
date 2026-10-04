import { z } from "zod";
/**
 * Parses `source` (default `process.env`) with `schema`. On failure, lists every
 * bad variable and throws, so a service fails at boot rather than mid-session.
 */
export function loadEnv(schema, source = process.env) {
    const result = schema.safeParse(source);
    if (result.success)
        return result.data;
    const lines = result.error.issues.map((i) => `  ${i.path.join(".") || "(root)"}: ${i.message}`);
    throw new Error(`Invalid environment:\n${lines.join("\n")}`);
}
/** Variables every backend service needs (ARCHITECTURE §7.3). Extend with `.extend({...})`. */
export const BaseServiceEnvSchema = z.object({
    PORT: z.coerce.number().int().positive(),
    REDIS_URL: z.url(),
    SUPABASE_URL: z.url(),
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
    SK_INTERNAL_TOKEN: z.string().min(16),
    LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"]).default("info"),
});
//# sourceMappingURL=env.js.map