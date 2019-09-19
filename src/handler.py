import sys

from gi.repository import GLib
import threading
import time
from tkinter import *
from tkinter.filedialog import askopenfilename
from .view import TrackPlayer

class PlayerHandler:
    #Handler para cada uno de los reproductores de música. Estes se ejecutan en un Thread separado.
    #Necesita una vista propia, un modelo compartido entre handlers, un archivo (o lista de archivos) y un tinkerer
    def __init__ (self, view, model, file, tinkerer):
        print("* Creating new player handler...")
        self.view = view(file)
        self.model = model
        self.view.connect(self.on_play_clicked, self.on_stop_clicked, self.on_files_clicked)
        self.file = file
    
    #Función que actualiza la barra de progreso de reproducción. Se ejecuta en un thread aparte.
    #Utiliza los hash de archivos del modelo para comprobar el progreso y si se está ejecutando o no
    def update_progress(self):
        while (not self.model.runhash[self.file]):
            time.sleep(0.05)
            self.view.update_prog_bar(self.model.proghash[self.file])
        self.view.change_state()
    
    #Callback del boton 'PLAY'
    def on_play_clicked(self, button):
        self.model.play(self.file)
        self.view.change_state()
        threading.Thread(target = self.update_progress, args =(), daemon = True).start()
    
    #Callback del boton 'STOP'
    def on_stop_clicked(self, button):
        self.model.stop(self.file)
    
    #Callback del boton 'ARCHIVOS'
    def on_files_clicked(self, button):
        self.file = askopenfilename()

class Handler:
    #Handler principal de la aplicación
    def __init__(self, v, m):
        self.view = v()
        self.model = m()
        self.view.connect(self)
        self.tk = Tk().withdraw()
        self.file = None

    #Callback de añadir reproductor. Crea un nuevo reproductor y actualiza la vista.
    def on_add_player_clicked(self, button):
        track = askopenfilename()
        player_handler = PlayerHandler(TrackPlayer, self.model, track, self.tk)
        self.view.add_music_player(player_handler.view.track_player, player_handler.file)