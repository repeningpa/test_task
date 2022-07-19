const sqlite3 = require('sqlite3');
const config = require('config');
const DB = config.get('dbPath');

const dbCon = new sqlite3.Database(DB, (err) => {
    if (err) {
        console.log('Could not connect to database', err)
    }
})

module.exports = dbCon