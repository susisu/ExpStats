/*
 * ExpStats lib/exprs.js
 * copyright (c) 2015 Susisu
 */

"use strict";

function endModule() {
    module.exports = Object.freeze({
        "exprs"  : exprs,
        "parser" : parser,
        "prelude": prelude,
    });
}

var exprs   = require("./exprs/exprs.js"),
    parser  = require("./exprs/parser.js"),
    prelude = require("./exprs/prelude.js");


endModule();
