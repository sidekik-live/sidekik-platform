/**
 * Presidio PII redaction, shared by gateway (transcript turns) and perception (screen text).
 * The analyzer image and its recognizers live in infra/presidio; this is the client side:
 * which entities to redact, what must never be redacted, and the analyze → anonymize call.
 */
import { z } from "zod";
/** Entities Sidekik redacts (infra/presidio/recognizers.yaml + spaCy PERSON). */
export const PRESIDIO_ENTITIES = [
    "PERSON",
    "EMAIL_ADDRESS",
    "PHONE_NUMBER",
    "IBAN_CODE",
    "CREDIT_CARD",
    "IP_ADDRESS",
    "DE_VAT_ID",
    "CZ_VAT_ID",
];
export const PRESIDIO_LANGUAGES = ["en", "de"];
/**
 * Never redacted (Presidio allow_list, regex mode). Each pattern is matched with `search` against the
 * detected span, case-insensitively, so every pattern MUST be anchored ^…$ (test/presidio.test.ts checks).
 */
export const PRESIDIO_ALLOW_LIST = [
    // AP business data: invoice / supplier / cost-center numbers, company codes, asset and document numbers.
    "^#?\\d{4,6}$",
    "^(?:DE|CZ)\\d{2}$",
    "^A-\\d{4}-\\d+$",
    "^(?:INV|PO|RE|BE)-?[\\d-]+$",
    // German sentence-initial imperatives the de_core_news_md NER tags as PERSON ("Frag den Peter …").
    "^(?:Frag|Fragen|Ruf|Schau|Guck|Sag|Gib|Mach|Nimm|Schreib|Prüf|Buch|Trag)$",
];
/** Maps a session language ("de", "de-DE", "en-GB", …) to an analyzer language; anything else analyzes as English. */
export function presidioLanguage(lang) {
    const base = lang.toLowerCase().split(/[-_]/)[0];
    return base === "de" ? "de" : "en";
}
/** Legal-form suffixes that don't identify anyone on their own. */
const LEGAL_FORMS = new Set(["gmbh", "ag", "kg", "se", "ug", "ohg", "s.r.o.", "a.s.", "ltd", "inc", "llc", "co", "corp"]);
/**
 * Anchored allow-list patterns for business names in context (e.g. the supplier of the record on screen).
 * spaCy tags unfamiliar company names as PERSON ("Präzisionswerk", "Antriebstechnik Nord"), and losing the
 * supplier would erase what G3/G4 are about. Each name is allowed whole, plus every contiguous run of its
 * words that contains a significant word (≥ 4 letters, not a legal form), since NER spans can cover any
 * part ("Präzisionswerk", "Strojírna Brno").
 * Trade-off: a supplier named after a person ("Müller GmbH") lets "Müller" through in that call.
 */
export function keepPatterns(names) {
    const out = new Set();
    for (const raw of names) {
        const name = raw.trim();
        if (!name)
            continue;
        // Every contiguous run of words that contains a significant word: NER spans can cover any part.
        const words = name.split(/\s+/);
        const significant = (w) => w.length >= 4 && !LEGAL_FORMS.has(w.toLowerCase());
        for (let i = 0; i < words.length; i++) {
            for (let j = i + 1; j <= words.length; j++) {
                const run = words.slice(i, j);
                if (run.length === words.length || run.some(significant))
                    out.add(`^${escapeRegex(run.join(" "))}$`);
            }
        }
    }
    return [...out];
}
export function analyzeRequest(text, lang, keep = []) {
    return {
        text,
        language: presidioLanguage(lang),
        entities: [...PRESIDIO_ENTITIES],
        allow_list: [...PRESIDIO_ALLOW_LIST, ...keepPatterns(keep)],
        allow_list_match: "regex",
    };
}
function escapeRegex(s) {
    return s.replace(/[.*+?^${}()|[\]\\/-]/g, "\\$&");
}
export const PresidioFindingSchema = z.object({
    entity_type: z.string(),
    start: z.number().int().nonnegative(),
    end: z.number().int().nonnegative(),
    score: z.number(),
});
const AnonymizeResponseSchema = z.object({ text: z.string() });
/**
 * Redacts PII: analyzer finds entities, anonymizer replaces each with `<ENTITY_TYPE>`.
 * Throws on any Presidio failure: callers must not pass unredacted text on (fail closed).
 */
export async function redact(text, lang, opts) {
    if (text.trim() === "")
        return { text, findings: [] };
    const f = opts.fetch ?? fetch;
    const timeout = opts.timeoutMs ?? 300;
    const post = async (url, body) => {
        const res = await f(url, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(body),
            signal: AbortSignal.timeout(timeout),
        });
        if (!res.ok)
            throw new Error(`presidio ${url}: HTTP ${res.status}`);
        return res.json();
    };
    const findings = z.array(PresidioFindingSchema).parse(await post(`${trim(opts.analyzerUrl)}/analyze`, analyzeRequest(text, lang, opts.keep)));
    if (findings.length === 0)
        return { text, findings };
    const anonymized = AnonymizeResponseSchema.parse(await post(`${trim(opts.anonymizerUrl)}/anonymize`, {
        text,
        analyzer_results: findings,
        anonymizers: { DEFAULT: { type: "replace" } },
    }));
    return { text: anonymized.text, findings };
}
function trim(url) {
    return url.replace(/\/+$/, "");
}
//# sourceMappingURL=presidio.js.map