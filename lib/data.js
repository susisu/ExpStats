/*
 * ExpStats lib/data.js
 * copyright (c) 2015 Susisu
 */

"use strict";

function endModule() {
    module.exports = Object.freeze({
        "tensor": tensor,
        "matrix": matrix
    });
}

var tensor = require("./data/tensor.js"),
    matrix = require("./data/matrix.js");

endModule();
