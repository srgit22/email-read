const axios = require('axios');
var fileController = require('./fileController.js');
var db = require('./db.js');
var vp = require('./vendorProcess.js');
var helper = require('./helper.js');

var vendor = 'GrubHub.com';
var vendor = 'Swiggy';
var StoreCode = 135;

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
		"StoreCode": 103
	},
	"OrderStatus": 3,
	"OrderType": 2,
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


var Order = {
  process:function(vendor,StoreCode){
    vp.getData(vendor).then((data)=>{
      console.log(data);
      if(data.status){
        console.log('email found');
        order_data['CustomerDetails']={
          "Address": [
                  {street:data.customer.city},
                  {city:data.customer.city},
                  {zipcode:data.customer.city},
                  {country:data.customer.city}
          ],
          "DOB": "",
          "EmailID": null,
          "FirstName": data.customer.name,
          "LastName": '',
          "LoyaltyPoint": 0,
          "Mobile": '9999999999',
          "RedeemLoyaltyPoint": 0
        }
        order_data['PaymentTrans'] = {
          "DeliveryCharges": data.order.delivery,
          "Discount": 0,
          "DiscountAmount": 0,
          "PackagingCharges": 0,
          "ServiceTax": 0,
          "SplitTransactions": [],
          "StoreCode": 103,
          "SubTotal": data.order.subtotal,
          "Tip": data.order.tip,
          "TipAmount": 0,
          "TotalAmount": data.order.total,
          "TotalTaxAmount": data.order.tip
        }

        // order_data['OrderBooking'].StoreCode = StoreCode;
        order_data['subTotal'] = data.order.subtotal;
        order_data['taxAmount'] = data.order.tax;
        order_data['total'] = data.order.total;

        console.log('-->');
        console.log(order_data);

        db.searchProduct(data.products).then((products)=>{
          if(0){
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
            order_data['ItemDetails']=data.products.map((obj)=>{
  
              return{
              "calculated_tax": "0.00",
              "categoryId":'5cdf941c5d1b606dd110d595',
              "isCartConfirmItem": true,
              "IsComplementory": false,
              "isConfirmItem": false,
              "isDrink": false,
              "isPrintKot": false,
              "isSelect": false,
              "IsSpoil": false,
              "isSynced": false,
              "ItemID": '5cdf941c5d1b606dd110d595',
              "ItemName": obj.name,
              "Quantity": obj.quantity,
              "Price": obj.price,
              "ItemStatus": 1,
              "Modifiers": [],
              "Taxes": [],
              "Unit": "QTY",
              "Extras": ""
              }
          });
          
        }

        order_data['PaymentTrans']['StoreCode'] = StoreCode;
        order_data['OrderBooking']['StoreCode'] = StoreCode;

          // if(fileController.checkOrderId())
          if(order_data['PaymentTrans']['StoreCode']==103 && order_data['OrderBooking']['StoreCode'] ==103){
            console.log('-->store-code');
            console.log(order_data['OrderBooking']['StoreCode'])
            Order.placeOrder(order_data);
          }
          else
          {
            console.log('reject order');
          }
        });
      }
      else{
        console.log('Order data not found on email or Email not found');
      }
    }).catch((err)=>{
      console.log('-->error');
      console.log(err);
    });
  },
  placeOrder:function(data){

    // var url = 'http://104.211.49.150:6060/api/placeOrder';
    var url = 'http://184.72.111.178:6060/api/placeOrder';

      axios.post(url, data)
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
  }
}


module.exports = Order;


// var order_data = {
//   "OrderBy": "",
//   "SplitBillType": 1,
//   "InvoiceNo": 0,
//   "SplitBillTypeCount": 0,
//   "Coupons": [{
//    "CustomerMob": "",
//    "CouponCode": "",
//    "type": "",
//    "Discount": ""
//   }],
//   "CustomerDetails": {
//    "Address": [],
//    "DOB": "",
//    "EmailID": null,
//    "FirstName": 'Read Email test',
//    "LastName": 'Read Email test',
//    "LoyaltyPoint": 0,
//    "Mobile": null,
//    "RedeemLoyaltyPoint": 0
//   },
//   "Date": "06\/21\/2019",
//   "DateTime": "2019-06-21 02:12:57",
//   "IsB2C": false,
//   "IsComplementory": false,
//   "IsKitchenPrint": false,
//   "IsSpoil": false,
//   "IsSync": false,
//   "ItemDetails": [{
//    "calculated_tax": "0.149",
//    "categoryId": "5ca864e3f674bc3b65712b62",
//    "isCartConfirmItem": true,
//    "IsComplementory": false,
//    "isConfirmItem": false,
//    "isDrink": false,
//    "isPrintKot": false,
//    "isSelect": false,
//    "IsSpoil": false,
//    "isSynced": false,
//    "ItemID": "5ca864e3f674bc3b65712b62",
//    "ItemName": "Fountain Soda",
//    "Quantity": 1,
//    "Price": "1.49",
//    "ItemStatus": 1,
//    "Modifiers": [],
//    "Taxes": [],
//    "Unit": "QTY",
//    "Extras": ""
//   }, {
//    "calculated_tax": "0.24900000000000003",
//    "categoryId": "5cc97948f674bc1636370689",
//    "isCartConfirmItem": true,
//    "IsComplementory": false,
//    "isConfirmItem": false,
//    "isDrink": false,
//    "isPrintKot": false,
//    "isSelect": false,
//    "IsSpoil": false,
//    "isSynced": false,
//    "ItemID": "5cc97948f674bc1636370689",
//    "ItemName": "Coffee",
//    "Quantity": 1,
//    "Price": "2.49",
//    "ItemStatus": 1,
//    "Modifiers": [],
//    "Taxes": [],
//    "Unit": "QTY",
//    "Extras": ""
//   }, {
//    "calculated_tax": "0.24900000000000003",
//    "categoryId": "5cc97972f674bc163637068a",
//    "isCartConfirmItem": true,
//    "IsComplementory": false,
//    "isConfirmItem": false,
//    "isDrink": false,
//    "isPrintKot": false,
//    "isSelect": false,
//    "IsSpoil": false,
//    "isSynced": false,
//    "ItemID": "5cc97972f674bc163637068a",
//    "ItemName": "Masala Tea",
//    "Quantity": 1,
//    "Price": "2.49",
//    "ItemStatus": 1,
//    "Modifiers": [],
//    "Taxes": [],
//    "Unit": "QTY",
//    "Extras": ""
//   }],
//   "OrderBooking": {
//    "DeliveryCharges": 0,
//    "PosId": 1,
//    "StoreCode": 101
//   },
//   "OrderStatus": 3,
//   "OrderType": 1,
//   "paymentMode": 2,
//   "PaymentTrans": {
//    "DeliveryCharges": 0,
//    "Discount": 0,
//    "DiscountAmount": 0,
//    "PackagingCharges": 0,
//    "ServiceTax": 0,
//    "SplitTransactions": [],
//    "StoreCode": 101,
//    "SubTotal": 6.47,
//    "Tip": 0,
//    "TipAmount": 0,
//    "TotalAmount": 6.47,
//    "TotalTaxAmount": 0
//   },
//   "Source": 3,
//   "SpecialRequest": "",
  
//   "subTotal": 6.47,
//   "tax": 0,
//   "taxAmount": 6.47,
//   "Taxes": "",
//   "tenderAmount": "",
//   "TimeStamp": new Date().getTime(),
//   "total": 6.47,
//   "Zone": ""
//  };