.DELETE_ON_ERROR:

pp-%:
	@echo "$(strip $($*))" | tr ' ' \\n

out := _build
pkg.name := youtube_share-$(shell json < ext/manifest.json version)

.PHONY: compile
compile:

mkdir = @mkdir -p $(dir $@)
npm-get = $(foreach src,$(1),$(wildcard node_modules/$(src)))


# all the deps target

ext.src := $(wildcard ext/*)
npm.src := nprogress/nprogress.*
deps.src := $(call npm-get,$(npm.src))
deps.dest := $(patsubst node_modules/%, ext/vendor/%, $(deps.src))

$(deps.dest): ext/vendor/%: node_modules/%
	$(mkdir)
	cp $< $@

compile: $(deps.dest)

# crx generation

.PHONY: crx
crx: $(out)/$(pkg.name).crx

$(out)/$(pkg.name).zip: $(ext.src) $(deps.dest)
	$(mkdir)
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


.PHONY: clean
clean:
	rm -rf $(out) ext/vendor
