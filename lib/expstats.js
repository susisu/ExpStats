/*
 * ExpStats lib/expstats.js
 * copyright (c) 2015 Susisu
 */

"use strict";

function endModule() {
    module.exports = Object.freeze({
        "exprs": exprs,
        "data" : data
    });
}

var exprs = require("./exprs.js"),
    data  = require("./data.js");

endModule();
