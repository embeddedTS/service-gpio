"use strict";

var app = require("server")().app
var endpoint = "/gpio/"

function gpio(req,res,next) {
    var num,val,url = req.path.split("/")
    if (url.length == 2) { // GET /gpio/#
	num=url[1]
	res.send("HIGH")
    } else if (url.length == 3) { // GET /gpio/#/VALUE
	num=url[1]
	val=url[2]
	switch (val) {
	case "INPUT":
	    res("OK"); break
	case "HIGH":
	    res("OK"); break
	case "LOW":
	    res("OK"); break
	default:
	    res("ERROR"); break
	}
	
    } else {
	res.send("ERROR")
    }
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
