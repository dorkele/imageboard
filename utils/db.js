const spicedPg = require("spiced-pg");
const db = spicedPg("postgres:postgres:postgres@localhost:5432/image-board");

module.exports.getImages = () => {
    const q = `SELECT * FROM images
    ORDER BY id DESC
    LIMIT 9`;
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
    const q = `SELECT *, (
        SELECT id FROM images
        WHERE images.id > $1
        LIMIT 1
        ) AS "previousId", (
            SELECT id FROM images
            WHERE images.id < $1
            LIMIT 1
        ) AS "nextId"
        FROM images
        LEFT OUTER JOIN comments ON img_id = images.id
        WHERE images.id=$1
        `;
    const params = [id];
    return db.query(q, params);
};

module.exports.addComment = (username, comment, imgId) => {
    const q = `INSERT INTO comments (name, comment, img_id)
    VALUES ($1, $2, $3)
    RETURNING *`;
    const params = [username, comment, imgId];
    return db.query(q, params);
};

module.exports.nextImages = lastId => {
    const q = `SELECT url, title, id, (
                    SELECT id FROM images
                    ORDER BY id ASC
                    LIMIT 1
                ) AS "lastId" FROM images
                WHERE id < $1
                ORDER BY id DESC
                LIMIT 3`;
    const params = [lastId];
    return db.query(q, params);
};

module.exports.deleteImage = id => {
    const q = `DELETE FROM images
    WHERE id=$1`;
    const params = [id];
    return db.query(q, params);
};
