const oracledbSalto = require('oracledb');

class ConOracleSalto {

    constructor() {
        return new Promise((resolve, reject) => {
            this.init().then((con) => {
                this.connectionSalto = con;
                resolve(con);
            }).catch((err) => {
                reject(err);
            });;
        });
    }

    // RETORNA LA CONEXION
    init() {
        return new Promise((resolve, reject) => {

            try {
                this.pool = oracledbSalto.getPool('poolSalto');
                try {
                    oracledbSalto.getConnection('poolSalto').then((con) => {
                        // console.log('CONEXION CREADA');
                        this.connectionSalto = con;
                        resolve(this.connectionSalto);
                    }).catch((err) => {
                        console.log('ups');
                        reject(err);
                    });
                } catch (error) {
                    console.log('ERROR AL CREAR CONEXION');
                    console.log(error);
                }
            } catch (error) {
                oracledbSalto.createPool({
                    user: "CONSULTAS",
                    password: "consultas",
                    connectString: "10.11.20.8:1521/a4100000",
                    poolAlias: 'poolSalto'
                        // queueTimeout: 600000,

                }).then((pool) => {
                    try {
                        oracledbSalto.getConnection('poolSalto').then((con) => {
                            // console.log('CONEXION CREADA');
                            this.connectionSalto = con;
                            resolve(this.connectionSalto);
                        }).catch((err) => {
                            console.log('ups');
                            reject(err);
                        });
                    } catch (error) {
                        console.log('ERROR AL CREAR CONEXION');
                        console.log(error);
                    }

                }).catch(() => {
                    console.log('POOL NO CREADO');
                });
            }

        });
    }

    static getConSalto() {
        return new Promise((resolve, reject) => {
            if (this.connectionSalto) {
                resolve(this.connectionSalto);
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

    static ejecutarQueryPrSalto(query) {
        console.log('-------QUERY EL SALTO-----------');
        return new Promise((resolve, reject) => {
            try {
                this.resultSalto = this.getConSalto().then((conn) => {
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
                console.log('ERROR ejecutarQueryPrSalto');
                console.log(error);
                return reject(error)
            }
        });
    }
}

module.exports = ConOracleSalto;