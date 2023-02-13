const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyparser = require('body-parser');

const oracledb = require('oracledb');
const fs = require('fs');

/*
    En Windows y macOS, puede especificar el directorio que contiene las 
    bibliotecas del cliente de Oracle en tiempo de ejecución o antes de 
    que se inicie Node.js. En otras plataformas, la ruta de búsqueda de 
    la biblioteca del sistema siempre debe establecerse antes de iniciar 
    Node.js. Consulte la documentación de instalación de node-oracledb.
    Si la ruta de búsqueda no es correcta, obtendrá un error DPI-1047.
*/
let libPath;
if (process.platform === 'win32') { // Windows
    libPath = 'C:\\oracle\\instantclient_21_8';
} else if (process.platform === 'darwin') { // macOS
    libPath = process.env.HOME + '/Downloads/instantclient_21_8';
}
if (libPath && fs.existsSync(libPath)) {
    console.log('Existe la ruta');
    oracledb.initOracleClient({ libDir: libPath });
} else {
    // Si no existe hay que instalarlo y poner la ruta
    console.log('No existe la ruta del Instant Client, debe ser instalado');
}


class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 8083;

        this.middlewares();
        this.routes();
    }

    routes() {
        this.app.use('/api/persona', require('../routes/persona'));
        this.app.use('/api/llamada/promad/durango', require('../routes/llamadas_reales_dgo'));
        this.app.use('/api/llamada/promad/gomez', require('../routes/llamadas_reales_gomez'));
        this.app.use('/api/llamada/promad/salto', require('../routes/llamadas_reales_salto'));
        this.app.use('/api/llamada/promad/santiago', require('../routes/llamadas_reales_santiago'));
        this.app.use('/api/llamadareal/', require('../routes/llamadas_reales'));
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