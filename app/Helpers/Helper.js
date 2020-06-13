var Helper = {
    getParam: function (request) {
        let q = request.url.split('?'),result = {};
        if (q.length >= 2) {
            q[1].split('&').forEach((item) => {
                try {
                    result[item.split('=')[0]] = item.split('=')[1];
                } catch (e) {
                    result[item.split('=')[0]] = '';
                }
            })
        }

        return result;
    }
};


module.exports = Helper;