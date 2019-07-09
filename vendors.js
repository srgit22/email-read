const axios = require('axios');
const pdf = require('pdf-parse');
const helper = require('./helper');
const fc = require('./fileController');
var swiggyFileLink='https://www.swiggy.com/invoice/download?token=';
const fs = require('fs');
// var currency = '$';

var grubhub ={
    getProduct:function(product_data,pattern){
        let products = [];
        console.log(product_data);
        let currency = '$';
        if(pattern=='1'){
            for(let col of product_data){
                let cols = col.split('|');    
                if(cols[3])
                    if(cols[3].includes(currency)){
                    obj = {
                        name:cols[2],
                        price:cols[3].match(/\d+/g)[0],
                        quantity:cols[1]
                    }
                
                    products.push(obj);
                }
            }
        }
        else if(pattern=='2'){
            for(let i=0;i<product_data.length;i++){    
            console.log(product_data[i]);
                if(product_data[i].includes(currency)){
                    let cols = product_data[i].split(currency);
                    obj = {
                        name:cols[0].replace(/[0-9]/g, ''),
                        price:cols[1].match(/\d+/g)[0],
                        quantity:cols[1].match(/\d+/g)[0]
                    }

                products.push(obj);
                }
            }
        }
        return products;
    },
    getCustomer:function (customer_data,pattern){
        let customer = {};

        if(pattern=='1'){
                customer['name'] = (customer_data[1]?customer_data[1].split('|')[1].trim():null);
                customer['street'] = '';
                customer['city'] = (customer_data[3]?customer_data[3].split('|')[1].trim():null);
                customer['mobile_no'] = '9999999999';
        }
        else if(pattern=='2'){
            customer['name'] = (customer_data[1]?customer_data[1].split(',')[0].trim():null);
            customer['street'] = (customer_data[2]?customer_data[3].split('PM')[0].trim():null);
            customer['city'] = (customer_data[3]?customer_data[3].split(',')[0].trim():null);
            customer['mobile_no'] = (customer_data[customer_data.length-3]?customer_data[customer_data.length-3].trim():'9999999999');
        }
        
        return customer;
    },
    getOrder:function (order_data,pattern){
        // console.log(order_id_arr);
        let order = {};
        
        if(pattern=='1'){
            order['subtotal'] = (order_data[0]?order_data[0].split('|')[2].match(/\d+/g)[0]:null);
            order['delivery'] = (order_data[1]?order_data[1].split('|')[2].match(/\d+/g)[0]:null);
            order['tax'] = (order_data[2]?order_data[2].split('|')[2].match(/\d+/g)[0]:null);
            order['tip'] = (order_data[3]?order_data[3].split('|')[2].match(/\d+/g)[0]:null);
            order['total'] = (order_data[4]?order_data[4].split('|')[2].match(/\d+/g)[0]:null);
            // order['order_id'] = (order_id_arr.length?order_id_arr[0].match(/\d+/g):null)[0];
        }
        else if(pattern=='2'){
            let currency = '$';
            order['subtotal'] = (order_data[0]?order_data[0].split(currency)[1].match(/\d+/g)[0]:null);
            order['delivery'] = (order_data[1]?order_data[1].split(currency)[1].match(/\d+/g)[0]:null);
            order['tax'] = (order_data[2]?order_data[2].split(currency)[1].match(/\d+/g)[0]:null);
            order['tip'] = (order_data[3]?order_data[3].split(currency)[1].match(/\d+/g)[0]:null);
            order['total'] = (order_data[4]?order_data[4].split(currency)[1].match(/\d+/g)[0]:null);
            // order['order_id'] = (order_id_arr.length?order_id_arr[0].match(/\d+/g):null)[0];
        }
        return order;
    }
}

