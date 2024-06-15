const express = require( 'express' );
const app = express();
const bodyParser = require( 'body-parser' );
const helmet = require('helmet');
const PORT = process.env.PORT || 8000;

app.use(helmet());

app.use(bodyParser.urlencoded( {  extended : true } ));
app.use(bodyParser.json());

app.get('/', (request, response) => {
    response.status(200).send("Hello World!!!").end();
});

const http = app.listen(PORT, () => {console.log(`Server now listening on port ${PORT}`)});

module.exports.app = app;
module.exports.http = http;
