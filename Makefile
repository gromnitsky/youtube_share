src := $(dir $(realpath $(lastword $(MAKEFILE_LIST))))
out := _build
proj.name := youtube_share
proj.version := $(shell json < ext/manifest.json version)
pkg.name := $(proj.name)-$(proj.version)

.PHONY: crx
crx: $(out)/$(pkg.name).crx


.PHONY: server
server: kill
	test/imgur-server-stub &

.PHONY: kill
kill:
	-pkill -f 'node test/imgur-server-stub'

$(out)/$(pkg.name).zip:
	rm -f $@
	mkdir -p $(out)
	rm -f $(out)/*
	cp ext/* $(out)
	cd $(out) && zip -qr $(CURDIR)/$@ *

%.crx: %.zip private.pem
	rm -f $@
	cd $(dir $@) && $(src)/zip2crx.sh $< $(src)/private.pem

.PHONY: clean
clean:
	rm -rf $(out)
