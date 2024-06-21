//Status codes

const SUCCESS                = 200;
/** A new resource was created. */
const CREATED                = 201;
/** Something is wrong with the request (missing or incorrect fields). Fix and try again. */
const BAD_REQUEST            = 400;
/** 
 * The requestor could not be authenticated. 
 * The auth header may be wrong or token may be expired. The client is expected to fix the problem and retry. 
 */
const UNAUTHORISED           = 401;
/** 
 * The requester was positively authenticated but is not authorized to access the resource.
 * The client should bother retrying because the outcome should be the same.
 */
const FORBIDDEN              = 403;                                   //A retry will not change the outcome.
/** The requested resource could not be found. */
const NOT_FOUND              = 404;
/** The requested change conflicts with the current state of the server. */
const CONFLICT               = 409;
//The requested resource has been pernamently deleted. Retrying will not change the outcome */
const GONE                   = 410; 
/** The request's Content-Type is wrong */
const UNSUPPORTED_MEDIA_TYPE = 415;
/** //Rate limit exceeded. */
const TOO_MANY_REQUESTS      = 429; 
const INTERNAL_SERVER_ERROR  = 500;
const NOT_IMPLEMENTED        = 501;
/** The requested end-point/service is not available. This state is expected to be temporary */
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
