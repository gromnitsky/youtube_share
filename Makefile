.DELETE_ON_ERROR:

out := _build
pkg.name := youtube_share-$(shell json < ext/manifest.json version)

.PHONY: crx
crx: $(out)/$(pkg.name).crx

ext.src := $(wildcard ext/*)

$(out)/$(pkg.name).zip: $(ext.src)
	@mkdir -p $(out)
	cd $(dir $<) && zip -qr $(CURDIR)/$@ *

%.crx: %.zip private.pem
	./zip2crx.sh $< private.pem


# for tests

.PHONY: server
server: kill
	test/imgur-server-stub &

.PHONY: kill
kill:
	-pkill -f 'node test/imgur-server-stub'
