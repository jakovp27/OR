import express from 'express';
import path from 'path'
import db = require('./or');
import bodyParser, { json } from 'body-parser';
const fs = require('fs');
import https from 'https';
import { auth, requiresAuth } from 'express-openid-connect';
const app = express();
app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
app.use(express.static(path.join(__dirname, 'public')));
var urlencodedParser = bodyParser.urlencoded({ extended: true })
app.use(urlencodedParser)
app.use(bodyParser.json());



const config = {
  authRequired: false,
  idpLogout: false, //login not only from the app, but also from identity provider
  secret: process.env.SECRET,
  baseURL: `https://localhost:80`,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.DOMAIN,
  clientSecret: process.env.CLIENT_SECRET,
  authorizationParams: {
    response_type: 'code',
    //scope: "openid profile email"   
  },
};




// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));


app.get("/sign-up", (req, res) => {
  res.oidc.login({
    returnTo: '/',
    authorizationParams: {
      screen_hint: "signup",
    },
  });
});
app.get("/log-in", (req, res) => {
  res.oidc.login({
    returnTo: '/',
    authorizationParams: {
      screen_hint: "login",
    },
  });
});

app.get('/userdata', async function (req, res) {

  if (req.oidc.isAuthenticated())
    res.render('userdata', { user: req.oidc.user });
  else
    res.status(401).json({ status: "Not authenticated", message: "You must login tu access this page", response: null })

});

app.get('/preslike', async function (req, res) {

  if (req.oidc.isAuthenticated()) {
    let rez = await db.getPlayers()
    let data = JSON.stringify(rez.igrac, null, 2);
    let csv = await db.getPlayersToCSV()
    fs.writeFileSync('preslika_igraca.json', data);
    res.status(200).json({ status: "OK", message: "Uspješna promijena preslike", response: rez.igrac })
  } else
    res.status(401).json({ status: "Not authenticated", message: "You must login tu access this page", response: null })
});


app.get('/', async function (req, res) {
  let username: string | undefined;
  if (req.oidc.isAuthenticated()) {
    username = req.oidc.user?.name ?? req.oidc.user?.sub;
    const user = JSON.stringify(req.oidc.user);
  }
  res.render('index', { username });
});

app.delete('/players/:id', async function (req, res) {
  let id = (req.params.id)
  console.log(id)
  res.type("application/json")

  if (isNaN(+id)) {
    res.status(400).json({ status: "Bad request", message: "Id must be number", response: null })
    return;
  }
  let rez = await db.deletePlayerById(id)
  if (rez.igrac == null) {
    res.status(404).json({ status: "Not found", message: "Player with id " + id + " does not exist", response: null })
    return;
  }
  res.status(200).json({ status: "OK", message: "Player with id " + id + " deleted", response: rez.igrac[0] })
});

app.put('/players', async function (req, res) {
  let igrac = req.body.igrac[0]
  console.log(igrac)
  res.type("application/json")
  if (igrac.id == null || !(await db.existPlayerWithId(igrac.id))) {
    res.status(404).json({ status: "Not found", message: "Player that you want to update must have existing id", response: null })
  }
  try {
    let rez = await db.updatePlayer(igrac)
    res.status(200).json({ status: "OK", message: "Player with id " + rez.igrac[0].id + " updated", response: rez.igrac[0] })
  } catch (err) {
    res.status(400).json({ status: "Bad request", message: "Player that you want to update is not in good format", response: null })
  }


});

app.post('/players', async function (req, res, next) {
  let igrac = req.body.igrac[0]
  console.log(igrac)
  res.type("application/json")
  try {
    var rez = await db.addPlayer(igrac)
    res.status(200).json({ status: "OK", message: "Player with id " + rez.igrac[0].id + " added", response: rez.igrac[0] })
  } catch (err) {
    res.status(400).json({ status: "Bad request", message: "New player is not in good format", response: null })
  }

});

app.get('/players', async function (req, res) {
  let rez = await db.getPlayers()
  res.type("application/json")
  res.status(200).json({ status: "OK", message: "Fetched all players ", response: rez.igrac })
});

