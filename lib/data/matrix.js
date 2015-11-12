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

function parse(str, defaultValue) {
    var mat = str.split(/[\r\n]+/)
        .map(function (row) {
            return row.split("#")[0];
        })
        .filter(function (row) {
            return row.length > 0;
        })
        .map(function (row) {
            return row.split(/\s+/)
                .map(function (elem) {
                    return parseFloat(elem);
                });
        });
    var i, j;
    var h = mat.length;
    var w = 0;
    for (i = 0; i < h; i++) {
        if (mat[i].length > w) {
            w = mat[i].length;
        }
    }
    for (i = 0; i < h; i++) {
        for (j = 0; j < w; j++) {
            if (mat[i][j] === undefined) {
                mat[i][j] = defaultValue;
            }
        }
    }
    return mat;
}

function transpose(mat) {
    var res = [];
    var i, j;
    var h = mat.length;
    var w = 0;
    for (i = 0; i < h; i++) {
        if (mat[i].length > w) {
            w = mat[i].length;
        }
    }
    for (i = 0; i < w; i++) {
        res[i] = [];
        for (j = 0; j < h; j++) {
            res[i][j] = mat[j][i];
        }
    }
    return res;
}

endModule();
