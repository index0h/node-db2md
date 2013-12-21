node-docMyDB
============

[![Build Status](https://travis-ci.org/index0h/node-docMyDB.png?branch=master)](https://travis-ci.org/index0h/node-docMyDB) [![Dependency Status](https://gemnasium.com/index0h/node-docMyDB.png)](https://gemnasium.com/index0h/node-docMyDB)

docMyDB is a tool for generation documentation of your DB structure in markdown.
It could be useful if you use github wiki / gitlab wiki / gollum or any other wiki system that supports markdown syntax.

# First step

* Install from NPM

```sh
npm install docMyDB -g
```

* Create configuration file (docMyDB.json)

```json
{
    "user": "user",
    "database": "test",
    "tables": {
        "my_table": {}
    }
}
```

* Generate

```sh
docMyDB
```

# Console API

```sh
Usage: docMyDB.js [options]

Options:

  -h, --help           output usage information
  -V, --version        output the version number
  -c, --config [path]  Path to configuration file. Default ./docMyDB.json
```

# [docMyDB.json](https://github.com/index0h/node-docMyDB/blob/master/examples/largeConfiguration.json)

### DB Connection params

**user** - db user name, default: null
**pass** - db user password, default: null
**database** [required] - db name

```json
"user": "test",
"pass": "test",
"database": "test"
```

### Global header and footer (optional)

**header** and **footer** - markdown strings that will be placed at beginning and at the and of output

```json
"header": "This is global header.\nHeader next line.",
"footer": "This is global footer.\nFooter next line."
```

### Tables directive (optional)

**tables** is a JSON object where **key** - name of table in db and **value** - options for this table.

**comment** and **footer** - markdown strings that will be placed at beginning (after table name) and at the and of table output

```json
"tables": {
    "first_table": {
        "comment": "First table comment.",
        "footer": "First table footer."
    }
}
```

### Groups directive (optional)

Groups designed to output logically related tables.

**groups** - array of objects with **tables** directive.
**groups[].header** and **groups[].footer** - markdown strings that will be placed at beginning and at the and of group output
**tables** [required] - see **Tables directive**


```json
"groups": [
    {
        "header": "This is group header.\nHeader next line.",
        "footer": "This is group footer.\nFooter next line.",
        "tables": {
            "third_table": {
                "comment": "Third table comment.",
                "footer": "Third table footer."
            }
        }
    }
]
```