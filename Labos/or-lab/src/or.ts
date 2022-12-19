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
  
}

export async function getParents() {
   return await pool.query('SELECT ime,prezime,d_id FROM "Roditelj"');
}
export async function getPlayerById(id: string) {
   var statment = '(SELECT array_to_json(array_agg(row_to_json(t))) as igrac FROM ( SELECT i.ime,i.prezime,i.pozicija,i.placa,i.datum_rodenja,i.visina,i.tezina,i.draft_pick as pick_na_draftu,i.draft_godina as godina_drafta,i.tim as naziv_kluba,COALESCE(json_agg(json_build_object(\'ime\', r.ime, \'prezime\', r.prezime)) , \'[]\') AS roditelji FROM "Igrac" as i JOIN "Roditelj" as r ON i.id=r.d_id WHERE i.id = $1 GROUP BY i.id) t)';
   return (await pool.query(statment,[id])).rows[0];
}

export async function getPlayerByName(name: string) {
   var statment = '(SELECT array_to_json(array_agg(row_to_json(t))) as igrac FROM ( SELECT i.ime,i.prezime,i.pozicija,i.placa,i.datum_rodenja,i.visina,i.tezina,i.draft_pick as pick_na_draftu,i.draft_godina as godina_drafta,i.tim as naziv_kluba,COALESCE(json_agg(json_build_object(\'ime\', r.ime, \'prezime\', r.prezime)) , \'[]\') AS roditelji FROM "Igrac" as i JOIN "Roditelj" as r ON i.id=r.d_id WHERE i.ime = $1 GROUP BY i.id) t)';
   return (await pool.query(statment,[name])).rows[0];
}

export async function getPlayerBySurname(name: string) {
   var statment = '(SELECT array_to_json(array_agg(row_to_json(t))) as igrac FROM ( SELECT i.ime,i.prezime,i.pozicija,i.placa,i.datum_rodenja,i.visina,i.tezina,i.draft_pick as pick_na_draftu,i.draft_godina as godina_drafta,i.tim as naziv_kluba,COALESCE(json_agg(json_build_object(\'ime\', r.ime, \'prezime\', r.prezime)) , \'[]\') AS roditelji FROM "Igrac" as i JOIN "Roditelj" as r ON i.id=r.d_id WHERE i.prezime = $1 GROUP BY i.id) t)';
   return (await pool.query(statment,[name])).rows[0];
}

export async function getPlayerByPosition(position: string){
   var statment = '(SELECT array_to_json(array_agg(row_to_json(t))) as igrac FROM ( SELECT i.ime,i.prezime,i.pozicija,i.placa,i.datum_rodenja,i.visina,i.tezina,i.draft_pick as pick_na_draftu,i.draft_godina as godina_drafta,i.tim as naziv_kluba,COALESCE(json_agg(json_build_object(\'ime\', r.ime, \'prezime\', r.prezime)) , \'[]\') AS roditelji FROM "Igrac" as i JOIN "Roditelj" as r ON i.id=r.d_id WHERE i.pozicija = $1 GROUP BY i.id) t)';
   return (await pool.query(statment,[position])).rows[0];
}

async function getPlayerWithIdById(id: string) {
   var statment = '(SELECT array_to_json(array_agg(row_to_json(t))) as igrac FROM ( SELECT i.id,i.ime,i.prezime,i.pozicija,i.placa,i.datum_rodenja,i.visina,i.tezina,i.draft_pick as pick_na_draftu,i.draft_godina as godina_drafta,i.tim as naziv_kluba,COALESCE(json_agg(json_build_object(\'ime\', r.ime, \'prezime\', r.prezime)) , \'[]\') AS roditelji FROM "Igrac" as i JOIN "Roditelj" as r ON i.id=r.d_id WHERE i.id = $1 GROUP BY i.id) t)';
   return (await pool.query(statment,[id])).rows[0];
}


export async function addPlayer(i: any) {
   var s = 'select max(id) from "Igrac"';
   var id =  (await pool.query(s)).rows[0].max + 1;
   var statment = 'INSERT INTO "Igrac" (id,ime,prezime,pozicija,tim,placa,datum_rodenja,visina,tezina,draft_pick,draft_godina) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)'
   var igrac =  (await pool.query(statment,[id,i.ime,i.prezime,i.pozicija,i.naziv_kluba,i.placa,i.datum_rodenja,i.visina,i.tezina,i.pick_na_draftu,i.godina_drafta])).rows[0];
   var st = 'INSERT INTO "Roditelj" (ime,prezime,d_id) VALUES ($1,$2,$3)';
   for(var j = 0; j < i.roditelji.length; j++){     
      (await pool.query(st,[i.roditelji[j].ime,i.roditelji[j].prezime,id]))
   }
   i.id = id
   return (await getPlayerWithIdById(i.id));

}

export async function updatePlayer(i: any) {
   var statment ='UPDATE "Igrac" SET ime = $1, prezime = $2, pozicija = $3, placa = $4, datum_rodenja = $5, visina = $6, tezina = $7, draft_pick = $8, draft_godina = $9, tim = $10 where id=$11';
   var igrac =  (await pool.query(statment,[i.ime,i.prezime,i.pozicija,i.placa,i.datum_rodenja,i.visina,i.tezina,i.pick_na_draftu,i.godina_drafta,i.naziv_kluba,i.id])).rows[0];
   var dl = 'Delete from "Roditelj" as r where r.d_id = $1';
   await pool.query(dl,[i.id])
   var st = 'INSERT INTO "Roditelj" (ime,prezime,d_id) VALUES ($1,$2,$3)';
   for(var j = 0; j < i.roditelji.length; j++){     
      (await pool.query(st,[i.roditelji[j].ime,i.roditelji[j].prezime,i.id]))
   }
   return (await getPlayerWithIdById(i.id));

}

export async function deletePlayerById(id: any) {
   var deleted = await getPlayerWithIdById(id)
   var statment = 'delete from "Igrac" where id=$1';
   await pool.query(statment,[id])
   var s = 'delete from "Roditelj" where d_id = $1'
   await pool.query(s,[id])
   return deleted;
}

export async function existPlayerWithId(id: any) {
   var statment = 'select * from "Igrac" where id=$1';
   var rez = (await pool.query(statment,[id])).rows[0]
   if(rez == null)
      return false;
   else 
      return true;
}

