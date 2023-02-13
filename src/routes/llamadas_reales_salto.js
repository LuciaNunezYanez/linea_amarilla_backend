const { Router } = require('express');
const router = Router();
const ConOracleSalto = require('../db/oracle_salto');


// HACE LA CONSULTA A LA TABLA DE PROMAD 

router.post('/busqueda', function(req, res) {
    console.log('----------------SALTO---------------');
    console.log(req.body);
    // FILTROS
    const fechaSinFormatear1 = req.body.fecha1;
    const fechaSinFormatear2 = req.body.fecha2;
    const fechaFormateada1 = `${fechaSinFormatear1.substring(8, 10)}/${fechaSinFormatear1.substring(5, 7)}/${fechaSinFormatear1.substring(0, 4)}`;
    const fechaFormateada2 = `${fechaSinFormatear2.substring(8, 10)}/${fechaSinFormatear2.substring(5, 7)}/${fechaSinFormatear2.substring(0, 4)}`;

    // FORMATEAR TODO A MAYUSCULAS
    const FECHA1 = `${fechaFormateada1} 00:00:00` || '01/01/2022 00:00:00';
    const FECHA2 = `${fechaFormateada2} 23:59:59` || '27/11/2022 23:59:59';
    const TELEFONO = req.body.telefono.toUpperCase() || '';
    const DESCRIPCION = req.body.descripcion.toUpperCase() || '';
    const MOTIVO = req.body.motivo.toUpperCase() || 'SUICIDIO';
    const CORPORACION = req.body.corporacion.toUpperCase() || '';
    const CALLE = req.body.calle.toUpperCase() || '';
    const NUMERO = req.body.numero.toUpperCase() || '';
    const COLONIA = req.body.colonia.toUpperCase() || '';
    const ID_MUNICIPIO = req.body.municipio || '0';
    const DENUNCIANTE = req.body.denunciante.toUpperCase() || '';

    let WHERE = `WHERE FECHA_HORA_INICIO_LLAMADA BETWEEN 
        To_Date('${FECHA1}', 'dd/mm/yyyy hh24:mi:ss') AND 
        To_Date('${FECHA2}', 'dd/mm/yyyy hh24:mi:ss')`;

    if (TELEFONO.length > 0 && TELEFONO != undefined) {
        WHERE = WHERE + ` and NUMERO_TELEFONO like '%${TELEFONO}%'`;
    }
    if (DESCRIPCION.length > 0 && DESCRIPCION != undefined) {
        WHERE = WHERE + ` and DESCRIPCION_DE_LA_LLAMADA like '%${DESCRIPCION}%'`;
    }
    if (MOTIVO.length > 0 && MOTIVO != undefined && MOTIVO != 'TODOS') {
        WHERE = WHERE + ` and MOTIVO_TELEFONISTA = '${MOTIVO}'`;
    }
    if (MOTIVO == 'TODOS') {
        WHERE = WHERE + ` and MOTIVO_TELEFONISTA like '%SUICIDIO%'`;
    }
    if (CORPORACION.length > 0 && CORPORACION != undefined) {
        WHERE = WHERE + ` and NOMBRE_CORPORACION like '%${CORPORACION}%'`;
    }
    if (CALLE.length > 0 && CALLE != undefined) {
        WHERE = WHERE + ` and CALLE like '%${CALLE}%'`;
    }
    if (NUMERO.length > 0 && NUMERO != undefined) {
        WHERE = WHERE + ` and NUMERO like '%${NUMERO}%'`;
    }
    if (COLONIA.length > 0 && COLONIA != undefined) {
        WHERE = WHERE + ` and COLONIA like '%${COLONIA}%'`;
    }
    if (ID_MUNICIPIO.length > 0 && ID_MUNICIPIO != undefined && ID_MUNICIPIO != '0') {
        WHERE = WHERE + ` and ID_MUNICIPIO like '%${ID_MUNICIPIO}%'`;
    }
    if (DENUNCIANTE.length > 0 && DENUNCIANTE != undefined) {
        WHERE = WHERE + ` and NOMBRE_DENUNCIANTE like '%${DENUNCIANTE}%'`;
    }

    var QUERY = `SELECT 
        max(FECHA_HORA_INICIO_LLAMADA),
        max(FECHA_LLAMADA),
        max(HORA_LLAMADA),
        max(NUMERO_TELEFONO),
        max(MOTIVO_TELEFONISTA),
        max(ES_ALTO_IMPACTO),
        max(ID_MUNICIPIO),
        max(MUNICIPIO),
        max(REFERENCIAS),
        max(COLONIA),
        max(CALLE),
        max(ENTRE_CALLE),
        max(NUMERO),
        max(COORDENADA_X),
        max(COORDENADA_Y),
        max(DESCRIPCION_DE_LA_LLAMADA),
        max(NOMBRE_CORPORACION),
        max(FOLIO_LLAMADA),
        max(PRIORIDAD),
        max(NOMBRE_TIPO_RAZONAMIENTO),
        max(OBSERVACION_RAZONAMIENTO),
        max(RAZON_NO_ATENCION),
        max(MOTIVO_RADIO_OPERADOR),
        max(NOMBRE_DENUNCIANTE),
        max(CALLE_DENUNCIANTE),
        max(NUMERO_DENUNCIANTE),
        max(COLONIA_DENUNCIANTE),
        max(TELEFONO_DENUNCIANTE),
        max(MUNICIPIO_DENUNCIANTE),
        max(CANTIDAD_DETENIDOS),
        max(CANTIDAD_LESIONADOS),
        max(CANTIDAD_MUERTOS)
    from
        llamadas_reales

    ${WHERE}

    GROUP BY  
        FECHA_HORA_INICIO_LLAMADA 
    ORDER BY 
        FECHA_HORA_INICIO_LLAMADA`;

    console.log(WHERE);


    ConOracleSalto.ejecutarQueryPrSalto(QUERY).then((results) => {
        let llamadas = [];
        // Convertir de matriz a JSON
        results.forEach((element) => {
            jsonElement = {
                FECHA_HORA_INICIO_LLAMADA: element[0],
                FECHA_LLAMADA: element[1],
                HORA_LLAMADA: element[2],
                NUMERO_TELEFONO: element[3],
                MOTIVO_TELEFONISTA: element[4],
                ES_ALTO_IMPACTO: element[5],
                ID_MUNICIPIO: element[6],
                MUNICIPIO: element[7],
                REFERENCIAS: element[8],
                COLONIA: element[9],
                CALLE: element[10],
                ENTRE_CALLE: element[11],
                NUMERO: element[12],
                COORDENADA_X: element[13],
                COORDENADA_Y: element[14],
                DESCRIPCION_DE_LA_LLAMADA: element[15],
                NOMBRE_CORPORACION: element[16],
                FOLIO_LLAMADA: element[17],
                PRIORIDAD: element[18],
                NOMBRE_TIPO_RAZONAMIENTO: element[19],
                OBSERVACION_RAZONAMIENTO: element[20],
                RAZON_NO_ATENCION: element[21],
                MOTIVO_RADIO_OPERADOR: element[22],
                NOMBRE_DENUNCIANTE: element[23],
                CALLE_DENUNCIANTE: element[24],
                NUMERO_DENUNCIANTE: element[25],
                COLONIA_DENUNCIANTE: element[26],
                TELEFONO_DENUNCIANTE: element[27],
                MUNICIPIO_DENUNCIANTE: element[28],
                CANTIDAD_DETENIDOS: element[29],
                CANTIDAD_LESIONADOS: element[30],
                CANTIDAD_MUERTOS: element[31]
            };

            llamadas.push(jsonElement);
        });

        console.log(llamadas.length);

        return res.json({
            ok: true,
            llamadas: llamadas
        });
    }).catch((error) => {
        return res.json({
            ok: false,
            cod: '1',
            error: error
        });
    });
});


module.exports = router;