var that = this;
function __skpm_run (key, context) {
  that.context = context;

var exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/screenshot.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/screenshot.js":
/*!***************************!*\
  !*** ./src/screenshot.js ***!
  \***************************/
/*! exports provided: fillAndroidScreenshot, insertAndroidScreenshot */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fillAndroidScreenshot", function() { return fillAndroidScreenshot; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "insertAndroidScreenshot", function() { return insertAndroidScreenshot; });
/* harmony import */ var sketch__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! sketch */ "sketch");
/* harmony import */ var sketch__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(sketch__WEBPACK_IMPORTED_MODULE_0__);

var AdbTool = context.scriptPath.split("/").slice(0, -2).join("/") + "/Resources/adb";
var Image = sketch__WEBPACK_IMPORTED_MODULE_0__["Image"],
    UI = sketch__WEBPACK_IMPORTED_MODULE_0__["UI"];
/**
 * Run adb command to take screenshot
 *
 * @returns NSImage
 */

function runAdbScreenshot() {
  var file = runCommandline(AdbTool, ["exec-out", "screencap", "-p"]);
  return NSImage.alloc().initWithData_(file.readDataToEndOfFile());
}
/**
 * Run adb command to retrieve connected devices
 *
 * @returns NSString
 */


function runAdbDevices() {
  var file = runCommandline(AdbTool, ["devices"]);
  return NSString.alloc().initWithData_encoding(file.readDataToEndOfFile(), NSUTF8StringEncoding);
}
/**
 * Split adb devices result to count devices
 *
 * @returns NSInteger
 */


function getNbAdbDevices() {
  var adbDevices = runAdbDevices();
  return adbDevices.split("\n").length - 3;
}
/**
 * Run system command
 *
 * @param {*} launchPath : Command path
 * @param {*} args : Arguments
 * @returns NSFileHandle
 */


function runCommandline(launchPath, args) {
  // Task
  var task = NSTask.alloc().init(); // Pipe

  var pipe = NSPipe.alloc().init(); // Redirect to pipe

  task.setStandardOutput(pipe);
  task.setStandardError(pipe); // Prepare command

  task.setLaunchPath(launchPath);
  task.setArguments(args); // Reader for response

  var file = pipe.fileHandleForReading(); // Launch command

  task.launch(); // Return handle

  return file;
}
/**
 * Insert image as new shape and add it to current page
 *
 * @param {*} context : The sketch context
 * @param {*} image : The image
 */


function insertImageAsNewShape(context, image) {
  var visibleContentRect = context.document.contentDrawView().visibleContentRect();
  var width = image.size().width;
  var height = image.size().height;
  var page = context.document.currentPage();
  var bitmap = new Image({
    parent: page,
    type: sketch__WEBPACK_IMPORTED_MODULE_0__["Types"].Image,
    frame: {
      x: visibleContentRect.origin.x + (visibleContentRect.size.width - width) / 2,
      y: visibleContentRect.origin.y + (visibleContentRect.size.height - height) / 2,
      width: width,
      height: height
    },
    image: image,
    name: "Android screenshot"
  });
  UI.message("Screenshot successful");
}
/**
 * Fill selected shapes with the image
 *
 * @param {*} context : The sketch context
 * @param {*} image : The image
 */


function fillSelectedShapesWithImage(context, image) {
  var selection = context.selection;

  if (selection.isEmpty) {
    UI.message("Select at least one layer");
  } else {
    selection.forEach(function (layer) {
      if (!layer.style().firstEnabledFill()) {
        layer.style().addStylePartOfType(0);
      }

      var fill = layer.style().fills().firstObject();
      fill.setFillType(4);
      fill.setImage(MSImageData.alloc().initWithImage(image));
      fill.setPatternFillType(1);
    });
    UI.message("Screenshot successful");
  }
}
/**
 * Check if android device is connected
 *
 * @returns Boolean
 */


function hasAndroidDeviceConnected() {
  var nbAdbDevices = getNbAdbDevices();

  if (nbAdbDevices > 0) {
    return true;
  } else {
    UI.alert("Android screenshot", "You must have an Android device connected over USB with usb/debugging activated");
    return false;
  }
}

var fillAndroidScreenshot = function fillAndroidScreenshot(context) {
  if (hasAndroidDeviceConnected()) {
    var image = runAdbScreenshot();
    fillSelectedShapesWithImage(context, image);
  }
};

var insertAndroidScreenshot = function insertAndroidScreenshot(context) {
  if (hasAndroidDeviceConnected()) {
    var image = runAdbScreenshot();
    insertImageAsNewShape(context, image);
  }
};



/***/ }),

/***/ "sketch":
/*!*************************!*\
  !*** external "sketch" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("sketch");

/***/ })

/******/ });
  if (key === 'default' && typeof exports === 'function') {
    exports(context);
  } else {
    exports[key](context);
  }
}
that['insertAndroidScreenshot'] = __skpm_run.bind(this, 'insertAndroidScreenshot');
that['onRun'] = __skpm_run.bind(this, 'default');
that['fillAndroidScreenshot'] = __skpm_run.bind(this, 'fillAndroidScreenshot')

//# sourceMappingURL=screenshot.js.map