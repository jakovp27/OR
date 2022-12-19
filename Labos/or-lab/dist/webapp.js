"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = __importDefault(require("express"));
var path_1 = __importDefault(require("path"));
var db = require("./or");
var body_parser_1 = __importDefault(require("body-parser"));
var fs = require('fs');
var app = (0, express_1["default"])();
app.set("views", path_1["default"].join(__dirname, "views"));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
app.use(express_1["default"].static(path_1["default"].join(__dirname, 'public')));
var urlencodedParser = body_parser_1["default"].urlencoded({ extended: true });
app.use(urlencodedParser);
app.use(body_parser_1["default"].json());
app.get('/', function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var rez;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db.getPlayers()];
                case 1:
                    rez = _a.sent();
                    console.log(rez);
                    res.render('index', {});
                    return [2 /*return*/];
            }
        });
    });
});
app["delete"]('/players/:id', function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var id, rez;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = (req.params.id);
                    console.log(id);
                    res.type("application/json");
                    if (isNaN(+id)) {
                        res.status(400).json({ status: "Bad request", message: "Id must be number", response: null });
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, db.deletePlayerById(id)];
                case 1:
                    rez = _a.sent();
                    if (rez.igrac == null) {
                        res.status(404).json({ status: "Not found", message: "Player with id " + id + " does not exist", response: null });
                        return [2 /*return*/];
                    }
                    res.status(200).json({ status: "OK", message: "Player with id " + id + " deleted", response: rez.igrac[0] });
                    return [2 /*return*/];
            }
        });
    });
});
app.put('/players', function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var igrac, _a, rez, err_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    igrac = req.body.igrac[0];
                    console.log(igrac);
                    res.type("application/json");
                    _a = igrac.id == null;
                    if (_a) return [3 /*break*/, 2];
                    return [4 /*yield*/, db.existPlayerWithId(igrac.id)];
                case 1:
                    _a = !(_b.sent());
                    _b.label = 2;
                case 2:
                    if (_a) {
                        res.status(404).json({ status: "Not found", message: "Player that you want to update must have existing id", response: null });
                    }
                    _b.label = 3;
                case 3:
                    _b.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, db.updatePlayer(igrac)];
                case 4:
                    rez = _b.sent();
                    res.status(200).json({ status: "OK", message: "Player with id " + rez.igrac[0].id + " updated", response: rez.igrac[0] });
                    return [3 /*break*/, 6];
                case 5:
                    err_1 = _b.sent();
                    res.status(400).json({ status: "Bad request", message: "Player that you want to update is not in good format", response: null });
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
});
app.post('/players', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var igrac, rez, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    igrac = req.body.igrac[0];
                    console.log(igrac);
                    res.type("application/json");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, db.addPlayer(igrac)];
                case 2:
                    rez = _a.sent();
                    res.status(200).json({ status: "OK", message: "Player with id " + rez.igrac[0].id + " added", response: rez.igrac[0] });
                    return [3 /*break*/, 4];
                case 3:
                    err_2 = _a.sent();
                    res.status(400).json({ status: "Bad request", message: "New player is not in good format", response: null });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
});
app.get('/players', function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var rez;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db.getPlayers()];
                case 1:
                    rez = _a.sent();
                    res.type("application/json");
                    res.status(200).json({ status: "OK", message: "Fetched all players ", response: rez.igrac });
                    return [2 /*return*/];
            }
        });
    });
});
app.get('/players/:id', function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var id, rez;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = (req.params.id);
                    res.type("application/json");
                    if (isNaN(+id)) {
                        res.status(400).json({ status: "Bad request", message: "Id must be number", response: null });
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, db.getPlayerById(id)];
                case 1:
                    rez = _a.sent();
                    if (rez.igrac == null) {
                        res.status(404).json({ status: "Not found", message: "Player with id " + id + " does not exist", response: null });
                        return [2 /*return*/];
                    }
                    res.status(200).json({ status: "OK", message: "Fetched players with id " + id, response: rez.igrac });
                    return [2 /*return*/];
            }
        });
    });
});
app.get('/players/name/:name', function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var id, name, rez;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = (req.params.name);
                    res.type("application/json");
                    if (!isNaN(+id)) {
                        res.status(400).json({ status: "Bad request", message: "Name must be string", response: null });
                        return [2 /*return*/];
                    }
                    name = id.charAt(0).toUpperCase() + id.slice(1).toLowerCase();
                    console.log(name);
                    return [4 /*yield*/, db.getPlayerByName(name)];
                case 1:
                    rez = _a.sent();
                    if (rez.igrac == null) {
                        res.status(404).json({ status: "Not found", message: "Player with name " + name + " does not exist", response: null });
                        return [2 /*return*/];
                    }
                    res.status(200).json({ status: "OK", message: "Fetched players with name " + name, response: rez.igrac });
                    return [2 /*return*/];
            }
        });
    });
});
app.get('/players/position/:position', function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var p, r;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    p = (req.params.position).toLowerCase();
                    console.log(p);
                    res.type("application/json");
                    r = null;
                    if (!isNaN(+p)) {
                        res.status(400).json({ status: "Bad request", message: "Position must be string", response: null });
                        return [2 /*return*/];
                    }
                    if (!(p == "organizator igre" || p == "playmaker" || p == "play" || p == "organizator_igre" || p == "p")) return [3 /*break*/, 2];
                    return [4 /*yield*/, db.getPlayerByPosition(p = "organizator igre")];
                case 1:
                    r = _a.sent();
                    return [3 /*break*/, 11];
                case 2:
                    if (!(p == "bek šuter" || p == "shooting guard" || p == "shooting_guard" || p == "bek_šuter" || p == "bš")) return [3 /*break*/, 4];
                    return [4 /*yield*/, db.getPlayerByPosition(p = "bek šuter")];
                case 3:
                    r = _a.sent();
                    return [3 /*break*/, 11];
                case 4:
                    if (!(p == "nisko krilo" || p == "small forward" || p == "small_forward" || p == "nisko_krilo" || p == "nk")) return [3 /*break*/, 6];
                    return [4 /*yield*/, db.getPlayerByPosition(p = "nisko krilo")];
                case 5:
                    r = _a.sent();
                    return [3 /*break*/, 11];
                case 6:
                    if (!(p == "visoko krilo" || p == "power forward" || p == "power_forward" || p == "visoko_krilo" || p == "vk")) return [3 /*break*/, 8];
                    return [4 /*yield*/, db.getPlayerByPosition(p = "visoko krilo")];
                case 7:
                    r = _a.sent();
                    return [3 /*break*/, 11];
                case 8:
                    if (!(p == "centar" || p == "center" || p == "c")) return [3 /*break*/, 10];
                    return [4 /*yield*/, db.getPlayerByPosition(p = "centar")];
                case 9:
                    r = _a.sent();
                    return [3 /*break*/, 11];
                case 10:
                    res.status(404).json({ status: "Not found", message: "Position " + p + " does not exist", response: null });
                    return [2 /*return*/];
                case 11:
                    res.status(200).json({ status: "OK", message: "Fetched players at postion " + p, response: r.igrac });
                    return [2 /*return*/];
            }
        });
    });
});
app.get('/players/surname/:surname', function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var id, name, rez;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = (req.params.surname);
                    res.type("application/json");
                    if (!isNaN(+id)) {
                        res.status(400).json({ status: "Bad request", message: "Surname must be string", response: null });
                        return [2 /*return*/];
                    }
                    name = id.charAt(0).toUpperCase() + id.slice(1).toLowerCase();
                    console.log(name);
                    return [4 /*yield*/, db.getPlayerBySurname(name)];
                case 1:
                    rez = _a.sent();
                    if (rez.igrac == null) {
                        res.status(404).json({ status: "Not found", message: "Player with surname " + name + " does not exist", response: null });
                        return [2 /*return*/];
                    }
                    res.status(200).json({ status: "OK", message: "Fetched players with surname " + name, response: rez.igrac });
                    return [2 /*return*/];
            }
        });
    });
});
app.get('/openapi', function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var rez;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db.getPlayers()];
                case 1:
                    rez = _a.sent();
                    fs.readFile('openapi.json', function (err, data) {
                        if (err)
                            throw err;
                        var file = JSON.parse(data);
                        res.status(200).json({ status: "OK", message: "Fetched openapi", response: file });
                    });
                    return [2 /*return*/];
            }
        });
    });
});
app.get('/get_data', function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var rez;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db.getPlayers()];
                case 1:
                    rez = _a.sent();
                    res.send(rez);
                    return [2 /*return*/];
            }
        });
    });
});
app.get('/getDatatable', function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            res.render('datatable', {});
            return [2 /*return*/];
        });
    });
});
app.listen(80);
