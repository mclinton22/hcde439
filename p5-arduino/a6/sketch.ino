int x = A0;    
int y = A1;
int xval = 0;
int yval = 0;
int LED = 12;

void setup() {
  Serial.begin(9600);
  pinMode(LED, OUTPUT);
}

void loop() {
  xval = analogRead(x);
  yval = analogRead(y);

  Serial.print(xval);
  Serial.print(",");
  Serial.println(yval);

  if (Serial.available() > 0) {
    char ledState = Serial.read();
    
    if (ledState == '1') {
      digitalWrite(LED, HIGH);
    } else if (ledState == '0') {
      digitalWrite(LED, LOW);
    }
  }

  delay(15);
}