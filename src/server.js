var express = require('express');
var app =  express();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: true })
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies
    app.get('/',function (req,res) {
        res.sendFile(__dirname+"/" + "index.html" );
        //res.send('hello world!');
        var ip = req.connection.remoteAddress;
        console.log("GET/200/index root / %s",ip);
    })

    app.post("/user",function (req,res) {
        var fname = req.body.first_name,
            lname = req.body.last_name;
        var ip = req.connection.remoteAddress;
        response = {
            status:200,
            data: {
                first: fname,
                last: lname
            }
        };
        console.log("POST/201/Name :  %s %s / IP : %s / Json : %s ",fname,lname,ip,response);
        res.end(JSON.stringify(response));
    })
    app.use(function(req, res, next) {
        res.status(404);
        if (req.accepts('json')) {
            res.send({ error: 'Not found' });
            var ip = req.connection.remoteAddress;
            console.log("404/Page Not Found/%s/Ip :%s", req.data, ip);
            return;
        }

        // default to plain-text. send()
        res.type('txt').send('Not found');

    })
var server = app.listen(8080,function () {
        var host = server.address().address
        var port = server.address().port
        console.log("Listening at http://%s:%s ",host,port);
})