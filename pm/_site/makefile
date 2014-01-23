GLUEPATH = /opt/boxen/homebrew/share/python/glue
vpath %.js src
.PHONY: all

all: index.html assets

index.html: ad.css ad.js
	sed '/\/\* CSS \*\//r src/ad.css' < src/index.html > index.html
	sed -i.bak '\/\/ JS/r ad.js' index.html

movie:
	$(GLUEPATH) src/assets/movie movie

ad.css:

ad.js:	yoc.js pm.js
	cat src/yoc.js src/pm.js > ad.js

dirs:
	mkdir -p assets

assets: jpegtran pngquant s.gif

s.gif:
	cp src/assets/s.gif assets

jpegtran:	dirs
	for i in src/assets/*.jpg; \
	do \
		jpegtran -optimize -progressive $$i > assets/`basename $$i`; \
	done

pngquant:	dirs
	for i in src/assets/*.png; \
	do \
		pngquant $$i; \
		mv src/assets/`basename $$i .png`-fs8.png assets/`basename $$i`; \
	done


run: index.html
	python -m SimpleHTTPServer &

stop:
	kill `ps -a | \
		grep -v 'grep' | \
		grep 'python -m SimpleHTTPServer' | \
		awk '{print $$1}'`

clean:
	rm index.html
	rm -r assets/
	rm ad.js

upload: index.html
	git add .
	git commit -am "${M}"
	git push origin master:gh-pages


