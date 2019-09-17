import pyaudio
import wave
import sys
import threading
import time

CHUNK = 1024

class Model:
    def __init__(self):
        self.p = pyaudio.PyAudio()

    def playAudio(self, wf):
        stream = self.p.open(format=self.p.get_format_from_width(wf.getsampwidth()), channels=wf.getnchannels(), rate=wf.getframerate(), output=True)
        data = wf.readframes(CHUNK)
        #Enviamos al stream de audio abierto los datos que se estan leyendo
        while data != '':
            stream.write(data)
            data = wf.readframes(CHUNK)

        stream.stop_stream()
        stream.close()

    def play(self, name):
        wf = wave.open(name, 'rb')
        #Empezamos la reproducción en un nuevo thread
        t = threading.Thread(target=self.playAudio, args=(wf,), daemon=True)
        t.start()







