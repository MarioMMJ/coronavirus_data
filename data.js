var request = require("request");
var cheerio = require("cheerio");
var fs = require('fs'); 

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
  });