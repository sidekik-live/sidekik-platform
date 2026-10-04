import { pino } from "pino";
/** Service logger: JSON lines with `service` on every line. */
export function createLogger(service, options = {}) {
    return pino({
        level: process.env.LOG_LEVEL ?? "info",
        base: { service },
        timestamp: pino.stdTimeFunctions.isoTime,
        ...options,
    });
}
/** Child logger carrying `session_id`, `org_id` and `event_id` for one bus event. */
export function eventLogger(logger, ev) {
    return logger.child({ session_id: ev.session_id, org_id: ev.org_id, event_id: ev.id });
}
/** Child logger carrying `session_id` and `org_id`. */
export function sessionLogger(logger, session) {
    return logger.child({ session_id: session.session_id, org_id: session.org_id });
}
//# sourceMappingURL=logger.js.map