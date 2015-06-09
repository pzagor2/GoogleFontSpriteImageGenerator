GoogleFontSpriteImageGenerator
==============================

This project help generate sprite images for google font dropdown

-git clone
-npm install

If you whant to use PhantomJS you have to have that available in path. http://phantomjs.org/

Browser will lazy load a blank page with all google fonts. Then it will take a screenshot of the page.

Two modes available.

1. run with "node app.js"
	This is default mode and it uses PhantomJS to make a screenstop of a web page. Resolut wil be out_phantom.png in root folder of the app.

2. run with "node app.js -b" or "node app.js -browser"
	This is browser mode. The web page will be opened in your default webbrowser. The screenshot will be made and send back to node app, where is till be stored in root with file name out_inpage.png


