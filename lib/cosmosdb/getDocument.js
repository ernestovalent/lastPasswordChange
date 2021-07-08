const config = require('./config');
const CosmosClient = require("@azure/cosmos").CosmosClient;

const { endpoint, key} = config;
const client = new CosmosClient({ endpoint, key });

async function get(){
  const document = await client
  .database(config.databaseId)
  .container(config.containerId)
  .item(config.itemId, config.partitionKey)
  .read();
  return document;
}

module.exports = {
  get
};