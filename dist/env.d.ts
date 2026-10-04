import { z } from "zod";
/**
 * Parses `source` (default `process.env`) with `schema`. On failure, lists every
 * bad variable and throws, so a service fails at boot rather than mid-session.
 */
export declare function loadEnv<S extends z.ZodType>(schema: S, source?: Record<string, string | undefined>): z.infer<S>;
/** Variables every backend service needs (ARCHITECTURE §7.3). Extend with `.extend({...})`. */
export declare const BaseServiceEnvSchema: z.ZodObject<{
    PORT: z.ZodCoercedNumber<unknown>;
    REDIS_URL: z.ZodURL;
    SUPABASE_URL: z.ZodURL;
    SUPABASE_SERVICE_ROLE_KEY: z.ZodString;
    SK_INTERNAL_TOKEN: z.ZodString;
    LOG_LEVEL: z.ZodDefault<z.ZodEnum<{
        error: "error";
        fatal: "fatal";
        warn: "warn";
        info: "info";
        debug: "debug";
        trace: "trace";
        silent: "silent";
    }>>;
}, z.core.$strip>;
export type BaseServiceEnv = z.infer<typeof BaseServiceEnvSchema>;
