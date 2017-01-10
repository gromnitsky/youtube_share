.PHONY: server
server: kill
	test/imgur-server-stub &

.PHONY: kill
kill:
	-pkill -f 'node test/imgur-server-stub'
