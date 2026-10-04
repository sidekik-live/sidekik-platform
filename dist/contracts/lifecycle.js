import { z } from "zod";
export const SessionKindSchema = z.enum(["capture", "tutor"]);
export const PhaseSchema = z.enum(["capture", "building", "debrief", "confirmed", "tutoring", "done"]);
export const SessionModeSchema = z.enum(["browser", "meeting", "replay"]);
export const SessionLifecycleSchema = z.object({
    event: z.enum([
        "started",
        "task_done",
        "phase_changed",
        "offrecord_on",
        "offrecord_off",
        "ended",
        "bot_joined",
        "bot_left",
        "bot_error",
    ]),
    kind: SessionKindSchema,
    phase: PhaseSchema,
    workflow_id: z.string().min(1),
    workmap_id: z.string().min(1).optional(),
    mode: SessionModeSchema,
    language: z.string().min(1),
});
//# sourceMappingURL=lifecycle.js.map