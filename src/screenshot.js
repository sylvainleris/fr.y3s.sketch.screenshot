import * as ui from 'sketch/ui';

const AdbTool = context.scriptPath.split("/").slice(0, -2).join("/") + "/Resources/adb"

/**
 * Run adb command to take screenshot
 *
 * @returns NSImage
 */
function runAdbScreenshot() {
  let file = runCommandline(AdbTool, ["exec-out", "screencap", "-p"])
  return NSImage.alloc().initWithData_(file.readDataToEndOfFile())
}

/**
 * Run adb command to retrieve connected devices
 *
 * @returns NSString
 */
function runAdbDevices() {
  let file = runCommandline(AdbTool, ["devices"])
  return NSString.alloc().initWithData_encoding(file.readDataToEndOfFile(), NSUTF8StringEncoding)
}

/**
 * Split adb devices result to count devices
 *
 * @returns NSInteger
 */
function getNbAdbDevices() {
  let adbDevices = runAdbDevices()
  return adbDevices.componentsSeparatedByCharactersInSet(NSCharacterSet.newlineCharacterSet()).count() - 3
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
  task.setLaunchPath(launchPath)
  task.setArguments(args)

  // Reader for response
  var file = pipe.fileHandleForReading()

  // Launch command
  task.launch()

  // Return handle
  return file
}

/**
 * Insert image as new shape and add it to current page
 *
 * @param {*} context : The sketch context
 * @param {*} image : The image
 */
function insertImageAsNewShape(context, image) {

  // Visible rect
  const visibleContentRect = context.document.contentDrawView().visibleContentRect()
  const width = image.size().width
  const height = image.size().height

  // Create rect into center of the visible content rect
  const rect = NSMakeRect(
    visibleContentRect.origin.x + (visibleContentRect.size.width - width) / 2,
    visibleContentRect.origin.y + (visibleContentRect.size.height - height) / 2,
    width,
    height
  )

  // Create new shape
  const shape = MSRectangleShape.alloc().initWithFrame(rect)

  // Add style type 0 to shape styles
  shape.style().addStylePartOfType(0)

  // Retrieve previous addded fill
  let fill = shape.style()
    .fills()
    .firstObject();

  // Set fill type to bitmap
  fill.setFillType(4);

  // Set image to fill
  fill.setImage(MSImageData.alloc().initWithImage(image));

  // Update shape name
  shape.setName("Android screenshot")

  // Add shape to current page
  context.document.currentPage().addLayer(shape)

  ui.message("Screenshot successful")
}

/**
 * Fill selected shapes with the image
 *
 * @param {*} context : The sketch context
 * @param {*} image : The image
 */
function fillSelectedShapesWithImage(context, image) {

  let selection = context.selection

  if (selection.count() == 0) {
    ui.message("Select at least one layer");
  } else {
    for (let i = 0; i < selection.count(); i++) {
      let layer = selection[i]
      if (!layer.style().firstEnabledFill()) {
        shape.style().addStylePartOfType(0)
      }

      let fill = layer
        .style()
        .fills()
        .firstObject();
      fill.setFillType(4);
      fill.setImage(MSImageData.alloc().initWithImage(image));
      fill.setPatternFillType(1);
    }
    ui.message("Screenshot successful")
  }
}

let fillAndroidScreenshot = (context) => {

  let nbAdbDevices = getNbAdbDevices()

  if (nbAdbDevices > 0) {
    let image = runAdbScreenshot()
    fillSelectedShapesWithImage(context, image)
  } else {
    ui.alert("Android screenshot", "You must have an Android device connected over USB with usb/debugging activated")
  }
}

let insertAndroidScreenshot = (context) => {

  let nbAdbDevices = getNbAdbDevices()

  if (nbAdbDevices > 0) {
    let image = runAdbScreenshot()
    insertImageAsNewShape(context, image)
  } else {
    ui.alert("Android screenshot", "You must have an Android device connected over USB with usb/debugging activated")
  }
}

export {
  fillAndroidScreenshot,
  insertAndroidScreenshot
}