/*
 * Defines routes related retrieving or manipulating organisational repos 
 */
const express = require('express');
const repoRouter = express.Router();
const OrgController = require('../controllers/OrgController');

repoRouter.get('/', OrgController.getRepos);
repoRouter.post('/:orgID/:deptID', OrgController.addCredential);
repoRouter.put('/:orgID/:deptID/:credID', OrgController.replaceCredential);
repoRouter.delete('/:orgID/:deptID/:credID', OrgController.deleteCredential);


module.exports = repoRouter;
