const MongoClient = require('mongodb').MongoClient;
var db;

//dev
// const url= "mongodb://CR_A:5+6Qbb6f9CEE#^e&@104.211.49.150:27017/CR_A";
const url= "mongodb://CR_A:5+6Qbb6f9CEE#^e&@184.72.111.178:27017/CR_A";
const dbName = 'CR_A';

module.exports = {
    searchProduct:function (product_data){
        return new Promise((resolve,reject)=>{
            MongoClient.connect(url).then(function(db){

                let item_query = product_data.map((obj)=>{
                    return {ItemName:obj.name.trim()}
                    }) 
            
                let or_query = {$or:item_query }
                // let query = {$and:[or_query,{StoreCode:{$elemMatch:{$eq:121}}}]};
                let query = or_query
                
                db.collection('ItemMaster').find(query).toArray().then((data)=>{
                    console.log(data);
                    if(data)
                        resolve(data);
                })
            
            })
	    })
    }
}

// const MongoClient = require('mongodb').MongoClient;
// var db;
// const url= "mongodb://CR_A:5+6Qbb6f9CEE#^e&@184.72.111.178:27017/CR_A";

// Database Name
// const dbName = 'CR_A';


// async function getDb(){
//     return new Promise((resolve,reject)=>{

//         MongoClient.connect(url, function(err, client) {

//         console.log("Connected successfully to server");
        
//         //db.getCollection('ItemMaster').find({ItemName:'Aloo Paratha',StoreCode:{$elemMatch:{$eq:121}}}) 

//         db = client.db(dbName);        
//         resolve(db);
//         client.close();

//         })
//     })
// }


// module.exports = {
//     getDb:getDb
// }


// module.exports = {
//     databaseConnection:function(mongoose){        
//             //var url= "mongodb://localhost:27017/Mcd";
//             var url= "mongodb://cyntraAdmin:Pass123%23@localhost:27017/Mcd";
//             // configuration ===============================================================
            
//             mongoose.connect(url);
//             console.log(mongoose.connection.readyState);
//             // CONNECTION EVENTS
//             mongoose.connection.on('connecting', function () {
//               console.log('Mongoose default connection open to ' +url);
//             });
//             // When successfully connected
//             mongoose.connection.on('connected', function () {
//               console.log('Mongoose default connected open to ' + url);
//             });

//             // If the connection throws an error
//             mongoose.connection.on('error',function (err) {
//               console.log('Mongoose default connection error: ' + err);
//             });
//             // When the connection is disconnected
//             mongoose.connection.on('disconnected', function () {
//               console.log('Mongoose default connection disconnected');
//             });
            
//     }

// };
