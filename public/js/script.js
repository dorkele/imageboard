(function () {
    new Vue({
        el: "#main",
        data: {
            id: location.hash.slice(1),
            images: [],
            title: "",
            description: "",
            username: "",
            file: null,
            more: "here",
        },
        mounted: function () {
            var self = this;
            axios.get("/images").then(function (response) {
                self.images = response.data;
            });
            window.addEventListener("hashchange", function () {
                window.scrollTo(0, 0);
                self.id = location.hash.slice(1);
            });
        },
        methods: {
            handleClick: function (e) {
                e.preventDefault();
                var self = this;
                var formData = new FormData();
                formData.append("title", this.title);
                formData.append("description", this.description);
                formData.append("username", this.username);
                formData.append("file", this.file);
                axios
                    .post("/upload", formData)
                    .then(function (response) {
                        self.images.unshift(response.data[0][0]);
                    })
                    .catch(function (error) {
                        console.log("error in post upload: ", error);
                    });
                this.title = "";
                this.description = "";
                this.username = "";
                this.file = "";
            },
            handleChange: function (e) {
                this.file = e.target.files[0];
            },
            closeModal: function () {
                location.hash = "";
            },
            moreClick: function () {
                var self = this;
                var i = self.images.length - 1;
                axios
                    .get("/next", {
                        params: {
                            lastId: self.images[i].id,
                        },
                    })
                    .then(function (response) {
                        for (var i = 0; i < response.data.length; i++) {
                            self.images.push(response.data[i]);
                            if (
                                response.data[i].lastId == response.data[i].id
                            ) {
                                self.more = null;
                            }
                        }
                    })
                    .catch(function (error) {
                        console.log("error in next: ", error);
                    });
            },
            deleteImage: function (id) {
                var self = this;
                axios
                    .delete("/image", {
                        data: {
                            id: id,
                        },
                    })
                    .then(function () {
                        location.hash = "";
                        for (var i = 0; i < self.images.length; i++) {
                            if (self.images[i].id == id) {
                                self.images.splice(i, 1);
                            }
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            },
        },
    });
})();
