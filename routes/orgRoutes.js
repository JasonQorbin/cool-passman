/*
 * Defines routes related retrieving or manipulating organisational units 
 */
const express = require('express');
const orgRouter = express.Router();
const OrgController = require('../controllers/OrgController');

orgRouter.get('/', OrgController.getListOfAllOrgs);
orgRouter.get('/:orgID', OrgController.getListOfDepts);

module.exports = orgRouter;
