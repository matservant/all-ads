
all: serve

serve: lint
	jekyll serve -w

lint:
	/opt/boxen/nodenv/versions/v0.10.21/bin/jslint _includes/*.js

frames:
	sf _creatives/frames
	pngquant 16 _creatives/frames.png
	mv _creatives/frames.css _includes
	mv _creatives/frames-fs8.png img

clean:
	rm img/*-fs8.png
	rm _includes/frames.css