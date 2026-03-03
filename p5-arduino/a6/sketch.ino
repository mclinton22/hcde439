int x = A0;
int y = A1;
int xval = 0;
int yval = 0;
int LED = 12;

void setup() {
  Serial.begin(9600); // setup serial
  pinMode(LED, OUTPUT); // setup LED pin
}

void loop() {
  // read the x and y values from the joystick
  xval = analogRead(x);
  yval = analogRead(y);

  // send the x and y values to the serial port - separated by a comma
  Serial.print(xval);
  Serial.print(",");
  Serial.println(yval);

  // if we get data from the serial port, check if for 0 or 1 to turn LED on or off
  if (Serial.available() > 0) {
    char ledState = Serial.read();

    // if serial sent 1, turn on LED
    if (ledState == '1') {
      digitalWrite(LED, HIGH);
      // if serial sent 0, turn off LED
    } else if (ledState == '0') {
      digitalWrite(LED, LOW);
    }
  }

  // add a delay to not overwhelm the port
  delay(25);
}