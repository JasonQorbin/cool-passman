/*
 * Defines routes related retrieving or manipulating organisational units 
 */
const express = require('express');
const orgRouter = express.Router();
const OrgController = require('../controllers/OrgController');
const { adminsOnly, adminsAndTheSameUserOnly, authorisedManagersOnly, authorisedUsersOnly } = require('../middleware/authorization');

//Org Units
orgRouter.get   ('/',                    OrgController.getListOfAllOrgs);
orgRouter.post  ('/',       adminsOnly,  OrgController.addNewOrg);
orgRouter.patch ('/:orgID', adminsOnly,  OrgController.renameOrg);
orgRouter.delete('/:orgID', adminsOnly,  OrgController.deleteOrg);

//Departments
orgRouter.get   ('/:orgID',         authorisedUsersOnly, OrgController.getListOfDepts);
orgRouter.post  ('/:orgID',         adminsOnly,          OrgController.addNewDept); 
orgRouter.patch ('/:orgID/:deptID', adminsOnly,          OrgController.renameDept);
orgRouter.delete('/:orgID/:deptID', adminsOnly,          OrgController.deleteDept);

module.exports = orgRouter;
