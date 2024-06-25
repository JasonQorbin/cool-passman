/*
 * Defines routes related retrieving or maintaining users 
 */
const express = require('express');
const userRouter = express.Router();
const UserController = require('../controllers/UserController');
const AuthController = require('../controllers/AuthController');

//Org Units
userRouter.get('/', UserController.getListOfAllUsers);
userRouter.get('/self', UserController.getSelf);
userRouter.post('/', AuthController.registerNewUser);
userRouter.put('/:userID', UserController.overwriteUserProfile);
userRouter.patch('/:userID', UserController.changeUserAccessLevel);
userRouter.delete('/:userID', UserController.deleteUser);

//Temporary routes for testing
userRouter.get('/random', UserController.getArbitraryUser);

module.exports = userRouter;
