import { z } from "zod";
import { newId } from "../ids.js";
export const ServiceNameSchema = z.enum([
    "gateway",
    "perception",
    "brain",
    "mapper",
    "tutor",
    "voice",
    "meetbot",
]);
/** Wraps a payload schema in the bus envelope every event carries. */
export function envelopeSchema(data) {
    return z.object({
        id: z.string().min(1),
        type: z.string().min(1),
        v: z.literal(1),
        org_id: z.string().min(1),
        session_id: z.string().min(1),
        t_ms: z.number().int().nonnegative(),
        ts: z.string().min(1),
        producer: ServiceNameSchema,
        data,
    });
}
export function makeEvent(input) {
    return {
        id: input.id ?? newId(),
        type: input.type,
        v: 1,
        org_id: input.org_id,
        session_id: input.session_id,
        t_ms: input.t_ms,
        ts: input.ts ?? new Date().toISOString(),
        producer: input.producer,
        data: input.data,
    };
}
//# sourceMappingURL=envelope.js.map