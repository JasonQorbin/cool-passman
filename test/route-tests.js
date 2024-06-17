process.env.NODE_ENV = 'testing';
const { app, http } = require('../index');
const chai = require('chai');
const chaitHttp = require('chai-http');
const expect = chai.expect;
const { resetDatabase } = require('../tools/resetDatabase');
const { disconnectFromDatabase } = require('../config/database');
const { mongoose } = require('mongoose');
chai.use(chaitHttp);

//Status codes

const SUCCESS      = 200;
const UNAUTHORISED = 401;
const FORBIDDEN    = 403;

describe("Sample test", () => {
 
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

});
