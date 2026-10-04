import { z } from "zod";
export declare const UsageRecordSchema: z.ZodObject<{
    service: z.ZodString;
    vendor: z.ZodEnum<{
        recall: "recall";
        elevenlabs: "elevenlabs";
        typesafe: "typesafe";
        anthropic: "anthropic";
    }>;
    units: z.ZodNumber;
    unit: z.ZodEnum<{
        tokens_in: "tokens_in";
        tokens_out: "tokens_out";
        minutes: "minutes";
        hours: "hours";
    }>;
    cost_usd: z.ZodNumber;
    counterfactual_usd: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export type UsageRecord = z.infer<typeof UsageRecordSchema>;
export type UsageVendor = UsageRecord["vendor"];
export type UsageUnit = UsageRecord["unit"];
/**
 * USD per unit, by vendor and model. Dated: update `as_of` with any change.
 * - TypeSafe Jev: docs.typesafe.ai/models ($0.042 per Mtok input, output free).
 * - Anthropic: Claude Haiku 4.5 $1 / $5, Claude Sonnet 5.5 $2 / $10 per Mtok (in / out).
 * - Recall: $0.50 per bot hour (sidekik-meetbot DESIGN §2), under the model name "bot".
 * ElevenLabs (minutes) depends on the team's plan: add it from the invoice; until then priceUsd()
 * returns undefined for it and cost_usd should be 0 with a log line.
 */
export declare const PRICE_TABLE: {
    readonly as_of: "2026-10-03";
    readonly typesafe: {
        readonly "jev-1.13.0": {
            readonly tokens_in: number;
            readonly tokens_out: 0;
        };
        readonly "typesafe/jev-1.13": {
            readonly tokens_in: number;
            readonly tokens_out: 0;
        };
    };
    readonly anthropic: {
        readonly "claude-haiku-4-5": {
            readonly tokens_in: number;
            readonly tokens_out: number;
        };
        readonly "claude-sonnet-5-5": {
            readonly tokens_in: number;
            readonly tokens_out: number;
        };
    };
    readonly elevenlabs: {};
    readonly recall: {
        readonly bot: {
            readonly hours: 0.5;
        };
    };
};
/** Cost of `units` of `unit` on a vendor's model, or undefined when the price isn't in the table. */
export declare function priceUsd(vendor: UsageVendor, model: string, unit: UsageUnit, units: number): number | undefined;
