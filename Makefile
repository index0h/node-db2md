
test: test-unit

test-unit:
	@NODE_ENV=test ./node_modules/.bin/mocha --ui bdd test

test-cov: lib-cov
	@DB2MD_COVERAGE=1 ./node_modules/.bin/mocha -R mocha-lcov-reporter test | ./node_modules/coveralls/bin/coveralls.js && rm -rf lib-cov

lib-cov:
	@NODE_ENV=test ./node_modules/.bin/jscoverage --exclude "Makefile" lib lib-cov

code-style:
	@NODE_ENV=test ./node_modules/.bin/jshint bin lib test index.js

.PHONY: test test-unit test-cov lib-cov
