/*------------------------------------------------------------------------------
 | Audit Log Module
 |------------------------------------------------------------------------------
 | This module contains the logic for creating and writing to the audit log.
 |
 | [STIGS]
 | @stig V-222446 | The application must record a time stamp indicating when the event occurred.
 | @stig V-222447 | The application must provide audit record generation capability for HTTP headers including User-Agent, Referer, GET, and POST.
 | @stig V-222449 | The application must record the username or user ID of the user associated with the event.
 | @stig V-222474 | The application must produce audit records containing enough information to establish which component, feature or function of the application triggered the audit event.
 | @stig V-222473 | The application must produce audit records containing information to establish when (date and time) the events occurred.
 | @stig V-222475 | When using centralized logging; the application must include a unique identifier in order to distinguish itself from other application logs.
 | @stig V-222476 | The application must produce audit records that contain information to establish the outcome of the events.
 | @stig V-222477 | The application must generate audit records containing information that establishes the identity of any individual or process associated with the event.
 | @stig V-222482 | The application must be configured to write application logs to a centralized log repository.
 | @stig V-222499 | The application must record time stamps for audit records that meet a granularity of one second for a minimum degree of precision.
 |
 | [Explanation]
 | For more information, please see the `docs/security/Auditing.md` file.
 */


/**
 * The AuditLogTag is a unique symbol within the running process that is used to
 * identify the audit log object. The AuditLogSymbol is used to ensure that the
 * audit log object is not created in an ad-hoc manner, and that the audit log
 * object is only created by the `create` function.
 * Since this symbol is unique within the running process and it is not exposed
 * outside of the module, it is impossible for any other code to create an audit
 * log object.
 *
 * **NOTE:** We are using javascript, and as such, this can be circumvented by
 * using `Object.getOwnPropertySymbols` to get the symbol and then creating an
 * object with that symbol. This should be considered a bug in the code that
 * does that, and should be fixed in code reviews.
 */
const AuditLogSymbol = Symbol("AuditLog");


/**
 * The AuditLog is an object that is used to write auditable events to the
 * audit log. This exists as a type that can be passed around for two reasons:
 *
 * 1. To avoid individual writes to have to know which service or process they
 *    are writing from. That information is stored in the audit log object.
 * 2. To ensure that the audit log object is only created by the `create`
 *    function and is not created in an ad-hoc manner.
 */
export type AuditLog = {
    // The unique symbol that ensures that the audit log object is not created
    // in an ad-hoc manner.
    readonly symbol: typeof AuditLogSymbol;

    // The stream that the audit log object writes to.
    readonly outStream: Writable;

    // The source of the audit log object. This is the process or service that
    // is emitting the auditable event.
    readonly source: string;
};


/**
 * The Writable interface is used to ensure that the outStream object has a
 * `write` method that accepts a string.
 */
export type Writable = {
    write: (message: string) => unknown;
};


/**
 * Create a new AuditLog.
 *
 * This attaches the symbol to the object to ensure that the audit log object
 * is not created in an ad-hoc manner. It also freezes the object to ensure that
 * it cannot be modified.
 *
 * @param source The source of the audit log.
 */
export function create(
    source: string,
    outStream: Writable = process.stdout,
): AuditLog {
    return Object.freeze({ source, outStream, symbol: AuditLogSymbol });
}


/**
 * The shape of an auditable event.
 */
export type Event = {
    // A unique action name that identifies the auditable event.
    readonly action: string;
    // The outcome of the action.
    readonly outcome: "pending" | "success" | "failure";
    // Whether or not the action that occurred is considered privileged.
    readonly privileged: boolean;
    // The principal is the id of the user that is associated with the event.
    // This is optional because some events can occur without a user being
    // associated with them, such as internal service-to-service communication.
    readonly principal?: string;
    // The session id is the id of the session that is associated with the event.
    // This is optional because some events can occur without a session being
    // associated with them, such as internal service-to-service communication.
    readonly sessionId?: string;
    // The url that the request was made to.
    readonly requestUrl?: string;
    // The method that was used to make the request.
    readonly requestMethod?: string;
    // The referrer that was used to make the request.
    readonly requestReferrer?: string;
    // The user agent that was used to make the request.
    readonly requestUserAgent?: string;
    // Any additional metadata that is associated with the event.
    readonly metadata?: Record<string, unknown>;
};


/**
 * Write a new message to the audit log.
 *
 * @param auditLog The audit log to write to.
 * @param event The event to write to the audit log.
 */
export function write(auditLog: AuditLog, event: Event): void {
    const message = JSON.stringify({
        // @stig V-222475 | When using centralized logging; the application must include a unique identifier in order to distinguish itself from other application logs.
        tag: "SHIELDAuditEvent",
        // @stig V-222446 | The application must record a time stamp indicating when the event occurred.
        // @stig V-222473 | The application must produce audit records containing information to establish when (date and time) the events occurred.
        // @stig V-222499 | The application must record time stamps for audit records that meet a granularity of one second for a minimum degree of precision.
        timestamp: Date.now(),
        // @stig V-222474 | The application must produce audit records containing enough information to establish which component, feature or function of the application triggered the audit event.
        service: auditLog.source,
        action: event.action,
        // @stig V-222476 | The application must produce audit records that contain information to establish the outcome of the events.
        outcome: event.outcome,
        privileged: event.privileged,
        // The principal is the id of the user that is associated with the event,
        // or the name of a service that initiated the event.
        // @stig V-222449 | The application must record the username or user ID of the user associated with the event.
        // @stig V-222477 | The application must generate audit records containing information that establishes the identity of any individual or process associated with the event.
        principal: event.principal,
        sessionId: event.sessionId,
        requestUrl: event.requestUrl,
        // ---- Begin Group ---- //
        // @stig V-222447 | The application must provide audit record generation capability for HTTP headers including User-Agent, Referer, GET, and POST.
        requestMethod: event?.requestMethod ?? "N/A",
        requestReferrer: event?.requestReferrer ?? "N/A",
        requestUserAgent: event?.requestUserAgent ?? "N/A",
        // ---- End Group ---- //
        metadata: event.metadata,
    });

    // CReATE handles the centralized storage of audit logs.
    // Our responsibility is to write the logs to stdout.
    // @stig V-222482 | The application must be configured to write application logs to a centralized log repository.
    auditLog.outStream.write(`${message}\n`);
}
