/*
 * Defines routes related retrieving or manipulating organisational repos 
 */
const express = require('express');
const repoRouter = express.Router();
const OrgController = require('../controllers/OrgController');
const { adminsOnly, adminsAndTheSameUserOnly, authorisedManagersOnly, authorisedUsersOnly, allRegisteredUsers } = require('../middleware/authorization');

repoRouter.get   ('/',                       allRegisteredUsers,     OrgController.getRepos);
repoRouter.post  ('/:orgID/:deptID',         authorisedUsersOnly,    OrgController.addCredential);
repoRouter.put   ('/:orgID/:deptID/:credID', authorisedManagersOnly, OrgController.replaceCredential);
repoRouter.delete('/:orgID/:deptID/:credID', authorisedManagersOnly, OrgController.deleteCredential);


module.exports = repoRouter;
