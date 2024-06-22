/*
 * Defines routes related retrieving or manipulating organisational units 
 */
const express = require('express');
const orgRouter = express.Router();
const OrgController = require('../controllers/OrgController');

//Org Units
orgRouter.get('/', OrgController.getListOfAllOrgs);
orgRouter.post('/', OrgController.addNewOrg);
orgRouter.patch('/:orgID', OrgController.renameOrg);
orgRouter.delete('/:orgID', OrgController.deleteOrg);

//Departments
orgRouter.get('/:orgID', OrgController.getListOfDepts);
orgRouter.post('/:orgID', OrgController.addNewDept); 
orgRouter.patch('/:orgID/:deptID', OrgController.renameDept);
orgRouter.delete('/:orgID/:deptID', OrgController.deleteDept);

module.exports = orgRouter;
