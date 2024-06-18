const jwt = require('jsonwebtoken');
const { userModel } = require('../models/users');
const createStatsCollector = require('mocha/lib/stats-collector');

//JWT Secret:
//It's ok to just use a default here because we've already checked that the variables have been setup properly in
//index.js and would have ended the process we were trying to run in production without a proper secret. This 
//allows us to use a proper secret for testing if we have one and continue testing with a default if not.
let jwtSecret = process.env.TOKEN_SECRET || "Testing_Secret";


//Status Codes
const SUCCESS       = 200;
const CREATED       = 201;
const BAD_REQUEST   = 400;
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

function createTokenFromUser(userDoc) {
    const authorisedEntities = userDoc.authorised_repos;
    authorisedEntities.push(userDoc._id);
    const payload = { keychain : authorisedEntities, role : userDoc.role };
    return getToken(payload);
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
    
    const generatedToken = createTokenFromUser(userDoc);
    response.status(SUCCESS)
            .send({ "token" : generatedToken})
            .end();
}

async function registerNewUser( request, response ) {
    const haveRequiredFields = request.body.hasOwnProperty('firstname') &&   
        request.body.hasOwnProperty('lastname') && 
        request.body.hasOwnProperty('email') && 
        request.body.hasOwnProperty('password');

    if (!haveRequiredFields) {
        response.status(BAD_REQUEST)
        .end();
        return;
    }

    const newUser = new userModel({
        firstName:request.body.firstname,
        lastName:request.body.lastname,
        email:request.body.email,
        password:request.body.password,
        authorised_repos: []
    });

    if (request.body.hasOwnProperty('position')) {
        newUser.position = request.body.position;
    }
    
    const savedUser = await newUser.save();

    const token = createTokenFromUser(savedUser);

    response.status(CREATED)
        .send({"token" : token })
        .end();
}

module.exports = {
    authenticateUser,
    registerNewUser
}
