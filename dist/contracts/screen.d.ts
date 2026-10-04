import { z } from "zod";
export declare const InvoiceStateSchema: z.ZodObject<{
    invoice_id: z.ZodOptional<z.ZodString>;
    supplier: z.ZodOptional<z.ZodString>;
    supplier_known: z.ZodOptional<z.ZodBoolean>;
    net_amount: z.ZodOptional<z.ZodNumber>;
    currency: z.ZodOptional<z.ZodString>;
    invoice_date: z.ZodOptional<z.ZodString>;
    invoice_month: z.ZodOptional<z.ZodNumber>;
    company_code: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodString>;
    cost_center: z.ZodOptional<z.ZodString>;
    asset_number: z.ZodOptional<z.ZodString>;
    approvals_count: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export type InvoiceState = z.infer<typeof InvoiceStateSchema>;
export declare const ScreenStateSchema: z.ZodObject<{
    app: z.ZodOptional<z.ZodString>;
    screen: z.ZodOptional<z.ZodString>;
    record: z.ZodOptional<z.ZodObject<{
        invoice_id: z.ZodOptional<z.ZodString>;
        supplier: z.ZodOptional<z.ZodString>;
        supplier_known: z.ZodOptional<z.ZodBoolean>;
        net_amount: z.ZodOptional<z.ZodNumber>;
        currency: z.ZodOptional<z.ZodString>;
        invoice_date: z.ZodOptional<z.ZodString>;
        invoice_month: z.ZodOptional<z.ZodNumber>;
        company_code: z.ZodOptional<z.ZodString>;
        category: z.ZodOptional<z.ZodString>;
        cost_center: z.ZodOptional<z.ZodString>;
        asset_number: z.ZodOptional<z.ZodString>;
        approvals_count: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
    focused_field: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type ScreenState = z.infer<typeof ScreenStateSchema>;
export declare const DomEventSchema: z.ZodObject<{
    kind: z.ZodEnum<{
        field_focus: "field_focus";
        field_change: "field_change";
        save_attempt: "save_attempt";
        record_open: "record_open";
    }>;
    record: z.ZodOptional<z.ZodObject<{
        kind: z.ZodString;
        id: z.ZodString;
    }, z.core.$strip>>;
    field: z.ZodOptional<z.ZodString>;
    before: z.ZodOptional<z.ZodString>;
    after: z.ZodOptional<z.ZodString>;
    state: z.ZodOptional<z.ZodObject<{
        invoice_id: z.ZodOptional<z.ZodString>;
        supplier: z.ZodOptional<z.ZodString>;
        supplier_known: z.ZodOptional<z.ZodBoolean>;
        net_amount: z.ZodOptional<z.ZodNumber>;
        currency: z.ZodOptional<z.ZodString>;
        invoice_date: z.ZodOptional<z.ZodString>;
        invoice_month: z.ZodOptional<z.ZodNumber>;
        company_code: z.ZodOptional<z.ZodString>;
        category: z.ZodOptional<z.ZodString>;
        cost_center: z.ZodOptional<z.ZodString>;
        asset_number: z.ZodOptional<z.ZodString>;
        approvals_count: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type DomEvent = z.infer<typeof DomEventSchema>;
export declare const ScreenEventTypeSchema: z.ZodEnum<{
    app_opened: "app_opened";
    record_opened: "record_opened";
    field_changed: "field_changed";
    button_clicked: "button_clicked";
    value_read: "value_read";
    navigation: "navigation";
    dialog: "dialog";
    typing_in_progress: "typing_in_progress";
    idle: "idle";
}>;
export type ScreenEventType = z.infer<typeof ScreenEventTypeSchema>;
export declare const ScreenEventSchema: z.ZodObject<{
    event_id: z.ZodString;
    type: z.ZodEnum<{
        app_opened: "app_opened";
        record_opened: "record_opened";
        field_changed: "field_changed";
        button_clicked: "button_clicked";
        value_read: "value_read";
        navigation: "navigation";
        dialog: "dialog";
        typing_in_progress: "typing_in_progress";
        idle: "idle";
    }>;
    entity: z.ZodOptional<z.ZodObject<{
        kind: z.ZodString;
        id: z.ZodString;
    }, z.core.$strip>>;
    field: z.ZodOptional<z.ZodString>;
    before: z.ZodOptional<z.ZodString>;
    after: z.ZodOptional<z.ZodString>;
    state: z.ZodObject<{
        app: z.ZodOptional<z.ZodString>;
        screen: z.ZodOptional<z.ZodString>;
        record: z.ZodOptional<z.ZodObject<{
            invoice_id: z.ZodOptional<z.ZodString>;
            supplier: z.ZodOptional<z.ZodString>;
            supplier_known: z.ZodOptional<z.ZodBoolean>;
            net_amount: z.ZodOptional<z.ZodNumber>;
            currency: z.ZodOptional<z.ZodString>;
            invoice_date: z.ZodOptional<z.ZodString>;
            invoice_month: z.ZodOptional<z.ZodNumber>;
            company_code: z.ZodOptional<z.ZodString>;
            category: z.ZodOptional<z.ZodString>;
            cost_center: z.ZodOptional<z.ZodString>;
            asset_number: z.ZodOptional<z.ZodString>;
            approvals_count: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>>;
        focused_field: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    confidence: z.ZodNumber;
    source: z.ZodEnum<{
        vision: "vision";
        dom: "dom";
    }>;
    keyframe_id: z.ZodOptional<z.ZodString>;
    untrusted_screen_text: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type ScreenEvent = z.infer<typeof ScreenEventSchema>;
