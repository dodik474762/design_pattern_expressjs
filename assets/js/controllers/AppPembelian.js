let AppPembelian = new Vue({
    el: '#app-pembelian',
    data: {
        title: "Pembelian",
        title_app: "Pembelian Customer",
        data_customer: [],
        data_page: []
    },
    methods: {
        tampilkan: async function() {
            var data = await Pembelian.getDataCustomer();
            this.data_customer = data.data;
            this.data_page = data.page;
            // console.log(data);
            // console.log(JSON.parse(JSON.stringify(this.data_customer)));
        },
        add: function() {
            window.location.href = Url.base_url(Pembelian.module()) + "/add";
        },

        ubah: function(e) {
            var elm = e.target;
            var tr = $(elm).closest('tr');
            var id = tr.attr('data_id');
            var nama = $.trim(tr.find('td:eq(1)').text());
            window.location.href = Url.base_url(Pembelian.module()) + "/ubah?id=" + id + "&nama=" + nama;
        },
        reload: function() {
            window.location.href = Url.base_url(Pembelian.module()) + "";
        },

        proses: async function() {
            if (validation.run()) {
                var respon = await Pembelian.prosesSimpan();
                if (respon.is_valid) {
                    alert("Sukses Bro");
                    this.reload();
                } else {
                    alert("Gagal");
                }
            }
        }
    },
});


let Pembelian = {
    module: function() {
        return "transaksi/pembelian";
    },

    getDataCustomer: function() {
        let params = {
            'tanggal': "2020-05-21"
        };

        return new Promise(resolve => {
            axios.post(Url.base_url(Pembelian.module()) + '/getDataCustomer', params)
                .then(res => {
                    resolve(res.data);
                })
                .catch(err => {
                    console.error(err);
                })
        });
    },

    prosesSimpan: function() {
        let params = {
            'id': $('#id').val(),
            'nama': $('#nama').val(),
            'nim': $('#nim').val(),
        };

        return new Promise(resolve => {
            axios.post(Url.base_url(Pembelian.module()) + '/prosesSimpan', params)
                .then(res => {
                    resolve(res.data);
                })
                .catch(err => {
                    console.error(err);
                })
        });
    },
};


$(function() {
    // $('#btn-tampilkan').trigger('click');
});