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

prelude["positive"] = function positive(x) {
    return x;
};

prelude["negative"] = function negative(x) {
    if (x instanceof Array) {
        return x.map(negative);
    }
    else {
        return -x;
    }
};

prelude["+"] = function add(x) {
    return function add_(y) {
        if (x instanceof Array) {
            if (y instanceof Array) {
                var len = Math.min(x.length, y.length);
                var res = new Array(len);
                for (var i = 0; i < len; i++) {
                    res[i] = add(x[i])(y[i]);
                }
                return res;
            }
            else {
                return x.map(function (xelem) {
                    return add(xelem)(y);
                });
            }
        }
        else {
            if (y instanceof Array) {
                return y.map(function (yelem) {
                    return add(x)(yelem);
                });
            }
            else {
                return x + y;
            }
        }
    };
};

prelude["-"] = function sub(x) {
    return function sub_(y) {
        if (x instanceof Array) {
            if (y instanceof Array) {
                var len = Math.min(x.length, y.length);
                var res = new Array(len);
                for (var i = 0; i < len; i++) {
                    res[i] = sub(x[i])(y[i]);
                }
                return res;
            }
            else {
                return x.map(function (xelem) {
                    return sub(xelem)(y);
                });
            }
        }
        else {
            if (y instanceof Array) {
                return y.map(function (yelem) {
                    return sub(x)(yelem);
                });
            }
            else {
                return x - y;
            }
        }
    };
};

prelude["*"] = function mul(x) {
    return function mul_(y) {
        if (x instanceof Array) {
            if (y instanceof Array) {
                var len = Math.min(x.length, y.length);
                var res = new Array(len);
                for (var i = 0; i < len; i++) {
                    res[i] = mul(x[i])(y[i]);
                }
                return res;
            }
            else {
                return x.map(function (xelem) {
                    return mul(xelem)(y);
                });
            }
        }
        else {
            if (y instanceof Array) {
                return y.map(function (yelem) {
                    return mul(x)(yelem);
                });
            }
            else {
                return x * y;
            }
        }
    };
};

prelude["/"] = function div(x) {
    return function div_(y) {
        if (x instanceof Array) {
            if (y instanceof Array) {
                var len = Math.min(x.length, y.length);
                var res = new Array(len);
                for (var i = 0; i < len; i++) {
                    res[i] = div(x[i])(y[i]);
                }
                return res;
            }
            else {
                return x.map(function (xelem) {
                    return div(xelem)(y);
                });
            }
        }
        else {
            if (y instanceof Array) {
                return y.map(function (yelem) {
                    return div(x)(yelem);
                });
            }
            else {
                return x / y;
            }
        }
    };
};

prelude["%"] = function mod(x) {
    return function mod_(y) {
        if (x instanceof Array) {
            if (y instanceof Array) {
                var len = Math.min(x.length, y.length);
                var res = new Array(len);
                for (var i = 0; i < len; i++) {
                    res[i] = mod(x[i])(y[i]);
                }
                return res;
            }
            else {
                return x.map(function (xelem) {
                    return mod(xelem)(y);
                });
            }
        }
        else {
            if (y instanceof Array) {
                return y.map(function (yelem) {
                    return mod(x)(yelem);
                });
            }
            else {
                return x % y;
            }
        }
    };
};

prelude["^"] = function pow(x) {
    return function pow_(y) {
        if (x instanceof Array) {
            if (y instanceof Array) {
                var len = Math.min(x.length, y.length);
                var res = new Array(len);
                for (var i = 0; i < len; i++) {
                    res[i] = pow(x[i])(y[i]);
                }
                return res;
            }
            else {
                return x.map(function (xelem) {
                    return pow(xelem)(y);
                });
            }
        }
        else {
            if (y instanceof Array) {
                return y.map(function (yelem) {
                    return pow(x)(yelem);
                });
            }
            else {
                return Math.pow(x, y);
            }
        }
    };
};

prelude["**"] = prelude["^"];

prelude["sum"] = function sum(x) {
    if (x instanceof Array) {
        return x.reduce(function (x, y) {
            if (x instanceof Array || y instanceof Array) {
                throw new Exception([], "sum: type error");
            }
            return x + y;
        }, 0);
    }
    else {
        return x;
    }
};

prelude["prod"] = function prod(x) {
    if (x instanceof Array) {
        return x.reduce(function (x, y) {
            if (x instanceof Array || y instanceof Array) {
                throw new Exception([], "prod: type error");
            }
            return x * y;
        }, 1);
    }
    else {
        return x;
    }
};

prelude["avg"] = function avg(x) {
    if (x instanceof Array) {
        var sum = x.reduce(function (x, y) {
            if (x instanceof Array || y instanceof Array) {
                throw new Exception([], "avg: type error");
            }
            return x + y;
        }, 0);
        return sum / x.length;
    }
    else {
        return x;
    }
};

endModule();
