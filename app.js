var express = require('express');
var _ = require('lodash');
var path = require('path');
var phantom = require('phantom');

var expressServer;
//Default options
var config = {
	port: 1337,
	options: {
		lineHeigth: "40px",
		fontSize: "25px",
		width: "400px"
	},
	callback: null
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
		res.render(renderFile, config.options);
	});
	//start server
	expressServer = app.listen(process.env.PORT || config.port);
	console.log("Running server on port: " + config.port);

}

/**
 * Usses phantomjs to create screenshot of the webpage
 */
function takeScreenShot(url, callback) {

	phantom.create("--ignore-ssl-errors=yes", "--ssl-protocol=any", function(ph) {
		ph.createPage(function(page) {
			page.set('onLoadStarted', function() {});
			page.set('onLoadFinished', function() {});
			page.set('onCallback', function(data) {
				if (data.loadingFinish) {
					console.log("Taking SS");
					page.renderBase64('PNG', callback);
				}
			});
			page.open(pageUrl, function(status) {

			});
		});
	});
}

/**
 * Async returs image encoded as base64 string
 */
var getImage = function(_params) {
	//merge configs
	config = _.defaults(config, _params.config);
	//start basic express server using config.port
	startServer();
	//actually take screenshot with phantomjs
	var pageUrl = "http://localhost:" + config.port;
	takeScreenShot(pageUrl, function(imageString) {
		expressServer.close();
		_params.callback(imageString);
	});

};
//Public stuff
var bootstrap = {
	getImage: getImage
};
module.exports = bootstrap;