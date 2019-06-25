const axios = require('axios');

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
    "CustomerDetails": {
     "Address": [],
     "DOB": "",
     "EmailID": null,
     "FirstName": 'Read Email test',
     "LastName": 'Read Email test',
     "LoyaltyPoint": 0,
     "Mobile": null,
     "RedeemLoyaltyPoint": 0
    },
    "Date": "06\/21\/2019",
    "DateTime": "2019-06-21 02:12:57",
    "IsB2C": false,
    "IsComplementory": false,
    "IsKitchenPrint": false,
    "IsSpoil": false,
    "IsSync": false,
    "ItemDetails": [{
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
     "ItemName": "Fountain Soda",
     "Quantity": 1,
     "Price": "1.49",
     "ItemStatus": 1,
     "Modifiers": [],
     "Taxes": [],
     "Unit": "QTY",
     "Extras": ""
    }, {
     "calculated_tax": "0.24900000000000003",
     "categoryId": "5cc97948f674bc1636370689",
     "isCartConfirmItem": true,
     "IsComplementory": false,
     "isConfirmItem": false,
     "isDrink": false,
     "isPrintKot": false,
     "isSelect": false,
     "IsSpoil": false,
     "isSynced": false,
     "ItemID": "5cc97948f674bc1636370689",
     "ItemName": "Coffee",
     "Quantity": 1,
     "Price": "2.49",
     "ItemStatus": 1,
     "Modifiers": [],
     "Taxes": [],
     "Unit": "QTY",
     "Extras": ""
    }, {
     "calculated_tax": "0.24900000000000003",
     "categoryId": "5cc97972f674bc163637068a",
     "isCartConfirmItem": true,
     "IsComplementory": false,
     "isConfirmItem": false,
     "isDrink": false,
     "isPrintKot": false,
     "isSelect": false,
     "IsSpoil": false,
     "isSynced": false,
     "ItemID": "5cc97972f674bc163637068a",
     "ItemName": "Masala Tea",
     "Quantity": 1,
     "Price": "2.49",
     "ItemStatus": 1,
     "Modifiers": [],
     "Taxes": [],
     "Unit": "QTY",
     "Extras": ""
    }],
    "OrderBooking": {
     "DeliveryCharges": 0,
     "PosId": 1,
     "StoreCode": 101
    },
    "OrderStatus": 3,
    "OrderType": 1,
    "paymentMode": 2,
    "PaymentTrans": {
     "DeliveryCharges": 0,
     "Discount": 0,
     "DiscountAmount": 0,
     "PackagingCharges": 0,
     "ServiceTax": 0,
     "SplitTransactions": [],
     "StoreCode": 101,
     "SubTotal": 6.47,
     "Tip": 0,
     "TipAmount": 0,
     "TotalAmount": 6.47,
     "TotalTaxAmount": 0
    },
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

module.exports={
    placeOrder:function(data){
        axios.post('http://184.72.111.178:6060/api/placeOrder', data)
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          });
    }
}