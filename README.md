
# docvy-server

[![Build Status](https://travis-ci.org/GochoMugo/docvy-server.svg?branch=develop)](https://travis-ci.org/GochoMugo/docvy-server) [![Coverage Status](https://coveralls.io/repos/GochoMugo/docvy-server/badge.svg?branch=develop)](https://coveralls.io/r/GochoMugo/docvy-server?branch=develop)

> The Docvy Server


## table of contents:

* [installation](#installation)
* [terminal usage](#terminal)
* [programmatic usage](#programmatic)
* [API endpoints](#api)
* [todo](#todo)
* [license](#license)


<a name="installation"></a>
## installation:

Using [npm][npm] from [github][repo] (**bleeding edge**):

```bash
⇒ npm install GochoMugo/docvy-server#develop
```


## usage:

This component may be used programmatically, as in the docvy application, or from the terminal as a stand-alone application.


<a name="terminal"></a>
### terminal usage:

Help information for terminal usage:

```bash
⇒ docvy-server -h

  Usage: docvy-server [options]

  Options:

    -h, --help        output usage information
    -V, --version     output the version number
    -p, --port <num>  Start server at port <num>
    -a, --attach      Attach server process
    -s, --start       Start server
    -x, --stop        Stop server
    -t, --status      Get status of server
    -d, --debug       Output debug information

```


<a name="programmatic"></a>
### programmatic usage:

```js
var server = require("docvy-server");
```

#### server.start([options [, callback]])

* `options` (Object):
  * `port` (Number): port to start server on
* `callback` (Function):
  * On success, called with no arguments passed
  * On failure, called with an error object passed


#### server.stop([callback])

* `callback` (Function): called once the server has stopped receiving new connections. Note that the existing connections will be serviced till completion.


<a name="api"></a>
### API:

URL endpoints to use after starting server:

* [browsing directories](#dirs)
* [reading files](#files)
* [serving plugin content](#plugin-content)
* [listing installed plugins](#plugin-list)
* [installing new plugins](#plugin-install)
* [uninstalling plugins](#plugin-uninstall)
* [graceful shutdown](#shutdown)


<a name="dirs"></a>
#### Browsing directories:

```http
GET /files/
```

**Query Parameters:**

* `dirpath` (String): absolute path to target directory
* `ignoreDotFiles` (Boolean): whether to ignore dot files. Default: `false`

Success Response: **not complete**
```json
{
  "directories": [],
  "files": []
}
```


<a name="files"></a>
#### Reading files:

```http
GET /file/
```

** Query Parameters:**

* `filepath` (String): absolute path to target file
* `expects` (Array[String]): array of content-type to return the data in

Success Response:
```json
{
  "type": "<MIME>",
  "data": "<content-of-file-after-conversion>"
}
```


<a name="plugin-content"></a>
#### Serving Plugin Content:

```http
GET /plugins/www/:pluginName
```

**Path Parameters:**

* `pluginName`: name of plugin

This serves the files packaged in the plugin from the root directory (of the plugin).


<a name="plugin-list"></a>
#### Listing installed plugins:

```http
GET /plugins/list/
```

Success Response [[Schema Reference](https://github.com/GochoMugo/docvy-server/tree/develop/schemas/plugins.list.json)]:
```json
{
  "plugins": [
    {
      "name": "<pluginName>",
      "version": "<pluginVersion>",
      "icon": "<URL-to-plugin-icon"
    }
  ]
}
```


<a name="plugin-install"></a>
#### Installing new plugins:

```http
POST /plugins/install/:pluginName
```

**Path Parameters:**

* `pluginName`: name of plugin

Success Response [[Schema Reference](https://github.com/GochoMugo/docvy-server/tree/develop/schemas/plugins.install.json)]:
```json
{
  "installed": "<pluginName>"
}
```


<a name="plugin-uninstall"></a>
#### Uninstalling plugins:

```http
DELETE /plugins/uninstall/:pluginName
```

**Path Parameters:**

* `pluginName`: name of plugin

Success Response [[Schema Reference](https://github.com/GochoMugo/docvy-server/tree/develop/schemas/plugins.uninstall.json)]:
```json
{
  "uninstalled": "<pluginName>"
}
```


<a name="shutdown"></a>
#### Graceful Shutdown of Server:

```http
DELETE /stop/
```

Success Response [[Schema Reference](https://github.com/GochoMugo/docvy-server/tree/develop/schemas/stop.json)]:
```json
{
  "message": "acknowledged"
}
```


<a name="todo"></a>
## todo:

* [ ] test server responses with JSON Schema validation


<a name="license"></a>
## license:

__The MIT License (MIT)__

Copyright (c) 2015 GochoMugo <mugo@forfuture.co.ke>


[npm]:https://npmjs.com
[repo]:https://github.com/GochoMugo/docvy-server

