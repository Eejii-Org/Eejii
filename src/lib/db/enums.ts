export const Role = {
    ROLE_USER: "ROLE_USER",
    ROLE_ADMIN: "ROLE_ADMIN",
    ROLE_SUPER_ADMIN: "ROLE_SUPER_ADMIN"
} as const;
export type Role = (typeof Role)[keyof typeof Role];
export const UserType = {
    USER_VOLUNTEER: "USER_VOLUNTEER",
    USER_PARTNER: "USER_PARTNER",
    USER_SUPPORTER: "USER_SUPPORTER",
    ADMIN: "ADMIN"
} as const;
export type UserType = (typeof UserType)[keyof typeof UserType];
export const ProjectType = {
    FUNDRAISING: "FUNDRAISING",
    GRANT_FUNDRAISING: "GRANT_FUNDRAISING"
} as const;
export type ProjectType = (typeof ProjectType)[keyof typeof ProjectType];
export const EventType = {
    EVENT: "EVENT",
    VOLUNTEERING: "VOLUNTEERING"
} as const;
export type EventType = (typeof EventType)[keyof typeof EventType];
export const RequestStatus = {
    REQUEST_PENDING: "REQUEST_PENDING",
    REQUEST_DENIED: "REQUEST_DENIED",
    REQUEST_APPROVED: "REQUEST_APPROVED"
} as const;
export type RequestStatus = (typeof RequestStatus)[keyof typeof RequestStatus];
export const ProjectStatus = {
    PENDING: "PENDING",
    APPROVED: "APPROVED",
    DENIED: "DENIED",
    DONE: "DONE"
} as const;
export type ProjectStatus = (typeof ProjectStatus)[keyof typeof ProjectStatus];
export const PermitType = {
    EVENT: "EVENT",
    PROJECT: "PROJECT",
    BANNER: "BANNER"
} as const;
export type PermitType = (typeof PermitType)[keyof typeof PermitType];
