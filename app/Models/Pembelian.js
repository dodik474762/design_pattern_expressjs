var basePath = process.cwd() + "/app";
var database = require(basePath + '/Config/Database');
var App = require(basePath + "/Helpers/App");
var record = App.record;
var db = database.mysqli;

// console.log(log);

var Pembelian = {
    countAll: function() {
        return new Promise(resolve => {
            var query = record.set().tableName('customer').countAll().execute();
            db.query(query, function(error, rows, fields) {
                if (error) {
                    App.log(error);
                } else {
                    resolve(rows[0].total); //Kembalian berupa kontak data
                }
            });
        });
    },

    getDataCustomer: function(params) {
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
            db.query(query['query'], function(error, rows, fields) {
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

    getDataCustomerWithPage: function(params){
        return new Promise(resolve => {
            var seek = typeof params.page === 'undefined' ? 1 : parseInt(params.page);
            var total = typeof params.from_data === 'undefined' ? 0 : params.from_data;

            var query = record.set().tableName('customer').select(['*']).get().seek(seek).paginateSql(3, total, true);
            db.query(query['query'], function(error, rows, fields) {
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

    getPostInputData: function(data) {
        var params = {};
        params.nama = data.nama;
        params.createddate = data.createddate;
        return params;
    },

    prosesSimpan: function(params) {

        
        return new Promise(resolve => {
            var data = Pembelian.getPostInputData(params);
            // record.getColumnSelect(['nama', 'nim', 'alamat']);
            // console.log(record.tableName('customer').insert(data).execute());
            // console.log(
            //     record
            //     .set()
            //     .tableName('customer')
            //     .update(data)
            //     .where('id', '=', 1, { openBracket: true })
            //     .and()
            //     .where('nama', '=', 'dodik', { closeBracket: true })
            //     .or()
            //     .where('nim', '=', '12')
            //     .execute()
            // );
            // record.set().rawQuery('select * from customer').execute()
            // console.log(
            //     record.set()
            //     .tableName('customer cs')
            //     .select(['ts.*', 'cs.nama as nama_customer'])
            //     .join('transaksi ts', 'ts.customer = cs.id')
            //     .orderBy('ts.id desc')
            //     .limit(10)
            //     .get()
            //     .execute()
            // );
            // console.log(record.set().tableName('customer').get().paginate(7, 1000));
            // var dt = record.set().tableName('customer').selectWithRowNum(['*']).get().seek(1).paginateSql(3, 10, true);
            // var dt = record.set().tableName('customer').select(['*']).get().seek(1).paginateSql(3, 10, true);
            // console.log(dt['query']);
            // return;            
            db.beginTransaction(function(err) {
                if (err) { App.log(error); }

                var query = record.insert("customer", data);
                if (params.id != '') {
                    query = record.update('customer', data, "id = " + params.id);
                }

                db.query(query, function(error, rows, fields) {
                    if (error) {
                        db.rollback(function(err) {
                            if (err) {
                                App.log(error);
                            }
                        });
                    } else {
                        db.commit(function(err) {
                            db.rollback(function(err) {
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