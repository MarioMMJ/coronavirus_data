var express = require('express');
var router = express.Router();
var fs = require('fs');
/* GET home page. */
router.get('/', function(req, res, next) {
    var datos = fs.readFileSync("data/data.json");
    var noticias;
    var noticias = fs.readFileSync('data/noticias.json');
    var noticias_json = JSON.parse(noticias);
    var json = JSON.parse(datos);
    var totales;
    var d = new Date();
    for (var i = 0; i < json.length; i++) {
        if (json[i]["Country,Other"].trim() == "Total:") {
            totales = json[i];
        }
    }
    totales["TotalCases"] = totales["TotalCases"].replace(",", "");
    totales["NewCases"] = totales["NewCases"].replace(",", "");
    totales["TotalDeaths"] = totales["TotalDeaths"].replace(",", "");
    totales["NewDeaths"] = totales["NewDeaths"].replace(",", "");
    totales["TotalRecovered"] = totales["TotalRecovered"].replace(",", "");
    totales["ActiveCases"] = totales["ActiveCases"].replace(",", "");
    totales["Serious,Critical"] = totales["Serious,Critical"].replace(",", "");
    res.render('index', { totales: totales, paises: json.length, estadisticasPaises: json, noticias: noticias_json.reverse(), fecha: (d.getDay() + 1) + "/" + (d.getMonth() + 1) + "/" + d.getFullYear() });
});

module.exports = router;