const oracledbSantiago = require('oracledb');

class ConOracleSantiago {

    constructor() {
        return new Promise((resolve, reject) => {
            this.initSantiago().then((con) => {
                this.connectionSantiago = con;
                resolve(con);
            }).catch((err) => {
                reject(err);
            });;
        });
    }

    // RETORNA LA CONEXION
    initSantiago() {
        return new Promise((resolve, reject) => {
            try {
                this.pool = oracledbSantiago.getPool('poolSantiago');
                try {
                    oracledbSantiago.getConnection('poolSantiago').then((con) => {
                        // console.log('CONEXION CREADA');
                        this.connectionSantiago = con;
                        resolve(this.connectionSantiago);
                    }).catch((err) => {
                        console.log('ups');
                        reject(err);
                    });
                } catch (error) {
                    console.log('ERROR AL CREAR CONEXION');
                    console.log(error);
                }
            } catch (error) {
                oracledbSantiago.createPool({
                    user: "CONSULTAS",
                    password: "consultas",
                    connectString: "10.11.130.8:1521/a3100000",
                    poolAlias: 'poolSantiago'
                        // queueTimeout: 600000,

                }).then((pool) => {
                    try {
                        oracledbSantiago.getConnection('poolSantiago').then((con) => {
                            // console.log('CONEXION CREADA');
                            this.connectionSantiago = con;
                            resolve(this.connectionSantiago);
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

    static getConSantiago() {
        return new Promise((resolve, reject) => {
            if (this.connectionSantiago) {
                resolve(this.connectionSantiago);
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

    static ejecutarQueryPr(query) {
        console.log('-------QUERY SANTIAGO-----------');
        return new Promise((resolve, reject) => {
            try {
                this.resultSantiago = this.getConSantiago().then((conn) => {
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
                console.log('ERROR ejecutarQueryPrSantiago');
                console.log(error);
                return reject(error)
            }
        });
    }
}

module.exports = ConOracleSantiago;