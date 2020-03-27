const spicedPg = require("spiced-pg");
const db = spicedPg("postgres:postgres:postgres@localhost:5432/image-board");

module.exports.getImages = () => {
    const q = `SELECT * FROM images
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

module.exports.getImage = id => {
    const q = `SELECT * FROM images
    JOIN comments ON img_id = images.id
    WHERE images.id=$1
    `;
    const params = [id];
    return db.query(q, params);
};

module.exports.addComment = (username, comment, imgId) => {
    const q = `INSERT INTO comments (username, comment, img_id)
    VALUES ($1, $2, $3)
    RETURNING *`;
    const params = [username, comment, imgId];
    return db.query(q, params);
};

module.exports.getComments = imgId => {
    const q = `SELECT * FROM comments
    WHERE img_id=$1`;
    const params = [imgId];
    return db.query(q, params);
};
