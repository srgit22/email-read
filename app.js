const MongoClient = require('mongodb').MongoClient;
var db;
const url= "mongodb://CR_A:5+6Qbb6f9CEE#^e&@184.72.111.178:27017/CR_A";
const dbName = 'CR_A';
var email_server = require('./email_server.js');
var readFile = require('./readFile.js');
var order = require('./place_order.js');

 var order_data = {
    "OrderBy": "",
    "SplitBillType": 1,
    "InvoiceNo": 0,
    "SplitBillTypeCount": 0,
    "Coupons": [{
     "CustomerMob": "",
     "CouponCode": "",
     "type": "",
     "Discount": ""
    }],
    "Date": "06\/21\/2019",
    "DateTime": "2019-06-21 02:12:57",
    "IsB2C": false,
    "IsComplementory": false,
    "IsKitchenPrint": false,
    "IsSpoil": false,
    "IsSync": false,
    "OrderBooking": {
     "DeliveryCharges": 0,
     "PosId": 1,
     "StoreCode": 101
    },
    "OrderStatus": 3,
    "OrderType": 1,
    "paymentMode": 2,
    "Source": 3,
    "SpecialRequest": "",   
    "subTotal": 6.47,
    "tax": 0,
    "taxAmount": 6.47,
    "Taxes": "",
    "tenderAmount": "",
    "TimeStamp": new Date().getTime(),
    "total": 6.47,
    "Zone": ""
   };

// order.placeOrder();
// var mongo = await require('./mongo.js').getDb();


email_server.checkEmail().then(function(){
	readFile.getData().then((data)=>{
		console.log(data);
		
		order_data['CustomerDetails']={
			"Address": [data.customer.city],
			"DOB": "",
			"EmailID": null,
			"FirstName": data.customer.name,
			"LastName": '',
			"LoyaltyPoint": 0,
			"Mobile": null,
			"RedeemLoyaltyPoint": 0
		   }

		searchProduct(data.products).then((products)=>{

			if(products.length){

				order_data['ItemDetails']=products.map((obj)=>{

					return{
					"calculated_tax": "0.149",
					"categoryId": "5ca864e3f674bc3b65712b62",
					"isCartConfirmItem": true,
					"IsComplementory": false,
					"isConfirmItem": false,
					"isDrink": false,
					"isPrintKot": false,
					"isSelect": false,
					"IsSpoil": false,
					"isSynced": false,
					"ItemID": "5ca864e3f674bc3b65712b62",
					"ItemName": obj.ItemName,
					"Quantity": 1,
					"Price": obj.Price,
					"ItemStatus": 1,
					"Modifiers": [],
					"Taxes": [],
					"Unit": "QTY",
					"Extras": ""
					}
				})
			}else{
				console.log('products not found in store database');
			}

			console.log(JSON.stringify(order_data));
		});

		order_data['PaymentTrans'] = {
			"DeliveryCharges": data.order.delivery,
			"Discount": 0,
			"DiscountAmount": 0,
			"PackagingCharges": 0,
			"ServiceTax": 0,
			"SplitTransactions": [],
			"StoreCode": 121,
			"SubTotal": data.order.subtotal,
			"Tip": data.order.tip,
			"TipAmount": 0,
			"TotalAmount": data.order.total,
			"TotalTaxAmount": data.order.tip
		   }

		   order_data['OrderBooking']['StoreCode'] = 121;

		   order_data['subTotal'] = data.order.subtotal;
		   order_data['taxAmount'] = data.order.tax;
		   order_data['total'] = data.order.total;

	});
})
// console.log(mongo);
// mongo.getDb().then((db)=>{
// db=db;
// console.log(db);
// })

function searchProduct(product_data){
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

// Connection URL
// const url = 'mongodb://104.211.49.150:27017';
// const url= "mongodb://CR_A:5+6Qbb6f9CEE#^e&@104.211.49.150:27017/CR_A";
 
  
  //db.getCollection('ItemMaster').find({ItemName:'Aloo Paratha',StoreCode:{$elemMatch:{$eq:121}}}) 
 
// app.listen(3000,function(){ 
// 	console.log('listen');
// })




