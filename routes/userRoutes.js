/*
 * Defines routes related retrieving or maintaining users 
 */
const express = require('express');
const userRouter = express.Router();
const UserController = require('../controllers/UserController');
const AuthController = require('../controllers/AuthController');
const { adminsOnly, adminsAndTheSameUserOnly, authorisedManagersOnly, authorisedUsersOnly, allRegisteredUsers } = require('../middleware/authorization');

//List and manipulate users
userRouter.get   ('/',                adminsOnly,               UserController.getListOfAllUsers);
userRouter.get   ('/self',            allRegisteredUsers,       UserController.getSelf);
userRouter.post  ('/',                                          AuthController.registerNewUser);
userRouter.put   ('/:userID',         adminsAndTheSameUserOnly, UserController.overwriteUserProfile);
userRouter.patch ('/password-change', allRegisteredUsers,       AuthController.changePassword);
userRouter.patch ('/:userID',         adminsOnly,               UserController.changeUserAccessLevel);
userRouter.delete('/:userID',         adminsOnly,               UserController.deleteUser);

//Access privileges
userRouter.get  ('/list-users/:orgID/:deptID', adminsOnly, UserController.getAuthorisedUsers);
userRouter.patch('/:userID/add_dept',          adminsOnly, UserController.addDepartment);
userRouter.patch('/:userID/remove_dept',       adminsOnly, UserController.removeDepartment);



//Temporary routes for testing
userRouter.get('/random', UserController.getArbitraryUser);

module.exports = userRouter;
