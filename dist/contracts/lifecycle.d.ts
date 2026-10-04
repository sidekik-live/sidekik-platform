import { z } from "zod";
export declare const SessionKindSchema: z.ZodEnum<{
    capture: "capture";
    tutor: "tutor";
}>;
export type SessionKind = z.infer<typeof SessionKindSchema>;
export declare const PhaseSchema: z.ZodEnum<{
    capture: "capture";
    building: "building";
    debrief: "debrief";
    confirmed: "confirmed";
    tutoring: "tutoring";
    done: "done";
}>;
export type Phase = z.infer<typeof PhaseSchema>;
export declare const SessionModeSchema: z.ZodEnum<{
    browser: "browser";
    meeting: "meeting";
    replay: "replay";
}>;
export type SessionMode = z.infer<typeof SessionModeSchema>;
export declare const SessionLifecycleSchema: z.ZodObject<{
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
    reason: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type SessionLifecycle = z.infer<typeof SessionLifecycleSchema>;
