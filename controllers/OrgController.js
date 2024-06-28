/*
 * All functions dealing with database interactions involving organisation units.
 *
 * All these functions will assume that by the time you call them you have already made sure that the user requesting the
 * resource is authorized to do so using the appropriate middleware.
 */

const { orgModel } = require('../models/orgs');
const { userModel } = require('../models/users');
const { verifyAndDecodeToken } = require('../controllers/AuthController');
const StatusCodes = require('../utils/http-codes');


async function getListOfAllOrgs(request, response) {
    const orgs = await orgModel.find({}).exec();
    response.status(StatusCodes.SUCCESS)
            .send(orgs);
}

async function getListOfDepts(request, response) {
    const org = await orgModel.findById(request.params.orgID);
    if (!org) {
        response.status(StatusCodes.NOT_FOUND)
                .end();
        return;
    }
    
    //Todo: handle a deleted OUwith a 410 code??

    response.status(StatusCodes.SUCCESS)
            .send(org.departments);
     
}

async function addNewOrg(request, response) {
    const newOrg = new orgModel( {name : request.body.name });
    const savedOrg = await newOrg.save();
    if (savedOrg === newOrg) {
        response.status(StatusCodes.CREATED)
                .send(savedOrg);
    } else {
        response.status(StatusCodes.CONFLICT)
                .send({error: "Couldn't create new OU"});
    }
}

async function deleteOrg( request, response ) {
    const result = await orgModel.deleteOne({_id : request.params.orgID});
    if (result.deletedCount == 1) {
        response.status(StatusCodes.SUCCESS).end();
    } else {
        response.status(StatusCodes.NOT_FOUND).end();
    }
}

async function renameOrg( request, response ) {
    const updateResult = await orgModel.updateOne({_id: request.params.orgID}, {name : request.body.name});
    if (!updateResult.acknowledged) {
        response.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
        return;
    }

    if (updateResult.matchedCount == 0) {
        response.status(StatusCodes.NOT_FOUND).end();
        return;
    }

    if (updateResult.updatedCount == 0) {
        response.status(StatusCodes.CONFLICT).end();
        return;
    }
    
    updatedDoc = await orgModel.findById(request.params.orgID);
    response.status(200)
            .send(updatedDoc);
}

async function addNewDept(request, response) {
    if (!request.body.hasOwnProperty('name')) {
        response.status(StatusCodes.BAD_REQUEST)
                .end();
        return;
    }

    const orgToChange = await orgModel.findById(request.params.orgID);
    if (orgToChange == null) {
        response.status(StatusCodes.NOT_FOUND)
                .end();
        return;
    }
    orgToChange.departments.push({ name : request.body.name, repo : [] });
    const savedDoc = await orgToChange.save();

    if (savedDoc === orgToChange) {
        response.status(StatusCodes.CREATED)
                .send(savedDoc);
    } else {
        response.status(StatusCodes.CONFLICT)
                .end();
    }

}

async function renameDept(request, response) {
    if (!request.body.hasOwnProperty('name')) {
        response.status(StatusCodes.BAD_REQUEST)
                .end();
        return;
    }
    
    const orgToChange = await orgModel.findById(request.params.orgID)
    if (orgToChange == null) {
        response.status(StatusCodes.NOT_FOUND)
                .end();
        return;
    }

    let foundDept = false;
    for (let i = 0; i < orgToChange.departments.length; ++i) {
        if (orgToChange.departments[i]._id.toString() === request.params.deptID) {
            orgToChange.departments[i].name = request.body.name;
            foundDept = true;
        }
    }

    if (!foundDept) {
        response.status(StatusCodes.NOT_FOUND).end();
        return;
    }

    const savedDoc = await orgToChange.save();

    if (savedDoc === orgToChange) {
        response.status(StatusCodes.SUCCESS)
                .send(savedDoc);
    } else {
        response.status(StatusCodes.CONFLICT)
                .end();
    }
}


async function deleteDept(request, response) {
    const orgToChange = await orgModel.findById(request.params.orgID)
    if (orgToChange == null) {
        response.status(StatusCodes.NOT_FOUND)
                .end();
        return;
    }
    
    removeDepartmentFromAllUsers(request.params.orgID, request.params.deptID);

    let positionToDelete = -1;
    
    for (let i = 0; i < orgToChange.departments.length; ++i) {
        if (orgToChange.departments[i]._id.toString() == request.params.deptID) {
            positionToDelete = i;
        }
    }
    
    if ( positionToDelete == -1 ) {
        response.status(StatusCodes.NOT_FOUND).end();
        return;
    }

    orgToChange.departments.splice(positionToDelete,1);
    await orgToChange.save();
    
    response.status(StatusCodes.SUCCESS).end();
    

}

async function removeDepartmentFromAllUsers(orgID, deptID) {
    usersToChange = await userModel.find({'authorised_repos.orgID': orgID, 'authorised_repos.deptID': deptID });
    console.log(`Found ${usersToChange.length} users to revoke`);

    for (let i = 0; i < usersToChange.length; ++i) {
        for (let j = 0; j < usersToChange[i].authorised_repos.length; j++) {
            if( usersToChange[i].authorised_repos[j].orgID == orgID &&
                usersToChange[i].authorised_repos[j].deptID == deptID) {
                usersToChange[i].authorised_repos.splice(j,1);
                await usersToChange[i].save();
                break;
            }
        }
    }
}

