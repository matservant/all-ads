vpath %.js _assets
vpath %.html _layouts
.PHONY: all dev

dev: ad.js default.html telbuch.css
	jekyll

all: ad.min.js default.html telbuch.css
	jekyll
	rm _site/makefile _site/yoc.min.js _site/telbuch.min.js

ad.min.js: yoc.min.js telbuch.min.js
	cat yoc.min.js telbuch.min.js > ad.js

ad.js: _assets/yoc.js _assets/telbuch.js
	cat _assets/yoc.js _assets/telbuch.js > ad.js

%.css: _assets/%.css
	cp _assets/$*.css .

%.min.js: %.js
	java -jar _bin/compiler.jar --js $< --js_output_file $*.min.js

clean:
	rm yoc.min.js telbuch.min.js
