const mysql = require('mysql');

class MySQL {

    constructor() {

        console.log('Clase de MySQL inicializada');

        this.cnn = mysql.createPool({
            connectionLimit: 100,
            host: process.env.HOST || '10.11.118.91',
            user: process.env.USERDB || 'root',
            password: process.env.PASSWORDB || 'M7750la?',
            database: process.env.NAMEDATABASE || 'db_linea_amarilla',
            debug: false,
            waitForConnections: true
        });

        this.hasError();
    }

    // Evita que se creen varias instancias de la clase 
    static get instance() {
        return this._instance || (this._instance = new this());
    }

    static ejecutarQueryPr(query) {
        return new Promise((resolve, reject) => {
            this.instance.cnn.query(query, (err, results, fields) => {
                if (err) {
                    console.log('======== Error al ejecutar query (promesa) ========');
                    // console.log(query);
                    // console.log(err);
                    // console.log('=========================================');
                    return reject(err)
                }
                if (results.length === 0) {
                    resolve('El registro solicitado no existe');
                } else {
                    resolve(results);
                }
            });

        });
    }

    hasError() {
        this.cnn.on('error', (error) => {
            console.log('OCURRIO UN ERROR');
            console.log(error.message);
            console.log('.............');
            console.log(error);
        });

        this.cnn.on('connection', (con) => {
            console.log('MySQL conectado... ');
        });
    }


}


module.exports = MySQL;