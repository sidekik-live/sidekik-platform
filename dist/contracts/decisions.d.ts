import { z } from "zod";
import { ServiceNameSchema } from "./envelope.js";
export declare const DECISION_IDS: readonly ["D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8", "D9", "D10", "D11", "D12"];
export declare const DecisionIdSchema: z.ZodEnum<{
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
export type DecisionId = z.infer<typeof DecisionIdSchema>;
export declare const DecisionProviderSchema: z.ZodEnum<{
    jev: "jev";
    "openrouter-jev": "openrouter-jev";
    llm: "llm";
}>;
export type DecisionProvider = z.infer<typeof DecisionProviderSchema>;
export declare const DecisionRequestSchema: z.ZodObject<{
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
export type DecisionRequest = z.infer<typeof DecisionRequestSchema>;
/** One question's answer inside a decision (D6, D1, D5 and D7 ask more than one question). */
export declare const QuestionAnswerSchema: z.ZodObject<{
    answer: z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean]>;
    confidence: z.ZodNumber;
    probabilities: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNumber>>;
    p_true: z.ZodOptional<z.ZodNumber>;
    score: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export type QuestionAnswer = z.infer<typeof QuestionAnswerSchema>;
export declare const DecisionResultSchema: z.ZodObject<{
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
}, z.core.$strip>;
export type DecisionResult = z.infer<typeof DecisionResultSchema>;
/** Response body of brain `POST /internal/decide`. */
export declare const DecisionResponseSchema: z.ZodObject<{
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
export type DecisionResponse = z.infer<typeof DecisionResponseSchema>;
export type NoulQuestionSpec = {
    type: "noul";
    instructions: string;
    criteria: {
        true: string;
        false: string;
    };
};
export type ChoiceQuestionSpec<O extends string = string> = {
    type: "choice";
    instructions: string;
    options: readonly O[];
    criteria: Record<O, string>;
};
export type ScoreQuestionSpec = {
    type: "score";
    instructions: string;
    min: 1;
    max: 4;
    criteria: Record<"1" | "2" | "3" | "4", string>;
};
export type QuestionSpec = NoulQuestionSpec | ChoiceQuestionSpec | ScoreQuestionSpec;
export type QuestionPrimitive = QuestionSpec["type"];
export type DecisionSpec = {
    id: DecisionId;
    used_by: z.infer<typeof ServiceNameSchema>;
    /**
     * Question name → spec. For specs with `per_candidate`, names contain the
     * placeholder `{n}` and are expanded once per candidate (1-based).
     */
    questions: Record<string, QuestionSpec>;
    per_candidate?: {
        max: number;
    };
    /** Plain-language action rule from Appendix A (thresholds live in the consumer). */
    action_rule: string;
};
export declare const DECISION_SPECS: {
    readonly D1: {
        readonly id: "D1";
        readonly used_by: "brain";
        readonly questions: {
            readonly pause_now: NoulQuestionSpec;
            readonly activity: ChoiceQuestionSpec<"typing" | "cannot_tell" | "finished_substep" | "navigating" | "reading" | "talking">;
        };
        readonly action_rule: "ask if pause_now >= 0.85 and activity finished_substep >= 0.80";
    };
    readonly D2: {
        readonly id: "D2";
        readonly used_by: "brain";
        readonly questions: {
            readonly event_class: ChoiceQuestionSpec<"cannot_tell" | "data_copy" | "exception_handling" | "judgment_call" | "routine_navigation">;
        };
        readonly action_rule: "only judgment_call or exception_handling >= 0.80 spawns candidate questions";
    };
    readonly D3: {
        readonly id: "D3";
        readonly used_by: "brain";
        readonly per_candidate: {
            readonly max: 4;
        };
        readonly questions: {
            readonly "answered_q{n}": NoulQuestionSpec;
            readonly "value_q{n}": ScoreQuestionSpec;
        };
        readonly action_rule: "ask the highest value among candidates with answered < 0.15";
    };
    readonly D4: {
        readonly id: "D4";
        readonly used_by: "brain";
        readonly questions: {
            readonly qtype: ChoiceQuestionSpec<"stop_and_ask" | "exception" | "limit" | "other" | "why">;
        };
        readonly action_rule: "guardrail quota: after 2 asks without limit/stop_and_ask, the next ask must be one";
    };
    readonly D5: {
        readonly id: "D5";
        readonly used_by: "brain";
        readonly questions: {
            readonly content_class: ChoiceQuestionSpec<"deflection" | "guardrail_only" | "neither" | "reason_and_guardrail" | "reason_only">;
            readonly has_numeric_or_date_condition: NoulQuestionSpec;
        };
        readonly action_rule: "store the answer; extract the rule text if has_numeric_or_date_condition";
    };
    readonly D6: {
        readonly id: "D6";
        readonly used_by: "mapper";
        readonly questions: {
            readonly specificity: ScoreQuestionSpec;
            readonly refers_to_unknown_entity: NoulQuestionSpec;
        };
        readonly action_rule: "specificity <= 1 or refers_to_unknown_entity → open item";
    };
    readonly D7: {
        readonly id: "D7";
        readonly used_by: "brain";
        readonly questions: {
            readonly off_record_request: NoulQuestionSpec;
            readonly back_on_record: NoulQuestionSpec;
        };
        readonly action_rule: "run after the regex prefilter; >= 0.5 → call gateway off-record";
    };
    readonly D8: {
        readonly id: "D8";
        readonly used_by: "mapper";
        readonly questions: {
            readonly teachback_reply: ChoiceQuestionSpec<"confirmed" | "confirmed_minor" | "corrected" | "unclear">;
        };
        readonly action_rule: "confidence < 0.80 → mapper re-asks";
    };
    readonly D9: {
        readonly id: "D9";
        readonly used_by: "tutor";
        readonly questions: {
            readonly prediction_grade: ChoiceQuestionSpec<"correct_no_reason" | "correct_with_reason" | "no_answer" | "partially" | "wrong">;
        };
        readonly action_rule: "sets the attempt outcome";
    };
    readonly D10: {
        readonly id: "D10";
        readonly used_by: "tutor";
        readonly questions: {
            readonly divergence: ChoiceQuestionSpec<"cannot_tell" | "acceptable_variant" | "diverges" | "same_as_expert">;
        };
        readonly action_rule: "diverges >= 0.80 → soft hint";
    };
    readonly D11: {
        readonly id: "D11";
        readonly used_by: "tutor";
        readonly questions: {
            readonly intervention_style: ChoiceQuestionSpec<"hint_soft" | "intervene_now" | "wait_and_watch">;
        };
        readonly action_rule: "a save attempt with a pending violation always intervenes";
    };
    readonly D12: {
        readonly id: "D12";
        readonly used_by: "mapper";
        readonly questions: {
            readonly expert_signals_done: NoulQuestionSpec;
        };
        readonly action_rule: "supports the coverage check";
    };
};
/** Expands `{n}` question names for per-candidate specs (D3), 1-based. */
export declare function expandQuestions(spec: DecisionSpec, candidates?: number): Record<string, QuestionSpec>;
