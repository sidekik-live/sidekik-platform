import { z } from "zod";
export declare const TranscriptTurnSchema: z.ZodObject<{
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
export type TranscriptTurn = z.infer<typeof TranscriptTurnSchema>;
export declare const SpeechSignalSchema: z.ZodObject<{
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
export type SpeechSignal = z.infer<typeof SpeechSignalSchema>;
