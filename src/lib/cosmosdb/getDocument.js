const config = require('./config');
const CosmosClient = require("@azure/cosmos").CosmosClient;

const { endpoint, key} = config;
const client = new CosmosClient({ endpoint, key });

async function getDocument(){
  console.log('Trying get graphConfig from CosmosBD');
  let promise = new Promise( (resolve, reject) => {
    try{
      let document = client
      .database(config.databaseId)
      .container(config.containerId)
      .item(config.itemId, config.partitionKey)
      .read();
      resolve(document);
      console.log('Done');
    } catch (error){
      reject(error);
      console.log('Error');
    }
  });
  return promise;
}

module.exports = {
  getDocument
};