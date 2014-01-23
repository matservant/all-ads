all: serve

serve: lint
	jekyll serve -w

lint:
	jslint _includes/*.js

sprites:
	rm -r _creatives/pngs-320
	mkdir _creatives/pngs-320
	convert -resize 640 _creatives/pngs/* "_creatives/pngs-320/sprite-%d-320.png"
	sf _creatives/pngs-320
	pngquant 256 _creatives/pngs-320.png
	cat _creatives/pngs-320.css | sed 's/url(pngs-320\.png/url(img\/sprites\.png/' > _includes/sprites.css
	mv _creatives/pngs-320-fs8.png img/sprites.png

images:
	convert -resize 640 _creatives/pngs/cauldron.png img/cauldron@2x.png
	convert -resize 640 _creatives/pngs/packshot.png img/packshot@2x.png

clean:
	rm img/*-fs8.png
	rm _includes/pngs.css