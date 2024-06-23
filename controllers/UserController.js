const { userModel } = require("../models/users");

async function getListOfAllUsers( request, response ) {
    allUsers = await userModel.find({});

    response.status(200)
            .send(allUsers);
}

async function registerNewUser ( request, response ) {
    
}

async function overwriteUserProfile ( request, response ) {
    
}

async function changeUserAccessLevel ( request, response ) {

}

async function deleteUser ( request, response ) {
    
}

module.exports = {
    getListOfAllUsers,
    registerNewUser,
    overwriteUserProfile,
    changeUserAccessLevel,
    deleteUser
}
