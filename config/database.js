const mongoose = require('mongoose');
//This name is only used when using the localhost
const databaseName = "CredRepo";
const testingSuffix = "-TEST";
var localConnectionString = `mongodb://127.0.0.1:27017/${databaseName}`;

if (process.env.TESTING) {
    localConnectionString = localConnectionString + testingSuffix;
}

var connectionString = process.env.DB_CONNECTION_STRING;
if (!connectionString) {
    connectionString = localConnectionString;
}


async function connectToDatabase() {
    console.log(`[INFO] Connectiong to MongoDB: ${connectionString}`);
    await mongoose.connect(connectionString)
        .catch( error => {
            console.log(`[FATAL ERROR] Could not connect to database: ${error.message}`);
            process.exit(1);
        });

    mongoose.connection.on("error", error => {
        console.log(`[ERROR] Database connection error: ${error.message}`);
        console.log("May attempt to reconnect...");
    });
}

module.exports.connectToDatabase = connectToDatabase;
