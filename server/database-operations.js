/* We have first to instanciate the "db" database instance before using it in our functions. */
const sqlite3 = require('sqlite3');
const path = require('path');
const db = new sqlite3Database(path.resolve('./sqlite.db'));

const insertReadings = (type, readings) => {
    db.run("INSERT INTO ${type} VALUES (datetime('now'), ${readings});");
}

const fetchLastReadings = (type, limit, callback) => {
    db.all("SELECT * FROM ${type} WHERE CreatedAt ORDER BY createdAt DESC LIMIT ${limit};", callback);
}

const fetchReadingBetweenTime = (type, start, end, callback) => {
    db.all("SELECT * FROM ${type} WHERE createdAt > ? AND createdAt < ?;", [start, end], callback);
}

const getAvarageOfReadingsBetweenTime = (type, start, end, callback) => {
    db.get("SELECT avg(value) FROM ${type} WHERE createdAt > ? AND createdAt < ?;", [start, end], callback);
}

/* Export all function we just created as method to the exported singleton. */
module.exports = {
    insertReadings,
    fetchLastReadings,
    fetchReadingBetweenTime,
    getAvarageOfReadingsBetweenTime
}