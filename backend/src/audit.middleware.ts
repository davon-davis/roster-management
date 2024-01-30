import { type RequestHandler } from "express";
import * as AuditLog from "./auditlog";
// import * as Session from "../session";


/**
 * These are required parameters that need to be defined **per route**. They
 * are used to identify attributes about the specific request that is being
 * audited.
 */
export type AuditParams = {
    readonly privileged: boolean;
    readonly action: string;
};


/**
 * A convenience type that can be used by tooling and other modules to
 * represent the audit middleware. This allows the parameters to be defined
 * once and then kept in sync.
 */
export type AuditMiddleware = (params: AuditParams) => RequestHandler;

/**
 * Create the audit middleware that will be used to audit requests.
 *
 * @param secret The secret used to decode session tokens.
 * @param log The audit log object that is used to write the audit log entry.
 */
export function createAuditMiddleware(secret: string, log: AuditLog.AuditLog): AuditMiddleware {
    // const getSession = Session.fromAuthHeaders(secret);

    /**
     * Audit middleware that is meant to be used for a single route. This
     * requires the developer to define the `action` and `privileged` parameters
     * for the route that is being audited.
     */
    return (params: AuditParams): RequestHandler => {
        return (request, response, next) => {
            // const session = getSession(request);

            response.on("finish", () => {
                AuditLog.write(log, {
                    action: params.action,
                    outcome: response.statusCode >= 400 ? "failure" : "success",
                    privileged: params.privileged,
                    principal: "N/A", // session?.soldierId,
                    sessionId: "N/A", // session?.sessionId,
                    requestUrl: request.originalUrl,
                    requestMethod: request.method,
                    requestReferrer: request.get("Referrer") ?? "N/A",
                    requestUserAgent: request.get("User-Agent") ?? "N/A",
                });
            });

            next();
        };
    };
}
