Vue.component("img-modal", {
    props: ["id"],
    template: "#modal",
    data: function() {
        return {
            title: "",
            url: "",
            description: "",
            username: "",
            timestamp: ""
        };
    },
    mounted: function() {
        var self = this;
        axios
            .get("/image/", {
                params: {
                    id: self.id
                }
            })
            .then(function(response) {
                console.log(
                    "response from mounted component: ",
                    response.data[0]
                );
                self.title = response.data[0].title;
                self.url = response.data[0].url;
                self.description = response.data[0].description;
                self.username = response.data[0].username;
                self.timestamp = response.data[0].created_at;
            })
            .catch(function(error) {
                console.log(error);
            });
    }
});

Vue.component("comment-form", {
    template: "#form"
});
