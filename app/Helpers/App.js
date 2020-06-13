var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require("path");
var basePath = path.dirname(process.mainModule.filename) + "/app";
var url_config = require(basePath + "/Config/Url");
let ejs = require('ejs');
var moment = require('moment');  
var log = require(basePath+"/Logs/Logs");
var record = require(basePath+'/Helpers/ActiveRecord');
var helper = require(basePath+'/Helpers/Helper');



//Configuration Views Template Engine
var Views = {
    setViews: function () {
        //set views
        app.set('views', path.join(basePath, "Views"));
        app.set('view engine', 'ejs');
        //set root folder css/js
        app.use(express.static('assets'));
    }
};

//Configuration Web Server
var Server = {
    listening: function () {
        //Listen to Web Server
        app.listen(url_config.port, function () {
            console.log("listen :" + url_config.port);
        });
    }
};



//export to variable
module.exports.control = app;
module.exports.express = express;
module.exports.parser = bodyParser;
module.exports.basePath = basePath;
module.exports.path = path;
module.exports.view = Views;
module.exports.url = url_config;
module.exports.server = Server;
module.exports.time = moment;
module.exports.log = log;
module.exports.record = record;
module.exports.helper = helper;