# sensor-project

Web app to display current temperature and humidity of the room with Raspberry Pi and a temperature sensor

Notes:

To fix .gitignore issue:
https://stackoverflow.com/questions/32401387/git-add-adding-ignored-files/32545286

Basically when I created .gitignore file with 'echo "node_modules" >> .gitignore' in PowerShell on Windows, the file have been created with a different encoding then UTF-8. After changing the encoding for .gitignore on NotePad++ the issue was fixed and on VSCode the ignoring folder was recognised.  
