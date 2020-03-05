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




