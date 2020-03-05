var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


var request = require("request");
var cheerio = require("cheerio");
var fs = require('fs');

var minutes = 10,
    the_interval = minutes * 60 * 1000;
setInterval(function() {
    request({
        uri: "https://www.worldometers.info/coronavirus/",
    }, function(error, response, body) {
        var $ = cheerio.load(body);
        console.log("obteniendo datos");
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


    function custom_sort(a, b) {
        return new Date(a.pubDate).getTime() - new Date(b.pubDate).getTime();
    }
    
    let Parser = require('rss-parser');
    let parser = new Parser();
    (async () => {
     
        let feed1 = await parser.parseURL('https://www.lavanguardia.com/mvc/feed/rss/internacional');
        var json = [];
        feed1.items.forEach(item => {
            if(item.title.toLowerCase().includes("coronavirus") || item.content.toLowerCase().includes("coronavirus")){
                json.push({"titulo":item.title,"cuerpo":item.content.replace(/<[^>]*>/g, '').split(".")[0],"link":item.link,"pubDate":item.pubDate,"periodico":"La Vanguardia"});
            }
        });
        
        let feed2 = await parser.parseURL('https://www.abc.es/rss/feeds/abc_ultima.xml');
        feed2.items.forEach(item => {
            if(item.title.toLowerCase().includes("coronavirus") || item.content.toLowerCase().includes("coronavirus")){
                json.push({"titulo":item.title,"cuerpo":item.content.replace(/<[^>]*>/g, '').split(".")[0],"link":item.link,"pubDate":item.pubDate,"periodico":"ABC"});
            }
        });
    
        fs.writeFile('data/noticias.json', JSON.stringify(json.sort(custom_sort)), function(err) {
            if (err) throw err;
        });
    
    
      })();

}, the_interval);

module.exports = app;