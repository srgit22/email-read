// var fs = require('fs');
 
// fs.readFile('swiggy_data.txt', 'utf8', function(err, contents) {
//     //console.log(contents);
//     console.log(contents.match(| Qty | Item | Price |/gi));
// });

// var findInFiles = require('find-in-files');

// findInFiles.find("Braised Chili Tofu", '.', '.txt$')
//     .then(function(results) {

//         console.log(results);

//         for (var result in results) {
//             var res = results[result];
//             console.log(
//                 'found "' + res.matches[0] + '" ' + res.count
//                 + ' times in "' + result + '"'
//             );
//         }
//     });




// d? In any case if you would like to process the file one line at a time you can also try something like this:

var fs = require('fs');
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




async function start(){
  var input = fs.createReadStream('email_data.txt');
  var result = await readLines(input, func);
  return process(result);
  console.log(result);
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

function process(){
  return new Promise((resolve,reject)=>{
    let products = [];
    let order,customer;
    let obj;
    
      let product_data = extractData(data_arr,'| Qty | Item | Price |','Prepaid. DO NOT charge');
      let order_data = extractData(data_arr,'| Subtotal |','| Total |');
      let customer_data = extractData(data_arr,'| Deliver to: | Deliver |','| Special Instructions |');
     
      
      // let store_data = extractData(data_arr,'Customer Service: 877-798-4141','| Deliver to: | Deliver |');
      // console.log(store_data);

      products = getProduct(product_data);
      customer = getCustomer(customer_data);
      order = getOrder(order_data);

      if(products.length){
        resolve({
          products:products,
          customer:customer,
          order:order
        });
      }
      else
      {
        reject('no data');
      }
      // console.log(order_data);   
    });
}

function getProduct(product_data){
  let products = [];
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
  console.log(products);
}

function getCustomer(customer_data){
  let customer = {};
  customer['name'] = customer_data[1].split('|')[1].trim();
  customer['city'] = customer_data[3].split('|')[1].trim();
  return customer;
}

function getOrder(order_data){
  let order = {};
  order['subtotal'] = order_data[0].split('|')[2].match(/\d+/g)[0];
  order['delivery'] = order_data[1].split('|')[2].match(/\d+/g)[0];
  order['tax'] = order_data[2].split('|')[2].match(/\d+/g)[0];
  order['tip'] = order_data[3].split('|')[2].match(/\d+/g)[0];
  order['total'] = order_data[4].split('|')[2].match(/\d+/g)[0];
  return order;
}

module.exports={
  getData:start
}