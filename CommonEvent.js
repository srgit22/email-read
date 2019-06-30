 
// const CommonHelper = require('../Helpers/CommonHelper');

var nodemailer = require('nodemailer');
//*******************For SMS */
// var twilio = require('twilio');
// var accountSid = 'ACf5d96302fda45627ef045375e1cb7d55'; // Your Account SID from www.twilio.com/console
// var authToken = '56285bd49f3c82b6ef8ead92a58ec7eb';   // Your Auth Token from www.twilio.com/console

//**********For FCM Notification */
// var admin = require("firebase-admin");
// var serviceAccount = require("../Config/serviceAccountKey.json");
// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     databaseURL: "https://cyntrapos.firebaseio.com"
// });
//************For Emial */

var events = require('events');

//create an object of EventEmitter class by using above reference
var emitter = new events.EventEmitter();


emitter.on('sendSMS', function (obj) {
    try {
        if (obj.gateway && (obj.gateway == 'twilio' || obj.gateway== 'Twilio')) {
            sendSmsByTwilio(obj);
        } else if (obj.gateway && ( obj.gateway == 'bhash' || obj.gateway == 'Bhashsms')) {
            sendSmsByBhash(obj);
        }
    } catch (e) {
        console.log("Error : While sending  SMS ", e);
    }   


});

var sendSmsByBhash = function (obj) {
    var mob = obj.mobile;
    var msg = obj.body;
    var url = "	http://bhashsms.com/api/sendmsg.php?user=CRAVRRINDIA&pass=Goodluck@09&sender=CRAVRR&phone=" + mob + "&text=" + msg + "&priority=ndnd&stype=normal"
    var options = {
        url: url,
        method: 'GET',
    };
    request2(options, function (e, resp, body) {
        if (e) {
            console.log("Error : While sending Bhash SMS ", e);
        } else {
            console.log("SMS sent seccussfully !");
        }
    });
};

var sendSmsByTwilio = function (obj) {
    var client = new twilio(accountSid, authToken);
    var body=obj.body;
    var to=obj.mobile;	
    client.messages.create({
    	body: body,
    	to: to,//'+17206204408',  // Text this number
    	from: '+14242342728'//'+12345678901' // From a valid Twilio number
    })
    .then((message) => console.log(message));
};


emitter.on('sendEmail', function (obj) {
    try {
        console.log("Email obj=", obj);
        var transporter = nodemailer.createTransport({
            service: 'yahoo',
            //secure: false,
            //logger: true,
            auth: {
                user: 'receipt@cravrr.com',
                pass: 'nxfjmodlhikvltau'
            }
        });
    } catch (e) {
        console.log("Email obj Exception =", e);
    }

    var mailOptions = {
        from: 'receipt@cravrr.com',
        to: obj.to,//'sachin774raj@gmail.com',
        subject: obj.subject,//'Sending Email using Node.js',
        text: obj.body//'That was easy!'
    };
    console.log("mailOptions=",mailOptions);
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
});

emitter.on('sendNotification', function (obj, dataOr) {
    //console.log("Notification obj=",obj);
    try {
        var sData = obj;
        var fcmT = obj.fcm_token;
        var title = obj.title;
        var message = obj.message;
        var badge = String(obj.badge);// it is for panding message count  
        delete sData.fcm_token;
        if (fcmT && fcmT.length > 0) {
            _.map(fcmT, async function (item, idx) {
                var registrationToken = "";
                // var registrationToken = 'fgdckwgqYEk:APA91bHCJGLge4EZ77KJANoYJzNbJQvnlZHmwJSLle1nAvOQp2tYV5R0oT-ClVICDKSUTJCXask3DsQ9ztrW_VC0gNF2tzD3J_pdOePgrgbH0YOhisyPWX_iCu4CzVSbj0Ws9Mi1uwCu';
                registrationToken = item;
                if (registrationToken != "") {
                    var payload = {
                        notification: {
                            title: title,
                            body: JSON.stringify(dataOr),
                            sound: "default",
                            badge: badge,
                        },
                        data: {}
                    };
                    var options = {
                        priority: "high",
                        //timeToLive: 60 * 60 *24
                    };
                    //message = {"message":{"topic":"deals","notification":{"body":"View latest deals from top brands.","title":"Latest Deals"}} ,token: registrationToken};
                    try {
                        // console.log('registrationToken :' + registrationToken + "   payload : " + JSON.stringify(payload) + "   options:" + JSON.stringify(options));
                        await admin.messaging().sendToDevice(registrationToken, payload, options).then((response) => {
                            console.log('Successfully sent message FCM:', response.results);
                        }).catch((error) => {
                            console.log('Error sending message:', error);
                        });
                    } catch (e1) {
                        console.log("somthing went wrong e1 in FCM", e1);
                    }
                }
            });
        } else {
            console.log("please provide fcm id");
        }
    } catch (e) {
        console.log("somthing wen wrong while sending notification e in FCM", e);
    }
});


