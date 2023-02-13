const { Router } = require('express');
const router = Router();
const MySQL = require('../db/mysql');


// QUERY DE PRUEBA
router.get('/:id', function(req, res) {
    var query = `SELECT * FROM direccion dir
        LEFT JOIN municipios mun ON dir.fk_id_municipio = mun.id_municipios
        LEFT JOIN estados est ON mun.estado_id = est.id_estados
        WHERE dir.id_direccion= ${req.params.id};`;

    MySQL.ejecutarQueryPr(query).then((results) => {
        if (results[0].id_direccion) {
            return res.json({
                ok: true,
                mensaje: 'Dirección encontrada',
                direccion: results[0]
            });
        } else {
            return res.json({
                ok: true,
                mensaje: 'No se encontró dirección'
            });
        }
    }).catch(() => {
        return res.json({
            ok: false,
            mensaje: 'Error de servidor (DB).',
            error: 'Error de servidor (DB).'
        });
    });
});

module.exports = router;