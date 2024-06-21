//Status codes

const SUCCESS                = 200;
const CREATED                = 201; //A new resource was created.
const BAD_REQUEST            = 400; //Something is wrong with the request (missing or incorrect fields). Fix and try again.
const UNAUTHORISED           = 401; //The requestor could not be authenticated. Auth header may be wrong or token may be expired. Fix and try again.

const FORBIDDEN              = 403; //The requester was positively authenticated but is not authorized to access the resource.
                                    //A retry will not change the outcome.
/** The requested resource could not be found. */
const NOT_FOUND              = 404;
const CONFLICT               = 409; //The requested change conflicts with the current state of the server.
const GONE                   = 410; //The requested resource has been pernamently deleted.
const UNSUPPORTED_MEDIA_TYPE = 415; //The request's Content-Type is wrong
const TOO_MANY_REQUESTS      = 429; //Rate limit exceeded
const INTERNAL_SERVER_ERROR  = 500;
const NOT_IMPLEMENTED        = 501;
const SERVICE_UNAVAILABLE    = 503;


module.exports = {
    SUCCESS,
    CREATED,
    BAD_REQUEST,
    UNAUTHORISED,
    FORBIDDEN,
    NOT_FOUND,
    CONFLICT,
    GONE,
    UNSUPPORTED_MEDIA_TYPE,
    TOO_MANY_REQUESTS,
    INTERNAL_SERVER_ERROR,
    NOT_IMPLEMENTED,
    SERVICE_UNAVAILABLE
};
