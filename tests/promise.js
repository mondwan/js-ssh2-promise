var ssh = require('ssh2');
var Q = require("q");
var StringDecoder = require('string_decoder').StringDecoder;

var c = new ssh();

var send = function (cmd) {
    var deferred = Q.defer();
    var deferred2 = Q.defer();

    c.on("ready", function () {
        c.exec(cmd, function (err, stream) {
            if (err) {
                deferred.reject(err);
            }
            stream.on("data", function (data) {
                var decoder = new StringDecoder('utf8');
                var output = decoder.write(data);
                deferred.resolve(output);
            });
            stream.on("exit", function (code, signal) {
                deferred2.resolve({
                    code: code,
                    signal: signal
                });
            });
        });
    });

    c.on("error", function (err) {
        deferred.reject(err);
    });

    return deferred.promise
        .then(function (res) {
            return deferred2.promise
                .then(function (obj) {
                    obj.result = res;
                    return obj;
                });
        });
};

var disconnect = function () {
    var deferred = Q.defer();

    c.on("close", function (err) {
        console.log("disconnect");
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(true);
        }
    });
    c.end();
    return deferred.promise;
};

c.connect({
    host: 'localhost',
    port: 22,
    username: 'mondwan',
    //debug: console.log,
    password: "mondwan"
});

send("date")
    .then(function (res) {
        console.log("1st date", res);
        return res;
    })
    //.finally(disconnect)
    .done();
send("uptime")
    .then(function (res) {
        console.log("2nd uptime", res);
        return res;
    })
    //.finally(disconnect)
    .done();

send("date")
    .then(function (res) {
        console.log("3rd date", res);
        return res;
    })
    //.finally(disconnect)
    .done();
send("uptime")
    .then(function (res) {
        console.log("4th uptime", res);
        return res;
    })
    .finally(disconnect)
    .done();
send("date")
    .then(function (res) {
        console.log("5th date", res);
        return res;
    })
    //.finally(disconnect)
    .done();
send("uptime")
    .then(function (res) {
        console.log("6th uptime", res);
        return res;
    })
    //.finally(disconnect)
    .done();
send("date")
    .then(function (res) {
        console.log("7th date", res);
        return res;
    })
    //.finally(disconnect)
    .done();
send("uptime")
    .then(function (res) {
        console.log("8th uptime", res);
        return res;
    })
    .catch(function (err) {
        console.log(err);
    })
    .done();
