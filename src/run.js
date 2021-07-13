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
    createDataBlock(response.data.value);
    if(response.data['@odata.nextLink']){
      newConfig.url = response.data['@odata.nextLink'];
      return getPasswords(newConfig);
    }else{
      console.log('Ya no tiene datos...');
      sendNotify();
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



function getPasswordExpireSoon(){
  console.log('Query password expired soon');
  let dateInit = new Date();
  let dateEnd = new Date();
  dateInit.setDate(dateInit.getDate()-85);
  dateEnd.setDate(dateEnd.getDate()-80);
  connection.query({
    sql: 'SELECT principalName,givenName,lastChangePassword FROM ?? WHERE lastChangePassword BETWEEN ? AND ? ORDER BY lastChangePassword ASC',
    values: [MysqlConfig.table,dateInit.toISOString().split('T')[0],dateEnd.toISOString().split('T')[0]]
  }, (error, result, field) => {
    if (error) {
      return error;
    }else{
      let url = 'https://prod-191.westus.logic.azure.com:443/workflows/9b3d59e1970649dbb7837a4bf9cec82a/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=fmZB9GBfno7cK9IYFZlDMPg-oUN_P9vjInX6AG9UHrc';
      let data = JSON.stringify(result);
      sendtoPowerAutomate(url,data);
    }
  });
}

function getPasswordExpiredVerySoon(){
  console.log('Query password expired very soon');
  let dateInit = new Date();
  let dateEnd = new Date();
  dateInit.setDate(dateInit.getDate()-90);
  dateEnd.setDate(dateEnd.getDate()-85);
  connection.query({
    sql: 'SELECT principalName,givenName,lastChangePassword FROM ?? WHERE lastChangePassword BETWEEN ? AND ? ORDER BY lastChangePassword ASC',
    values: [MysqlConfig.table,dateInit.toISOString().split('T')[0],dateEnd.toISOString().split('T')[0]]
  }, (error, result, field) => {
    if (error) {
      return error;
    }else{
      let url = 'https://prod-38.westus.logic.azure.com:443/workflows/7c4478c95ce3407380101f182086324a/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=ETAvZ_0d7lxwWwoXUclnvGMYzPavG3voHCceBCSNriU';
      let data = JSON.stringify(result);
      sendtoPowerAutomate(url,data);
    }
  });
}

function getPasswordExpired(){
  console.log('Query password expired');
  let dateInit = new Date();
  dateInit.setDate(dateInit.getDate()-90);
  connection.query({
    sql: 'SELECT principalName,givenName,lastChangePassword FROM ?? WHERE lastChangePassword <= ? ORDER BY lastChangePassword ASC',
    values: [MysqlConfig.table,dateInit.toISOString().split('T')[0]]
  }, (error, result, field) => {
    if (error) {
      return error;
    }else{
      let url = 'https://prod-145.westus.logic.azure.com:443/workflows/4152880efd0044ceb8ba5c95603c1726/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=cJ94WexenaslF-3RjuZflt07sevkkSA9J2FDy83Csrw';
      let data = JSON.stringify(result);
      sendtoPowerAutomate(url,data);
    }
  });
}

function sendtoPowerAutomate(url, data){
  console.log('Sending data to Power Automate');
  let config = {
    method: 'post',
    url: url,
    headers: {
      'Content-Type': 'application/json'
    },
    data: data
  }
  Axios(config)
  .then( (response) => {
    //console.log(JSON.stringify(response.datas));
  })
  .catch( (error) => {
    console.log(error);
  });
}

function sendNotify(){
  getPasswordExpired();
  getPasswordExpireSoon();
  getPasswordExpiredVerySoon();
  disconnectMysql();
}


getConfigFromCosmos().then((graphConfi) => {
  getTokenFromGraph(graphConfi.resource).then((token) => {
    connectMysql();
    truncateMysql();
    let configPassword = {
      method: 'get',
      url: 'https://graph.microsoft.com/beta/groups/debeb1cf-3e8f-4753-a9eb-4fcc6481c7da/members/microsoft.graph.user?$count=true&$top=500&$select=userPrincipalName,givenName,lastPasswordChangeDateTime&$filter=accountEnabled eq true and onPremisesSyncEnabled eq true',
      headers: {
        'ConsistencyLevel': 'eventual', 
        'Authorization': token.data.token_type+' '+token.data.access_token
      }
    }
    getPasswords(configPassword);
  });
});