process.env.NODE_ENV = 'testing';
const { app, http } = require('../index');
const chai = require('chai');
const chaitHttp = require('chai-http');
const expect = chai.expect;
const { resetDatabase } = require('../tools/resetDatabase');
const { disconnectFromDatabase } = require('../config/database');
chai.use(chaitHttp);

//Status codes

const SUCCESS      = 200;
const CREATED      = 201;
const BAD_REQUEST  = 400;
const UNAUTHORISED = 401;
const FORBIDDEN    = 403;

describe("Route tests", () => {
 
    beforeEach( (done) => {
        resetDatabase(true).then( ()=> {
            console.log("...done resetting the database...");
            done();
        });
    });

    after( (done)=> {
        disconnectFromDatabase();
        http.close(done);
    });

    it("Successful login", done => {
        const requestObject = {
            email : "Software-user1@example.com",
            password : "password"
        }
        chai.request(app)
            .post('/api/login')
            .send(requestObject)
            .end((error, response) => {
                expect(error).to.be.null;
                expect(response.status).to.equal(SUCCESS);
                expect(response.body.hasOwnProperty('token')).to.be.true;
                done();
            });
    });

    it("Login with email that doesn't exist.", done => {
        const requestObject = {
            email : "Software-user999@example.com",
            password : "password"
        }
        chai.request(app)
            .post('/api/login')
            .send(requestObject)
            .end((error, response) => {
                expect(error).to.be.null;
                expect(response.status).to.equal(FORBIDDEN);
                done();
            });
    });

    it("Login with email field missing", done => {
        const requestObject = {
            password : "password"
        }
        chai.request(app)
            .post('/api/login')
            .send(requestObject)
            .end((error, response) => {
                expect(error).to.be.null;
                expect(response.status).to.equal(UNAUTHORISED);
                done();
            });
    });

    it("Login with password field missing", done => {
        const requestObject = {
            email : "Software-user1@example.com",
        }
        chai.request(app)
            .post('/api/login')
            .send(requestObject)
            .end((error, response) => {
                expect(error).to.be.null;
                expect(response.status).to.equal(UNAUTHORISED);
                done();
            });
    });
    
    it("Register new user succesfully", done => {
        const requestObject = {
            firstname : "Richard",
            lastname : "Feldman",
            email : "Software-user99@example.com",
            password : "password"
        }
        chai.request(app)
            .post('/api/register')
            .send(requestObject)
            .end((error, response) => {
                expect(error).to.be.null;
                expect(response.status).to.equal(CREATED);
                expect(response.body.hasOwnProperty('token')).to.be.true;
                done();
            });
    });
    
    it("Register new user fails due to missing field", done => {
        const requestObject = {
            firstname : "Richard",
            lastname : "Feldman",
            password : "password"
        }
        chai.request(app)
            .post('/api/register')
            .send(requestObject)
            .end((error, response) => {
                expect(error).to.be.null;
                expect(response.status).to.equal(BAD_REQUEST);
                done();
            });
    });
    

});
