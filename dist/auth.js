import { createHmac, timingSafeEqual } from "node:crypto";
import { z } from "zod";
import { SessionKindSchema } from "./contracts/lifecycle.js";
export const INTERNAL_TOKEN_HEADER = "x-internal-token";
export const SessionRoleSchema = z.enum(["admin", "expert", "learner", "manager"]);
export const SessionClaimsSchema = z.object({
    sid: z.string().min(1),
    org: z.string().min(1),
    role: SessionRoleSchema,
    kind: SessionKindSchema,
    iat: z.number().int(),
    exp: z.number().int(),
});
export class AuthError extends Error {
    name = "AuthError";
}
/** Mints an `sk_token`: HS256 JWT with claims `{sid, org, role, kind}`. */
export function signSessionToken(claims, secret, ttlSec = 7200, nowSec = epochSec()) {
    const header = b64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const payload = b64url(JSON.stringify({ ...claims, iat: nowSec, exp: nowSec + ttlSec }));
    return `${header}.${payload}.${hs256(`${header}.${payload}`, secret)}`;
}
/** Verifies an `sk_token` and returns its claims. Throws `AuthError` on any problem. */
export function verifySessionToken(token, secret, nowSec = epochSec()) {
    const parts = token.split(".");
    if (parts.length !== 3)
        throw new AuthError("malformed token");
    const [header, payload, sig] = parts;
    let alg;
    try {
        alg = JSON.parse(Buffer.from(header, "base64url").toString("utf8")).alg;
    }
    catch {
        throw new AuthError("malformed token header");
    }
    if (alg !== "HS256")
        throw new AuthError("unsupported alg");
    if (!safeEqual(sig, hs256(`${header}.${payload}`, secret)))
        throw new AuthError("bad signature");
    let claims;
    try {
        claims = SessionClaimsSchema.parse(JSON.parse(Buffer.from(payload, "base64url").toString("utf8")));
    }
    catch {
        throw new AuthError("invalid claims");
    }
    if (claims.exp <= nowSec)
        throw new AuthError("token expired");
    return claims;
}
/** Constant-time check of an `X-Internal-Token` header value. */
export function checkInternalToken(header, expected) {
    const value = Array.isArray(header) ? header[0] : header;
    return typeof value === "string" && value.length > 0 && safeEqual(value, expected);
}
/** Fastify preHandler that rejects requests without the right `X-Internal-Token`. */
export function internalAuth(token) {
    if (!token)
        throw new Error("internalAuth: empty token");
    return async (req, reply) => {
        if (!checkInternalToken(req.headers[INTERNAL_TOKEN_HEADER], token)) {
            await reply.code(401).send({ error: "unauthorized" });
        }
    };
}
/**
 * Verifies an HMAC over the raw body. Accepts the signature as hex, or as
 * `<algo>=<hex>` (e.g. `sha256=ab12…`).
 */
export function verifyHmac(rawBody, header, secret, algo = "sha256") {
    if (!header)
        return false;
    const sig = header.startsWith(`${algo}=`) ? header.slice(algo.length + 1) : header;
    const expected = createHmac(algo, secret).update(rawBody).digest("hex");
    return safeEqual(sig.toLowerCase(), expected);
}
function hs256(input, secret) {
    return createHmac("sha256", secret).update(input).digest("base64url");
}
function b64url(s) {
    return Buffer.from(s, "utf8").toString("base64url");
}
function safeEqual(a, b) {
    const ab = Buffer.from(a);
    const bb = Buffer.from(b);
    return ab.length === bb.length && timingSafeEqual(ab, bb);
}
function epochSec() {
    return Math.floor(Date.now() / 1000);
}
//# sourceMappingURL=auth.js.map