var fs = require('fs');
var helper = require('./helper.js');
var vendors = require('./vendors.js');
var fc = require('./fileController.js');
 
function getData(vendor){
  return new Promise((resolve,reject)=>{

    var products = [],product_data,order_data,customer_data;
    var order,customer,order_id_arr;
    var obj;

//   console.log('--->');
//   console.log(vendor);

    if(vendor=='grubhub'){
        fc.convertToArray('email_data.txt').then((data_arr)=>{

            product_data = helper.extractData(data_arr,'| Qty | Item | Price |','Prepaid. DO NOT charge');
            order_data = helper.extractData(data_arr,'| Subtotal |','| Total |');
            order_id_arr = helper.extractData(data_arr,'Order #','Order #');
            customer_data = helper.extractData(data_arr,'| Deliver to: | Deliver |','| Special Instructions |');
            console.log(data_arr);

            
            products = vendors.getProduct(vendor,product_data);
            customer = vendors.getCustomer(vendor,customer_data);
            order = vendors.getOrder(vendor,order_data,order_id_arr);

            if(products.length>0 && !helper.checkEmpty(customer) && !helper.checkEmpty(order)){
                resolve({
                    status:1,
                    products:products,
                    customer:customer,
                    order:order
                });
            }
            else
            {
                reject({
                    status:0
                });
            }
                
        });
    }
    if(vendor=='swiggy'){
        fc.convertToArray('email_data.txt').then((data_arr)=>{
            let file_data = helper.extractData(data_arr,'load?token','load?token')[0].split('"')[0];
            // reject(file_data.split('token=')[1]);
            // console.log(vendors.getSwiggyFile(file_data.split('token=3D')[1]));
            //console.log();
            // .then((data)=>{
                products = vendors.getProduct(vendor,file_data.split('token=3D')[1]);   
                customer = vendors.getCustomer(vendor,file_data.split('token=3D')[1]);   
                order = vendors.getOrder(vendor,file_data.split('token=3D')[1]);   
        

                Promise.all([products, customer, order]).then(function(values) {
                    console.log('done swiggy data extracts');
                 console.log(values);

                    if(values[0].length>0 && !helper.checkEmpty(values[1]) && !helper.checkEmpty(values[2])){
                        resolve({
                            status:1,
                            products:values[0],
                            customer:values[1],
                            order:values[2]
                        });
                    }
                    else
                    {
                        reject({
                            status:0
                        });
                    }

                    
                  });

                
                
        })
    }

    // let store_data = extractData(data_arr,'Customer Service: 877-798-4141','| Deliver to: | Deliver |');
    // console.log(store_data);

    });
}


module.exports={
    getData:getData
}