'use strict';

var through2 = require('through2');
var exec = require('child_process').exec;

function shell(command) {
    exec(command, function(error, stdout, stderr) {
        stdout && console.log('stdout: ' + stdout);
        stderr && console.log('stderr: ' + stderr);
        if (error !== null) {
            console.log('exec error: ' + error);
        }
    });
}

exports.checkout = function() {
    return through2.obj(function(file, enc, cb) {
        var filepath = file.path;
        shell('tf checkout /recursive ' + filepath);
    });
};

exports.checkin = function() {
    return through2.obj(function(file, enc, cb) {
        var filepath = file.path;
        shell('tf checkin /recursive /noprompt /comment:"Compress Javascript" ' + filepath);
    });
};

exports.undo = function() {
    return through2.obj(function(file, enc, cb) {
        var filepath = file.path;
        shell('tf undo /recursive /noprompt ' + filepath);
    });
};
