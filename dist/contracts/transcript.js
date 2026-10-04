import { z } from "zod";
export const TranscriptTurnSchema = z.object({
    turn_id: z.string().min(1),
    role: z.enum(["user", "agent"]),
    text: z.string(),
    lang: z.string().min(1),
    source: z.enum(["live", "webhook"]),
    /** Turns on the bus are always redacted by the gateway first. */
    redacted: z.literal(true),
});
export const SpeechSignalSchema = z.object({
    kind: z.enum(["user_speech_start", "user_speech_end", "agent_speech_start", "agent_speech_end", "typing"]),
    source: z.enum(["sdk", "recall", "dom"]),
});
//# sourceMappingURL=transcript.js.map