import express from 'express';
import path from 'path'
import db = require('./or');
import bodyParser, { json } from 'body-parser';
const fs = require('fs');

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
app.use(express.static(path.join(__dirname, 'public')));
var urlencodedParser = bodyParser.urlencoded({ extended: true })
app.use(urlencodedParser)
app.use(bodyParser.json());




app.get('/', async function (req, res) {
  let rez = await db.getPlayers()
  console.log(rez)
  res.render('index', {});
});

app.delete('/players/:id', async function (req, res) {
  let id = (req.params.id)
  console.log(id)
  res.type("application/json")

  if(isNaN(+id)){
    res.status(400).json({ status: "Bad request", message: "Id must be number", response: null})
    return;
  }
  let rez = await db.deletePlayerById(id)
  if(rez.igrac == null){
    res.status(404).json({ status: "Not found", message: "Player with id "+ id +" does not exist", response: null})
    return;
  }
  res.status(200).json({ status: "OK", message: "Player with id " + id + " deleted", response: rez.igrac[0]})
});

app.put('/players', async function (req, res) {
  let igrac = req.body.igrac[0]
  console.log(igrac)
  res.type("application/json")
  if(igrac.id == null || !(await db.existPlayerWithId(igrac.id))){
    res.status(404).json({ status: "Not found", message: "Player that you want to update must have existing id", response: null})
  }
  try{
    let rez = await db.updatePlayer(igrac)
    res.status(200).json({ status: "OK", message: "Player with id "+ rez.igrac[0].id +" updated", response: rez.igrac[0]})
  } catch(err) {
    res.status(400).json({ status: "Bad request", message: "Player that you want to update is not in good format", response: null})
  }
    
  
});

app.post('/players', async function (req, res, next) {
  let igrac = req.body.igrac[0]
  console.log(igrac)
  res.type("application/json")
  try{
    var rez = await db.addPlayer(igrac)
    res.status(200).json({ status: "OK", message: "Player with id " + rez.igrac[0].id + " added", response: rez.igrac[0]})
  } catch(err){
    res.status(400).json({ status: "Bad request", message: "New player is not in good format", response: null})
  }
  
});

app.get('/players', async function (req, res) {
  let rez = await db.getPlayers()
  res.type("application/json")
  res.status(200).json({ status: "OK", message: "Fetched all players ", response: rez.igrac})
});

app.get('/players/:id', async function (req, res) {
  let id = (req.params.id)
  res.type("application/json")
  if(isNaN(+id)){
    res.status(400).json({ status: "Bad request", message: "Id must be number", response: null})
    return;
  }
  let rez = await db.getPlayerById(id)
  if(rez.igrac == null){
    res.status(404).json({ status: "Not found", message: "Player with id "+ id +" does not exist", response: null})
    return;
  }
  res.status(200).json({ status: "OK", message: "Fetched players with id " + id, response: rez.igrac})

});



app.get('/players/name/:name', async function (req, res) {
  let id = (req.params.name)
 
  res.type("application/json")
  if(!isNaN(+id)){
    res.status(400).json({ status: "Bad request", message: "Name must be string", response: null})
    return;
  }
  let name = id.charAt(0).toUpperCase() +  id.slice(1).toLowerCase();
  console.log(name)

  let rez = await db.getPlayerByName(name)
  
  if(rez.igrac == null){
    res.status(404).json({ status: "Not found", message: "Player with name "+ name +" does not exist", response: null})
    return;
  }
  res.status(200).json({ status: "OK", message: "Fetched players with name " + name, response: rez.igrac})
});


app.get('/players/position/:position', async function (req, res) {
  let p = (req.params.position).toLowerCase()
  console.log(p)
  res.type("application/json")
  var r = null
  if(!isNaN(+p)){
    res.status(400).json({ status: "Bad request", message: "Position must be string", response: null})
    return;
  }
  if(p == "organizator igre" || p == "playmaker" || p == "play" || p == "organizator_igre" || p == "p")
    r = await db.getPlayerByPosition(p = "organizator igre")
  else if(p == "bek šuter" || p == "shooting guard" || p=="shooting_guard" || p == "bek_šuter" || p == "bš")
    r = await db.getPlayerByPosition(p = "bek šuter")
  else if(p == "nisko krilo" || p == "small forward" || p=="small_forward" || p == "nisko_krilo" || p == "nk")
    r = await db.getPlayerByPosition(p = "nisko krilo")
  else if(p == "visoko krilo" || p == "power forward" || p=="power_forward" || p == "visoko_krilo" || p == "vk")
    r = await db.getPlayerByPosition(p = "visoko krilo")
  else if(p == "centar" || p == "center" || p == "c")
    r = await db.getPlayerByPosition(p = "centar")
  else{
    res.status(404).json({ status: "Not found", message: "Position "+p +" does not exist", response: null})
    return
  }

  res.status(200).json({ status: "OK", message: "Fetched players at postion " + p, response: r.igrac})
  
});

app.get('/players/surname/:surname', async function (req, res) {
  let id = (req.params.surname)
  res.type("application/json")
  if(!isNaN(+id)){
    res.status(400).json({ status: "Bad request", message: "Surname must be string", response: null})
    return;
  }
  let name = id.charAt(0).toUpperCase() +  id.slice(1).toLowerCase();
  console.log(name)

  let rez = await db.getPlayerBySurname(name)
  if(rez.igrac == null){
    res.status(404).json({ status: "Not found", message: "Player with surname "+ name +" does not exist", response: null})
    return;
  }
  res.status(200).json({ status: "OK", message: "Fetched players with surname " + name, response: rez.igrac})
});

app.get('/openapi', async function (req, res) {
  let rez = await db.getPlayers()
  fs.readFile('openapi.json', (err:any, data:any) => {
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
  
  res.render('datatable', {})
});


app.listen(80);



