const stringit = require("../lib");

const notEmpty = {
    mounted: function() {
        let vm = this;
        setTimeout(function() {
            // tslint:disable-next-line:no-console
            console.log("fuck you");
            vm.createRecap();
        }, 1000);
    },
    methods: {
        createRecap: function createRecap() {
            if (window.grecaptcha) {
                this.renderRecap();
            } else {
                // try loading the library again after 1.5sec in case it's not in window yet
                setTimeout(this.recaptcha, 1500);
            }
        },
        renderRecap: function() {
            window.grecaptcha.render(this.widgetId, {
                sitekey: this.sitekey,
                theme: this.theme,
                size: this.size,
                badge: "inline",
                callback: this.emitVerify,
                "callback-expired": this.emitExpired,
            });
        },
        reset: function reset() {
            window.grecaptcha.reset();
        },
        execute: function execute() {
            window.grecaptcha.execute();
        },
        emitVerify: function emitVerify(response) {
            this.$emit("verify", response);
        },
        emitExpired: function emitExpired() {
            this.$emit("expired");
        },
    },
};

const result = stringit(notEmpty);
console.log(result);
