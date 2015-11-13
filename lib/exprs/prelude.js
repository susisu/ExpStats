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
        else if (typeof x === "number") {
            return func(x);
        }
        else {
            throw new Exception([], "type error");
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
                else if (typeof y === "number") {
                    return x.map(function (xelem) {
                        return op(xelem)(y);
                    });
                }
                else {
                    throw new Exception([], "type error");
                }
            }
            else if (typeof x === "number") {
                if (y instanceof Array) {
                    return y.map(function (yelem) {
                        return op(x)(yelem);
                    });
                }
                else if (typeof y === "number") {
                    return func(x, y);
                }
                else {
                    throw new Exception([], "type error");
                }
            }
            else {
                throw new Exception([], "type error");
            }
        };
    };
}

function accumOp(accum, init) {
    return function op(x) {
        if (x instanceof Array) {
            return x.reduce(function (x, y) {
                if (typeof x === "number" && typeof y === "number") {
                    return accum(x, y);
                }
                else {
                    throw new Exception([], "type error");
                }
            }, init);
        }
        else if (typeof x === "number") {
            return x;
        }
        else {
            throw new Exception([], "type error");
        }
    };
}

prelude["pos"]   = unaryOp(function (x) { return +x; });
prelude["neg"]   = unaryOp(function (x) { return -x; });
prelude["abs"]   = unaryOp(function (x) { return Math.abs(x); });
prelude["floor"] = unaryOp(function (x) { return Math.floor(x); });
prelude["ceil"]  = unaryOp(function (x) { return Math.ceil(x); });
prelude["round"] = unaryOp(function (x) { return Math.round(x); });
prelude["log"]   = unaryOp(function (x) { return Math.log(x); });
prelude["log2"]  = unaryOp(function (x) { return Math.log(x) / Math.log(2); });
prelude["log10"] = unaryOp(function (x) { return Math.log(x) / Math.log(10); });
prelude["exp"]   = unaryOp(function (x) { return Math.exp(x); });
prelude["sqrt"]  = unaryOp(function (x) { return Math.sqrt(x); });

prelude["add"]  = binaryOp(function (x, y) { return x + y; });
prelude["sub"]  = binaryOp(function (x, y) { return x - y; });
prelude["mul"]  = binaryOp(function (x, y) { return x * y; });
prelude["div"]  = binaryOp(function (x, y) { return x / y; });
prelude["mod"]  = binaryOp(function (x, y) { return x % y; });
prelude["pow"]  = binaryOp(function (x, y) { return Math.pow(x, y); });

prelude["at"] = function at(x) {
    return function at_(y) {
        if (x instanceof Array) {
            if (typeof y === "number") {
                if (y < 0 || x.length <= y) {
                    throw new Exception([], "range error");
                }
                else {
                    return x[y];
                }
            }
            else {
                throw new Exception([], "type error: invalid index");
            }
        }
        else {
            throw new Exception([], "type error: not a vector");
        }
    };
};
prelude["cnt"] = function cnt(x) {
    if (x instanceof Array) {
        return x.length;
    }
    else {
        throw new Exception([], "type error: not a vector");
    }
};
prelude["take"] = function take(x) {
    return function take_(y) {
        if (typeof x === "number") {
            if (y instanceof Array) {
                return y.slice(0, x < 0 ? 0 : x);
            }
            else {
                throw new Exception([], "type error: not a vector");
            }
        }
        else {
            throw new Exception([], "type error: not a number");
        }
    };
};
prelude["drop"] = function drop(x) {
    return function drop_(y) {
        if (typeof x === "number") {
            if (y instanceof Array) {
                return y.slice(x < 0 ? 0 : x);
            }
            else {
                throw new Exception([], "type error: not a vector");
            }
        }
        else {
            throw new Exception([], "type error: not a number");
        }
    };
};
prelude["map"] = function map(f) {
    return function map_(x) {
        if (typeof f === "function") {
            if (x instanceof Array) {
                return x.map(function (elem) {
                    return f(elem);
                });
            }
            else {
                throw new Exception([], "type error: not a vector");
            }
        }
        else {
            throw new Exception([], "type error: not a function");
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
    else if (typeof x === "number") {
        return x;
    }
    else {
        throw new Exception([], "type error");
    }
};
prelude["var"] = function (x) {
    if (x instanceof Array) {
        var avg = prelude["avg"](x);
        var dev = prelude["pow"](prelude["sub"](x)(avg))(2);
        return prelude["avg"](dev);
    }
    else if (typeof x === "number") {
        return 0;
    }
    else {
        throw new Exception([], "type error");
    }
};

endModule();
