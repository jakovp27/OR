import { Pool } from 'pg'
import dotenv from 'dotenv'
dotenv.config({path: require('find-config')('.env')})
const pool = new Pool({
   user: "postgres",
   host: "localhost",
   database: 'web2-lab1',
   password: "bazepodataka",
   port: 5432
})



export async function getPlayers() {
    var statment = '(SELECT array_to_json(array_agg(row_to_json(t))) as igrac FROM ( SELECT i.ime,i.prezime,i.pozicija,i.placa,i.datum_rodenja,i.visina,i.tezina,i.draft_pick as pick_na_draftu,i.draft_godina as godina_drafta,i.tim as naziv_kluba,COALESCE(json_agg(json_build_object(\'ime\', r.ime, \'prezime\', r.prezime)) , \'[]\') AS roditelji FROM "Igrac" as i JOIN "Roditelj" as r ON i.id=r.d_id GROUP BY i.id) t)';
   
   
    return (await pool.query(statment)).rows[0];
   // var s = 'SELECT i.ime,i.prezime,i.pozicija,i.placa,i.datum_rodenja,i.visina,i.tezina,i.draft_pick as pick_na_draftu,i.draft_godina as godina_drafta,i.tim as naziv_kluba from "Igrac" as i'
   // console.log((await pool.query(s)).rows)
   // return (await pool.query(s)).rows



   
}

export async function getParents() {
   return await pool.query('SELECT ime,prezime,d_id FROM "Roditelj"');
}
