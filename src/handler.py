import sys

from gi.repository import GLib
import threading
import time

class Handler:
    #Constructor. Inicializamos la vista y el modelo.
    def __init__(self, v, m):
        self.view = v()
        self.model = m()
        self.view.connect(self)
    
    def progress_playing(self, id):
        while(not self.model.runhash[id]):            
            time.sleep(0.1)
            self.view.player.update_prog_bar(self.model.proghash[id])
        print("Change button")
        self.view.player.change_state()
        

    #Nota: Todas los metodos de una clase en python llevan como primer argumento a si misma
    def on_play_clicked(self, button):
        self.model.play(sys.argv[1])
        self.view.player.change_state()
        threading.Thread(target = self.progress_playing, args =(sys.argv[1],), daemon = True).start()
    
    def on_stop_clicked(self, button):
        self.model.stop(sys.argv[1])
