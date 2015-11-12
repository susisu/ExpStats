/*
 * ExpStats lib/exprs/exprs.js
 * copyright (c) 2015 Susisu
 */

"use strict";

function endModule() {
    module.exports = Object.freeze({
        "Exception": Exception,

        "Expression" : Expression,
        "Literal"    : Literal,
        "Variable"   : Variable,
        "Vector"     : Vector,
        "Application": Application
    });
}

function Cache(expr, val) {
    if (!(this instanceof Cache)) {
        return new Cache(expr, val);
    }
    this.expr = expr;
    this.val  = val;
}

function findOrCreateCache(caches, expr) {
    for (var i = 0; i < caches.length; i++) {
        if (expr.equals(caches[i].expr)) {
            return caches[i];
        }
    }
    var cache = new Cache(expr, undefined);
    caches.push(cache);
    return cache;
}

function Exception(trace, message) {
    if (!(this instanceof Exception)) {
        return new Exception(trace, message);
    }
    this.trace   = trace.slice();
    this.message = message;
}

Exception.prototype = Object.create(Object.prototype, {
    "constructor": {
        "writable"    : true,
        "configurable": true,
        "value": Exception
    },
    "addPos": {
        "writable"    : true,
        "configurable": true,
        "value": function (pos) {
            return new Exception(this.trace.concat(pos), this.message);
        }
    },
    "toString": {
        "writable"    : true,
        "configurable": true,
        "value": function () {
            var traceStr = this.trace
                .filter(function (pos) { return pos !== null && pos !== undefined; })
                .map(function (pos) { return pos.toString(); })
                .reverse()
                .join(":\n");
            if (traceStr === "") {
                return this.message;
            }
            else {
                return traceStr + ":\n" + this.message;
            }
        }
    }
})


function Expression(pos) {
    if (!(this instanceof Expression)) {
        return new Expression(pos);
    }
    this.pos   = pos;
    this.env   = undefined;
    this.cache = undefined;
}

Expression.prototype = Object.create(Object.prototype, {
    "constructor": {
        "writable"    : true,
        "configurable": true,
        "value": Expression
    },
    "equals": {
        "writable"    : true,
        "configurable": true,
        "value": function (expr) {
            return expr instanceof Expression;
        }
    },
    "init": {
        "writable"    : true,
        "configurable": true,
        "value": function (env, caches) {
            var clone   = new Expression(this.pos);
            clone.env   = env;
            clone.cache = findOrCreateCache(caches, clone);
            return clone;
        }
    },
    "eval": {
        "writable"    : true,
        "configurable": true,
        "value": function () {
            if (this.env === undefined || this.cache === undefined) {
                throw new Exception([this.pos], "uninitialized expression");
            }
            if (this.cache.val === undefined) {
                this.cache.val = NaN;
            }
            return this.cache.val;
        }
    }
});

function Literal(pos, val) {
    if (!(this instanceof Literal)) {
        return new Literal(pos, val);
    }
    Expression.call(this, pos);
    this.val = val;
}

Literal.prototype = Object.create(Expression.prototype, {
    "constructor": {
        "writable"    : true,
        "configurable": true,
        "value": Literal
    },
    "equals": {
        "writable"    : true,
        "configurable": true,
        "value": function (expr) {
            return expr instanceof Literal
                && this.val === expr.val;
        }
    },
    "init": {
        "writable"    : true,
        "configurable": true,
        "value": function (env, caches) {
            var clone   = new Literal(this.pos, this.val);
            clone.env   = env;
            clone.cache = findOrCreateCache(caches, clone);
            return clone;
        }
    },
    "eval": {
        "writable"    : true,
        "configurable": true,
        "value": function () {
            if (this.env === undefined || this.cache === undefined) {
                throw new Exception([this.pos], "uninitialized expression");
            }
            if (this.cache.val === undefined) {
                this.cache.val = this.val;
            }
            return this.cache.val;
        }
    }
});

function Variable(pos, name) {
    if (!(this instanceof Variable)) {
        return new Variable(pos, name);
    }
    Expression.call(this, pos);
    this.name = name;
}

