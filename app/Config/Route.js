var Module = {
    pembelian: "/transaksi/pembelian"
};

var Route = {
    pembelian: {
        index: Module.pembelian,
        add: Module.pembelian+"/add",
        getDataCustomer: Module.pembelian+"/getDataCustomer",
        simpan: Module.pembelian+"/prosesSimpan",
        ubah: Module.pembelian+"/ubah"
    }
};

module.exports = Route;