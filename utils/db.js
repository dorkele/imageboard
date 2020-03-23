const spicedPg = require("spiced-pg");
const db = spicedPg("postgres:postgres:postgres@localhost:5432/image-board");

module.exports.getImages = () => {
    const q = `SELECT url, title FROM images`;
    return db.query(q);
};
