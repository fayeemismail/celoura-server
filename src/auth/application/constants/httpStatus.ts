

export const HTTP_STATUS = {
    OK: { code: 200, message: 'OK' },
    CREATED: { code: 201, message: 'Created' },
    BAD_REQUEST: { code: 400, message: 'Bad Requested' },
    UNAUTHORIZED: { code: 402, message: 'Unauthorized' },
    FOBIDDEN: { code: 403, message: 'Forbidden' },
    NOT_FOUND: { code: 404, message: 'Not found' },
    CONFLICT: { code: 409, message: 'Conflict' },
    INTERNAL_SERVER_ERROR: { code: 500, message: 'Internal server Error' },
    SERVICE_UNAVAILABLE: { code: 503, message: 'Service Unavailable' },
}  as const;

export type HttpStatusKey = keyof typeof HTTP_STATUS;