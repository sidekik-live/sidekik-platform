/**
 * Presidio PII redaction, shared by gateway (transcript turns) and perception (screen text).
 * The analyzer image and its recognizers live in infra/presidio; this is the client side:
 * which entities to redact, what must never be redacted, and the analyze → anonymize call.
 */
import { z } from "zod";
/** Entities Sidekik redacts (infra/presidio/recognizers.yaml + spaCy PERSON). */
export declare const PRESIDIO_ENTITIES: readonly ["PERSON", "EMAIL_ADDRESS", "PHONE_NUMBER", "IBAN_CODE", "CREDIT_CARD", "IP_ADDRESS", "DE_VAT_ID", "CZ_VAT_ID"];
export type PresidioEntity = (typeof PRESIDIO_ENTITIES)[number];
export declare const PRESIDIO_LANGUAGES: readonly ["en", "de"];
export type PresidioLanguage = (typeof PRESIDIO_LANGUAGES)[number];
/**
 * Never redacted (Presidio allow_list, regex mode). Each pattern is matched with `search` against the
 * detected span, case-insensitively, so every pattern MUST be anchored ^…$ (test/presidio.test.ts checks).
 */
export declare const PRESIDIO_ALLOW_LIST: readonly string[];
/** Maps a session language ("de", "de-DE", "en-GB", …) to an analyzer language; anything else analyzes as English. */
export declare function presidioLanguage(lang: string): PresidioLanguage;
/**
 * Anchored allow-list patterns for business names in context (e.g. the supplier of the record on screen).
 * spaCy tags unfamiliar company names as PERSON ("Präzisionswerk", "Antriebstechnik Nord"), and losing the
 * supplier would erase what G3/G4 are about. Each name is allowed whole, plus every contiguous run of its
 * words that contains a significant word (≥ 4 letters, not a legal form), since NER spans can cover any
 * part ("Präzisionswerk", "Strojírna Brno").
 * Trade-off: a supplier named after a person ("Müller GmbH") lets "Müller" through in that call.
 */
export declare function keepPatterns(names: readonly string[]): string[];
export declare function analyzeRequest(text: string, lang: string, keep?: readonly string[]): {
    text: string;
    language: "en" | "de";
    entities: ("PERSON" | "EMAIL_ADDRESS" | "PHONE_NUMBER" | "IBAN_CODE" | "CREDIT_CARD" | "IP_ADDRESS" | "DE_VAT_ID" | "CZ_VAT_ID")[];
    allow_list: string[];
    allow_list_match: "regex";
};
export declare const PresidioFindingSchema: z.ZodObject<{
    entity_type: z.ZodString;
    start: z.ZodNumber;
    end: z.ZodNumber;
    score: z.ZodNumber;
}, z.core.$strip>;
export type PresidioFinding = z.infer<typeof PresidioFindingSchema>;
export type RedactOptions = {
    analyzerUrl: string;
    anonymizerUrl: string;
    /** Per call; ARCHITECTURE §4.3 budget is 300 ms. */
    timeoutMs?: number;
    /** Business names to never redact here, e.g. the supplier of the record on screen (see keepPatterns). */
    keep?: readonly string[];
    fetch?: typeof fetch;
};
export type Redacted = {
    text: string;
    findings: PresidioFinding[];
};
/**
 * Redacts PII: analyzer finds entities, anonymizer replaces each with `<ENTITY_TYPE>`.
 * Throws on any Presidio failure: callers must not pass unredacted text on (fail closed).
 */
export declare function redact(text: string, lang: string, opts: RedactOptions): Promise<Redacted>;
