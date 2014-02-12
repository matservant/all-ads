for i in `ls *.html`; do  
	cp $i  snippets/;
	sed -i ""  's/layout: [a-zA-Z0-9]*/layout: pjax/' snippets/$i;
done

jekyll --no-auto
rm _site/pjaxify.sh


