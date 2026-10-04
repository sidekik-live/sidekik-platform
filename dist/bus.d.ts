import type { Logger } from "pino";
import type { Envelope, ServiceName } from "./contracts/envelope.js";
import { type StreamKey, type StreamPayload } from "./streams.js";
export type ConsumeOptions = {
    /** Consumer group; defaults to the service name. */
    group?: string;
    /** Max entries per XREADGROUP. */
    batch?: number;
    /** XREADGROUP BLOCK in ms. */
    blockMs?: number;
    /** Attempts per event before it goes to the dead-letter stream. */
    maxAttempts?: number;
    /** Delay between attempts in ms (multiplied by the attempt number). */
    retryDelayMs?: number;
};
export type EventHandler<K extends StreamKey> = (ev: Envelope<StreamPayload<K>>) => Promise<void>;
export interface Bus {
    /** Validates and appends an event (XADD MAXLEN ~ 10000). Returns the stream entry id. */
    publish<K extends StreamKey>(stream: K, ev: Envelope<StreamPayload<K>>): Promise<string>;
    /**
     * Reads the stream through a consumer group, one event at a time, in order.
     * Invalid events are logged and acked. Failed handlers are retried, then the
     * event is copied to `sk:dlq` and acked. Handled event ids are remembered so a
     * redelivered event is skipped. Returns a function that stops this consumer.
     */
    consume<K extends StreamKey>(stream: K, handler: EventHandler<K>, opts?: ConsumeOptions): () => void;
    close(): Promise<void>;
}
export type CreateBusOptions = {
    logger?: Logger;
    /** Consumer name inside the group. Stable by default so a restart drains its own pending entries. */
    consumerName?: string;
};
export declare function createBus(redisUrl: string, service: ServiceName, options?: CreateBusOptions): Bus;
