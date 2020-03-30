Vue.component("img-modal", {
    props: ["id"],
    template: "#modal",
    data: function() {
        return {
            title: "",
            url: "",
            description: "",
            username: "",
            timestamp: "",
            comments: [],
            count: 0,
            previousId: "",
            nextId: "",
            comment: "",
            name: "",
            comment_time: "",
            show: false
        };
    },
    mounted: function() {
        var self = this;
        console.log("this u mounted: ", this);
        console.log("id u get image: ", self.id);
        axios
            .get("/image", {
                params: {
                    id: self.id
                }
            })
            .then(function(response) {
                console.log("response from mounted component: ", response.data);
                self.id = response.data[0].id;
                self.title = response.data[0].title;
                self.url = response.data[0].url;
                self.description = response.data[0].description;
                self.username = response.data[0].username;

                self.timestamp = new Date();
                //self.count = response.data[0].count;
                for (let i = 0; i < response.data.length; i++) {
                    self.comments.push({
                        comment: response.data[i].comment,
                        name: response.data[i].name,
                        comment_time: new Date()
                    });
                    console.log("self.comments: ", self.comments);
                    if (self.comments[0].comment != null) {
                        self.show = true;
                    } else {
                        self.show = false;
                    }
                }
                if (response.data[0].nextId) {
                    self.nextId = response.data[0].nextId;
                } else {
                    self.nextId = "";
                }
                if (response.data[0].previousId) {
                    self.previousId = response.data[0].previousId;
                } else {
                    self.previousId = "";
                }
            })
            .catch(function(error) {
                console.log(error);
            });
    },
    watch: {
        /////probati dry
        id: function() {
            var self = this;
            console.log("self.id: ", self.id);

            axios
                .get("/image", {
                    params: {
                        id: self.id
                    }
                })
                .then(function(response) {
                    console.log(
                        "response from watched component: ",
                        response.data
                    );
                    self.title = response.data[0].title;
                    self.url = response.data[0].url;
                    self.description = response.data[0].description;
                    self.username = response.data[0].username;
                    self.name = response.data[0].name;
                    self.timestamp = response.data[0].created_at;
                    for (let i = 0; i < response.data.length; i++) {
                        self.comments.push({
                            comment: response.data[i].comment,
                            name: response.data[i].name,
                            comment_time: new Date()
                        });
                        console.log("self.comments: ", self.comments);
                        if (self.comments[0].comment != null) {
                            self.show = true;
                        } else {
                            self.show = false;
                        }
                    }
                    if (response.data[0].nextId) {
                        self.nextId = response.data[0].nextId;
                    } else {
                        self.nextId = "";
                    }
                    if (response.data[0].previousId) {
                        self.previousId = response.data[0].previousId;
                    } else {
                        self.previousId = "";
                    }
                })
                .catch(function(error) {
                    console.log(error);
                });
        }
    },
    methods: {
        submitted: function(e) {
            e.preventDefault();
            console.log("submitted emitted");
            console.log("this in submitted: ", this);
            let commentArr = [this.id, this.comment, this.name];
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
                    console.log(
                        "response from post submit: ",
                        response.data[0]
                    );

                    self.comments.push(response.data[0]);
                    console.log("self.comments: ", self.comments);

                    self.show = true;
                })
                .catch(function(error) {
                    console.log("error in post submit: ", error);
                });
        },
        close: function() {
            console.log("clicked on x");
            this.$emit("close");
        },
        del: function() {
            console.log("emit delete");
            let id = this.id;
            this.$emit("del", id);
        },
        next: function() {
            console.log("i clicked next");
            this.comments = [];
            location.hash = this.nextId;
            console.log("this u next: ", self);
        },
        previous: function() {
            console.log("i clicked previous");
            this.comments = [];
            location.hash = this.previousId;
        }
        // count: function() {
        //     self.count++;
        // }
    }
});
