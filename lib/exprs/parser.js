/*
 * ExpStats lib/exprs/parser.js
 * copyright (c) 2015 Susisu
 */

"use strict";

function endModule() {
    module.exports = Object.freeze({
        "parse": parse
    });
}

var lq = require("loquat");

var exprs = require("./exprs.js");

var langDef = new lq.LanguageDef(
    "",
    "",
    "#",
    false,
    lq.letter.or(lq.char("$")),
    lq.alphaNum.or(lq.oneOf("_'$")),
    lq.oneOf("+-*/%^"),
    lq.oneOf("+-*/%^"),
    [],
    [],
    true
);
var tp = lq.makeTokenParser(langDef);

var lexeme = tp.lexeme;
var symbol = tp.symbol;

function unaryOp(opName, varName) {
    return lq.getPosition.bind(function (pos) {
        return tp.reservedOp(opName).then(lq.pure(function (x) {
            return new exprs.Application(
                pos,
                new exprs.Variable(pos, varName),
                x
            );
        }));
    });
};

function binaryOp(opName, varName) {
    return lq.getPosition.bind(function (pos) {
        return tp.reservedOp(opName).then(lq.pure(function (x, y) {
            return new exprs.Application(
                pos,
                new exprs.Application(
                    pos,
                    new exprs.Variable(pos, varName),
                    x
                ),
                y
            );
        }));
    });
};

var expr = new lq.LazyParser(function () {
    return lq.buildExpressionParser(
        [
            [
                new lq.Operator(
                    lq.OperatorType.PREFIX,
                    unaryOp("+", "positive")
                ),
                new lq.Operator(
                    lq.OperatorType.PREFIX,
                    unaryOp("-", "negative")
                )
            ],
            [
                new lq.Operator(
                    lq.OperatorType.INFIX,
                    binaryOp("^", "^"),
                    lq.OperatorAssoc.ASSOC_LEFT
                ),
                new lq.Operator(
                    lq.OperatorType.INFIX,
                    binaryOp("**", "**"),
                    lq.OperatorAssoc.ASSOC_LEFT
                )
            ],
            [
                new lq.Operator(
                    lq.OperatorType.INFIX,
                    binaryOp("*", "*"),
                    lq.OperatorAssoc.ASSOC_LEFT
                ),
                new lq.Operator(
                    lq.OperatorType.INFIX,
                    binaryOp("/", "/"),
                    lq.OperatorAssoc.ASSOC_LEFT
                ),
                new lq.Operator(
                    lq.OperatorType.INFIX,
                    binaryOp("%", "%"),
                    lq.OperatorAssoc.ASSOC_LEFT
                )
            ],
            [
                new lq.Operator(
                    lq.OperatorType.INFIX,
                    binaryOp("+", "+"),
                    lq.OperatorAssoc.ASSOC_LEFT
                ),
                new lq.Operator(
                    lq.OperatorType.INFIX,
                    binaryOp("-", "-"),
                    lq.OperatorAssoc.ASSOC_LEFT
                )
            ]
        ],
        application
    );
});

var number =
    lq.getPosition.bind(function (pos) {
        return tp.naturalOrFloat.bind(function (num) {
            if (num.length === 1) {
                return lq.pure(new exprs.Literal(pos, num[0]));
            }
            else {
                return lq.pure(new exprs.Literal(pos, num[1]));
            }
        });
    });
var variable =
    lq.getPosition.bind(function (pos) {
        return tp.identifier.bind(function (name) {
            return lq.pure(new exprs.Variable(pos, name));
        });
    });
var vector =
    lq.getPosition.bind(function (pos) {
        return tp.brackets(
            tp.commaSep(expr).bind(function (elems) {
                return lq.pure(new exprs.Vector(pos, elems));
            })
        );
    });
var term =
    lq.choice([
        number,
        variable,
        vector,
        tp.parens(expr)
    ]);

var application =
    term.bind(function (func) {
        return term.many().bind(function (args) {
            return lq.pure(
                args.reduce(
                    function (f, arg) {
                        return new exprs.Application(arg.pos, f, arg)
                    },
                    func
                )
            );
        });
    });

var program = tp.whiteSpace.then(expr).left(lq.eof);

function parse(name, src) {
    var res = lq.parse(program, name, src, 8);
    if (res.succeeded) {
        return res.value;
    }
    else {
        throw res.error;
    }
}

endModule();