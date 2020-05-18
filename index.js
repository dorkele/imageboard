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
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});
/////////////////////////////////////////////////////////////////////
app.use(express.json());
app.use(express.static("public"));

let images = [];

app.get("/images", (req, res) => {
    db.getImages()
        .then((result) => {
            images = result.rows;
            res.json(images);
        })
        .catch((error) => {
            console.log(error);
        });
});

app.post("/upload", uploader.single("file"), s3.upload, function (req, res) {
    let imageUrl = conf.s3Url + req.file.filename;
    let title = req.body.title;
    let description = req.body.description;
    let username = req.body.username;
    db.addImage(title, description, username, imageUrl)
        .then((response) => {
            images.unshift(response.rows);
            if (req.file) {
                res.json(images);
            } else {
                res.json({
                    success: false,
                });
            }
        })
        .catch((error) => {
            console.log(error);
        });
});

app.get("/image", (req, res) => {
    let id = req.query.id;
    db.getImage(id)
        .then((response) => {
            res.json(response.rows);
        })
        .catch((error) => {
            console.log(error);
        });
});

app.post("/submit", (req, res) => {
    let imgId = req.body.params.imgId;
    let comment = req.body.params.comment;
    let username = req.body.params.name;
    db.addComment(username, comment, imgId)
        .then((response) => {
            res.json(response.rows);
        })
        .catch((error) => {
            console.log(error);
        });
});

app.get("/next", (req, res) => {
    let lastId = req.query.lastId;
    db.nextImages(lastId)
        .then((response) => {
            res.json(response.rows);
        })
        .catch((error) => {
            console.log("error u nextImages: ", error);
        });
});

app.delete("/image", (req, res) => {
    let id = req.body.id;
    db.deleteImage(id)
        .then((response) => {
            res.json(response);
        })
        .catch((error) => {
            console.log("error u delete image: ", error);
        });
});

app.listen(8080, () => console.log("IB server is listening..."));
