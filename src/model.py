import pyaudio
import wave
import sys
import threading
import time
import queue
import logging
import math

CHUNK = 1024

class PlayStream():
    def __init__(self, player, wav, poll, progr, name):
        self.stream = player.open(format = player.get_format_from_width(wav.getsampwidth()),
            channels = wav.getnchannels(), 
            rate=wav.getframerate(), 
            output=True)
        self.file = wav
        self.data = wav.readframes(CHUNK)
        self.poll = poll
        self.progr = progr
        self.name = name
    
    def play(self):
        #nota: b'' es el archivo final de un wav
        while (self.data != b'' and not self.poll[self.name]):
            self.stream.write(self.data)
            self.data = self.file.readframes(CHUNK)
            self.progr[self.name] = self.file.tell() / self.file.getnframes()
        #Indicamos en el hash que se ha acabado
        self.progr[self.name] = 0
        self.poll[self.name] = True

class Model:
    def __init__(self):
        self.p = pyaudio.PyAudio()
        #Tabla hash para guardar los estados de los threads que se ejecutan
        self.runhash = dict()
        self.proghash = dict()
    
    def create_playstream(self, wf, name):
        aud = PlayStream(self.p, wf, self.runhash, self.proghash, name)
        aud.play()

    def play(self, name):
        #Indicamos que el thread 'name' está running
        self.runhash[name] = False
        self.proghash[name] = 0
        
        #Iniciamos el thread
        wf = wave.open(name, 'rb')
        t = threading.Thread(target = self.create_playstream, args = (wf, name), daemon = True)
        
        t.start()

    def stop(self, name):
        self.runhash[name] = True
        self.proghash[name] = 0





