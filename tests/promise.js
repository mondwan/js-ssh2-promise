var ssh = require('ssh2');
var Q = require("q");
var util = require("util");

var c = new ssh();

var connect = function () {
    var deferred = Q.defer();

    c.once("ready", function () {
        c.removeAllListeners("error");
        deferred.resolve(c);
    });
    c.once("error", function (err) {
        c.removeAllListeners("ready");
        deferred.reject(err);
    });

    c.connect({
        host: 'localhost',
        port: 22,
        username: 'alltronic',
        //debug: console.log,
        password: "alltronic"
    });

    return deferred.promise;
};

var send = function (cmd) {
    var deferred = Q.defer();

    c.exec(cmd, function (err, stream) {
        if (err) {
            deferred.reject(err);
            return;
        }
        stream.setEncoding("utf8");

        var results = [];
        stream.on("data", function (data) {
            results.push(data);
        });
        stream.on("exit", function (code, signal) {
            deferred.resolve({
                code: code,
                signal: signal,
                results: results
            });
        });
    });

    return deferred.promise;
};

var disconnect = function () {
    var deferred = Q.defer();

    c.once("close", function (err) {
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

var i = 1;

connect()
    .then(function () {
        return send("date");
    })
    .then(function (res) {
        console.log(util.format("%dst date:", i++), res);
        return send("uptime");
    })
    .then(function (res) {
        console.log(util.format("%dnd date:", i++), res);
        return send("date");
    })
    .then(function (res) {
        console.log(util.format("%drd date:", i++), res);
        //return send("uptime");
        /*
        return disconnect()
                .then(connect)
                .then(function () {
                    return send("uptime");
                });
        **/
        return disconnect();
    })
    .then(function (res) {
        console.log(util.format("%dth uptime:", i++), res);
        return send("date");
    })
    .then(function (res) {
        console.log(util.format("%dth date:", i++), res);
        return send("uptime");
    })
    .then(function (res) {
        console.log(util.format("%dth uptime:", i++), res);
        return send("date");
    })
    .then(function (res) {
        console.log(util.format("%dth date:", i++), res);
        return send("uptime");
    })
    .then(function (res) {
        console.log(util.format("%dth uptime:", i++), res);
        return send("date");
    })
    .finally(disconnect)
    .done();
