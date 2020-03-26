DROP TABLE IF EXISTS comments;

CREATE TABLE comments(
    id SERIAL PRIMARY KEY,
    username VARCHAR,
    comment VARCHAR,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    img_id INT REFERENCES images(id)
);