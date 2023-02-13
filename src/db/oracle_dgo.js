const oracledbDgo = require('oracledb');

class ConOracleDgo {

    constructor() {
        return new Promise((resolve, reject) => {
            this.initDgo().then((con) => {
                this.connectionDgo = con;
                resolve(con);
            }).catch((err) => {
                reject(err);
            });;
        });
    }

    // RETORNA LA CONEXION
    initDgo() {
        return new Promise((resolve, reject) => {

            try {
                this.pool = oracledbDgo.getPool('poolDgo');
                try {
                    oracledbDgo.getConnection('poolDgo').then((con) => {
                        this.connectionDgo = con;
                        resolve(this.connectionDgo);
                    }).catch((err) => {
                        console.log('ups');
                        reject(err);
                    });
                } catch (error) {
                    console.log('ERROR AL CREAR POOL');
                    console.log(error);
                }
            } catch (error) {
                oracledbDgo.createPool({
                    user: "CONSULTAS",
                    password: "consultas",
                    connectString: "10.11.102.31:1521/a010rac",
                    poolAlias: 'poolDgo'
                        // queueTimeout: 600000,

                }).then((pool) => {
                    // this.poolDgo = pool;
                    try {
                        oracledbDgo.getConnection('poolDgo').then((con) => {
                            // console.log('CONEXION CREADA');
                            this.connectionDgo = con;
                            resolve(this.connectionDgo);
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

    static getConDgo() {
        return new Promise((resolve, reject) => {
            if (this.connectionDgo) {
                resolve(this.connectionDgo);
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

    static ejecutarQueryPrDgo(query) {
        console.log('-------QUERY DURANGO-----------');
        return new Promise((resolve, reject) => {
            try {
                this.resultDgo = this.getConDgo().then((conn) => {
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
                console.log('ERROR ejecutarQueryPrDgo');
                console.log(error);
                return reject(error)
            }
        });
    }
}

module.exports = ConOracleDgo;