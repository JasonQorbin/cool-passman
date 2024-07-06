# Cooltech Password Manager

Cool-pass is a full-stack web-app that creates a online store for log-in credentials
for a fictious company called Cool-Tech.

The app uses the MERN stack, meaning that it expects you to provide access to a MongoDB
database and needs to run in an environment with a NodeJS runtime for the express server.

## Features

- User roles: Each user is given privilege-levels which determines what they are allow to see or do.
- API-endpoints all require an authenticated user with the correct permissions also.

## Installation and usage

1. Clone down the repo and run the `npm run build` command to install all the required dependencies and
build the frontend artifacts.
2. Create a `.env` file (sample provided in `sample.env`) and provide the connection string from your MongoDB instance.
You can also assign a custom port number.
3. Seed the database by running `npm run seed`.
4. start the server by running `npm start`.
5. When seeding the database, 5 Organisational units were create with 5 departments each. The first user in each Org unit
is created as an admin-level user that has the privileges to change the company structure and define user roles. e.g.
logging in with the sername `New-user1@example.com` will allow you to configure the server. (The default password for 
all users is `password`.

