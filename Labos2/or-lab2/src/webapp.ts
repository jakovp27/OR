import express from 'express';
import path from 'path'
import db = require('./or');
import bodyParser from 'body-parser'
import fs from 'fs';
import http from 'http'
import { writeFile } from 'fs';
const app = express();
app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
app.use(express.static(path.join(__dirname, 'public')));
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(urlencodedParser)




app.get('/', async function (req, res) {
  let rez = await db.getPlayers()
  console.log(rez)
  res.render('index', {});
});

// const file = fs.createWriteStream("i.csv");
// const request = http.get("http://localhost/files/igrac.csv", function(response) {
//    response.pipe(file);
//    // after download completed close filestream
//    file.on("finish", () => {
//        file.close();
//        console.log("Download Completed");
//    });
// });



app.get('/get_data', async function (req, res) {
  let rez = await db.getPlayers()
  console.log(rez)
  res.send(rez)

});

app.get('/getDatatable', async function (req, res) {
  
  res.render('datatable', {})
});


app.listen(80);



function writeJSONfile(rez: any) {
  var json = JSON.stringify(rez);
  var callback;
  writeFile('myjsonfile.json', json, 'utf-8', function (err) {
    if (err)
      throw err;
    console.log('complete');
  }
  );
}

