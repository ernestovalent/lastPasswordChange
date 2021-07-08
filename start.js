const db = require('./lib/cosmosdb/getDocument');

async function getGraphConfig(){
  const promise = new Promise( (resolve, reject) => {
    let getDocument = db.get();
    resolve(getDocument);
  });
  return promise;
}


getGraphConfig()
.then(document => console.log(document.resource));

