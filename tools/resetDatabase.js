const mongoose = require('mongoose');
const { userModel } = require('../models/users');
const { orgModel } = require('../models/orgs');
const { generatePasswordHash } = require('../controllers/AuthController');
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

function addUser(savedOrg, userIndex) {
    return new Promise ( (resolve) => {
        const orgFirstWord = savedOrg.name.split(' ')[0];
        generatePasswordHash('password').then( hashedPassword => {
            let newUser = new userModel({
                firstName: "John",
                lastName: "Doe",
                email : `${orgFirstWord}-user${userIndex+1}@example.com`,
                password : hashedPassword,
                role : "user",
                authorised_repos : [
                    {
                        orgID: savedOrg._id,
                        deptID : savedOrg.departments[userIndex % savedOrg.departments.length]._id
                    }
                ] 
            });

            if (userIndex == 0) {
                newUser.role = 'admin';
            }

            if (userIndex == 9) {
                newUser.role = 'manager';
            }

            newUser.save().then( (savedUser) => {
                console.log(`Created user ${savedUser.email}`);
                resolve();
            });
        });
    });
}

function addOrg(orgName, silent) {
    const defaultRepo = [
        {
            name: 'Credential 1',
            url: 'location.example.net',
            username: 'user',
            password: 'pass',
        },
        {
            name: 'Credential 2',
            url: 'somewhere.else.example.net',
            username: 'name',
            password: 'pass',
        },
        {
            name: 'Credential 3',
            url: 'resource.example.net',
            username: 'person',
            password: 'secret',
        },
        {
            name: 'Credential 4',
            url: 'database.example.net',
            username: 'avatar',
            password: 'passw',
        },
    ]

    const depts = [
        { name: "Writing", repo: defaultRepo},
        { name: "Production", repo: defaultRepo},
        { name: "Finance", repo: defaultRepo},
        { name: "HR", repo: defaultRepo},
        { name: "IT", repo: defaultRepo}
    ];
    
    return new Promise( (resolve) => {
        if (!silent){console.log(`Adding org: ${orgName}`);}
        let org = new orgModel(
            {
                name: orgName,
                departments : depts
            }
        );

        org.save().then( savedOrg => {
            const userJobs = [];
            for (let i = 0; i < 10; i++) {
                userJobs.push(addUser(savedOrg, i));
            }
            Promise.all(userJobs).then( () => { resolve();});
        });
    });
}

function dropCollection(collectionName, silent) {
    if (silent == undefined) { silent = true; }
    return new Promise( (resolve) => {
        const orgCollectionExists = collectionExists(collectionName);
        if (orgCollectionExists) {
            if (!silent){console.log(`Deleting existing ${collectionName} collection`);}
            mongoose.connection.dropCollection(collectionName).then( () => {
                resolve();
            });
        } else {
            resolve();
        }
    });
}

/**
  * The main function of this module. Deletes the current database and reconstructs it with dummy data.
  * 
  * @param silent If truthy the no log messages appear.
  */
async function resetDatabase(silent) {
    return new Promise( (resolve) => {
        connectToDatabase();

        if (!silent){console.log("Resetting database");}
        
        const dropJobs = [
            dropCollection('orgs'),
            dropCollection('users')
        ];

        Promise.all(dropJobs).then( () => {
            const orgNames = [
                "News Management", 
                "Software Reviews",
                "Hardware Reviews",
                "Opinion Publishing",
                "Video Content"
            ];

            const orgJobs = [];
            for (const orgName of orgNames) {
                orgJobs.push(addOrg(orgName, silent));
            }

            Promise.all(orgJobs).then( () => {
                resolve();
            });
        });
    });
}

resetDatabase(false).then( () => {
    disconnectFromDatabase();
});

module.exports.resetDatabase = resetDatabase;

