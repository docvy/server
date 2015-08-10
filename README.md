
# docvy-server

> The Docvy Server

[![node](https://img.shields.io/node/v/docvy-server.svg?style=flat-square)](https://www.npmjs.com/package/docvy-server) [![npm](https://img.shields.io/npm/v/docvy-server.svg?style=flat-square)](https://www.npmjs.com/package/docvy-server) [![Travis](https://img.shields.io/travis/docvy/server.svg?style=flat-square)](https://travis-ci.org/docvy/server) [![Gemnasium](https://img.shields.io/gemnasium/docvy/server.svg?style=flat-square)](https://gemnasium.com/docvy/server) [![Coveralls](https://img.shields.io/coveralls/docvy/server.svg?style=flat-square)](https://coveralls.io/github/docvy/server?branch=master)


## table of contents:

* [installation](#installation)
* [terminal usage](#terminal)
* [programmatic usage](#programmatic)
* [API endpoints](#api)
* [todo](#todo)
* [license](#license)


<a name="installation"></a>
## installation:

Using [npm][npm]:

```bash
⇒ npm install docvy-server
```


## usage:

This component may be used programmatically, as in the docvy application, or from the terminal as a stand-alone application.


<a name="terminal"></a>
### terminal usage:

Help information for terminal usage:

```bash
⇒ docvy-server

  docvy-server: The Docvy Server

      H, help        show this help information
      V, version     show version information
      s, start       start server
      t, status      show status of server
      x, stop        stop server

  See https://github.com/docvy/app for feature requests and bug reports
```

Starting application:

```bash
⇒ docvy-server start --port=9432 --attach
```

Enabling debug output:

```bash
⇒ docvy-server start --debug
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

See [query parameters](https://github.com/forfutureLLC/svc-fbr#parameters).


<a name="files"></a>
#### Reading files:

```http
GET /file/
```

See [query parameters](https://github.com/forfutureLLC/svc-fbr#parameters).

**Also:**

* `expects` (Array[String]): array of content-type to return the data in

Success Response [[Schema Reference](https://raw.githubusercontent.com/docvy/server/develop/schemas/file.json)]:
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

Success Response [[Schema Reference](https://raw.githubusercontent.com/docvy/server/develop/schemas/plugins.list.json)]:
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

Success Response [[Schema Reference](https://raw.githubusercontent.com/docvy/server/develop/schemas/plugins.install.json)]:
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

Success Response [[Schema Reference](https://raw.githubusercontent.com/docvy/server/develop/schemas/plugins.uninstall.json)]:
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

Success Response [[Schema Reference](https://raw.githubusercontent.com/docvy/server/develop/schemas/stop.json)]:
```json
{
  "message": "acknowledged"
}
```


<a name="license"></a>
## license:

__The MIT License (MIT)__

Copyright (c) 2015 Forfuture LLC <we@forfuture.co.ke> <br/>
Copyright (c) 2015 GochoMugo <mugo@forfuture.co.ke>


[npm]:https://npmjs.com
[repo]:https://github.com/docvy/server
