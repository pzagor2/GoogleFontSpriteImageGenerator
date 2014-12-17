var express = require('express');
var bodyParser  = require('body-parser');
var fs = require("fs");
var opener = require("opener");

var app = express();
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json({limit: '50mb'}));
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');
app.set('views', __dirname);
// Generate a simple home page.
app.get('/', function(req, res) {
	res.render('index', {});
});

app.post('/finish', function(req, res) {
	//console.log(req.body);
	var base64Data = req.body.image.replace(/^data:image\/png;base64,/, "");
	fs.writeFile("out.png", base64Data, 'base64', function(err) {
	  if (err) {
	  	console.log(err);
	  }
	  else {
	  	console.log("Image is generated.... checkout file out.png");
	  }
	});
	
	res.send("OK");
});


app.listen(process.env.PORT || 1337);
console.log("Running server in port 1337");
console.log("Opening browser!!!!!!!!!");
opener("http://localhost:1337");