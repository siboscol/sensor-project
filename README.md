# Sensor-Project

Web app to display current temperature and humidity of the room with Raspberry Pi and a temperature sensor

## Setup

Connect the sensor according to following diagram
![Connecting DHT22 diagram](Wiring_diagram_for_connecting_the_DHT22_sensor_to_the_RPi.jpg "Wiring diagram for connecting the DHT22 to the RPI")

Install project dependencies

```
cd server
npm install
```

Run the app
```
cd server
node index.js
```

Notes:

To fix .gitignore issue:
https://stackoverflow.com/questions/32401387/git-add-adding-ignored-files/32545286

Basically when I created .gitignore file with 'echo "node_modules" >> .gitignore' in PowerShell on Windows, the file have been created with a different encoding then UTF-8. After changing the encoding for .gitignore on NotePad++ the issue was fixed and on VSCode the ignoring folder was recognised.  
