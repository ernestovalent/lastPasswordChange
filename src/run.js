const CosmosConfig = require('./lib/cosmosdb/config');
const CosmosClient = require("@azure/cosmos").CosmosClient;
const Axios = require('axios').default;
const Qs = require('qs');
const MysqlConfig = require('./lib/mysql/config');
const mysql = require('mysql');

const cosmos = new CosmosClient(CosmosConfig);
const connection = mysql.createConnection(MysqlConfig);

function getConfigFromCosmos(){
  console.log('Get graph config from Cosmos');
  let graphConfi = cosmos
  .database(CosmosConfig.databaseId)
  .container(CosmosConfig.containerId)
  .item(CosmosConfig.itemId, CosmosConfig.partitionKey)
  .read();
  return graphConfi;
}

function getTokenFromGraph(grapConfig){
  console.log('Get token from Graph');
  let data = Qs.stringify({
    'grant_type': 'password',
    'client_id': grapConfig.clientId,
    'client_secret': grapConfig.clientSecret,
    'scope': 'https://graph.microsoft.com/.default',
    'userName': grapConfig.userName,
    'password': grapConfig.userPassword
  });
  let config = {
    method: 'post',
    url: 'https://login.microsoftonline.com/'+grapConfig.tenant+'/oauth2/v2.0/token',
    headers: { 
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data : data
  }
  return Axios(config);
}

function getPasswords(config){
  console.log('Get password block 100 from Graph');
  let newConfig = config;
  let block = Axios(config)
  .then( (response) => {
    if(response.data['@odata.nextLink']){
      newConfig.url = response.data['@odata.nextLink'];
      createDataBlock(response.data.value);
      return getPasswords(newConfig);
    }else{
      console.log('Ya no tiene datos...');
      disconnectMysql();
      return true;
    }
  })
  .catch( (error) =>{
    return error
  });
}

function createDataBlock(data){
  console.log('Create Data User');
  let user = new Array();
  let date = new Date();
  data.forEach(e => {
    user.push([e.userPrincipalName,e.givenName,e.lastPasswordChangeDateTime,date.toISOString()]);
  });
  insertMysql(user);
}

function connectMysql(){
  console.log('Connecting to Mysql');
  connection.connect( (error) => {
    if(error){
      return false;
    }
    return true;
  });
}

function disconnectMysql(){
  console.log('Disconnecting from Mysql');
  connection.end( (error) => {
    if (error) {
      connection.destroy();
    }
    return true;
  });
}

function truncateMysql(){
  console.log('truncate table from Mysql');
  connection.query({
    sql: 'TRUNCATE ??',
    values: [MysqlConfig.table]
  }, (error,result,field) => {
    if (error) {
      return error;
    }
    return result;
  });
}

function insertMysql(userData){
  console.log('insert block user to Mysql');
  connection.query({
    sql: 'INSERT INTO ?? (principalName, givenName, lastChangePassword, lastUpdate) VALUES ?',
    values: [MysqlConfig.table,userData]
  }, (error,result,field) => {
    if (error) {
      return error;
    }
    return result;
  });
}

getConfigFromCosmos().then((graphConfi) => {
  getTokenFromGraph(graphConfi.resource).then((token) => {
    connectMysql();
    truncateMysql();
    let configPassword = {
      method: 'get',
      url: 'https://graph.microsoft.com/beta/users?$count=true&$select=userPrincipalName,givenName,lastPasswordChangeDateTime&$filter=accountEnabled eq true and onPremisesSyncEnabled eq true',
      headers: {
        'ConsistencyLevel': 'eventual', 
        'Authorization': token.data.token_type+' '+token.data.access_token
      }
    }
    getPasswords(configPassword);
  });
});