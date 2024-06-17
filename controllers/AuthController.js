const jwt = require('jsonwebtoken');
const { userModel } = require('../models/users');

//JWT Secret:
//It's ok to just use a default here because we've already checked that the variables have been setup properly in
//index.js and would have ended the process we were trying to run in production without a proper secret. This 
//allows us to use a proper secret for testing if we have one and continue testing with a default if not.
let jwtSecret = process.env.TOKEN_SECRET || "Testing_Secret";


//Status Codes
const SUCCESS       = 200;
const UNAUTHORISED  = 401;
const FORBIDDEN     = 403;

/**
 * Signs the given payload with the secret using HMAC + SHA256 and returns the token.
 *
 * @param The payload to put in the token.
 * @returns the token generated.
 */
function getToken(payload) {
    if (typeof(payload) !== 'object') {
        throw new Error("JWT payload must be a JSON object");
    }

    return jwt.sign(JSON.stringify(payload), jwtSecret, {algorithm: 'HS256'} );
}


/**
 * Helper function to handle all cases where authentication fails.
 *
 * @param response The response object to send back.
 */
function authenticationFailed(response) {
    response.status(FORBIDDEN)
            .send({error : "Authentication failed"})
            .end();
}


/**
 * Helper function to handle all cases where authentication information provided was invalid.
 *
 * @param response The response object to send back.
 */
function authenticationInvalid(response) {
    response.status(UNAUTHORISED)
            .send({error : "Authentication failed"})
            .end();
}


async function authenticateUser( request, response ) {
    if (!request.body.hasOwnProperty('email') || !request.body.hasOwnProperty('password')) {
        console.log("Login failed. Either email or password field was missing");
        authenticationInvalid(response);
    }

    const emailReceived = request.body.email;
    const passwordReceived = request.body.password;
    
    const hashedPassword = passwordReceived //Todo: Hash the password to match the database.

    const userDoc = await userModel.findOne({email : emailReceived});

    if (userDoc === null) {
        console.log(`Login failed due to user not found : ${request.body.email}`);
        authenticationFailed(response);
        return;
    }

    if (userDoc.password !== hashedPassword) {
        console.log(`Login failed due to incorrect password ${request.body.email} : ${request.body.password}`);
        authenticationFailed(response);
        return;
    }
    
    const authorisedEntities = userDoc.authorised_repos;
    authorisedEntities.push(userDoc._id);
    
    const token = getToken({ keychain : authorisedEntities });
    response.status(SUCCESS)
            .send({ "token" : token})
            .end();
}

function registerNewUser( request, response ) {
    
}

module.exports = {
    authenticateUser,
    registerNewUser
}
