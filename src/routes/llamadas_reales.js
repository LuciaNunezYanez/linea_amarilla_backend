const { Router } = require('express');
const MySQL = require('../db/mysql');
const router = Router();


// Agrega la llamada a la base de datos propia de este sistema
router.post('/add/', function(req, res) {

    // console.log(req.body);
    try {
        var QUERY = `CALL addLlamadaReal(
            ${req.body.ID_PERSONA || 0},
            ${MySQL.instance.cnn.escape(req.body.FECHA_HORA_INICIO_LLAMADA || '')},
            ${MySQL.instance.cnn.escape(req.body.FECHA_LLAMADA || '')},
            ${MySQL.instance.cnn.escape(req.body.HORA_LLAMADA || '')},
            ${MySQL.instance.cnn.escape(req.body.NUMERO_TELEFONO || '')},
            ${MySQL.instance.cnn.escape(req.body.MOTIVO_TELEFONISTA || '')},
            ${MySQL.instance.cnn.escape(req.body.ES_ALTO_IMPACTO || '')},
            ${req.body.ID_MUNICIPIO || 0},
            ${MySQL.instance.cnn.escape(req.body.MUNICIPIO || '')},
            ${MySQL.instance.cnn.escape(req.body.REFERENCIAS || '')},
            ${MySQL.instance.cnn.escape(req.body.COLONIA || '')},
            ${MySQL.instance.cnn.escape(req.body.CALLE || '')},
            ${MySQL.instance.cnn.escape(req.body.ENTRE_CALLE || '')},
            ${MySQL.instance.cnn.escape(req.body.NUMERO || '')},
            ${MySQL.instance.cnn.escape(req.body.COORDENADA_X || '')},
            ${MySQL.instance.cnn.escape(req.body.COORDENADA_Y || '')},
            ${MySQL.instance.cnn.escape(req.body.DESCRIPCION_DE_LA_LLAMADA || '')},
            ${MySQL.instance.cnn.escape(req.body.NOMBRE_CORPORACION || '')},
            ${MySQL.instance.cnn.escape(req.body.FOLIO_LLAMADA || '')},
            ${MySQL.instance.cnn.escape(req.body.PRIORIDAD || '')},
            ${MySQL.instance.cnn.escape(req.body.NOMBRE_TIPO_RAZONAMIENTO || '')},
            ${MySQL.instance.cnn.escape(req.body.OBSERVACION_RAZONAMIENTO || '')},
            ${MySQL.instance.cnn.escape(req.body.RAZON_NO_ATENCION || '')},
            ${MySQL.instance.cnn.escape(req.body.MOTIVO_RADIO_OPERADOR || '')},
            ${MySQL.instance.cnn.escape(req.body.NOMBRE_DENUNCIANTE || '')},
            ${MySQL.instance.cnn.escape(req.body.CALLE_DENUNCIANTE || '')},
            ${MySQL.instance.cnn.escape(req.body.NUMERO_DENUNCIANTE || '')},
            ${MySQL.instance.cnn.escape(req.body.COLONIA_DENUNCIANTE || '')},
            ${MySQL.instance.cnn.escape(req.body.TELEFONO_DENUNCIANTE || '')},
            ${MySQL.instance.cnn.escape(req.body.MUNICIPIO_DENUNCIANTE || '')},
            ${req.body.CANTIDAD_DETENIDOS || 0},
            ${req.body.CANTIDAD_LESIONADOS || 0},
            ${req.body.CANTIDAD_MUERTOS || 0})`;


        MySQL.ejecutarQueryPr(QUERY).then((results) => {
            if (results.affectedRows >= 1) {
                return res.json({
                    ok: true,
                    mensaje: 'Se registró correctamente la llamada en la base de datos interna',
                });
            } else {
                return res.json({
                    ok: false,
                    mensaje: 'Ocurrió un error al registrar la llamada',
                });
            }
        }).catch(() => {
            return res.json({
                ok: false,
                mensaje: 'Error de servidor (DB).',
                error: 'Error de servidor (DB).'
            });
        });
    } catch (error) {
        return res.json({
            ok: false,
            cod: '2',
            error: error
        });
    };
});

module.exports = router;