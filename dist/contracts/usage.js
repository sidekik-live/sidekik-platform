import { z } from "zod";
export const UsageRecordSchema = z.object({
    service: z.string().min(1),
    vendor: z.enum(["elevenlabs", "typesafe", "anthropic", "recall"]),
    units: z.number().nonnegative(),
    unit: z.enum(["tokens_in", "tokens_out", "minutes", "hours"]),
    cost_usd: z.number().nonnegative(),
    counterfactual_usd: z.number().nonnegative().optional(),
});
/**
 * USD per unit, by vendor and model. Dated: update `as_of` with any change.
 * - TypeSafe Jev: docs.typesafe.ai/models ($0.042 per Mtok input, output free).
 * - Anthropic: Claude Haiku 4.5 $1 / $5, Claude Sonnet 5.5 $2 / $10 per Mtok (in / out).
 * ElevenLabs (minutes) and Recall (hours) depend on the team's plan: add them from the invoice;
 * until then priceUsd() returns undefined for them and cost_usd should be 0 with a log line.
 */
export const PRICE_TABLE = {
    as_of: "2026-10-03",
    typesafe: {
        "jev-1.13.0": { tokens_in: 0.042 / 1e6, tokens_out: 0 },
        "typesafe/jev-1.13": { tokens_in: 0.042 / 1e6, tokens_out: 0 },
    },
    anthropic: {
        "claude-haiku-4-5": { tokens_in: 1 / 1e6, tokens_out: 5 / 1e6 },
        "claude-sonnet-5-5": { tokens_in: 2 / 1e6, tokens_out: 10 / 1e6 },
    },
    elevenlabs: {},
    recall: {},
};
/** Cost of `units` of `unit` on a vendor's model, or undefined when the price isn't in the table. */
export function priceUsd(vendor, model, unit, units) {
    const perUnit = PRICE_TABLE[vendor][model]?.[unit];
    return perUnit === undefined ? undefined : perUnit * units;
}
//# sourceMappingURL=usage.js.map