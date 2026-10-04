import { z } from "zod";
import { PhaseSchema } from "./lifecycle.js";
import { MasterySummarySchema } from "./workmap.js";
export const QTypeSchema = z.enum(["exception", "limit", "other", "stop_and_ask", "why"]);
export const AgentCommandSchema = z.discriminatedUnion("type", [
    z.object({ type: z.literal("ctx"), text: z.string(), context_id: z.string().optional() }),
    z.object({ type: z.literal("ask"), question_id: z.string().min(1), text: z.string().min(1), qtype: QTypeSchema }),
    z.object({ type: z.literal("followup"), open_item_id: z.string().min(1), text: z.string().min(1) }),
    z.object({ type: z.literal("teachback"), workmap_id: z.string().min(1), script: z.string().min(1) }),
    z.object({ type: z.literal("predict"), step_id: z.string().min(1), prompt: z.string().min(1) }),
    z.object({
        type: z.literal("intervene"),
        guardrail_id: z.string().min(1),
        step_id: z.string().min(1),
        text: z.string().min(1),
        field: z.string().optional(),
    }),
    z.object({
        type: z.literal("replay"),
        step_id: z.string().min(1),
        clip_url: z.string().min(1),
        quote: z.string(),
        label: z.string(),
    }),
    z.object({ type: z.literal("summary"), mastery: MasterySummarySchema }),
    z.object({ type: z.literal("offrecord"), on: z.boolean() }),
    z.object({
        type: z.literal("phase"),
        phase: PhaseSchema,
        conversation_token: z.string().min(1),
        agent_id: z.string().min(1),
        dynamic_variables: z.record(z.string(), z.string()),
    }),
]);
// ---------------------------------------------------------------------------
// Page side (ARCHITECTURE §4.5): what the browser page does with each command.
// ---------------------------------------------------------------------------
/** Prefix that tells the ElevenLabs agent a user message came from Sidekik, not the person. */
export const SIDEKIK_PREFIX = "[SIDEKIK]";
/** The exact message the page sends for a command, per ARCHITECTURE §4.5. */
export function pageAction(cmd) {
    switch (cmd.type) {
        case "ctx":
            return { kind: "contextual_update", text: oneLine(cmd.text) };
        case "ask":
            return userMessage("ASK", cmd.text);
        case "followup":
            return userMessage("FOLLOWUP", cmd.text);
        case "teachback":
            return userMessage("TEACHBACK", cmd.script);
        case "predict":
            return userMessage("PREDICT", cmd.prompt);
        case "intervene":
            return userMessage("INTERVENE", cmd.text);
        case "summary":
            return userMessage("SUMMARY", summaryText(cmd.mastery));
        case "replay":
        case "offrecord":
        case "phase":
            return { kind: "ui" };
    }
}
/** The `sendUserMessage` string for a command, or null when the page doesn't message the agent. */
export function toPageMessage(cmd) {
    const action = pageAction(cmd);
    return action.kind === "user_message" ? action.text : null;
}
function userMessage(tag, body) {
    return { kind: "user_message", text: `${SIDEKIK_PREFIX} ${tag}: ${oneLine(body)}` };
}
/** Agent messages are one line: newlines and runs of whitespace collapse to single spaces. */
function oneLine(text) {
    return text.replace(/\s+/g, " ").trim();
}
/** Spoken summary of a tutor session: counts first, then what to practice next. */
function summaryText(m) {
    const c = m.counts;
    const total = c.independent_correct + c.prompted_correct + c.corrected_after_intervention + c.not_attempted;
    const parts = [
        `${c.independent_correct} of ${total} steps done independently, ${c.prompted_correct} with a prompt, ` +
            `${c.corrected_after_intervention} corrected after an intervention, ${c.not_attempted} not attempted.`,
    ];
    if (m.practice_next.length > 0)
        parts.push(`Practice next: ${m.practice_next.map((p) => p.reason).join("; ")}.`);
    return parts.join(" ");
}
//# sourceMappingURL=commands.js.map