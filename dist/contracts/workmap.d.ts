import { z } from "zod";
/** A JSON-Logic rule over the normalized InvoiceState variables. */
export declare const JsonLogicSchema: z.ZodRecord<z.ZodString, z.ZodUnknown>;
export type JsonLogic = z.infer<typeof JsonLogicSchema>;
/** The only variables a guardrail rule may reference. */
export declare const JSONLOGIC_VARIABLES: readonly ["net_amount", "currency", "category", "supplier", "supplier_known", "invoice_month", "company_code", "cost_center", "asset_number", "approvals_count"];
export declare const EvidenceSchema: z.ZodObject<{
    event_id: z.ZodOptional<z.ZodString>;
    keyframe_id: z.ZodOptional<z.ZodString>;
    clip_id: z.ZodOptional<z.ZodString>;
    turn_id: z.ZodString;
    t_ms: z.ZodNumber;
}, z.core.$strip>;
export type Evidence = z.infer<typeof EvidenceSchema>;
export declare const OpenItemSchema: z.ZodObject<{
    id: z.ZodString;
    text: z.ZodString;
    anchor_t_ms: z.ZodOptional<z.ZodNumber>;
    origin: z.ZodEnum<{
        live: "live";
        builder: "builder";
        learner_gap: "learner_gap";
    }>;
    status: z.ZodEnum<{
        open: "open";
        asked: "asked";
        resolved: "resolved";
    }>;
}, z.core.$strip>;
export type OpenItem = z.infer<typeof OpenItemSchema>;
export declare const StepSchema: z.ZodObject<{
    id: z.ZodUUID;
    key: z.ZodString;
    ordinal: z.ZodNumber;
    title: z.ZodString;
    screen_moment: z.ZodObject<{
        t_ms: z.ZodNumber;
        label: z.ZodString;
        event_ids: z.ZodArray<z.ZodString>;
        entity: z.ZodOptional<z.ZodString>;
        field: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    decision: z.ZodString;
    reason: z.ZodNullable<z.ZodObject<{
        quote: z.ZodString;
        quote_en: z.ZodOptional<z.ZodString>;
        turn_id: z.ZodString;
        source_label: z.ZodString;
    }, z.core.$strip>>;
    guardrail_ids: z.ZodArray<z.ZodUUID>;
    is_judgment_call: z.ZodBoolean;
    screen_signature: z.ZodObject<{
        app: z.ZodString;
        record_kind: z.ZodString;
        field: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type Step = z.infer<typeof StepSchema>;
export declare const GuardrailSchema: z.ZodObject<{
    id: z.ZodUUID;
    key: z.ZodString;
    kind: z.ZodEnum<{
        threshold: "threshold";
        condition: "condition";
        stop_and_ask: "stop_and_ask";
        second_approval: "second_approval";
        hold: "hold";
    }>;
    description: z.ZodString;
    rule: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    consequence: z.ZodObject<{
        require: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        block: z.ZodOptional<z.ZodBoolean>;
        action: z.ZodOptional<z.ZodEnum<{
            second_approval: "second_approval";
            hold: "hold";
            ask_controller: "ask_controller";
        }>>;
    }, z.core.$strip>;
    quote: z.ZodString;
    quote_en: z.ZodOptional<z.ZodString>;
    evidence: z.ZodArray<z.ZodObject<{
        event_id: z.ZodOptional<z.ZodString>;
        keyframe_id: z.ZodOptional<z.ZodString>;
        clip_id: z.ZodOptional<z.ZodString>;
        turn_id: z.ZodString;
        t_ms: z.ZodNumber;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type Guardrail = z.infer<typeof GuardrailSchema>;
export declare const WorkMapSchema: z.ZodObject<{
    id: z.ZodUUID;
    workflow_id: z.ZodString;
    expert_id: z.ZodString;
    version: z.ZodNumber;
    status: z.ZodEnum<{
        confirmed: "confirmed";
        draft: "draft";
        in_debrief: "in_debrief";
        published: "published";
        retired: "retired";
    }>;
    title: z.ZodString;
    language: z.ZodString;
    steps: z.ZodArray<z.ZodObject<{
        id: z.ZodUUID;
        key: z.ZodString;
        ordinal: z.ZodNumber;
        title: z.ZodString;
        screen_moment: z.ZodObject<{
            t_ms: z.ZodNumber;
            label: z.ZodString;
            event_ids: z.ZodArray<z.ZodString>;
            entity: z.ZodOptional<z.ZodString>;
            field: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
        decision: z.ZodString;
        reason: z.ZodNullable<z.ZodObject<{
            quote: z.ZodString;
            quote_en: z.ZodOptional<z.ZodString>;
            turn_id: z.ZodString;
            source_label: z.ZodString;
        }, z.core.$strip>>;
        guardrail_ids: z.ZodArray<z.ZodUUID>;
        is_judgment_call: z.ZodBoolean;
        screen_signature: z.ZodObject<{
            app: z.ZodString;
            record_kind: z.ZodString;
            field: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>>;
    guardrails: z.ZodArray<z.ZodObject<{
        id: z.ZodUUID;
        key: z.ZodString;
        kind: z.ZodEnum<{
            threshold: "threshold";
            condition: "condition";
            stop_and_ask: "stop_and_ask";
            second_approval: "second_approval";
            hold: "hold";
        }>;
        description: z.ZodString;
        rule: z.ZodRecord<z.ZodString, z.ZodUnknown>;
        consequence: z.ZodObject<{
            require: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
            block: z.ZodOptional<z.ZodBoolean>;
            action: z.ZodOptional<z.ZodEnum<{
                second_approval: "second_approval";
                hold: "hold";
                ask_controller: "ask_controller";
            }>>;
        }, z.core.$strip>;
        quote: z.ZodString;
        quote_en: z.ZodOptional<z.ZodString>;
        evidence: z.ZodArray<z.ZodObject<{
            event_id: z.ZodOptional<z.ZodString>;
            keyframe_id: z.ZodOptional<z.ZodString>;
            clip_id: z.ZodOptional<z.ZodString>;
            turn_id: z.ZodString;
            t_ms: z.ZodNumber;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
    open_items: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        text: z.ZodString;
        anchor_t_ms: z.ZodOptional<z.ZodNumber>;
        origin: z.ZodEnum<{
            live: "live";
            builder: "builder";
            learner_gap: "learner_gap";
        }>;
        status: z.ZodEnum<{
            open: "open";
            asked: "asked";
            resolved: "resolved";
        }>;
    }, z.core.$strip>>;
    confirmed_turn_id: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type WorkMap = z.infer<typeof WorkMapSchema>;
export declare const WorkMapPublishedSchema: z.ZodObject<{
    workmap_id: z.ZodString;
    workflow_id: z.ZodString;
    version: z.ZodNumber;
}, z.core.$strip>;
export type WorkMapPublished = z.infer<typeof WorkMapPublishedSchema>;
export declare const StepOutcomeSchema: z.ZodEnum<{
    independent_correct: "independent_correct";
    prompted_correct: "prompted_correct";
    corrected_after_intervention: "corrected_after_intervention";
    not_attempted: "not_attempted";
}>;
export type StepOutcome = z.infer<typeof StepOutcomeSchema>;
export declare const MasterySummarySchema: z.ZodObject<{
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
export type MasterySummary = z.infer<typeof MasterySummarySchema>;
