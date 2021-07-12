const axios = require('axios').default;
const qs = require('qs');

async function getToken(cosmosConfig){
  console.log('Trying get toke from graph');
  let promise = new Promise( (resolve, reject) => {

    let data = qs.stringify({
      'grant_type': 'password',
      'client_id': cosmosConfig.clientId,
      'client_secret': cosmosConfig.clientSecret,
      'scope': 'https://graph.microsoft.com/.default',
      'userName': cosmosConfig.userName,
      'password': cosmosConfig.userPassword
    });
    let config = {
      method: 'post',
      url: 'https://login.microsoftonline.com/5539201f-944b-4a7f-a1b7-d6e298fbe803/oauth2/v2.0/token',
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data : data
    };
    
    axios(config)
    .then(function (response) {
      resolve(response.data.token_type+' '+response.data.access_token);
      console.log('Done token');
    })
    .catch(function (error) {
      reject(error);
      console.log('Error token');
    });
  });
  return promise;
}

async function getPasswordBlock(config){
  console.log('trying get password from a block users grah');
  let promise = new Promise( (resolve, reject) => {
    axios(config)
    .then((response) => {
      resolve(response);
      console.log('Done block');
    }).catch( (error) => {
      reject(error);
      console.log('Error block');
    });
  });
  return promise;
}

function getAllPasswordUser(token){
  console.log('trying get all users password from graph');

  let config = {
    method: 'get',
    url: 'https://graph.microsoft.com/beta/users?$count=true&$select=userPrincipalName,givenName,lastPasswordChangeDateTime&$filter=accountEnabled eq true and onPremisesSyncEnabled eq true',
    headers: {
      'ConsistencyLevel': 'eventual', 
      'Authorization': token
    }
  };

  let data = new Array();
  let date = new Date();

  return getPasswordBlock(config)
    .then((response) => {

      let users = response.data.value;

      users.forEach(e => {
        data.push([e.userPrincipalName,e.givenName,e.lastPasswordChangeDateTime,date.toISOString()]);
      });

      if(response.data['@odata.nextLink']){
        return 
      }else{
        resolve(data);
        console.log('Done all');
      }
      
      
    })
    .catch((error) => {
      reject(error);
      console.log('Error all');
    });
}

async function getAllData(configFromCosmos){
  let promise = new Promise( (resolve, reject) => {
    getToken(configFromCosmos)
    .then((token) => {
      getAllPasswordUser(token)
      .then((passwordData) => resolve(passwordData));
    })
    .catch((error) => {
      reject(error);
      console.log(error);
    });
  });
  return promise;
}

getAllData({
  "clientId": "c8708f49-d13b-43bf-9236-338816c27ede",
  "clientSecret": "9w_.r0~wGkpr5QVyE0Ny.fs2tgsw-vfLwG",
  "userName": "xcaid@xcaret.com",
  "userPassword": "Xbot@2021"
}).then((response) => {
  //console.log(response);
});

//module.exports = {getAllData};