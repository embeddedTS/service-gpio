Generic Linux GPIO plug-in for express-modular-server
===========================================================================

This is a plug-in for [express-modular-server](https://github.com/michael-ts/express-modular-server/).  It provides a service for controlling GPIOs through the [Linux sysfs interface](https://www.kernel.org/doc/Documentation/gpio/sysfs.txt).

If a string option is presented upon initialization, it is the base endpoint to serve GPIO control from.  If this option is not present,  a base endpoint of `/gpio/` is used.

# Install

    npm install service-gpio

The device you are running on must have kernel support for the sysfs GPIO interface including actual GPIOs which can be controlled.  This code has been tested on a Technologic Systems [TS-7680](https://wiki.embeddedarm.com/wiki/TS-7680). 

# Usage

The following example loads the `gpio` module with the default endpoint:

    var server = require("express-modular-server")({
         http:true
       })
        // other API calls here
        .API("gpio")
        .start()

In this example, an endpoint of `/io/` is used to control GPIOs:


    var server = require("express-modular-server")({
         http:true
       })
        // other API calls here
        .API("gpio","/io/")
        .start()

To get the current state of one GPIO, issue an HTTP GET request to the server with the GPIO number at the end of the URL.  Multiple GPIOs can be returned in a single call by separating GPIO numbers with a comma.

The GET request will return a JSON string encoding an array where each element corresponds to the value of the GPIO in the corresponding element of the request.  Possible values returns for a GPIO are:

 - `"INPUT_HIGH"` (is an input currently reading high) 
 - `"INPUT_LOW"` (is an
   input currently reading low)
 - `"HIGH"` (is currently driving high as a
 - `"LOW"` (is currently driving low as an output)

Example 1 (get the state of GPIO 5 which happens to be driven high):

    wget http://192.168.1.100/gpio/5
    =>
    [ "HIGH" ]

Example 2 (get the state of GPIOs 5,6, and 23, which happen to be an input reading low, and input reading high, and driven low, respectively):

    wget http://192.168.1.100/gpio/5,6,23
    =>
    [ "INPUT_LOW", "INPUT_HIGH", "LOW" ]

To set the state of a GPIO, issue an HTTP request to the server with the GPIO number, a slash, and the state to set at the end of the URL.  Possible states are `"INPUT"` to set the GPIO as an input, `"HIGH"` to set it as an output driving a high state, and `"LOW"` to set it as an output driving a low state. Multiple GPIOs can be set to the same value in a single call by separating GPIO numbers with a comma.  The server will return a JSON string encoding an array of status strings for each GPIO, which is either `"OK"` on success or `"ERROR"` on failure.

Example 1 (set GPIO 6 to drive a low output):

    wget http://192.168.1.100/gpio/6/LOW
    =>
    [ "OK" ]

Example 2 (set the state of GPIOs 1 and 5 to INPUTs):

    wget http://192.168.1.100/gpio/1,2/INPUT
    =>
    [ "OK", "OK" ]


# To Do

Allow multiple values to be specified for multiple GPIOs.


# Copyright

Written by Michael Schmidt.

# License

TBD