










// module.exports = {
//     databaseConnection:function(mongoose){        
//             //var url= "mongodb://localhost:27017/Mcd";
//             var url= "mongodb://cyntraAdmin:Pass123%23@localhost:27017/Mcd";
//             // configuration ===============================================================
            
//             mongoose.connect(url);
//             console.log(mongoose.connection.readyState);
//             // CONNECTION EVENTS
//             mongoose.connection.on('connecting', function () {
//               console.log('Mongoose default connection open to ' +url);
//             });
//             // When successfully connected
//             mongoose.connection.on('connected', function () {
//               console.log('Mongoose default connected open to ' + url);
//             });

//             // If the connection throws an error
//             mongoose.connection.on('error',function (err) {
//               console.log('Mongoose default connection error: ' + err);
//             });
//             // When the connection is disconnected
//             mongoose.connection.on('disconnected', function () {
//               console.log('Mongoose default connection disconnected');
//             });
            
//     }

// };
