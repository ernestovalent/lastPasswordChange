const config = require('./config');
const mysql = require('mysql');

const connection = mysql.createConnection(config);

async function connectMysql(){
  console.log('trying connect to Mysql');
  let promise = new Promise( (resolve,reject) => {
    connection.connect( (error) => {
      if(error){
        reject(error);
        console.log('Error');
      }
      resolve(connection);
      console.log('Done');
    });
  });
  return promise;
}

async function truncateMysql(){
  console.log('trying truncate table Mysql');
  let promise = new Promise( (resolve, reject) => {
    connection.query({
      sql: 'TRUNCATE ??',
      values: [config.table]
    }, (error, result, field) => {
      if(error){
        reject(error);
        console.log('Error');
      }
      resolve(result);
      console.log('Done');
    });
  });
  return promise;
}

async function insertMysql(userData){
  console.log('trying insert data to Mysql');
  let promise = new Promise( (resolve, reject) => {
    connection.query({
      sql: 'INSERT INTO ?? (principalName, givenName, lastChangePassword, lastUpdate) VALUES ?',
      values: [config.table,userData]
    }, (error, result, field) => {
      if(error){
        reject(error);
        console.log('Error');
      }
      resolve(result);
      console.log('Done');
    });
  });
  return promise;
}

async function endMysql(){
  console.log('trying close conection Mysql');
  let promise = new Promise( (resolve, reject) => {
    connection.end( (error, results) => {
      if(error){
        connection.destroy();
      }
      resolve(results);
      console.log('Done');
    });
  });
  return promise;
}

async function insertArray(array){
  let promise = new Promise( (resolve, reject) => {
    connectMysql()
    .then(truncateMysql())
    .then(insertMysql(array))
    .then(endMysql());
  });
  return promise;
}

module.exports = { insertArray };