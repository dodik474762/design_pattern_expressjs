var basePath = process.cwd() + "/app";
var mdbPembelian = require(basePath + '/Models/Pembelian');
var App = require(basePath + "/Helpers/App");
var route = require(basePath + "/Config/Route");
var path = require(basePath + "/Config/Path");

App.view.setViews();


//index
App.control.get(route.pembelian.index, async function(req, res) {
    var params = {};
    params = App.helper.getParam(req);
    params.title_app = "Pembelian";
    params.views = path.pembelian.view("index");
    params.asset = path.pembelian.assets;
    params.from_data = await mdbPembelian.countAll();

    // var data = await mdbPembelian.getDataCustomer(params);
    var data = await mdbPembelian.getDataCustomerWithPage(params);
    params.result = data.data;
    params.pagination = data.page;
    params.last_page = data.last_page;
    // console.log(data);
    res.render("template/template", params);
});

//add
App.control.get(route.pembelian.add, function(req, res) {
    var params = {};
    params.title_app = "Tambah Pembelian";
    params.views = path.pembelian.view("form_add");
    params.asset = path.pembelian.assets;
    res.render("template/template", params);
});

//ubah
App.control.get(route.pembelian.ubah, function(req, res) {
    var params = {};
    params = App.helper.getParam(req);


    params.title_app = "Ubah Pembelian";
    params.views = path.pembelian.view("form_add");
    params.asset = path.pembelian.assets;
    res.render("template/template", params);
});



//getDataCustomer
App.control.use(App.parser.json());
App.control.post(route.pembelian.getDataCustomer, async function(req, res) {
    let tanggal = req.body.tanggal;
    var result = await mdbPembelian.getDataCustomer();

    // console.log(result.page);
    res.json(result);
});

//prosesSimpan
App.control.use(App.parser.json());
App.control.post(route.pembelian.simpan, async function(req, res) {
    req.body.createddate = App.time().format('YYYY-MM-DD HH:mm:ss');
    var result = {};
    result.is_valid = false;

    var data = await mdbPembelian.prosesSimpan(req.body);
    // if(data.affectedRows > 0){
    //     result.is_valid = true;
    //     result.id = data.insertId;
    // }

    res.json(result);
});

App.server.listening();
module.exports.PembelianControllers = App;