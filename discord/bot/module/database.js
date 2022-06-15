const mysql2 = require('mysql2');


class database {
    constructor(_DB) {
        this.DB = _DB;

        if (this.DB.HOST === undefined || this.DB.USER === undefined || this.DB.PASSWORD === undefined || this.DB.DATABASE === undefined) throw `DB 기본 값 에러`;

        const dbConfig = {
            host: this.DB.HOST,
            user: this.DB.USER,
            password: this.DB.PASSWORD,
            database: this.DB.DATABASE
        }
        this.con = mysql2.createConnection(dbConfig);
    }

    getCon() { return this.con.promise(); };
}

module.exports.database = database;