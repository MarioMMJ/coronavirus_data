var request = require("request");
var cheerio = require("cheerio");
var fs = require('fs');

var proxyUrl = "http://" + "mmanji2" + ":" + "Minisdef03" + "@" + "10.7.180.112" + ":" + "80";

var proxiedRequest = request.defaults({ 'proxy': proxyUrl });

proxiedRequest.get("https://www.worldometers.info/coronavirus/", function(err, resp, body) {
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
    console.log(json);

    fs.writeFile('data/data.json', JSON.stringify(json), function(err) {
        if (err) throw err;
        console.log('Guardado');
    });

});




/*
request({
    uri: "https://www.worldometers.info/coronavirus/",
  }, function(error, response, body) {
    var $ = cheerio.load(body);
  
    var _tabla = $("#main_table_countries tbody")[0];
    var _rows = $(_tabla).find("tr");
    for(var i = 0; i < _rows.length; i++){
        var region = $(_rows[i]).find("td");
        var _datos_region = [];
        for(var x = 0; x < region.length; x++){
            console.log(region[i]);
            _datos_region.push($(region[i]).val());
        }
        fs.appendFile('data/data.csv', _datos_region.join(", ") + "\n", function (err) {
            if (err) throw err;
            console.log('Saved!');
        });
    }
  });*/