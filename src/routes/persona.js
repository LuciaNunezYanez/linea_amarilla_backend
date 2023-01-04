const { Router } = require('express');
const router = Router();
const MySQL = require('./../mysql/mysql');


router.get('/id/:id', function(req, res) {
    var query = `CALL getPersonaDirInv(${req.params.id});`;

    MySQL.ejecutarQueryPr(query).then((results) => {
        return res.json({
            ok: true,
            persona: results[0][0]
        });
    }).catch(() => {
        return res.json({
            ok: false,
            mensaje: 'Error de servidor (DB).',
            error: 'Error de servidor (DB).'
        });
    });
});

router.get('/fkpaciente/:id', function(req, res) {

    // Trae las personas relacionadas a un paciente
    var query = `CALL getPersonaDirfkpaciente(${req.params.id});`;

    MySQL.ejecutarQueryPr(query).then((results) => {
        return res.json({
            ok: true,
            persona: results[0]
        });
    }).catch(() => {
        return res.json({
            ok: false,
            mensaje: 'Error de servidor (DB).',
            error: 'Error de servidor (DB).'
        });
    });
});



router.post('/busqueda/filtro', function(req, res) {
    var query = `CALL getPersonasTipo(
        ${MySQL.instance.cnn.escape(req.body.fecha1 || '')},
        ${MySQL.instance.cnn.escape(req.body.fecha2 || '')},
        ${MySQL.instance.cnn.escape(req.body.tipo_persona || '')},
        ${MySQL.instance.cnn.escape(req.body.estatus_seguimiento || '')});`;

    console.log(query);
    // return;

    MySQL.ejecutarQueryPr(query).then((results) => {
        return res.json({
            ok: true,
            personas: results[0]
        });
    }).catch(() => {
        return res.json({
            ok: false,
            mensaje: 'Error de servidor (DB).',
            error: 'Error de servidor (DB).'
        });
    });
});

router.post('/busqueda', function(req, res) {
    var query = `CALL getPersona(
        ${MySQL.instance.cnn.escape(req.body.nombre_persona || '')},
        ${MySQL.instance.cnn.escape(req.body.ap_paterno_persona || '')},
        ${MySQL.instance.cnn.escape(req.body.ap_materno_persona || '')},
        ${MySQL.instance.cnn.escape(req.body.tipo_persona || '')},
        ${MySQL.instance.cnn.escape(req.body.correo_persona || '')},
        ${MySQL.instance.cnn.escape(req.body.telefono_persona || '')},
        ${req.body.estatus_persona || 1});`;

    // console.log(query);

    MySQL.ejecutarQueryPr(query).then((results) => {
        return res.json({
            ok: true,
            personas: results[0]
        });
    }).catch(() => {
        return res.json({
            ok: false,
            mensaje: 'Error de servidor (DB).',
            error: 'Error de servidor (DB).'
        });
    });
});

router.post('/login/usuario', function(req, res) {
    // Corroborar que se hayan recibido los tres parametros
    if (!req.body.usuario || !req.body.contrasena || !req.body.tipo) {
        return res.json({
            ok: false,
            mensaje: 'Información incompleta',
            error: 'Información incompleta'
        });
    }

    var query = `CALL loginUsuario(
        ${MySQL.instance.cnn.escape(req.body.usuario)},
        ${MySQL.instance.cnn.escape(req.body.contrasena)},
        ${MySQL.instance.cnn.escape(req.body.tipo)});`;

    // console.log(query);

    MySQL.ejecutarQueryPr(query).then((results) => {
        // Comprobar si hay un usuario
        if (results[0][0] === undefined) {
            return res.json({
                ok: true,
                mensaje: 'No existe ningún usuario con los parametros solicitados',
            });
        }
        const data = results[0][0];

        const objPersona = {
            id_persona: data.id_persona,
            nombre_persona: data.nombre_persona,
            ap_paterno_persona: data.ap_paterno_persona,
            ap_materno_persona: data.ap_materno_persona,
            usuario_persona: data.usuario_persona,
            tipo_persona: data.tipo_persona,

            nombre_dependencia: data.nombre_dependencia,
            departamento_dependencia: data.departamento_dependencia
        };

        return res.json({
            ok: true,
            mensaje: 'Éxito al iniciar sesión',
            persona: objPersona
        });
    }).catch(() => {
        return res.json({
            ok: false,
            mensaje: 'Error de servidor (DB).',
            error: 'Error de servidor (DB).'
        });
    });
});

router.post('/login/correo', function(req, res) {
    // Corroborar que se hayan recibido los tres parametros
    if (!req.body.correo || !req.body.contrasena || !req.body.tipo) {
        return res.json({
            ok: false,
            mensaje: 'Información incompleta',
            error: 'Información incompleta'
        });
    }

    var query = `CALL loginCorreo(
        ${MySQL.instance.cnn.escape(req.body.correo)},
        ${MySQL.instance.cnn.escape(req.body.contrasena)},
        ${MySQL.instance.cnn.escape(req.body.tipo)});`;

    // console.log(query);

    MySQL.ejecutarQueryPr(query).then((results) => {
        console.log(results[0][0]);
        // Comprobar si hay un usuario
        if (results[0][0] === undefined) {
            return res.json({
                ok: true,
                mensaje: 'No existe ningún usuario con los parametros solicitados',
            });
        }
        const data = results[0][0];

        const objPersona = {
            id_persona: data.id_persona,
            nombre_persona: data.nombre_persona,
            ap_paterno_persona: data.ap_paterno_persona,
            ap_materno_persona: data.ap_materno_persona,
            genero_persona: data.genero_persona,
            correo_persona: data.correo_persona,
            telefono_persona: data.telefono_persona
        };

        const objDireccion = {
            id_direccion: data.id_direccion,
            calle: data.calle,
            numero_exterior: data.numero_exterior,
            numero_interior: data.numero_interior,
            colonia: data.colonia,
            cp: data.cp,
            entre_calle: data.entre_calle,
            referencias: data.referencias,
            fk_id_municipio: data.fk_id_municipio,
            localidad: data.localidad,
            id_municipios: data.id_municipios,
            estado_id: data.estado_id,
            clave_municipio: data.clave_municipio,
            nombre_municipio: data.nombre_municipio,
            activo_mun: data.activo_mun,
            id_estados: data.id_estados,
            clave_estado: data.clave_estado,
            nombre_estado: data.nombre_estado,
            abrev: data.abrev,
            activo_ests: data.activo_ests
        };

        return res.json({
            ok: true,
            mensaje: 'Éxito al iniciar sesión',
            persona: objPersona,
            direccion: objDireccion,
            inventario: {},
            referencia: {},
            direccionRef: {}
        });
    }).catch(() => {
        return res.json({
            ok: false,
            mensaje: 'Error de servidor (DB).',
            error: 'Error de servidor (DB).'
        });
    });
});



module.exports = router;