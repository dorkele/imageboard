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
            name: "",
            count: 0,
            previousId: "",
            nextId: ""
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
                //self.timestamp = response.data[0].created_at;
                //self.count = response.data[0].count;
                for (let i = 0; i < response.data.length; i++) {
                    self.comments.push(response.data[i].comment);
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
                //self.comments.unshift(response.data[0].comment);
            })
            .catch(function(error) {
                console.log(error);
            });
    },
    watch: {
        /////probati dry
        id: function() {
            var self = this;
            axios
                .get("/image", {
                    params: {
                        id: self.id
                    }
                })
                .then(function(response) {
                    console.log(
                        "response from mounted component: ",
                        response.data
                    );
                    self.title = response.data[0].title;
                    self.url = response.data[0].url;
                    self.description = response.data[0].description;
                    self.username = response.data[0].username;
                    //self.timestamp = response.data[0].created_at;
                    for (let i = 0; i < response.data.length; i++) {
                        self.comments.push(response.data[i].comment);
                    }
                    //self.comments.unshift(response.data[0].comment);
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
            this.$emit("submitted", commentArr);
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
            location.hash = this.nextId;
            console.log("this.nextId: ", this.nextId);
        },
        previous: function() {
            console.log("i clicked previous");
            location.hash = this.previousId;
        }
        // count: function() {
        //     self.count++;
        // }
    }
});
