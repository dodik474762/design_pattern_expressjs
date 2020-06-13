var Url = {
    port: "3000",
    base_url: function(module = "") {
        return "http://localhost:" + Url.port+"/"+module;
    }
};