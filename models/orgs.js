const mongoose = require('mongoose');

/**
 * Model for an organisation. Contains an array of sub-documents for the departments and within that is
 * The repo for that department in the form of a list of credentials as documents.
 */
const orgModel = mongoose.Schema(
    {
        name : {
            type : String,
            trim : true,
            required : true,
            unique : true
        },
        departments : [
            {
                name : {
                    type : String,
                    trim: true,
                    required : true
                },

                repo : [
                    {
                        resource_name : {
                            type : String,
                            required : true,
                            trim : true,
                            unique : true
                        },
                        URL : String,
                        username : String,
                        password : String,
                    }
                ]

            }
        ]
    }
);

module.exports.orgModel = orgModel;
