# Cooltech Password Manager

Cool-pass is a full-stack web-app that creates a online store for log-in credentials
for a fictious company called Cool-Tech.

[Github Link](https://github.com/JasonQorbin/cool-passman)

The app uses the MERN stack, meaning that it expects you to provide access to a MongoDB
database and needs to run in an environment with a NodeJS runtime for the express server.

## Features

- User roles: Each user is given privilege-levels which determines what they are allow to see or do.
- API-endpoints all require an authenticated user with the correct permissions also.

## Security note

Please note that this project was a bootcamp assignment on the premise that it would be used as an internal application
and therefore caution should be exercised if using this application in a production environment. While the passwords 
for user accounts for the application are stored securely is hashed form the application data 
(presumably also login credentials) are stored in plain text. 

The application could be extended to use symmetric encryption so that the application data (credentials being stored) 
are not stored in plain text but for now make sure that this application is only ever deployed on a secure server in
a private network environment and not exposed to the internet.

## Installation and usage

1. Clone down the repo and run the `npm run build` command to install all the required dependencies and
build the frontend artifacts.
2. Create a `.env` file (sample provided in `sample.env`) and provide the connection string from your MongoDB instance.
You can also assign a custom port number.
3. If running in a production environment, make sure to set the NODE_ENV environment variable to `production`. If you 
don't do this the app will assume it is running in a development environment and try to connect to a local MongoDB instance,
ingoring the connection string set in the .env file.
4. Seed the database by running `npm run seed`.
5. start the server by running `npm start`.
6. When seeding the database, 5 Organisational units were create with 5 departments each. The first user in each Org unit
is created as an admin-level user that has the privileges to change the company structure and define user roles. e.g.
logging in with the sername `News-user1@example.com` will allow you to configure the server. (The default password for 
all users is `password`).

## Users in the seeded database

| User emails                                                 | Organisational Unit (OU) |
|-------------------------------------------------------------|--------------------------|
|`News-user1@example.com` - `News-user10@example.com`         | News Management          |
|`Hardware-user1@example.com` - `Hardware-user10@example.com` | Hardware Reviews         |
|`Software-user1@example.com` - `Software-user10@example.com` | Software Reviews         |
|`Video-user1@example.com` - `Video-user10@example.com`       | Video Content            |
|`Opinion-user1@example.com` - `Opinion-user10@example.com`   | Opinion Publishing       |


## Resource end-points

| Route                              | Method | Access     | Note                                                      |
|------------------------------------|--------|------------|-----------------------------------------------------------|
| `/users`                           | POST   | Anyone     | Invoked from the register page                            |
| `/users`                           | GET    | Admin      | List all users                                            |
| `/users/password-change`           | PATCH  | Self       | User changes their own password                           |
| `/users/self`                      | GET    | User       | Get current user profile based on auth token              |
| `/users/list-users/:orgID/:deptID` | GET    | Admin      | List the users that have privileges for the given dept/org|
| `/users/$userID`                   | DELETE | Admin      | Delete a user                                             |
| `/users/$userID`                   | PUT    | Admin/user | A user can change his own profile. Otherwise only admins  |
| `/users/$userID/add-dept`          | PATCH  | Admin      | Add to the list of departments the user can access        |
| `/users/$userID/remove-dept`       | PATCH  | Admin      | Remove from the list of departments the user can access   |
| `/org`                             | GET    | User       | List all Organisational Units                             |
| `/org`                             | POST   | Admin      | Create new Organisational Unit                            |
| `/org/$orgID`                      | DELETE | Admin      | Delete an Organisational Unit                             |
| `/org/$orgID`                      | PATCH  | Admin      | Rename an Organisational Unit                             |
| `/org/$orgID`                      | POST   | Admin      | Create a new department                                   |
| `/org/$orgID/$deptID`              | DELETE | Admin      | Delete a department                                       |
| `/org/$orgID/$deptID`              | PUT    | Admin      | Rename a department                                       |
| `/repo`                            | GET    | User       | Get the repos for the current user token                  |
| `/repo/$orgID/$deptID`             | POST   | User       | Add new credential in repo                                |
| `/repo/$orgID/$deptID/$credID`     | GET    | User       | Get specific credential in repo                           |
| `/repo/$orgID/$deptID/$credID`     | PUT    | Manager    | Update specific credential in repo                        |
| `/repo/$orgID/$deptID/$credID`     | DELETE | Manager    | Delete specific credential in repo                        |
