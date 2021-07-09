const cosmos = require('./lib/cosmosdb/getDocument');
const mysql = require('./lib/mysql/insertUsers');

async function getGraphConfig(){
  let promise = new Promise( (resolve, reject) => {
    let getDocument = cosmos.get();
    resolve(getDocument);
  });
  return promise;
}

async function insertMysql(){
  let promise = new Promise( (resolve, reject) => {
    let values = [
      ['hey@xcaret.com', 'Caamalito','2021-06-12T17:31:23Z','2021-05-12T17:31:23Z'],
      ['arnols@xcaret.com', 'Fers sita','2021-02-12T17:31:23Z','2021-05-12T17:31:23Z']]
    let inserts = mysql.insertArray(values);
    resolve(inserts);
  });
  return promise;
}

insertMysql();