all: lint
	jekyll

lint: 
	/opt/boxen/nvm/v0.8.8/lib/node_modules/jslint/bin/jslint.js _includes/*.js

serve: lint
	jekyll --serve --auto

s: serve
