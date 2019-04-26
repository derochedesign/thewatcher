import serial
import json

arduino = serial.Serial('/dev/cu.usbmodem14101', 9600, timeout=.3)

while True:
    data = arduino.readline()[:-2] #the last bit gets rid of the new-line chars
    if data:
        print(data)

        with open('public/data/stepping.json', 'w') as outfile:
            outfile.write(json.dumps(''.join(data)).replace('"', '').replace('\\', '"'))
