# GoogleFontSpriteImageGenerator
==============================

This project help generate sprite images for google font drawdown


Install with: npm install googlefonts-sprite-generator

This module was updated and now use's https://github.com/GoogleChrome/puppeteer insted of phantomJS

And you will need API key https://developers.google.com/fonts/docs/developer_api#Auth

### Example usage

```javascript
var generator = require("googlefonts-sprite-generator");

generator.getImage({
	callback: function(base64Data) {
		console.log(base64Data);
		require("fs").writeFile("out.png", base64Data, 'base64', function(err) {
			console.log(err);
		});
	},
	port: 1224,
	options: {
		lineHeigth: "40px",
		fontSize: "25px",
		width: "400px"
	},
	googleAPIKey:"" //You need to replace this with your api key
});
```






