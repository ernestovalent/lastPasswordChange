const config = require('./config');
const mysql = require('mysql');

const connection = mysql.createConnection(config);

async function connectMysql(){
  let promise = new Promise( (resolve,reject) => {
    connection.connect( (error) => {
      if(error){
        reject(error.stack);
      }
      resolve(connection.threadId);
    });
  });
  return promise;
}

async function queryMysql(userData){
  let promise = new Promise( (resolve, reject) => {
    connection.query({
      sql: 'INSERT INTO ?? (principalName, givenName, lastChangePassword, lastUpdate) VALUES ?',
      values: [config.table,userData]
    }, (error, result, field) => {
      if(error){
        reject(error);
      }
      resolve(result);
    });
  });
  return promise;
}

async function endMysql(){
  console.log('Cerrando conexión.');
  let promise = new Promise( (resolve, reject) => {
    connection.end( (error) => {
      if(error){
        connection.destroy();
      }
      resolve();
    });
  });
  return promise;
}

async function insertArray(array){

  return inser = connectMysql()
  .then(queryMysql(array))
  .then(endMysql);

}

module.exports = { insertArray };