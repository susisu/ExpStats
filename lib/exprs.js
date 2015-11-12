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

        "execute": execute
    });
}

var exprs   = require("./exprs/exprs.js"),
    parser  = require("./exprs/parser.js"),
    prelude = require("./exprs/prelude.js");

function execute(input, name, src) {
    var expr;
    if (src instanceof Array) {
        expr = new exprs.Vector(
            undefined,
            src.map(function (s, index) {
                return parser.parse(name + ":" + index.toString(), s);
            })
        );
    }
    else {
        expr = parser.parse(name, src);
    }
    var env = Object.create(prelude);
    env["$"] = input;
    for (var i = 0; i < input.length; i++) {
        env["$" + i.toString()] = input[i];
    }
    var _expr = expr.init(env, []);
    return _expr.eval();
}

endModule();
