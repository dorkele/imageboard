const spicedPg = require("spiced-pg");
const db = spicedPg("postgres:postgres:postgres@localhost:5432/image-board");

module.exports.getImages = () => {
    const q = `SELECT url, title FROM images
    ORDER BY id DESC`;
    return db.query(q);
};

module.exports.addImage = (title, description, username, url) => {
    const q = `INSERT INTO images (title, description, username, url)
    VALUES ($1, $2, $3, $4)
    RETURNING *`;
    const params = [title, description, username, url];
    return db.query(q, params);
};
