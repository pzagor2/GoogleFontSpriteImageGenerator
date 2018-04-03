var generator = require("./app.js");

generator.getImage({
	callback: function(base64Data) {
		// console.log(base64Data);
		require("fs").writeFile("out.png", base64Data, 'base64', function(err) {
			console.log(err);
		});
	},
	port: 1224,
	options: {
		lineHeight: "40px",
		fontSize: "25px",
		width: "400px"
	},
	googleAPIKey:""
});