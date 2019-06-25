var imaps = require('imap-simple');
 
var config = {
    imap: {
        user: 'dropmailsanjayrawat@gmail.com',
        password: 'password4gmail#123', 
        host: 'imap.gmail.com',
        port: 993,
        tls: true,
        authTimeout: 13000,
        tlsOptions: {
                rejectUnauthorized: false
            }
    }
};
 
imaps.connect(config).then(function (connection) {
 
    
    return connection.openBox('INBOX').then(function () {
        console.log('connection-->');
        var searchCriteria = [
            'UNSEEN'
        ];
 
        var fetchOptions = {
            bodies: ['HEADER', 'TEXT'],
            markSeen: false
        };
 
        return connection.search(searchCriteria, fetchOptions).then(function (results) {
            console.log(results);
            var subjects = results.map(function (res) {
                return res.parts.filter(function (part) {
                    return part.which === 'HEADER';
                })[0].body.subject[0];
            }).catch((err)=>{console.log(err)});
 
            console.log(subjects);
            // =>
            //   [ 'Hey Chad, long time no see!',
            //     'Your amazon.com monthly statement',
            //     'Hacker Newsletter Issue #445' ]
        });
    });
});