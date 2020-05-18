Vue.component("img-modal", {
    props: ["id"],
    template: "#modal",
    data: function () {
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
            show: false,
        };
    },
    mounted: function () {
        this.getImgData();
    },
    watch: {
        id: function () {
            this.getImgData();
        },
    },
    methods: {
        getImgData: function () {
            var self = this;
            axios
                .get("/image", {
                    params: {
                        id: self.id,
                    },
                })
                .then(function (response) {
                    if (response.data.length == 0) {
                        self.close();
                    } else {
                        self.title = response.data[0].title;
                        self.url = response.data[0].url;
                        self.description = response.data[0].description;
                        self.username = response.data[0].username;
                        self.timestamp = new Date();
                        if (response.data[0].comment != null) {
                            for (let i = 0; i < response.data.length; i++) {
                                self.comments.push({
                                    comment: response.data[i].comment,
                                    name: response.data[i].name,
                                    comment_time: new Date(),
                                });
                                self.show = true;
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
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        submitted: function (e) {
            e.preventDefault();
            let commentArr = [this.id, this.comment, this.name];

            var self = this;
            axios
                .post("/submit", {
                    params: {
                        imgId: commentArr[0],
                        comment: commentArr[1],
                        name: commentArr[2],
                    },
                })
                .then(function (response) {
                    self.comments.push(response.data[0]);
                    self.show = true;
                })
                .catch(function (error) {
                    console.log("error in post submit: ", error);
                });
            this.name = "";
            this.comment = "";
        },
        close: function () {
            this.$emit("close");
        },
        del: function () {
            let id = this.id;
            this.$emit("del", id);
        },
        next: function () {
            console.log("i clicked next");
            this.comments = [];
            location.hash = this.nextId;
            console.log("this u next: ", self);
        },
        previous: function () {
            console.log("i clicked previous");
            this.comments = [];
            location.hash = this.previousId;
        },
        // count: function() {
        //     self.count++;
        // }
    },
});
