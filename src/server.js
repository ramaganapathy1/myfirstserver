var express = require('express');
var app =  express();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: true })
app.use(bodyParser.urlencoded({
    extended: true
}));
const MongoClient = require('mongodb').MongoClient;
MongoClient.connect('mongodb://127.0.0.1:27017/android', function(err, db) {
    if (err) throw err;
    console.log("Connected to Database");
})
app.use(bodyParser.json());
    app.get('/',function (req,res) {
        res.sendFile(__dirname+"/" + "index.html" );
          var ip = req.connection.remoteAddress;
        console.log("GET/200/index root / %s",ip);
    })

    app.post("/user",function (req,res) {
        var fname =req.body.first_name,
            lname = req.body.last_name;
            /*db.collection('users').insert({name:{fname:fname,lname:lanme}}, function(err, result) {
                db.collection('users').find({name: {fname:fname}}).toArray(function(err, docs) {
                    console.log(docs[0])
                })
            })*/
        MongoClient.connect('mongodb://127.0.0.1:27017/android', function(err, db) {
            if (err) throw err;
            console.log("Connected to Database");
            var user = {name:{fname:fname,lname:lname}};
            db.collection('users').insert(user, function(err, records) {
                if (err) throw err;
                records=JSON.stringify(records);
                console.log("Record added as "+records);
            });
        });
        var ip = req.connection.remoteAddress;
        response = {
            status:200,
            data: {
                first: fname,
                last: lname
            }
        };
        response=JSON.stringify(response)
        console.log("POST/201/Name :  %s %s / IP : %s / Json : %s ",fname,lname,ip,response);
        res.end(response);
    })
    app.delete("/userDelete",function (req,res) {
        var fname=req.body.first_name,
            lname = req.body.last_name;

        response={
            status:203,
            data:{
                value:"deleted succesfully"
            }
        }
    })
    app.use(function(req, res, next) {
        res.status(404);
        if (req.accepts()) {
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