var swiggy ={
    getProduct:function(link){
        return vendor_obj.extractData(link).then((data)=>{
            console.log(data);
            let products = [];
            // console.log(data.product_data);
            for(let col of data.product_data){
                
                var cols;
                
                if(col.includes('₹'))
                {
                    cols = col.split('₹');    
                }
                else if(col.includes('$')){
                    
                    cols = col.split('$');
                }
                else{
                    console.log('product string dosnt contain currency');
                }
            
    
                if(cols && cols.length){
                    obj = {
                        name:cols[0].replace(/[0-9]/g,''),
                        price:cols[1].trim(),
                        quantity:cols[0].replace(/[a-zA-Z]/g,'') 
                    }
                    
                    products.push(obj);
                }
    
            }
            console.log(products);
            return products;
        })
    },
    getCustomer:function (link){
        var customer = {};
        return vendor_obj.extractData(link).then((data)=>{
            console.log(data);
            // console.log(data.product_data);
            customer['name'] = data.customer_data[1];
            customer['city'] = data.customer_data[data.customer_data.length-2].split(',')[0];
            return customer;
        })
    },
    getOrder:function (link){
        let order = {};
        let currency;
        return vendor_obj.extractData(link).then((data)=>{
            
            if(data.order_data[0].includes('₹'))
            {
                currency = '₹';
            }
            else if(col.includes('$')){
                currency = '$';
            }
            else{
                console.log('product string dosnt contain currency');
            }
        
            order['subtotal'] = (data.order_data[0].split(currency)[1]);
            order['delivery'] = (data.order_data[0].split(currency)[1]);
            order['total'] = (data.order_data[0].split(currency)[1]);
            // order['order_id'] = (order_id_arr.length?order_id_arr[0].match(/\d+/g):null)[0];
            return order;
        })
 
    }
}


var vendor_obj = {
    getProduct:function(vendor,data,pattern=false){
        if(vendor=="grubhub"){
            return grubhub.getProduct(data,pattern);
        }
        else if(vendor=="swiggy"){
            return swiggy.getProduct(data);
        }
    },
    getCustomer:function(vendor,data,pattern=false){
        if(vendor=="grubhub"){
            return grubhub.getCustomer(data,pattern);
        }
        else if(vendor=="swiggy"){
            return swiggy.getCustomer(data);
        }
    },
    getOrder:function(vendor,data,pattern){
        if(vendor=="grubhub"){
            return grubhub.getOrder(data,pattern);
        }
        else if(vendor=="swiggy"){
            return swiggy.getOrder(data);
        }
    },
    getSwiggyFile:function(link){
        console.log('here')
        console.log(swiggyFileLink+link);
        return axios.get(swiggyFileLink+link,
            {
                responseType: 'arraybuffer',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/pdf'
                }
            })
        .then(function (response) {
            let buffer = Buffer.from(response.data);
            let arraybuffer = Uint8Array.from(buffer).buffer;
            fs.writeFileSync("swiggy_data.pdf",new Buffer(arraybuffer),'binary'); 
            // pdfParser.loadPDF(response);
            // console.log(response);
            return 1;
        })
        // .then((data)=>{
        //     return data;
        // })
    },
    parseSwiggyData:function(){
        let dataBuffer = fs.readFileSync('swiggy_data.pdf');
        return pdf(dataBuffer).then(function(data) {
        
            // number of pages
            console.log(data.numpages);
            // number of rendered pages
            console.log(data.numrender);
            // PDF info
            console.log(data.info);
            // PDF metadata
            console.log(data.metadata); 
            // PDF.js version
            // check https://mozilla.github.io/pdf.js/getting_started/
            console.log(data.version);
            // PDF text
            let data_arr = data.text.split(/\n/); 
            // fc.convertToArray('')       
            product_data = helper.extractData(data_arr,'NameQuantityPrice','Item Total');
            customer_data = helper.extractData(data_arr,'Delivery To:','Disclaimer:');
            order_data = helper.extractData(data_arr,'Item Total','Grand Total');

            product_data.splice(0,1);
            product_data.splice(product_data.length-1,1);

            return {
                product_data:product_data,
                customer_data:customer_data,
                order_data:order_data
            }
        });
    },
    extractData:function(link){
        return vendor_obj.getSwiggyFile(link).then((status)=>{
            return vendor_obj.parseSwiggyData().then((data)=>{
                return data;
            })
        }).catch((err)=>{
            console.log(err);
        });
    }

}

module.exports = vendor_obj;