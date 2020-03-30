const express = require("express");
const app = express();
const db = require("./utils/db");
const s3 = require("./s3");
const conf = require("./config");
////////FILE UPLOAD BOILERPLATE/////////////////////////////////////////////
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");

const diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});
/////////////////////////////////////////////////////////////////////
app.use(express.json());
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

app.post("/upload", uploader.single("file"), s3.upload, function(req, res) {
    console.log("file: ", req.file);
    console.log("req.body: ", req.body);

    let imageUrl = conf.s3Url + req.file.filename;
    let title = req.body.title;
    let description = req.body.description;
    let username = req.body.username;
    db.addImage(title, description, username, imageUrl)
        .then(response => {
            images.unshift(response.rows);
            if (req.file) {
                console.log(req.file);
                res.json(images);
            } else {
                res.json({
                    success: false
                });
            }
        })
        .catch(error => {
            console.log(error);
        });
});

app.get("/image", (req, res) => {
    console.log("get image(one) route has been hit: ", req.query.id);
    console.log(req.query.id);
    let id = req.query.id;

    db.getImage(id)
        .then(response => {
            console.log("response in get image: ", response.rows);
            res.json(response.rows);
        })
        .catch(error => {
            console.log(error);
        });
});

app.post("/submit", (req, res) => {
    console.log("post submit route has been hit: ", req.body.params);
    let imgId = req.body.params.imgId;
    let comment = req.body.params.comment;
    let username = req.body.params.name;
    db.addComment(username, comment, imgId)
        .then(response => {
            console.log("response in post comment submit: ", response.rows);

            console.log("kometar je u tablici");
            res.json(response.rows);
        })
        .catch(error => {
            console.log(error);
        });
});

app.get("/next", (req, res) => {
    console.log("get next route has been hit: ", req.query);
    let lastId = req.query.lastId;
    db.nextImages(lastId)
        .then(response => {
            console.log("response u nextImages: ", response.rows);
            res.json(response.rows);
        })
        .catch(error => {
            console.log("error u nextImages: ", error);
        });
});

app.delete("/image", (req, res) => {
    console.log("post?? delete route has been hit: ", req.body.id);
    let id = req.body.id;
    db.deleteImage(id)
        .then(response => {
            console.log("i believe image is deleted: ", response);
            res.json(response);
        })
        .catch(error => {
            console.log("error u delete image: ", error);
        });
});

app.listen(8080, () => console.log("IB server is listening..."));
