import { z } from "zod";
export declare const INTERNAL_TOKEN_HEADER = "x-internal-token";
export declare const SessionRoleSchema: z.ZodEnum<{
    admin: "admin";
    expert: "expert";
    learner: "learner";
    manager: "manager";
}>;
export type SessionRole = z.infer<typeof SessionRoleSchema>;
export declare const SessionClaimsSchema: z.ZodObject<{
    sid: z.ZodString;
    org: z.ZodString;
    role: z.ZodEnum<{
        admin: "admin";
        expert: "expert";
        learner: "learner";
        manager: "manager";
    }>;
    kind: z.ZodEnum<{
        capture: "capture";
        tutor: "tutor";
    }>;
    iat: z.ZodNumber;
    exp: z.ZodNumber;
}, z.core.$strip>;
export type SessionClaims = z.infer<typeof SessionClaimsSchema>;
export type SessionTokenInput = Pick<SessionClaims, "sid" | "org" | "role" | "kind">;
export declare class AuthError extends Error {
    name: string;
}
/** Mints an `sk_token`: HS256 JWT with claims `{sid, org, role, kind}`. */
export declare function signSessionToken(claims: SessionTokenInput, secret: string, ttlSec?: number, nowSec?: number): string;
/** Verifies an `sk_token` and returns its claims. Throws `AuthError` on any problem. */
export declare function verifySessionToken(token: string, secret: string, nowSec?: number): SessionClaims;
/** Constant-time check of an `X-Internal-Token` header value. */
export declare function checkInternalToken(header: string | string[] | undefined, expected: string): boolean;
/** Minimal request/reply shapes so this works as a Fastify preHandler without depending on Fastify. */
type HeaderRequest = {
    headers: Record<string, string | string[] | undefined>;
};
type CodeReply = {
    code(statusCode: number): {
        send(payload?: unknown): unknown;
    };
};
/** Fastify preHandler that rejects requests without the right `X-Internal-Token`. */
export declare function internalAuth(token: string): (req: HeaderRequest, reply: CodeReply) => Promise<void>;
/**
 * Verifies an HMAC over the raw body. Accepts the signature as hex, or as
 * `<algo>=<hex>` (e.g. `sha256=ab12…`).
 */
export declare function verifyHmac(rawBody: string | Buffer, header: string | undefined, secret: string, algo?: string): boolean;
export {};
