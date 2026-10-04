import { z } from "zod";
export declare const ServiceNameSchema: z.ZodEnum<{
    tutor: "tutor";
    gateway: "gateway";
    perception: "perception";
    brain: "brain";
    mapper: "mapper";
    voice: "voice";
    meetbot: "meetbot";
}>;
export type ServiceName = z.infer<typeof ServiceNameSchema>;
/** Wraps a payload schema in the bus envelope every event carries. */
export declare function envelopeSchema<T extends z.ZodType>(data: T): z.ZodObject<{
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
    data: T;
}, z.core.$strip>;
export type Envelope<T> = {
    id: string;
    type: string;
    v: 1;
    org_id: string;
    session_id: string;
    /** ms since session start */
    t_ms: number;
    /** ISO wall clock */
    ts: string;
    producer: ServiceName;
    data: T;
};
export type MakeEventInput<T> = {
    type: string;
    org_id: string;
    session_id: string;
    t_ms: number;
    producer: ServiceName;
    data: T;
    id?: string;
    ts?: string;
};
export declare function makeEvent<T>(input: MakeEventInput<T>): Envelope<T>;
