/* We have first to instanciate the "db" database instance before using it in our functions. */
const sqlite3 = require('sqlite3');
const path = require('path');
const db = new sqlite3.Database(path.resolve('./server/sqlite.db'));

// Define the SQL query to create an index on the 'createdAt' column
const createTemperatureIndexQuery = 'CREATE INDEX IF NOT EXISTS idx_temperature_createdAt ON temperature(createdAt)';
const createHumidityIndexQuery = 'CREATE INDEX IF NOT EXISTS idx_humidity_createdAt ON humidity(createdAt)';

db.run(createTemperatureIndexQuery);
db.run(createHumidityIndexQuery);

const insertReadings = (type, readings) => {
    db.run(`INSERT INTO ${type} VALUES (datetime('now', 'localtime'), ${readings});`);
}

const fetchLastReadings = (type, limit, callback) => {
    db.all(`SELECT * FROM ${type} WHERE CreatedAt ORDER BY createdAt DESC LIMIT ${limit};`, callback);
}

const fetchReadingBetweenTime = (type, start, end, callback) => {
    db.all(`SELECT * FROM ${type} WHERE createdAt > ? AND createdAt < ?;`, [start, end], callback);
}

const fetchTodayReadings = (type, start, end, callback) => {
    db.all(`
    SELECT temperature.createdAt AS timestamp,
            MAX(temperature.value) AS temperature,
            MAX(humidity.value) AS humidity
    FROM temperature
    LEFT JOIN humidity ON temperature.createdAt = humidity.createdAt
    WHERE temperature.createdAt >= ?
        AND temperature.createdAt <= ?
        AND strftime('%M', temperature.createdAt) % 15 = 0
    GROUP BY strftime('%Y-%m-%dT%H:%M:00', temperature.createdAt)
  `, [start, end], callback);
}

const getAvarageOfReadingsBetweenTime = (type, start, end, callback) => {
    db.get(`SELECT avg(value) FROM ${type} WHERE createdAt > ? AND createdAt < ?;`, [start, end], callback);
}

/* Export all function we just created as method to the exported singleton. */
module.exports = {
    insertReadings,
    fetchLastReadings,
    fetchReadingBetweenTime,
    fetchTodayReadings,
    getAvarageOfReadingsBetweenTime
}