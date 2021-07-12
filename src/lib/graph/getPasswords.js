const axios = require('axios').default;
const qs = require('qs');

function getToken(cosmosConfig){
  console.log('trying get token from graph');
  
  let cosmos = qs.stringify({
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
    data : cosmos
  };

  return axios(config).then( (response) => {
    console.log('Done token');
    return(response.data.token_type+' '+response.data.access_token);
  }).catch( (error) => {
    return(error);
  });

}

function nextBlock(config){
  console.log('get next Block');
  let newconfig = config;
  return axios(newconfig).then( (response) => {
    console.log('Done block');
    if(response.data['@odata.nextLink']){
      newconfig.url = response.data['@odata.nextLink'];
      nextBlock(newconfig);
    }else{
      return(response.data.value);
    }
    console.log(newconfig.url);
  }).catch( (error) => {
    return(error);
  });
}


function getAllPasswords(token){
  console.log('get all passwors main');
  let config = {
    method: 'get',
    url: 'https://graph.microsoft.com/beta/users?$count=true&$select=userPrincipalName,givenName,lastPasswordChangeDateTime&$filter=accountEnabled eq true and onPremisesSyncEnabled eq true',
    headers: {
      'ConsistencyLevel': 'eventual', 
      'Authorization': token
    }
  }
  return nextBlock(config).then( (response) => {
    console.log('Proceso terminado: ');
  }).catch((error) => {
    console.log(error);
  });
}

function main(){
  getToken({
    "clientId": "c8708f49-d13b-43bf-9236-338816c27ede",
    "clientSecret": "9w_.r0~wGkpr5QVyE0Ny.fs2tgsw-vfLwG",
    "userName": "xcaid@xcaret.com",
    "userPassword": "Xbot@2021"
  }).then((token) => {
    getAllPasswords(token).then();
  });
  
}

main();