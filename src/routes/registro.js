const { Router } = require('express');
const router = Router();
const MySQL = require('./../mysql/mysql');


// QUERY DE PRUEBA
router.post('/completo/', function(req, res) {

    var body = req.body;
    var tipoPaciente = 'paciente';
    var tipoReferencia = 'referencia';

    // INSERTAR PRIMERO TODA LA INFORMACIÓN DEL PACIENTE
    var queryInsertarPersonaCompleta = `CALL insertarPersonaCompleta(
        ${MySQL.instance.cnn.escape(body.calle || '')},
        ${MySQL.instance.cnn.escape(body.numero_exterior || '')},
        ${MySQL.instance.cnn.escape(body.numero_interior || '')},
        ${MySQL.instance.cnn.escape(body.colonia || '')},
        ${MySQL.instance.cnn.escape(body.cp || '')},
        ${MySQL.instance.cnn.escape(body.entre_calle || '')},
        ${MySQL.instance.cnn.escape(body.referencias || '')},
        ${body.id_municipio || 0},
        ${MySQL.instance.cnn.escape(body.localidad || '')}, 

        ${MySQL.instance.cnn.escape(body.nombre_persona || '')},
        ${MySQL.instance.cnn.escape(body.ap_paterno_persona || '')},
        ${MySQL.instance.cnn.escape(body.ap_materno_persona || '')},
        ${MySQL.instance.cnn.escape(body.curp_persona || '')},
        ${MySQL.instance.cnn.escape(body.nacimiento_persona || '')},
        ${MySQL.instance.cnn.escape(body.genero_persona || '')},
        ${MySQL.instance.cnn.escape(body.usuario_persona || '')},
        ${MySQL.instance.cnn.escape(body.contrasena_persona || '')},
        ${MySQL.instance.cnn.escape(body.tipo_persona || tipoPaciente)},
        ${MySQL.instance.cnn.escape(body.correo_persona || '')},
        ${MySQL.instance.cnn.escape(body.telefono_persona || '')},
        ${MySQL.instance.cnn.escape(body.parentesco_persona || '')},
        ${body.fk_dependencia_persona || 0},
        ${body.fk_paciente_persona || 0},
        ${body.fk_registro_persona || 0},

        ${body.p1 || 0},
        ${body.p2 || 0},
        ${body.p3 || 0},
        ${body.p4 || 0},
        ${body.p5 || 0},
        ${body.p6 || 0},
        ${body.p7 || 0},
        ${body.p8 || 0},
        ${body.p9 || 0},
        ${body.p10 || 0},
        ${body.p11 || 0},
        ${body.p12 || 0},
        ${body.p13 || 0},
        ${body.p14 || 0},
        ${body.p15 || 0}
    );`;

    // console.log(queryInsertarPersonaCompleta);
    MySQL.ejecutarQueryPr(queryInsertarPersonaCompleta).then((results1) => {
        // console.log(results[0][0]); // { id_direccion: 6, id_persona: 7, id_inventario: 6 }

        if (results1[0][0].id_persona > 0) {

            // AHORA AGREGAR A LA REFERENCIA
            var queryInsertarReferenciaCompleta = `CALL insertarReferenciaCompleta(
                ${MySQL.instance.cnn.escape(body.calle_ref || '')},
                ${MySQL.instance.cnn.escape(body.numero_exterior_ref || '')},
                ${MySQL.instance.cnn.escape(body.numero_interior_ref || '')},
                ${MySQL.instance.cnn.escape(body.colonia_ref || '')},
                ${MySQL.instance.cnn.escape(body.cp_ref || '')},
                ${MySQL.instance.cnn.escape(body.entre_calle_ref || '')},
                ${MySQL.instance.cnn.escape(body.referencias_ref || '')},
                ${body.id_municipio_ref || 0},
                ${MySQL.instance.cnn.escape(body.localidad_ref || '')}, 
        
                ${MySQL.instance.cnn.escape(body.nombre_ref || '')},
                ${MySQL.instance.cnn.escape(body.ap_paterno_ref || '')},
                ${MySQL.instance.cnn.escape(body.ap_materno_ref || '')},
                ${MySQL.instance.cnn.escape(body.curp_ref || '')},
                ${MySQL.instance.cnn.escape(body.nacimiento_ref || '')},
                ${MySQL.instance.cnn.escape(body.genero_ref || '')},
                ${MySQL.instance.cnn.escape(body.usuario_ref || '')},
                ${MySQL.instance.cnn.escape(body.contrasena_ref || '')},
                ${MySQL.instance.cnn.escape(body.tipo_ref || tipoReferencia)},
                ${MySQL.instance.cnn.escape(body.correo_ref || '')},
                ${MySQL.instance.cnn.escape(body.telefono_ref || '')},
                ${MySQL.instance.cnn.escape(body.parentesco_ref || '')},
                ${body.fk_dependencia_ref || 0},
                ${body.fk_paciente_ref || results1[0][0].id_persona},
                ${body.fk_registro || 0}
                );`;

            // console.log(queryInsertarReferenciaCompleta);

            MySQL.ejecutarQueryPr(queryInsertarReferenciaCompleta).then((results2) => {
                // Obtener todos los ID's
                const id_persona = results1[0][0].id_persona;
                const id_direccion = results1[0][0].id_direccion;
                const id_inventario = results1[0][0].id_inventario;

                const id_persona_ref = results2[0][0].id_persona;
                const id_direccion_ref = results2[0][0].id_direccion;

                return res.json({
                    ok: true,
                    mensaje: 'Registro finalizado',
                    ids: {
                        id_persona,
                        id_direccion,
                        id_inventario,

                        id_persona_ref,
                        id_direccion_ref
                    }

                });
            }).catch((e) => {
                return res.json({
                    ok: false,
                    mensaje: 'Error de servidor (DB).',
                    error: 'Error de servidor (DB).',
                    e
                });
            });
        } else {
            // No se agregó paciente
            return res.json({
                ok: false,
                mensaje: 'Error al registrar paciente',
                error: 'Error al registrar paciente'
            });
        }
    }).catch((e) => {
        return res.json({
            ok: false,
            mensaje: 'Error de servidor (DB).',
            error: 'Error de servidor (DB).',
            e
        });
    });

});



module.exports = router;