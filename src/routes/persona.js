const { Router } = require('express');
const router = Router();
const MySQL = require('../db/mysql');


router.get('/id/:id', function(req, res) {
    // Obtiene la persona, su dirección y su inventario
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
            // Se utiliza en la pantalla de pacientes
            var query = `CALL getPersonasTipo(
        ${MySQL.instance.cnn.escape(req.body.fecha1 || '')},
        ${MySQL.instance.cnn.escape(`${req.body.fecha2} 23:59:59` || '')},
        ${MySQL.instance.cnn.escape(req.body.tipo_persona || '')},
        ${MySQL.instance.cnn.escape(req.body.estatus_seguimiento || '')},
        ${MySQL.instance.cnn.escape(req.body.nombre || '')},
        ${MySQL.instance.cnn.escape(req.body.paterno || '')},
        ${MySQL.instance.cnn.escape(req.body.materno || '')},
        ${MySQL.instance.cnn.escape(req.body.telefono || '')}
        );`;

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
    // Obtiene una persona en especifico
    var query = `CALL getPersona(
        ${MySQL.instance.cnn.escape(req.body.nombre_persona || '')},
        ${MySQL.instance.cnn.escape(req.body.ap_paterno_persona || '')},
        ${MySQL.instance.cnn.escape(req.body.ap_materno_persona || '')},
        ${MySQL.instance.cnn.escape(req.body.tipo_persona || '')},
        ${MySQL.instance.cnn.escape(req.body.correo_persona || '')},
        ${MySQL.instance.cnn.escape(req.body.telefono_persona || '')},
        ${req.body.estatus_persona || 1});`;

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

router.post('/busqueda/usuarios', function(req, res) {
    // Se utiliza en la pantalla de usuarios 
    var query = `CALL getUsuarios(
        ${MySQL.instance.cnn.escape(req.body.nombre || '')},
        ${MySQL.instance.cnn.escape(req.body.paterno || '')},
        ${MySQL.instance.cnn.escape(req.body.materno || '')},
        ${MySQL.instance.cnn.escape(req.body.usuario || '')},
        ${MySQL.instance.cnn.escape(req.body.tipo || '')});`;

    MySQL.ejecutarQueryPr(query).then((results) => {
        return res.json({
            ok: true,
            usuarios: results[0]
        });
    }).catch(() => {
        return res.json({
            ok: false,
            mensaje: 'Error de servidor (DB).',
            error: 'Error de servidor (DB).'
        });
    });
});

// EDICIÓN
// EDICIÓN
// EDICIÓN
// EDICIÓN
// EDICIÓN
// EDICIÓN
// EDICIÓN

router.put('/edit/persona/unica/:id', function(req, res) {
    // console.log(req.body);
    // Para editar solamente en la tabla de personas

    var UPDATE = `UPDATE db_linea_amarilla.persona `
    var SET = `SET `;
    var WHERE = ` WHERE id_persona = ${req.params.id}`;
	
    // Comprobar que venga cada parametro para hacer la edición
    if(req.body.nombre_persona != undefined){
        SET = SET + ` nombre_persona = ${MySQL.instance.cnn.escape(req.body.nombre_persona)}, `
    }
    if(req.body.ap_paterno_persona != undefined){
        SET = SET + ` ap_paterno_persona = ${MySQL.instance.cnn.escape(req.body.ap_paterno_persona)}, `
    }
    if(req.body.ap_materno_persona != undefined){
        SET = SET + ` ap_materno_persona = ${MySQL.instance.cnn.escape(req.body.ap_materno_persona)}, `
    }
    if(req.body.curp_persona != undefined){
        SET = SET + ` curp_persona = ${MySQL.instance.cnn.escape(req.body.curp_persona)}, `
    }
    if(req.body.nacimiento_persona != undefined){
        SET = SET + ` nacimiento_persona = ${MySQL.instance.cnn.escape(req.body.nacimiento_persona)}, `
    }
    if(req.body.genero_persona != undefined){
        SET = SET + ` genero_persona = ${MySQL.instance.cnn.escape(req.body.genero_persona)}, `
    }
    if(req.body.usuario_persona != undefined){
        SET = SET + ` usuario_persona = ${MySQL.instance.cnn.escape(req.body.usuario_persona)}, `
    }
    if(req.body.contrasena_persona != undefined){
        SET = SET + ` contrasena_persona = ${MySQL.instance.cnn.escape(req.body.contrasena_persona)}, `
    }
    if(req.body.tipo_persona != undefined){
        SET = SET + ` tipo_persona = ${MySQL.instance.cnn.escape(req.body.tipo_persona)}, `
    }
    if(req.body.permiso_consulta >= 0){
        SET = SET + ` permiso_consulta = ${req.body.permiso_consulta}, `
    }
    if(req.body.permiso_admin >= 0){
        SET = SET + ` permiso_admin = ${req.body.permiso_admin}, `
    }
    if(req.body.correo_persona != undefined){
        SET = SET + ` correo_persona = ${MySQL.instance.cnn.escape(req.body.correo_persona)}, `
    }
    if(req.body.telefono_persona != undefined){
        SET = SET + ` telefono_persona = ${MySQL.instance.cnn.escape(req.body.telefono_persona)}, `
    }
    if(req.body.estatus_persona >= 0){
        SET = SET + ` estatus_persona = ${req.body.estatus_persona}, `
    }
    if(req.body.estatus_seguimiento != undefined){
        SET = SET + ` estatus_seguimiento = ${MySQL.instance.cnn.escape(req.body.estatus_seguimiento)}, `
    }
    if(req.body.parentesco_persona != undefined){
        SET = SET + ` parentesco_persona = ${MySQL.instance.cnn.escape(req.body.parentesco_persona)}, `
    }
    if(req.body.id_dependencia_persona >= 0){
        SET = SET + ` fk_id_dependencia_persona = ${req.body.id_dependencia_persona},`
    }

    // Eliminar la ultima coma del SET 
    SET = SET.substring(0, SET.length-2);

    var QUERY_ARMADO = UPDATE + SET + WHERE + ';';
    
    MySQL.ejecutarQueryPr(QUERY_ARMADO).then((results) => {
        // Comprobar cuantas fueron las columnas afectadas 
        // para conocer si se hizo la edición o no.
            
        return res.json({
            ok: true,
            results: results
        });
    }).catch(() => {
        return res.json({
            ok: false,
            mensaje: 'Error de servidor (DB).',
            error: 'Error de servidor (DB).'
        });
    });
});




// LOGIN
// LOGIN
// LOGIN
// LOGIN
// LOGIN
// LOGIN
// LOGIN

router.post('/login/usuario', function(req, res) {
    // Cuando el login es por usuario y contraseña
    // Utilizado para el sitio web
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
            permiso_consulta: data.permiso_consulta,
            permiso_admin: data.permiso_admin,

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
    // Cuando el login es por correo y contraseña 
    // Mas bien utilizado en la app móvil
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
            genero_persona: data.genero_persona,
            correo_persona: data.correo_persona,
            telefono_persona: data.telefono_persona
        };


        objInventario = {
            toma_medic_inv: data.toma_medic_inv,
            dific_sueno_inv: data.dific_sueno_inv,
            perder_control_inv: data.perder_control_inv,
            interes_rel_inv: data.interes_rel_inv,
            pesimo_optim_inv: data.pesimo_optim_inv,
            inutil_inserv_inv: data.inutil_inserv_inv,
            futuro_esperanza_inv: data.futuro_esperanza_inv,
            fracas_inv: data.fracas_inv,
            deprimido_inv: data.deprimido_inv,
            separ_divorc_viud_inv: data.separ_divorc_viud_inv,
            fam_suic_inv: data.fam_suic_inv,
            enfadado_inv: data.enfadado_inv,
            suicidarse_inv: data.suicidarse_inv,
            queria_suic_inv: data.queria_suic_inv,
            quit_vida_inv: data.quit_vida_inv,
            puntaje: 0
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

        // Calcular puntaje de inventario
        var puntaje = 
            Number.parseInt(objInventario.toma_medic_inv) + 
            Number.parseInt(objInventario.dific_sueno_inv) + 
            Number.parseInt(objInventario.perder_control_inv) + 
            Number.parseInt(objInventario.interes_rel_inv) + 
            Number.parseInt(objInventario.pesimo_optim_inv) + 
            Number.parseInt(objInventario.inutil_inserv_inv) + 
            Number.parseInt(objInventario.futuro_esperanza_inv) + 
            Number.parseInt(objInventario.fracas_inv) + 
            Number.parseInt(objInventario.deprimido_inv) + 
            Number.parseInt(objInventario.separ_divorc_viud_inv) + 
            Number.parseInt(objInventario.fam_suic_inv) + 
            Number.parseInt(objInventario.enfadado_inv) + 
            Number.parseInt(objInventario.suicidarse_inv) + 
            Number.parseInt(objInventario.queria_suic_inv) + 
            Number.parseInt(objInventario.quit_vida_inv);
        this.objInventario.puntaje = puntaje;

        return res.json({
            ok: true,
            mensaje: 'Éxito al iniciar sesión',
            persona: objPersona,
            direccion: objDireccion,
            inventario: objInventario,
            referencia: {},
            direccionRef: {}
        });
    }).catch((e) => {
        // console.log(e);
        return res.json({
            ok: false,
            mensaje: 'Error de servidor (DB).',
            error: 'Error de servidor (DB).'
        });
    });
});



module.exports = router;