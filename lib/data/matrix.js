/*
 * ExpStats lib/data/matrix.js
 * copyright (c) 2015 Susisu
 */

"use strict";

function endModule() {
    module.exports = Object.freeze({
        "parse"    : parse,
        "transpose": transpose
    });
}

function parse(str) {
    return str.split(/[\r\n]+/)
        .map(function (line) {
            return line.split("#")[0];
        })
        .filter(function (line) {
            return line.length > 0;
        })
        .map(function (line) {
            return line.split(/\s+/)
                .map(function (word) {
                    return parseFloat(word);
                });
        });
}

function transpose(mat) {
    var res = [];
    var i, j;
    var h = mat.length;
    for (i = 0; i < h; i++) {
        var row = mat[i];
        var w = row.length;
        for (j = 0; j < w; j++) {
            if (res[j] === undefined) {
                res[j] = [];
            }
            res[j][i] = mat[i][j];
        }
    }
    for (i = 0; i < w; i++) {
        for (j = 0; j < h; j++) {
            if (res[i][j] === undefined) {
                res[i][j] = 0;
            }
        }
    }
    return res;
}

endModule();
