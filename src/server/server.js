const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyparser = require('body-parser');

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 8083;

        this.middlewares();
        this.routes();
    }

    routes() {
        this.app.use('/api/persona', require('../routes/persona'));
        this.app.use('/registro', require('../routes/registro'));
        this.app.use('/direccion', require('../routes/direccion'));
    }

    middlewares() {
        // BodyParser
        this.app.use(bodyparser.urlencoded({ extended: true, limit: '50mb' }));
        this.app.use(bodyparser.json({ limit: '50mb' }));

        // CORS
        this.app.use(cors(), (req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
            res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
            res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
            next();
        });

        // Lectura y parseo del body
        this.app.use(express.json());

        // Directorio público
        // const publicPath = path.resolve(__dirname, '../public');
        // this.app.use(express.static(publicPath));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('SERVIDOR CORRIENDO EN EL PUERTO ' + this.port);
        })
    }

}





module.exports = Server;