var fs = require('fs');
var helper = require('./helper.js');

var data_arr=[];

function func(data) {
  data_arr.push(data);
}

function readLines(input, func) {

  return new Promise(function(resolve,reject){

    var remaining = '';

    input.on('data', function(data) {
      remaining += data;
      var index = remaining.indexOf('\n');
      while (index > -1) {
        var line = remaining.substring(0, index);
        remaining = remaining.substring(index + 1);
        func(line);
        index = remaining.indexOf('\n');
      }
    });

    input.on('end', function() {
      if (remaining.length > 0) {
        func(remaining);
      }
      // process();
      resolve(data_arr);
    });

  })
  
}


async function start(vendor){
  var input = fs.createReadStream('email_data.txt');
  var result = await readLines(input, func);
  return process(vendor);
}

function extractData(data_arr,start,stop){
    
    var record =false;
    let data = [];

    for(let line of data_arr){

        if(line.includes(start)){
            record=true;
        }
        
        if(record){
          data.push(line);
        }
        
        if(line.includes(stop)){
            record = false;
        }
    }

    return data;    
}

function process(vendor){
  return new Promise((resolve,reject)=>{

    let products = [],product_data,order_data,customer_data;
    let order,customer,order_id_arr;
    let obj;
  
    if(vendor=='GrubHub.com'){
      
      product_data = extractData(data_arr,'| Qty | Item | Price |','Prepaid. DO NOT charge');
      order_data = extractData(data_arr,'| Subtotal |','| Total |');
      order_id_arr = extractData(data_arr,'Order #','Order #');
      customer_data = extractData(data_arr,'| Deliver to: | Deliver |','| Special Instructions |');
      console.log(data_arr);
    }
    if(vendor=='swiggy'){

    }

    // let store_data = extractData(data_arr,'Customer Service: 877-798-4141','| Deliver to: | Deliver |');
    // console.log(store_data);

    products = getProduct(product_data);
    customer = getCustomer(customer_data);
    order = getOrder(order_data,order_id_arr);
 
      if(products.length>0 && !helper.checkEmpty(customer) && !helper.checkEmpty(order)){
        console.log({
          status:1,
          products:products,
          customer:customer,
          order:order
        });
        resolve({
          status:1,
          products:products,
          customer:customer,
          order:order
        });
      }
      else
      {
        console.log({
          status:0
        });

        console.log(helper.checkEmpty(customer));
        console.log(products.length>0 && customer.length>0 && order.length>0);
        reject({
          status:0
        });
      }
    });
}

function getProduct(product_data){
  let products = [];
  console.log(product_data);
  for(let col of product_data){
    let cols = col.split('|');    
    if(cols[3])
      if(cols[3].includes('$')){
        obj = {
          name:cols[2],
          price:cols[3].match(/\d+/g)[0],
          quantity:cols[1]
        }
        products.push(obj);
      }
  }
  return products;
}

function getCustomer(customer_data){
  let customer = {};
  customer['name'] = (customer_data[1]?customer_data[1].split('|')[1].trim():null);
  customer['city'] = (customer_data[3]?customer_data[3].split('|')[1].trim():null);
  return customer;
}

function getOrder(order_data,order_id_arr){
  console.log(order_id_arr);
  let order = {};
  order['subtotal'] = (order_data[0]?order_data[0].split('|')[2].match(/\d+/g)[0]:null);
  order['delivery'] = (order_data[1]?order_data[1].split('|')[2].match(/\d+/g)[0]:null);
  order['tax'] = (order_data[2]?order_data[2].split('|')[2].match(/\d+/g)[0]:null);
  order['tip'] = (order_data[3]?order_data[3].split('|')[2].match(/\d+/g)[0]:null);
  order['total'] = (order_data[4]?order_data[4].split('|')[2].match(/\d+/g)[0]:null);
  order['order_id'] = (order_id_arr.length?order_id_arr[0].match(/\d+/g):null)[0];

  return order;
}

function readJson(file){
  return fs.readFileSync('Order_Ids.json','utf8');
}

function writeJson(id){
  let order_ids = [1,2];
  fs.writeFileSync('Order_Ids.json', JSON.stringify(order_ids), 'utf8'); 
}

module.exports={
  getData:start,
  writeJson:writeJson,
  readJson:readJson
}