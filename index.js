//Express app
const express = require( 'express' );
const app = express();
//Environment variables
const PORT = process.env.PORT || 8000;
const environment = app.get('env');
//External packages
const bodyParser = require( 'body-parser' );
const helmet = require('helmet');
//Routers
const authRouter = require('./routes/loginRoutes');
const orgRouter = require('./routes/orgRoutes');
const userRouter = require('./routes/userRoutes');
const repoRouter = require('./routes/repoRoutes');
//Custom middleware
const { requestLogging } = require('./middleware/logging');
//Database
const { connectToDatabase } = require('./config/database');

//Make sure that a secret has been provided for generating tokens if we are running in production.
if (!process.env.TOKEN_SECRET && environment === 'production') {
    console.log(
        `[FATAL ERROR] No secret has been set for token generation in production environment.
Please set the TOKEN_SECRET environment variable to an appropriate value and try again.`
    );
    process.exit(1);
}

//Attach middleware

app.use(helmet());

app.use(bodyParser.urlencoded( {  extended : true } ));
app.use(bodyParser.json());

app.use(requestLogging);

//Point the default rout to the React app
app.use('/', express.static('./frontend/build'));

//Assign the router to the correct API paths.
app.use('/api/users', userRouter);
app.use('/api/org',orgRouter);
app.use('/api/repo', repoRouter);
app.use('/api', authRouter);

connectToDatabase();

const http = app.listen(PORT, () => {
    console.log(`Environment: ${environment}`);
    console.log(`Server now listening on port ${PORT}`);
});

module.exports.app = app;
module.exports.http = http;
