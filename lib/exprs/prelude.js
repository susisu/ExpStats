/*
 * ExpStats lib/exprs/prelude.js
 * copyright (c) 2015 Susisu
 */

"use strict";

function endModule() {
    module.exports = Object.freeze(prelude);
}

var exprs = require("./exprs.js");

var Exception = exprs.Exception;

var prelude = Object.create(null);

function unaryOp(func) {
    return function op(x) {
        if (x instanceof Array) {
            return x.map(function (elem) {
                return op(elem);
            });
        }
        else {
            return func(x);
        }
    };
}

function binaryOp(func) {
    return function op(x) {
        return function op_(y) {
            if (x instanceof Array) {
                if (y instanceof Array) {
                    var len = Math.min(x.length, y.length);
                    var res = new Array(len);
                    for (var i = 0; i < len; i++) {
                        res[i] = op(x[i])(y[i]);
                    }
                    return res;
                }
                else {
                    return x.map(function (xelem) {
                        return op(xelem)(y);
                    });
                }
            }
            else {
                if (y instanceof Array) {
                    return y.map(function (yelem) {
                        return op(x)(yelem);
                    });
                }
                else {
                    return func(x, y);
                }
            }
        };
    };
}

function accumOp(accum, init) {
    return function op(x) {
        if (x instanceof Array) {
            return x.reduce(function (x, y) {
                if (x instanceof Array || y instanceof Array) {
                    throw new Exception([], "type error");
                }
                return accum(x, y);
            }, init);
        }
        else {
            return x;
        }
    };
}

prelude["positive"] = unaryOp(function (x) { return +x; });
prelude["negative"] = unaryOp(function (x) { return -x; });
prelude["floor"]    = unaryOp(function (x) { return Math.floor(x); });
prelude["ceil"]     = unaryOp(function (x) { return Math.ceil(x); });
prelude["round"]    = unaryOp(function (x) { return Math.round(x); });
prelude["log"]      = unaryOp(function (x) { return Math.log(x); });
prelude["log10"]    = unaryOp(function (x) { return Math.log(x) / Math.log(10); });
prelude["exp"]      = unaryOp(function (x) { return Math.exp(x); });
prelude["sqrt"]     = unaryOp(function (x) { return Math.sqrt(x); });

prelude["+"] = binaryOp(function (x, y) { return x + y; });
prelude["-"] = binaryOp(function (x, y) { return x - y; });
prelude["*"] = binaryOp(function (x, y) { return x * y; });
prelude["/"] = binaryOp(function (x, y) { return x / y; });
prelude["%"] = binaryOp(function (x, y) { return x % y; });
prelude["^"] = binaryOp(function (x, y) { return Math.pow(x, y); });
prelude["**"] = prelude["^"];

prelude["!"] = function at(x) {
    return function at_(y) {
        if (x instanceof Array) {
            if (y instanceof Array) {
                throw new Exception([], "type error: invalid index");
            }
            return x[y];
        }
        else {
            throw new Exception([], "type error: '" + x.toString() + "' is not a vector");
        }
    };
};

prelude["sum"] = accumOp(function (x, y) { return x + y; }, 0);
prelude["prod"] = accumOp(function (x, y) { return x * y; }, 1);

prelude["avg"] = function (x) {
    if (x instanceof Array) {
        var sum = prelude["sum"](x);
        return sum / x.length;
    }
    else {
        return x;
    }
};
prelude["var"] = function (x) {
    if (x instanceof Array) {
        var avg = prelude["avg"](x);
        var dev = prelude["^"](prelude["-"](x)(avg))(2);
        return prelude["avg"](dev);
    }
    else {
        return 0;
    }
};

endModule();
