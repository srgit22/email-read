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

var answer = '5Anjay rawtt';
console.log(answer.replace(/[a-zA-Z]/g, ''));

// helper.sendEmail({to:'dropmailsanjayrawat@gmail.com',
// body:'<html><body><div data-test-id="focus-group" aria-label="Keyboard navigation group. Use arrow keys to navigate, or tab to the next group."><ul class="hd_n M_0 X_0" data-test-id="cards"><li class="m_Z12nDQf D_F ek_BB ir_0"><div data-test-id="message-view" data-test-expanded="true" class="p_R b_efTvb I_52qC em_N X_fq7 N_6LEV ir3_Z1tiXR3 it3_689y message-view" data-iskeynav="true" tabindex="40"><div data-test-id="message-body-container"><div data-test-id="message-view-body"><div class="X_6MGW"></div><div class="msg-body P_wpofO iy_A" data-test-id="message-view-body-content"><div class="jb_0 X_6MGW N_6Fd5"><div><div id="yiv6691739164"><div><blockquote type="cite"><div><div style="float:right;padding-right:30px;"><img style="width:6cm;" alt="GrubHub Seamless" src="https://ecp.yusercontent.com/mail?url=https%3A%2F%2Fs3.amazonaws.com%2Fgrubhubimages%2FGH_Portfolio_Brand_Logo.png&amp;t=1561815921&amp;ymreqid=31d33864-1715-6f5a-1c4d-f0012e011200&amp;sig=e7IhIHscrOEViyUMhj6q6w--~C"></div><div style="font-weight:bold;font-size:125%;"><span style="font-weight:bold;font-size:150%;">China Spice</span><br>Order #1902365725<br>Customer Service: 877-798-4141</div><br><table style="width:400px;"><tbody><tr><td>Deliver to:</td><td>Deliver</td></tr><tr><td>Keshav sharma</td><td>May 01, 2019</td></tr><tr><td>20 royle course Way</td><td valign="top">by 7:13 PM on May 02, 2019</td></tr><tr><td>Jersey City, NJ 07304</td></tr><tr><td>856-495-9055</td></tr></tbody></table><br><br><table style="width:400px;border:1px solid black;"><tbody><tr><td style="border-bottom:1px solid black;"><b>Special Instructions</b></td></tr><tr><td>Once enter gate, ADDRESS is 100 CLIFTON PLACE #315, JERSEY CITY NJ. CALL 856 495 9055 IF LOST.</td></tr></tbody></table><br><table style="width:500px;border:1px solid black;"><tbody><tr><td style="border-bottom:1px solid black;">Qty</td><td style="border-bottom:1px solid black;">Item</td><td style="border-bottom:1px solid black;">Price</td></tr><tr><td>1</td><td>Papaya Salad</td><td><u></u>$ 5.00<u></u></td></tr><tr><td>2</td><td>rajma chawal</td><td><u></u>$ 2.00<u></u></td></tr><tr><td>3</td><td>chole chawal</td><td><u></u>$ 7.00<u></u></td></tr><tr><td>4</td><td>dosa</td><td><u></u>$ 4.00<u></u></td></tr><tr><td>5</td><td>aloo chat</td><td><u></u>$ 8.00<u></u></td></tr></tbody></table><br><div><span style="font-weight:bold;font-size:150%;">Prepaid. DO NOT charge</span></div><br><br><table style="width:400px;"><tbody><tr><td>Subtotal</td><td>$28.00</td></tr><tr><td>Delivery Fee</td><td>$0.00</td></tr><tr><td>Tax</td><td>$1.96</td></tr><tr><td>Tip</td><td>$3.00</td></tr><tr><td>Total</td><td>$32.96</td></tr></tbody></table><br><span style="font-weight:bold;font-size:150%;">confirmation code: 7017</span><br><a rel="nofollow" target="_blank" href="https://myaccount.grubhub.com/orders/externalConfirmation.action?orderId=1420720402&amp;orderToken=B61RRSYSADVMT"> Click Here</a> to confirm or view.<div style="display:none;display:none!important;"><div><div>Satya Pandey</div><div>856-495-9055</div><div>20 Beacon Way</div><div></div><div>Jersey City</div><div>NJ</div><div>07304</div><div></div><div>Once enter gate, ADDRESS is 100 CLIFTON PLACE #315, JERSEY CITY NJ. CALL 856 495 9055 IF LOST.</div></div><div><div>1420720402</div><div>1494542004000</div><div>1494546384000</div><div>7017</div><div>Delivery</div><div>0</div><div>false</div><div>false</div><div>28.00</div><div>0.00</div><div>1.96</div><div>3.00</div><div>32.96</div></div><div><div>Papaya Salad</div><div>1</div><div>$ 5.00</div><div></div><div></div></div><div><div>Thai Fried Rice</div><div>1</div><div>$ 12.00</div><div>[Vegetable]</div><div>NO FISH SAUCE NO OYSTER SAUCE AND NO EGGS. PURE VEG, ADD TOFU</div></div><div><div>Braised Chili Tofu</div><div>1</div><div>$ 11.00</div><div></div><div></div></div><div><div>70962</div><div>China Spice</div><div></div></div><div><div>Grubhub</div><div>877-798-4141</div></div></div></div></blockquote></div><br></div></div></div></div><div class="jb_0 X_6MGW N_6Fd5"></div></div><div class="H_7jIs D_F ab_C Q_69H5 E_36RhU" data-test-id="toolbar-hover-area"></div></div></div></li></ul></div></body></html>',
// subject:'Order #1420720402 from GrubHub.com'})

