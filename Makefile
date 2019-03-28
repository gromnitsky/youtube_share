out := _out
crx := $(out)/$(shell json -d- -a name version < src/manifest.json).crx
ext := $(out)/ext

compile.all :=
compile:

ext.src := $(wildcard src/*)
ext.dest := $(patsubst src/%, $(ext)/%, $(ext.src))

$(ext.dest): $(ext)/%: src/%; $(copy)
$(ext)/vendor/%: node_modules/%; $(copy)

compile.all += $(ext.dest) $(ext)/vendor/nprogress/nprogress.js \
	$(ext)/vendor/nprogress/nprogress.css

compile: $(compile.all)

crx: $(crx)
$(crx): private.pem $(compile.all)
	google-chrome --pack-extension=$(out)/ext --pack-extension-key=$<
	mv $(out)/ext.crx $@

private.pem:
	openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:2048 -out $@

define copy =
@mkdir -p $(dir $@)
cp $< $@
endef

upload: $(crx)
	scp $< gromnitsky@web.sourceforge.net:/home/user-web/gromnitsky/htdocs/js/chrome/

# for tests

.PHONY: server
server: kill
	test/imgur-server-stub &

.PHONY: kill
kill:
	-pkill -f 'node test/imgur-server-stub'
