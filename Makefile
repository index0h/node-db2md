
REPORTER=dot

test: test-unit

test-unit:
	@NODE_ENV=test ./node_modules/.bin/mocha --ui bdd --reporter $(REPORTER)

test-cov: clean lib-cov
	@DOC_MY_DB_COVERAGE=1 $(MAKE) test-unit REPORTER=html-cov > coverage.html

lib-cov:
	@NODE_ENV=test ./node_modules/.bin/jscoverage --exclude "Makefile" lib lib-cov

code-style:
	@NODE_ENV=test ./node_modules/.bin/jshint bin lib test index.js

clean:
	rm -f coverage.html
	rm -fr lib-cov

.PHONY: test test-unit test-cov lib-cov clean
