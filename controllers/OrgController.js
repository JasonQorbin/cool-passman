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
            .send(orgs)
            .end();
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
            .send(org.departments)
            .end();
     
}

module.exports = {
    getListOfAllOrgs,
    getListOfDepts
}
