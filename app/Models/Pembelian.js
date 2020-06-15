var basePath = process.cwd() + "/app";
var database = require(basePath + '/Config/Database');
var App = require(basePath + "/Helpers/App");
var record = App.record;
var db = database.mysqli;

// console.log(log);

var Pembelian = {
    countAll: function () {
        return new Promise(resolve => {
            var query = record.set().tableName('customer').countAll().execute();
            db.query(query, function (error, rows, fields) {
                if (error) {
                    App.log(error);
                } else {
                    resolve(rows[0].total); //Kembalian berupa kontak data
                }
            });
        });
    },

    getDataCustomer: function (params) {
        var page = typeof params.page === 'undefined' ? 1 : params.page;
        var offset = typeof params.offset === 'undefined' ? 0 : params.offset;
        var total = typeof params.from_data === 'undefined' ? 0 : params.from_data;
        var last_page = typeof params.last === 'undefined' ? 3 : params.last;
        var first = typeof params.first === 'undefined' ? 1 : params.first;

        return new Promise(resolve => {
            var query = record.set().tableName('customer').getAll().paginate(3, total, {
                page: page,
                offset: offset,
                segment: 3,
                last: last_page,
                first: first
            });
            db.query(query['query'], function (error, rows, fields) {
                if (error) {
                    App.log(error);
                } else {
                    var i = 1;
                    for (item in rows) {
                        rows[item].no = i++;
                    }
                    resolve({
                        data: rows,
                        page: query['page'],
                    }); //Kembalian berupa kontak data
                }
            });
        });
    },

    getDataCustomerWithPage: function (params) {
        return new Promise(resolve => {
            var seek = typeof params.page === 'undefined' ? 1 : parseInt(params.page);
            var total = typeof params.from_data === 'undefined' ? 0 : params.from_data;

            var query = record.set().tableName('customer').select(['*']).get().seek(seek).paginateSql(3, total, true);
            db.query(query['query'], function (error, rows, fields) {
                if (error) {
                    App.log(error);
                } else {
                    var i = 1;
                    for (item in rows) {
                        rows[item].no = i++;
                    }
                    resolve({
                        data: rows,
                        page: query['paging_content'],
                        last_page: query['last_page']
                    }); //Kembalian berupa kontak data
                }
            });
        });
    },

    getPostInputData: function (data) {
        var params = {};
        params.nama = data.nama;
        params.createddate = data.createddate;
        return params;
    },

    prosesSimpan: function (params) {
        return new Promise(resolve => {
            db.beginTransaction(function (err) {
                if (err) {
                    App.log(error);
                }

                var data = Pembelian.getPostInputData(params);
                var query = record.set().tableName("customer").insert(data).execute();
                if (params.id != '') {
                    query = record.set().tableName('customer').update(data).where("id", "=", params.id).execute();
                }

                console.log('masukk query');
                db.query(query, function (error, rows, fields) {
                    if (error) {
                        console.log('rollbacl', error);
                        db.rollback(function (err) {
                            if (err) {
                                App.log(error);
                            }
                        });
                    } else {
                        console.log('commit');
                        db.commit(function (err) {
                            db.rollback(function (err) {
                                if (err) {
                                    App.log(error);
                                }
                            });
                            if (err) {
                                App.log(error);
                            } else {
                                // db.end();
                                resolve(rows); //Kembalian berupa kontak data
                            }
                        });
                    }
                });
            });
        });
    }
};


module.exports = Pembelian;