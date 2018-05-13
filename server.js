// employment of required packages
var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var _ = require('lodash');
var pgoptions = require(path.join(__dirname, 'config', 'pgoptions.config.js'));
var connectObject = require(path.join(__dirname, 'config', 'connect.config.js'));
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config.js');
var AWS = require('aws-sdk');
AWS.config.update({region:'us-east-1'});

AWS.config.credentials = new AWS.EC2MetadataCredentials({
    httpOptions: { timeout: 5000 }, // 5 second timeout
    maxRetries: 10, // retry 10 times
    retryDelayOptions: { base: 200 } // see AWS.Config for information
});

// path.join(__dirname, 'routes', 'api.js')

var db = require('pg-promise')(pgoptions)(connectObject);

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressSession({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: true,
    saveUninitialized: true}));

//added support for CORS -HB
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,OPTIONS,HEAD");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    //res.header("Access-Control-Allow-Credentials", true);
    next();
});

// ROUTES
app.use(require('./routes/employees'));
app.use(require('./routes/aircraft'));
app.use(require('./routes/customers'));
app.use(require('./routes/flights'));
app.use(require('./routes/login'));
app.use(require('./routes/membership'));
app.use(require('./routes/schools'));
app.use(require('./routes/documentation'));
app.use(require('./routes/search'));
app.use(require('./routes/webSignup'));
app.use(require('./routes/signup'));
app.use(require('./routes/url'));
app.use(require('./routes/sns'));

// Make our 'db' connection object available to the entire application as 'conn'
app.set('conn', db);

// Make sure that all requests are served with the same index.html file that has our bundle.js script
app.get('*', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Another way to accomplish the above redirect
// app.get('*', (req, res) => {
//     res.sendFile('public/index.html' , { root : __dirname});
// });

module.exports = app;

//if environment is dev start the webpack-dev-server

if(process.env.NODE_ENV == 'dev') {
    new WebpackDevServer(webpack(config), {
        contentBase: path.join(__dirname, "/public"),
        publicPath: '/',
        // proxy: {
        //     "/routes/*": "http:localhost:3000" // proxy all API calls to routes to the server on port 3000
        // },
        historyApiFallback: {
            index: '/'
        }
    }).listen(8080, 'localhost', function (err, result) {
        if (err) {
            return console.log(err);
        }
        console.log('Dev Server has started on Port 8080');
    });
}
//if environment is prod run webpack -p
else if(process.env.NODE_ENV == 'prod') {
    app.listen(80, function () {
        console.log('Prod Server has started on port 80');
    });
}

// app.listen(80, function () {
//     console.log('Server has started on port 80');
// });

var PORT = process.env.PORT || 3000;

// tell the server where to be listening for requests
app.listen(PORT, function () {
    console.log('DB Server has started on port ' + PORT);
});

// This essentially runs the devServer operation, but on the VPS
// if(process.env.NODE_ENV == 'dev') {
//     new WebpackDevServer(webpack(config), {
//         contentBase: path.join(__dirname, "/public"),
//         publicPath: '/',
//         public: "34.200.245.26:80",
//         // proxy: {
//         //     "/routes/*": "34.200.245.26:3000" // proxy all API calls to routes to the server on port 3000
//         // },
//         historyApiFallback: {
//             index: '/'
//         }
//     }).listen(8080, "0.0.0.0", function (err, result) {
//         if (err) {
//             return console.log(err);
//         }
//
//         console.log('Cattle Prod Server has started on Port 8080');
//     });
// }