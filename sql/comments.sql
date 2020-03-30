DROP TABLE IF EXISTS comments;

CREATE TABLE comments(
    id SERIAL PRIMARY KEY,
    name VARCHAR,
    comment VARCHAR,
    comment_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    img_id INT REFERENCES images(id) ON DELETE CASCADE
);