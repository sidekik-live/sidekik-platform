import type { z } from "zod";
import { type ServiceName } from "./contracts/envelope.js";
/** Redis Stream keys (ARCHITECTURE §4.2). */
export declare const STREAMS: {
    readonly lifecycle: "sk:session.lifecycle";
    readonly turns: "sk:transcript.turns";
    readonly speech: "sk:speech.signals";
    readonly dom: "sk:dom.events";
    readonly screen: "sk:screen.events";
    readonly commands: "sk:agent.commands";
    readonly workmapPublished: "sk:workmap.published";
    readonly usage: "sk:usage";
};
export type StreamName = keyof typeof STREAMS;
export type StreamKey = (typeof STREAMS)[StreamName];
/** Dead-letter stream for events that failed every retry. */
export declare const DLQ_STREAM = "sk:dlq";
/** Approximate cap passed to XADD MAXLEN ~. */
export declare const STREAM_MAXLEN = 10000;
/** `Envelope.type` used for events on each stream. */
export declare const EVENT_TYPES: {
    readonly "sk:session.lifecycle": "session.lifecycle";
    readonly "sk:transcript.turns": "transcript.turn";
    readonly "sk:speech.signals": "speech.signal";
    readonly "sk:dom.events": "dom.event";
    readonly "sk:screen.events": "screen.event";
    readonly "sk:agent.commands": "agent.command";
    readonly "sk:workmap.published": "workmap.published";
    readonly "sk:usage": "usage";
};
/** Payload (`Envelope.data`) schema for each stream. */
export declare const STREAM_SCHEMAS: {
    readonly "sk:session.lifecycle": z.ZodObject<{
        event: z.ZodEnum<{
            started: "started";
            task_done: "task_done";
            phase_changed: "phase_changed";
            offrecord_on: "offrecord_on";
            offrecord_off: "offrecord_off";
            ended: "ended";
            bot_joined: "bot_joined";
            bot_left: "bot_left";
            bot_error: "bot_error";
        }>;
        kind: z.ZodEnum<{
            capture: "capture";
            tutor: "tutor";
        }>;
        phase: z.ZodEnum<{
            capture: "capture";
            building: "building";
            debrief: "debrief";
            confirmed: "confirmed";
            tutoring: "tutoring";
            done: "done";
        }>;
        workflow_id: z.ZodString;
        workmap_id: z.ZodOptional<z.ZodString>;
        mode: z.ZodEnum<{
            browser: "browser";
            meeting: "meeting";
            replay: "replay";
        }>;
        language: z.ZodString;
    }, z.core.$strip>;
    readonly "sk:transcript.turns": z.ZodObject<{
        turn_id: z.ZodString;
        role: z.ZodEnum<{
            user: "user";
            agent: "agent";
        }>;
        text: z.ZodString;
        lang: z.ZodString;
        source: z.ZodEnum<{
            live: "live";
            webhook: "webhook";
        }>;
        redacted: z.ZodLiteral<true>;
    }, z.core.$strip>;
    readonly "sk:speech.signals": z.ZodObject<{
        kind: z.ZodEnum<{
            user_speech_start: "user_speech_start";
            user_speech_end: "user_speech_end";
            agent_speech_start: "agent_speech_start";
            agent_speech_end: "agent_speech_end";
            typing: "typing";
        }>;
        source: z.ZodEnum<{
            dom: "dom";
            sdk: "sdk";
            recall: "recall";
        }>;
    }, z.core.$strip>;
    readonly "sk:dom.events": z.ZodObject<{
        kind: z.ZodEnum<{
            field_focus: "field_focus";
            field_change: "field_change";
            save_attempt: "save_attempt";
            record_open: "record_open";
        }>;
        record: z.ZodOptional<z.ZodObject<{
            kind: z.ZodString;
            id: z.ZodString;
        }, z.core.$strip>>;
        field: z.ZodOptional<z.ZodString>;
        before: z.ZodOptional<z.ZodString>;
        after: z.ZodOptional<z.ZodString>;
        state: z.ZodOptional<z.ZodObject<{
            invoice_id: z.ZodOptional<z.ZodString>;
            supplier: z.ZodOptional<z.ZodString>;
            supplier_known: z.ZodOptional<z.ZodBoolean>;
            net_amount: z.ZodOptional<z.ZodNumber>;
            currency: z.ZodOptional<z.ZodString>;
            invoice_date: z.ZodOptional<z.ZodString>;
            invoice_month: z.ZodOptional<z.ZodNumber>;
            company_code: z.ZodOptional<z.ZodString>;
            category: z.ZodOptional<z.ZodString>;
            cost_center: z.ZodOptional<z.ZodString>;
            asset_number: z.ZodOptional<z.ZodString>;
            approvals_count: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>>;
    }, z.core.$strip>;
    readonly "sk:screen.events": z.ZodObject<{
        event_id: z.ZodString;
        type: z.ZodEnum<{
            app_opened: "app_opened";
            record_opened: "record_opened";
            field_changed: "field_changed";
            button_clicked: "button_clicked";
            value_read: "value_read";
            navigation: "navigation";
            dialog: "dialog";
            typing_in_progress: "typing_in_progress";
            idle: "idle";
        }>;
        entity: z.ZodOptional<z.ZodObject<{
            kind: z.ZodString;
            id: z.ZodString;
        }, z.core.$strip>>;
        field: z.ZodOptional<z.ZodString>;
        before: z.ZodOptional<z.ZodString>;
        after: z.ZodOptional<z.ZodString>;
        state: z.ZodObject<{
            app: z.ZodOptional<z.ZodString>;
            screen: z.ZodOptional<z.ZodString>;
            record: z.ZodOptional<z.ZodObject<{
                invoice_id: z.ZodOptional<z.ZodString>;
                supplier: z.ZodOptional<z.ZodString>;
                supplier_known: z.ZodOptional<z.ZodBoolean>;
                net_amount: z.ZodOptional<z.ZodNumber>;
                currency: z.ZodOptional<z.ZodString>;
                invoice_date: z.ZodOptional<z.ZodString>;
                invoice_month: z.ZodOptional<z.ZodNumber>;
                company_code: z.ZodOptional<z.ZodString>;
                category: z.ZodOptional<z.ZodString>;
                cost_center: z.ZodOptional<z.ZodString>;
                asset_number: z.ZodOptional<z.ZodString>;
                approvals_count: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strip>>;
            focused_field: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
        confidence: z.ZodNumber;
        source: z.ZodEnum<{
            vision: "vision";
            dom: "dom";
        }>;
        keyframe_id: z.ZodOptional<z.ZodString>;
        untrusted_screen_text: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    readonly "sk:agent.commands": z.ZodDiscriminatedUnion<[z.ZodObject<{
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
    readonly "sk:workmap.published": z.ZodObject<{
        workmap_id: z.ZodString;
        workflow_id: z.ZodString;
        version: z.ZodNumber;
    }, z.core.$strip>;
    readonly "sk:usage": z.ZodObject<{
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
};
export type StreamPayload<K extends StreamKey> = z.infer<(typeof STREAM_SCHEMAS)[K]>;
/** Full envelope schema for events on a stream. */
export declare function streamEnvelopeSchema<K extends StreamKey>(stream: K): z.ZodObject<{
    id: z.ZodString;
    type: z.ZodString;
    v: z.ZodLiteral<1>;
    org_id: z.ZodString;
    session_id: z.ZodString;
    t_ms: z.ZodNumber;
    ts: z.ZodString;
    producer: z.ZodEnum<{
        tutor: "tutor";
        gateway: "gateway";
        perception: "perception";
        brain: "brain";
        mapper: "mapper";
        voice: "voice";
        meetbot: "meetbot";
    }>;
    data: z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
}, z.core.$strip>;
/** Default consumer group: one per service. */
export declare function defaultGroup(service: ServiceName): string;
