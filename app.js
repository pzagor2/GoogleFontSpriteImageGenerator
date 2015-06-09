var express = require('express');
var bodyParser = require('body-parser');
var fs = require("fs");
var opener = require("opener");
var argv = require('optimist').argv;
var path = require('path');
var phantom = require('phantom');

//read CLI arguments
var useBrowser = argv.b || argv.browser;
var port = argv.p || argv.port || 1337;


//Set up express
var app = express();
app.use(bodyParser.urlencoded({
	limit: '50mb',
	extended: true
}));
app.use(bodyParser.json({
	limit: '50mb'
}));
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');
app.set('views', path.resolve(__dirname, 'generators'));
//Main page render entry point
app.get('/', function(req, res) {
	var renderFile = 'generator_phantom.html';
	if (useBrowser) {
		renderFile = 'generator_inpage.html';
	}
	res.render(renderFile, {});
});
if (useBrowser) {
	//this is called from generator_inpage with the image result
	app.post('/finish', function(req, res) {
		//console.log(req.body);
		var base64Data = req.body.image.replace(/^data:image\/png;base64,/, "");
		fs.writeFile("out_inpage.png", base64Data, 'base64', function(err) {
			if (err) {
				console.log(err);
			} else {
				console.log("Image is generated.... checkout file out_inpage.png");
			}
			process.exit();
		});

		res.send("OK");
	});
}

//start server
app.listen(process.env.PORT || port);
console.log("Running server on port: " + port);


//Set up screenshot taking
if (useBrowser) {
	console.log("Opening browser!!!!!!!!!");
	opener("http://localhost:" + port);
} else {
	console.log("Image will be ready in a minute ..... ");
	var pageUrl = "http://localhost:" + port;
	phantom.create("--ignore-ssl-errors=yes", "--ssl-protocol=any", function(ph) {
		ph.createPage(function(page) {
			page.set('onLoadStarted', function() {});
			page.set('onLoadFinished', function() {});
			page.set('onCallback', function(data) {
				if (data.loadingFinish) {
					console.log("Taking SS");
					setTimeout(function() {
						page.render('out_phantomjs.png', function(finished) {
							console.log("Image is generated.... checkout file out_phantom.png");
							process.exit()
						});
					}, 150);
				}
			});
			page.open(pageUrl, function(status) {

			});
		});
	});
}



