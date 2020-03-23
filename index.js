const express = require("express");
const app = express();
const db = require("./utils/db");

app.use(express.static("public"));

let images = [];

app.get("/images", (req, res) => {
    console.log("/images route has been hit");
    db.getImages()
        .then(result => {
            console.log(result.rows);
            images = result.rows;
            res.json(images);
        })
        .catch(error => {
            console.log(error);
        });
});

app.listen(8080, () => console.log("IB server is listening..."));
