"use strict";

var fs = require("fs")

function TryWrite(path,str,success,failure) {
    try {
	var out=fs.createWriteStream(path)
	out.on("finish",success)
	out.write(str)
	out.end()
    } catch (e) {
	if (failure) failure(e)
    }
}

function gpio_action(path,url,res) {
    if (url.length == 2) {
	var dir=fs.readFileSync(path+"/direction", "utf8")
	var data=Number(fs.readFileSync(path+"/value", "utf8"))
	if (dir.slice(0,3) == "out") {
	    if (data) {
		return res.send("HIGH")
	    } else {
		return res.send("LOW")
	    }
	} else { // dir == "in"
	    if (data) {
		return res.send("INPUT_HIGH")
	    } else {
		return res.send("INPUT_LOW")
	    }
	}
    } else { // url.length == 3
	var val=url[2],cmd
	switch (val) {
	case "INPUT": cmd="in\n"; break
	case "HIGH": cmd="high\n"; break
	case "LOW": cmd="low\n"; break
	default: return res("ERROR")
	}
	TryWrite(path+"/direction",cmd,function() {
	    return res.send("OK")
	}, function() {
	    return res.send("ERROR")
	})
    }
}

function gpio(req,res,next) {
    var num,val,url = req.path.split("/")
    console.log(req.path)
    if (url.length < 2 || url.length > 3) return res.send("ERROR")
    num=Number(url[1])
    if (num < 0) return res.send("ERROR")
    var path="/sys/class/gpio/gpio"+num
    if (!fs.existsSync(path)) {
	TryWrite("/sys/class/gpio/export",""+num+"\n",function() {
	    if (!fs.existsSync(path)) return res.send("ERROR") // what happened?
	    gpio_action(path,url,res)
	}, function() {
	    return res.send("ERROR") // bad GPIO number?
	})
    } else {
	gpio_action(path,url,res)
    }
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
var endpoint = "/gpio/"

module.exports = function(app,exports,options) {
    if (options && typeof options == "string") {
	endpoint = options
    }
    Log("service gpio ",endpoint)
    app.use(endpoint, gpio)
    
}
