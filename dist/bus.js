import { Redis } from "ioredis";
import { DLQ_STREAM, STREAM_MAXLEN, defaultGroup, streamEnvelopeSchema, } from "./streams.js";
/** Field name under which the JSON envelope is stored in each stream entry. */
const FIELD = "ev";
/** How long a handled event id is remembered for de-duplication. */
const SEEN_TTL_SEC = 24 * 60 * 60;
export function createBus(redisUrl, service, options = {}) {
    const log = options.logger;
    const consumerName = options.consumerName ?? service;
    const pub = new Redis(redisUrl, { maxRetriesPerRequest: null });
    const consumers = new Set();
    let closed = false;
    async function publish(stream, ev) {
        const parsed = streamEnvelopeSchema(stream).parse(ev);
        const id = await pub.xadd(stream, "MAXLEN", "~", STREAM_MAXLEN, "*", FIELD, JSON.stringify(parsed));
        if (!id)
            throw new Error(`XADD to ${stream} returned no id`);
        return id;
    }
    function consume(stream, handler, opts = {}) {
        if (closed)
            throw new Error("bus is closed");
        const group = opts.group ?? defaultGroup(service);
        const batch = opts.batch ?? 10;
        const blockMs = opts.blockMs ?? 1000;
        const maxAttempts = opts.maxAttempts ?? 3;
        const retryDelayMs = opts.retryDelayMs ?? 100;
        const schema = streamEnvelopeSchema(stream);
        // XREADGROUP BLOCK holds its connection, so every consumer gets its own.
        const conn = new Redis(redisUrl, { maxRetriesPerRequest: null });
        let running = true;
        const seenKey = (eventId) => `sk:seen:${group}:${stream}:${eventId}`;
        async function handleEntry(entryId, fields) {
            const raw = fieldValue(fields, FIELD);
            let ev;
            try {
                ev = schema.parse(JSON.parse(raw ?? "null"));
            }
            catch (err) {
                log?.warn({ stream, group, entry_id: entryId, err }, "bus: invalid event, acking without handling");
                await conn.xack(stream, group, entryId);
                return;
            }
            const ctx = { stream, group, entry_id: entryId, event_id: ev.id, session_id: ev.session_id, org_id: ev.org_id };
            if (await pub.exists(seenKey(ev.id))) {
                log?.debug(ctx, "bus: duplicate event, skipping");
                await conn.xack(stream, group, entryId);
                return;
            }
            let lastErr;
            for (let attempt = 1; attempt <= maxAttempts; attempt++) {
                const started = Date.now();
                try {
                    await handler(ev);
                    await pub.set(seenKey(ev.id), "1", "EX", SEEN_TTL_SEC);
                    await conn.xack(stream, group, entryId);
                    log?.debug({ ...ctx, latency_ms: Date.now() - started }, "bus: handled");
                    return;
                }
                catch (err) {
                    lastErr = err;
                    log?.warn({ ...ctx, attempt, err, latency_ms: Date.now() - started }, "bus: handler failed");
                    if (attempt < maxAttempts && running)
                        await sleep(retryDelayMs * attempt);
                }
            }
            await pub.xadd(DLQ_STREAM, "MAXLEN", "~", STREAM_MAXLEN, "*", "stream", stream, "group", group, "entry_id", entryId, "error", errorMessage(lastErr), FIELD, raw ?? "");
            await conn.xack(stream, group, entryId);
            log?.error({ ...ctx, err: lastErr }, "bus: event dead-lettered");
        }
        async function loop() {
            await ensureGroup(conn, stream, group);
            // "0" replays this consumer's pending entries (e.g. after a crash), ">" reads new ones.
            let cursor = "0";
            while (running) {
                let reply;
                try {
                    reply = (await conn.xreadgroup("GROUP", group, consumerName, "COUNT", batch, "BLOCK", blockMs, "STREAMS", stream, cursor));
                }
                catch (err) {
                    if (!running)
                        return;
                    log?.error({ stream, group, err }, "bus: XREADGROUP failed, retrying");
                    await sleep(500);
                    continue;
                }
                const entries = reply?.[0]?.[1] ?? [];
                if (cursor === "0" && entries.length === 0) {
                    cursor = ">";
                    continue;
                }
                for (const [entryId, fields] of entries) {
                    if (!running)
                        return;
                    // A pending entry whose payload was trimmed comes back with null fields.
                    if (fields === null) {
                        await conn.xack(stream, group, entryId);
                        continue;
                    }
                    try {
                        await handleEntry(entryId, fields);
                    }
                    catch (err) {
                        // Redis failed mid-handling; the entry stays pending and is replayed on restart.
                        log?.error({ stream, group, entry_id: entryId, err }, "bus: failed to settle entry");
                    }
                }
            }
        }
        const done = loop()
            .catch((err) => log?.error({ stream, group, err }, "bus: consumer stopped on error"))
            .finally(() => conn.disconnect());
        const entry = {
            stop: () => {
                running = false;
            },
            done,
        };
        consumers.add(entry);
        return () => {
            entry.stop();
            consumers.delete(entry);
        };
    }
    async function close() {
        closed = true;
        const pending = [...consumers];
        for (const c of pending)
            c.stop();
        await Promise.all(pending.map((c) => c.done));
        consumers.clear();
        await pub.quit();
    }
    return { publish, consume, close };
}
async function ensureGroup(conn, stream, group) {
    try {
        await conn.xgroup("CREATE", stream, group, "$", "MKSTREAM");
    }
    catch (err) {
        if (!errorMessage(err).includes("BUSYGROUP"))
            throw err;
    }
}
function fieldValue(fields, name) {
    if (!fields)
        return undefined;
    for (let i = 0; i + 1 < fields.length; i += 2) {
        if (fields[i] === name)
            return fields[i + 1];
    }
    return undefined;
}
function errorMessage(err) {
    return err instanceof Error ? err.message : String(err);
}
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
//# sourceMappingURL=bus.js.map