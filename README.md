# GoogleFontSpriteImageGenerator

![Example image](https://raw.githubusercontent.com/pzagor2/GoogleFontSpriteImageGenerator/master/example.png)

This project/module helps generate sprite image for google font drawdown.

## Google font api key
You will need API key https://developers.google.com/fonts/docs/developer_api#Auth

## Example usage
Install with: `npm install googlefonts-sprite-generator`

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