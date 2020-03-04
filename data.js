var request = require("request");
var cheerio = require("cheerio");
var fs = require('fs');

request({
    uri: "https://www.worldometers.info/coronavirus/",
}, function(error, response, body) {
    var $ = cheerio.load(body);

    $.fn.toJson = function() {

        if (!this.is('table')) {
            return;
        }

        var results = [],
            headings = [];

        this.find('thead tr th').each(function(index, value) {
            headings.push($(value).text());
        });


        this.find('tbody tr').each(function(indx, obj) {
            var row = {};
            var tds = $(obj).children('td');
            headings.forEach(function(key, index) {
                var value = tds.eq(index).text();
                row[key] = value;
            });
            results.push(row);
        });

        return results;
    }

    $(function() {
        $('#results').html(JSON.stringify($('#excel').toJson(), null, '\t'));
    });

    var json = $('#main_table_countries').toJson();

    fs.writeFile('data/data.json', JSON.stringify(json), function(err) {
        if (err) throw err;
    });
});

request({
    uri: "https://www.lavanguardia.com/vida/20200303/473948475682/coronavirus-covid-19-hoy-ultima-hora-espana-cataluna-madrid-sevilla-china-oms-ultimas-noticias-en-directo.html",
}, function(error, response, body) {
    var $ = cheerio.load(body);
    var noticias = $(".story-leaf-body .story-leaf-txt-p .comment");
    var arr = []
    for (var i = 0; i < noticias.length; i++) {
        arr.push($(noticias[i]).text().replace(/(\r\n|\n|\r)/gm, "").trim().replace(/\s\s+/gm, " "))
    }
    console.log(arr);


    fs.writeFile('data/noticias.json', JSON.stringify(arr.splice(0, 5)), function(err) {
        if (err) throw err;
        console.log('Guardado');
    });
});