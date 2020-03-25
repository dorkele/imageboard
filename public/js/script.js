// console.log("i am linked");

(function() {
    new Vue({
        el: "#main",
        data: {
            id: "",
            images: [],
            title: "",
            description: "",
            username: "",
            file: null,
            modal: ""
        },
        mounted: function() {
            var self = this;
            axios.get("/images").then(function(response) {
                console.log("response.data: ", response);

                self.images = response.data;
            });
        },
        methods: {
            handleClick: function(e) {
                e.preventDefault();
                console.log("this: ", this);
                var self = this;
                var formData = new FormData();
                //formData shows empty object when console.logged - weird behaviour
                formData.append("title", this.title);
                formData.append("description", this.description);
                formData.append("username", this.username);
                formData.append("file", this.file);
                axios
                    .post("/upload", formData)
                    .then(function(response) {
                        console.log("response from post upload. ", response);
                        console.log("self.images: ", self.images);
                        self.images.unshift(response.data[0][0]);
                    })
                    .catch(function(error) {
                        console.log("error in post upload: ", error);
                    });
            },
            handleChange: function(e) {
                console.log("handleChange is running");
                console.log("file: ", e.target.files[0]);
                this.file = e.target.files[0];
            },
            changeProperty: function(e) {
                var self = this;
                console.log("i clicked on an image");
                console.log("e.target: ", e);
                self.modal = e.target.src; ///moguce da je ovo too much
                self.id = e.target.id;
                console.log("this id", this.id);
            }
        }
    });
})();
