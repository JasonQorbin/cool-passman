const { userModel } = require('../models/users');
const { verifyAndDecodeToken } = require('../controllers/AuthController');
const StatusCodes = require('../utils/http-codes');

function getTokenOrRejectRequest(request, response) {
    const authHeader = request.headers.authorisation.split(' ');
    if (authHeader.length != 2 || authHeader[0] != "Bearer") {
        response.status(StatusCodes.UNAUTHORISED).send({error:"Expected an Authorisation header in the form 'Bearer <token>'"});
    } else {
        try {
            return verifyAndDecodeToken(authHeader[1]);
        } catch (error) {
            response.status(StatusCodes.UNAUTHORISED).send({error:"Token not valid"});
        }
    }
}

function isAuthorised( payload, request ) {
    let isAuthorised = false;
    for (const payloadItem of payload.keychain) {
        if (payloadItem.orgID == request.params.orgID) { 
            if ( request.params.deptID ) {
                if (payloadItem.deptID == request.params.deptID) {
                    isAuthorised = true;
                    break;
                }
            } else {
                isAuthorised = true;
                break;
            }
        }
    }
    return isAuthorised;
}

function adminsOnly ( request, response, next ) {
    const payload = getTokenOrRejectRequest(request, response);
    if (payload.role != 'admin') {
        response.status(StatusCodes.FORBIDDEN).send({error:"You do not have the required privileges to perform this action."});
    } else {
        next();
    }
}

function adminsAndTheSameUserOnly ( request, response, next ) {
    const payload = getTokenOrRejectRequest(request, response);
    if (payload.role != 'admin' && payload._id != request.params.userID) {
        response.status(StatusCodes.FORBIDDEN).send({error:"You do not have the required privileges to perform this action."});
    } else {
        next();
    }
}

function authorisedManagersOnly ( request, response, next ) {
    const payload = getTokenOrRejectRequest(request, response);

    if (payload.role == 'manager' && isAuthorised(payload, request) || payload.role == 'admin') {
        next();
    } else {
        response.status(StatusCodes.FORBIDDEN).send({error:"You do not have the required privileges to perform this action."});
    }
}

function authorisedUsersOnly ( request, response, next ) {
    const payload = getTokenOrRejectRequest(request, response);

    if (isAuthorised(payload, request) || payload.role == 'admin') {
        next();
    } else {
        response.status(StatusCodes.FORBIDDEN).send({error:"You do not have the required privileges to perform this action."});
    }

}

function allRegisteredUsers ( request, response, next ) {
    getTokenOrRejectRequest(request, response);
    //If the previous function call didn't reject the request then the user must be registered.
    next();
    
}


module.exports = {
    adminsOnly,
    adminsAndTheSameUserOnly,
    authorisedManagersOnly,
    authorisedUsersOnly,
    allRegisteredUsers
}
