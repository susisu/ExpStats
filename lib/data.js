/*
 * ExpStats lib/data.js
 * copyright (c) 2015 Susisu
 */

"use strict";

function endModule() {
    module.exports = Object.freeze({
        "matrix": matrix
    });
}

var matrix = require("./data/matrix.js");

endModule();
