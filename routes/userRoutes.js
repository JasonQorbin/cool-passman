/*
 * Defines routes related retrieving or maintaining users 
 */
const express = require('express');
const userRouter = express.Router();
const UserController = require('../controllers/UserController');

//Org Units
userRouter.get('/', UserController.getListOfAllUsers);
userRouter.post('/', UserController.registerNewUser);
userRouter.put('/:userID', UserController.overwriteUserProfile);
userRouter.patch('/:userID', UserController.changeUserAccessLevel);
userRouter.delete('/:userID', UserController.deleteUser);


module.exports = userRouter;
