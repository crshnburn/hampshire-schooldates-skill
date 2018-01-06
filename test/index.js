let ast = require('alexa-skill-tester');
let path = require('path');

let module_under_test = require("../index");
 
describe("Event tests", function(done) {
    ast(module_under_test.handler, path.resolve(__dirname, "./events"), done);
});