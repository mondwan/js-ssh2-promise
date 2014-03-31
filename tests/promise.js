var ssh = require('ssh2');
var Q = require("q");
var StringDecoder = require('string_decoder').StringDecoder;

var c = new ssh();

var send = function (cmd) {
    var deferred = Q.defer();

    c.on("ready", function () {
        c.exec(cmd, function (err, stream) {
            if (err) {
                deferred.resolve(err);
            }
            stream.on("data", function (data) {
                deferred.resolve(data);
            });
        });
    });

    c.on("error", function (err) {
        deferred.reject(err);
    });

    c.on("end", function (err) {
        deferred.resolve(true);
    });

    c.on("close" , function (err) {
        if (err === true) {
            deferred.reject(new Error("Socket waas closed due to errors")); 
        } else {
            deferred.resolve(true);
        }
    });

    return deferred.promise;
};

c.connect({
    host: 'localhost',
    port: 22,
    username: 'codingFarmer',
    password: "codingFarmer"
});

send("uptime").then(function (res) {
    console.log("then:res", res);
    var decoder = new StringDecoder('utf8');
    var output = decoder.write(res);
    console.log("then:out", output);
    return output;
}).catch(function (err) {
    console.log("catch:err", err);
}).finally(function () {
    console.log("finally");
    c.end();
}).done();


/* example output:
 * codingFarmer@codingFarmer-P61-USB3P:~/Documents/git/js-ssh2-promise/tests$ node promise.js 
 * then:res <Buffer 20 32 33 3a 35 39 3a 30 34 20 75 70 20 20 32 3a 33 37 2c 20 20 32 20 75 73 65 72 73 2c 20 20 6c 6f 61 64 20 61 76 65 72 61 67 65 3a 20 30 2e 34 31 2c 20 ...>
 * then:out  23:59:04 up  2:37,  2 users,  load average: 0.41, 0.43, 0.50
 *
 * finally
 * codingFarmer@codingFarmer-P61-USB3P:~/Documents/git/js-ssh2-promise/tests$ fg
 * */
