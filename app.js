var db = require('./db.js');

var helper = require('./helper.js');
var email_server = require('./email_server.js');
var fileController = require('./fileController.js');
var order = require('./place_order.js');

var vendor = 'GrubHub.com';
var StoreCode = 134;

fileController.writeJson();
console.log(fileController.readJson());

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
	"Date":helper.getDate(),
	"DateTime":helper.getDateTime(),
	"IsB2C": false,
	"IsComplementory": false,
	"IsKitchenPrint": false,
	"IsSpoil": false,
	"IsSync": false,
	"OrderBooking": {
		"DeliveryCharges": 0,
		"PosId": 1,
		"StoreCode": StoreCode
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

email_server.checkEmail(vendor).then(function(){
	fileController.getData(vendor).then((data)=>{
		console.log(data);
		if(data.status){
			console.log('email found');
			order_data['CustomerDetails']={
				"Address": [
					{city:data.customer.city}
				],
				"DOB": "",
				"EmailID": null,
				"FirstName": data.customer.name,
				"LastName": '',
				"LoyaltyPoint": 0,
				"Mobile": null,
				"RedeemLoyaltyPoint": 0
			}
			order_data['PaymentTrans'] = {
				"DeliveryCharges": data.order.delivery,
				"Discount": 0,
				"DiscountAmount": 0,
				"PackagingCharges": 0,
				"ServiceTax": 0,
				"SplitTransactions": [],
				"StoreCode": 134,
				"SubTotal": data.order.subtotal,
				"Tip": data.order.tip,
				"TipAmount": 0,
				"TotalAmount": data.order.total,
				"TotalTaxAmount": data.order.tip
			}
			order_data['OrderBooking']['StoreCode'] = StoreCode;
			order_data['subTotal'] = data.order.subtotal;
			order_data['taxAmount'] = data.order.tax;
			order_data['total'] = data.order.total;

			db.searchProduct(data.products).then((products)=>{
				if(products.length){
					order_data['ItemDetails']=products.map((obj)=>{

						return{
						"calculated_tax": "0.149",
						"categoryId":obj.CategoryID,
						"isCartConfirmItem": true,
						"IsComplementory": false,
						"isConfirmItem": false,
						"isDrink": false,
						"isPrintKot": false,
						"isSelect": false,
						"IsSpoil": false,
						"isSynced": false,
						"ItemID": obj._id,
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
				// if(fileController.checkOrderId())
				order.placeOrder(order_data);
			});
		}
		else{
			console.log('Order data not found on email or Email not found');
		}
	}).catch((err)=>{
		console.log(err);
	});
})


 
  
//db.getCollection('ItemMaster').find({ItemName:'Aloo Paratha',StoreCode:{$elemMatch:{$eq:121}}}) 
 




