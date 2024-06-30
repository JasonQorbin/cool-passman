const { userModel } = require("../models/users");
const StatusCodes = require('../utils/http-codes');
const { verifyAndDecodeToken } = require("./AuthController");

function sanitizeUser(user) {
    if (user.hasOwnProperty('password')) {
        delete user.password;
    }
    return user;
}

function requestHasRequiredUserFields(request) {
    return  request.body.hasOwnProperty('firstName') &&
            request.body.hasOwnProperty('lastName') &&
            request.body.hasOwnProperty('email') &&
            request.body.hasOwnProperty('password');
}

async function getListOfAllUsers( request, response ) {
    allUsers = await userModel.find({});
    usersWithoutPassword = allUsers.map((user) => {
        return sanitizeUser(user);
    });

    response.status(StatusCodes.SUCCESS)
            .send(usersWithoutPassword);
}

async function getSelf( request, response ) {
    const authHeader = request.headers.authorisation.split(' ');
    if (authHeader.length != 2 || authHeader[0] !== "Bearer") {
        response.status(StatusCodes.UNAUTHORISED).send({error: "Expected Authorisation header with 'Bearer <Token>'"});
        return;
    }
    
    let payload;

    try {
        payload = verifyAndDecodeToken(authHeader[1]);
    } catch (error) {
        console.log(`[BAD TOKEN] Received ${authHeader[1]}`);
        response.status(StatusCodes.UNAUTHORISED).send({error: "Token not verified"});
        return;
    }
    
    const user = await userModel.findById(payload._id);
    if (!user) {
        response.status(StatusCodes.NOT_FOUND).end();
    } else {
        response.status(StatusCodes.SUCCESS).send(user);
    }
}

async function overwriteUserProfile ( request, response ) {
    if (!requestHasRequiredUserFields(request)) {
        response.status(StatusCodes.BAD_REQUEST).end();
        return;
    }
    
    const oldProfile = await userModel.findById(request.params.userID);
    if (!oldProfile) {
        response.status(StatusCodes.NOT_FOUND).end();
        return;
    }

    //Create a proxy object to apply in case there are extra fileds in the request body that don't belong in the database.
    const objectToApply = {
        firstName : request.body.firstName,
        lastName : request.body.lastName,
        email : request.body.email,
        role : request.body.role
    };

    if (request.body.hasOwnProperty('position')) {
        objectToApply.position = request.body.position
    }

    //Get the old password hash
    objectToApply.password = oldProfile.password;
    
    oldProfile.replace(objectToApply);
    const savedUser = await oldProfile.save();

    response.status(StatusCodes.SUCCESS).send(sanitizeUser(savedUser));
}

async function changeUserAccessLevel ( request, response ) {
    if (!request.body.hasOwnProperty('role')) {
        response.status(StatusCodes.BAD_REQUEST).end();
        return;
    }

    userToChange = await userModel.findById(request.params.userID);
    userToChange.role = request.body.role;
    const savedUser = await userToChange.save();
    
    if (savedUser === userToChange) {
        response.status(StatusCodes.SUCCESS).send(sanitizeUser(savedUser));
    } else  {
        response.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
}

async function deleteUser ( request, response ) {
    const deletedDocument = await userModel.findByIdAndDelete(request.params.userID);

    if ( deletedDocument ) {
        response.status(StatusCodes.SUCCESS).send(sanitizeUser(deletedDocument));
    } else {
        response.status(StatusCodes.NOT_FOUND).end();
    }
}

async function addDepartment( request, response ) {
    const haveRequiredFields = request.body.hasOwnProperty('orgID') && request.body.hasOwnProperty('deptID');

    if (!haveRequiredFields) {
        console.log(`[WARN] Add department: Required body fields were missing`);
        response.status(StatusCodes.BAD_REQUEST).end();
        return;
    }

    const userDoc = await userModel.findById(request.params.userID);

    if (!userDoc) {
        console.log(`[WARN] Add department: Could not find User ${request.params.userID}`);
        response.status(StatusCodes.NOT_FOUND).end();
        return;
    }

    userDoc.authorised_repos.push({orgID: request.body.orgID, deptID: request.body.deptID});

    await userDoc.save();

    response.status(StatusCodes.SUCCESS).end();

}

async function removeDepartment( request, response ) {
    const haveRequiredFields = request.body.hasOwnProperty('orgID') && request.body.hasOwnProperty('deptID');

    if (!haveRequiredFields) {
        console.log(`[WARN] Add department: Required body fields were missing`);
        response.status(StatusCodes.BAD_REQUEST).end();
        return;
    } 

    const userDoc = await userModel.findById(request.params.userID);

    if (!userDoc) {
        console.log(`[WARN] Remove department: Could not find User ${request.params.userID}`);
        response.status(StatusCodes.NOT_FOUND).end();
        return;
    }
    
    console.log(userDoc.authorised_repos);
    const authorisationToDelete = userDoc.authorised_repos.filter( (authRecord) => {
        return authRecord.orgID == request.body.orgID && authRecord.deptID == request.body.deptID;
    }).pop();
    
    if (!authorisationToDelete) {
    console.log(`[WARN] Remove department: Could not find authorisation record to delete (Org: ${request.body.orgID} -> Dept: ${request.body.deptID}`);
    response.status(StatusCodes.NOT_FOUND).end();
    return;
    }

    authorisationToDelete.deleteOne();
    await userDoc.save();

    response.status(StatusCodes.SUCCESS).end();
}

/**
  * Temporary function for testing the user profile page.
  * 
  * Retrieves an arbitrary user record from the database and sendds it back.
  *
  */
async function getArbitraryUser( request, response ) {
    const user = await userModel.findOne({});

    if (!user) {
        response.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    } else {
        response.status(StatusCodes.SUCCESS).send(sanitizeUser(user));
    }
}

module.exports = {
    getListOfAllUsers,
    overwriteUserProfile,
    changeUserAccessLevel,
    deleteUser,
    getSelf,
    addDepartment,
    removeDepartment,
    getArbitraryUser
}
