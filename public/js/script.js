// console.log("i am linked");

(function() {
    new Vue({
        el: "#main",
        data: {
            images: []
        },
        mounted: function() {
            var self = this;
            axios.get("/images").then(function(response) {
                self.images = response.data;
            });
        },
        methods: {
            myFunction: function() {
                console.log("My function is running!!!");
            }
        }
    });
})();
