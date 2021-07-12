const cosmos = require('./lib/cosmosdb/getDocument');
const graph = require('./lib/graph/getPasswordUsers');
const mysql = require('./lib/mysql/insertUsers');

async function getGraphConfig(){
  let promise = new Promise( (resolve, reject) => {
    try{
      let getDocument = cosmos.getDocument();
      resolve(getDocument);
    }catch (error) {
      reject(error);
    }
  });
  return promise;
}

async function getDataFromGraph(cosmosDocument){
  let promise = new Promise( (resolve, reject) => {
    try{
      let getAllData = graph.getAllData(cosmosDocument);
      resolve(getAllData);
    }catch (error){
      reject(error);
    }
  });
  return promise;
}

async function insertMysql(dataFromGraph){
  let promise = new Promise( (resolve, reject) => {
    try{
      let inserts = mysql.insertArray(dataFromGraph);
      resolve(inserts);
    }catch(error){
      reject(error);
    }
  });
  return promise;
}

function main(){
  getGraphConfig().then( (graphConfig) => {
    getDataFromGraph(graphConfig.resource).then( (data) => {
      
    });
  });
}

function testing(){
}
main();