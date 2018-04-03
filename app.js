var express = require('express');
var _ = require('lodash');
var path = require('path');
var puppeteer = require('puppeteer');

var expressServer;
//Default options
var config = {
	port: 1337,
	options: {
		lineHeight: "40px",
		fontSize: "25px",
		width: "400px",
		viewport: {
			width: 400,
			height: 800
		}
	},
	callback: null,
	googleAPIKey: ""
};

/**
* Start basic express server with ejs support, witch loads generator_phantom.html on / URL
*/
function startServer() {
	//Set up express
	var app = express();
	app.engine('.html', require('ejs').__express);
	app.set('view engine', 'html');
	app.set('views', path.resolve(__dirname, 'generators'));
	//Main page render entry point
	app.get('/', function(req, res) {
		var renderFile = 'generator_phantom.html';
		
		var params = config.options;
		params.googleAPIKey = config.googleAPIKey;
		
		res.render(renderFile, params);
	});
	//start server
	expressServer = app.listen(process.env.PORT || config.port);
	console.log("Running server on port: " + config.port);
	
}

function takeScreenShotPuppeteer(url, callback) {
	puppeteer.launch({ headless: true }).then(browser => {
		browser.newPage()
		.then(page => {
			page.goto(url);
			page.on('console', msg => {
				console.log('PAGE LOG:', msg.text());
				if (msg.text().startsWith('takeScreenshot')) {
					page.setViewport({
						width: config.options.viewport.width,
						height: config.options.viewport.height
					});
					page.screenshot({
						fullPage: true, 
						omitBackground: true
					})
					.then(buffer => {
						browser.close();
						callback(buffer);
					});
				}
			});
		})
	});
	
	
}

function validateParameters(parms) {
	if (!parms.googleAPIKey || !(typeof parms.googleAPIKey == 'string' || parms.googleAPIKey instanceof String) || parms.googleAPIKey.length <= 0) {
		throw "Must supplay googleAPIKey";
	}
}

/**
* Async returs image encoded as base64 string
*/
var getImage = function(_params) {
	validateParameters(_params);
	//merge configs
	config = _.merge(config, _params);
	//start basic express server using config.port
	startServer();
	//actually take screenshot with phantomjs
	var pageUrl = "http://localhost:" + config.port;
	takeScreenShotPuppeteer(pageUrl, function(imageString) {
		expressServer.close();
		_params.callback(imageString);
	});
	
};
//Public stuff
var bootstrap = {
	getImage: getImage
};
module.exports = bootstrap;
