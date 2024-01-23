const MongoClient = require('mongodb').MongoClient;
var db;

const url= "mongodb://sdfd:5+dummy#^e&@193.172.122.178:27017/CR_A";
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
                
                console.log(JSON.stringify(query));
                console.log(db);
                db.collection('ItemMaster').find(query).toArray().then((data)=>{
                    console.log(data);
                    if(data)
                        resolve(data);
                })
            
            })
	    })
    }
}
