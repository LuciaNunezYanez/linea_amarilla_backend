const oracledbGomez = require('oracledb');

class ConOracleGomez {

    constructor() {
        return new Promise((resolve, reject) => {
            this.initGomez().then((con) => {
                this.connectionGomez = con;
                resolve(con);
            }).catch((err) => {
                reject(err);
            });;
        });
    }

    // RETORNA LA CONEXION
    initGomez() {
        return new Promise((resolve, reject) => {
            try {
                this.pool = oracledbGomez.getPool('poolGomez');
                try {
                    oracledbGomez.getConnection('poolGomez').then((con) => {
                        this.connectionGomez = con;
                        resolve(this.connectionGomez);
                    }).catch((err) => {
                        console.log('ups');
                        reject(err);
                    });
                } catch (error) {
                    console.log('ERROR AL CREAR POOL');
                    console.log(error);
                }
            } catch (error) {
                oracledbGomez.createPool({
                    user: "CONSULTAS",
                    password: "consultasgp",
                    connectString: "10.11.42.8:1521/a2100000",
                    poolAlias: 'poolGomez'
                        // queueTimeout: 600000,

                }).then((pool) => {
                    // this.poolGomez = pool;
                    try {
                        oracledbGomez.getConnection('poolGomez').then((con) => {
                            // console.log('CONEXION CREADA');
                            this.connectionGomez = con;
                            resolve(this.connectionGomez);
                        }).catch((err) => {
                            console.log('ups');
                            reject(err);
                        });
                    } catch (error) {
                        console.log('ERROR AL CREAR CONEXION');
                        console.log(error);
                    }
                }).catch((err) => {
                    console.log(err);
                    console.log('POOL NO CREADO');
                });
            }
        });
    }

    static getConGomez() {
        return new Promise((resolve, reject) => {
            if (this.connectionGomez) {
                resolve(this.connectionGomez);
            } else {
                new this().then((con) => {
                    resolve(con);
                }).catch((err) => {
                    console.log(err);
                    console.log('CATCH1');
                    reject(err);
                })
            }
        })
    }

    static ejecutarQueryPrGomez(query) {
        console.log('-------QUERY GOMEZ-----------');
        return new Promise((resolve, reject) => {
            try {
                this.resultGomez = this.getConGomez().then((conn) => {
                    conn.execute(query).then((res) => {
                        // Liberar la conexión después de usarla
                        conn.close();
                        return resolve(res.rows);
                    }).catch((err) => {
                        console.log('err');
                        console.log(err);
                    });
                }).catch((err) => {
                    return reject(err);
                })

            } catch (error) {
                console.log('ERROR ejecutarQueryPrGomez');
                console.log(error);
                return reject(error)
            }
        });
    }
}

module.exports = ConOracleGomez;