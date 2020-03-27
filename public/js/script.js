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
            currentId: location.hash.slice(1),
            comment: null,
            more: "here"
        },
        mounted: function() {
            var self = this;
            axios.get("/images").then(function(response) {
                console.log("response.data: ", response);

                self.images = response.data;
            });
            console.log("location.hash: ", location.hash.slice(1));
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
                //self.modal = e.target.src; ///moguce da je ovo too much
                self.currentId = e.target.id;
                self.id = e.target.id;
                console.log("this id", self.currentId);
            },
            submitComment: function(commentArr) {
                console.log("event je stigao do mene: ", this);
                console.log(commentArr[0]);
                var self = this;
                axios
                    .post("/submit", {
                        params: {
                            imgId: commentArr[0],
                            comment: commentArr[1],
                            name: commentArr[2]
                        }
                    })
                    .then(function(response) {
                        console.log("response from post submit: ", response);
                        self.comment.push(response.data[0]);
                    })
                    .catch(function(error) {
                        console.log("error in post submit: ", error);
                    });
            },
            closeModal: function() {
                console.log("closemodal je dosao do mene");
                var self = this;

                self.currentId = null;
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
            }
        }
    });
})();
