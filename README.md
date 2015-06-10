# GoogleFontSpriteImageGenerator
==============================

This project help generate sprite images for google font dropdown


Install with: npm install googlefonts-sprite-generator

This module uses phantomjs http://phantomjs.org/, make sure that is accessable in your path.

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
	}
});
```






