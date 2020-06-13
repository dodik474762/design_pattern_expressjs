var path = require("path");

var PathConfig = {
    basePath: path.dirname(process.mainModule.filename) + "/app",
    pembelian:{
        view: function(view){
            return "transaksi/pembelian/"+view;
        },

        assets:[
            '<script src="/js/helper/validation.js"></script>',
            '<script src="/js/controllers/AppPembelian.js"></script>',
        ]
    }
};

module.exports = PathConfig;