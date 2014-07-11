'use strict';

var through2 = require('through2');
var exec = require('child_process').exec;

/**
 * 对日期进行格式化
 * @param date 要格式化的日期
 * @param format 进行格式化的模式字符串
 *     支持的模式字母有：
 *     y:年,
 *     M:年中的月份(1-12),
 *     d:月份中的天(1-31),
 *     h:小时(0-23),
 *     m:分(0-59),
 *     s:秒(0-59),
 *     S:毫秒(0-999),
 *     q:季度(1-4)
 * @return String
 * @author yanis.wang@gmail.com
 */
function dateFormat(date, format) {
    if(format === undefined){
        format = date;
        date = new Date();
    }
    var map = {
        "M": date.getMonth() + 1, //月份
        "d": date.getDate(), //日
        "h": date.getHours(), //小时
        "m": date.getMinutes(), //分
        "s": date.getSeconds(), //秒
        "q": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
    };
    format = format.replace(/([yMdhmsqS])+/g, function(all, t){
        var v = map[t];
        if(v !== undefined){
            if(all.length > 1){
                v = '0' + v;
                v = v.substr(v.length-2);
            }
            return v;
        }
        else if(t === 'y'){
            return (date.getFullYear() + '').substr(4 - all.length);
        }
        return all;
    });
    return format;
}

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
        shell('tf checkin /recursive /noprompt /comment:"Compress Javascript ' + dateFormat(new Date, 'yyyy-MM-dd hh:mm:ss') + '" ' + filepath);
    });
};

exports.undo = function() {
    return through2.obj(function(file, enc, cb) {
        var filepath = file.path;
        shell('tf undo /recursive /noprompt ' + filepath);
    });
};

exports.add = function() {
    return through2.obj(function(file, enc, cb) {
        var filepath = file.path;
        shell('tf add ' + filepath + ' /recursive /noprompt');
    });
};

exports.get = function() {
    return through2.obj(function(file, enc, cb) {
        var filepath = file.path;
        shell('tf get ' + filepath + ' /recursive /noprompt');
    });
};
