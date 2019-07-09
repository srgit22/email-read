var fs = require('fs');
var nodemailer = require('nodemailer');
var events = require('events');

//create an object of EventEmitter class by using above reference
var emitter = new events.EventEmitter();

module.exports = {
    checkEmpty:function(obj){
        return (Object.entries(obj).length === 0 && obj.constructor === Object);
    },
    getDate:function (){
        	
        var today = new Date();
        let month = today.getMonth()+1;
        return ('0'+month+'/'+(today.getDate()<10?'0'+today.getDate():today.getDate())+'/'+today.getFullYear());
        
    },
    getDateTime:function (){
        var today = new Date();
        let month = today.getMonth()+1;
        var date = today.getFullYear()+'-'+'0'+month+'-'+(today.getDate()<10?'0'+today.getDate():today.getDate());
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        return `${date} ${time}`;
    },
    checkEmailProcessed:function (seq_no){
        return new Promise((resolve,reject)=>{
            var seq_arr = JSON.parse(fs.readFileSync('Order_Ids.json', 'utf8'));
            if(!seq_arr.includes(seq_no)){
                resolve();
            }
            else{
                // reject(seq_no+'already processed');
            }
                
        })
    },
    writeId:function(seq_no){
        var seq_arr = JSON.parse(fs.readFileSync('Order_Ids.json', 'utf8'));
        seq_arr.push(seq_no);
        fs.writeFileSync('Order_Ids.json', JSON.stringify(seq_arr), 'utf8');
    },
    extractData:function(data_arr,start,stop){
    
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
                break;
            }
        }
    
        return data;    
    },
    sendEmail :(data) => {
        var obj={};
        obj.to=data.to;
        obj.subject=data.subject;
        obj.body=data.body;

        //emitter.emit('sendEmail', obj);
        try {
            // console.log("Email obj=", obj);
            var transporter = nodemailer.createTransport({
                service: 'yahoo',
                //secure: false,
                //logger: true,
                auth: {
                    user: 'receipt@cravrr.com',
                    pass: 'nxfjmodlhikvltau'
                },
                tls: {
                    rejectUnauthorized: false
                }
            });
          } catch (e) {
            console.log("Email obj Exception =", e);
          }
          
          var mailOptions = {
            from: 'receipt@cravrr.com',
            to: obj.to,//'dropmailsanjayrawat@gmail.com',
            subject: obj.subject,//'Sending Email using Node.js',
            html: obj.body//'That was easy!'
          };

          console.log("mailOptions=",mailOptions);
          
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
          });
    }
}

