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
                row[key] = value.replace(",", "");;
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

function custom_sort(a, b) {
    return new Date(a.pubDate).getTime() - new Date(b.pubDate).getTime();
}

let Parser = require('rss-parser');
let parser = new Parser();
(async () => {
 
    let feed1 = await parser.parseURL('https://www.lavanguardia.com/mvc/feed/rss/internacional');
        var json = [];
        feed1.items.forEach(item => {
            if(item.title.toLowerCase().includes("coronavirus") || item.content.split(".")[0].toLowerCase().includes("coronavirus")){
                json.push({"titulo":item.title,"cuerpo":item.content.replace(/<[^>]*>/g, '').split(".")[0],"link":item.link,"pubDate":new Date(item.pubDate).toLocaleString('en-US',{timeZone:"Europe/Andorra"}),"periodico":"La Vanguardia"});
            }
        });
        
        let feed2 = await parser.parseURL('https://www.abc.es/rss/feeds/abc_ultima.xml');
        feed2.items.forEach(item => {
            if(item.title.toLowerCase().includes("coronavirus") || item.content.split(".")[0].toLowerCase().includes("coronavirus")){
                json.push({"titulo":item.title,"cuerpo":item.content.replace(/<[^>]*>/g, '').split(".")[0],"link":item.link,"pubDate":new Date(item.pubDate).toLocaleString('en-US',{timeZone:"Europe/Andorra"}),"periodico":"ABC"});
            }
        });

        let feed3 = await parser.parseURL('https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/portada');
        feed3.items.forEach(item => {
            if(item.title.toLowerCase().includes("coronavirus") || item.content.split(".")[0].toLowerCase().includes("coronavirus")){
                json.push({"titulo":item.title,"cuerpo":item.content.replace(/<[^>]*>/g, '').split(".")[0],"link":item.link,"pubDate":new Date(item.pubDate).toLocaleString('en-US',{timeZone:"Europe/Andorra"}),"periodico":"El Pais"});
            }
        });

    fs.writeFile('data/noticias.json', JSON.stringify(json.sort(custom_sort)), function(err) {
        if (err) throw err;
    });


  })();



