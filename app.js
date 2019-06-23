const MongoClient = require('mongodb').MongoClient;
var db;
const url= "mongodb://CR_A:5+6Qbb6f9CEE#^e&@184.72.111.178:27017/CR_A";
const dbName = 'CR_A';
var email_server = require('./email_server.js');
var readFile = require('./readFile.js');
var order = require('./place_order.js');
let order_data = {};
// order.placeOrder();
// var mongo = await require('./mongo.js').getDb();


email_server.checkEmail().then(function(){
	readFile.getData().then((data)=>{
		console.log(data);
		searchProduct(data.products);
	});
})
// console.log(mongo);
// mongo.getDb().then((db)=>{
// db=db;
// console.log(db);
// })

function searchProduct(product_data){
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
			})
		
		})
}

// Connection URL
// const url = 'mongodb://104.211.49.150:27017';
// const url= "mongodb://CR_A:5+6Qbb6f9CEE#^e&@104.211.49.150:27017/CR_A";
 
  
  //db.getCollection('ItemMaster').find({ItemName:'Aloo Paratha',StoreCode:{$elemMatch:{$eq:121}}}) 
 
// app.listen(3000,function(){ 
// 	console.log('listen');
// })




