import * as sketch from 'sketch';

const AdbTool = context.scriptPath.split("/").slice(0, -2).join("/") + "/Resources/adb";

const {
  Image,
  UI
} = sketch;

/**
 * Run adb command to take screenshot
 *
 * @returns NSImage
 */
function runAdbScreenshot() {
  let file = runCommandline(AdbTool, ["exec-out", "screencap", "-p"]);
  return NSImage.alloc().initWithData_(file.readDataToEndOfFile());
}

/**
 * Run adb command to retrieve connected devices
 *
 * @returns NSString
 */
function runAdbDevices() {
  let file = runCommandline(AdbTool, ["devices"]);
  return NSString.alloc().initWithData_encoding(file.readDataToEndOfFile(), NSUTF8StringEncoding);
}

/**
 * Split adb devices result to count devices
 *
 * @returns NSInteger
 */
function getNbAdbDevices() {
  let adbDevices = runAdbDevices();
  return (adbDevices.split("\n").length - 3);
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
  var task = NSTask.alloc().init();

  // Pipe
  var pipe = NSPipe.alloc().init();

  // Redirect to pipe
  task.setStandardOutput(pipe);
  task.setStandardError(pipe);

  // Prepare command
  task.setLaunchPath(launchPath);
  task.setArguments(args);

  // Reader for response
  var file = pipe.fileHandleForReading();

  // Launch command
  task.launch();

  // Return handle
  return file;
}

/**
 * Insert image as new shape and add it to current page
 *
 * @param {*} context : The sketch context
 * @param {*} image : The image
 */
function insertImageAsNewShape(context, image) {

  const visibleContentRect = context.document.contentDrawView().visibleContentRect();

  const width = image.size().width;
  const height = image.size().height;
  const page = context.document.currentPage();

  const bitmap = new Image({
    parent: page,
    type: sketch.Types.Image,
    frame: {
      x: visibleContentRect.origin.x + (visibleContentRect.size.width - width) / 2,
      y: visibleContentRect.origin.y + (visibleContentRect.size.height - height) / 2,
      width: width,
      height: height,
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

  let selection = context.selection;

  if (selection.isEmpty) {
    UI.message("Select at least one layer");
  } else {
    selection.forEach(function (layer) {
      if (!layer.style().firstEnabledFill()) {
        layer.style().addStylePartOfType(0);
      }

      let fill = layer
        .style()
        .fills()
        .firstObject();
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
  let nbAdbDevices = getNbAdbDevices();

  if (nbAdbDevices > 0) {
    return true;
  } else {
    UI.alert("Android screenshot", "You must have an Android device connected over USB with usb/debugging activated");
    return false;
  }
}

let fillAndroidScreenshot = (context) => {
  if (hasAndroidDeviceConnected()) {
    let image = runAdbScreenshot();
    fillSelectedShapesWithImage(context, image);
  }
}

let insertAndroidScreenshot = (context) => {
  if (hasAndroidDeviceConnected()) {
    let image = runAdbScreenshot();
    insertImageAsNewShape(context, image);
  }
}

export {
  fillAndroidScreenshot,
  insertAndroidScreenshot
}