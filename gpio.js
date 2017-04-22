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

// make sure that Linux has initialized the specified GPIO number "num"
// returns true on success, or false on failure
function gpio_init(num) {
    if (!fs.existsSync(path)) {
	TryWrite("/sys/class/gpio/export",""+num+"\n",function() {
	    if (!fs.existsSync(path)) return false
	    return true
	}, function() {
	    return false
	})
    }
}

// set the specified GPIO number "num" to the given value "val", where
// val = "INPUT", "LOW", or "HIGH"
// returns "OK" or "ERROR"
function gpio_set(num,val) {
    var path="/sys/class/gpio/gpio"+num
    if (!gpio_init(num)) return "ERROR"
    var cmd
    switch (val) {
    case "INPUT": cmd="in\n"; break
    case "HIGH": cmd="high\n"; break
    case "LOW": cmd="low\n"; break
    default: return "ERROR")
    }
    TryWrite(path+"/direction",cmd,function() {
	return "OK"
    }, function() {
	return "ERROR"
    })
}

// get the value of the specified GPIO number "num"
// returns "LOW", "HIGH", "INPUT_LOW", or "INPUT_HIGH"
// may also return "ERROR"
function gpio_get(num) {
    var path="/sys/class/gpio/gpio"+num
    if (!gpio_init(num)) return "ERROR"
    var dir=fs.readFileSync(path+"/direction", "utf8")
    var data=Number(fs.readFileSync(path+"/value", "utf8"))
    if (dir.slice(0,3) == "out") {
	if (data) {
	    return "HIGH"
	} else {
	    return "LOW"
	}
    } else { // dir == "in"
	if (data) {
	    return "INPUT_HIGH"
	} else {
	    return "INPUT_LOW"
	}
    }
}

function gpio(req,res,next) {
    var i,num,val,ret,url = req.path.split("/")
    console.log(req.path)
    if (url.length < 2 || url.length > 3) {
	res.write("[\"ERROR\"]")
	return
    }
    var numlist = url[1].split(",")
    res.write("[")
    for (i=0;i<numlist.length;i++) {
	if (i>0) res.write(",")
	num=Number(numlist[i])
	if (num < 0) res.write("\"ERROR\"")
	if (url.length == 2) {
	    ret = gpio_get(num)
	} else { // url.length == 3
	    val = url[2]
	    ret = gpio_set(num,val)
	}
	res.write(ret)
    }
    res.write("]")
    res.end()
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
