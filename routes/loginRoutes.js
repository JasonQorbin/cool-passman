/*
 * Defines routes related to authentication. 
 *
 * These routes are accessible by anyone with access to the site (i.e. no authorization checks).
 * These will also be the only routes that return an authentication token to the client.
 */
const express = require('express');
const authRouter = express.Router();
const AuthController = require('../controllers/AuthController');

authRouter.post('/login', AuthController.authenticateUser);
authRouter.post('/register', AuthController.registerNewUser);

module.exports = authRouter;
