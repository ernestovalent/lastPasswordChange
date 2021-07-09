const cosmos = require('./lib/cosmosdb/getDocument');
const graph = require('./lib/graph/getPasswordUsers');
const mysql = require('./lib/mysql/insertUsers');

async function getGraphConfig(){
  let promise = new Promise( (resolve, reject) => {
    let getDocument = cosmos.getDocument();
    resolve(getDocument);
  });
  return promise;
}

async function getDataFromGraph(cosmosDocument){
  let promise = new Promise( (resolve, reject) => {
    let getAllData = graph.getAllData(cosmosDocument);
    resolve(getAllData);
  });
  return promise;
}

async function insertMysql(dataFromGraph){
  let promise = new Promise( (resolve, reject) => {
    let inserts = mysql.insertArray(dataFromGraph);
    resolve(inserts);
  });
  return promise;
}

function main(){
  getGraphConfig().then( (graphConfig) => {
    getDataFromGraph(graphConfig.resource).then( (data) => {
      insertMysql(data).then( (results) => {
        
      });
    });
  });
}

main();