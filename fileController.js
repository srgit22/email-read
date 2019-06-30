var fs = require('fs');
var ce = require('./CommonEvent.js');
var helper = require('./helper.js');
var vendors = require('./vendors.js');


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


async function convertToArray(file){
  var input = fs.createReadStream(file);
  return readLines(input, func);
}

// function readJson(file){
//   return fs.readFileSync('Order_Ids.json','utf8');
// }

// function writeJson(arr){;
//   fs.writeFileSync('Order_Ids.json', JSON.stringify(arr), 'utf8'); 
// }

 
module.exports={
 convertToArray:convertToArray
}

var answer = '5A';
console.log(answer.replace(/[a-zA-Z]/g, ''));

//helper.sendEmail({to:'dropmailsanjayrawat@gmail.com',body:'dropmailsanjayrawat@gmail.com',subject:'another test email'})