emitter.on('closeInventory', async function (req) {
    //console.log("req.query=",req.query);
    var dStock = 0; var poStock = 0;
    var date = moment().subtract(1, 'days').format("YYYY-MM-DD");
    if (req && req.query && req.query.date && req.query.date != "") {
        date = req.query.date;
    }
    var from = new Date(date + "T00:00:00.000Z");
    var end = new Date(date + "T23:59:59.000Z");
    //console.log("from=",from,"end=",end);
    var items = await PoInventory.aggregate([{ $group: { _id: '$IngOrItemId', 'StoreCode': { '$first': '$StoreCode' }, 'Units': { '$first': '$Units' } } }]);
    if (items && items.length > 0) {
        var itemsD = await Promise.all(items.map(async (item) => {
            if (item._id && item._id != "") {
                var cond = {};
                cond['created_at'] = { '$gte': from, '$lte': end };
                cond['IngOrItemId'] = item._id;
                var poInvent = await PoInventory.aggregate([
                    { $match: cond },
                    { $addFields: { _date: { $dateToString: { 'format': "%Y-%m-%d", date: '$created_at' } } } },
                    { $group: { _id: '$_date', count: { '$sum': '$Qty' }, 'IngOrItemId': { '$first': '$IngOrItemId' }, 'Units': { '$first': '$Units' } } }
                ]);
                var InventDeduction = await InventoryDeduction.aggregate([
                    { $match: cond },
                    { $addFields: { _date: { $dateToString: { 'format': "%Y-%m-%d", date: '$created_at' } } } },
                    { $group: { _id: '$_date', count: { '$sum': '$Consumption' }, 'IngOrItemId': { '$first': '$IngOrItemId' }, 'Units': { '$first': '$Units' } } }
                ]);
                var CloseInvent = await CloseInventory.aggregate([
                    { $match: cond },
                    { $addFields: { _date: { $dateToString: { 'format': "%Y-%m-%d", date: '$created_at' } } } },
                    { $group: { _id: '$_date', count: { '$sum': '$Closing' }, 'IngOrItemId': { '$first': '$IngOrItemId' }, 'Units': { '$first': '$Units' } } }
                ]);
                // console.log("poInventory=",poInvent);
                // console.log("InventoryDeduction=",InventDeduction);
                // console.log("CloseInvent=",CloseInvent);
                var poCount = 0; var DeductionCount = 0; var closeCount = 0;
                if (poInvent && poInvent.length > 0) {
                    poCount = parseFloat(poInvent[0].count);
                }
                if (InventDeduction && InventDeduction.length > 0) {
                    DeductionCount = parseFloat(InventDeduction[0].count);
                }
                if (CloseInvent && CloseInvent.length > 0) {
                    closeCount = parseFloat(CloseInvent[0].count);
                }
                var closedInvent = poCount + DeductionCount + closeCount;
                // console.log("poCount=",poCount);
                // console.log("DeductionCount=",DeductionCount);
                // console.log("closeCount=",closeCount);
                // console.log("CloseInvent=",closedInvent);
                var ClosingObj = {
                    StoreCode: item.StoreCode,
                    IngOrItemId: item._id,
                    Closing: closedInvent,
                    Units: item.Units,
                };
                //console.log("ClosingObj=",ClosingObj);
                var model1 = new CloseInventory(ClosingObj);
                var ress = await model1.save().catch((e) => { console.log(e) });
                return ress;
            }
        }));
    }
});

emitter.on('tableClean', async function (req) {
    //console.log("req.query=",req.query);
    var result1 = await CommonHelper.clearTable(req);
});