//==================================
// Repo related funcntions
//==================================

/**
  * Returns all the repositories that the current user is authorised to see/change.
  *
  * Expects a valid token in the request body with a list of the authorised repos to fetch in the payload..
  */
async function getRepos( request, response ) {
    //No need to check that the header is well formed because this was already checked in middleware before this.
    const token = request.headers.authorisation.split(' ')[1];

    
    let tokenPayload;

    try {
        tokenPayload = verifyAndDecodeToken(token);
    } catch (error) {
            console.log(`Token ${token} not verified`);
            response.status(StatusCodes.UNAUTHORISED).end();
            return;
    }

    
    const repos = [];

    for (const key of tokenPayload.keychain) {
        
        const org = await orgModel.findById(key.orgID);
        if (!org) {
            console.log(`Unable to find org unit ${key.orgID}`);
            response.status(StatusCodes.NOT_FOUND).end();
            return;
        } else {
            const department = org.departments.id(key.deptID);

            if (!department) {
                console.log(`Unable to find department ${key.deptID}`);
                response.status(StatusCodes.NOT_FOUND).end();
                return;
            } else {
                repos.push({
                    orgID : key.orgID,
                    deptID : key.deptID,
                    orgName : org.name,
                    deptName : department.name,
                    repo : department.repo
                });
            }
        }
        
    }

    response.status(StatusCodes.SUCCESS).send(repos);
}

async function addCredential ( request, response ) {
    console.log("In the adding function...");
    //A credential should have a name and at least one other field to save.
    const requestHasEnoughFields = 
        request.body.hasOwnProperty('name') &&
        (request.body.hasOwnProperty('url') ||
        request.body.hasOwnProperty('username') ||
        request.body.hasOwnProperty('password'));

    if (!requestHasEnoughFields) {
        console.log("[WARN] Add credential: Bad request. Not enough fields");
        response.status(StatusCodes.BAD_REQUEST).send({error: "Require a name and one other field"});
    }

    const org = await orgModel.findById(request.params.orgID);

    if (!org) {
        console.log(`[WARN] Add credential: OrgID ${request.params.orgID} not found`);
        response.status(StatusCodes.NOT_FOUND).end();
        return;
    }

    const department = org.departments.id(request.params.deptID);

    if (!department) {
        console.log(`[WARN] Add credential: department ID ${request.params.deptID} not found in org ${request.params.orgID}`);
        response.status(StatusCodes.NOT_FOUND).end();
        return;
    }

    console.log("checks done");

    const newCredential = {name : request.body.name};
    if (request.body.hasOwnProperty('url')) { newCredential.url = request.body.url };
    if (request.body.hasOwnProperty('username')) { newCredential.username = request.body.username };
    if (request.body.hasOwnProperty('password')) { newCredential.password = request.body.password };

    department.repo.push(newCredential);
    const docToSave = department.repo[department.repo.length-1];
    const savedDoc = await org.save();
    console.log(savedDoc);
    
    response.status(StatusCodes.SUCCESS).send(newCredential);
}

async function replaceCredential ( request, response ) {
    //A credential should have a name and at least one other field to save.
    const requestHasEnoughFields = 
        request.body.hasOwnProperty('name') &&
        (request.body.hasOwnProperty('url') ||
        request.body.hasOwnProperty('username') ||
        request.body.hasOwnProperty('password'));

    if (!requestHasEnoughFields) {
        response.status(StatusCodes.BAD_REQUEST).send({error: "Require a name and one other field"});
    }

    const org = await orgModel.findById(request.params.orgID);

    if (!org) {
        repsonse.status(StatusCodes.NOT_FOUND).end();
        return;
    }

    const department = org.departments.id(request.params.deptID);

    if (!department) {
        repsonse.status(StatusCodes.NOT_FOUND).end();
        return;
    }

    const credential = department.repos.id(request.params.credID);

    if (!credential) {
        repsonse.status(StatusCodes.NOT_FOUND).end();
        return;
    }

    const newCredential = {name : request.body.name};
    if (request.body.hasOwnProperty('url')) { newCredential.url = request.body.url };
    if (request.body.hasOwnProperty('username')) { newCredential.username = request.body.username };
    if (request.body.hasOwnProperty('password')) { newCredential.password = request.body.password };
    
    credential.overwrite(newCredential);

    const savedDoc = await org.save();
    
    response.status(StatusCodes.SUCCESS).send(savedDoc);
}

async function deleteCredential ( request, response ) {
    const org = await orgModel.findById(request.params.orgID);

    if (!org) {
        repsonse.status(StatusCodes.NOT_FOUND).end();
        return;
    }

    const department = org.departments.id(request.params.deptID);

    if (!department) {
        repsonse.status(StatusCodes.NOT_FOUND).end();
        return;
    }

    const credential = department.repos.id(request.params.credID);

    if (!credential) {
        repsonse.status(StatusCodes.NOT_FOUND).end();
        return;
    }

    credential.deleteOne();
    await org.save();

    response.status(StatusCodes.SUCCESS).end();
    
}


module.exports = {
    getListOfAllOrgs,
    getListOfDepts,
    addNewOrg,
    deleteOrg,
    renameOrg,
    addNewDept,
    renameDept,
    deleteDept,
    getRepos,
    addCredential,
    replaceCredential,
    deleteCredential,
}
