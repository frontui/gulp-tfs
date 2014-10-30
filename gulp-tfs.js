'use strict';

var through2 = require('through2');
var exec = require('child_process').exec;

function shell(command, callback) {
    exec(command, function(error, stdout, stderr) {
        stdout && console.log('stdout: ' + stdout);
        stderr && console.log('stderr: ' + stderr);
        if (error !== null) {
            console.log('exec error: ' + error);
        }
        callback();
    });
}

exports.checkout = function() {
    return through2.obj(function(chunk, enc, cb) {
        var filepath = chunk.path;
        shell('tf checkout /recursive ' + filepath, cb);
    });
};

exports.checkin = function(comment) {
    return through2.obj(function(chunk, enc, cb) {
        var filepath = chunk.path;
        shell('tf checkin /recursive /noprompt /comment:"' + (comment || '') + '" ' + filepath, cb);
    });
};

exports.undo = function() {
    return through2.obj(function(chunk, enc, cb) {
        var filepath = chunk.path;
        shell('tf undo /recursive /noprompt ' + filepath, cb);
    });
};

exports.add = function() {
    return through2.obj(function(chunk, enc, cb) {
        var filepath = chunk.path;
        shell('tf add ' + filepath + ' /recursive /noprompt', cb);
    });
};

exports.get = function() {
    return through2.obj(function(chunk, enc, cb) {
        var filepath = chunk.path;
        shell('tf get ' + filepath + ' /recursive /noprompt', cb);
    });
};
