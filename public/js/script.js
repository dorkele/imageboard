// console.log("i am linked");

(function() {
    new Vue({
        el: "#main",
        data: {
            id: location.hash.slice(1),
            images: [],
            title: "",
            description: "",
            username: "",
            file: null,
            more: "here"
        },
        mounted: function() {
            var self = this;
            axios.get("/images").then(function(response) {
                console.log("response.data: ", response);

                self.images = response.data;
            });
            console.log("location.hash: ", location.hash.slice(1));
            window.addEventListener("hashchange", function() {
                console.log("location.hash: ", location.hash);
                self.id = location.hash.slice(1);
                console.log("self.id: ", self.id);
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
                console.log(e);
                e.target.form.reset();
            },
            handleChange: function(e) {
                console.log("handleChange is running");
                console.log("file: ", e.target.files[0]);
                this.file = e.target.files[0];
            },
            closeModal: function() {
                console.log("closemodal je dosao do mene");
                location.hash = "";
            },
            moreClick: function() {
                console.log("more button was clicked");
                console.log("self.images: ", this.images);
                var self = this;
                var i = self.images.length - 1;
                var lastId = self.images[i].id;

                console.log("last.id: ", lastId);
                axios
                    .get("/next", {
                        params: {
                            lastId: self.images[i].id
                        }
                    })
                    .then(function(response) {
                        console.log("response in next: ", response.data);
                        for (var i = 0; i < response.data.length; i++) {
                            self.images.push(response.data[i]);
                            console.log("more related: ", response.data[i].id);
                            console.log(
                                "other more related: ",
                                response.data[0].lastId
                            );

                            lastId = response.data[0].lastId;
                            if (
                                response.data[i].lastId == response.data[i].id
                            ) {
                                self.more = null;
                            }
                        }
                    })
                    .catch(function(error) {
                        console.log("error in next: ", error);
                    });
            },
            deleteImage: function(id) {
                console.log("tu sam u delete image i gledam imam li id: ", id);
                var self = this;
                axios
                    .delete("/image", {
                        data: {
                            id: id
                        }
                    })
                    .then(function() {
                        console.log("image should be deleted: ");
                        location.hash = "";
                        console.log("images array: ", self.images);
                        for (var i = 0; i < self.images.length; i++) {
                            if (self.images[i].id == id) {
                                self.images.splice(i, 1);
                            }
                        }
                    })
                    .catch(function(error) {
                        console.log(error);
                    });
            }
        }
    });
})();
