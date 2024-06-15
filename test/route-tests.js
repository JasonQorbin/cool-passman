const { app, http } = require('../index');
const chai = require('chai');
const chaitHttp = require('chai-http');
const expect = chai.expect;

chai.use(chaitHttp);

describe("Sample test", () => {
    after( (done)=> {
        http.close(done);
    })


    it("Test 1", done => {
        chai.request(app)
            .get('/').end((error, response) => {
                expect(error).to.be.null;
                expect(response.text).to.equal("Hello World!!!");
                done();
            });
    });
});
