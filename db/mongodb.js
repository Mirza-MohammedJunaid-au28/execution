const {MongoClient} = require('mongodb');
const config = require('../config/config.json');
const url = config.url;
const connection = new MongoClient(url);

async function dbConnection(){
    let result = await connection.connect();
    let db = result.db(config.db)
    return db.collection(config.collection)
}

module.exports = {dbConnection}