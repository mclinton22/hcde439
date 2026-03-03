const BAUD_RATE = 9600; // This should match the baud rate in your Arduino sketch

let port, connectBtn, ledBtn; // Declare global variables

const led_ON = "1"; // The value we will send to the Arduino to turn the LED on
const led_OFF = "0"; // The value we will send to the Arduino to turn the LED off

let ledOn = false; // track current LED state

function setup() {
  setupSerial(); // Run our serial setup function (below)

  // Create a canvas that is the size of our browser window.
  // windowWidth and windowHeight are p5 variables
  createCanvas(windowWidth, windowHeight);

  // p5 text settings. BOLD and CENTER are constants provided by p5.
  // See the "Typography" section in the p5 reference: https://p5js.org/reference/
  textFont("system-ui", 50);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);

  // create LED toggle button below connect button
  ledBtn = createButton("Toggle LED");
  ledBtn.position(5, 35);
  ledBtn.mouseClicked(ledBtnClicked);
}

let path = []; // store past coordinates

function draw() {
  const portIsOpen = checkPort(); // Check whether the port is open (see checkPort function below)
  if (!portIsOpen) return; // If the port is not open, exit the draw loop

  let str = port.readUntil("\n"); // Read from the port until the newline
  if (str.length == 0) return; // If nothing is read, return

  // Arduino will send two comma-separated values: e.g. "512,256"
  const parts = str.trim().split(","); // split the string into parts based on the comma
  if (parts.length < 2) return; // not enough data

  // parse the two coordinates and map them to the canvas
  const rawX = Number(parts[0]);
  const rawY = Number(parts[1]);
  // map to the window size
  const x = map(rawX, 0, 1023, 0, width);
  const y = map(rawY, 0, 1023, 0, height);

  // add current position to path
  path.push({x, y});

  // draw a circle continuously at the current position
  background("white");
  fill("pink");
  noStroke();
  for (let p of path) {
    circle(p.x, p.y, 100);
  }
}

// checks if led is clicked, and allow toggle
function ledBtnClicked() {
  if (!port.opened()) {
    return; // port is not open, do nothing when the LED button is clicked
  }

  if (ledOn) { // if it's on - turn off
    port.write(led_OFF + "\n");
    ledBtn.html("Turn LED On");
  } else { // if it's off - turn on
    port.write(led_ON + "\n");
    ledBtn.html("Turn LED Off");
  }

  ledOn = !ledOn;
}

// Three helper functions for managing the serial connection.

function setupSerial() {
  port = createSerial();

  // Check to see if there are any ports we have used previously
  let usedPorts = usedSerialPorts();
  if (usedPorts.length > 0) {
    // If there are ports we've used, open the first one
    port.open(usedPorts[0], BAUD_RATE);
  } else {
    // no previously used port – you can explicitly specify COM5 here if needed
    //port.open("COM5", BAUD_RATE);
  }

  // create a connect button
  connectBtn = createButton("Connect to Arduino");
  connectBtn.position(5, 5); // Position the button in the top left of the screen.
  connectBtn.mouseClicked(onConnectButtonClicked); // When the button is clicked, run the onConnectButtonClicked function
}

function checkPort() {
  if (!port.opened()) {
    // If the port is not open, change button text
    connectBtn.html("Connect to Arduino");
    // Set background to gray
    background("gray");
    return false;
  } else {
    // Otherwise we are connected
    connectBtn.html("Disconnect");
    return true;
  }
}

function onConnectButtonClicked() {
  // When the connect button is clicked
  if (!port.opened()) {
    // If the port is not opened, we open it
    port.open(BAUD_RATE);
  } else {
    // Otherwise, we close it!
    port.close();
  }
}
