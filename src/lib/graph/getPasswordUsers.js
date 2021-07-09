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
      console.log('Done');
    })
    .catch(function (error) {
      reject(error);
      console.log('Error');
    });
  });
  return promise;
}

async function getPasswordUser(token){
  console.log('trying get users password from graph');
  let promise = new Promise( (resolve, reject) => {

    let config = {
      method: 'get',
      url: 'https://graph.microsoft.com/beta/users?$count=true&$top=5&$select=userPrincipalName,givenName,lastPasswordChangeDateTime&$filter=accountEnabled eq true and onPremisesSyncEnabled eq true',
      headers: { 
        'ConsistencyLevel': 'eventual', 
        'Authorization': token
      }
    };
    
    axios(config)
    .then(function (response) {
      resolve(response.data.value);
      console.log('Done');
    })
    .catch(function (error) {
      reject(error);
      console.log('Error');
    });
    
  });
  return promise;
}

async function createArray(userDataFromGraph){
  console.log(('trying created array from user data'));
  let promise = new Promise( (resolve, reject) => {

    let newArray = new Array();
    let date = new Date();

    userDataFromGraph.forEach((element) => {
      newArray.push([element.userPrincipalName, element.givenName, element.lastPasswordChangeDateTime, date.toISOString()])
    });
    resolve(newArray);
    console.log('Done');
  });
  return promise;
}

async function getAllData(configFromCosmos){
  let promise = new Promise( (resolve, reject) => {
    getToken(configFromCosmos).then((token) => {
      getPasswordUser(token).then((users) => {
        createArray(users).then((data) => {
          resolve(data);
        });
      });
    });
  });
  return promise;
}

module.exports = {getAllData};