const mongoose = require('mongoose');
const { userModel } = require('../models/users');
const { orgModel } = require('../models/orgs');
const { connectToDatabase, disconnectFromDatabase } = require('../config/database');

/**
  * Helper function. Checks if a collection exists in the database we are currently connected to.
  * Used to make sure we don't try to delete something that's not there.
  *
  * @param collectionName The name of the collection to search for.
  * @returns {boolean} true if the collection exists.
  */
async function collectionExists(collectionName) {
    const collections = await mongoose.connection.listCollections();
    let collectionFound = false;

    for (let collection of collections) {

        if (collection.name === collectionName) {
            collectionFound = true;
        }
    }

    return collectionFound;
}

/**
  * The main function of this module. Deletes the current database and reconstructs it with dummy data.
  * 
  * @param silent If truthy the no log messages appear.
  */
async function resetDatabase(silent) {
    return new Promise( async function(resolve, reject) {
        if (!mongoose.connection) {
            connectToDatabase();
        }

        if (!silent){console.log("Resetting database");}

        const orgCollectionExists = collectionExists('orgs');
        if (orgCollectionExists) {
            if (!silent){console.log("Deleting existing org collection");}
            await mongoose.connection.dropCollection('orgs');
        }

        const userCollectionExists = collectionExists('users');
        if (userCollectionExists) {
            if (!silent){console.log("Deleting existing users collection");}
            await mongoose.connection.dropCollection('users');
        }

        const orgNames = [
            "News Management", 
            "Software Reviews",
            "Hardware Reviews",
            "Opinion Publishing",
            "Video Content"
        ];

        const depts = [
            { name: "Writing", repo:[]},
            { name: "Production", repo:[]},
            { name: "Finance", repo:[]},
            { name: "HR", repo:[]},
            { name: "IT", repo:[]}
        ];


        for (const orgName of orgNames) {
            if (!silent){console.log(`Adding org: ${orgName}`);}
            const orgFirstWord = orgName.split(' ')[0];
            let org = new orgModel(
                {
                    name: orgName,
                    departments : depts
                }
            );

            org = await org.save();

            for (let i=0; i < 10; i++){
                let newUser = new userModel({
                    firstName: "John",
                    lastName: "Doe",
                    email : `${orgFirstWord}-user${i+1}@example.com`,
                    password : 'password',
                    role : "user",
                    authorised_repos : [
                        {
                            orgID: org._id,
                            deptID : org.departments[i % org.departments.length]._id
                        }
                    ] 
                });

                await newUser.save();
            }
        }

        resolve();
    });
}

//resetDatabase();
//disconnectFromDatabase();

module.exports.resetDatabase = resetDatabase;
