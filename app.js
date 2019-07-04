var helper = require('./helper.js');
var email_server = require('./email_server.js');
var order = require('./place_order.js');
var CronJob = require('cron').CronJob;

var vendor = 'grubhub';
// var vendor = 'swiggy';
var StoreCode = 103;

// fileController.writeJson();
// console.log(fileController.readJson());


// var job1 = new CronJob('*/20 * * * * *', function() {
    console.log('checking every min for orders--'+helper.getDateTime());
    email_server.checkEmail(vendor).then(function(seq_no){
        // console.log(seq_no);
        // order.process(vendor,StoreCode);
  
        helper.checkEmailProcessed(seq_no).then((abc)=>{
            order.process(vendor,StoreCode);
            helper.writeId(seq_no);
        }).catch((err)=>{
            console.log(err);
        })
    })
// }, function() {
//     console.log(moment().format('DD MMM YYYY:hh:mm:ss'), " Sync PromotionTable Last 30 days");
// },
//     true /* Start the job right now */
// );



 
  
//db.getCollection('ItemMaster').find({ItemName:'Aloo Paratha',StoreCode:{$elemMatch:{$eq:121}}}) 
 




