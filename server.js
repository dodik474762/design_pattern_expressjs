
//PATH
var path = require("path");
var basePath = path.dirname(process.mainModule.filename);
var pathApp = "/app";
var pathController = "/Controllers";

//Controllers
var Pembelian = require(basePath+pathApp+pathController+'/PembelianControllers');