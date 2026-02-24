const BAUD_RATE = 9600;

let port, connectBtn;
let isMousePressed = 0;

function setup() {
  setupSerial();
  createCanvas(windowWidth, windowHeight);
  createCanvas(1000, 500);
  background(220);
}

function draw() {
  const portIsOpen = checkPort();
  if (!portIsOpen) return;

  // Read the Arduino's echo
  let str = port.readUntil("\n");
  if (str.length > 0) {
    isMousePressed = Number(str.trim());
  }

  // Draw the UI — background gets bluer with brightness
  port.write(isMousePressed);
  if (mouseIsPressed) {
      fill("green");
  } else {
      fill("red");
  }
  rect(mouseX, mouseY, 55, 55);
}

// --- Serial helpers ---

function setupSerial() {
  port = createSerial();

  let usedPorts = usedSerialPorts();
  if (usedPorts.length > 0) {
    port.open(usedPorts[0], BAUD_RATE);
  }

  connectBtn = createButton("Connect to Arduino");
  connectBtn.position(5, 5);
  connectBtn.mouseClicked(onConnectButtonClicked);
}

function checkPort() {
  if (!port.opened()) {
    connectBtn.html("Connect to Arduino");
    background("gray");
    return false;
  } else {
    connectBtn.html("Disconnect");
    return true;
  }
}

function onConnectButtonClicked() {
  if (!port.opened()) {
    port.open(BAUD_RATE);
  } else {
    port.close();
  }
}