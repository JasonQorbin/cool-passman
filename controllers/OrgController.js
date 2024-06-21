/*
 * All functions dealing with database interactions involving organisation units.
 *
 * All these functions will assume that by the time you call them you have already made sure that the user requesting the
 * resource is authorized to do so using the appropriate middleware.
 */

const { orgModel } = require('../models/orgs');
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
        console.log(savedOrg);
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

module.exports = {
    getListOfAllOrgs,
    getListOfDepts,
    addNewOrg,
    deleteOrg,
    renameOrg
}
