import { type Logger, type LoggerOptions } from "pino";
import type { Envelope, ServiceName } from "./contracts/envelope.js";
export type { Logger } from "pino";
/** Service logger: JSON lines with `service` on every line. */
export declare function createLogger(service: ServiceName, options?: LoggerOptions): Logger;
/** Child logger carrying `session_id`, `org_id` and `event_id` for one bus event. */
export declare function eventLogger(logger: Logger, ev: Pick<Envelope<unknown>, "id" | "session_id" | "org_id">): Logger;
/** Child logger carrying `session_id` and `org_id`. */
export declare function sessionLogger(logger: Logger, session: {
    session_id: string;
    org_id: string;
}): Logger;
