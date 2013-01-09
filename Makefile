
build: components livescript index.js
	@component build --dev

components: component.json
	@component install --dev

clean:
	rm -fr build components template.js

livescript:
	livescript -c index

.PHONY: clean
