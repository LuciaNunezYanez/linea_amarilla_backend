const { Router } = require('express');
const router = Router();
const MySQL = require('./../mysql/mysql');


// QUERY DE PRUEBA
router.get('/', function(req, res) {

    // var numero = MySQL.instance.cnn.escape(req.params.numero);
    var query = "SELECT * FROM persona";

    MySQL.ejecutarQueryPr(query).then((results) => {
        // console.log(results[0].length);
        res.json({
            results
        });
    }).catch(() => {
        res.status(500).json({
            error: 'Error de servidor (DB).'
        });
    });
});



module.exports = router;