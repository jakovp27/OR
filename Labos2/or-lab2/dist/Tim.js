"use strict";
exports.__esModule = true;
exports.Tim = void 0;
var Tim = /** @class */ (function () {
    //konstruktor korisnika
    function Tim(ime, bodovi, razlika) {
        this.ime = ime;
        this.bodovi = bodovi;
        this.razlika = razlika;
    }
    Tim.prototype.compare = function (o) {
        var v1 = this.bodovi.valueOf();
        var v2 = o.bodovi.valueOf();
        if (v1 != v2)
            return v1 - v2;
        else
            return this.razlika.valueOf() - o.razlika.valueOf();
    };
    return Tim;
}());
exports.Tim = Tim;
