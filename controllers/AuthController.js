const jwt = require('jsonwebtoken');
const { userModel } = require('../models/users');
const StatusCodes = require('../utils/http-codes');
const bcrypt = require('bcrypt');

//JWT Secret:
//It's ok to just use a default here because we've already checked that the variables have been setup properly in
//index.js and would have ended the process we were trying to run in production without a proper secret. This 
//allows us to use a proper secret for testing if we have one and continue testing with a default if not.
let jwtSecret = process.env.TOKEN_SECRET || "Testing_Secret";

/** Number of salting rounds for the bcrypt hash. 14rounds -> ~1.5sec/hash on a 2Ghz processor */
const numberOfSaltRounds = 14;

function generatePasswordHash(password) {
    bcrypt.hash(password, numberOfSaltRounds);
}

function verifyPasswordHash(password, hash) {
    return bcrypt.compare(password, hash);
}

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
    const payload = { _id:userDoc._id, keychain : authorisedEntities, role : userDoc.role };
    return getToken(payload);
}

/**
 * Helper function to handle all cases where authentication fails.
 *
 * @param response The response object to send back.
 */
function authenticationFailed(response) {
    response.status(StatusCodes.FORBIDDEN)
            .send({error : "Authentication failed"})
            .end();
}


/**
 * Helper function to handle all cases where authentication information provided was invalid.
 *
 * @param response The response object to send back.
 */
function authenticationInvalid(response) {
    response.status(StatusCodes.UNAUTHORISED)
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
    
    const userDoc = await userModel.findOne({email : emailReceived});

    if (userDoc === null) {
        console.log(`Login failed due to user not found : ${request.body.email}`);
        authenticationFailed(response);
        return;
    }
   
    verifyPasswordHash(passwordReceived, userDoc.password).then( matchResult => {
        if (!matchResult) {
            console.log(`Login failed due to incorrect password ${request.body.email} : ${request.body.password}`);
            authenticationFailed(response);
            return;
        } else {

            const generatedToken = createTokenFromUser(userDoc);
            response.status(StatusCodes.SUCCESS)
                .send({ "token" : generatedToken})
                .end();
        }
    });
}

async function registerNewUser( request, response ) {
    const haveRequiredFields = request.body.hasOwnProperty('firstName') &&   
        request.body.hasOwnProperty('lastName') && 
        request.body.hasOwnProperty('email') && 
        request.body.hasOwnProperty('password');

    if (!haveRequiredFields) {
        response.status(StatusCodes.BAD_REQUEST).end();
        return;
    }
    generatePasswordHash(request.body.password).then( hashedPassword => {
        const newUser = new userModel({
            firstName : request.body.firstName,
            lastName : request.body.lastName,
            email : request.body.email,
            password : hashedPassword,
            authorised_repos: []
        });

        if (request.body.hasOwnProperty('position')) {
            newUser.position = request.body.position;
        }

        try {
            newUser.save().then(savedUser=> {
            const token = createTokenFromUser(savedUser);

            response.status(StatusCodes.CREATED)
                .send({"token" : token });
            });
        } catch (error) {
            if (error.code == 11000) {
                console.error("Duplicate key error:", error);
                response.status(StatusCodes.CONFLICT).end();
            } else {
                console.error("Database error:", error);
                response.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
            }
        }
    });
}

async function changePassword( request, response ) {
    const authHeader = request.headers.authorisation.split(' ');
    if (authHeader.length != 2 || authHeader[0] !== "Bearer") {
        console.log(`[WARN] Change Password: Could not read auth header ${request.headers.authorisation}`);
        response.status(StatusCodes.UNAUTHORISED).send({error: "Expected Authorisation header in the form 'Bearer <token>'"});
    } else {
        const payload = verifyAndDecodeToken(authHeader[1]);
        const userDoc = await userModel.findById(payload._id);
        if (userDoc.password !== request.body.oldPassword) {
            console.log(`[WARN] Change Password: Could not verify old password`);
            request.status(StatusCodes.BAD_REQUEST).send({error: "Old password incorrect"});
        } else {
            userDoc.password = generatePasswordHash(request.body.newPassword);
            await userDoc.save();
            response.status(StatusCodes.SUCCESS).end();
        }
    }
}


function verifyAndDecodeToken(token) {
    try {
        return jwt.verify(token, jwtSecret);
    } catch (error) {
        throw new Error("Not verified");
    }
}

module.exports = {
    authenticateUser,
    registerNewUser,
    verifyAndDecodeToken,
    changePassword,
    generatePasswordHash,
    verifyPasswordHash
}