Variable.prototype = Object.create(Expression.prototype, {
    "constructor": {
        "writable"    : true,
        "configurable": true,
        "value": Variable
    },
    "equals": {
        "writable"    : true,
        "configurable": true,
        "value": function (expr) {
            return expr instanceof Variable
                && this.name === expr.name
                && this.env === expr.env;
        }
    },
    "init": {
        "writable"    : true,
        "configurable": true,
        "value": function (env, caches) {
            var clone   = new Variable(this.pos, this.name);
            clone.env   = env;
            clone.cache = findOrCreateCache(caches, clone);
            return clone;
        }
    },
    "eval": {
        "writable"    : true,
        "configurable": true,
        "value": function () {
            if (this.env === undefined || this.cache === undefined) {
                throw new Exception([this.pos], "uninitialized expression");
            }
            if (this.cache.val === undefined) {
                if (this.env[this.name] === undefined) {
                    throw new Exception([this.pos], "unbound variable '" + this.name + "'");
                }
                this.cache.val = this.env[this.name];
            }
            return this.cache.val;
        }
    }
});

function Vector(pos, elems) {
    if (!(this instanceof Vector)) {
        return new Vector(pos, elems);
    }
    Expression.call(this, pos);
    this.elems = elems.slice();
}

Vector.prototype = Object.create(Expression.prototype, {
    "constructor": {
        "writable"    : true,
        "configurable": true,
        "value": Vector
    },
    "equals": {
        "writable"    : true,
        "configurable": true,
        "value": function (expr) {
            return expr instanceof Vector
                && this.elems.length === expr.elems.length
                && this.elems.every(function (elem, i) { return elem.equals(expr.elems[i]); });
        }
    },
    "init": {
        "writable"    : true,
        "configurable": true,
        "value": function (env, caches) {
            var cloneElems = this.elems.map(function (elem) { return elem.init(env, caches); });
            var clone      = new Vector(this.pos, cloneElems);
            clone.env      = env;
            clone.cache    = findOrCreateCache(caches, clone);
            return clone;
        }
    },
    "eval": {
        "writable"    : true,
        "configurable": true,
        "value": function () {
            if (this.env === undefined || this.cache === undefined) {
                throw new Exception([this.pos], "uninitialized expression");
            }
            if (this.cache.val === undefined) {
                this.cache.val = this.elems.map(function (elem) { return elem.eval(); });
            }
            return this.cache.val;
        }
    }
});

function Application(pos, func, arg) {
    if (!(this instanceof Application)) {
        return new Application(pos, func, arg);
    }
    Expression.call(this, pos);
    this.func = func;
    this.arg  = arg;
}

Application.prototype = Object.create(Expression.prototype, {
    "constructor": {
        "writable"    : true,
        "configurable": true,
        "value": Application
    },
    "equals": {
        "writable"    : true,
        "configurable": true,
        "value": function (expr) {
            return expr instanceof Application
                && this.func.equals(expr.func)
                && this.arg.equals(expr.arg);
        }
    },
    "init": {
        "writable"    : true,
        "configurable": true,
        "value": function (env, caches) {
            var cloneFunc = this.func.init(env, caches);
            var cloneArg  = this.arg.init(env, caches);
            var clone     = new Application(this.pos, cloneFunc, cloneArg);
            clone.env     = env;
            clone.cache   = findOrCreateCache(caches, clone);
            return clone;
        }
    },
    "eval": {
        "writable"    : true,
        "configurable": true,
        "value": function () {
            if (this.env === undefined || this.cache === undefined) {
                throw new Exception([this.pos], "uninitialized expression");
            }
            if (this.cache.val === undefined) {
                var _func = this.func.eval();
                if (typeof _func !== "function") {
                    throw new Exception([this.pos], "invalid application");
                }
                var _arg  = this.arg.eval();
                try {
                    this.cache.val = _func(_arg);
                }
                catch (exception) {
                    throw exception.addPos(this.pos);
                }
            }
            return this.cache.val;
        }
    }
});

endModule();
