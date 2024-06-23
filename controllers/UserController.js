const { userModel } = require("../models/users");
const StatusCodes = require('../utils/http-codes');

function santizeUser(user) {
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
        return santizeUser(user);
    });

    response.status(StatusCodes.SUCCESS)
            .send(usersWithoutPassword);
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

    response.status(StatusCodes.SUCCESS).send(santizeUser(savedUser));
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
        response.status(StatusCodes.SUCCESS).send(savedUser);
    } else  {
        response.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
}

async function deleteUser ( request, response ) {
    const deletedDocument = await userModel.findByIdAndDelete(request.params.userID);

    if ( deletedDocument ) {
        response.status(StatusCodes.SUCCESS).send(santizeUser(deletedDocument));
    } else {
        response.status(StatusCodes.NOT_FOUND).end();
    }
}

module.exports = {
    getListOfAllUsers,
    overwriteUserProfile,
    changeUserAccessLevel,
    deleteUser
}