app.get('/players/:id', async function (req, res) {
  let id = (req.params.id)
  res.type("application/json")
  if (isNaN(+id)) {
    res.status(400).json({ status: "Bad request", message: "Id must be number", response: null })
    return;
  }
  let rez = await db.getPlayerById(id)
  if (rez.igrac == null) {
    res.status(404).json({ status: "Not found", message: "Player with id " + id + " does not exist", response: null })
    return;
  }
  res.status(200).json({ status: "OK", message: "Fetched players with id " + id, response: rez.igrac })

});



app.get('/players/name/:name', async function (req, res) {
  let id = (req.params.name)

  res.type("application/json")
  if (!isNaN(+id)) {
    res.status(400).json({ status: "Bad request", message: "Name must be string", response: null })
    return;
  }
  let name = id.charAt(0).toUpperCase() + id.slice(1).toLowerCase();
  console.log(name)

  let rez = await db.getPlayerByName(name)

  if (rez.igrac == null) {
    res.status(404).json({ status: "Not found", message: "Player with name " + name + " does not exist", response: null })
    return;
  }
  res.status(200).json({ status: "OK", message: "Fetched players with name " + name, response: rez.igrac })
});


app.get('/players/position/:position', async function (req, res) {
  let p = (req.params.position).toLowerCase()
  console.log(p)
  res.type("application/json")
  var r = null
  if (!isNaN(+p)) {
    res.status(400).json({ status: "Bad request", message: "Position must be string", response: null })
    return;
  }
  if (p == "organizator igre" || p == "playmaker" || p == "play" || p == "organizator_igre" || p == "p")
    r = await db.getPlayerByPosition(p = "organizator igre")
  else if (p == "bek šuter" || p == "shooting guard" || p == "shooting_guard" || p == "bek_šuter" || p == "bš")
    r = await db.getPlayerByPosition(p = "bek šuter")
  else if (p == "nisko krilo" || p == "small forward" || p == "small_forward" || p == "nisko_krilo" || p == "nk")
    r = await db.getPlayerByPosition(p = "nisko krilo")
  else if (p == "visoko krilo" || p == "power forward" || p == "power_forward" || p == "visoko_krilo" || p == "vk")
    r = await db.getPlayerByPosition(p = "visoko krilo")
  else if (p == "centar" || p == "center" || p == "c")
    r = await db.getPlayerByPosition(p = "centar")
  else {
    res.status(404).json({ status: "Not found", message: "Position " + p + " does not exist", response: null })
    return
  }

  res.status(200).json({ status: "OK", message: "Fetched players at postion " + p, response: r.igrac })

});

app.get('/players/surname/:surname', async function (req, res) {
  let id = (req.params.surname)
  res.type("application/json")
  if (!isNaN(+id)) {
    res.status(400).json({ status: "Bad request", message: "Surname must be string", response: null })
    return;
  }
  let name = id.charAt(0).toUpperCase() + id.slice(1).toLowerCase();
  console.log(name)

  let rez = await db.getPlayerBySurname(name)
  if (rez.igrac == null) {
    res.status(404).json({ status: "Not found", message: "Player with surname " + name + " does not exist", response: null })
    return;
  }
  res.status(200).json({ status: "OK", message: "Fetched players with surname " + name, response: rez.igrac })
});

app.get('/openapi', async function (req, res) {
  let rez = await db.getPlayers()
  fs.readFile('openapi.json', (err: any, data: any) => {
    if (err) throw err;
    let file = JSON.parse(data);
    res.status(200).json({ status: "OK", message: "Fetched openapi", response: file })
  });


});



app.get('/get_data', async function (req, res) {
  let rez = await db.getPlayers()
  res.send(rez)

});

app.get('/getDatatable', async function (req, res) {
  if (req.oidc.isAuthenticated())
    res.render('datatable', {})
  else
    res.status(401).json({ status: "Not authenticated", message: "You must login tu access this page", response: null })

});

https.createServer({
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert')
}, app)
  .listen(80, function () {
    console.log(`Server running at https://localhost:80/`);
  });




