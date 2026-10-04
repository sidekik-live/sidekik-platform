/**
 * Request/response schemas for the HTTP and WebSocket interfaces between services and the page
 * (ARCHITECTURE §4.3, each repo's docs/DESIGN.md). Bus payloads live in the other contract files.
 *
 * Shapes marked "draft" are only sketched in the docs; their owner should confirm or tighten them.
 */
import { z } from "zod";
/** ElevenLabs conversation start data returned to the page. */
export declare const ElSessionSchema: z.ZodObject<{
    conversation_token: z.ZodString;
    agent_id: z.ZodString;
    dynamic_variables: z.ZodRecord<z.ZodString, z.ZodString>;
}, z.core.$strip>;
export type ElSession = z.infer<typeof ElSessionSchema>;
/** Pre-save check result (tutor computes it; gateway relays it to the page). */
export declare const PresaveResponseSchema: z.ZodObject<{
    allow: z.ZodBoolean;
    guardrail_id: z.ZodOptional<z.ZodString>;
    quote: z.ZodOptional<z.ZodString>;
    step_id: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type PresaveResponse = z.infer<typeof PresaveResponseSchema>;
export declare const OffRecordSourceSchema: z.ZodEnum<{
    brain: "brain";
    ui: "ui";
    agent: "agent";
    chat: "chat";
    retroactive: "retroactive";
}>;
export declare const CreateSessionRequestSchema: z.ZodObject<{
    workflow_id: z.ZodString;
    kind: z.ZodEnum<{
        capture: "capture";
        tutor: "tutor";
    }>;
    mode: z.ZodEnum<{
        browser: "browser";
        meeting: "meeting";
        replay: "replay";
    }>;
    language: z.ZodString;
    workmap_id: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const CreateSessionResponseSchema: z.ZodObject<{
    session_id: z.ZodString;
    sk_token: z.ZodString;
    el: z.ZodObject<{
        conversation_token: z.ZodString;
        agent_id: z.ZodString;
        dynamic_variables: z.ZodRecord<z.ZodString, z.ZodString>;
    }, z.core.$strip>;
    ingest_url: z.ZodString;
}, z.core.$strip>;
export declare const ConsentRequestSchema: z.ZodObject<{
    text_version: z.ZodString;
    scopes: z.ZodArray<z.ZodEnum<{
        screen: "screen";
        audio: "audio";
        storage: "storage";
    }>>;
}, z.core.$strip>;
export declare const TaskDoneRequestSchema: z.ZodObject<{
    event: z.ZodLiteral<"task_done">;
}, z.core.$strip>;
export declare const OffRecordRequestSchema: z.ZodObject<{
    on: z.ZodBoolean;
    source: z.ZodEnum<{
        ui: "ui";
        agent: "agent";
        chat: "chat";
    }>;
    back_s: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export declare const MeetingBotRequestSchema: z.ZodObject<{
    meeting_url: z.ZodURL;
}, z.core.$strip>;
export declare const PresaveRequestSchema: z.ZodObject<{
    state: z.ZodObject<{
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
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const PublishWorkmapResponseSchema: z.ZodObject<{
    job_id: z.ZodString;
}, z.core.$strip>;
export declare const ClipUrlResponseSchema: z.ZodObject<{
    url: z.ZodURL;
}, z.core.$strip>;
export declare const ReplayRequestSchema: z.ZodObject<{
    speed: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export declare const AgentHostClaimRequestSchema: z.ZodObject<{
    t: z.ZodString;
}, z.core.$strip>;
export declare const AgentHostClaimResponseSchema: z.ZodObject<{
    sk_token: z.ZodString;
    el: z.ZodObject<{
        conversation_token: z.ZodString;
        agent_id: z.ZodString;
        dynamic_variables: z.ZodRecord<z.ZodString, z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
/** Messages the page sends on /ws/client/:sid. `t_ms` is session time. */
export declare const ClientMessageSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    type: z.ZodLiteral<"turn">;
    t_ms: z.ZodNumber;
    turn: z.ZodObject<{
        role: z.ZodEnum<{
            user: "user";
            agent: "agent";
        }>;
        turn_id: z.ZodString;
        text: z.ZodString;
        source: z.ZodEnum<{
            live: "live";
            webhook: "webhook";
        }>;
        lang: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"speech">;
    t_ms: z.ZodNumber;
    signal: z.ZodObject<{
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
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"dom">;
    t_ms: z.ZodNumber;
    event: z.ZodObject<{
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
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"agent_event">;
    t_ms: z.ZodNumber;
    name: z.ZodString;
    payload: z.ZodOptional<z.ZodUnknown>;
}, z.core.$strip>], "type">;
export type ClientMessage = z.infer<typeof ClientMessageSchema>;
/** JSON header of each binary frame on /ws/frames/:sid (perception) and /internal/frames/:sid (meetbot). */
export declare const FrameHeaderSchema: z.ZodObject<{
    t_ms: z.ZodNumber;
    reason: z.ZodEnum<{
        tick: "tick";
        blur: "blur";
        save: "save";
        nav: "nav";
    }>;
}, z.core.$strip>;
export type FrameHeader = z.infer<typeof FrameHeaderSchema>;
/** POST /internal/sessions/:id/phase (mapper → gateway). */
export declare const SetPhaseRequestSchema: z.ZodObject<{
    phase: z.ZodEnum<{
        debrief: "debrief";
        confirmed: "confirmed";
    }>;
    dynamic_variables: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
}, z.core.$strip>;
/** POST /internal/sessions/:id/off-record (brain → gateway, after D7). */
export declare const InternalOffRecordRequestSchema: z.ZodObject<{
    on: z.ZodBoolean;
    source: z.ZodEnum<{
        brain: "brain";
        ui: "ui";
        agent: "agent";
        chat: "chat";
        retroactive: "retroactive";
    }>;
    t_ms: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
/** POST /internal/redact (voice → gateway, webhook turns). */
export declare const RedactRequestSchema: z.ZodObject<{
    text: z.ZodString;
    lang: z.ZodOptional<z.ZodString>;
    keep: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export declare const RedactResponseSchema: z.ZodObject<{
    text: z.ZodString;
}, z.core.$strip>;
/** POST /internal/agent-host-token (meetbot → gateway). */
export declare const AgentHostTokenRequestSchema: z.ZodObject<{
    sid: z.ZodString;
}, z.core.$strip>;
export declare const AgentHostTokenResponseSchema: z.ZodObject<{
    t: z.ZodString;
}, z.core.$strip>;
/** POST /internal/decide (mapper, tutor → brain). */
export declare const DecideRequestSchema: z.ZodObject<{
    session_id: z.ZodString;
    decisions: z.ZodArray<z.ZodObject<{
        id: z.ZodEnum<{
            D1: "D1";
            D2: "D2";
            D3: "D3";
            D4: "D4";
            D5: "D5";
            D6: "D6";
            D7: "D7";
            D8: "D8";
            D9: "D9";
            D10: "D10";
            D11: "D11";
            D12: "D12";
        }>;
        state: z.ZodUnknown;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const DecideResponseSchema: z.ZodObject<{
    results: z.ZodArray<z.ZodObject<{
        id: z.ZodEnum<{
            D1: "D1";
            D2: "D2";
            D3: "D3";
            D4: "D4";
            D5: "D5";
            D6: "D6";
            D7: "D7";
            D8: "D8";
            D9: "D9";
            D10: "D10";
            D11: "D11";
            D12: "D12";
        }>;
        answer: z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean]>;
        probabilities: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNumber>>;
        confidence: z.ZodNumber;
        provider: z.ZodEnum<{
            jev: "jev";
            "openrouter-jev": "openrouter-jev";
            llm: "llm";
        }>;
        escalated: z.ZodBoolean;
        latency_ms: z.ZodNumber;
        answers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
            answer: z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean]>;
            confidence: z.ZodNumber;
            probabilities: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNumber>>;
            p_true: z.ZodOptional<z.ZodNumber>;
            score: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
/** POST /internal/token (gateway → voice). */
export declare const VoiceTokenRequestSchema: z.ZodObject<{
    agent: z.ZodEnum<{
        tutor: "tutor";
        interviewer: "interviewer";
    }>;
    phase: z.ZodEnum<{
        capture: "capture";
        building: "building";
        debrief: "debrief";
        confirmed: "confirmed";
        tutoring: "tutoring";
        done: "done";
    }>;
    session_id: z.ZodString;
    dynamic_variables: z.ZodRecord<z.ZodString, z.ZodString>;
    language: z.ZodString;
}, z.core.$strip>;
export declare const VoiceTokenResponseSchema: z.ZodObject<{
    conversation_token: z.ZodString;
    agent_id: z.ZodString;
}, z.core.$strip>;
/** POST /internal/bots (gateway → meetbot). DELETE /internal/bots/:sid has no body. */
export declare const CreateBotRequestSchema: z.ZodObject<{
    session_id: z.ZodString;
    meeting_url: z.ZodURL;
    bot_name: z.ZodDefault<z.ZodString>;
}, z.core.$strip>;
export declare const CreateBotResponseSchema: z.ZodObject<{
    bot_id: z.ZodString;
}, z.core.$strip>;
/** POST /internal/clips (mapper → perception) → 202 {job_id}. */
export declare const ClipsRequestSchema: z.ZodObject<{
    session_id: z.ZodString;
    items: z.ZodArray<z.ZodObject<{
        step_id: z.ZodString;
        t_ms: z.ZodNumber;
        before_s: z.ZodDefault<z.ZodNumber>;
        after_s: z.ZodDefault<z.ZodNumber>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const ClipsResponseSchema: z.ZodObject<{
    job_id: z.ZodString;
}, z.core.$strip>;
/** GET /internal/keyframe-url?keyframe_id= → signed URL (5 min). */
export declare const KeyframeUrlResponseSchema: z.ZodObject<{
    url: z.ZodURL;
}, z.core.$strip>;
/** POST /internal/workmaps/:id/publish → {job_id}. */
export declare const InternalPublishResponseSchema: z.ZodObject<{
    job_id: z.ZodString;
}, z.core.$strip>;
/** POST /internal/tools/recall_context (gateway → mapper, ElevenLabs tool). */
export declare const RecallContextRequestSchema: z.ZodObject<{
    session_id: z.ZodString;
    query: z.ZodString;
    scope: z.ZodEnum<{
        session: "session";
        workflow: "workflow";
    }>;
}, z.core.$strip>;
export declare const RecallContextResponseSchema: z.ZodObject<{
    snippets: z.ZodArray<z.ZodObject<{
        text: z.ZodString;
        t_ms: z.ZodOptional<z.ZodNumber>;
        source: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
/** POST /internal/presave (gateway → tutor): under 50 ms of compute, no model calls. */
export declare const InternalPresaveRequestSchema: z.ZodObject<{
    session_id: z.ZodString;
    state: z.ZodObject<{
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
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const InternalPresaveResponseSchema: z.ZodObject<{
    allow: z.ZodBoolean;
    guardrail_id: z.ZodOptional<z.ZodString>;
    quote: z.ZodOptional<z.ZodString>;
    step_id: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
/** POST /internal/tools/check_guardrails (draft). */
export declare const CheckGuardrailsRequestSchema: z.ZodObject<{
    session_id: z.ZodString;
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
export declare const CheckGuardrailsResponseSchema: z.ZodObject<{
    violations: z.ZodArray<z.ZodObject<{
        guardrail_id: z.ZodString;
        key: z.ZodString;
        description: z.ZodString;
        quote: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
/** POST /internal/tools/get_step (draft): the current or requested step, in the expert's words. */
export declare const GetStepRequestSchema: z.ZodObject<{
    session_id: z.ZodString;
    step_id: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const GetStepResponseSchema: z.ZodObject<{
    step_id: z.ZodString;
    key: z.ZodString;
    title: z.ZodString;
    decision: z.ZodString;
    quote: z.ZodOptional<z.ZodString>;
    quote_en: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
/** POST /internal/tools/get_expert_moment. */
export declare const GetExpertMomentRequestSchema: z.ZodObject<{
    step_id: z.ZodString;
}, z.core.$strip>;
export declare const GetExpertMomentResponseSchema: z.ZodObject<{
    quote: z.ZodString;
    quote_en: z.ZodOptional<z.ZodString>;
    label: z.ZodString;
    clip_url: z.ZodURL;
}, z.core.$strip>;
