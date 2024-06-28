const mongoose = require('mongoose');

/**
 * Schema for each credential that will sit in the department repos.
 */
const credentialSchema = mongoose.Schema(
    {
        name : {
            type: String,
            trim : true,
            required: true,
        },
        url : {
            type: String,
            trim : true,
        },
        username : {
            type: String,
            trim : true,
        },
        password : String
    }
);

/**
 * Schema for the department documents that will sit inside the orgs.
 */
const deptSchema = mongoose.Schema(
    {
        name : {
            type: String,
            trim : true,
            required: true,
        },

        repo : [credentialSchema]
    }
);

/**
 * Model for an organisation. Contains an array of sub-documents for the departments and within that is
 * The repo for that department in the form of a list of credentials as documents.
 */
const orgSchema = mongoose.Schema(
    {
        name : {
            type : String,
            trim : true,
            required : true,
            unique : true
        },
        departments : [deptSchema]
    }
);

const orgModel = mongoose.model("orgs", orgSchema);

module.exports.orgModel = orgModel;
