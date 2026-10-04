import { z } from "zod";
export declare const QTypeSchema: z.ZodEnum<{
    stop_and_ask: "stop_and_ask";
    exception: "exception";
    limit: "limit";
    other: "other";
    why: "why";
}>;
export type QType = z.infer<typeof QTypeSchema>;
export declare const AgentCommandSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    type: z.ZodLiteral<"ctx">;
    text: z.ZodString;
    context_id: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"ask">;
    question_id: z.ZodString;
    text: z.ZodString;
    qtype: z.ZodEnum<{
        stop_and_ask: "stop_and_ask";
        exception: "exception";
        limit: "limit";
        other: "other";
        why: "why";
    }>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"followup">;
    open_item_id: z.ZodString;
    text: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"teachback">;
    workmap_id: z.ZodString;
    script: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"predict">;
    step_id: z.ZodString;
    prompt: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"intervene">;
    guardrail_id: z.ZodString;
    step_id: z.ZodString;
    text: z.ZodString;
    field: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"replay">;
    step_id: z.ZodString;
    clip_url: z.ZodString;
    quote: z.ZodString;
    label: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"summary">;
    mastery: z.ZodObject<{
        session_id: z.ZodString;
        workmap_id: z.ZodString;
        learner_id: z.ZodString;
        steps: z.ZodArray<z.ZodObject<{
            step_id: z.ZodString;
            key: z.ZodString;
            title: z.ZodString;
            outcome: z.ZodEnum<{
                independent_correct: "independent_correct";
                prompted_correct: "prompted_correct";
                corrected_after_intervention: "corrected_after_intervention";
                not_attempted: "not_attempted";
            }>;
        }, z.core.$strip>>;
        practice_next: z.ZodArray<z.ZodObject<{
            step_id: z.ZodOptional<z.ZodString>;
            guardrail_id: z.ZodOptional<z.ZodString>;
            reason: z.ZodString;
        }, z.core.$strip>>;
        counts: z.ZodObject<{
            independent_correct: z.ZodNumber;
            prompted_correct: z.ZodNumber;
            corrected_after_intervention: z.ZodNumber;
            not_attempted: z.ZodNumber;
        }, z.core.$strip>;
    }, z.core.$strip>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"offrecord">;
    on: z.ZodBoolean;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"phase">;
    phase: z.ZodEnum<{
        capture: "capture";
        building: "building";
        debrief: "debrief";
        confirmed: "confirmed";
        tutoring: "tutoring";
        done: "done";
    }>;
    conversation_token: z.ZodString;
    agent_id: z.ZodString;
    dynamic_variables: z.ZodRecord<z.ZodString, z.ZodString>;
}, z.core.$strip>], "type">;
export type AgentCommand = z.infer<typeof AgentCommandSchema>;
export type AgentCommandType = AgentCommand["type"];
/** Prefix that tells the ElevenLabs agent a user message came from Sidekik, not the person. */
export declare const SIDEKIK_PREFIX = "[SIDEKIK]";
export type PageAction = 
/** conversation.sendUserMessage(text): the agent acts on it and speaks. */
{
    kind: "user_message";
    text: string;
}
/** conversation.sendContextualUpdate(text): background context, never spoken. */
 | {
    kind: "contextual_update";
    text: string;
}
/** UI only (clip overlay, off-record badge, new EL session): nothing is sent to the agent. */
 | {
    kind: "ui";
};
/** The exact message the page sends for a command, per ARCHITECTURE §4.5. */
export declare function pageAction(cmd: AgentCommand): PageAction;
/** The `sendUserMessage` string for a command, or null when the page doesn't message the agent. */
export declare function toPageMessage(cmd: AgentCommand): string | null;
