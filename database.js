require('dotenv').config();
const URI = process.env['MONGO_URI'];
const mongoose = require('mongoose');

class Database {

    constructor() {
        this.connect();
    }

    connect() {
        mongoose.connect(URI)
        .then(() => {
            console.log('Connected to DB');
        })
        .catch((err) => {
            console.log('DB not connected' + err);
        });
    }
}

module.exports = new Database;