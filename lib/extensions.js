/**
* The Docvy Extensions Handler
*
* The MIT License (MIT)
* Copyright (c) 2015 GochoMugo <mugo@forfuture.co.ke>
*/


// built-in modules
var childProcess = require("child-process");
var path = require("path");


// module variables
var extensionsDirectory = path.join(process.env.HOME, "docvy", "extensions");


/**
* Loading an installed extension
*
* @param extensionName -- {String} name of the extension
* @return extensionModule {Module}
* @throw NotFoundExtensionError
*/
function loadExtension(extensionName) {
  try {
    return require(path.join(extensionsDirectory, extensionName));
  } catch (err) {
    throw new Error();
  }
}


/**
* Running an extension.
*
* @param data -- {String} file data
* @param callback -- {Function} call
