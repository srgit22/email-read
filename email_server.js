var Imap = require('imap'),
    inspect = require('util').inspect;

var fs = require('fs');    
var helper = require('./helper.js');
var email_seq_no;
var Imap = require('imap');
//configure imap credentials
var imap = new Imap({
    user: 'dropmailsanjayrawat@gmail.com',
    password: 'password4gmail#123', 
    host: 'imap.gmail.com',
    // user:'sanjay.rawat@cyntralabs.com',
    // password:'newpw@Cyntralab123',
    // host:'imap.mail.yahoo.com',
    port: 993,
    tls: true,
    tlsOptions: {
        rejectUnauthorized: false
    }
});

function openInbox(cb) {
	imap.openBox('INBOX', true, cb);
}



module.exports ={

    checkEmail:function(vendor){

        var search;
        
        switch(vendor) {
            case 'grubhub':
                search = 'from GrubHub.com';
              break;
            case 'swiggy':
                search = 'Swiggy order';
              break;
            default:
              // code block
          }

        return new Promise((resolve,reject)=>{
            imap.once('ready', function() {

                // console.log('inside ready');
                
                openInbox(function(err, box) {	

                    if (err) throw err;
                        
                    imap.search( [['HEADER', 'SUBJECT', search]], function(err, results) {
                        
                        if (err) throw err;
                        var f = imap.fetch(results, { bodies: '' });

                        f.on('message', function(msg, seqno) {
                        
                            console.log('Message #%d', seqno);
                            var prefix = '(#' + seqno + ') ';


                                msg.on('body', function(stream, info) {
                                
                                    console.log(prefix + 'Body');
    
                                    stream.on('data',function(chunk){
                                        // simpleParser(chunk, {}, (err, parsed) => {
                                        // 	console.log(parsed);
                                        // 			fs.writeFileSync('mail_data.txt', '\n '+JSON.stringify(parsed), 'utf8'); 
                                        // });
                                        email_seq_no = seqno;
                                        console.log('==>'+seqno);
                                        helper.checkEmailProcessed(seqno).then((abc)=>{
                                            fs.writeFileSync('email_data.txt', '\n '+prefix, 'utf8'); 
                                            fs.appendFileSync('email_data.txt', '\n '+chunk, 'utf8');
                                            resolve(seqno);
                                        }); 
                                    })
                                        
                                });


                        
                            // }).catch((err)=>{
                            //     console.log(err);
                            // })


                            msg.once('attributes', function(attrs) {
                                // console.log(prefix + ‘Attributes: %s’, inspect(attrs, false, 8));
                            });

                            msg.once('end', function() {
                                // fs.writeFileSync('swiggy_data.txt', '\n '+prefix + 'finished', 'utf8')
                                
                            });
                        });

                        f.once('error', function(err) {
                            console.log('Fetch error:  '+ err);
                        });

                        f.once('end', function() {
                            console.log('Done fetching all messages!');
                            imap.end();
                            resolve(email_seq_no);
                        });

                    });//search

                });//openinbox

            });

            imap.once('error', function(err) {
                console.log(err);
            });

            imap.once('end', function() {
                console.log('Connection ended');
            });

            imap.connect();
            });
        }
}