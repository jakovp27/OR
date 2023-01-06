"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.existPlayerWithId = exports.deletePlayerById = exports.updatePlayer = exports.addPlayer = exports.getPlayerByPosition = exports.getPlayerBySurname = exports.getPlayerByName = exports.getPlayerById = exports.getParents = exports.getPlayersToCSV = exports.getPlayers = void 0;
var pg_1 = require("pg");
var dotenv_1 = __importDefault(require("dotenv"));
var stringify = require("csv-stringify").stringify;
var fs = require('fs');
dotenv_1["default"].config({ path: require('find-config')('.env') });
var pool = new pg_1.Pool({
    user: "postgres",
    host: "localhost",
    database: 'web2-lab1',
    password: "bazepodataka",
    port: 5432
});
function getPlayers() {
    return __awaiter(this, void 0, void 0, function () {
        var statment, rez;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    statment = '(SELECT array_to_json(array_agg(row_to_json(t))) as igrac FROM ( SELECT i.ime,i.prezime,i.pozicija,i.placa,i.datum_rodenja,i.visina,i.tezina,i.draft_pick as pick_na_draftu,i.draft_godina as godina_drafta,i.tim as naziv_kluba,COALESCE(json_agg(json_build_object(\'ime\', r.ime, \'prezime\', r.prezime)) , \'[]\') AS roditelji FROM "Igrac" as i JOIN "Roditelj" as r ON i.id=r.d_id GROUP BY i.id) t)';
                    return [4 /*yield*/, pool.query(statment)];
                case 1:
                    rez = (_a.sent()).rows[0].igrac;
                    return [2 /*return*/, getJSONLD(rez)];
            }
        });
    });
}
exports.getPlayers = getPlayers;
function getPlayersToCSV() {
    return __awaiter(this, void 0, void 0, function () {
        var statment, json, replacer, header, csv;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    statment = '(SELECT i.ime,i.prezime,i.pozicija,i.placa,i.datum_rodenja,i.visina,i.tezina,i.draft_pick,i.draft_godina,i.tim,r.ime as ime_roditelja,r.prezime as prezime_roditelja FROM "Igrac" as i JOIN "Roditelj" as r ON i.id=r.d_id )';
                    return [4 /*yield*/, pool.query(statment)];
                case 1:
                    json = (_a.sent()).rows;
                    replacer = function (key, value) { return value === null ? '' : value; } // specify how you want to handle null values here
                    ;
                    header = Object.keys(json[0]);
                    csv = __spreadArray([
                        header.join(',')
                    ], json.map(function (row) { return header.map(function (fieldName) { return JSON.stringify(row[fieldName], replacer); }).join(','); }), true).join('\r\n');
                    fs.writeFileSync(__dirname + '/preslika_igraci.csv', csv);
                    return [2 /*return*/];
            }
        });
    });
}
exports.getPlayersToCSV = getPlayersToCSV;
function getParents() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, pool.query('SELECT ime,prezime,d_id FROM "Roditelj"')];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.getParents = getParents;
function getPlayerById(id) {
    return __awaiter(this, void 0, void 0, function () {
        var statment, rez;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    statment = '(SELECT array_to_json(array_agg(row_to_json(t))) as igrac FROM ( SELECT i.ime,i.prezime,i.pozicija,i.placa,i.datum_rodenja,i.visina,i.tezina,i.draft_pick as pick_na_draftu,i.draft_godina as godina_drafta,i.tim as naziv_kluba,COALESCE(json_agg(json_build_object(\'ime\', r.ime, \'prezime\', r.prezime)) , \'[]\') AS roditelji FROM "Igrac" as i JOIN "Roditelj" as r ON i.id=r.d_id WHERE i.id = $1 GROUP BY i.id) t)';
                    return [4 /*yield*/, pool.query(statment, [id])];
                case 1:
                    rez = (_a.sent()).rows[0].igrac;
                    return [2 /*return*/, getJSONLD(rez)];
            }
        });
    });
}
exports.getPlayerById = getPlayerById;
function getPlayerByName(name) {
    return __awaiter(this, void 0, void 0, function () {
        var statment, rez;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    statment = '(SELECT array_to_json(array_agg(row_to_json(t))) as igrac FROM ( SELECT i.ime,i.prezime,i.pozicija,i.placa,i.datum_rodenja,i.visina,i.tezina,i.draft_pick as pick_na_draftu,i.draft_godina as godina_drafta,i.tim as naziv_kluba,COALESCE(json_agg(json_build_object(\'ime\', r.ime, \'prezime\', r.prezime)) , \'[]\') AS roditelji FROM "Igrac" as i JOIN "Roditelj" as r ON i.id=r.d_id WHERE i.ime = $1 GROUP BY i.id) t)';
                    return [4 /*yield*/, pool.query(statment, [name])];
                case 1:
                    rez = (_a.sent()).rows[0].igrac;
                    return [2 /*return*/, getJSONLD(rez)];
            }
        });
    });
}
exports.getPlayerByName = getPlayerByName;
function getPlayerBySurname(name) {
    return __awaiter(this, void 0, void 0, function () {
        var statment, rez;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    statment = '(SELECT array_to_json(array_agg(row_to_json(t))) as igrac FROM ( SELECT i.ime,i.prezime,i.pozicija,i.placa,i.datum_rodenja,i.visina,i.tezina,i.draft_pick as pick_na_draftu,i.draft_godina as godina_drafta,i.tim as naziv_kluba,COALESCE(json_agg(json_build_object(\'ime\', r.ime, \'prezime\', r.prezime)) , \'[]\') AS roditelji FROM "Igrac" as i JOIN "Roditelj" as r ON i.id=r.d_id WHERE i.prezime = $1 GROUP BY i.id) t)';
                    return [4 /*yield*/, pool.query(statment, [name])];
                case 1:
                    rez = (_a.sent()).rows[0].igrac;
                    return [2 /*return*/, getJSONLD(rez)];
            }
        });
    });
}
exports.getPlayerBySurname = getPlayerBySurname;
function getPlayerByPosition(position) {
    return __awaiter(this, void 0, void 0, function () {
        var statment, rez;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    statment = '(SELECT array_to_json(array_agg(row_to_json(t))) as igrac FROM ( SELECT i.ime,i.prezime,i.pozicija,i.placa,i.datum_rodenja,i.visina,i.tezina,i.draft_pick as pick_na_draftu,i.draft_godina as godina_drafta,i.tim as naziv_kluba,COALESCE(json_agg(json_build_object(\'ime\', r.ime, \'prezime\', r.prezime)) , \'[]\') AS roditelji FROM "Igrac" as i JOIN "Roditelj" as r ON i.id=r.d_id WHERE i.pozicija = $1 GROUP BY i.id) t)';
                    return [4 /*yield*/, pool.query(statment, [position])];
                case 1:
                    rez = (_a.sent()).rows[0].igrac;
                    return [2 /*return*/, getJSONLD(rez)];
            }
        });
    });
}
exports.getPlayerByPosition = getPlayerByPosition;
function getPlayerWithIdById(id) {
    return __awaiter(this, void 0, void 0, function () {
        var statment, rez;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    statment = '(SELECT array_to_json(array_agg(row_to_json(t))) as igrac FROM ( SELECT i.id,i.ime,i.prezime,i.pozicija,i.placa,i.datum_rodenja,i.visina,i.tezina,i.draft_pick as pick_na_draftu,i.draft_godina as godina_drafta,i.tim as naziv_kluba,COALESCE(json_agg(json_build_object(\'ime\', r.ime, \'prezime\', r.prezime)) , \'[]\') AS roditelji FROM "Igrac" as i JOIN "Roditelj" as r ON i.id=r.d_id WHERE i.id = $1 GROUP BY i.id) t)';
                    return [4 /*yield*/, pool.query(statment, [id])];
                case 1:
                    rez = (_a.sent()).rows[0].igrac;
                    return [2 /*return*/, getJSONLD(rez)];
            }
        });
    });
}
function addPlayer(i) {
    return __awaiter(this, void 0, void 0, function () {
        var s, id, statment, igrac, st, j;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    s = 'select max(id) from "Igrac"';
                    return [4 /*yield*/, pool.query(s)];
                case 1:
                    id = (_a.sent()).rows[0].max + 1;
                    statment = 'INSERT INTO "Igrac" (id,ime,prezime,pozicija,tim,placa,datum_rodenja,visina,tezina,draft_pick,draft_godina) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)';
                    return [4 /*yield*/, pool.query(statment, [id, i.ime, i.prezime, i.pozicija, i.naziv_kluba, i.placa, i.datum_rodenja, i.visina, i.tezina, i.pick_na_draftu, i.godina_drafta])];
                case 2:
                    igrac = (_a.sent()).rows[0];
                    st = 'INSERT INTO "Roditelj" (ime,prezime,d_id) VALUES ($1,$2,$3)';
                    j = 0;
                    _a.label = 3;
                case 3:
                    if (!(j < i.roditelji.length)) return [3 /*break*/, 6];
                    return [4 /*yield*/, pool.query(st, [i.roditelji[j].ime, i.roditelji[j].prezime, id])];
                case 4:
                    (_a.sent());
                    _a.label = 5;
                case 5:
                    j++;
                    return [3 /*break*/, 3];
                case 6:
                    i.id = id;
                    return [4 /*yield*/, getPlayerWithIdById(i.id)];
                case 7: return [2 /*return*/, (_a.sent())];
            }
        });
    });
}
exports.addPlayer = addPlayer;
function updatePlayer(i) {
    return __awaiter(this, void 0, void 0, function () {
        var statment, igrac, dl, st, j;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    statment = 'UPDATE "Igrac" SET ime = $1, prezime = $2, pozicija = $3, placa = $4, datum_rodenja = $5, visina = $6, tezina = $7, draft_pick = $8, draft_godina = $9, tim = $10 where id=$11';
                    return [4 /*yield*/, pool.query(statment, [i.ime, i.prezime, i.pozicija, i.placa, i.datum_rodenja, i.visina, i.tezina, i.pick_na_draftu, i.godina_drafta, i.naziv_kluba, i.id])];
                case 1:
                    igrac = (_a.sent()).rows[0];
                    dl = 'Delete from "Roditelj" as r where r.d_id = $1';
                    return [4 /*yield*/, pool.query(dl, [i.id])];
                case 2:
                    _a.sent();
                    st = 'INSERT INTO "Roditelj" (ime,prezime,d_id) VALUES ($1,$2,$3)';
                    j = 0;
                    _a.label = 3;
                case 3:
                    if (!(j < i.roditelji.length)) return [3 /*break*/, 6];
                    return [4 /*yield*/, pool.query(st, [i.roditelji[j].ime, i.roditelji[j].prezime, i.id])];
                case 4:
                    (_a.sent());
                    _a.label = 5;
                case 5:
                    j++;
                    return [3 /*break*/, 3];
                case 6: return [4 /*yield*/, getPlayerWithIdById(i.id)];
                case 7: return [2 /*return*/, (_a.sent())];
            }
        });
    });
}
exports.updatePlayer = updatePlayer;
function deletePlayerById(id) {
    return __awaiter(this, void 0, void 0, function () {
        var deleted, statment, s;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getPlayerWithIdById(id)];
                case 1:
                    deleted = _a.sent();
                    statment = 'delete from "Igrac" where id=$1';
                    return [4 /*yield*/, pool.query(statment, [id])];
                case 2:
                    _a.sent();
                    s = 'delete from "Roditelj" where d_id = $1';
                    return [4 /*yield*/, pool.query(s, [id])];
                case 3:
                    _a.sent();
                    return [2 /*return*/, deleted];
            }
        });
    });
}
exports.deletePlayerById = deletePlayerById;
function existPlayerWithId(id) {
    return __awaiter(this, void 0, void 0, function () {
        var statment, rez;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    statment = 'select * from "Igrac" where id=$1';
                    return [4 /*yield*/, pool.query(statment, [id])];
                case 1:
                    rez = (_a.sent()).rows[0];
                    if (rez == null)
                        return [2 /*return*/, false];
                    else
                        return [2 /*return*/, true];
                    return [2 /*return*/];
            }
        });
    });
}
exports.existPlayerWithId = existPlayerWithId;
function getJSONLD(rez) {
    var json = {};
    json["@vocab"] = "http://schema.org/";
    json["ime"] = "givenName";
    json["prezime"] = "familyname";
    var jl = {};
    jl["@context"] = json;
    jl["@type"] = "Person";
    var pov = [];
    for (var i = 0; i < rez.length; i++) {
        var data = rez[i];
        var js = __assign(__assign({}, jl), data);
        pov.push(js);
    }
    var jsonld = {};
    jsonld["igrac"] = pov;
    return jsonld;
}
