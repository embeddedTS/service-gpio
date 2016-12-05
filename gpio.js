"use strict";

var app = require("server")().app
var endpoint = "/gpio/"

function gpio(req,res,next) {
    var url = req.path.split("/")
    console.log(url)
}

/*
  endpoints:
  GET /gpio/# - get value of specified GPIO
    INPUT_HIGH
    INPUT_LOW
    HIGH
    LOW
  GET /gpio/#/value - set the value of the GPIO
    INPUT
    HIGH
    LOW
*/
module.exports = function(options) {
    if (options && typeof options == "string") {
	endpoint = options
    }
    Log("service gpio ",endpoint)
    app.use(endpoint, gpio)
    
}
