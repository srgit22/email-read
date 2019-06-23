const MongoClient = require('mongodb').MongoClient;
var db;
const url= "mongodb://CR_A:5+6Qbb6f9CEE#^e&@184.72.111.178:27017/CR_A";

// Database Name
const dbName = 'CR_A';


async function getDb(){
    return new Promise((resolve,reject)=>{

        MongoClient.connect(url, function(err, client) {

        console.log("Connected successfully to server");
        
        //db.getCollection('ItemMaster').find({ItemName:'Aloo Paratha',StoreCode:{$elemMatch:{$eq:121}}}) 

        db = client.db(dbName);        
        resolve(db);
        client.close();

        })
    })
}


module.exports = {
    getDb:getDb
}