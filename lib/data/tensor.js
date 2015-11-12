/*
 * ExpStats lib/data/tensor.js
 * copyright (c) 2015 Susisu
 */

"use strict";

function endModule() {
    module.exports = Object.freeze({
        "rank": rank
    });
}

function rank(data) {
    if (data instanceof Array) {
        if (data.length === 0) {
            return 1;
        }
        var ranks = data.map(function (child) {
            return rank(child);
        });
        for (var i = 0; i < ranks.length - 1; i++) {
            if (ranks[i] !== ranks[i + 1]) {
                return -1;
            }
        }
        return ranks[0] + 1;
    }
    else {
        return 0;
    }
}

endModule();
