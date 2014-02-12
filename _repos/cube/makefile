all:
	jslint _includes/*.js
	java -jar _bin/compiler.jar --js _includes/cube.js --js_output_file cube.min.js
	jekyll serve -w